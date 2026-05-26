/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { LANGUAGES, formatToLocalizedNumeral } from '../data/translations';
import { Languages, Type, Clipboard, Calendar, Layout, RefreshCw } from 'lucide-react';

export default function I18nLocalizer() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [textAmount, setTextAmount] = useState<number>(1284750.45);
  const [copied, setCopied] = useState<boolean>(false);

  const activeLang = LANGUAGES[selectedLanguage] || LANGUAGES.en;

  // Real-time currency locale formatter
  const formattedLocaleCurrency = (val: number, localeCode: string, currency: string) => {
    return new Intl.NumberFormat(localeCode, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(val);
  };

  const currentFormattedCurrency = formattedLocaleCurrency(textAmount, activeLang.locale, activeLang.currency);
  const localizedNumeralString = formatToLocalizedNumeral(currentFormattedCurrency, activeLang.numeralSystem);

  // Simulated localized addresses based on region standards
  const localizedAddress = (lang: string) => {
    switch (lang) {
      case 'jp':
        return `〒100-0001
東京都千代田区千代田1-1
ネクスラ株式会社 法人会計部 御中`;
      case 'ar':
        return `طريق الملك فهد، العليا
برج الفيصلية، الطابق ١٨
الرياض ١٢٢١٢، المملكة العربية السعودية`;
      case 'de':
        return `Nexra GmbH
Finanzbuchhaltung Abteilung
Friedrichstraße 95
10117 Berlin, Deutschland`;
      case 'fr':
        return `Nexra SAS
Direction Technique Financière
8 Rue de la Paix
75002 Paris, France`;
      case 'bn':
        return `নেক্সরা টেকনোলজিস লিমিটেড
হিসাব বিজ্ঞান শাখা
১২ কারওয়ান বাজার বাণিজ্যিক এলাকা
ঢাকা ১২১৫, বাংলাদেশ`;
      case 'hi':
        return `नेक्सरा एंटरप्राइजेज कॉर्पोरेशन
वित्त एवं लेखा विभाग
२४ कस्तूरबा गांधी मार्ग
नई दिल्ली ११००০১, भारत`;
      default:
        return `Nexra ERP Systems Inc.
Treasury and Compliance Dept.
100 Pine Street, Suite 2400
San Francisco, CA 94111, USA`;
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSystemLabel = (system: string) => {
    switch (system) {
      case 'Arabic': return 'Eastern Arabic Numerals (١٢٣...)';
      case 'Devanagari': return 'Hindi Devanagari (१२३...)';
      case 'Bengali': return 'Bengali Digits (১২৩...)';
      case 'JapaneseFullWidth': return 'Japanese Full-Width (１２３...)';
      default: return 'Standard Latin Digits (123...)';
    }
  };

  return (
    <div className="bg-white grid-border overflow-hidden h-full flex flex-col" id="i18n-localizer-root">
      {/* Banner */}
      <div className="border-b border-[#141414] px-4 py-2 flex items-center justify-between bg-white text-[#141414]">
        <div className="flex items-center space-x-2">
          <Languages className="w-4 h-4 text-[#141414]" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#141414]">
            Unicode & Multilingual i18n Portal
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[9px] text-[#141414] font-mono uppercase bg-slate-100 border border-[#141414] px-1.5 py-0.5 font-bold">
            RTL / Global Unicode Compliance
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#141414] flex-1">
        
        {/* Lang Selector Panel */}
        <div className="p-4 bg-slate-50 space-y-3 text-[#141414]">
          <span className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest block font-bold border-b border-[#141414] pb-1">
            Target Language and Locale
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 max-h-[160px] md:max-h-[460px] overflow-y-auto pr-1">
            {Object.values(LANGUAGES).map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`w-full text-left p-2 rounded-none border transition flex flex-col justify-between ${
                  selectedLanguage === lang.code
                    ? 'border-[#141414] bg-orange-100 text-slate-955 font-bold'
                    : 'border-slate-300 hover:border-[#141414] text-slate-800 bg-white'
                }`}
                id={`lang-btn-${lang.code}`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-sans font-bold text-xs">{lang.nativeName}</span>
                  <span className="text-[9px] font-mono text-orange-600 font-bold uppercase data-mono">{lang.code}</span>
                </div>
                <span className="text-[9.5px] text-slate-500 font-sans mt-0.5 line-clamp-1">
                  {lang.name} - {lang.countryLabel.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[#141414]">
            <label className="block text-[10px] font-bold tracking-widest font-mono text-slate-500 uppercase mb-1">
              Test Amount Value
            </label>
            <input
              type="number"
              value={textAmount}
              onChange={(e) => setTextAmount(parseFloat(e.target.value) || 0)}
              className="w-full bg-white border border-[#141414] rounded-none py-1.5 px-2 text-xs font-mono text-slate-900 outline-none"
            />
          </div>
        </div>

        {/* Translation Output Grid */}
        <div className="col-span-2 p-4 flex flex-col justify-between space-y-4" style={{ direction: activeLang.dir }}>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#141414] pb-2">
              <div className="flex items-center space-x-2">
                <Type className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] font-bold tracking-widest font-mono text-slate-500 uppercase">
                  Localized Layout Preview ({activeLang.dir.toUpperCase()})
                </span>
              </div>
              <span className="text-[9px] font-mono font-bold text-white bg-[#141414] px-1.5 py-0.5">
                System: {getSystemLabel(activeLang.numeralSystem)}
              </span>
            </div>

            {/* Simulated Live RTL Container */}
            <div className={`p-3.5 border border-[#141414] space-y-3 bg-white ${activeLang.dir === 'rtl' ? 'text-right' : 'text-left'}`}>
              <div>
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
                  {activeLang.dir === 'rtl' ? 'مسمى النظام المترجم' : 'Translated System Label'}
                </span>
                <span className="text-sm font-sans font-extrabold text-slate-900">
                  {activeLang.translations.appTitle}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-dashed border-slate-300 pt-3">
                <div>
                  <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">
                    {activeLang.translations.chartOfAccounts}
                  </span>
                  <span className="text-xs font-sans font-bold text-slate-700">
                    {activeLang.translations.chartOfAccounts}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">
                    {activeLang.translations.doubleEntryLedger}
                  </span>
                  <span className="text-xs font-sans font-bold text-slate-700">
                    {activeLang.translations.doubleEntryLedger}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">
                    {activeLang.translations.taxCompliance}
                  </span>
                  <span className="text-xs font-sans font-bold text-slate-700">
                    {activeLang.translations.taxCompliance}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">
                    {activeLang.translations.multilingualInvoice}
                  </span>
                  <span className="text-xs font-sans font-bold text-slate-700">
                    {activeLang.translations.multilingualInvoice}
                  </span>
                </div>
              </div>
            </div>

            {/* Currency Numeral Translator Block */}
            <div className="bg-[#141414] text-white rounded-none p-3.5 flex flex-col space-y-2 border border-[#141414] font-mono col-span-12">
              <span className="text-[9px] font-mono text-slate-400 tracking-widest uppercase block font-bold">
                Localized Currency Formatting Result
              </span>
              <div className="flex justify-between items-baseline">
                <span className="font-mono text-orange-400 font-bold text-xl tracking-tight data-mono">
                  {localizedNumeralString}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyText(localizedNumeralString)}
                  className="bg-slate-800 text-xs text-slate-300 hover:text-white hover:bg-slate-700 px-2 py-0.5 rounded-none border border-white/25 transition flex items-center space-x-1 font-mono text-[10px]"
                >
                  <Clipboard className="w-3.5 h-3.5" />
                  <span className="text-[10px]">{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Localized Addresses */}
          <div className="p-3 bg-slate-100 border border-[#141414] flex flex-col space-y-1">
            <span className="text-[9px] font-mono text-slate-700 tracking-widest uppercase font-bold flex items-center space-x-1 border-b border-slate-300 pb-1">
              <Layout className="w-3 h-3 mr-1" />
              <span>International Address Compliance Format</span>
            </span>
            <pre className="font-mono text-[11px] text-slate-950 font-semibold leading-snug whitespace-pre-line tracking-tight select-all">
              {localizedAddress(selectedLanguage)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
