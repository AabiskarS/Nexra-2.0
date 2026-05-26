/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { TargetRegion, TaxRateInfo } from '../types';
import { Calculator, CheckCircle2, AlertTriangle, ShieldCheck, Landmark, Globe } from 'lucide-react';

interface RegionalTaxPreset {
  region: TargetRegion;
  label: string;
  currency: string;
  standardRate: number;
  rates: TaxRateInfo[];
  complianceFields: string[];
  placeholderTaxId: string;
  taxLabel: string;
}

const REGIONAL_PRESETS: Record<TargetRegion, RegionalTaxPreset> = {
  EU: {
    region: 'EU',
    label: 'European Union (Germany, France, Spain, Portugal)',
    currency: 'EUR',
    standardRate: 0.19,
    taxLabel: 'VAT / USt',
    placeholderTaxId: 'DE811122334',
    rates: [
      { rate: 0.19, name: 'EU Standard VAT (Germany)', type: 'VAT' },
      { rate: 0.07, name: 'EU Reduced VAT (German Books/Food)', type: 'VAT' },
      { rate: 0.20, name: 'EU Standard VAT (France)', type: 'VAT' },
      { rate: 0.00, name: 'EU Zero-Rated (Reverse Charge)', type: 'ReverseCharge' }
    ],
    complianceFields: ['Intra-community VAT ID Verification', 'OSS/IOSS Union Scheme Flags', 'Factur-X/ZUGFeRD Structure']
  },
  UK: {
    region: 'UK',
    label: 'United Kingdom (MTD/HMRC Hub)',
    currency: 'GBP',
    standardRate: 0.20,
    taxLabel: 'UK VAT',
    placeholderTaxId: 'GB123456789',
    rates: [
      { rate: 0.20, name: 'UK Standard VAT', type: 'VAT' },
      { rate: 0.05, name: 'UK Reduced Rate VAT', type: 'VAT' },
      { rate: 0.00, name: 'UK Exempt / Zero-Rate', type: 'VAT' }
    ],
    complianceFields: ['Making Tax Digital (MTD) Signature Header', 'HMRC Authorization Oath Code', 'HMRC Digital submission digest']
  },
  US: {
    region: 'US',
    label: 'United States (Nexus ZIP Resolver)',
    currency: 'USD',
    standardRate: 0.0825,
    taxLabel: 'US Sales Tax',
    placeholderTaxId: '12-3456789 (EIN)',
    rates: [
      { rate: 0.0625, name: 'State Sales Tax (Texas)', type: 'SalesTax', subCategory: 'State' },
      { rate: 0.0100, name: 'County Sales Tax (Travis County)', type: 'SalesTax', subCategory: 'County' },
      { rate: 0.0100, name: 'City Sales Tax (Austin City)', type: 'SalesTax', subCategory: 'City' },
      { rate: 0.0875, name: 'California Combined Sales Tax', type: 'SalesTax' }
    ],
    complianceFields: ['State Sales Tax Nexus Verification', '1099-NEC / 1099-MISC Reporting', 'Multi-Jurisdictional Tax Exemption Certificate']
  },
  IN: {
    region: 'IN',
    label: 'India - SAARC GST Portal',
    currency: 'INR',
    standardRate: 0.18,
    taxLabel: 'India GST',
    placeholderTaxId: '07AAAAA1111A1Z1',
    rates: [
      { rate: 0.18, name: 'GST @ 18% (Standard Services/Software)', type: 'GST', hsnSacCode: '998311' },
      { rate: 0.12, name: 'GST @ 12% (Telecom / Business Assets)', type: 'GST', hsnSacCode: '998413' },
      { rate: 0.28, name: 'GST @ 28% (Luxury / Demerit Items)', type: 'GST', hsnSacCode: '998599' },
      { rate: 0.05, name: 'GST @ 5% (Essential Goods)', type: 'GST', hsnSacCode: '996411' }
    ],
    complianceFields: ['HSN/SAC Code Assignment', 'E-Invoice IRN QR Signature Code', 'TDS / TCS Withholding Auditing Line']
  },
  SG: {
    region: 'SG',
    label: 'Singapore - IRAS Enterprise Portal',
    currency: 'SGD',
    standardRate: 0.09,
    taxLabel: 'GST',
    placeholderTaxId: 'M2-1234567-X',
    rates: [
      { rate: 0.09, name: 'Singapore Standard GST (2024+)', type: 'GST' },
      { rate: 0.00, name: 'Zero-Rated Goods (Exports)', type: 'GST' }
    ],
    complianceFields: ['IRAS Corppass OAuth Session', 'Singapore PEPPOL BIS Billing 3']
  },
  MY: {
    region: 'MY',
    label: 'Malaysia - SST Custom System',
    currency: 'MYR',
    standardRate: 0.06,
    taxLabel: 'SST Service/Sales Tax',
    placeholderTaxId: 'W10-1234-5678',
    rates: [
      { rate: 0.06, name: 'Malaysia Service Tax (Standard)', type: 'SST' },
      { rate: 0.08, name: 'Malaysia Premium Service Tax', type: 'SST' },
      { rate: 0.10, name: 'Malaysia Sales Tax (Goods Category A)', type: 'SST' },
      { rate: 0.05, name: 'Malaysia Sales Tax (Reduced Rate)', type: 'SST' }
    ],
    complianceFields: ['LHDN MyInvois Digital Signature ID', 'SST Return Form SST-02 Filing']
  },
  ID: {
    region: 'ID',
    label: 'Indonesia - DJP Pajak Portal',
    currency: 'IDR',
    standardRate: 0.11,
    taxLabel: 'VAT / PPN',
    placeholderTaxId: '01.234.567.8-901.000',
    rates: [
      { rate: 0.11, name: 'PPN Standard Indonesia', type: 'VAT' },
      { rate: 0.00, name: 'PPN Bebas (Zero-Rated / Exempt)', type: 'VAT' }
    ],
    complianceFields: ['e-Faktur QR Code Hash Payload', 'NPWP 16-Digit Identity Validation']
  },
  TH: {
    region: 'TH',
    label: 'Thailand - Revenue Department Scheme',
    currency: 'THB',
    standardRate: 0.07,
    taxLabel: 'VAT',
    placeholderTaxId: '0105545000123',
    rates: [
      { rate: 0.07, name: 'Thailand Standard VAT', type: 'VAT' },
      { rate: 0.00, name: 'Thailand Zero-Rated Goods / Services', type: 'VAT' }
    ],
    complianceFields: ['Thai Royal Tax Invoice Header Block', 'e-Tax Invoice & e-Receipt Signing']
  },
  VN: {
    region: 'VN',
    label: 'Vietnam - General Dept of Taxation (GDT)',
    currency: 'VND',
    standardRate: 0.10,
    taxLabel: 'VAT / GTGT',
    placeholderTaxId: '0100109106',
    rates: [
      { rate: 0.10, name: 'GTGT Standard Rate Vietnamese', type: 'VAT' },
      { rate: 0.05, name: 'GTGT Reduced Agricultural / Medical', type: 'VAT' },
      { rate: 0.00, name: 'GTGT Zero Rate Exempted', type: 'VAT' }
    ],
    complianceFields: ['GDT XML Invoice Signature Schema', 'Invoice Issue Verification Protocol']
  },
  PH: {
    region: 'PH',
    label: 'Philippines - BIR compliance',
    currency: 'PHP',
    standardRate: 0.12,
    taxLabel: 'Value Added Tax (VAT)',
    placeholderTaxId: '123-456-789-000',
    rates: [
      { rate: 0.12, name: 'PH Standard VAT', type: 'VAT' },
      { rate: 0.00, name: 'PH Zero-Rated VAT Code', type: 'VAT' }
    ],
    complianceFields: ['BIR Approved Computerized Accounting System (CAS)', 'Official Receipts (OR) Series Metadata']
  },
  JP: {
    region: 'JP',
    label: 'Japan - Qualified Invoice System',
    currency: 'JPY',
    standardRate: 0.10,
    taxLabel: 'Consumption Tax / 消費税',
    placeholderTaxId: 'T1234567890123',
    rates: [
      { rate: 0.10, name: 'Japan Consumption Tax (Standard)', type: 'ConsumptionTax' },
      { rate: 0.08, name: 'Japan Reduced Consumption Tax (Food/News)', type: 'ConsumptionTax' },
      { rate: 0.00, name: 'Japan Untaxable / Non-Taxable', type: 'ConsumptionTax' }
    ],
    complianceFields: ['Register T-Number Validation ID', 'Multiple Tax Invoicing Decimal Truncation Rule']
  },
  AU: {
    region: 'AU',
    label: 'Australia - ATO Compliance Scheme',
    currency: 'AUD',
    standardRate: 0.10,
    taxLabel: 'Australia GST & Super',
    placeholderTaxId: '12 345 678 901 (ABN)',
    rates: [
      { rate: 0.10, name: 'ATO Standard GST', type: 'GST' },
      { rate: 0.00, name: 'ATO GST-Free Goods', type: 'GST' }
    ],
    complianceFields: ['ATO Business Activity Statement (BAS) Map', 'Single Touch Payroll (STP) Phase 2 Stream', 'Superannuation Guarantee Check (11.5%)']
  }
};

