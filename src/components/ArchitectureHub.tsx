/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ARCHITECTURES } from '../data/architectures';
import { Copy, Terminal, Shield, FolderGit2, Database, BrainCircuit, RefreshCw } from 'lucide-react';

export default function ArchitectureHub() {
  const [activeTab, setActiveTab ] = useState(ARCHITECTURES[0].id);
  const [copied, setCopied] = useState(false);

  const activeSpec = ARCHITECTURES.find((s) => s.id === activeTab) || ARCHITECTURES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSpec.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'Database': return <Database className="w-4 h-4 text-emerald-500" />;
      case 'Security': return <Shield className="w-4 h-4 text-rose-500" />;
      case 'Tax Engine': return <BrainCircuit className="w-4 h-4 text-cyan-500" />;
      default: return <FolderGit2 className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="bg-white grid-border overflow-hidden h-full flex flex-col" id="architecture-hub-container">
      {/* Tab Header Banner */}
      <div className="border-b border-[#141414] px-4 py-2 flex flex-wrap gap-2 items-center justify-between bg-white text-[#141414]">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-[#141414]" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#141414]">
            Core Master Engineering Architecture
          </h2>
        </div>
        <span className="text-[9px] text-[#141414] font-mono uppercase bg-slate-100 border border-[#141414] px-1.5 py-0.5 font-bold">
          Production-Ready Blueprints
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 flex-1 divide-y md:divide-y-0 md:divide-x divide-[#141414] min-h-[500px]">
        {/* Left Side Tab Selectors */}
        <div className="col-span-1 bg-slate-50 p-2 overflow-y-auto space-y-1.5 max-h-[180px] md:max-h-[540px]">
          {ARCHITECTURES.map((spec) => (
            <button
              key={spec.id}
              onClick={() => setActiveTab(spec.id)}
              className={`w-full text-left px-3 py-2 text-xs font-medium transition flex items-center space-x-2 rounded-none ${
                activeTab === spec.id
                  ? 'bg-[#141414] text-white font-bold'
                  : 'text-slate-800 hover:bg-slate-200 border-b border-transparent'
              }`}
              id={`spec-btn-${spec.id}`}
            >
              <div className="flex-shrink-0">
                {activeTab === spec.id ? <RefreshCw className="w-3.5 h-3.5 text-white animate-spin-slow" /> : getIcon(spec.category)}
              </div>
              <span className="truncate">{spec.title.split('. ')[1] || spec.title}</span>
            </button>
          ))}
        </div>

        {/* Right Code and Summary Area */}
        <div className="col-span-3 p-4 flex flex-col overflow-hidden max-h-[540px] text-[#141414] bg-slate-50/50">
          <div className="mb-4">
            <div className="flex items-center space-x-1.5 text-[9px] uppercase tracking-widest font-mono font-bold text-slate-500 mb-1">
              <span>{activeSpec.category}</span>
              <span>/</span>
              <span className="text-orange-600 font-bold">{activeSpec.language}</span>
            </div>
            <h4 className="font-sans font-bold text-slate-900 text-sm mb-1.5 uppercase">
              {activeSpec.title}
            </h4>
            <p className="text-xs text-slate-650 leading-relaxed font-sans font-medium">
              {activeSpec.summary}
            </p>
          </div>

          {/* Code Viewer Panel */}
          <div className="relative flex-1 bg-[#141414] border border-[#141414] flex flex-col rounded-none">
            <div className="flex items-center justify-between px-4 py-1.5 bg-slate-900 border-b border-white/10 text-slate-400">
              <span className="font-mono text-[9px] text-slate-500 uppercase font-bold tracking-widest">
                {activeSpec.language} Source Block
              </span>
              <button
                onClick={handleCopy}
                className="text-white bg-slate-800 hover:bg-slate-700 px-2 py-0.5 border border-white/15 transition flex items-center space-x-1.5 font-mono text-[10px] inline-flex rounded-none"
              >
                <Copy className="w-3 h-3" />
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 font-mono text-[11px] text-slate-250 leading-relaxed selection:bg-indigo-900">
              <pre className="whitespace-pre"><code>{activeSpec.content}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
