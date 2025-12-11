"use client";

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search, Zap, Code, PenTool, Layout, Star,
  ExternalLink, CheckCircle, XCircle, Menu, X,
  ChevronRight, Sparkles, Heart, Mail, Bell, ArrowRight,
  Info, ThumbsUp, ThumbsDown,
  ShieldCheck, Clock, Plus, Loader2, Check,
  Bookmark, Bot, BrainCircuit, MessageSquareText, Mic, MicOff, History,
  Scale, ArrowUpRight, BookOpen, Layers, Users, Target
} from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import SeoLandingPad from './components/SeoLandingPad';
import { TOOLS, FAQS, getToolBySlug, type Tool } from '@/lib/tools-data';
import { ROLES, TRENDING_COMPARISONS, MONTH_YEAR } from '@/lib/seo-configs';

/* --- 1. CONFIGURATION & DATA --- */

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);
const model = apiKey ? genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" }) : null;

const generateAiAdvice = async (userPrompt: string, type = 'consultant') => {
  if (!apiKey || !model) {
    return new Promise(resolve => setTimeout(() => {
      resolve(type === 'consultant'
        ? { diagnosis: "API Key Missing. Using offline mode.", stack: [{ name: "Lovable", reason: "Best for quick apps." }, { name: "Jasper", reason: "Content backup." }], plan: ["Add API Key", "Retry", "Profit"] }
        : { toolId: 1, reasoning: "Offline mode default." }
      );
    }, 1000));
  }

  try {
    let systemPrompt = "";
    if (type === 'consultant') {
      systemPrompt = `You are an expert AI Solutions Architect. Analyze the user's business problem.
      Available Tools Context: ${JSON.stringify(TOOLS.map(t => ({ name: t.name, desc: t.description })))}
      Instructions: 1. Diagnosis. 2. Solution Stack (Prioritize provided tools). 3. Implementation Plan.
      Format response as JSON: { "diagnosis": "...", "stack": [ {"name": "...", "reason": "..."} ], "plan": ["..."] }`;
    } else if (type === 'matchmaker') {
      systemPrompt = `Select the SINGLE best tool based on user need. Tools: ${JSON.stringify(TOOLS.map(t => ({ id: t.id, name: t.name })))}
      Format JSON: { "toolId": 1, "reasoning": "..." }`;
    }

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: systemPrompt + "\n\nUser Query: " + userPrompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    });
    return JSON.parse(result.response.text());
  } catch (error) {
    console.error("AI Error:", error);
    return type === 'consultant'
      ? { diagnosis: "AI Connection Error.", stack: [], plan: ["Check Console"] }
      : { toolId: 1, reasoning: "Error fallback." };
  }
};

// Data now imported from lib/tools-data.ts and lib/seo-configs.ts

/* --- 2. ATOMIC COMPONENTS --- */

interface Toast { id: number; title: string; message: string; }

const ToastContainer = ({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: number) => void }) => (
  <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
    {toasts.map(toast => (
      <div key={toast.id} className="pointer-events-auto bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in-up min-w-[300px]">
        <div className="bg-green-500/20 p-1 rounded-full"><Check className="w-4 h-4 text-green-400" /></div>
        <div className="flex-1"><p className="font-semibold text-sm">{toast.title}</p><p className="text-xs text-slate-400">{toast.message}</p></div>
        <button onClick={() => removeToast(toast.id)} className="text-slate-500 hover:text-white"><X className="w-4 h-4" /></button>
      </div>
    ))}
  </div>
);

