'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, 
  Send, 
  Sparkles, 
  Trash2, 
  ClipboardPaste, 
  Loader2, 
  AlertCircle, 
  Cpu, 
  CheckCircle,
  HelpCircle,
  Zap,
  Terminal,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

import { Header } from '../components/Header';
import { ExamplesSection } from '../components/ExamplesSection';
import { ResultSection } from '../components/ResultSection';
import { HowItWorks } from '../components/HowItWorks';
import { Footer } from '../components/Footer';
import { ScamAnalysisResult } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const AVAILABLE_MODELS = [
  { id: 'qwen3', name: 'Qwen3 (7.6B Open-Weight)', desc: 'Deep threat reasoning via local Qwen3' },
  { id: 'qwen2.5:7b', name: 'Qwen 2.5 (7B Open-Weight)', desc: 'Alternative Qwen open-weight model' },
  { id: 'heuristic', name: 'Heuristic Rule Engine (Instant)', desc: 'Zero-latency pattern heuristics' }
];

export default function Home() {
  const [message, setMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState('qwen3');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScamAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [activeModelName, setActiveModelName] = useState('Qwen3');

  const resultsRef = useRef<HTMLDivElement>(null);

  // Check backend health on initial mount
  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    setApiStatus('checking');
    try {
      const res = await fetch(`${API_BASE}/api/health`, { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        setApiStatus('online');
        if (data.model) {
          setActiveModelName(data.model);
        }
      } else {
        setApiStatus('offline');
      }
    } catch {
      setApiStatus('offline');
    }
  };

  const handleAnalyze = async (textToAnalyze?: string) => {
    const text = (textToAnalyze ?? message).trim();
    if (!text) {
      setError('Please paste or type a message to analyze.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          preferred_model: selectedModel === 'heuristic' ? 'heuristic' : selectedModel,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server returned error ${res.status}`);
      }

      const data: ScamAnalysisResult = await res.json();
      setResult(data);
      setApiStatus('online');

      // Smooth scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: unknown) {
      console.error('Analysis failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed';
      setError(
        `${errorMessage}. If backend is booting or AI model is loading, please try again in a moment.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectExample = (content: string, autoAnalyze = false) => {
    setMessage(content);
    setError(null);
    if (autoAnalyze) {
      handleAnalyze(content);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setMessage(text);
        setError(null);
      }
    } catch {
      // Clipboard access denied or not supported
    }
  };

  const handleClear = () => {
    setMessage('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 cyber-grid flex flex-col selection:bg-cyan-500 selection:text-black">
      <Header apiStatus={apiStatus} activeModel={activeModelName} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Driven Social Engineering & Threat Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Protect Yourself from <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Deceptive Scam Messages
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            Paste any suspicious SMS, email, or direct message. ScamShield leverages open-weight AI (Qwen3) to evaluate manipulation risks, pinpoint deceptive indicators, and prescribe protective advice.
          </p>
        </div>

        {/* Analyzer Card */}
        <section id="analyzer" className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl border border-cyan-500/20 bg-slate-900/60 backdrop-blur-xl p-5 sm:p-8 shadow-2xl shadow-cyan-950/40">
            {/* Top Toolbar: Model Selector & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Suspicious Message Input
                </span>
              </div>

              {/* Model Selector */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400 flex items-center space-x-1">
                  <Cpu className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Engine:</span>
                </span>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-xs text-cyan-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  {AVAILABLE_MODELS.map((m) => (
                    <option key={m.id} value={m.id} className="bg-slate-900 text-white">
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Input Textarea Area */}
            <div className="relative mt-4">
              <textarea
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Paste the suspicious message here... (e.g. 'URGENT: Your bank account is locked! Click bit.ly/... to verify immediately or pay fee.')"
                rows={5}
                className="w-full bg-slate-950/90 text-slate-100 placeholder-slate-500 text-sm sm:text-base rounded-2xl p-4 sm:p-5 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all duration-200 resize-none font-mono"
              />

              {/* Scanning Radar Overlay when loading */}
              {loading && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center space-y-3 z-10 border border-cyan-500/40">
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                    <ShieldAlert className="w-6 h-6 text-cyan-400 animate-pulse" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-cyan-300">
                      Analyzing Message Vectors...
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Open-weight AI (Qwen3) evaluating urgency, sender patterns & deception cues
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions Row */}
            <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <button
                  type="button"
                  onClick={handlePaste}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  <ClipboardPaste className="w-3.5 h-3.5" />
                  <span>Paste Clipboard</span>
                </button>

                {message && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                )}

                <span className="text-slate-500 font-mono text-[11px] ml-auto sm:ml-2">
                  {message.length} chars
                </span>
              </div>

              {/* Primary Analyze CTA Button */}
              <button
                type="button"
                disabled={loading || !message.trim()}
                onClick={() => handleAnalyze()}
                className={`relative group flex items-center justify-center space-x-2 px-7 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                  !message.trim() || loading
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:via-blue-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:translate-y-0'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Evaluating Risk...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-cyan-200" />
                    <span>Analyze Message</span>
                  </>
                )}
              </button>
            </div>

            {/* Error Message Display */}
            {error && (
              <div className="mt-4 p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-start space-x-3 text-xs text-rose-200">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-rose-300">Analysis Error</p>
                  <p className="mt-0.5 text-rose-200/90">{error}</p>
                </div>
                <button
                  onClick={() => checkHealth()}
                  className="px-2 py-1 rounded bg-rose-900/50 hover:bg-rose-900 text-rose-300 flex items-center space-x-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Retry API</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Results Section (Anchor for smooth scroll) */}
        <div ref={resultsRef} className="max-w-4xl mx-auto">
          {result && (
            <ResultSection
              result={result}
              analyzedMessage={message}
              onReset={handleClear}
            />
          )}
        </div>

        {/* Presets & Example Messages */}
        <div className="max-w-4xl mx-auto mt-6">
          <ExamplesSection onSelectExample={handleSelectExample} />
        </div>

        {/* How It Works / About Section */}
        <div className="max-w-4xl mx-auto mt-6">
          <HowItWorks />
        </div>
      </main>

      <Footer />
    </div>
  );
}
