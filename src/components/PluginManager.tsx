/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { TargetRegion, PluginMeta } from '../types';
import { Terminal, Cpu, Play, Power, Layers, Plus, ShieldCheck, CheckCircle2 } from 'lucide-react';

const INITIAL_PLUGINS: PluginMeta[] = [
  { id: '1', name: 'nexra-plugin-eu-vat.wasm', version: 'v3.4.1', author: 'Nexra Core Group', region: 'EU', status: 'active', eventsHooked: ['TAX_CALCULATE_EVENT', 'ON_POST_VALIDATION', 'PEPPOL_UBL_EXPORT'] },
  { id: '2', name: 'nexra-plugin-uk-mtd.js', version: 'v2.1.0', author: 'UK HMRC dev', region: 'UK', status: 'active', eventsHooked: ['TAX_SUBMIT', 'MTD_DIGITAL_SIGN'] },
  { id: '3', name: 'nexra-plugin-us-nexus.js', version: 'v4.0.2', author: 'Nexra US Tax LLC', region: 'US', status: 'active', eventsHooked: ['TAX_CALCULATE_EVENT', 'NEXUS_RESOLVER', '1099_W2_DIGEST'] },
  { id: '4', name: 'nexra-plugin-in-gst.js', version: 'v3.2.0', author: 'SAARC ERP Solutions', region: 'IN', status: 'active', eventsHooked: ['TAX_CALCULATE_EVENT', 'HSN_VALIDATION_EVENT', 'EWAY_IRN_SIGN'] },
  { id: '5', name: 'nexra-plugin-jp-invoice.wasm', version: 'v1.12.0', author: 'Nexra Tokyo Team', region: 'JP', status: 'active', eventsHooked: ['TAX_CALCULATE_EVENT', 'REIWA_ERA_CONVERT', 'QUALIFIED_T_CHECK'] },
  { id: '6', name: 'nexra-plugin-au-bas.js', version: 'v2.4.0', author: 'ATO Developer Portal', region: 'AU', status: 'active', eventsHooked: ['BAS_REPORT_COMPILE', 'SUPER_COMPUTE_EVENT'] }
];

