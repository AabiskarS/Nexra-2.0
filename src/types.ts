/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type NumericNumeralSystem = 'Standard' | 'Arabic' | 'Devanagari' | 'Bengali' | 'JapaneseFullWidth';

export type TargetRegion =
  | 'EU'
  | 'UK'
  | 'US'
  | 'IN' // India - SAARC
  | 'SG' // Singapore - ASEAN
  | 'MY' // Malaysia - ASEAN
  | 'ID' // Indonesia - ASEAN
  | 'TH' // Thailand - ASEAN
  | 'VN' // Vietnam - ASEAN
  | 'PH' // Philippines - ASEAN
  | 'JP' // Japan
  | 'AU'; // Australia

export interface Company {
  id: string;
  name: string;
  taxRegistrationNumber: string;
  country: TargetRegion;
  baseCurrency: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    countryName: string;
  };
}

export interface Decimal {
  value: number;
  formatted: string;
}

export interface TaxRateInfo {
  rate: number;
  name: string;
  type: 'VAT' | 'SalesTax' | 'GST' | 'SST' | 'ConsumptionTax' | 'ReverseCharge';
  hsnSacCode?: string; // India GST
  subCategory?: string; // e.g., State, County, City, IGST, CGST, SGST
}

export interface LedgerAccount {
  code: string;
  name: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  balance: number;
}

export interface JournalLine {
  accountCode: string;
  debit: number;
  credit: number;
  currency: string;
  exchangeRate: number; // base rate to base currency
  localDebit: number; // base currency debit
  localCredit: number; // base currency credit
}

export interface JournalEntry {
  id: string;
  date: string;
  reference: string;
  description: string;
  isPosted: boolean;
  isLocked: boolean;
  lines: JournalLine[];
}

export interface InvoiceItem {
  id: string;
  description: string;
  hsnSac?: string; // India
  quantity: number;
  unitPrice: number;
  taxRate: TaxRateInfo;
}

export interface Invoice {
  id: string;
  issueDate: string;
  dueDate: string;
  invoiceNumber: string;
  company: Company;
  clientName: string;
  clientTaxId: string;
  clientAddress: string;
  items: InvoiceItem[];
  currency: string;
  exchangeRate: number;
  notes?: string;
  peppolEndpointId?: string; // PEPPOL Scheme (e.g., ISO6523 0088:xxxx)
}

export interface PluginMeta {
  id: string;
  name: string;
  version: string;
  author: string;
  region: TargetRegion;
  status: 'active' | 'inactive';
  eventsHooked: string[];
}
