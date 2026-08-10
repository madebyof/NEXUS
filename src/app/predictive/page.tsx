'use client';

import React, { useEffect, useRef, useState } from 'react';
import Sidebar from "@/components/Sidebar";
import { ChevronRight } from "lucide-react";

export default function PredictiveEngine() {
    const countdownRef = useRef<HTMLDivElement>(null);
    const [minutes, setMinutes] = useState(44);
    const [seconds, setSeconds] = useState(58);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Countdown logic
    useEffect(() => {
        let m = 44;
        let s = 58;
        const interval = setInterval(() => {
            s--;
            if (s < 0) { s = 59; m--; }
            if (m < 0) { m = 59; }
            setMinutes(m);
            setSeconds(s);
            if (Math.random() > 0.95 && countdownRef.current) {
                countdownRef.current.classList.add('glitch-text');
                setTimeout(() => countdownRef.current?.classList.remove('glitch-text'), 200);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Mouse tracking glow
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const glow = document.createElement('div');
            glow.style.cssText = `position:fixed;left:${e.clientX - 50}px;top:${e.clientY - 50}px;width:100px;height:100px;background:radial-gradient(circle, rgba(0,219,231,0.05) 0%, transparent 70%);pointer-events:none;z-index:1;`;
            document.body.appendChild(glow);
            setTimeout(() => glow.remove(), 100);
        };
        document.addEventListener('mousemove', handleMouseMove);
        return () => document.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const mStr = minutes.toString().padStart(2, '0');
    const sStr = seconds.toString().padStart(2, '0');

    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;700;800&display=swap" rel="stylesheet" />

            <style dangerouslySetInnerHTML={{
                __html: `
  :root {
    --neon-cyan: #00FFFF;
    --neon-magenta: #FF00FF;
    --alert-amber: #FFB800;
  }
  .font-orbitron { font-family: 'Orbitron', sans-serif; }
  .font-code { font-family: 'JetBrains Mono', monospace; }

  .glass-panel {
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    background: rgba(0, 0, 0, 0.60);
    border: 1px solid rgba(0, 255, 255, 0.15);
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.05);
  }

  .glitch-text {
    animation: glitch 2s infinite;
  }
  @keyframes glitch {
    0% { transform: translate(0); }
    20% { transform: translate(-2px, 2px); text-shadow: 2px 0 var(--neon-magenta); }
    40% { transform: translate(-2px, -2px); text-shadow: -2px 0 var(--neon-cyan); }
    60% { transform: translate(2px, 2px); }
    80% { transform: translate(2px, -2px); }
    100% { transform: translate(0); }
  }

  .pulse-cyan {
    animation: pulse-cyan 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  @keyframes pulse-cyan {
    0%, 100% { opacity: 1; filter: drop-shadow(0 0 5px var(--neon-cyan)); }
    50% { opacity: .7; filter: drop-shadow(0 0 15px var(--neon-cyan)); }
  }

  .angular-cut {
    clip-path: polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%);
  }

  @keyframes scan {
    0% { top: 0%; }
    100% { top: 100%; }
  }
  .scanline-fx {
    width: 100%; height: 2px;
    background: linear-gradient(to right, transparent, #00FFFF, transparent);
    box-shadow: 0 0 15px #00FFFF;
    position: fixed; top: 0; left: 0;
    animation: scan 8s linear infinite;
    z-index: 100; pointer-events: none; opacity: 0.15;
  }

  @keyframes dash { to { stroke-dashoffset: -200; } }
  .animate-dash { animation: dash 20s linear infinite; }

  .predictive-root {
    background-color: #000000;
    background-image:
      radial-gradient(circle at top, rgba(0,255,255,0.08), transparent 30%),
      radial-gradient(circle at bottom right, rgba(255,0,255,0.06), transparent 25%),
      linear-gradient(180deg, #000000, #050814);
  }

  .terminal-scrollbar::-webkit-scrollbar { width: 4px; }
  .terminal-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .terminal-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,255,255,0.2); border-radius: 2px; }
  .terminal-scrollbar::-webkit-scrollbar-thumb:hover { background: #00FFFF; }
` }} />

            <div className="predictive-root font-orbitron text-[#e0e3e5] overflow-hidden h-screen relative">

                {/* Hex grid SVG */}
                <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
                    <svg className="w-full h-full">
                        <defs>
                            <pattern id="hexGridPred" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
                                <path d="M30 0 L60 15 L60 37 L30 52 L0 37 L0 15 Z" fill="none" stroke="#00FFFF" strokeWidth="0.5" opacity="0.5" />
                            </pattern>
                            <radialGradient id="cosmicGlowPred" cx="50%" cy="50%">
                                <stop offset="0%" stopColor="#FF00FF" stopOpacity="0.2" />
                                <stop offset="50%" stopColor="#00FFFF" stopOpacity="0.08" />
                                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                            </radialGradient>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#hexGridPred)" />
                        <circle cx="50%" cy="50%" r="40%" fill="url(#cosmicGlowPred)" />
                    </svg>
                </div>

                {/* NEXUS glow borders */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-80 z-50" />
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF00FF] to-transparent opacity-80 z-50" />
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#00FF88] to-transparent opacity-70 z-50" />
                <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#FF00FF] to-transparent opacity-70 z-50" />

                {/* Orbs */}
                <div className="fixed top-20 right-20 w-96 h-96 bg-[#00ffff]/5 rounded-full blur-[120px] pointer-events-none z-0" />
                <div className="fixed bottom-20 left-80 w-80 h-80 bg-[#ff00ff]/5 rounded-full blur-[100px] pointer-events-none z-0" />

                {/* Scanline */}
                <div className="scanline-fx" />

                <div className="flex h-screen overflow-hidden relative z-10">

                    {/* Sidebar container géré avec Tailwind pour l'animation fluide */}
                    <div
                        className={`transition-all duration-300 ease-in-out h-full overflow-hidden ${sidebarCollapsed ? "w-0 opacity-0" : "w-80 opacity-100"
                            }`}
                    >
                        <Sidebar pulsePhase={0} />
                    </div>

                    {/* Toggle Sidebar Button - Se positionne parfaitement par est lié à l'état de la transition */}
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="absolute top-1/2 z-50 w-8 h-16 bg-gradient-to-r from-[#00FFFF22] to-transparent border-y border-r border-[#00FFFF44] rounded-r-lg flex items-center justify-center cursor-pointer hover:from-[#00FFFF44] transition-all transform -translate-y-1/2 pointer-events-auto"
                        style={{
                            left: sidebarCollapsed ? "0px" : "320px",
                            transition: "left 0.3s ease-in-out" // Aligné sur la même durée que le container
                        }}
                    >
                        <ChevronRight
                            className="w-4 h-4 text-[#00FFFF] transition-transform duration-300"
                            style={{ transform: sidebarCollapsed ? "rotate(0deg)" : "rotate(180deg)" }}
                        />
                    </button>

                    {/* MAIN CONTENT AREA */}
                    <main className="flex-1 h-screen flex flex-col overflow-hidden relative">

                        {/* TOP NAV BAR */}
                        <header className="flex justify-between items-center w-full px-8 py-4 sticky top-0 z-40 border-b border-[#00FFFF22]"
                            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(20px)' }}>
                            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-40" />
                            <div className="flex items-center gap-6">
                                <h1 className="font-orbitron text-[13px] font-black text-[#00FFFF] uppercase tracking-[0.15em]"
                                    style={{ textShadow: '0 0 15px rgba(0,255,255,0.6)' }}>
                                    PREDICTIVE_ENGINE // TREND_ANALYSIS
                                </h1>
                                <div className="flex items-center gap-4 border-l border-[#00FFFF22] pl-6">
                                    <span className="font-orbitron text-[10px] text-[#00FFFF88] tracking-widest">GLOBAL_RISK: 24%</span>
                                    <span className="font-orbitron text-[10px] text-[#00FFFF88] tracking-widest">CONFIDENCE: 98.2%</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2 bg-[#00FFFF11] border border-[#00FFFF33] px-3 py-1 rounded-full">
                                    <div className="w-2 h-2 bg-[#00FFFF] rounded-full pulse-cyan" />
                                    <span className="font-orbitron text-[10px] font-bold text-[#00FFFF] tracking-widest">AI_MODEL: ACTIVE_PROJECTION</span>
                                </div>
                                <div className="flex items-center gap-4 text-[#00FFFF88]">
                                    {['🔔', '🌐', '⚙'].map((icon, i) => (
                                        <span key={i} className="cursor-pointer hover:text-[#00FFFF] transition-all text-lg">{icon}</span>
                                    ))}
                                    <button className="bg-transparent border border-[#00FFFF44] text-[#00FFFF] font-orbitron px-4 py-1 text-[10px] font-bold hover:bg-[#00FFFF] hover:text-black transition-all tracking-widest rounded">
                                        SIM_MODE
                                    </button>
                                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#00FFFF44]" style={{ boxShadow: '0 0 10px rgba(0,255,255,0.3)' }}>
                                        <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5dx8ZYsyitI3fInbOtIpW84DIq3QkHHfgNZo3qgpLZsnuCZow3sQ36drhcFZ34g7KETY-euvX57sXDj4CCY7_nGhXglXw0WaPE1Y78grrWg5FO_g0QcW0yczWQxgNIyX-dlz_Oh9e25YDIbwuiyCrbQ1UnRql-z2UR2mYghKA27Ac0cajkguXs6y1E5tN32nw8n_cgV0ozL8y2THdZD9yAdC0ig_AxpbAA2YLXAnp6ngbQ0VA2CoGDT_YB4kbQhsOkXvFjJuyC3uc" alt="operator" />
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* DASHBOARD BODY */}
                        <div className="flex-1 p-6 overflow-y-auto space-y-6 terminal-scrollbar">

                            {/* CRITICAL FORECAST BANNER */}
                            <section className="relative overflow-hidden border border-[#FFB800] p-6 angular-cut flex items-center justify-between rounded-xl"
                                style={{ background: 'rgba(255,184,0,0.08)', boxShadow: '0 0 30px rgba(255,184,0,0.1)' }}>
                                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FFB800] to-transparent opacity-80" />
                                <div className="flex items-center gap-6">
                                    <span className="text-4xl" style={{ filter: 'drop-shadow(0 0 10px rgba(255,184,0,0.8))', animation: 'pulse-cyan 1s cubic-bezier(0.4,0,0.6,1) infinite' }}>⚠</span>
                                    <div>
                                        <h2 className="text-[#FFB800] font-orbitron text-lg font-bold glitch-text" style={{ textShadow: '0 0 15px rgba(255,184,0,0.8)' }}>
                                            CRITICAL_PROJECTION
                                        </h2>
                                        <p className="font-orbitron text-[11px] text-[#FFB800CC] max-w-2xl mt-1 uppercase tracking-[0.05em]">
                                            IF THE NETWORK LOAD CONTINUES ON THIS TRAJECTORY, SYSTEM SATURATION IS PREDICTED IN 45 MINUTES.
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div ref={countdownRef} className="text-3xl font-orbitron font-black text-[#FFB800] tracking-widest glitch-text"
                                        style={{ textShadow: '0 0 20px rgba(255,184,0,0.8)' }}>
                                        [ 00 : {mStr} : {sStr} ]
                                    </div>
                                    <div className="font-orbitron text-[10px] text-[#FFB80066] mt-1 tracking-widest">EST_SATURATION_UTC</div>
                                </div>
                                <div className="absolute right-0 top-0 h-full w-24 opacity-10 pointer-events-none text-[#FFB800]">
                                    <svg className="h-full w-full" viewBox="0 0 100 100">
                                        <line stroke="currentColor" strokeWidth="2" x1="0" x2="100" y1="0" y2="100" />
                                        <line stroke="currentColor" strokeWidth="2" x1="20" x2="100" y1="0" y2="80" />
                                        <line stroke="currentColor" strokeWidth="2" x1="40" x2="100" y1="0" y2="60" />
                                    </svg>
                                </div>
                            </section>

                            {/* CORE DATA GRID */}
                            <div className="grid grid-cols-12 gap-6">

                                {/* PROJECTION VISUALIZATION */}
                                <div className="col-span-12 xl:col-span-9 glass-panel relative p-8 group rounded-xl overflow-hidden">
                                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-60" />
                                    <div className="absolute top-0 left-0 p-4 font-orbitron text-[10px] text-[#00FFFF44] flex flex-col gap-1">
                                        <span>LAT: 45.654</span>
                                        <span>LNG: -12.332</span>
                                    </div>
                                    <div className="absolute bottom-0 right-0 p-4 font-orbitron text-[10px] text-[#00FFFF44]">
                                        <span>NODE_ID: PX_77</span>
                                    </div>

                                    <div className="flex justify-between items-end mb-8">
                                        <div>
                                            <h3 className="font-orbitron text-xl font-bold text-white tracking-widest flex items-center gap-3"
                                                style={{ textShadow: '0 0 15px rgba(0,255,255,0.3)' }}>
                                                LOAD_TRAJECTORY_ANALYSIS
                                                <span className="text-[#00FFFF] animate-pulse text-xl">◎</span>
                                            </h3>
                                            <p className="font-orbitron text-[10px] text-[#00FFFF88] mt-1 tracking-[0.05em]">
                                                REAL-TIME DATA STREAM FROM CORE CLUSTERS ALPHA-7 THROUGH GAMMA-2
                                            </p>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-[#00FFFF]" style={{ boxShadow: '0 0 6px #00FFFF' }} />
                                                <span className="font-orbitron text-[10px] text-[#00FFFF88]">HISTORICAL</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 border border-dashed border-[#FF00FF]" />
                                                <span className="font-orbitron text-[10px] text-[#00FFFF88]">PREDICTIVE</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* SVG CHART */}
                                    <div className="w-full h-80 relative">
                                        <div className="absolute top-[15%] w-full border-t border-red-500/50 border-dashed z-10 flex items-center">
                                            <span className="bg-red-500/20 text-red-400 font-orbitron text-[8px] font-bold px-2 py-0.5 ml-4 tracking-[0.1em]">
                                                CRITICAL THRESHOLD: 85%
                                            </span>
                                        </div>
                                        <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 400">
                                            <g stroke="rgba(0,255,255,0.06)" strokeWidth="1">
                                                <line x1="0" x2="1000" y1="100" y2="100" />
                                                <line x1="0" x2="1000" y1="200" y2="200" />
                                                <line x1="0" x2="1000" y1="300" y2="300" />
                                                <line x1="250" x2="250" y1="0" y2="400" />
                                                <line x1="500" x2="500" y1="0" y2="400" />
                                                <line x1="750" x2="750" y1="0" y2="400" />
                                            </g>
                                            <path d="M 0,350 Q 150,340 250,280 T 500,220" fill="none" stroke="#00FFFF" strokeWidth="4"
                                                style={{ filter: 'drop-shadow(0 0 6px rgba(0,255,255,0.8))' }} />
                                            <path className="animate-dash" d="M 500,220 Q 650,180 750,100 T 1000,20" fill="none"
                                                stroke="#FF00FF" strokeDasharray="10,5" strokeWidth="4"
                                                style={{ filter: 'drop-shadow(0 0 6px rgba(255,0,255,0.8))' }} />
                                            <g transform="translate(760, 95)">
                                                <circle className="animate-ping opacity-75" fill="#FF00FF" r="6" />
                                                <circle fill="#FF00FF" r="4" style={{ filter: 'drop-shadow(0 0 6px rgba(255,0,255,0.8))' }} />
                                                <text fontFamily="Orbitron, sans-serif" fontWeight="bold" fontSize="14" fill="#FF00FF" x="10" y="-10">
                                                    SATURATION_BREACH
                                                </text>
                                            </g>
                                            <circle cx="100" cy="345" fill="#00FFFF" r="3" style={{ filter: 'drop-shadow(0 0 4px #00FFFF)' }} />
                                            <circle cx="250" cy="280" fill="#00FFFF" r="3" style={{ filter: 'drop-shadow(0 0 4px #00FFFF)' }} />
                                            <circle cx="500" cy="220" fill="white" r="5" style={{ filter: 'drop-shadow(0 0 6px white)' }} />
                                        </svg>

                                        {/* Hover Crosshair */}
                                        <div className="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="relative">
                                                <div className="absolute h-48 w-[1px] bg-[#00FFFF33] left-0 -top-24" />
                                                <div className="absolute w-48 h-[1px] bg-[#00FFFF33] -left-24 top-0" />
                                                <div className="absolute -top-12 -left-24 bg-[#00000088] backdrop-blur-md p-2 border border-[#00FFFF44] min-w-[120px] rounded-lg">
                                                    <div className="font-orbitron text-[10px] font-bold text-white mb-1">PROJ_POINT: 88.42%</div>
                                                    <div className="w-full bg-[#00FFFF11] h-1 rounded-full">
                                                        <div className="bg-[#00FFFF] h-full rounded-full" style={{ width: '88%' }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Stat Bar */}
                                    <div className="grid grid-cols-4 gap-4 mt-8 pt-8 border-t border-[#00FFFF22]">
                                        {[
                                            { label: 'CURRENT_THROUGHPUT', value: '452.8 GB/s', color: '#00FFFF' },
                                            { label: 'CPU_RESERVATION', value: '72.4%', color: '#00FFFF' },
                                            { label: 'PACKET_LOSS_VAR', value: '0.002%', color: '#00FF88' },
                                            { label: 'PREDICTED_SPIKE', value: '+142%', color: '#FF00FF' },
                                        ].map((stat) => (
                                            <div key={stat.label}>
                                                <span className="font-orbitron text-[10px] text-[#00FFFF88] block mb-1 tracking-[0.1em]">{stat.label}</span>
                                                <span className="font-orbitron text-lg font-bold" style={{ color: stat.color, textShadow: `0 0 10px ${stat.color}66` }}>
                                                    {stat.value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* RIGHT DIAGNOSTICS HUD */}
                                <div className="col-span-12 xl:col-span-3 space-y-4">

                                    {/* REAL TIME METRICS */}
                                    <div className="glass-panel p-6 angular-cut rounded-xl relative overflow-hidden">
                                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-60" />
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-orbitron font-bold text-[11px] tracking-widest text-[#00FFFF]"
                                                style={{ textShadow: '0 0 10px rgba(0,255,255,0.5)' }}>
                                                REAL_TIME_METRICS
                                            </h4>
                                            <span className="text-[#00FFFF] text-sm">◈</span>
                                        </div>
                                        <div className="space-y-4">
                                            {[
                                                { label: 'Global Risk Factor', value: 'HIGH_LEVEL', valueColor: '#FF3366', barColor: '#FF3366', barW: '82%' },
                                                { label: 'Confidence Score', value: '98.22%', valueColor: '#00FFFF', barColor: '#00FFFF', barW: '98%' },
                                                { label: 'Mitigation Status', value: 'PENDING_APPROVAL', valueColor: '#FFB800', barColor: '#FFB800', barW: '45%' },
                                            ].map((metric) => (
                                                <div key={metric.label}>
                                                    <div className="flex justify-between items-center group mb-2">
                                                        <span className="font-orbitron text-[10px] text-[#00FFFF88] group-hover:text-[#00FFFF] transition-colors tracking-[0.05em]">
                                                            {metric.label}
                                                        </span>
                                                        <span className="font-orbitron text-[10px] font-bold" style={{ color: metric.valueColor, textShadow: `0 0 8px ${metric.valueColor}66` }}>
                                                            {metric.value}
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-[#00FFFF11] h-1.5 overflow-hidden rounded-full">
                                                        <div className="h-full rounded-full" style={{ width: metric.barW, background: metric.barColor, boxShadow: `0 0 8px ${metric.barColor}66` }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* MITIGATION PROCEDURES */}
                                    <div className="glass-panel p-6 angular-cut relative rounded-xl overflow-hidden">
                                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-60" />
                                        <div className="absolute top-0 right-0 w-8 h-8 opacity-20">
                                            <svg fill="#00FFFF" viewBox="0 0 10 10"><path d="M0 0 L10 0 L10 10 Z" /></svg>
                                        </div>
                                        <h4 className="font-orbitron font-bold text-[11px] tracking-widest text-[#00FFFF] mb-4"
                                            style={{ textShadow: '0 0 10px rgba(0,255,255,0.5)' }}>
                                            MITIGATION_PROCEDURES
                                        </h4>
                                        <ul className="space-y-3">
                                            {[
                                                { icon: '↻', label: 'Initiate Re-routing', magenta: false },
                                                { icon: '⚡', label: 'Engage Auto-throttle', magenta: false },
                                                { icon: '⚖', label: 'Activate Hypervisor Balancing', magenta: true },
                                            ].map((item) => (
                                                <li key={item.label}
                                                    className={`flex items-center justify-between p-3 border cursor-pointer transition-all rounded-lg ${item.magenta
                                                        ? 'border-[#FF00FF44] bg-[#FF00FF11] hover:border-[#FF00FF]'
                                                        : 'border-[#00FFFF22] bg-[#00FFFF08] hover:border-[#00FFFF]'
                                                        }`}>
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-orbitron text-lg" style={{ color: item.magenta ? '#FF00FF' : '#00FFFF', textShadow: `0 0 8px ${item.magenta ? 'rgba(255,0,255,0.6)' : 'rgba(0,255,255,0.6)'}` }}>
                                                            {item.icon}
                                                        </span>
                                                        <span className="font-orbitron text-[10px] text-[#e0e3e5] tracking-[0.05em]">{item.label}</span>
                                                    </div>
                                                    <span className="font-orbitron text-sm" style={{ color: item.magenta ? '#FF00FF' : '#00FFFF88' }}>›</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="mt-6 p-4 bg-[#FF336611] border border-[#FF336644] rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-[#FF3366] text-sm">⚠</span>
                                                <span className="font-orbitron text-[10px] font-bold text-[#FF3366] tracking-[0.1em]">SYSTEM_LOCKOUT_WARN</span>
                                            </div>
                                            <p className="font-orbitron text-[9px] text-[#FF336688] leading-relaxed uppercase tracking-[0.05em]">
                                                Manual override required for protocol 4.0 execution. Secondary authentication handshake failed.
                                            </p>
                                        </div>
                                    </div>

                                    {/* ANALYTIC FEED */}
                                    <div className="glass-panel p-4 rounded-xl overflow-hidden relative">
                                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-40" />
                                        <div className="border-l-2 border-[#00FFFF44] pl-4 space-y-1 font-code text-[10px]">
                                            {[
                                                { time: '14:22:01', msg: 'LOG: ANALYZING_CLUSTER_A7... OK', color: '#00FFFF88' },
                                                { time: '14:22:15', msg: 'WARN: UNUSUAL_TRAFFIC_SPIKE_DETECTED', color: '#FFB800' },
                                                { time: '14:23:00', msg: 'SYS: CALCULATING_TRAJECTORY_PROJECTIONS...', color: '#00FFFF' }
                                            ].map((log, idx) => (
                                                <div key={idx} style={{ color: log.color }}>
                                                    <span className="text-[#00FFFF44] mr-2">[{log.time}]</span>
                                                    {log.msg}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}