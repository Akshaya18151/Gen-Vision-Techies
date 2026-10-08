'use client';

import React from 'react';
import { ShieldCheck, Cpu, Activity, Lock } from 'lucide-react';

interface HeaderProps {
  apiStatus: 'online' | 'offline' | 'checking';
  activeModel: string;
}

export const Header: React.FC<HeaderProps> = ({ apiStatus, activeModel }) => {
  return (
    <header className="sticky top-0 z-50 border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-[1px] shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
                ScamShield
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                AI MVP
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Open-Weight AI Scam & Threat Detection
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm text-slate-300">
          <a href="#analyzer" className="hover:text-cyan-400 transition-colors">Analyzer</a>
          <a href="#examples" className="hover:text-cyan-400 transition-colors">Test Presets</a>
          <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</a>
        </nav>

        {/* Status Indicators */}
        <div className="flex items-center space-x-3 text-xs">
          {/* Active AI Model Pill */}
          <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-medium text-slate-400">Model:</span>
            <span className="text-[11px] font-semibold text-cyan-300">{activeModel}</span>
          </div>

          {/* Backend Status Pill */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800">
            <span className={`w-2 h-2 rounded-full ${
              apiStatus === 'online' ? 'bg-emerald-400 animate-pulse' :
              apiStatus === 'offline' ? 'bg-rose-500' : 'bg-amber-400 animate-ping'
            }`} />
            <span className="text-[11px] font-medium text-slate-300">
              {apiStatus === 'online' ? 'API Online' : apiStatus === 'offline' ? 'API Standby' : 'Connecting...'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
