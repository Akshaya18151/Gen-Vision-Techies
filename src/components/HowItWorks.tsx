'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Network, 
  EyeOff, 
  AlertTriangle, 
  CheckCircle,
  FileSearch,
  Lock
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-12 border-t border-slate-800/80">
      <div className="max-w-3xl mb-10">
        <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">
          Architecture & Methodology
        </span>
        <h2 className="text-3xl font-extrabold text-white mt-1">
          How ScamShield Protects You
        </h2>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
          ScamShield couples state-of-the-art open-weight AI models (such as Qwen3) with real-time heuristic threat detection to identify social engineering, phishing, and scam schemes before damage occurs.
        </p>
      </div>

      {/* 3 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center mb-4">
            <FileSearch className="w-5 h-5 text-cyan-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            1. Pattern & Signal Extraction
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            The engine inspects structural indicators: artificial urgency, authority impersonation (IRS, banks, parcel delivery), deceptive domain redirection, and requests for irreversible payment methods.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center mb-4">
            <Cpu className="w-5 h-5 text-cyan-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            2. Open-Weight AI Reasoning
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Powered by open-weight AI (Qwen3), ScamShield contextualizes nuanced manipulation tricks. The open architecture guarantees portability across local hardware without cloud vendor lock-in.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center mb-4">
            <Lock className="w-5 h-5 text-cyan-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            3. Privacy-First Perimeters
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your personal SMS, emails, and sensitive communications can be evaluated on your local Ollama node. No confidential message data needs to be logged or harvested by third-party advertising servers.
          </p>
        </div>
      </div>

      {/* Behavioral Warning & Risk Scale Box */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 sm:p-8">
        <h3 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Responsible AI Transparency Principle</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          ScamShield adheres strictly to safety guidelines: <strong>the AI will never declare with 100% certainty that a message is definitely safe or definitely a scam</strong>. Threat actors alter domain structures and phrasing daily. ScamShield flags messages as &ldquo;potential scam&rdquo; or &ldquo;high-risk message&rdquo; to prompt human verification and protect users against emerging zero-day scams.
        </p>

        {/* 3 Tier Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase mb-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>LOW RISK (0-39)</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Expected communications, typical syntax, absence of coercive demands or deceptive links.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase mb-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>MEDIUM RISK (40-69)</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Unsolicited claims, shortened links, unknown senders, or moderate pressure tactics.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/20">
            <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs uppercase mb-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>HIGH RISK (70-100)</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Aggressive extortion, authority impersonation, demands for wire/crypto/gift cards, or phishing portals.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
