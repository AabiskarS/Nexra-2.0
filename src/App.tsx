/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Building2, 
  Library, 
  Calculator, 
  FileCode, 
  Languages, 
  Cpu, 
  Terminal, 
  Clock, 
  User2, 
  ShieldCheck, 
  Layers, 
  Search,
  BadgeAlert,
  HelpCircle,
  TrendingUp,
  LineChart
} from 'lucide-react';

import DoubleEntryJournal from './components/DoubleEntryJournal';
import TaxEnginePlayground from './components/TaxEnginePlayground';
import InvoiceBuilder from './components/InvoiceBuilder';
import I18nLocalizer from './components/I18nLocalizer';
import PluginManager from './components/PluginManager';
import ArchitectureHub from './components/ArchitectureHub';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('ledger');
  const [selectedCompany, setSelectedCompany] = useState<string>('DE');
  const [systemTime, setSystemTime] = useState<string>('2026-05-25 14:00:00 UTC');

  // Realistic dynamic clock tracking
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setSystemTime(now.getUTCFullYear() + '-' + 
                    String(now.getUTCMonth() + 1).padStart(2, '0') + '-' + 
                    String(now.getUTCDate()).padStart(2, '0') + ' ' + 
                    String(now.getUTCHours()).padStart(2, '0') + ':' + 
                    String(now.getUTCMinutes()).padStart(2, '0') + ':' + 
                    String(now.getUTCSeconds()).padStart(2, '0') + ' UTC');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getCompanyLabel = (code: string) => {
    switch (code) {
      case 'US': return 'Nexra Core Inc. (Austin, US - USD)';
      case 'UK': return 'Nexra UK Limited (London, UK - GBP)';
      case 'IN': return 'Nexra India Private Ltd (Delhi, IN - INR)';
      case 'JP': return 'Nexra Tokyo KK (Chiyoda, JP - JPY)';
      case 'AU': return 'Nexra Australia PTY LTD (Sydney, AU - AUD)';
      default: return 'Nexra Solutions GmbH (Berlin, DE - EUR)';
    }
  };

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] flex flex-col font-sans select-none antialiased" id="nexra-erp-portal-container">
      
      {/* Upper Global Platform Header */}
      <header className="h-12 border-b border-[#141414] flex items-center justify-between px-6 bg-white text-[#141414]">
        
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 bg-orange-500 rounded flex items-center justify-center font-bold text-[#141414] border border-[#141414]">
            NX
          </div>
          <div>
            <span className="font-display font-black text-sm tracking-tight text-[#141414] block leading-none">
              NEXRA <span className="font-serif italic font-normal text-xs text-[#141414]/80">ERP Portal</span>
            </span>
            <span className="text-[8px] font-mono uppercase text-[#141414]/60 tracking-wider block font-bold leading-none mt-0.5">
              Accounting Core v4.12
            </span>
          </div>
        </div>

        {/* Global Multi-company Selector */}
        <div className="flex items-center space-x-2 bg-slate-100 border border-[#141414] px-2.5 py-1">
          <Building2 className="w-3.5 h-3.5 text-[#141414]" />
          <div className="flex items-center gap-1.5">
            <span className="header-serif text-xs italic text-slate-500">Entity:</span>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#141414] focus:outline-hidden py-0 cursor-pointer border-none"
              id="company-context-selector"
            >
              <option value="DE">Nexra Solutions GmbH (Berlin, DE)</option>
              <option value="US">Nexra Core Inc. (Austin, US)</option>
              <option value="UK">Nexra UK Limited (London, UK)</option>
              <option value="IN">Nexra India Private Ltd (Delhi, IN)</option>
              <option value="JP">Nexra Tokyo KK (Chiyoda, JP)</option>
              <option value="AU">Nexra Australia PTY LTD (Sydney, AU)</option>
            </select>
          </div>
        </div>

        {/* Live Clock & Identity badges */}
        <div className="flex items-center space-x-4">
          {/* UTC Clock Badge */}
          <div className="hidden sm:flex items-center space-x-1.5 text-slate-500 font-mono text-xs">
            <Clock className="w-3.5 h-3.5 text-[#141414]" />
            <span className="font-medium tracking-tight whitespace-nowrap text-[#141414] text-[11px]">{systemTime}</span>
          </div>

          {/* User Auth Info Custom Injection */}
          <div className="flex items-center space-x-2 border-l border-[#141414] pl-4 h-6">
            <div className="w-5 h-5 rounded-full bg-orange-200 flex items-center justify-center text-[10px] font-bold text-[#141414]">
              U
            </div>
            <div className="text-left leading-none hidden md:block">
              <span className="text-xs font-bold font-sans text-[#141414] block">aabiskar4841@gmail.com</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Core Platform Content Workspace */}
      <div className="flex-1 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-[#141414]">
        
        {/* Left Side Navigation and Operations Summary Panel */}
        <aside className="w-full md:w-56 bg-[#141414] text-white flex-shrink-0 flex flex-col justify-between p-4 space-y-6">
          
          {/* Operations Menu Selectors */}
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-bold font-mono tracking-widest text-slate-400 opacity-40 uppercase block mb-2">
                Accounting Core
              </span>
              <nav className="space-y-1" id="main-navigation-panel">
                <button
                  onClick={() => setActiveTab('ledger')}
                  className={`w-full flex items-center space-x-2 px-2 py-1.5 text-xs font-semibold ${
                    activeTab === 'ledger'
                      ? 'bg-white/15 text-orange-400 font-bold border-l-2 border-orange-500'
                      : 'text-slate-350 opacity-70 hover:opacity-100 hover:bg-white/5'
                  }`}
                  id="tab-ledger"
                >
                  <Library className="w-3.5 h-3.5" />
                  <span>General Ledger</span>
                </button>

                <button
                  onClick={() => setActiveTab('tax')}
                  className={`w-full flex items-center space-x-2 px-2 py-1.5 text-xs font-semibold ${
                    activeTab === 'tax'
                      ? 'bg-white/15 text-orange-400 font-bold border-l-2 border-orange-500'
                      : 'text-slate-350 opacity-70 hover:opacity-100 hover:bg-white/5'
                  }`}
                  id="tab-tax"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Global Tax Engine</span>
                </button>

                <button
                  onClick={() => setActiveTab('invoice')}
                  className={`w-full flex items-center space-x-2 px-2 py-1.5 text-xs font-semibold ${
                    activeTab === 'invoice'
                      ? 'bg-white/15 text-orange-400 font-bold border-l-2 border-orange-500'
                      : 'text-slate-350 opacity-70 hover:opacity-100 hover:bg-white/5'
                  }`}
                  id="tab-invoice"
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>SAF-T & PEPPOL Standard</span>
                </button>

                <button
                  onClick={() => setActiveTab('i18n')}
                  className={`w-full flex items-center space-x-2 px-2 py-1.5 text-xs font-semibold ${
                    activeTab === 'i18n'
                      ? 'bg-white/15 text-orange-400 font-bold border-l-2 border-orange-500'
                      : 'text-slate-350 opacity-70 hover:opacity-100 hover:bg-white/5'
                  }`}
                  id="tab-i18n"
                >
                  <Languages className="w-3.5 h-3.5" />
                  <span>Regional Localizer</span>
                </button>
              </nav>
            </div>

            <div>
              <span className="text-[10px] font-bold font-mono tracking-widest text-slate-400 opacity-40 uppercase block mb-2">
                Compliance & Orchestration
              </span>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('plugins')}
                  className={`w-full flex items-center space-x-2 px-2 py-1.5 text-xs font-semibold ${
                    activeTab === 'plugins'
                      ? 'bg-white/15 text-orange-400 font-bold border-l-2 border-orange-500'
                      : 'text-slate-350 opacity-70 hover:opacity-100 hover:bg-white/5'
                  }`}
                  id="tab-plugins"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Compliance Modules</span>
                </button>

                <button
                  onClick={() => setActiveTab('specs')}
                  className={`w-full flex items-center space-x-2 px-2 py-1.5 text-xs font-semibold ${
                    activeTab === 'specs'
                      ? 'bg-white/15 text-orange-400 font-bold border-l-2 border-orange-500'
                      : 'text-slate-350 opacity-70 hover:opacity-100 hover:bg-white/5'
                  }`}
                  id="tab-specs"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Specification Spec Hub</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Sidebar Operations Metadata and Health */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <span className="text-[10px] tracking-widest text-slate-400 font-bold opacity-40 block">
              SYSTEM DIAGNOSTICS
            </span>
            <div className="space-y-1.5 text-[10px] font-mono text-slate-300">
              <div className="flex items-center justify-between">
                <span>Auditing:</span>
                <span className="text-orange-400 font-bold flex items-center">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  <span>IMMUTABLE</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Database:</span>
                <span className="text-yellow-400">SYNC_IDLE</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Node Clusters:</span>
                <span className="text-green-400">PROD_CLUSTER01</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Dynamic Contents Section */}
        <main className="flex-1 p-4 overflow-y-auto space-y-4">
          
          {/* Active Context Banner */}
          <div className="p-3 bg-white grid-border flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 border border-[#141414] text-[#141414] p-1.5 font-bold text-xs uppercase font-mono">
                Context
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-500 font-bold uppercase block leading-none">Active Corporate Domain</span>
                <h2 className="header-serif text-slate-900 text-sm mt-0.5" id="company-label-display">
                  {getCompanyLabel(selectedCompany)}
                </h2>
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-slate-100 px-2 py-1 border border-[#141414] text-[10px] font-mono">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              <span className="uppercase font-bold text-slate-700">
                DJP / IRAS / ATO Gateway Online
              </span>
            </div>
          </div>

          {/* Swapped Tab Layout Renders */}
          <div className="min-h-[500px]">
            {activeTab === 'ledger' && <DoubleEntryJournal />}
            {activeTab === 'tax' && <TaxEnginePlayground />}
            {activeTab === 'invoice' && <InvoiceBuilder />}
            {activeTab === 'i18n' && <I18nLocalizer />}
            {activeTab === 'plugins' && <PluginManager />}
            {activeTab === 'specs' && <ArchitectureHub />}
          </div>
        </main>
      </div>

      {/* Corporate Platform Footer */}
      <footer className="h-7 bg-white border-t border-[#141414] px-4 flex items-center justify-between text-[10px] text-[#141414] font-mono">
        <div className="flex gap-4">
          <span>SYSTEM: NEXRA-v4.12.0-CORE</span>
          <span className="opacity-65">•</span>
          <span>COMPLIANCE: SAF-T, HMRC MTD, PEPPOL BIS 3</span>
        </div>
        <div className="flex gap-4 font-mono">
          <span>LATENCY: 12ms</span>
          <span>REGION: AP-NORTHEAST-1</span>
          <span>SSL_IMMUTABLE_ON</span>
        </div>
      </footer>
    </div>
  );
}
