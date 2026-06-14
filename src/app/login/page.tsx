"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { Fingerprint, Eye, Activity, Cpu, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function NexusLogin() {
  const [neuralId, setNeuralId] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const router = useRouter();

  // Effet pour faire disparaître le message après 5 secondes
  useEffect(() => {
    if (feedback.message) {
      const timer = setTimeout(() => {
        setFeedback({ message: '', type: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handleInitializeSession = async () => {
    setLoading(true);
    setFeedback({ message: '', type: '' });
    
    const { error } = await supabase.auth.signInWithOtp({
      email: neuralId,
      options: { shouldCreateUser: false },
    });

    if (error) {
      setFeedback({ message: error.message, type: 'error' });
    } else {
      setFeedback({ message: "Code de synchronisation envoyé au terminal.", type: 'success' });
    }
    setLoading(false);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || session?.user) {
        router.push('/dashboard');
      }
    });
    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <style>{`
          body {
            background-color: #000000;
            margin: 0;
            overflow: hidden;
            font-family: 'Inter', sans-serif;
          }
          .glass-panel {
            background: rgba(0, 0, 0, 0.72);
            backdrop-filter: blur(40px);
            -webkit-backdrop-filter: blur(40px);
            border: 1px solid rgba(0, 255, 255, 0.18);
            box-shadow: 0 0 40px rgba(0, 255, 255, 0.08);
          }
          .scanning-line {
            height: 2px;
            background: linear-gradient(90deg, transparent, #00ffff, transparent);
            box-shadow: 0 0 15px #00ffff;
          }
          .bionic-glow { text-shadow: 0 0 10px rgba(0, 255, 255, 0.8); }
          .neural-network-bg {
            background-color: #000000;
            background-size: cover;
            background-position: center;
            background-image:
              radial-gradient(circle at top, rgba(0, 255, 255, 0.12), transparent 30%),
              radial-gradient(circle at bottom right, rgba(255, 0, 255, 0.08), transparent 22%),
              linear-gradient(180deg, rgba(0, 0, 0, 1), rgba(5, 8, 20, 1));
          }
          .font-space { font-family: 'Space Grotesk', sans-serif; }
        `}</style>
      </Head>

      <div className="neural-network-bg h-screen w-screen flex flex-col items-center justify-between text-white overflow-hidden relative">
        
        {/* Feedback Overlay */}
        {feedback.message && (
          <div className="absolute top-10 z-[100] animate-in fade-in slide-in-from-top-4 duration-500">
            <div className={`flex items-center gap-3 px-6 py-4 rounded-xl border ${feedback.type === 'error' ? 'bg-[#FFB80022] border-[#FFB80055] text-[#FFB800]' : 'bg-[#00FF8822] border-[#00FF8855] text-[#00FF88]'} backdrop-blur-md`}>
                {feedback.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
              <span className="font-space text-[12px] uppercase tracking-widest">{feedback.message}</span>
            </div>
          </div>
        )}

        <main className="flex-grow flex items-center justify-center w-full px-[40px] max-h-screen">
            <div className="glass-panel max-w-lg w-full rounded-[1.5rem] p-6 flex flex-col space-y-4 relative overflow-hidden border border-[#00ffff33] shadow-[0_0_50px_rgba(0,255,255,0.08)]">
            
            <div className="text-center space-y-1">
                <h1 className="font-space text-[40px] font-bold text-[#00FFFF] tracking-tighter bionic-glow">NEURAL_OS</h1>
                <p className="font-space text-[10px] font-bold text-[#00FFFF88] uppercase tracking-widest opacity-80">Diagnostic & Authentication Link</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div className="glass-panel p-3 rounded-lg border border-[#00ffff22] flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Activity size={14} className="text-[#00FFFF]" />
                    <span className="font-space text-[9px] text-[#00FFFF88]">PHYSICAL LINK</span>
                </div>
                  <span className="text-[10px] font-bold text-[#00FF88]">ACTIVE</span>
              </div>
                <div className="glass-panel p-3 rounded-lg border border-[#00ffff22] flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Cpu size={14} className="text-[#00FFFF]" />
                    <span className="font-space text-[9px] text-[#00FFFF88]">CORE HARDWARE</span>
                </div>
                  <span className="text-[10px] font-bold text-[#00FFFF]">READY</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col space-y-1">
                  <label className="font-space text-[10px] font-bold text-[#00FFFF] uppercase ml-1">Access Protocol</label>
                <div className="relative group">
                    <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00FFFF] opacity-60" size={20} />
                  <input 
                      className="w-full bg-[#00000088] border-b border-[#00ffff22] focus:border-[#00ffff] text-[#e0e3e5] font-sans text-[14px] py-3 pl-12 pr-4 outline-none transition-all placeholder:text-[#00ffff55]" 
                    placeholder="Neural ID" 
                    type="text" 
                    value={neuralId}
                    onChange={(e) => setNeuralId(e.target.value)}
                  />
                </div>
              </div>

              <div className="relative group cursor-pointer">
                <div className="glass-panel rounded-[1rem] p-4 border border-[#00ffff18] flex flex-col items-center space-y-3 hover:border-[#00ffff]/50 transition-all active:scale-95 duration-300">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 128 128">
                      <circle className="text-white/5" cx="64" cy="64" fill="transparent" r="60" stroke="currentColor" strokeWidth="2"></circle>
                      <circle className="text-[#00FFFF] drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]" cx="64" cy="64" fill="transparent" r="60" stroke="currentColor" strokeDasharray="376.8" strokeDashoffset="100" strokeWidth="2"></circle>
                    </svg>
                    <div className="relative overflow-hidden w-20 h-20 flex items-center justify-center">
                      <Eye className="text-[#00FFFF] bionic-glow" size={48} strokeWidth={1} />
                      <div className="scanning-line absolute top-0 left-0 right-0 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="font-space text-[18px] font-medium text-[#e0e3e5]">BIO-METRIC SYNC</span>
                    <p className="font-sans text-[12px] text-[#00FFFF88] opacity-60">Authentication & Hardware Check</p>
                  </div>
                </div>
                <div className="absolute -inset-4 bg-[#00ffff]/5 blur-3xl -z-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>

            <div className="pt-2 flex flex-col space-y-3">
              <button 
                onClick={handleInitializeSession}
                disabled={loading}
                className="bg-gradient-to-r from-[#00FFFF] to-[#00FF88] hover:from-[#00FFFF] hover:to-[#00FFAA] text-[#000000] font-space text-[10px] font-bold py-4 rounded-[0.75rem] uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(0,255,255,0.35)] active:scale-95"
              >
                {loading ? "INITIALIZING..." : "INITIALIZE SESSION"}
              </button>
              <div className="flex justify-between items-center px-2">
                <button className="font-space text-[10px] font-bold text-[#00FFFF88] hover:text-[#00FFFF] transition-colors uppercase">Emergency Override</button>
                <button className="font-space text-[10px] font-bold text-[#00FFFF88] hover:text-[#00FFFF] transition-colors uppercase">System Status</button>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#ffffff10]">
              <div className="h-full bg-gradient-to-r from-[#00FFFF] to-[#00FF88] w-1/3"></div>
            </div>
          </div>
        </main>

        <footer className="w-full py-6 flex flex-col items-center justify-center space-y-2 border-t border-[#00ffff12] bg-transparent">
          <div className="flex space-x-6">
            <a className="font-space text-[9px] uppercase tracking-widest text-[#00FFFF66] hover:text-[#00FFFF] transition-colors opacity-80" href="#">System Logs</a>
            <a className="font-space text-[9px] uppercase tracking-widest text-[#00FFFF66] hover:text-[#00FFFF] transition-colors opacity-80" href="#">Core Protocol</a>
            <a className="font-space text-[9px] uppercase tracking-widest text-[#00FFFF66] hover:text-[#00FFFF] transition-colors opacity-80" href="#">Contact Uplink</a>
          </div>
          <p className="font-space text-[9px] uppercase tracking-widest text-[#00FFFF88] opacity-80">© 2140 NEURAL_OS | QUANTUM ENCRYPTION ACTIVE</p>
        </footer>

        <div className="fixed top-20 right-20 w-96 h-96 bg-[#00ffff]/10 rounded-full blur-[120px] -z-10"></div>
        <div className="fixed bottom-20 left-20 w-80 h-80 bg-[#ff00ff]/10 rounded-full blur-[100px] -z-10"></div>
      </div>
    </>
  );
}