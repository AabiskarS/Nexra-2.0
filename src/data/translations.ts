/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NumericNumeralSystem } from '../types';

export interface LanguageDef {
  code: string;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
  numeralSystem: NumericNumeralSystem;
  locale: string;
  currency: string;
  countryLabel: string;
  translations: {
    appTitle: string;
    chartOfAccounts: string;
    doubleEntryLedger: string;
    taxCompliance: string;
    multilingualInvoice: string;
    pluginManager: string;
    architectureHub: string;
    
    // UI elements
    postJournal: string;
    unlockedPeriod: string;
    lockedPeriod: string;
    auditLog: string;
    complianceStatus: string;
    compliant: string;
    notCompliant: string;
    peppolXml: string;
    clientName: string;
    addInvoiceItem: string;
    taxBasis: string;
    totalAmount: string;
    taxCollected: string;
    currencyConv: string;
    exchangeRate: string;
    
    // Financial statements
    balanceSheet: string;
    profitAndLoss: string;
    trialBalance: string;
    assets: string;
    liabilities: string;
    equity: string;
    revenue: string;
    expenses: string;
  };
}

export const LANGUAGES: Record<string, LanguageDef> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    dir: 'ltr',
    numeralSystem: 'Standard',
    locale: 'en-US',
    currency: 'USD',
    countryLabel: 'United States GAAP / UK HMRC / Australia GST',
    translations: {
      appTitle: 'Nexra ERP Enterprise Suite',
      chartOfAccounts: 'Chart of Accounts',
      doubleEntryLedger: 'Double-Entry General Ledger',
      taxCompliance: 'Regional Tax & Compliance Engine',
      multilingualInvoice: 'Inter-Community Invoice Standardizer',
      pluginManager: 'Country Plugin Orchestrator',
      architectureHub: 'Architecture & Scalability Specifications',
      postJournal: 'Post Journal Entry',
      unlockedPeriod: 'Fiscal Period: Unlocked',
      lockedPeriod: 'Fiscal Period: Hard Locked',
      auditLog: 'Immutable Audit Trail',
      complianceStatus: 'Compliance Validation',
      compliant: 'COMPLIANT',
      notCompliant: 'FIELDS MISSING',
      peppolXml: 'PEPPOL EN 16931 (UBL XML) Document Parser',
      clientName: 'Client name',
      addInvoiceItem: 'Add item line',
      taxBasis: 'Taxable business basis',
      totalAmount: 'Total localized amount',
      taxCollected: 'Assessed tax collected',
      currencyConv: 'Currency conversion settings',
      exchangeRate: 'Base rate',
      balanceSheet: 'Balance Sheet',
      profitAndLoss: 'Profit & Loss Statement (P&L)',
      trialBalance: 'Trial Balance',
      assets: 'Current & Non-Current Assets',
      liabilities: 'Short & Long Term Liabilities',
      equity: 'Equity & Retained Earnings',
      revenue: 'Operating Revenue',
      expenses: 'Taxable Expenses'
    }
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    dir: 'ltr',
    numeralSystem: 'Standard',
    locale: 'de-DE',
    currency: 'EUR',
    countryLabel: 'Germany (ZUGFeRD & GoBD compliant)',
    translations: {
      appTitle: 'Nexra ERP Enterprise Suite',
      chartOfAccounts: 'Kontenplan (GoBD)',
      doubleEntryLedger: 'Doppelte Buchführung (Hauptbuch)',
      taxCompliance: 'Regionale Steuer- & Compliance-Engine',
      multilingualInvoice: 'Gemeinschaftliche Rechnungsstandards',
      pluginManager: 'Länder-Plugin-Orchestrator',
      architectureHub: 'Architektur- & Skalierbarkeitsspezifikationen',
      postJournal: 'Buchungssatz buchen',
      unlockedPeriod: 'Geschäftsperiode: Aktiv',
      lockedPeriod: 'Geschäftsperiode: Abgeschlossen (GoBD)',
      auditLog: 'Unveränderliches Journal (Audittrail)',
      complianceStatus: 'Compliance-Überprüfung',
      compliant: 'KONFORM',
      notCompliant: 'FEHLENDE INHALTE',
      peppolXml: 'PEPPOL EN 16931 (UBL XML) Dokumenten-Parser',
      clientName: 'Kundenname',
      addInvoiceItem: 'Position hinzufügen',
      taxBasis: 'Steuerbare Bemessungsgrundlage',
      totalAmount: 'Gesamtbetrag (inkl. USt)',
      taxCollected: 'Ermittelte Umsatzsteuer',
      currencyConv: 'Währungsumrechnung',
      exchangeRate: 'Wechselkurs',
      balanceSheet: 'Bilanz',
      profitAndLoss: 'Gewinn- und Verlustrechnung (GuV)',
      trialBalance: 'Saldenbilanz',
      assets: 'Aktiva',
      liabilities: 'Passiva',
      equity: 'Eigenkapital',
      revenue: 'Umsatzerlöse',
      expenses: 'Betriebsausgaben'
    }
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    dir: 'ltr',
    numeralSystem: 'Standard',
    locale: 'fr-FR',
    currency: 'EUR',
    countryLabel: 'France (Factur-X & FEC compliant)',
    translations: {
      appTitle: 'Nexra Suite ERP France',
      chartOfAccounts: 'Plan Comptable Général (FEC)',
      doubleEntryLedger: 'Comptabilité en Partie Double (Grand Livre)',
      taxCompliance: 'Moteur de conformité de TVA',
      multilingualInvoice: 'Standardisation de Facture Intra-CE',
      pluginManager: 'Orchestrateur de Modules Nationaux',
      architectureHub: 'Spécifications Techniques ERP',
      postJournal: 'Valider l\'écriture comptable',
      unlockedPeriod: 'Période fiscale: Déverrouillée',
      lockedPeriod: 'Période fiscale: Clôturée (FEC)',
      auditLog: 'Journal d\'Audit Immuable',
      complianceStatus: 'Contrôle Fiscal Intégré',
      compliant: 'CONFORME (Factur-X)',
      notCompliant: 'NON COMPATIBLE',
      peppolXml: 'Générateur XML PEPPOL (UBL RFC)',
      clientName: 'Raison sociale client',
      addInvoiceItem: 'Ajouter une ligne de produit',
      taxBasis: 'Base taxable consolidée',
      totalAmount: 'Montant total TTC',
      taxCollected: 'TVA collectée',
      currencyConv: 'Conversion des devises',
      exchangeRate: 'Cours de change',
      balanceSheet: 'Bilan Comptable',
      profitAndLoss: 'Compte de Résultat',
      trialBalance: 'Balance des Comptes',
      assets: 'Actif',
      liabilities: 'Passif Exigible',
      equity: 'Capitaux Propres',
      revenue: 'Produits d\'Exploitation',
      expenses: 'Charges Déductibles'
    }
  },
  jp: {
    code: 'jp',
    name: 'Japanese',
    nativeName: '日本語',
    dir: 'ltr',
    numeralSystem: 'JapaneseFullWidth',
    locale: 'ja-JP',
    currency: 'JPY',
    countryLabel: '日本国内法 (適格請求書保存方式/インボイス制度対応)',
    translations: {
      appTitle: 'Nexra エンタープライズ ERP システム',
      chartOfAccounts: '勘定科目設定 (個別/勘定科目表)',
      doubleEntryLedger: '複式簿記 (総勘定元帳仕訳)',
      taxCompliance: '消費税・適合度計算エンジン',
      multilingualInvoice: '適格請求書テンプレート (インボイス方式)',
      pluginManager: 'ローカライズ・プラグイン管理者',
      architectureHub: 'ERPアーキテクチャ・データベース設計図',
      postJournal: '仕訳を承認して起票する',
      unlockedPeriod: '会計期間状態：ロック解除中',
      lockedPeriod: '会計期間状態：確定ロック済 (訂正不能)',
      auditLog: '電子帳簿保存法監査ログ',
      complianceStatus: '適合要件チェック',
      compliant: '適格要件を満たしています',
      notCompliant: '必要項目が不足しています',
      peppolXml: 'PEPPOL 準拠 (UBL XML) デジタル帳票解析',
      clientName: '取引先企業名',
      addInvoiceItem: '仕訳明細を追加',
      taxBasis: '課税対象売上高等',
      totalAmount: '円貨建合計金額',
      taxCollected: '消費税額合計（算出値）',
      currencyConv: '多通貨外貨換算設定',
      exchangeRate: '基準外国為替レート',
      balanceSheet: '貸借対照表 (B/S)',
      profitAndLoss: '損益計算書 (P/L)',
      trialBalance: '合計残高試算表',
      assets: '資産の部',
      liabilities: '負債の部',
      equity: '純資産の部',
      revenue: '売上高・経常収益',
      expenses: '売上原価・販売管理費'
    }
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    dir: 'rtl',
    numeralSystem: 'Arabic',
    locale: 'ar-SA',
    currency: 'SAR',
    countryLabel: 'المملكة العربية السعودية (FATCA / ZATCA 2nd Stage compliant)',
    translations: {
      appTitle: 'نظام نيكسرا ERP للمؤسسات',
      chartOfAccounts: 'دليل الحسابات المحاسبي',
      doubleEntryLedger: 'دفتر الأستاذ العام للقيد المزدوج',
      taxCompliance: 'محرك ضريبة القيمة المضافة الإقليمي',
      multilingualInvoice: 'المطابقة الدولية للفواتير الإلكترونية',
      pluginManager: 'منسق المكونات الإضافية للدولة',
      architectureHub: 'مواصفات هيكلية النظام والنمو',
      postJournal: 'ترحيل قيود اليومية',
      unlockedPeriod: 'الفترة المالية: مفتوحة ومتاحة للتحرير',
      lockedPeriod: 'الفترة المالية: مؤمنة وغير قابلة للتعديل',
      auditLog: 'سجل المراجعة والتدقيق غير القابل للتلاعب',
      complianceStatus: 'تدقيق ومطابقة الفواتير الحكومية',
      compliant: 'متوافق بالكامل (الزكاة والدخل)',
      notCompliant: 'حقول إلزامية مفقودة',
      peppolXml: 'مترجم ملفات PEPPOL ومستندات UBL XML',
      clientName: 'اسم العميل / المكلف',
      addInvoiceItem: 'إضافة بند للفاتورة',
      taxBasis: 'الوعاء الخاضع للضريبة',
      totalAmount: 'إجمالي القيمة المحلية المستحقة',
      taxCollected: 'مبلغ ضريبة القيمة المضافة المحتسب',
      currencyConv: 'إعدادات أسعار صرف العملات الأجنبية',
      exchangeRate: 'سعر الصرف المرجعي',
      balanceSheet: 'الميزانية العمومية',
      profitAndLoss: 'قائمة الأرباح والخسائر للمنشأة',
      trialBalance: 'ميزان المراجعة المالي',
      assets: 'الأصول والموجودات',
      liabilities: 'الالتزامات والمطالبات',
      equity: 'حقوق الملاك والمساهمين',
      revenue: 'الإيرادات التشغيلية',
      expenses: 'المصروفات والأعباء الضريبية'
    }
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    dir: 'ltr',
    numeralSystem: 'Devanagari',
    locale: 'hi-IN',
    currency: 'INR',
    countryLabel: 'India GST (HSN/SAC & TDS compliant)',
    translations: {
      appTitle: 'नेक्सरा ईआरपी एंटरप्राइज़ सूट',
      chartOfAccounts: 'खातों का चार्ट (COA)',
      doubleEntryLedger: 'दोहरी प्रविष्टि बहीखाता (लेज़र)',
      taxCompliance: 'क्षेत्रीय कर और अनुपालन इंजन',
      multilingualInvoice: 'अंतर-सामुदायिक चालान मानकीकरण',
      pluginManager: 'देश प्लगइन समन्वयक',
      architectureHub: 'वास्तुकला और मापनीयता विनिर्देश',
      postJournal: 'जर्नल प्रविष्टि पोस्ट करें',
      unlockedPeriod: 'वित्तीय अवधि: अनलॉक है',
      lockedPeriod: 'वित्तीय अवधि: सुरक्षित रूप से लॉक है',
      auditLog: 'अपरिवर्तनीय ऑडिट ट्रेल लेखांकन',
      complianceStatus: 'अनुपालन सत्यापन जांच',
      compliant: 'पूरी तरह अनुपालन (GSTIN)',
      notCompliant: 'आवश्यक फ़ील्ड गायब हैं',
      peppolXml: 'PEPPOL EN 16931 डिजिटल बीजक पार्सर',
      clientName: 'ग्राहक का विवरण',
      addInvoiceItem: 'उत्पाद पंक्ति जोड़ें',
      taxBasis: 'कर योग्य लेन-देन आधार',
      totalAmount: 'कुल स्थानीयकृत जीएसटी मूल्य',
      taxCollected: 'निर्धारित कर संग्रह राशि',
      currencyConv: 'विदेशी मुद्रा विनिमय सेटिंग',
      exchangeRate: 'मूल दर विनिमय',
      balanceSheet: 'तुलन पत्र (बैलेंस शीट)',
      profitAndLoss: 'लाभ और हानि विवरण (P&L)',
      trialBalance: 'परीक्षण शेष (ट्रायल बैलेंस)',
      assets: 'वर्तमान और दीर्घकालिक संपत्तियाँ',
      liabilities: 'अल्पकालिक और दीर्घकालिक देनदारियां',
      equity: 'इक्विटी और शुद्ध संपत्ति',
      revenue: 'परिचालन राजस्व',
      expenses: 'कर योग्य व्यावसायिक व्यय'
    }
  },
  bn: {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    dir: 'ltr',
    numeralSystem: 'Bengali',
    locale: 'bn-BD',
    currency: 'BDT',
    countryLabel: 'Bangladesh (NBR / VAT with withholding tax compliant)',
    translations: {
      appTitle: 'নেক্সরা ইআরপি এন্টারপ্রাইজ স্যুট',
      chartOfAccounts: 'হিসাবের চার্ট (COA)',
      doubleEntryLedger: 'দ্বিমুখী দাখিলা খতিয়ান ও জাবেদা',
      taxCompliance: 'আঞ্চলিক ট্যাক্স ও কমপ্লায়েন্স ইঞ্জিন',
      multilingualInvoice: 'ভ্যাট চালান মানকীকরণ',
      pluginManager: 'কান্ট্রি প্লাগইন অর্কেস্ট্রেটর',
      architectureHub: 'সিস্টেম আর্কিটেকচার স্পেসিফিকেশন',
      postJournal: 'খতিয়ান পোস্টিং নিশ্চিত করুন',
      unlockedPeriod: 'অর্থবছর সময়কাল: আনলক করা',
      lockedPeriod: 'অর্থবছর সময়কাল: সম্পূর্ণ লক করা',
      auditLog: 'অপরিবর্তনীয় অডিট ট্রেইল সিস্টেম',
      complianceStatus: 'কমপ্লায়েন্স যাচাইকরণ',
      compliant: 'সম্পূর্ণ ভ্যাট কমপ্লায়েন্ট',
      notCompliant: 'প্রয়োজনীয় ফিল্ড অনুপস্থিত',
      peppolXml: 'PEPPOL (UBL XML) চালান পার্সার',
      clientName: 'ক্লায়েন্টের নাম ও ট্যাক্স আইডি',
      addInvoiceItem: 'পণ্য লাইন আইটেম যুক্ত করুন',
      taxBasis: 'ট্যাক্সযোগ্য ব্যবসার ভিত্তি',
      totalAmount: 'মোট স্থানীয়কৃত মূল্যমান',
      taxCollected: 'নির্ধারিত কর আদায় পরিমাণ',
      currencyConv: 'বৈদেশিক মুদ্রা রূপান্তর রেট',
      exchangeRate: 'মূল্যমান বিনিময় হার',
      balanceSheet: 'উদ্বৃত্ত পত্র (ব্যালেন্স শিট)',
      profitAndLoss: 'লাভ-ক্ষতি বিবরণী (P&L)',
      trialBalance: 'রেওয়ামিল বিবরণী (Trial Balance)',
      assets: 'চলতি ও দীর্ঘমেয়াদী সম্পদসমূহ',
      liabilities: 'চলতি ও দীর্ঘমেয়াদী দায়সমূহ',
      equity: 'মালিকানা স্বত্ব ও অংশীদারিত্ব',
      revenue: 'পরিচালন মুনাফা ও আয়ের উৎস',
      expenses: 'ট্যাক্সযোগ্য ব্যবসায়িক ব্যয়সমূহ'
    }
  }
};

// Standard helper to format with numeral translation natively
export function formatToLocalizedNumeral(value: string | number, system: NumericNumeralSystem): string {
  const str = typeof value === 'number' ? value.toString() : value;
  if (system === 'Standard') return str;
  const digits = {
    Standard: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    Arabic: ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'],
    Devanagari: ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'],
    Bengali: ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'],
    JapaneseFullWidth: ['０', '１', '２', '３', '４', '５', '６', '７', '８', '９']
  }[system];
  
  return str.replace(/\d/g, (d) => digits[parseInt(d, 10)]);
}
