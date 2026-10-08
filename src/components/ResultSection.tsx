'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  Copy, 
  Check, 
  Clock, 
  Cpu, 
  Share2, 
  ShieldAlert, 
  Sparkles,
  Info
} from 'lucide-react';
import { ScamAnalysisResult } from '../types';

interface ResultSectionProps {
  result: ScamAnalysisResult;
  analyzedMessage: string;
  onReset: () => void;
}

export const ResultSection: React.FC<ResultSectionProps> = ({
  result,
  analyzedMessage,
  onReset,
}) => {
  const [copied, setCopied] = useState(false);

  const isHigh = result.risk_level === 'HIGH';
  const isMed = result.risk_level === 'MEDIUM';
  const isLow = result.risk_level === 'LOW';

  // Theme colors based on risk
  const colorScheme = isHigh
    ? {
        border: 'border-rose-500/40',
        glow: 'cyber-glow-red',
        bgGradient: 'from-rose-950/20 via-slate-900 to-slate-950',
        badgeBg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
        accentText: 'text-rose-400',
        scoreColor: '#f43f5e',
        tagBg: 'bg-rose-950/40 border-rose-800/40 text-rose-200',
        title: 'High-Risk Message Detected',
        icon: AlertTriangle
      }
    : isMed
    ? {
        border: 'border-amber-500/40',
        glow: 'cyber-glow-amber',
        bgGradient: 'from-amber-950/20 via-slate-900 to-slate-950',
        badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
        accentText: 'text-amber-400',
        scoreColor: '#f59e0b',
        tagBg: 'bg-amber-950/40 border-amber-800/40 text-amber-200',
        title: 'Potential Threat / Suspicious Activity',
        icon: AlertCircle
      }
    : {
        border: 'border-emerald-500/40',
        glow: 'cyber-glow-emerald',
        bgGradient: 'from-emerald-950/20 via-slate-900 to-slate-950',
        badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
        accentText: 'text-emerald-400',
        scoreColor: '#10b981',
        tagBg: 'bg-emerald-950/40 border-emerald-800/40 text-emerald-200',
        title: 'Low-Risk Message Pattern',
        icon: ShieldCheck
      };

  const StatusIcon = colorScheme.icon;

  const handleCopyReport = () => {
    const reportText = `[ScamShield Analysis Report]
Risk Level: ${result.risk_level}
Risk Score: ${result.risk_score} / 100
Model: ${result.model_used || 'Qwen3'}

Indicators Detected:
${result.signals.map(s => `- ${s}`).join('\n')}

Explanation:
${result.explanation}

Recommended Safety Advice:
${result.advice}

(Evaluated via ScamShield AI. Use as cybersecurity advisory; verify independently.)`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // SVG Gauge calculations
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (result.risk_score / 100) * circumference;

  return (
    <div 
      id="results"
      className={`rounded-3xl border ${colorScheme.border} ${colorScheme.glow} bg-gradient-to-b ${colorScheme.bgGradient} p-6 sm:p-8 backdrop-blur-2xl transition-all duration-300 mt-8`}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div className="flex items-center space-x-3.5">
          <div className={`p-3 rounded-2xl ${colorScheme.badgeBg} border`}>
            <StatusIcon className={`w-7 h-7 ${colorScheme.accentText}`} />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${colorScheme.badgeBg}`}>
                {result.risk_level} RISK
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Threat Score: {result.risk_score}/100
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
              {colorScheme.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleCopyReport}
            className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-colors shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Report</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
          >
            Analyze Another
          </button>
        </div>
      </div>

      {/* Main Grid: Gauge + Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6">
        {/* Risk Gauge Visual Card */}
        <div className="lg:col-span-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 p-6 flex flex-col items-center justify-center text-center">
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="currentColor"
                strokeWidth="12"
                className="text-slate-800/60"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={colorScheme.scoreColor}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
                fill="transparent"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-white tracking-tight">
                {result.risk_score}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">
                Risk Score
              </span>
              <span className={`text-[10px] font-semibold mt-1 px-2 py-0.5 rounded-full border ${colorScheme.badgeBg}`}>
                {result.risk_level}
              </span>
            </div>
          </div>

          <div className="mt-4 w-full grid grid-cols-3 gap-1 pt-3 border-t border-slate-800/60 text-[11px]">
            <div className={`p-1.5 rounded-lg ${isLow ? 'bg-emerald-950/60 text-emerald-300 font-bold border border-emerald-500/30' : 'text-slate-500'}`}>
              LOW (0-39)
            </div>
            <div className={`p-1.5 rounded-lg ${isMed ? 'bg-amber-950/60 text-amber-300 font-bold border border-amber-500/30' : 'text-slate-500'}`}>
              MED (40-69)
            </div>
            <div className={`p-1.5 rounded-lg ${isHigh ? 'bg-rose-950/60 text-rose-300 font-bold border border-rose-500/30' : 'text-slate-500'}`}>
              HIGH (70+)
            </div>
          </div>
        </div>

        {/* Signals & Threat Breakdown */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          {/* Detected Signals Box */}
          <div className="rounded-2xl bg-slate-950/70 border border-slate-800/80 p-5">
            <div className="flex items-center space-x-2 mb-3">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Identified Scam Indicators & Signals ({result.signals.length})
              </h4>
            </div>

            {result.signals.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                No active threats or malicious patterns discovered in this text.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {result.signals.map((signal, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-medium border ${colorScheme.tagBg}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                    <span>{signal}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Explanation Box */}
          <div className="rounded-2xl bg-slate-950/70 border border-slate-800/80 p-5">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Cybersecurity AI Analysis
              </h4>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              {result.explanation}
            </p>
            <div className="flex items-center space-x-1.5 mt-2.5 text-[11px] text-slate-400">
              <Info className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <span>
                Language formulated conservatively: flags patterns as a potential scam rather than making absolute legal claims.
              </span>
            </div>
          </div>

          {/* Protective Advice Box */}
          <div className="rounded-2xl bg-cyan-950/20 border border-cyan-500/30 p-5">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                Recommended Action & Safety Advice
              </h4>
            </div>
            <p className="text-sm text-cyan-100 font-medium leading-relaxed">
              {result.advice}
            </p>
          </div>
        </div>
      </div>

      {/* Metadata Footer */}
      <div className="pt-4 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1.5">
            <Cpu className="w-3.5 h-3.5 text-slate-400" />
            <span>Engine: <strong className="text-slate-300">{result.model_used || 'Qwen3'}</strong></span>
          </span>
          {result.provider && (
            <span className="text-slate-500">
              Provider: <span className="text-slate-400">{result.provider}</span>
            </span>
          )}
        </div>

        {result.latency_ms !== undefined && (
          <div className="flex items-center space-x-1.5 text-slate-400 font-mono">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Latency: {result.latency_ms} ms</span>
          </div>
        )}
      </div>
    </div>
  );
};
