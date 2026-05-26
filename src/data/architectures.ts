/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SpecSection {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  language: 'typescript' | 'prisma' | 'bash' | 'json' | 'yaml';
}

export const ARCHITECTURES: SpecSection[] = [
  {
    id: 'monorepo-structure',
    title: '1. Monorepo Architecture File-Tree',
    category: 'Architecture',
    summary: 'A scalable, production-grade monorepo structure designed with Turborepo or pnpm workspaces.',
    language: 'bash',
    content: `nexra-erp/
├── apps/
│   ├── web/                     # React Frontend SPA (Vite + TypeScript)
│   │   ├── src/
│   │   │   ├── components/      # UI components (shadcn/Radix)
│   │   │   ├── features/        # Feature folder architecture (ledgers, tax, payroll)
│   │   │   ├── routes/          # Dynamic dashboard & portal routes
│   │   │   └── store/           # Zustand client state managers
│   │   └── package.json
│   ├── api/                     # Express.js / Fastified REST Gateway
│   │   ├── src/
│   │   │   ├── controllers/     # Controller handlers
│   │   │   ├── middlewares/     # Auth, RBAC, Rate-Limiting, Audit-Logger
│   │   │   ├── services/        # Decoupled business engine orchestration
│   │   │   └── entrypoint.ts    # Server engine
│   │   └── package.json
│   └── admin/                   # Admin Operations Dashboard (Internal Operations & Audits)
├── packages/
│   ├── shared/                  # Common TypeScript validation schemas (Zod helper utilities)
│   ├── ui/                      # Shared design system components
│   ├── accounting-engine/       # Hardened core ledger engine & posting routines
│   ├── tax-engine/              # Pluggable modular tax registry & VAT/GST rates resolver
│   ├── compliance-engine/       # Localized regulatory checks (SAF-T, Factur-X/ZUGFeRD, PEPPOL)
│   ├── i18n-engine/             # Multi-numeral translations & locale converters
│   └── payroll-engine/          # Country-specific superannuation & tax withholding schemes
├── pnpm-workspace.yaml          # Pnpm workspaces coordination
├── turbo.json                   # Turborepo caching/build orchestration
└── package.json                 # Global development workspace configuration`
  },
  {
    id: 'database-schema',
    title: '2. PostgreSQL Schema & Database Spec (Prisma ORM)',
    category: 'Database',
    summary: 'Strict audit-safe database layout with immutability enforcement, indices, and ledger tracing.',
    language: 'prisma',
    content: `// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Company {
  id                    String              @id @default(uuid())
  name                  String
  taxRegistrationNumber String              @unique
  region                String              // 'EU' | 'UK' | 'US' | 'IN' | 'JP' | 'AU' etc.
  baseCurrency          String              @default("USD")
  createdAt             DateTime            @default(now())
  updatedAt             DateTime            @updatedAt
  
  // Relations
  users                 UserCompany[]
  accounts              ChartOfAccount[]
  journals              JournalEntry[]
  invoices              Invoice[]
  auditLogs             AuditLog[]
}

model ChartOfAccount {
  id           String         @id @default(uuid())
  companyId    String
  code         String         // e.g., "1100" (Cash), "2200" (VAT liability)
  name         String
  type         AccountType    // ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE
  currency     String         @default("USD")
  isLocked     Boolean        @default(false)
  balance      Decimal        @default(0.0000) @db.Decimal(20, 4)
  
  company      Company        @relation(fields: [companyId], references: [id])
  journalLines JournalLine[]

  @@unique([companyId, code])
  @@index([companyId, type])
}

enum AccountType {
  ASSET
  LIABILITY
  EQUITY
  REVENUE
  EXPENSE
}

model JournalEntry {
  id            String         @id @default(uuid())
  companyId     String
  date          DateTime
  reference     String         // e.g., Invoice-4458 or Journal-Dec
  description   String
  isPosted      Boolean        @default(false)
  postedAt      DateTime?
  postedByUserId String?
  isLocked      Boolean        @default(false) // Set true after accounting lock
  fiscalPeriod  String         // e.g., "2026-Q2"
  
  company       Company        @relation(fields: [companyId], references: [id])
  lines         JournalLine[]
  auditTrail    LedgerAudit[]

  @@index([companyId, date])
  @@index([companyId, fiscalPeriod])
}

model JournalLine {
  id             String         @id @default(uuid())
  journalEntryId String
  accountId      String
  debit          Decimal        @default(0.0000) @db.Decimal(20, 4)
  credit         Decimal        @default(0.0000) @db.Decimal(20, 4)
  currency       String         @default("USD")
  exchangeRate   Decimal        @default(1.0000) @db.Decimal(12, 6)
  
  // Local reporting values in base currency
  localDebit     Decimal        @default(0.0000) @db.Decimal(20, 4)
  localCredit    Decimal        @default(0.0000) @db.Decimal(20, 4)

  journalEntry   JournalEntry   @relation(fields: [journalEntryId], references: [id], onDelete: Cascade)
  account        ChartOfAccount @relation(fields: [accountId], references: [id])

  @@index([journalEntryId])
  @@index([accountId])
}

model LedgerAudit {
  id             String         @id @default(uuid())
  journalEntryId String
  action         String         // POST / VOID / CORRECT
  timestamp      DateTime       @default(now())
  payload        String         // Immutable JSON backup of the lines
  performedBy    String
  hash           String         // Cryptographic integrity proof chain
  
  journalEntry   JournalEntry   @relation(fields: [journalEntryId], references: [id])
}`
  },
  {
    id: 'tax-engine-design',
    title: '3. Core Plug-In Tax Engine SDK Framework',
    category: 'Tax Engine',
    summary: 'Pluggable module layout structure that decouples localized calculation logic from the core general ledger.',
    language: 'typescript',
    content: `// packages/tax-engine/src/TaxPluginRegistry.ts
import { Invoice, TaxRateInfo, TargetRegion } from './types';

export interface TaxCalculationResult {
  taxableBasis: number;
  taxCalculated: number;
  components: Array<{
    name: string;
    rate: number;
    amount: number;
    hsnSacCode?: string; // e.g. India GST codes
    localAccountCode: string; // Dynamic target ledger assignment (e.g., Output VAT)
  }>;
  reverseChargeApplicable: boolean;
  complianceValidationErrors: string[];
}

export interface ITaxPlugin {
  region: TargetRegion;
  version: string;
  name: string;
  
  testConnection?: () => Promise<boolean>;
  
  calculateTax: (
    items: Array<{ quantity: number; unitPrice: number; taxRateCode: string }>,
    clientProfile: { taxId: string; addressPostalCode: string; stateProv: string; isB2B: boolean }
  ) => Promise<TaxCalculationResult>;

  validateInvoiceCompliance: (invoice: Invoice) => Promise<{
    compliant: boolean;
    missingFields: string[];
    eInvoiceXMLPayload?: string; // Validated PEPPOL UBL or localized format (e-Faktur, IRN)
  }>;
}

export class TaxPluginRegistry {
  private static plugins = new Map<TargetRegion, ITaxPlugin>();

  public static register(plugin: ITaxPlugin) {
    this.plugins.set(plugin.region, plugin);
    console.log('[Tax Engine Registry] Registered plugin: ' + plugin.name + ' v' + plugin.version);
  }

  public static getPlugin(region: TargetRegion): ITaxPlugin {
    const plugin = this.plugins.get(region);
    if (!plugin) {
      throw new Error(\`Unsupported tax region configuration: \${region}\`);
    }
    return plugin;
  }
}`
  },
  {
    id: 'i18n-architecture',
    title: '4. Absolute Unicode & Multilingual i18n System',
    category: 'Internationalization',
    summary: 'Localized numeral formatters, date localizers, address models, and support for RTL scripts.',
    language: 'typescript',
    content: `// packages/i18n-engine/src/LocaleEngine.ts
export type NumericNumeralSystem = 'Standard' | 'Arabic' | 'Devanagari' | 'Bengali' | 'JapaneseFullWidth';

export interface RegionalFormatConfig {
  locale: string;
  currency: string;
  direction: 'ltr' | 'rtl';
  numeralSystem: NumericNumeralSystem;
  dateFormat: string;
}

// Map numeral scales for multi-locale rendering
const NUMERALS_MAP: Record<NumericNumeralSystem, string[]> = {
  Standard: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  Arabic: ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'],
  Devanagari: ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'], // Hindi
  Bengali: ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'],
  JapaneseFullWidth: ['０', '１', '２', '３', '４', '５', '６', '７', '８', '９']
};

export function convertNumerals(numStr: string, targetSystem: NumericNumeralSystem): string {
  if (targetSystem === 'Standard') return numStr;
  const digits = NUMERALS_MAP[targetSystem];
  return numStr.replace(/\\d/g, (d) => digits[parseInt(d, 10)]);
}

export class RegionalFormatter {
  private config: RegionalFormatConfig;

  constructor(config: RegionalFormatConfig) {
    this.config = config;
  }

  public formatCurrency(amount: number): string {
    const baseFormatted = new Intl.NumberFormat(this.config.locale, {
      style: 'currency',
      currency: this.config.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(amount);
    
    return convertNumerals(baseFormatted, this.config.numeralSystem);
  }

  public formatDate(dateObj: Date): string {
    // Option for Japanese fiscal era or standard
    const formattedDate = new Intl.DateTimeFormat(this.config.locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(dateObj);
    return convertNumerals(formattedDate, this.config.numeralSystem);
  }

  public isRtl(): boolean {
    return this.config.direction === 'rtl';
  }
}`
  },
  {
    id: 'accounting-ledger-verification',
    title: '5. Immutable Ledger Double-Entry Enforcement Routine',
    category: 'Accounting Engine',
    summary: 'Core ledger posting validations preventing imbalanced debits, unlocking locked periods, and managing immutable audits.',
    language: 'typescript',
    content: `// packages/accounting-engine/src/ledgerPoster.ts
import { JournalEntry, JournalLine } from './types';

export class BalancingLedgerEngine {
  
  // Immutability validation routine before executing DB writes
  public static validateAndBalance(entry: JournalEntry): {
    isValid: boolean;
    difference: number;
    errors: string[];
  } {
    const errors: string[] = [];
    if (entry.isLocked) {
      errors.push('Cannot modify nor post to a locked accounting ledger period.');
    }
    
    const lines = entry.lines;
    if (lines.length === 0) {
      errors.push('Journal entries must contain at least 1 credit and 1 debit line.');
    }

    let totalDebitBase = 0;
    let totalCreditBase = 0;

    for (const line of lines) {
      if (line.debit < 0 || line.credit < 0) {
        errors.push('Negatives Debit/Credit values are prohibited. Use contra-ledger lines.');
      }
      
      // Convert transaction value directly through multi-currency engine
      const baseDebit = line.debit * line.exchangeRate;
      const baseCredit = line.credit * line.exchangeRate;
      
      totalDebitBase += baseDebit;
      totalCreditBase += baseCredit;
    }

    // High fidelity accounting epsilon
    const diff = Math.abs(totalDebitBase - totalCreditBase);
    const balanceEpsilon = 0.0001; 

    if (diff > balanceEpsilon) {
      errors.push(\`Unbalanced accounting ledger posting! Debits (\${totalDebitBase}) must match Credits (\${totalCreditBase}). Out of balance: \${diff}\`);
    }

    return {
      isValid: errors.length === 0,
      difference: diff,
      errors
    };
  }

  public static signLedgerHash(entry: JournalEntry, previousHash: string): string {
    // Generates a tamper-proof SHA-256 block hash for the audit ledger
    const crypto = require('crypto');
    const content = JSON.stringify({
      id: entry.id,
      date: entry.date,
      ref: entry.reference,
      lines: entry.lines.map(l => ({ a: l.accountCode, d: l.debit, c: l.credit }))
    });
    return crypto.createHmac('sha256', process.env.LEDGER_SIG_SECRET || 'nexra-audit')
                 .update(content + previousHash)
                 .digest('hex');
  }
}`
  },
  {
    id: 'security-rbac',
    title: '6. RBAC Middleware & Security Protections',
    category: 'Security',
    summary: 'Enterprise middleware pattern handling authorization scopes, audit telemetry triggers, and defense.',
    language: 'typescript',
    content: `// apps/api/src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthContextRequest extends Request {
  user?: {
    userId: string;
    roles: string[]; // ['LedgerAide', 'TaxReporter', 'CompOfficer', 'SuperAdmin']
    companyId: string;
  };
}

export function authorizeRole(requiredRoles: string[]) {
  return (req: AuthContextRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or malformed Authorization header' });
      }

      const token = authHeader.split(' ')[1];
      const payload = jwt.verify(token, process.env.JWT_SECRET_KEY!) as any;
      req.user = payload;

      // Role Based Access Check
      const hasPermission = req.user!.roles.some(role => requiredRoles.includes(role));
      if (!hasPermission) {
        // Trigger Security Alert Telemetry
        console.warn('[SECURITY ALERT] User ' + req.user.userId + ' attempted illegal access to RBAC action.');
        return res.status(403).json({ error: 'Access Denied: Insufficient authorization role scope' });
      }

      next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired accounting authentication token' });
    }
  };
}`
  },
  {
    id: 'saf-t-peppol',
    title: '7. Compliance Integration Workflows (SAF-T & PEPPOL Gateway)',
    category: 'Compliance',
    summary: 'Specifications for exporting OECD compliant SAF-T JSON/XML datasets and streaming PEPPOL invoices.',
    language: 'typescript',
    content: `// packages/compliance-engine/src/peppolExporter.ts
import { Invoice } from './types';

export class ComplianceGateway {
  
  // Generates PEPPOL UBL 2.1 Standard XML Payload
  public static generatePEPPOL_UBL_XML(invoice: Invoice): string {
    const namespaces = [
      'xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"',
      'xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"',
      'xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"'
    ].join(' ');

    const itemsXML = invoice.items.map((item, index) => \`
    <cac:InvoiceLine>
      <cbc:ID>\${index + 1}</cbc:ID>
      <cbc:InvoicedQuantity unitCode="EA">\${item.quantity}</cbc:InvoicedQuantity>
      <cbc:LineExtensionAmount currencyID="\${invoice.currency}">\${(item.quantity * item.unitPrice).toFixed(2)}</cbc:LineExtensionAmount>
      <cac:Item>
        <cbc:Name>\${item.description}</cbc:Name>
        <cac:ClassifiedTaxCategory>
          <cbc:ID>S</cbc:ID>
          <cbc:Percent>\${item.taxRate.rate * 100}</cbc:Percent>
          <cac:TaxScheme>
            <cbc:ID>VAT</cbc:ID>
          </cac:TaxScheme>
        </cac:ClassifiedTaxCategory>
      </cac:Item>
      <cac:Price>
        <cbc:PriceAmount currencyID="\${invoice.currency}">\${item.unitPrice.toFixed(2)}</cbc:PriceAmount>
      </cac:Price>
    </cac:InvoiceLine>\`).join('');

    return \`<?xml version="1.0" encoding="UTF-8"?>
<Invoice \${namespaces}>
  <cbc:CustomizationID>urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:poacc:trns:invoice:3</cbc:CustomizationID>
  <cbc:ProfileID>urn:fdc:peppol.eu:poacc:bis:invoice:3</cbc:ProfileID>
  <cbc:ID>\${invoice.invoiceNumber}</cbc:ID>
  <cbc:IssueDate>\${invoice.issueDate}</cbc:IssueDate>
  <cbc:DueDate>\${invoice.dueDate}</cbc:DueDate>
  <cbc:InvoiceTypeCode>380</cbc:InvoiceTypeCode>
  <cbc:DocumentCurrencyCode>\${invoice.currency}</cbc:DocumentCurrencyCode>
  
  <cac:AccountingSupplierParty>
    <cac:Party>
      <cac:PartyTaxScheme>
        <cbc:CompanyID>\${invoice.company.taxRegistrationNumber}</cbc:CompanyID>
        <cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme>
      </cac:PartyTaxScheme>
    </cac:Party>
  </cac:AccountingSupplierParty>
  
  <cac:AccountingCustomerParty>
    <cac:Party>
      <cac:PartyTaxScheme>
        <cbc:CompanyID>\${invoice.clientTaxId}</cbc:CompanyID>
        <cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme>
      </cac:PartyTaxScheme>
    </cac:Party>
  </cac:AccountingCustomerParty>
  
  \${itemsXML}
</Invoice>\`;
  }
}`
  }
];
