'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950 py-10 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-slate-300 font-bold">ScamShield MVP</div>
            <div className="text-[11px] text-slate-500">
              Gen-Vision Techies • 4-Hour Hackathon Edition
            </div>
          </div>
        </div>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-[11px]">
          <span className="px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-400">
            Next.js 16 + React 19
          </span>
          <span className="px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-400">
            FastAPI + Python 3.12
          </span>
          <span className="px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-cyan-400 font-semibold">
            Qwen3 (Open-Weight AI)
          </span>
          <span className="px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-400">
            Tailwind CSS
          </span>
        </div>

        <div className="text-center md:text-right text-[11px] text-slate-500">
          <p>ScamShield is an educational cybersecurity advisory tool.</p>
          <p>Always verify critical banking or legal matters with official channels.</p>
        </div>
      </div>
    </footer>
  );
};