const Sparkline = ({ data, color = "#60a5fa" }: { data: number[]; color?: string }) => {
  const max = Math.max(...data); const min = Math.min(...data); const range = max - min || 1;
  const points = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - ((d - min) / range) * 100}`).join(' ');
  return <div className="w-24 h-8 flex items-end opacity-50 hover:opacity-100 transition-opacity"><svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible"><polyline fill="none" stroke={color} strokeWidth="3" points={points} vectorEffect="non-scaling-stroke" /></svg></div>;
};

/* --- 3. MODALS --- */

const NewsletterModal = ({ isOpen, onClose, addToast }: { isOpen: boolean; onClose: () => void; addToast: (t: string, m: string) => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-md w-full relative z-10 shadow-2xl animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X className="w-6 h-6" /></button>
        <div className="text-center mb-6"><div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4"><Mail className="w-8 h-8 text-blue-500" /></div><h3 className="text-2xl font-bold text-white mb-2">Join the Vibe Coding Revolution</h3><p className="text-slate-400">Get the latest AI tool drops delivered weekly.</p></div>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onClose(); addToast("Subscribed!", "Welcome to the inner circle."); }}><input type="email" placeholder="kevin@example.com" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" required /><button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg">Subscribe Free</button></form>
      </div>
    </div>
  );
};

const CompareModal = ({ isOpen, onClose, tools }: { isOpen: boolean; onClose: () => void; tools: Tool[] }) => {
  if (!isOpen || tools.length < 2) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-5xl relative z-10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center"><h3 className="text-2xl font-bold text-white flex items-center gap-2"><Scale className="text-purple-500" /> Comparison</h3><button onClick={onClose}><X className="text-slate-500 hover:text-white" /></button></div>
        <div className="p-8 overflow-x-auto"><div className="grid grid-cols-3 gap-8 min-w-[700px]"><div className="space-y-6 pt-20"><div className="font-bold text-slate-500 uppercase text-xs border-b border-slate-800 pb-2">Rating</div><div className="font-bold text-slate-500 uppercase text-xs border-b border-slate-800 pb-2">Pricing</div><div className="font-bold text-slate-500 uppercase text-xs border-b border-slate-800 pb-2">Pros</div><div className="font-bold text-slate-500 uppercase text-xs border-b border-slate-800 pb-2">Cons</div></div>{tools.map(tool => (<div key={tool.id} className="space-y-6"><div className="flex flex-col items-center text-center pb-6"><div className="text-5xl mb-4">{tool.logo}</div><h3 className="text-xl font-bold text-white">{tool.name}</h3></div><div className="text-yellow-400 font-bold border-b border-slate-800 pb-2 h-8 flex items-center gap-1"><Star className="w-4 h-4 fill-current" /> {tool.rating}</div><div className="text-slate-300 border-b border-slate-800 pb-2 h-8">{tool.pricing}</div><div className="text-green-400 text-sm border-b border-slate-800 pb-2 h-24 overflow-y-auto"><ul className="list-disc pl-4">{tool.pros.map(p => <li key={p}>{p}</li>)}</ul></div><div className="text-red-400 text-sm border-b border-slate-800 pb-2 h-24 overflow-y-auto"><ul className="list-disc pl-4">{tool.cons.map(c => <li key={c}>{c}</li>)}</ul></div><a href={tool.link} target="_blank" rel="nofollow noreferrer" className="block text-center bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg">Visit Site</a></div>))}</div></div>
      </div>
    </div>
  );
};

const RedirectModal = ({ tool, isOpen }: { tool: Tool | null; isOpen: boolean }) => {
  if (!isOpen || !tool) return null;
  return <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950 flex-col"><div className="text-6xl animate-bounce mb-8">{tool.logo}</div><h2 className="text-3xl font-bold text-white mb-2">Taking you to {tool.name}...</h2><p className="text-slate-400 mb-8">Securely redirecting via AiToolAdvisor</p><Loader2 className="w-10 h-10 text-blue-500 animate-spin" /></div>;
};

const SmartMatchmaker = ({ isOpen, onClose, onResult }: { isOpen: boolean; onClose: () => void; onResult: (id: number) => void }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  if (!isOpen) return null;
  const handleMatch = async () => { if (!query) return; setLoading(true); const result = await generateAiAdvice(query, 'matchmaker') as { toolId: number }; setLoading(false); onResult(result.toolId); onClose(); };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"><div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} /><div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md relative z-10 shadow-2xl p-6"><div className="text-center mb-6"><div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse"><Bot className="w-8 h-8 text-purple-400" /></div><h3 className="text-2xl font-bold text-white mb-2">AI Matchmaker</h3><p className="text-slate-400 text-sm">Describe what you want to do.</p></div><textarea value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. 'I want to generate realistic photos...'" className="w-full h-32 bg-slate-800 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 outline-none resize-none mb-4" /><button onClick={handleMatch} disabled={loading || !query} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-all">{loading ? <Loader2 className="animate-spin" /> : 'Find My Tool'}</button></div></div>
  );
};

const QuickViewModal = ({ tool, isOpen, onClose, onRedirect }: { tool: Tool | null; isOpen: boolean; onClose: () => void; onRedirect: (t: Tool) => void }) => {
  if (!isOpen || !tool) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl relative z-10 shadow-2xl animate-fade-in-up overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-slate-800/50">
          <div className="flex items-center gap-4"><div className="text-4xl bg-slate-800 w-16 h-16 rounded-2xl flex items-center justify-center border border-slate-700">{tool.logo}</div><div><h3 className="text-2xl font-bold text-white flex items-center gap-2">{tool.name}{tool.verified && <ShieldCheck className="w-5 h-5 text-blue-400" />}</h3><div className="flex items-center gap-2 text-sm text-slate-400 mt-1"><span className="flex items-center gap-1 text-yellow-400"><Star className="w-3 h-3 fill-current" /> {tool.rating}</span><span>•</span><span>{tool.reviews} reviews</span></div></div></div><button onClick={onClose} className="text-slate-500 hover:text-white"><X className="w-6 h-6" /></button>
        </div>
        <div className="p-6 overflow-y-auto">
          <p className="text-slate-300 text-lg leading-relaxed mb-6">{tool.longDescription}</p>
          <div className="mb-8"><div className="flex justify-between text-xs font-bold uppercase mb-2"><span className="text-green-400">Positive</span><span className="text-slate-500">Critical</span></div><div className="h-4 bg-slate-800 rounded-full overflow-hidden flex"><div className="bg-green-500 h-full" style={{ width: `${tool.sentiment}%` }}></div><div className="bg-red-500 h-full" style={{ width: `${100 - tool.sentiment}%` }}></div></div><p className="text-xs text-center text-slate-500 mt-2">{tool.sentiment}% of users recommend this tool.</p></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"><div className="bg-green-900/10 border border-green-900/30 rounded-xl p-4"><h4 className="flex items-center gap-2 text-green-400 font-bold mb-3"><ThumbsUp className="w-4 h-4" /> The Good</h4><ul className="space-y-2">{tool.pros.map((pro, i) => <li key={i} className="flex items-start gap-2 text-sm text-slate-300"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> {pro}</li>)}</ul></div><div className="bg-red-900/10 border border-red-900/30 rounded-xl p-4"><h4 className="flex items-center gap-2 text-red-400 font-bold mb-3"><ThumbsDown className="w-4 h-4" /> Trade-offs</h4><ul className="space-y-2">{tool.cons.map((con, i) => <li key={i} className="flex items-start gap-2 text-sm text-slate-300"><XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" /> {con}</li>)}</ul></div></div>
        </div>
        <div className="p-6 border-t border-slate-800 bg-slate-800/30 flex gap-4"><button onClick={() => onRedirect(tool)} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg">Visit Website <ExternalLink className="w-4 h-4" /></button></div>
      </div>
    </div>
  );
};

interface AiAdviceResult { diagnosis: string; stack: { name: string; reason: string }[]; plan: string[]; }

const AiConsultantModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiAdviceResult | null>(null);
  const [history, setHistory] = useState<{ id: number; query: string; advice: AiAdviceResult }[]>([]);
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as unknown as { webkitSpeechRecognition: new () => SpeechRecognition }).webkitSpeechRecognition();
      recognition.continuous = false; recognition.interimResults = false; recognition.lang = 'en-US';
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: SpeechRecognitionEvent) => { setQuery(prev => prev + (prev ? ' ' : '') + event.results[0][0].transcript); };
      recognition.start();
    } else { alert("Voice input not supported."); }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); if (!query) return; setLoading(true); const advice = await generateAiAdvice(query, 'consultant') as AiAdviceResult; setResult(advice); setHistory(prev => [{ id: Date.now(), query, advice }, ...prev]); setLoading(false); };
  const loadHistory = (entry: { id: number; query: string; advice: AiAdviceResult }) => { setQuery(entry.query); setResult(entry.advice); };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={onClose} />
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl relative z-10 shadow-2xl overflow-hidden flex h-[80vh]">
        <div className="w-64 border-r border-slate-800 bg-slate-950/50 p-4 hidden md:flex flex-col">
          <div className="flex items-center gap-2 mb-6 text-slate-400 font-bold uppercase text-xs"><History className="w-4 h-4" /> History</div>
          <div className="space-y-2 overflow-y-auto flex-1">{history.length === 0 ? <p className="text-slate-600 text-xs italic">No history yet.</p> : history.map(h => (<button key={h.id} onClick={() => loadHistory(h)} className="w-full text-left p-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"><p className="text-xs text-slate-300 font-medium line-clamp-2">{h.query}</p></button>))}</div>
          <button onClick={() => { setQuery(''); setResult(null); }} className="mt-4 flex items-center gap-2 text-blue-400 text-sm font-bold justify-center p-2 rounded-lg hover:bg-slate-900"><Plus className="w-4 h-4" /> New Chat</button>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-gradient-to-r from-blue-900/20 to-purple-900/20">
            <div className="flex items-center gap-3"><div className="bg-blue-600 p-2 rounded-xl"><BrainCircuit className="text-white w-6 h-6" /></div><div><h3 className="font-bold text-white text-lg">AI Solutions Architect</h3><p className="text-xs text-blue-300">Powered by Gemini</p></div></div><button onClick={onClose}><X className="text-slate-500 hover:text-white" /></button>
          </div>
          <div className="p-6 overflow-y-auto flex-1">
            {!result ? (
              <div className="h-full flex flex-col justify-center">
                <p className="text-slate-300 mb-6 text-lg text-center">Tell me about your business challenge.</p>
                <form onSubmit={handleSubmit} className="max-w-xl mx-auto w-full">
                  <div className="relative"><textarea value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. 'I run a real estate agency...'" className="w-full h-40 bg-slate-800 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none resize-none mb-4" /><button type="button" onClick={startListening} className={`absolute bottom-6 right-4 p-2 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-700 text-slate-400 hover:text-white'}`}>{isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}</button></div>
                  <button disabled={loading || !query} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50">{loading ? <><Loader2 className="animate-spin" /> Analyzing...</> : <><Sparkles className="w-5 h-5" /> Generate Solution Plan</>}</button>
                </form>
              </div>
            ) : (
              <div className="animate-fade-in-up space-y-6 max-w-3xl mx-auto">
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700"><p className="text-sm text-slate-400 font-mono">Query: &quot;{query}&quot;</p></div>
                <div className="bg-red-900/20 border border-red-500/20 p-4 rounded-xl"><h4 className="text-red-300 font-bold mb-2">Diagnosis</h4><p className="text-slate-300 leading-relaxed">{result.diagnosis}</p></div>
                <div className="grid md:grid-cols-2 gap-4">{result.stack.map((tool, i) => { const foundTool = TOOLS.find(t => t.name === tool.name); return (
                    <div key={i} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col gap-2">
                      <div className="flex items-start gap-4"><div className="bg-blue-900/30 p-2 rounded-lg text-2xl">{foundTool?.logo || "🛠️"}</div><div><h5 className="font-bold text-white text-lg">{tool.name}</h5><p className="text-slate-400 text-sm mt-1">{tool.reason}</p></div></div>
                      {foundTool && <a href={foundTool.link} target="_blank" rel="nofollow noreferrer" className="mt-2 text-center bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white text-sm font-bold py-2 rounded-lg transition-colors border border-blue-600/30 flex items-center justify-center gap-2">Check it out <ExternalLink className="w-3 h-3" /></a>}
                    </div>
                  ); })}</div>
                <div className="bg-green-900/10 border border-green-500/20 p-6 rounded-xl"><h4 className="text-green-400 font-bold mb-4">Implementation Plan</h4><div className="space-y-4">{result.plan.map((step, i) => (<div key={i} className="flex gap-3"><div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center font-bold text-xs border border-green-500/30">{i + 1}</div><p className="text-slate-300 text-sm pt-0.5">{step}</p></div>))}</div></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- 4. LAYOUT COMPONENTS --- */

const TopBar = ({ onClose }: { onClose: () => void }) => (
  <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white text-xs sm:text-sm font-bold py-2 px-4 flex justify-between items-center relative z-[60]">
    <div className="flex items-center gap-2 mx-auto"><Bell className="w-4 h-4 animate-bounce" /><span>New Deal: Get 3 Months of Lovable Pro for 50% Off!</span><a href="#" className="underline hover:text-blue-200 ml-1">Claim Now</a></div>
    <button onClick={onClose} className="text-white/80 hover:text-white"><X className="w-4 h-4" /></button>
  </div>
);

const MobileMenu = ({ isOpen, onClose, onSubscribe }: { isOpen: boolean; onClose: () => void; onSubscribe: () => void }) => (
  <div className={`fixed inset-0 z-[60] transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}>
    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={onClose}></div>
    <div className="absolute right-0 top-0 bottom-0 w-3/4 max-w-sm bg-slate-900 border-l border-slate-700 shadow-2xl p-6 flex flex-col">
      <div className="flex justify-between items-center mb-8"><span className="text-xl font-bold text-white flex items-center gap-2"><Sparkles className="text-blue-500" /> Menu</span><button onClick={onClose} className="p-2 text-slate-400 hover:text-white"><X /></button></div>
      <nav className="flex flex-col gap-6 text-lg font-medium text-slate-300">
        <a href="#featured" onClick={onClose} className="flex items-center gap-3 hover:text-blue-400 transition-colors"><Star className="w-5 h-5" /> Top Picks</a>
        <button onClick={() => { onClose(); onSubscribe(); }} className="flex items-center gap-3 text-blue-400 hover:text-blue-300 text-left"><Mail className="w-5 h-5" /> Newsletter</button>
      </nav>
    </div>
  </div>
);

const Header = ({ onConsultant, onMatchmaker, likedCount, onSubscribe, onMobileMenuToggle }: { onConsultant: () => void; onMatchmaker: () => void; likedCount: number; onSubscribe: () => void; onMobileMenuToggle: () => void }) => (
  <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"><div className="flex items-center gap-2"><div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"><Sparkles className="text-white w-5 h-5" /></div><span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">AiToolAdvisor</span></div><div className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-300"><button onClick={onMatchmaker} className="hover:text-purple-400 transition-colors flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-slate-800"><Bot className="w-4 h-4" /> Matchmaker</button><button onClick={onConsultant} className="hover:text-blue-400 transition-colors flex items-center gap-1 px-3 py-2 rounded-lg bg-blue-900/10 border border-blue-500/20 text-blue-300 shadow-sm"><BrainCircuit className="w-4 h-4" /> AI Consultant</button></div><div className="flex items-center gap-4"><button className="relative p-2 text-slate-400 hover:text-pink-500 transition-colors"><Bookmark className="w-5 h-5" />{likedCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>}</button><button onClick={onSubscribe} className="hidden md:block bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]">Subscribe</button><button onClick={onMobileMenuToggle} className="md:hidden text-slate-400 hover:text-white"><Menu className="w-6 h-6" /></button></div></div></header>
);

const Hero = ({ onSearch, onConsultant }: { onSearch: (q: string) => void; onConsultant: () => void }) => (<div className="relative overflow-hidden bg-slate-900 py-20 lg:py-32"><div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" /><div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" /><div className="max-w-7xl mx-auto px-4 relative z-10 text-center"><div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-slate-300 text-xs font-medium mb-6"><span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Updated for {MONTH_YEAR}</div><h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8">Master the Art of <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient">Vibe Coding</span></h1><p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10">Discover the AI tools that are changing how we build software, design products, and scale businesses.</p><div className="flex flex-col items-center gap-6"><div className="relative w-full max-w-md"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-slate-500" /></div><input type="text" onChange={(e) => onSearch(e.target.value)} className="block w-full pl-10 pr-3 py-4 border border-slate-700 rounded-2xl bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-lg" placeholder="Search for tools..." /></div><button onClick={onConsultant} className="flex items-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 rounded-full hover:shadow-lg hover:scale-105 transition-all animate-bounce"><MessageSquareText className="w-4 h-4" /> Have a specific problem? Ask our AI Consultant</button></div></div></div>);

const ToolGrid = ({ searchQuery, addToast, likedTools, toggleLike, highlightId, onSelectCompare, compareList, onRedirect, activeCategory, setActiveCategory }: { searchQuery: string; addToast: (t: string, m: string) => void; likedTools: Set<number>; toggleLike: (id: number) => void; highlightId: number | null; onSelectCompare: (id: number) => void; compareList: number[]; onRedirect: (t: Tool) => void; activeCategory: string; setActiveCategory: (c: string) => void }) => {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  useEffect(() => { if (highlightId) { const tool = TOOLS.find(t => t.id === highlightId); if (tool) { setSelectedTool(tool); addToast("Match Found!", `AI recommends: ${tool.name}`); } } }, [highlightId, addToast]);
  const filteredTools = TOOLS.filter(tool => { const matchesCategory = activeCategory === 'all' || tool.category === activeCategory; const searchLower = searchQuery.toLowerCase(); const matchesSearch = tool.name.toLowerCase().includes(searchLower) || tool.description.toLowerCase().includes(searchLower); return matchesCategory && matchesSearch; });
  const categoryStats = { count: filteredTools.length, avgRating: (filteredTools.reduce((acc, curr) => acc + curr.rating, 0) / (filteredTools.length || 1)).toFixed(1) };
  return (
    <div id="directory" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-[600px]">
      <div className="mb-8 flex flex-col md:flex-row items-end justify-between gap-4">
         <div><h2 className="text-3xl font-bold text-white">AI Tools Directory</h2><p className="text-slate-400 mt-2">Showing {categoryStats.count} tools • Average Rating {categoryStats.avgRating} <Star className="w-3 h-3 inline text-yellow-500 mb-1" /></p></div>
         <div className="flex gap-2 bg-slate-800 p-1 rounded-xl">{['all', 'vibe-coding', 'design', 'writing', 'productivity'].map(cat => (<button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeCategory === cat ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>{cat === 'all' ? 'All' : cat.replace('-', ' ')}</button>))}</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map(tool => (
          <div key={tool.id} onClick={() => setSelectedTool(tool)} className={`group bg-slate-900 border ${highlightId === tool.id ? 'border-purple-500 ring-2 ring-purple-500/50' : 'border-slate-800'} rounded-3xl p-6 hover:border-slate-600 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden flex flex-col cursor-pointer`}>
            {tool.featured && <div className="absolute top-0 right-0 bg-gradient-to-l from-yellow-500/20 to-transparent px-4 py-1 rounded-bl-xl border-b border-l border-yellow-500/30"><span className="text-xs font-bold text-yellow-400 uppercase flex items-center gap-1"><Star className="w-3 h-3 fill-yellow-400" /> Top Pick</span></div>}
            <div className="flex items-start justify-between mb-4"><div className="text-4xl bg-slate-800 w-16 h-16 rounded-2xl flex items-center justify-center border border-slate-700 shadow-inner">{tool.logo}</div><div className="flex flex-col items-end gap-2">{tool.trend && <Sparkline data={tool.trend} />}<div className="flex gap-2"><button onClick={(e) => { e.stopPropagation(); onSelectCompare(tool.id); }} className={`p-2 rounded-full transition-colors ${compareList.includes(tool.id) ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-500 hover:text-blue-400'}`} title="Compare"><Scale className="w-4 h-4" /></button><button onClick={(e) => { e.stopPropagation(); toggleLike(tool.id); }} className={`p-2 rounded-full transition-colors ${likedTools.has(tool.id) ? 'bg-pink-500/20 text-pink-500' : 'bg-slate-800 text-slate-500 hover:text-pink-400'}`}><Heart className={`w-4 h-4 ${likedTools.has(tool.id) ? 'fill-pink-500' : ''}`} /></button></div></div></div>
            <div className="mb-auto"><div className="flex flex-wrap items-center gap-2 mb-2"><h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors flex items-center gap-2">{tool.name}</h3><span className="flex items-center gap-1 text-slate-200 font-bold bg-slate-800 px-2 py-0.5 rounded-lg text-[10px] border border-slate-700"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> {tool.rating}</span></div><p className="text-slate-400 text-sm my-4 line-clamp-2 min-h-[40px]">{tool.description}</p></div>
            <div className="flex items-center justify-between pt-6 border-t border-slate-800 mt-auto"><button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">Details <Info className="w-4 h-4" /></button></div>
          </div>
        ))}
      </div>
      <QuickViewModal tool={selectedTool} isOpen={!!selectedTool} onClose={() => setSelectedTool(null)} onRedirect={onRedirect} />
    </div>
  );
};

// Browse by Profession Section - Links to /for/[role] pSEO pages
const BrowseByProfession = () => (
  <div id="roles" className="bg-slate-900 py-16 border-b border-slate-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-3 flex items-center justify-center gap-2">
          <Users className="w-7 h-7 text-purple-500" /> Browse by Profession
        </h2>
        <p className="text-slate-400">Curated AI stacks for every role</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {ROLES.map(role => (
          <Link
            key={role.slug}
            href={`/for/${role.slug}`}
            className="bg-slate-800 hover:bg-slate-700 p-5 rounded-xl border border-slate-700 hover:border-purple-500 transition-all group"
          >
            <div className="text-3xl mb-3">{role.emoji}</div>
            <h3 className="font-bold text-white group-hover:text-purple-400 transition-colors">{role.title}</h3>
            <p className="text-xs text-slate-500 mt-1">{role.targetTools.length} curated tools</p>
          </Link>
        ))}
      </div>
    </div>
  </div>
);

// Trending Comparisons Section - Links to /compare/[slug] pSEO pages
const TrendingComparisons = () => (
  <div className="bg-slate-950 py-16 border-b border-slate-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-3 flex items-center justify-center gap-2">
          <Scale className="w-7 h-7 text-blue-500" /> Trending Comparisons
        </h2>
        <p className="text-slate-400">See how top AI tools stack up against each other</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TRENDING_COMPARISONS.map(({ toolA, toolB, badge }) => {
          const a = getToolBySlug(toolA);
          const b = getToolBySlug(toolB);
          if (!a || !b) return null;
          return (
            <Link
              key={`${toolA}-${toolB}`}
              href={`/compare/${toolA}-vs-${toolB}`}
              className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-blue-500 rounded-2xl p-5 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">{badge}</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-3xl">{a.logo}</span>
                  <div>
                    <p className="font-bold text-white">{a.name}</p>
                    <p className="text-xs text-yellow-400 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" /> {a.rating}
                    </p>
                  </div>
                </div>
                <span className="text-slate-600 font-bold">VS</span>
                <div className="flex items-center gap-3 flex-1 justify-end">
                  <div className="text-right">
                    <p className="font-bold text-white">{b.name}</p>
                    <p className="text-xs text-yellow-400 flex items-center gap-1 justify-end">
                      <Star className="w-3 h-3 fill-current" /> {b.rating}
                    </p>
                  </div>
                  <span className="text-3xl">{b.logo}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="text-center mt-8">
        <p className="text-slate-500 text-sm">
          Compare any two tools side-by-side with AI-powered verdicts
        </p>
      </div>
    </div>
  </div>
);

const ComparisonTable = () => (
  <div id="comparison" className="bg-slate-950 py-20 border-y border-slate-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16"><h2 className="text-3xl font-bold text-white mb-4">The Big 3: Vibe Coding Showdown</h2><p className="text-slate-400">Which tool reigns supreme in {MONTH_YEAR}?</p></div>
      <div className="overflow-x-auto">
        <div className="min-w-[800px] bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl">
          <div className="grid grid-cols-4 gap-8">
            <div className="col-span-1 pt-12"><h3 className="text-lg font-semibold text-slate-500 uppercase text-sm">Feature</h3></div>
            {TOOLS.slice(0, 3).map(tool => (<div key={tool.id} className="col-span-1 flex flex-col items-center"><div className="text-4xl mb-4">{tool.logo}</div><h3 className="text-xl font-bold text-white mb-2">{tool.name}</h3></div>))}
            <div className="col-span-1 py-6 border-t border-slate-800 flex items-center"><span className="font-medium text-slate-300">Vibe Score</span></div>
            <div className="col-span-1 py-6 border-t border-slate-800 text-center"><span className="inline-block px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm font-bold border border-green-800">9.8/10</span></div>
            <div className="col-span-1 py-6 border-t border-slate-800 text-center"><span className="inline-block px-3 py-1 bg-blue-900/30 text-blue-400 rounded-full text-sm font-bold border border-blue-800">9.5/10</span></div>
            <div className="col-span-1 py-6 border-t border-slate-800 text-center"><span className="inline-block px-3 py-1 bg-slate-800 text-slate-400 rounded-full text-sm font-bold border border-slate-700">8.2/10</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div className="bg-slate-900 py-20 border-t border-slate-800">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12"><h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2><p className="text-slate-400">Everything you need to know about the Vibe Coding landscape.</p></div>
        <div className="space-y-4">{FAQS.map((faq, index) => (<div key={index} className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden"><button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-800 transition-colors"><span className="font-semibold text-slate-200">{faq.question}</span><ChevronRight className={`w-5 h-5 text-slate-500 transition-transform ${openIndex === index ? 'rotate-90' : ''}`} /></button>{openIndex === index && <div className="p-6 pt-0 text-slate-400 leading-relaxed border-t border-slate-700/50">{faq.answer}</div>}</div>))}</div>
      </div>
    </div>
  );
};

const Footer = () => (<footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-12"><div className="max-w-7xl mx-auto px-4"><div className="flex items-center gap-2 mb-4"><Sparkles className="text-blue-500 w-6 h-6" /><span className="text-2xl font-bold text-white">AiToolAdvisor</span></div><p className="text-slate-500 text-sm leading-relaxed mb-6">The #1 directory for the Vibe Coding era.</p><div className="pt-8 border-t border-slate-900 text-center text-slate-600 text-sm"><p>&copy; {new Date().getFullYear()} AiToolAdvisor. All rights reserved.</p></div></div></footer>);

/* --- 5. MAIN APP COMPONENT --- */

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: () => void;
  onend: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  start: () => void;
}

interface SpeechRecognitionEvent {
  results: { [index: number]: { [index: number]: { transcript: string } } };
}

function AiToolAdvisorContent() {
  const searchParams = useSearchParams();

  // Read query parameters for SEO Landing Pad experience
  const categoryParam = searchParams.get('category');
  const refParam = searchParams.get('ref');
  const isMigrationVisitor = refParam === 'migration';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showConsultant, setShowConsultant] = useState(false);
  const [showMatchmaker, setShowMatchmaker] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showTopBar, setShowTopBar] = useState(true);
  const [highlightId, setHighlightId] = useState<number | null>(null);
  const [likedTools, setLikedTools] = useState<Set<number>>(new Set());
  const [compareList, setCompareList] = useState<number[]>([]);
  const [redirectTool, setRedirectTool] = useState<Tool | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // CRITICAL: Set active category from URL query parameter (for Landing Pad experience)
  useEffect(() => {
    if (categoryParam) {
      const validCategories = ['vibe-coding', 'design', 'writing', 'productivity', 'all'];
      if (validCategories.includes(categoryParam)) {
        setActiveCategory(categoryParam);
      }
    }
  }, [categoryParam]);

  const addToast = useCallback((title: string, message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const removeToast = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));
  const toggleLike = (id: number) => setLikedTools(prev => { const newSet = new Set(prev); if (newSet.has(id)) newSet.delete(id); else newSet.add(id); return newSet; });
  const handleCompareSelect = (id: number) => { setCompareList(prev => { if (prev.includes(id)) return prev.filter(i => i !== id); if (prev.length >= 2) { addToast("Max 2 Tools", "Select 2 tools to compare."); return prev; } return [...prev, id]; }); };
  const handleRedirect = (tool: Tool) => { setRedirectTool(tool); setTimeout(() => { window.open(tool.link, '_blank'); setRedirectTool(null); }, 2000); };

  useEffect(() => { const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setShowConsultant(false); setShowMatchmaker(false); setShowCompare(false); setShowNewsletter(false); } }; window.addEventListener('keydown', handleKey); return () => window.removeEventListener('keydown', handleKey); }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-blue-500/30 flex flex-col">
      {/* SEO Landing Pad for migrated visitors */}
      <SeoLandingPad category={categoryParam || undefined} isMigrationVisitor={isMigrationVisitor} />

      {showTopBar && !isMigrationVisitor && <TopBar onClose={() => setShowTopBar(false)} />}
      <Header
        onConsultant={() => setShowConsultant(true)}
        onMatchmaker={() => setShowMatchmaker(true)}
        likedCount={likedTools.size}
        onSubscribe={() => setShowNewsletter(true)}
        onMobileMenuToggle={() => setIsMobileMenuOpen(true)}
      />
      <Hero onSearch={setSearchQuery} onConsultant={() => setShowConsultant(true)} />

      {/* pSEO Sections */}
      <BrowseByProfession />
      <TrendingComparisons />
      <ComparisonTable />

      <ToolGrid
        searchQuery={searchQuery}
        addToast={addToast}
        likedTools={likedTools}
        toggleLike={toggleLike}
        highlightId={highlightId}
        onSelectCompare={handleCompareSelect}
        compareList={compareList}
        onRedirect={handleRedirect}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {compareList.length > 0 && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 bg-slate-800 border border-slate-700 px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 animate-fade-in-up">
          <span className="font-bold text-white">{compareList.length} Selected</span>
          {compareList.length === 2 ? (
            <button onClick={() => setShowCompare(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2">Compare <ArrowUpRight className="w-4 h-4" /></button>
          ) : (
            <span className="text-sm text-slate-400">Select 2 to compare</span>
          )}
          <button onClick={() => setCompareList([])} className="text-slate-500 hover:text-white"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Modals */}
      <AiConsultantModal isOpen={showConsultant} onClose={() => setShowConsultant(false)} />
      <SmartMatchmaker isOpen={showMatchmaker} onClose={() => setShowMatchmaker(false)} onResult={setHighlightId} />
      <CompareModal isOpen={showCompare} onClose={() => setShowCompare(false)} tools={TOOLS.filter(t => compareList.includes(t.id))} />
      <RedirectModal isOpen={!!redirectTool} tool={redirectTool} />
      <NewsletterModal isOpen={showNewsletter} onClose={() => setShowNewsletter(false)} addToast={addToast} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} onSubscribe={() => setShowNewsletter(true)} />

      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <FAQSection />
      <Footer />

      <style jsx>{`
        @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
        @keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-gradient { background-size: 200% auto; animation: gradient 3s linear infinite; }
      `}</style>
    </div>
  );
}

// Loading fallback component for Suspense
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Sparkles className="text-white w-8 h-8" />
        </div>
        <p className="text-slate-400">Loading AI Tool Advisor...</p>
      </div>
    </div>
  );
}

// Main export wrapped in Suspense for useSearchParams
export default function AiToolAdvisor() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AiToolAdvisorContent />
    </Suspense>
  );
}
