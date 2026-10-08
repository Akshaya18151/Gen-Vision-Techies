'use client';

import React from 'react';
import { ShieldCheck, AlertCircle, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { ExampleMessage } from '../types';

interface ExamplesSectionProps {
  onSelectExample: (content: string, autoAnalyze?: boolean) => void;
}

export const PRESET_EXAMPLES: ExampleMessage[] = [
  {
    id: 'safe',
    title: 'Safe Appointment Reminder',
    tag: 'Safe Notification',
    preview: 'Standard medical appointment reminder with no coercion or links.',
    content: 'Hi Alex, your doctor appointment with Dr. Henderson is confirmed for tomorrow at 3:00 PM at Main Medical Clinic (Suite 204). Reply CANCEL if you need to reschedule.',
    risk: 'LOW'
  },
  {
    id: 'suspicious',
    title: 'Suspicious Security Alert',
    tag: 'Suspicious Warning',
    preview: 'Unverified security alert using an obfuscated shortened bit.ly link.',
    content: 'Amazon Alert: Unusual sign-in attempt detected from IP 192.168.1.1. If this was not you, confirm your identity here: bit.ly/amz-verify-session',
    risk: 'MEDIUM'
  },
  {
    id: 'high_risk',
    title: 'High-Risk Extortion / Smishing',
    tag: 'High-Risk Threat',
    preview: 'Impersonation of federal agency threatening arrest & demanding cryptocurrency.',
    content: 'URGENT: IRS Final Notice! Your tax return has an unpaid balance of $4,850. A federal arrest warrant will be issued in 24 hours. Call 1-800-555-0199 immediately or settle via Bitcoin to avoid detention.',
    risk: 'HIGH'
  }
];

export const ExamplesSection: React.FC<ExamplesSectionProps> = ({ onSelectExample }) => {
  return (
    <section id="examples" className="py-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
        <div>
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">
            Ready-to-Test Scenarios
          </span>
          <h2 className="text-2xl font-bold text-white mt-1">
            Try Real-World Examples
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Click any example below to immediately populate the analyzer and test the AI detection engine.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PRESET_EXAMPLES.map((ex) => {
          const isHigh = ex.risk === 'HIGH';
          const isMed = ex.risk === 'MEDIUM';
          const isLow = ex.risk === 'LOW';

          const borderClass = isHigh
            ? 'border-rose-500/30 hover:border-rose-400/60 bg-rose-950/10'
            : isMed
            ? 'border-amber-500/30 hover:border-amber-400/60 bg-amber-950/10'
            : 'border-emerald-500/30 hover:border-emerald-400/60 bg-emerald-950/10';

          const badgeClass = isHigh
            ? 'bg-rose-950 text-rose-300 border-rose-500/30'
            : isMed
            ? 'bg-amber-950 text-amber-300 border-amber-500/30'
            : 'bg-emerald-950 text-emerald-300 border-emerald-500/30';

          const IconComponent = isHigh ? AlertTriangle : isMed ? AlertCircle : ShieldCheck;
          const iconColor = isHigh ? 'text-rose-400' : isMed ? 'text-amber-400' : 'text-emerald-400';

          return (
            <div
              key={ex.id}
              className={`group relative rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl backdrop-blur-md flex flex-col justify-between ${borderClass}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badgeClass}`}>
                    <IconComponent className={`w-3 h-3 ${iconColor}`} />
                    <span>{ex.tag}</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    Expected: {ex.risk}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">
                  {ex.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 mb-3">
                  {ex.preview}
                </p>

                <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 text-xs text-slate-300 font-mono line-clamp-3 mb-4 select-all">
                  &ldquo;{ex.content}&rdquo;
                </div>
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => onSelectExample(ex.content, false)}
                  className="flex-1 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/60 transition-colors"
                >
                  Load in Box
                </button>
                <button
                  type="button"
                  onClick={() => onSelectExample(ex.content, true)}
                  className="flex items-center justify-center space-x-1 px-3 py-2 text-xs font-bold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm transition-colors"
                >
                  <span>Test Now</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