export default function PluginManager() {
  const [plugins, setPlugins] = useState<PluginMeta[]>(INITIAL_PLUGINS);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    '[SYSTEM INIT] Bootstrapping country isolated plugin container...',
    '[CORE] Initializing WASM JIT compiler context...',
    '[REGISTRY] Scanning nexra/packages/plugins for compliant structures...',
    '[OK] nexra-plugin-eu-vat.wasm (v3.4.1) initialized successfully. Hooked: TAX_CALCULATE_EVENT',
    '[OK] nexra-plugin-uk-mtd.js (v2.1.0) initialized. MTD portal proxy running standard SSL.',
    '[OK] nexra-plugin-us-nexus.js (v4.0.2) initialized. ZIP database indexed with 43,210 postal codes.',
    '[OK] nexra-plugin-in-gst.js (v3.2.0) verified. IRN encryption standards aligned.',
    '[OK] nexra-plugin-jp-invoice.wasm (v1.12.0) mounted. Consumption decimal truncation active.',
    '[OK] nexra-plugin-au-bas.js (v2.4.0) verified. Single Touch Payroll v2 engine mounted.',
    '[SYSTEM REGISTER] Plugin load chain successful. 6/6 regional modules fully active.'
  ]);

  const addLog = (msg: string) => {
    setConsoleLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // Toggle state
  const handleToggleState = (id: string) => {
    const updated = plugins.map((p) => {
      if (p.id === id) {
        const nextStatus = p.status === 'active' ? 'inactive' : 'active';
        addLog(`Plugin ${p.name} status shifted to: ${nextStatus.toUpperCase()}`);
        return { ...p, status: nextStatus };
      }
      return p;
    });
    setPlugins(updated);
  };

  // Simulate installing custom plugins (ASEAN examples)
  const handleInstallAseanModule = (name: string, region: TargetRegion) => {
    // Check if duplicate
    if (plugins.some((p) => p.region === region)) {
      addLog(`[ERROR] Region container ${region} is already registered to a compiled plugin! Uninstall previous first.`);
      return;
    }

    const newPlugin: PluginMeta = {
      id: `plugin-as-${Date.now()}`,
      name: `${name}.js`,
      version: 'v1.0.0',
      author: 'ASEAN ERP Devs',
      region,
      status: 'active',
      eventsHooked: ['TAX_CALCULATE_EVENT', 'ASEAN_TAX_INVOICING']
    };

    setPlugins([...plugins, newPlugin]);
    addLog(`[INSTALL] Unpacking compiled bundle ${name}.js...`);
    addLog(`[REGISTRY] Sandboxing runtime resources for regional scope: ${region}`);
    addLog(`[OK] Mounted ${name}.js (v1.0.0) successfully. Exposed API endpoints: /api/v1/tax/${region.toLowerCase()}/*`);
  };

  return (
    <div className="bg-white grid-border overflow-hidden h-full flex flex-col" id="plugin-manager-root">
      
      {/* Title */}
      <div className="border-b border-[#141414] px-4 py-2 flex items-center justify-between bg-white text-[#141414]">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-[#141414]" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#141414]">
            Country Localization Plugin Manager
          </h2>
        </div>
        <span className="text-[9px] text-[#141414] font-mono uppercase bg-slate-100 border border-[#141414] px-1.5 py-0.5 font-bold">
          Plugin Architecture
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 divide-y xl:divide-y-0 xl:divide-x divide-[#141414] flex-1">
        
        {/* Left Interactive Grid */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#141414] pb-1.5">
            <span className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest">
              Installed Country Isolation Plugins
            </span>
            <div className="flex items-center space-x-1.5">
              {/* Quickly seed Singapore, Malaysia, Indonesia ASEAN modules */}
              <button
                onClick={() => handleInstallAseanModule('nexra-plugin-sg-iras', 'SG')}
                className="text-[9px] bg-white border border-[#141414] hover:bg-slate-100 text-[#141414] font-bold px-2 py-0.5 font-mono uppercase rounded-none"
              >
                + SG Plugin
              </button>
              <button
                onClick={() => handleInstallAseanModule('nexra-plugin-my-sst', 'MY')}
                className="text-[9px] bg-white border border-[#141414] hover:bg-slate-100 text-[#141414] font-bold px-2 py-0.5 font-mono uppercase rounded-none"
              >
                + MY Plugin
              </button>
            </div>
          </div>

          <div className="space-y-2 max-h-[190px] md:max-h-[460px] overflow-y-auto pr-1">
            {plugins.map((p) => (
              <div
                key={p.id}
                className={`p-2.5 border flex items-center justify-between transition rounded-none ${
                  p.status === 'active' ? 'bg-white border-[#141414]' : 'bg-slate-50 border-slate-300 text-slate-450'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-slate-800">{p.name}</span>
                    <span className="text-[9px] bg-slate-250 border border-slate-400 px-1 font-mono font-bold text-slate-700 data-mono">
                      {p.version}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-medium">
                    <span>Region: {p.region}</span>
                    <span>•</span>
                    <span>By: {p.author}</span>
                  </div>
                  {/* Hook events list */}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {p.eventsHooked.map((hook, hidx) => (
                      <span
                        key={hidx}
                        className={`text-[8px] font-mono px-1 py-0.5 border ${
                          p.status === 'active'
                            ? 'bg-orange-50 text-orange-700 border-orange-200 font-semibold'
                            : 'bg-slate-150 text-slate-430 border-transparent'
                        }`}
                      >
                        {hook}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Activation details */}
                <button
                  onClick={() => handleToggleState(p.id)}
                  className={`p-1.5 border transition rounded-none ${
                    p.status === 'active'
                      ? 'text-emerald-600 border-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                      : 'text-slate-400 border-slate-300 bg-slate-100/50 hover:bg-slate-200'
                  }`}
                  id={`toggle-plugin-${p.id}`}
                >
                  <Power className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Console Log Terminal */}
        <div className="p-4 flex flex-col justify-between space-y-3 max-h-[500px]">
          <div className="flex items-center justify-between border-b border-[#141414] pb-2">
            <div className="flex items-center space-x-1.5">
              <Terminal className="w-4 h-4 text-[#141414]" />
              <span className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest">
                Plugin Orchestrator Terminal Output
              </span>
            </div>
            <button
              onClick={() => setConsoleLogs([])}
              className="text-[9px] font-mono text-slate-550 hover:text-black border border-slate-300 px-1.5 py-0.5 uppercase font-bold bg-white"
            >
              Clear
            </button>
          </div>

          <div className="flex-1 bg-[#141414] p-3 font-mono text-[10px] text-emerald-400 overflow-y-auto max-h-[280px] space-y-1 border border-[#141414] scrollbar-thin">
            {consoleLogs.map((log, idx) => (
              <div key={idx} className="leading-relaxed whitespace-pre-wrap select-all">
                {log}
              </div>
            ))}
          </div>

          {/* Core capability summary */}
          <div className="p-3 bg-slate-100 border border-[#141414] flex items-start space-x-3">
            <Layers className="w-4 h-4 text-[#141414] flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-slate-800 font-sans block">Dynamic Custom Webhooks Hooking</span>
              <p className="text-slate-500 font-sans leading-relaxed">
                Plugins compile down to WASM or run via Node.js isolation containers inside general ledger lifecycle hooks, dynamically executing state taxation without bloated codebases.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
