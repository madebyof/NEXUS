'use client';

import React, { useEffect, useRef } from 'react';
import Sidebar from "@/components/Sidebar";
import { ChevronRight } from "lucide-react";

export default function NodeAlpha09() {
    const terminalInputRef = useRef<HTMLInputElement>(null);
    const terminalOutputRef = useRef<HTMLDivElement>(null);
    const cpuPathRef = useRef<SVGPathElement>(null);
    const memoryBarsRef = useRef<HTMLDivElement>(null);
    const gaugePctRef = useRef<HTMLSpanElement>(null);
    const gaugeCircleRef = useRef<SVGCircleElement>(null);

    // Terminal Logic
    useEffect(() => {
        const terminalInput = terminalInputRef.current;
        const terminalOutput = terminalOutputRef.current;
        if (!terminalInput || !terminalOutput) return;

        const commands: Record<string, () => string> = {
            'help': () => 'Available commands: help, ping, show run, clear, whoami, status',
            'ping': () => 'PING 192.168.100.42 (192.168.100.42) 56(84) bytes of data.\n64 bytes from 192.168.100.42: icmp_seq=1 ttl=64 time=0.042 ms\n64 bytes from 192.168.100.42: icmp_seq=2 ttl=64 time=0.039 ms\n[WARNING] Latency spikes detected during icmp_seq=2.',
            'show run': () => 'Building configuration...\nCurrent configuration: 420 lines\n! \ninterface GigabitEthernet0/1\n description BACKBONE_UPSTREAM\n ip address 10.0.0.1 255.255.255.252\n shutdown ! SECURITY_LOCKDOWN_ACTIVE\n!',
            'whoami': () => 'root (SYSTEM_ADMIN_LEVEL_0)',
            'status': () => 'SYSTEM_STATUS: COMPROMISED\nUPTIME: 142 days, 04:22:11\nACTIVE_THREATS: 4\nTHREAT_ID: RX-900',
            'clear': () => { terminalOutput.innerHTML = ''; return ''; }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                const cmd = terminalInput.value.trim().toLowerCase();
                const output = document.createElement('div');
                output.innerHTML = `<span style="color:rgba(0,255,255,0.5)">root@nexus_core:~#</span> ${terminalInput.value}`;
                terminalOutput.appendChild(output);
                if (cmd) {
                    const response = document.createElement('div');
                    response.style.cssText = 'font-family: Orbitron, sans-serif; font-size: 11px; white-space: pre-wrap; margin-top: 4px; margin-bottom: 8px; padding-left: 16px; border-left: 1px solid rgba(0,255,255,0.2); color: #00FFFF;';
                    if (commands[cmd]) {
                        response.innerText = commands[cmd]();
                    } else {
                        response.innerText = `Command not found: ${cmd}`;
                        response.style.color = '#FF3366';
                    }
                    terminalOutput.appendChild(response);
                }
                terminalInput.value = '';
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
            }
        };

        terminalInput.addEventListener('keydown', handleKeyDown);
        return () => terminalInput.removeEventListener('keydown', handleKeyDown);
    }, []);

    // CPU Wave Animation
    useEffect(() => {
        const cpuPath = cpuPathRef.current;
        if (!cpuPath) return;
        let cpuT = 0;
        let rafId: number;
        function animateCpu() {
            cpuT += 0.1;
            let d = 'M 0 50';
            for (let i = 0; i <= 400; i += 5) {
                const jitter = Math.random() * 10;
                const y = 50 + Math.sin((i / 20) + cpuT) * 20 + jitter;
                d += ` L ${i} ${y}`;
            }
            cpuPath.setAttribute('d', d);
            rafId = requestAnimationFrame(animateCpu);
        }
        animateCpu();
        return () => cancelAnimationFrame(rafId);
    }, []);

    // Memory Bars
    useEffect(() => {
        const memoryContainer = memoryBarsRef.current;
        if (!memoryContainer) return;
        memoryContainer.innerHTML = '';
        for (let i = 0; i < 40; i++) {
            const bar = document.createElement('div');
            bar.style.cssText = `flex: 1; background: rgba(0,255,255,0.25); border-top: 1px solid rgba(0,255,255,0.6); height: ${Math.random() * 80 + 20}%; transition: height 0.1s;`;
            memoryContainer.appendChild(bar);
        }
        const intervalId = setInterval(() => {
            const bars = memoryContainer.children;
            if (!bars.length) return;
            const randomIdx = Math.floor(Math.random() * bars.length);
            const bar = bars[randomIdx] as HTMLElement;
            bar.style.height = `${Math.random() * 80 + 20}%`;
            if (Math.random() > 0.8) {
                bar.style.background = 'rgba(255,0,255,0.6)';
                bar.style.borderTopColor = '#FF00FF';
            } else {
                bar.style.background = 'rgba(0,255,255,0.25)';
                bar.style.borderTopColor = 'rgba(0,255,255,0.6)';
            }
        }, 100);
        return () => clearInterval(intervalId);
    }, []);

    // Gauge Animation
    useEffect(() => {
        const timer = setTimeout(() => {
            if (gaugeCircleRef.current) {
                gaugeCircleRef.current.style.strokeDashoffset = '47.3';
            }
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    // Random glitch logs
    useEffect(() => {
        const terminalOutput = terminalOutputRef.current;
        if (!terminalOutput) return;
        const intervalId = setInterval(() => {
            if (Math.random() > 0.95) {
                const log = document.createElement('div');
                log.style.cssText = 'font-family: Orbitron, sans-serif; font-size: 10px; color: #FF00FF; opacity: 0.7;';
                log.className = 'animate-pulse';
                log.innerText = `[IO_ERROR] Unaligned memory access at 0x${Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase()}`;
                terminalOutput.appendChild(log);
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
            }
        }, 2000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

            <style jsx global>{`
        .font-orbitron { font-family: 'Orbitron', sans-serif; }
        .font-mono-nexus { font-family: 'JetBrains Mono', monospace; }

        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .animate-blink { animation: blink 0.8s infinite; }

        @keyframes scanlineAnim {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .scanline-fx {
          position: absolute; top: 0; left: 0; width: 100%; height: 2px;
          background: linear-gradient(to right, transparent, #00FFFF, transparent);
          box-shadow: 0 0 15px #00FFFF;
          opacity: 0.15;
          animation: scanlineAnim 4s linear infinite;
          pointer-events: none;
        }

        .terminal-scrollbar::-webkit-scrollbar { width: 4px; }
        .terminal-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .terminal-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,255,255,0.2); border-radius: 2px; }
        .terminal-scrollbar::-webkit-scrollbar-thumb:hover { background: #00FFFF; }

        .glass-panel {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          background: rgba(0, 0, 0, 0.55);
          border: 1px solid rgba(0, 255, 255, 0.15);
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.04);
        }

        .node-alpha-root {
          background-color: #000000;
          background-image:
            radial-gradient(circle at top, rgba(0,255,255,0.08), transparent 30%),
            radial-gradient(circle at bottom right, rgba(255,0,255,0.06), transparent 25%),
            linear-gradient(180deg, #000000, #050814),
            radial-gradient(#ffffff05 1px, transparent 1px);
          background-size: auto, auto, auto, 20px 20px;
        }
      `}</style>

            <div className="node-alpha-root font-orbitron text-[#e0e3e5] overflow-hidden h-screen relative flex">
                
                {/* Inclusion de la Sidebar */}
                <Sidebar />

                {/* Conteneur principal ajustable avec ChevronRight importé si besoin */}
                <div className="flex-1 h-full relative overflow-hidden">

                    {/* Hex grid + cosmic glow overlay */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
                        <svg className="w-full h-full">
                            <defs>
                                <pattern id="hexGridNode" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
                                    <path d="M30 0 L60 15 L60 37 L30 52 L0 37 L0 15 Z" fill="none" stroke="#00FFFF" strokeWidth="0.5" opacity="0.5" />
                                </pattern>
                                <radialGradient id="cosmicGlowNode" cx="50%" cy="50%">
                                    <stop offset="0%" stopColor="#FF00FF" stopOpacity="0.2" />
                                    <stop offset="50%" stopColor="#00FFFF" stopOpacity="0.08" />
                                    <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                                </radialGradient>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#hexGridNode)" />
                            <circle cx="50%" cy="50%" r="40%" fill="url(#cosmicGlowNode)" />
                        </svg>
                    </div>

                    {/* NEXUS glow borders */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-80 z-50" />
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF00FF] to-transparent opacity-80 z-50" />
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#00FF88] to-transparent opacity-70 z-50" />
                    <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#FF00FF] to-transparent opacity-70 z-50" />

                    {/* Orbs */}
                    <div className="fixed top-20 right-20 w-96 h-96 bg-[#00ffff]/5 rounded-full blur-[120px] pointer-events-none z-0" />
                    <div className="fixed bottom-20 left-20 w-80 h-80 bg-[#ff00ff]/5 rounded-full blur-[100px] pointer-events-none z-0" />

                    {/* Main Content */}
                    <main className="h-screen overflow-y-auto p-6 relative z-10 terminal-scrollbar">
                        <div className="scanline-fx" />

                        {/* Header Section */}
                        <div className="flex flex-col lg:flex-row gap-4 mb-6 items-start justify-between">
                            <div className="glass-panel p-6 flex flex-1 w-full gap-8 relative overflow-hidden rounded-xl">
                                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-60" />
                                <div className="absolute top-0 right-0 p-2 opacity-5 rotate-45 pointer-events-none">
                                    <span className="text-[120px] text-[#FFB800]">⚠</span>
                                </div>
                                <div className="relative z-10 flex flex-col md:flex-row gap-8 w-full items-center md:items-start">

                                    {/* Progress Gauge */}
                                    <div className="relative w-32 h-32 flex-shrink-0">
                                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
                                            <circle cx="64" cy="64" fill="transparent" r="58" stroke="rgba(0,255,255,0.15)" strokeWidth="2" />
                                            <circle
                                                ref={gaugeCircleRef}
                                                cx="64" cy="64" fill="transparent" r="58"
                                                stroke="#00FFFF" strokeWidth="4"
                                                strokeDasharray="364.4" strokeDashoffset="364.4"
                                                style={{ transition: 'stroke-dashoffset 1s ease-out', filter: 'drop-shadow(0 0 8px rgba(0,255,255,0.8))' }}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span ref={gaugePctRef} className="font-orbitron text-[14px] font-bold text-[#00FFFF]" style={{ textShadow: '0 0 10px rgba(0,255,255,0.8)' }}>87%</span>
                                            <span className="font-orbitron text-[8px] text-[#00FFFF88] uppercase tracking-[0.1em]">Neural Scan</span>
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-2 text-center md:text-left">
                                        <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                                            <h1 className="font-orbitron text-[22px] font-bold tracking-tight text-white" style={{ textShadow: '0 0 20px rgba(0,255,255,0.4)' }}>
                                                NODE_ALPHA_09 // <span className="text-[#FF00FF]" style={{ textShadow: '0 0 15px rgba(255,0,255,0.8)' }}>COMPROMIS</span>
                                            </h1>
                                            <span className="bg-[#FF336622] border border-[#FF3366] text-[#FF3366] font-orbitron text-[10px] px-3 py-1 animate-blink font-bold tracking-[0.15em] rounded-full">
                                                MENACE CRITIQUE
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                                            <div>
                                                <p className="font-orbitron text-[9px] text-[#00FFFF88] tracking-[0.15em] mb-1">IP_ADDRESS</p>
                                                <p className="font-orbitron text-[12px] text-[#00FFFF]">192.168.100.42</p>
                                            </div>
                                            <div>
                                                <p className="font-orbitron text-[9px] text-[#00FFFF88] tracking-[0.15em] mb-1">LOCATION</p>
                                                <p className="font-orbitron text-[12px] text-[#00FFFF]">SECTOR_7G_CORE</p>
                                            </div>
                                            <div>
                                                <p className="font-orbitron text-[9px] text-[#00FFFF88] tracking-[0.15em] mb-1">STATUS_LOCK</p>
                                                <p className="font-orbitron text-[12px] text-[#FF00FF]" style={{ textShadow: '0 0 8px rgba(255,0,255,0.6)' }}>OVERRIDE_ACTIVE</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Diagnostic Matrix Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

                            {/* CPU Load Vector */}
                            <div className="glass-panel p-4 rounded-xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-60" />
                                <div className="flex justify-between items-center mb-4 border-b border-[#00FFFF22] pb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-[#00FFFF]" style={{ boxShadow: '0 0 6px #00FFFF' }} />
                                        <h3 className="font-orbitron text-[11px] font-bold text-[#00FFFF] uppercase tracking-[0.15em]">CPU Load Vector</h3>
                                    </div>
                                    <span className="font-orbitron text-[9px] text-[#00FFFF88] tracking-[0.1em]">FREQ: 4.2 GHz</span>
                                </div>
                                <div className="h-32 w-full bg-black/40 relative overflow-hidden rounded-lg">
                                    <svg className="w-full h-full" id="cpu-wave" preserveAspectRatio="none" viewBox="0 0 400 100">
                                        <path ref={cpuPathRef} d="" fill="none" stroke="#00FFFF" strokeWidth="2" style={{ filter: 'drop-shadow(0 0 4px rgba(0,255,255,0.6))' }} />
                                    </svg>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-2">
                                    <div className="p-2 rounded-lg bg-[#00FFFF11] border border-[#00FFFF22]">
                                        <span className="font-orbitron text-[9px] text-[#00FFFF88] block tracking-[0.1em]">VOLTAGE</span>
                                        <span className="font-orbitron text-[12px] text-[#00FFFF]">1.21V</span>
                                    </div>
                                    <div className="p-2 rounded-lg bg-[#FF00FF11] border border-[#FF00FF22]">
                                        <span className="font-orbitron text-[9px] text-[#FF00FF88] block tracking-[0.1em]">TEMP_CORE</span>
                                        <span className="font-orbitron text-[12px] text-[#FF00FF]" style={{ textShadow: '0 0 8px rgba(255,0,255,0.6)' }}>84°C</span>
                                    </div>
                                </div>
                            </div>

                            {/* Memory Matrix */}
                            <div className="glass-panel p-4 rounded-xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-60" />
                                <div className="flex justify-between items-center mb-4 border-b border-[#00FFFF22] pb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-[#00FFFF]" style={{ boxShadow: '0 0 6px #00FFFF' }} />
                                        <h3 className="font-orbitron text-[11px] font-bold text-[#00FFFF] uppercase tracking-[0.15em]">Memory Matrix</h3>
                                    </div>
                                    <span className="font-orbitron text-[9px] text-[#00FFFF88] tracking-[0.1em]">BUF: 87%</span>
                                </div>
                                <div className="h-32 flex items-end gap-1 px-2 bg-black/40 rounded-lg overflow-hidden">
                                    <div ref={memoryBarsRef} className="flex-1 h-full flex items-end gap-[2px]" />
                                </div>
                                <div className="mt-4 p-2 rounded-lg bg-[#FF00FF11] border border-[#FF00FF22]">
                                    <div className="flex justify-between items-center">
                                        <span className="font-orbitron text-[9px] text-[#FF00FF88] uppercase tracking-[0.1em]">Buffer Overflow Alert</span>
                                        <span className="font-orbitron text-[9px] text-[#FF00FF] font-bold">CRITICAL</span>
                                    </div>
                                    <div className="w-full h-1 bg-[#00000088] rounded-full mt-1 overflow-hidden">
                                        <div className="h-full rounded-full w-[87%] animate-pulse bg-gradient-to-r from-[#FF00FF] to-[#FF3366]" style={{ boxShadow: '0 0 8px rgba(255,0,255,0.5)' }} />
                                    </div>
                                </div>
                            </div>

                            {/* Network Flow Topology */}
                            <div className="glass-panel p-4 rounded-xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-60" />
                                <div className="flex justify-between items-center mb-4 border-b border-[#00FFFF22] pb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-[#00FFFF]" style={{ boxShadow: '0 0 6px #00FFFF' }} />
                                        <h3 className="font-orbitron text-[11px] font-bold text-[#00FFFF] uppercase tracking-[0.15em]">Flow Topology</h3>
                                    </div>
                                    <span className="font-orbitron text-[9px] text-[#FF3366] tracking-[0.1em]">SEC_LVL: 0</span>
                                </div>
                                <div className="h-32 bg-black/40 relative flex items-center justify-center rounded-lg overflow-hidden">
                                    <div className="relative w-full h-full">
                                        <svg className="w-full h-full" viewBox="0 0 200 100">
                                            <rect fill="none" height="20" stroke="#00FFFF" strokeWidth="1" width="20" x="10" y="40" style={{ filter: 'drop-shadow(0 0 3px rgba(0,255,255,0.6))' }} />
                                            <rect fill="none" height="20" stroke="#FF00FF" strokeWidth="1" width="20" x="90" y="10" style={{ filter: 'drop-shadow(0 0 3px rgba(255,0,255,0.6))' }} />
                                            <rect fill="none" height="20" stroke="#00FFFF" strokeWidth="1" width="20" x="90" y="70" style={{ filter: 'drop-shadow(0 0 3px rgba(0,255,255,0.6))' }} />
                                            <rect fill="none" height="20" stroke="#00FFFF" strokeWidth="1" width="20" x="170" y="40" style={{ filter: 'drop-shadow(0 0 3px rgba(0,255,255,0.6))' }} />
                                            <line stroke="#00FFFF" strokeDasharray="2 2" strokeWidth="0.5" x1="30" x2="90" y1="50" y2="20" />
                                            <line stroke="#00FFFF" strokeWidth="0.5" x1="30" x2="90" y1="50" y2="80" />
                                            <line stroke="#FF00FF" strokeWidth="1" x1="110" x2="170" y1="20" y2="50" style={{ filter: 'drop-shadow(0 0 2px rgba(255,0,255,0.8))' }} />
                                            <line stroke="#00FFFF" strokeWidth="0.5" x1="110" x2="170" y1="80" y2="50" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="mt-4 flex gap-4">
                                    <div className="flex-1 p-2 bg-[#FF00FF11] border border-[#FF00FF22] rounded-lg">
                                        <span className="font-orbitron text-[8px] text-[#FF00FF] font-bold block tracking-[0.1em]">MALICIOUS_INBOUND</span>
                                        <span className="font-orbitron text-[12px] text-[#FF00FF]">1.4 TB/s</span>
                                    </div>
                                    <div className="flex-1 p-2 bg-[#00FFFF11] border border-[#00FFFF22] rounded-lg">
                                        <span className="font-orbitron text-[8px] text-[#00FFFF] font-bold block tracking-[0.1em]">SYS_OUTBOUND</span>
                                        <span className="font-orbitron text-[12px] text-[#00FFFF]">240 KB/s</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Terminal Interface */}
                        <div className="rounded-xl overflow-hidden border border-[#00FFFF33]" style={{ background: 'rgba(0,0,0,0.85)', boxShadow: '0 0 30px rgba(0,255,255,0.08)' }}>
                            <div className="px-4 py-2 flex justify-between items-center border-b border-[#00FFFF22]"
                                style={{ background: 'rgba(0,255,255,0.06)' }}>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#00FFFF] animate-pulse" style={{ boxShadow: '0 0 6px #00FFFF' }} />
                                    <span className="font-orbitron text-[10px] text-[#00FFFF] font-bold tracking-[0.15em]">INTERFACE_CLI v1.0.4 - nexus_core</span>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 rounded-full bg-[#00FFFF55]" />
                                    <div className="w-2 h-2 rounded-full bg-[#00FFFF22]" />
                                </div>
                            </div>
                            <div
                                ref={terminalOutputRef}
                                className="h-48 p-4 font-orbitron text-[11px] text-[#00FFFF] overflow-y-auto terminal-scrollbar space-y-1"
                                style={{ lineHeight: '1.8' }}
                            >
                                <div>[SYSTEM] Booting secure shell... Success.</div>
                                <div>[SEC_AUDIT] Hook detected at syscall 0x80. Potential unauthorized access.</div>
                                <div>[SEC_AUDIT] WARNING: Rootkit presence suspected in /kernel/drivers.</div>
                                <div style={{ color: '#FF00FF', textShadow: '0 0 8px rgba(255,0,255,0.5)' }}>[CRITICAL] BUFFER_OVERFLOW detected at 0x42A19F88.</div>
                                <div style={{ color: 'rgba(0,255,255,0.6)' }}>Type &apos;help&apos; for available commands.</div>
                            </div>
                            <div className="p-4 flex items-center gap-2 border-t border-[#00FFFF22]"
                                style={{ background: 'rgba(0,255,255,0.03)' }}>
                                <span className="font-orbitron text-[11px] font-bold text-[#00FFFF]" style={{ textShadow: '0 0 8px rgba(0,255,255,0.6)' }}>root@nexus_core:~#</span>
                                <input
                                    ref={terminalInputRef}
                                    autoComplete="off"
                                    autoFocus
                                    className="flex-1 bg-transparent border-none outline-none font-orbitron text-[11px] text-[#00FFFF] placeholder:text-[#00FFFF44]"
                                    type="text"
                                    placeholder="_"
                                />
                            </div>
                        </div>

                    </main>

                    <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000_100%)] z-0" />
                </div>
            </div>
        </>
    );
}