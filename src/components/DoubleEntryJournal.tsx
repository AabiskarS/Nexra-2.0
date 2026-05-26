/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { JournalEntry, JournalLine, LedgerAccount } from '../types';
import { Library, AlertCircle, CheckCircle2, Lock, Unlock, Hash, Plus, Trash2, Coins } from 'lucide-react';

const CHART_OF_ACCOUNTS: LedgerAccount[] = [
  { code: '1010', name: 'Cash and Cash Equivalents', type: 'Asset', balance: 145000.00 },
  { code: '1200', name: 'Accounts Receivable', type: 'Asset', balance: 52000.00 },
  { code: '2110', name: 'Tax Liability (VAT/GST Collected)', type: 'Liability', balance: 15400.00 },
  { code: '3100', name: 'Shareholders Retained Earnings', type: 'Equity', balance: 100000.00 },
  { code: '4000', name: 'SaaS Software Service Licenses', type: 'Revenue', balance: 85000.00 },
  { code: '5010', name: 'Cloud Infrastructure Expenses', type: 'Expense', balance: 3400.00 }
];

export default function DoubleEntryJournal() {
  const [journalReference, setJournalReference] = useState<string>('JE-2026-05-01');
  const [journalDesc, setJournalDesc] = useState<string>('Accrued SaaS License Sales & Regional Tax Liability');
  const [isFiscalLocked, setIsFiscalLocked] = useState<boolean>(false);
  const [postedEntries, setPostedEntries] = useState<JournalEntry[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [exchangeRate, setExchangeRate] = useState<number>(1.00);

  // Active Draft Entries
  const [draftLines, setDraftLines] = useState<JournalLine[]>([
    { accountCode: '1010', debit: 11900.00, credit: 0, currency: 'USD', exchangeRate: 1.0, localDebit: 11900.0, localCredit: 0.0 },
    { accountCode: '4000', debit: 0, credit: 10000.00, currency: 'USD', exchangeRate: 1.0, localDebit: 0.0, localCredit: 10000.0 },
    { accountCode: '2110', debit: 0, credit: 1900.00, currency: 'USD', exchangeRate: 1.0, localDebit: 0.0, localCredit: 1900.0 }
  ]);

  // Handle Multi-currency Adjustments to lines dynamically
  const applyCurrencyToDraft = (cur: string, rate: number) => {
    setSelectedCurrency(cur);
    setExchangeRate(rate);
    const updated = draftLines.map((l) => ({
      ...l,
      currency: cur,
      exchangeRate: rate,
      localDebit: l.debit * rate,
      localCredit: l.credit * rate
    }));
    setDraftLines(updated);
  };

  // Add line to draft
  const handleAddNewLine = () => {
    setDraftLines([
      ...draftLines,
      { accountCode: '5010', debit: 0, credit: 0, currency: selectedCurrency, exchangeRate, localDebit: 0, localCredit: 0 }
    ]);
  };

  const handleUpdateLine = (index: number, key: keyof JournalLine, val: any) => {
    const updated = [...draftLines];
    if (key === 'accountCode') {
      updated[index].accountCode = val;
    } else if (key === 'debit' || key === 'credit') {
      const num = Math.max(0, parseFloat(val) || 0);
      if (key === 'debit') {
        updated[index].debit = num;
        updated[index].credit = 0; // maintain single side entry
        updated[index].localDebit = num * exchangeRate;
        updated[index].localCredit = 0;
      } else {
        updated[index].credit = num;
        updated[index].debit = 0;
        updated[index].localCredit = num * exchangeRate;
        updated[index].localDebit = 0;
      }
    }
    setDraftLines(updated);
  };

  const handleDeleteLine = (index: number) => {
    if (draftLines.length <= 1) return;
    setDraftLines(draftLines.filter((_, i) => i !== index));
  };

  // Balancing Verification Logic (Double-Entry Guard)
  const balancingSummary = useMemo(() => {
    let totDebit = 0;
    let totCredit = 0;
    let totLocalDebit = 0;
    let totLocalCredit = 0;

    draftLines.forEach((line) => {
      totDebit += line.debit;
      totCredit += line.credit;
      totLocalDebit += line.debit * exchangeRate;
      totLocalCredit += line.credit * exchangeRate;
    });

    const difference = Math.abs(totLocalDebit - totLocalCredit);
    const Balanced = difference < 0.001;

    return {
      totDebit,
      totCredit,
      totLocalDebit,
      totLocalCredit,
      difference,
      Balanced
    };
  }, [draftLines, exchangeRate]);

  // Posting transaction executing strict checks
  const handlePostEntryToLedger = () => {
    if (isFiscalLocked) {
      alert('Forbidden: Fiscal lock is currently engaged.');
      return;
    }

    if (!balancingSummary.Balanced) {
      alert('Imbalanced Ledger Entry: Total Debits must precisely match Credits.');
      return;
    }

    const newEntry: JournalEntry = {
      id: `JE-TX-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      reference: journalReference,
      description: journalDesc,
      isPosted: true,
      isLocked: true,
      lines: [...draftLines]
    };

    setPostedEntries([newEntry, ...postedEntries]);
    
    // Clear draft line amounts keeping structural bones
    const cleanLines = draftLines.map(l => ({
      ...l,
      debit: 0,
      credit: 0,
      localDebit: 0,
      localCredit: 0
    }));
    setDraftLines(cleanLines);
  };

  // Mock ledger hash generation
  const computeHash = (entry: JournalEntry) => {
    return `sha256:fb4f971b${entry.lines.length}a9d${Math.floor(Math.random() * 899 + 100)}fe17dd8b8`;
  };

  return (
    <div className="bg-white grid-border overflow-hidden h-full flex flex-col" id="double-entry-workbench">
      {/* Header Panel */}
      <div className="border-b border-[#141414] px-4 py-2 flex flex-wrap gap-2 items-center justify-between bg-white">
        <div className="flex items-center space-x-2">
          <Library className="w-4 h-4 text-[#141414]" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#141414]">
            Ledger Journal Workpost
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          {/* Fiscal Lock toggle */}
          <button
            onClick={() => setIsFiscalLocked(!isFiscalLocked)}
            className={`flex items-center space-x-1 px-2.5 py-0.5 text-[10px] font-mono font-bold border transition-colors ${
              isFiscalLocked
                ? 'bg-rose-100 border-[#141414] text-rose-800'
                : 'bg-green-150 border-[#141414] text-green-900'
            }`}
            id="fiscal-lock-toggle"
          >
            {isFiscalLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
            <span>{isFiscalLocked ? 'FISCAL_LOCKED' : 'OPEN_PERIOD'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 divide-y xl:divide-y-0 xl:divide-x divide-[#141414] flex-1">
        
        {/* Left Double-Entry Input Portal */}
        <div className="xl:col-span-2 p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest mb-1">
                Ref # ID
              </label>
              <input
                type="text"
                value={journalReference}
                onChange={(e) => setJournalReference(e.target.value)}
                disabled={isFiscalLocked}
                className="w-full bg-white border border-[#141414] py-1 px-2 text-xs font-mono text-slate-900 outline-none disabled:opacity-50"
                id="ledger-ref-input"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest mb-1">
                Description / Narrative
              </label>
              <input
                type="text"
                value={journalDesc}
                onChange={(e) => setJournalDesc(e.target.value)}
                disabled={isFiscalLocked}
                className="w-full bg-white border border-[#141414] py-1 px-2 text-xs text-slate-900 outline-none disabled:opacity-50"
              />
            </div>
          </div>

          {/* Core multi-currency settings */}
          <div className="p-2 bg-slate-100 border border-[#141414] flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center space-x-1">
              <Coins className="w-3.5 h-3.5 text-slate-650" />
              <span className="text-[10px] font-mono text-slate-700 font-bold uppercase">Reporting Base: USD</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono uppercase text-slate-600">FX Currency:</span>
              <select
                value={selectedCurrency}
                onChange={(e) => {
                  const curr = e.target.value;
                  const rate = curr === 'EUR' ? 1.08 : curr === 'JPY' ? 0.0064 : curr === 'INR' ? 0.012 : 1.0;
                  applyCurrencyToDraft(curr, rate);
                }}
                disabled={isFiscalLocked}
                className="bg-white border border-[#141414] px-1 py-0.5 text-xs font-mono"
              >
                <option value="USD">USD (1.00x)</option>
                <option value="EUR">EUR (1.08x)</option>
                <option value="JPY">JPY (0.0064x)</option>
                <option value="INR">INR (0.012x)</option>
              </select>
            </div>
          </div>

          {/* Dynamic Lines Table */}
          <div className="overflow-x-auto">
            <table className="hd-table w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-900 text-[10px] uppercase font-bold">
                  <th className="py-1">Ledger Account</th>
                  <th className="py-1 text-right">Debit ({selectedCurrency})</th>
                  <th className="py-1 text-right">Credit ({selectedCurrency})</th>
                  <th className="py-1 text-right">Report Ledger (USD)</th>
                  <th className="py-1 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {draftLines.map((line, index) => (
                  <tr key={index} className="row-hover">
                    <td className="py-1 font-mono text-xs">
                      <select
                        value={line.accountCode}
                        onChange={(e) => handleUpdateLine(index, 'accountCode', e.target.value)}
                        disabled={isFiscalLocked}
                        className="bg-white border border-[#141414] rounded-none py-0.5 px-1 text-xs text-slate-900"
                      >
                        {CHART_OF_ACCOUNTS.map((acc) => (
                          <option key={acc.code} value={acc.code}>
                            {acc.code} - {acc.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-1">
                      <input
                        type="number"
                        value={line.debit || ''}
                        placeholder="0.00"
                        disabled={isFiscalLocked}
                        onChange={(e) => handleUpdateLine(index, 'debit', e.target.value)}
                        className="w-24 ml-auto text-right font-mono bg-white border border-[#141414] rounded-none py-0.5 px-1 text-xs focus:outline-none"
                      />
                    </td>

                    <td className="py-1">
                      <input
                        type="number"
                        value={line.credit || ''}
                        placeholder="0.00"
                        disabled={isFiscalLocked}
                        onChange={(e) => handleUpdateLine(index, 'credit', e.target.value)}
                        className="w-24 ml-auto text-right font-mono bg-white border border-[#141414] rounded-none py-0.5 px-1 text-xs focus:outline-none"
                      />
                    </td>

                    <td className="py-1 text-right text-xs font-mono text-slate-500 pr-2 data-mono">
                      {line.debit > 0
                        ? `$${(line.debit * exchangeRate).toFixed(2)} DR`
                        : line.credit > 0
                        ? `$${(line.credit * exchangeRate).toFixed(2)} CR`
                        : '$0.00'}
                    </td>

                    <td className="py-1 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteLine(index)}
                        disabled={isFiscalLocked}
                        className="text-rose-600 hover:text-white disabled:opacity-30 p-0.5 border border-[#141414] px-1 bg-white text-[10px]"
                      >
                        DEL
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Trigger Row */}
          <div className="flex items-center justify-between pt-4 border-t border-[#141414]">
            <button
              type="button"
              onClick={handleAddNewLine}
              disabled={isFiscalLocked}
              className="px-2.5 py-1.5 bg-white border border-[#141414] text-slate-900 hover:bg-slate-150 rounded-none text-xs font-mono uppercase flex items-center space-x-1 disabled:opacity-50 transition"
              id="add-ledger-line-btn"
            >
              <Plus className="w-3 h-3" />
              <span>Add Accounting Line</span>
            </button>

            <button
              type="button"
              onClick={handlePostEntryToLedger}
              disabled={isFiscalLocked || !balancingSummary.Balanced}
              className={`px-3 py-1.5 rounded-none text-xs font-mono uppercase font-bold leading-none flex items-center space-x-1 border transition ${
                balancingSummary.Balanced && !isFiscalLocked
                  ? 'bg-[#141414] text-white hover:bg-slate-800 border-[#141414]'
                  : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
              }`}
              id="post-ledger-entry-btn"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Post to Double-Entry Ledger</span>
            </button>
          </div>
        </div>

        {/* Right Audit Feed & Balancing State */}
        <div className="p-4 space-y-4 bg-slate-50 max-h-[500px] overflow-y-auto">
          
          {/* Unbalanced warning display */}
          <div className={`p-3 border flex items-start space-x-2.5 ${
            balancingSummary.Balanced
              ? 'bg-green-100 border-[#141414] text-green-950 font-medium'
              : 'bg-orange-100 border-[#141414] text-[#141414]'
          }`}>
            {balancingSummary.Balanced ? (
              <CheckCircle2 className="w-4 h-4 text-green-700 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="text-xs space-y-1">
              <span className="font-sans font-bold block leading-none">
                {balancingSummary.Balanced ? 'Double-Entry In Balance' : 'Awaiting Balance Adjustment'}
              </span>
              <span className="font-sans text-slate-700 block text-[11px] leading-relaxed">
                {balancingSummary.Balanced
                  ? 'Debits and Credits perfectly align in base currency. Safe to post.'
                  : `Out of balance by $${balancingSummary.difference.toFixed(2)} USD value.`}
              </span>
            </div>
          </div>

          {/* Ledger Historical Feed */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Hash className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-[10px] font-bold tracking-widest font-mono text-slate-500 uppercase">
                Posted Transactions Audit Logs
              </span>
            </div>

            {postedEntries.length === 0 ? (
              <div className="text-center p-6 bg-white border border-[#141414] text-xs text-slate-500 font-mono">
                No ledger transactions posted yet. Adjust values and post above.
              </div>
            ) : (
              <div className="space-y-2">
                {postedEntries.map((e) => (
                  <div key={e.id} className="bg-white border border-[#141414] p-3 space-y-2 text-xs relative overflow-hidden">
                    <div className="flex items-center justify-between border-b border-[#141414] pb-1">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{e.reference}</span>
                        <span className="text-[9px] text-slate-500 font-mono">{e.date}</span>
                      </div>
                      <span className="text-[9px] bg-[#141414] text-white px-1.5 py-0.5 font-mono font-medium">
                        POSTED
                      </span>
                    </div>

                    <p className="text-slate-700 font-sans text-[11px] leading-tight">
                      {e.description}
                    </p>

                    <div className="space-y-1">
                      {e.lines.map((l, lid) => (
                        <div key={lid} className="flex justify-between items-center text-[10px] font-mono p-1 bg-slate-100 border border-slate-200">
                          <span className="text-slate-600 font-bold">{l.accountCode}</span>
                          <span className={`${l.debit > 0 ? 'text-[#141414] font-bold' : 'text-slate-500'} data-mono`}>
                            {l.debit > 0 ? `DR $${(l.debit * l.exchangeRate).toFixed(2)}` : `CR $${(l.credit * l.exchangeRate).toFixed(2)}`}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Immutable audit block hash output */}
                    <div className="pt-2 border-t border-[#141414] mt-1 flex items-center justify-between text-[9px] font-mono text-slate-400 uppercase">
                      <span>Integrity Stamp</span>
                      <span className="text-[#141414] select-all font-semibold truncate max-w-[150px]">{computeHash(e)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