export default function TaxEnginePlayground() {
  const [selectedRegion, setSelectedRegion] = useState<TargetRegion>('EU');
  const [amountInput, setAmountInput] = useState<number>(10000);
  const [taxIdInput, setTaxIdInput] = useState<string>('');
  const [selectedRateIndex, setSelectedRateIndex] = useState<number>(0);
  const [isB2B, setIsB2B] = useState<boolean>(true);
  
  // US ZIP Nexus state if US
  const [zipInput, setZipInput] = useState<string>('78701');

  // Trigger calculations on preset modifications
  const activePreset = REGIONAL_PRESETS[selectedRegion];

  // Auto-fill placeholder tax ID on region shift
  const handleRegionChange = (region: TargetRegion) => {
    setSelectedRegion(region);
    setTaxIdInput(REGIONAL_PRESETS[region].placeholderTaxId);
    setSelectedRateIndex(0);
  };

  const selectedRateObj = activePreset.rates[selectedRateIndex] || activePreset.rates[0];

  // Dynamic computation matrix
  const calculations = useMemo(() => {
    const basis = amountInput;
    let computedTax = 0;
    const itemsList: Array<{ ledgerCode: string; ledgerName: string; amount: number; rate: number }> = [];

    if (selectedRegion === 'US' && selectedRateObj.subCategory) {
      // Aggregate local US taxes based on presets
      let runningBasis = basis;
      activePreset.rates.slice(0, 3).forEach((r) => {
        const subTax = runningBasis * r.rate;
        computedTax += subTax;
        itemsList.push({
          ledgerCode: r.subCategory === 'State' ? '2150' : r.subCategory === 'County' ? '2151' : '2152',
          ledgerName: `Accrued Sales Tax - ${r.subCategory}`,
          amount: subTax,
          rate: r.rate
        });
      });
    } else if (selectedRegion === 'IN') {
      // Split Indian CGST + SGST (Intra-state) or apply IGST (Inter-state)
      const isInterState = !isB2B; // Mock Inter-State transaction
      const totalRate = selectedRateObj.rate;
      if (isInterState) {
        const igst = basis * totalRate;
        computedTax = igst;
        itemsList.push({
          ledgerCode: '2111',
          ledgerName: 'Output IGST Liability Account',
          amount: igst,
          rate: totalRate
        });
      } else {
        const halfRate = totalRate / 2;
        const cgst = basis * halfRate;
        const sgst = basis * halfRate;
        computedTax = cgst + sgst;
        itemsList.push({
          ledgerCode: '2112',
          ledgerName: 'Output CGST Liability Account',
          amount: cgst,
          rate: halfRate
        });
        itemsList.push({
          ledgerCode: '2113',
          ledgerName: 'Output SGST Liability Account',
          amount: sgst,
          rate: halfRate
        });
      }
    } else {
      // Standard computation
      computedTax = basis * selectedRateObj.rate;
      itemsList.push({
        ledgerCode: '2110',
        ledgerName: `Estimated ${selectedRateObj.type} Output Ledger`,
        amount: computedTax,
        rate: selectedRateObj.rate
      });
    }

    const total = basis + computedTax;

    return {
      taxableBasis: basis,
      taxCalculated: computedTax,
      total,
      breakdown: itemsList
    };
  }, [selectedRegion, selectedRateObj, amountInput, isB2B, activePreset]);

  // Formatter mapping based on select currency
  const formatValue = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: activePreset.currency,
      minimumFractionDigits: 2
    }).format(val);
  };

  return (
    <div className="bg-white grid-border overflow-hidden h-full flex flex-col" id="tax-playground-wrapper">
      {/* Visual Header */}
      <div className="border-b border-[#141414] px-4 py-2 flex items-center justify-between bg-white">
        <div className="flex items-center space-x-2">
          <Calculator className="w-4 h-4 text-[#141414]" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#141414]">
            Tax Engine & Compliance Validator
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <Globe className="w-3.5 h-3.5 text-[#141414] opacity-70" />
          <span className="text-[9px] text-white font-mono uppercase bg-[#141414] px-1.5 py-0.5">MULTI-JURISDICTIONAL</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#141414] flex-1">
        {/* Left Input Configuration */}
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-[10px] font-bold tracking-widest font-mono text-slate-500 uppercase mb-1">
              Select Jurisdiction
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => handleRegionChange(e.target.value as TargetRegion)}
              className="w-full bg-white border border-[#141414] rounded-none py-1.5 px-2 text-xs text-slate-900 outline-none font-sans"
              id="tax-region-dropdown"
            >
              {Object.values(REGIONAL_PRESETS).map((preset) => (
                <option key={preset.region} value={preset.region}>
                  {preset.label} [{preset.currency}]
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold tracking-widest font-mono text-slate-500 uppercase mb-1">
                Transaction Basis ({activePreset.currency})
              </label>
              <input
                type="number"
                value={amountInput}
                onChange={(e) => setAmountInput(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full bg-white border border-[#141414] rounded-none py-1.5 px-2 text-xs text-slate-900 outline-none font-mono"
                id="tax-basis-input"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-widest font-mono text-slate-500 uppercase mb-1">
                Corporate Tax / VAT Registration ID
              </label>
              <input
                type="text"
                placeholder={activePreset.placeholderTaxId}
                value={taxIdInput}
                onChange={(e) => setTaxIdInput(e.target.value)}
                className="w-full bg-white border border-[#141414] rounded-none py-1.5 px-2 text-xs text-slate-900 outline-none font-mono"
                id="tax-vat-input"
              />
            </div>
          </div>

          {/* Conditional Sub-settings for specific countries */}
          {selectedRegion === 'US' && (
            <div className="p-2.5 bg-slate-100 border border-[#141414] grid grid-cols-2 gap-3 text-[#141414]">
              <div>
                <label className="block text-[9px] font-bold font-mono tracking-widest uppercase mb-1">
                  Destination Zip Code
                </label>
                <input
                  type="text"
                  value={zipInput}
                  onChange={(e) => setZipInput(e.target.value)}
                  className="w-full bg-white border border-[#141414] rounded-none py-1 px-2 text-xs text-slate-900 font-mono outline-none"
                />
              </div>
              <div className="flex items-center text-[10px] text-slate-700 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-700 mr-2 flex-shrink-0" />
                <span>Geographic Nexus active in zip area.</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold tracking-widest font-mono text-slate-500 uppercase mb-1">
              Apply Taxation Category Tariff
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" id="tariff-radio-group">
              {activePreset.rates.map((rate, idx) => (
                <button
                  type="button"
                  key={`${rate.name}-${idx}`}
                  onClick={() => setSelectedRateIndex(idx)}
                  className={`border p-2 rounded-none text-left flex flex-col justify-between transition ${
                    selectedRateIndex === idx
                      ? 'border-[#141414] bg-orange-100 text-slate-950 font-bold'
                      : 'border-slate-300 text-slate-800 bg-white hover:border-[#141414]'
                  }`}
                >
                  <span className="text-[10px] font-bold font-mono tracking-tight leading-none uppercase">
                    {(rate.rate * 100).toFixed(1)}% {rate.type}
                  </span>
                  <span className="text-[10.5px] font-sans truncate mt-1 text-slate-500">
                    {rate.name}
                  </span>
                  {rate.hsnSacCode && (
                    <span className="text-[9px] font-mono text-indigo-800 mt-0.5 font-semibold">
                      HSN: {rate.hsnSacCode}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-100 border border-[#141414]">
            <span className="text-xs text-slate-700 font-bold">B2B Transaction (Reverse Charge Eligibility)</span>
            <button
              type="button"
              onClick={() => setIsB2B(!isB2B)}
              className={`w-10 h-6 flex items-center rounded-none p-0.5 border border-[#141414] transition-colors duration-200 focus:outline-hidden ${
                isB2B ? 'bg-orange-500' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-[#141414] w-4.5 h-4.5 transform transition-transform duration-200 ${
                  isB2B ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Right Computation Display */}
        <div className="p-4 flex flex-col bg-slate-50 max-h-[500px] overflow-y-auto justify-between space-y-4">
          {/* Main Calculation Values Card */}
          <div className="bg-[#141414] text-white rounded-none p-4 flex flex-col space-y-3">
            <div className="border-b border-white/20 pb-2 flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <Landmark className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-[9px] font-mono tracking-widest font-bold text-slate-400 uppercase">
                  LEGAL TAX OUTCOME
                </span>
              </div>
              <span className="text-[9px] bg-orange-400 text-black font-mono font-bold uppercase px-1.5 py-0.5">
                REAL TIME
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 divide-x divide-white/20">
              <div className="pl-1">
                <span className="text-[9px] text-slate-400 uppercase font-mono block mb-1">
                  Tax Basis
                </span>
                <span className="text-xs font-bold font-mono text-white data-mono">
                  {formatValue(calculations.taxableBasis)}
                </span>
              </div>
              <div className="pl-3">
                <span className="text-[9px] text-slate-400 uppercase font-mono block mb-1">
                  Tax Calculated
                </span>
                <span className="text-xs font-bold font-mono text-emerald-400 data-mono">
                  {formatValue(calculations.taxCalculated)}
                </span>
              </div>
              <div className="pl-3">
                <span className="text-[9px] text-slate-400 uppercase font-mono block mb-1">
                  Grand Total
                </span>
                <span className="text-xs font-bold font-mono text-orange-400 data-mono">
                  {formatValue(calculations.total)}
                </span>
              </div>
            </div>

            {/* Split breakdown for custom region rules (CGST/SGST/State rate splittings) */}
            <div className="space-y-1 border-t border-white/20 pt-2 text-[11px]">
              <span className="text-[9px] font-bold font-mono tracking-widest text-slate-500 uppercase block">
                Accounting Sub-Ledger Splits
              </span>
              {calculations.breakdown.map((item, id) => (
                <div key={id} className="flex justify-between items-center text-xs text-slate-300 font-mono">
                  <span>
                    {item.ledgerName} ({(item.rate * 100).toFixed(1)}%)
                  </span>
                  <span>{formatValue(item.amount)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Validation Box */}
          <div className="bg-white border border-[#141414] p-3 space-y-2">
            <span className="text-[10px] font-bold font-mono text-[#141414] tracking-widest block uppercase border-b border-[#141414] pb-1">
              Regional Compliance Gate Check
            </span>
            <div className="space-y-2">
              {activePreset.complianceFields.map((field, index) => {
                const isFieldPresent = (field.includes('ID') && taxIdInput.trim().length > 3) || !field.includes('ID');
                return (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-[11px] text-[#141414] font-sans font-medium">{field}</span>
                    {isFieldPresent ? (
                      <span className="flex items-center space-x-1 bg-green-100 border border-green-800 text-green-950 px-1 py-0.5 font-mono text-[9px] font-bold">
                        <CheckCircle2 className="w-3 h-3 text-green-700" />
                        <span>ACTIVE</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 bg-orange-100 border border-orange-800 text-orange-950 px-1 py-0.5 font-mono text-[9px] font-bold">
                        <AlertTriangle className="w-3 h-3 text-orange-700 animate-pulse" />
                        <span>MISSING</span>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
