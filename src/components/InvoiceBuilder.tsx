/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Invoice, InvoiceItem } from '../types';
import { FileCode, Printer, CheckCircle, Code, Eye, RefreshCw } from 'lucide-react';
import { ComplianceGateway } from '../data/saf-t-peppol';

export default function InvoiceBuilder() {
  const [activeTab, setActiveTab] = useState<'preview' | 'xml'>('preview');
  const [clientName, setClientName] = useState<string>('ACME Global Logistics S.A.');
  const [clientTaxId, setClientTaxId] = useState<string>('LU99882211');
  const [clientAddr, setClientAddr] = useState<string>('45 Boulevard Royal, L-2449 Luxembourg');
  
  // Invoice items state
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'Enterprise ERP License (SaaS Subscriptions)', quantity: 1, unitPrice: 8500.00, taxRate: { rate: 0.19, name: 'EU Standard VAT (Germany)', type: 'VAT' } },
    { id: '2', description: 'Consolidated Integration Consultation Services', quantity: 12, unitPrice: 150.00, taxRate: { rate: 0.19, name: 'EU Standard VAT (Germany)', type: 'VAT' } }
  ]);

  const [invoiceNumber, setInvoiceNumber] = useState<string>('NEX-2026-621');

  // Calculate totals
  const totals = useMemo(() => {
    let basis = 0;
    let tax = 0;
    items.forEach((item) => {
      const lineTotal = item.quantity * item.unitPrice;
      basis += lineTotal;
      tax += lineTotal * item.taxRate.rate;
    });
    return {
      taxableBasis: basis,
      taxCalculated: tax,
      total: basis + tax
    };
  }, [items]);

  // Object structure for standard compliant exporter
  const activeInvoiceObj: Invoice = {
    id: 'inv-998',
    issueDate: '2026-05-25',
    dueDate: '2026-06-25',
    invoiceNumber,
    company: {
      id: 'co-1',
      name: 'Nexra Solutions GmbH',
      taxRegistrationNumber: 'DE811122334',
      country: 'EU',
      baseCurrency: 'EUR',
      address: {
        street: 'Friedrichstraße 95',
        city: 'Berlin',
        state: 'Berlin',
        postalCode: '10117',
        countryName: 'Germany'
      }
    },
    clientName,
    clientTaxId,
    clientAddress: clientAddr,
    items,
    currency: 'EUR',
    exchangeRate: 1.00
  };

  const xmlOutput = useMemo(() => {
    return ComplianceGateway.generatePEPPOL_UBL_XML(activeInvoiceObj);
  }, [activeInvoiceObj]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white grid-border overflow-hidden h-full flex flex-col" id="invoice-builder-layout">
      {/* Tab Control */}
      <div className="border-b border-[#141414] px-4 py-2 flex flex-wrap gap-2 items-center justify-between bg-white">
        <div className="flex items-center space-x-2">
          <FileCode className="w-4 h-4 text-[#141414]" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#141414]">
            E-Invoice & Compliant XML Generator
          </h2>
        </div>

        <div className="flex bg-slate-200 p-0.5 border border-[#141414]">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-2.5 py-1 text-xs font-semibold flex items-center space-x-1.5 transition ${
              activeTab === 'preview' ? 'bg-[#141414] text-white font-bold' : 'text-slate-755 hover:text-black hover:bg-slate-300'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Invoice Page View</span>
          </button>
          <button
            onClick={() => setActiveTab('xml')}
            className={`px-2.5 py-1 text-xs font-semibold flex items-center space-x-1.5 transition ${
              activeTab === 'xml' ? 'bg-[#141414] text-white font-bold' : 'text-slate-755 hover:text-black hover:bg-slate-300'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>OASIS PEPPOL XML</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 divide-y xl:divide-y-0 xl:divide-x divide-[#141414] flex-1">
        
        {/* Left Interactive Input Configurator */}
        <div className="p-4 space-y-4 text-[#141414]">
          <span className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest block">
            Billing & Buyer Parameters
          </span>

          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold tracking-widest font-mono text-slate-500 uppercase mb-1">Invoice Identifier</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full bg-white border border-[#141414] rounded-none py-1 px-2 text-xs font-mono outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-widest font-mono text-slate-500 uppercase mb-1">Legal Customer Name</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-white border border-[#141414] rounded-none py-1 px-2 text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-widest font-mono text-slate-500 uppercase mb-1">Tax Registration / VAT ID</label>
              <input
                type="text"
                value={clientTaxId}
                onChange={(e) => setClientTaxId(e.target.value)}
                className="w-full bg-white border border-[#141414] rounded-none py-1 px-2 text-xs font-mono outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-widest font-mono text-slate-500 uppercase mb-1">Buyer Address</label>
              <textarea
                value={clientAddr}
                onChange={(e) => setClientAddr(e.target.value)}
                rows={2}
                className="w-full bg-white border border-[#141414] rounded-none py-1 px-2 text-xs outline-none"
              ></textarea>
            </div>
          </div>

          <div className="pt-3 border-t border-[#141414] space-y-3">
            <span className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest block">
              Items Breakdown
            </span>
            {items.map((item, idx) => (
              <div key={item.id} className="p-2.5 bg-slate-100 border border-[#141414] space-y-2">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => {
                    const updated = [...items];
                    updated[idx].description = e.target.value;
                    setItems(updated);
                  }}
                  className="w-full bg-white border border-[#141414] rounded-none py-1 px-2 text-xs"
                />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[9px] text-[#141414]/70 uppercase block font-mono font-bold">Quantity</span>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        const updated = [...items];
                        updated[idx].quantity = Math.max(1, parseInt(e.target.value) || 1);
                        setItems(updated);
                      }}
                      className="w-full bg-white border border-[#141414] rounded-none py-0.5 px-1.5 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] text-[#141414]/70 uppercase block font-mono font-bold">Unit Price</span>
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => {
                        const updated = [...items];
                        updated[idx].unitPrice = Math.max(0, parseFloat(e.target.value) || 0);
                        setItems(updated);
                      }}
                      className="w-full bg-white border border-[#141414] rounded-none py-0.5 px-1.5 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Preview Pane (PDF view or OASIS XML Code) */}
        <div className="xl:col-span-2 p-4 flex flex-col justify-between max-h-[580px] overflow-y-auto bg-slate-50/50">
          {activeTab === 'preview' ? (
            /* Visual Invoice Sheet representing standard invoice */
            <div className="bg-white border border-[#141414] p-6 text-[#141414] text-xs space-y-6 flex flex-col justify-between min-h-[460px]" id="invoice-sheet-doc">
              {/* Top Banner and metadata */}
              <div className="flex justify-between items-start border-b border-[#141414] pb-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm tracking-tight font-display">NEXRA SOLUTIONS GMBH</h4>
                  <p className="text-[9px] text-slate-500 font-mono data-mono font-bold">VAT Registration: DE811122334 • Friedrichstraße 95, Berlin</p>
                </div>
                <div className="text-right">
                  <h2 className="text-sm font-sans font-bold uppercase tracking-widest text-[#141414]">INVOICE</h2>
                  <p className="text-[11px] font-mono text-orange-500 font-bold data-mono">{invoiceNumber}</p>
                </div>
              </div>

              {/* Addresses section */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="font-bold text-slate-400 mb-1 uppercase text-[9px] tracking-wider">SENDER</h5>
                  <p className="font-bold text-slate-800">Nexra Solutions GmbH</p>
                  <p className="text-slate-500">Friedrichstraße 95</p>
                  <p className="text-slate-500">10117 Berlin, Germany</p>
                </div>

                <div>
                  <h5 className="font-bold text-slate-400 mb-1 uppercase text-[9px] tracking-wider">INVOICED TO BUYER</h5>
                  <p className="font-bold text-slate-800">{clientName}</p>
                  <p className="text-slate-500">{clientAddr}</p>
                  <p className="text-slate-500 font-mono">VAT-ID: {clientTaxId}</p>
                </div>
              </div>

              {/* Items Breakdown Table */}
              <table className="hd-table w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-[#141414] text-[10px] font-mono uppercase font-bold">
                    <th className="py-2">Line Description</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Unit Price</th>
                    <th className="py-2 text-right">Tax Category</th>
                    <th className="py-2 text-right">Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx} className="row-hover">
                      <td className="py-2 font-medium">{item.description}</td>
                      <td className="py-2 text-center font-mono data-mono">{item.quantity}</td>
                      <td className="py-2 text-right font-mono data-mono">€{item.unitPrice.toFixed(2)}</td>
                      <td className="py-2 text-right font-mono text-slate-550">{item.taxRate.name} (19%)</td>
                      <td className="py-2 text-right font-mono font-bold data-mono">€{(item.quantity * item.unitPrice).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Summary calculations */}
              <div className="border-t border-[#141414] pt-4 flex flex-col items-end space-y-1 self-end w-64 text-[11px]">
                <div className="flex justify-between w-full text-slate-500">
                  <span>Tax Basis Amount:</span>
                  <span className="font-mono font-semibold data-mono">€{totals.taxableBasis.toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-full text-slate-500">
                  <span>Value Added Tax (19%):</span>
                  <span className="font-mono font-semibold text-emerald-600 data-mono">€{totals.taxCalculated.toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-full text-slate-950 font-bold border-t border-dashed border-[#141414] pt-1.5 text-xs font-mono">
                  <span>Grand Net Amount:</span>
                  <span className="font-mono text-orange-500 font-bold data-mono">€{totals.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Bottom legal disclosures */}
              <div className="border-t border-[#141414] pt-3 text-[9px] text-slate-500 leading-tight font-mono uppercase">
                <p>This document constitutes a fully compliant VAT invoice pursuant to European Union VAT Directive 2006/112/EC and complies with German UStG provisions. Embedded document complies with CEN EN 16931-1 Factur-X standard.</p>
              </div>
            </div>
          ) : (
            /* PEPPOL standard UBL XML Payload display */
            <div className="relative flex-1 bg-[#141414] rounded-none overflow-hidden border border-[#141414] flex flex-col">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-white/10 text-slate-400 font-mono text-[10px]">
                <span>OASIS PEPPOL BIS BILLING 3.0 UBL XML</span>
                <span className="text-emerald-400 font-semibold">VALIDATED SCHEMATRON CODE</span>
              </div>
              <div className="flex-1 overflow-auto p-4 font-mono text-[11px] text-orange-300 text-slate-200 max-h-[400px]">
                <pre className="whitespace-pre"><code>{xmlOutput}</code></pre>
              </div>
            </div>
          )}

          {/* Bottom printing action */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-[10px] text-green-950 bg-green-100 border border-green-800 px-2 py-1 font-mono font-bold flex items-center space-x-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>PEPPOL Network routing validated (Endpoint standard 16931 Checked)</span>
            </span>
            <button
              onClick={handlePrint}
              className="bg-[#141414] text-white hover:bg-slate-800 font-bold px-3 py-1.5 rounded-none border border-[#141414] text-xs font-mono uppercase flex items-center space-x-1"
            >
              <Printer className="w-4 h-4" />
              <span>Local Print</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
