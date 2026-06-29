'use client';

import React, { useEffect, useRef, useState } from 'react';
import Sidebar from "@/components/Sidebar";
import { ChevronRight } from "lucide-react";

export default function DataStreams() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const terminalRef = useRef<HTMLDivElement>(null);
    const threatTerminalRef = useRef<HTMLDivElement>(null);
    const throughputRef = useRef<HTMLSpanElement>(null);
    const latencyRef = useRef<HTMLSpanElement>(null);
    const coordsRef = useRef<HTMLDivElement>(null);
    const graphPathRef = useRef<SVGPathElement>(null);
    const graphAreaRef = useRef<SVGPathElement>(null);
    const wave1Ref = useRef<SVGPathElement>(null);
    const wave2Ref = useRef<SVGPathElement>(null);
    const matrixGridRef = useRef<HTMLDivElement>(null);
    const fluxBarsRef = useRef<HTMLDivElement>(null);
    const nodeContainerRef = useRef<HTMLDivElement>(null);
    const flashOverlayRef = useRef<HTMLDivElement>(null);
    const utcClockRef = useRef<HTMLDivElement>(null);
    const alertRef = useRef<HTMLDivElement>(null);
    const speedRef = useRef(1);

    // Canvas matrix rain
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const chars = '01ABCDEF-/_[]{}*#&%@!$^()0123456789'.split('');
        const fontSize = 14;
        let drops: number[] = [];
        let rafId: number;

        const resize = () => {
            canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth;
            canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight;
            const columns = Math.floor(canvas.width / fontSize);
            drops = Array.from({ length: columns }, () => Math.random() * -100);
        };

        const draw = () => {
            ctx.fillStyle = 'rgba(0,0,0,0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = `${fontSize}px "JetBrains Mono"`;
            drops.forEach((y, i) => {
                const char = chars[Math.floor(Math.random() * chars.length)];
                const isAlert = Math.random() < 0.04;
                ctx.shadowBlur = 10;
                if (isAlert) {
                    ctx.fillStyle = `rgba(255,51,102,${0.4 + Math.random() * 0.6})`;
                    ctx.shadowColor = '#FF3366';
                } else if (Math.random() > 0.5) {
                    ctx.fillStyle = `rgba(0,255,255,${0.3 + Math.random() * 0.7})`;
                    ctx.shadowColor = '#00FFFF';
                } else {
                    ctx.fillStyle = `rgba(0,255,136,${0.3 + Math.random() * 0.7})`;
                    ctx.shadowColor = '#00FF88';
                }
                ctx.fillText(char, i * fontSize, y * fontSize);
                if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
                drops[i] += speedRef.current;
            });
            rafId = requestAnimationFrame(draw);
        };

        window.addEventListener('resize', resize);
        resize();
        draw();
        return () => { cancelAnimationFrame(rafId); window.removeEventListener('resize', resize); };
    }, []);

    // Graph animation
    useEffect(() => {
        let phase = 0;
        let rafId: number;
        const update = () => {
            phase += 0.1;
            let d = 'M0 80 ';
            for (let i = 1; i <= 20; i++) {
                const x = i * 20;
                const y = 50 + Math.sin(phase + i * 0.5) * 20 + Math.random() * 10;
                d += `L ${x} ${y} `;
            }
            graphPathRef.current?.setAttribute('d', d);
            graphAreaRef.current?.setAttribute('d', d + 'V 100 H 0 Z');
            rafId = requestAnimationFrame(update);
        };
        update();
        return () => cancelAnimationFrame(rafId);
    }, []);

    // Waveform animation
    useEffect(() => {
        let t = 0;
        let rafId: number;
        const update = () => {
            t += 0.1;
            let d1 = 'M 0 50 ';
            let d2 = 'M 0 50 ';
            for (let x = 0; x <= 400; x += 10) {
                const y1 = 50 + Math.sin(x * 0.05 + t) * 15 + Math.sin(x * 0.1 + t * 2) * 5;
                const y2 = 50 + Math.cos(x * 0.03 + t * 0.5) * 20 + Math.sin(x * 0.08 + t) * 8;
                d1 += `L ${x} ${y1} `;
                d2 += `L ${x} ${y2} `;
            }
            wave1Ref.current?.setAttribute('d', d1);
            wave2Ref.current?.setAttribute('d', d2);
            rafId = requestAnimationFrame(update);
        };
        update();
        return () => cancelAnimationFrame(rafId);
    }, []);

    // Matrix grid
    useEffect(() => {
        const grid = matrixGridRef.current;
        if (!grid) return;
        grid.innerHTML = '';
        const cells: HTMLDivElement[] = [];
        for (let i = 0; i < 64; i++) {
            const cell = document.createElement('div');
            cell.style.cssText = 'border:1px solid rgba(255,255,255,0.05);transition:all 0.3s;';
            grid.appendChild(cell);
            cells.push(cell);
        }
        const interval = setInterval(() => {
            const idx = Math.floor(Math.random() * cells.length);
            const color = Math.random() > 0.3 ? 'rgba(0,255,255,0.4)' : 'rgba(0,255,136,0.4)';
            cells[idx].style.backgroundColor = color;
            cells[idx].style.boxShadow = `inset 0 0 10px ${color}`;
            setTimeout(() => { cells[idx].style.backgroundColor = 'transparent'; cells[idx].style.boxShadow = 'none'; }, 300);
            if (throughputRef.current) throughputRef.current.innerText = (800 + Math.random() * 100).toFixed(0) + ' Mbps';
        }, 150);
        return () => clearInterval(interval);
    }, []);

    // Flux bars
    useEffect(() => {
        const container = fluxBarsRef.current;
        if (!container) return;
        container.innerHTML = '';
        const bars: HTMLDivElement[] = [];
        for (let i = 0; i < 30; i++) {
            const bar = document.createElement('div');
            bar.style.cssText = 'flex:1;background:rgba(0,255,255,0.15);border-top:1px solid rgba(0,255,255,0.4);height:10%;transition:all 0.08s;';
            container.appendChild(bar);
            bars.push(bar);
        }
        let rafId: number;
        const update = () => {
            bars.forEach(bar => {
                const h = Math.random() * 80 + 10;
                bar.style.height = `${h}%`;
                bar.style.background = h > 80 && Math.random() > 0.8
                    ? 'rgba(0,255,136,0.6)' : 'rgba(0,255,255,0.2)';
            });
            setTimeout(() => { rafId = requestAnimationFrame(update); }, 80);
        };
        update();
        return () => cancelAnimationFrame(rafId);
    }, []);

    // Node cluster LEDs
    useEffect(() => {
        const container = nodeContainerRef.current;
        if (!container) return;
        container.innerHTML = '';
        const colors = ['#00FF88', '#00FF88', '#00FF88', '#FFB800', '#FF3366'];
        for (let i = 0; i < 15; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            const led = document.createElement('div');
            led.style.cssText = 'height:12px;background:rgba(41,42,43,0.8);border:1px solid rgba(58,73,75,0.3);display:flex;align-items:center;justify-content:center;';
            const dot = document.createElement('div');
            dot.style.cssText = `width:6px;height:6px;border-radius:50%;background:${color};box-shadow:0 0 5px ${color};animation:ledBlink 1.5s infinite alternate;`;
            led.appendChild(dot);
            container.appendChild(led);
        }
    }, []);

    // Telemetry logs
    useEffect(() => {
        const terminal = terminalRef.current;
        if (!terminal) return;
        const logTypes = ['INGRESS', 'ROUTING', 'SEC_PROTOCOL', 'HANDSHAKE', 'ENCRYPTION'];
        const logMsgs = [
            'Handshake verified from internal node 0x92',
            'Packet header validated: 1520 bytes',
            'Route established via backbone-east-01',
            'Decryption cycle complete. Key rotation success.',
            'Analyzing incoming telemetry from cluster_7',
            'Potential intrusion vector scanned: Status 200 OK',
            'Neural flux adjustment: Delta +0.02ms',
        ];
        const add = () => {
            const time = new Date().toLocaleTimeString('en-US', { hour12: false });
            const type = logTypes[Math.floor(Math.random() * logTypes.length)];
            const msg = logMsgs[Math.floor(Math.random() * logMsgs.length)];
            const el = document.createElement('div');
            el.style.cssText = "font-family:'Orbitron',sans-serif;font-size:10px;color:rgba(0,255,255,0.7);margin-bottom:2px;";
            el.innerHTML = `<span style="color:rgba(0,255,255,0.3)">[${time}]</span> <span style="color:#00FFFF;font-weight:bold">${type}</span>: ${msg}`;
            terminal.appendChild(el);
            terminal.scrollTop = terminal.scrollHeight;
            if (terminal.childNodes.length > 50) terminal.removeChild(terminal.firstChild!);
        };
        const interval = setInterval(() => { if (Math.random() < 0.1) add(); }, 100);
        return () => clearInterval(interval);
    }, []);

    // Threat terminal
    useEffect(() => {
        const terminal = threatTerminalRef.current;
        if (!terminal) return;
        const logs = [
            { type: 'INFO', msg: 'Neural cluster handshake initialized...' },
            { type: 'WARN', msg: 'Unrecognized packet fragment detected at Node_04' },
            { type: 'CRIT', msg: 'Sub-routine intercept failed. Firewall breached.' },
            { type: 'INFO', msg: 'Re-routing data streams through encrypted tunnel...' },
            { type: 'INFO', msg: 'Packet inspection: 2048-bit AES verified.' },
            { type: 'WARN', msg: 'Latency spike in Zone-7: 450ms' },
            { type: 'CRIT', msg: 'Unauthorized access attempt: 192.168.1.104' },
            { type: 'INFO', msg: 'Applying neural patch v4.0.1...' },
        ];
        const actions = ['INSPECT', 'DECRYPT', 'ROUTING', 'VALIDATE', 'HANDSHAKE'];
        const ids = ['#77X-Alpha', '#X92-Delta', '#TR-Omega', '#K1-Sigma'];
        const statuses = ['verified', 'successful', 'rerouted', 'rejected', 'cached'];
        const add = () => {
            const log = logs[Math.floor(Math.random() * logs.length)];
            const action = actions[Math.floor(Math.random() * actions.length)];
            const id = ids[Math.floor(Math.random() * ids.length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const color = log.type === 'CRIT' ? '#FF3366' : log.type === 'WARN' ? '#FFB800' : '#00FFFF';
            const el = document.createElement('div');
            el.style.cssText = "font-family:'Orbitron',sans-serif;font-size:10px;margin-bottom:4px;";
            el.innerHTML = `<span style="color:${color}">[${log.type}]</span> <span style="color:rgba(0,255,255,0.6)">[${action}]</span> <span style="color:rgba(224,227,229,0.7)">Packet ID ${id} ${status}. ${log.msg}</span>`;
            terminal.prepend(el);
            if (terminal.children.length > 50) terminal.removeChild(terminal.lastChild!);
        };
        const interval = setInterval(add, 800);
        return () => clearInterval(interval);
    }, []);

    // System log terminal (bottom)
    useEffect(() => {
        const logContainer = document.getElementById('log-container-ds');
        if (!logContainer) return;
        const initial = [
            '[SYSTEM] Node initialisation complete.',
            '[NETWORK] Establishing peer-to-peer handshake...',
            '[DECRYPT] AES-1024 vector aligned.',
            '[INFO] Traffic monitoring enabled.',
        ];
        initial.forEach(msg => {
            const l = document.createElement('div');
            l.style.cssText = "font-family:'Orbitron',sans-serif;font-size:10px;color:rgba(0,255,255,0.3);margin-bottom:2px;";
            l.innerText = msg;
            logContainer.prepend(l);
        });
        const actions = ['INSPECT', 'DECRYPT', 'ROUTING', 'VALIDATE', 'HANDSHAKE'];
        const ids = ['#77X-Alpha', '#X92-Delta', '#TR-Omega', '#K1-Sigma'];
        const statuses = ['verified', 'successful', 'rerouted', 'rejected', 'cached'];
        const addLog = () => {
            const action = actions[Math.floor(Math.random() * actions.length)];
            const id = ids[Math.floor(Math.random() * ids.length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const ts = new Date().toISOString().split('T')[1].split('.')[0];
            const el = document.createElement('div');
            el.style.cssText = `font-family:'Orbitron',sans-serif;font-size:10px;color:${status === 'rejected' ? '#FFB800' : 'rgba(0,255,255,0.7)'};margin-bottom:2px;opacity:0;transition:opacity 0.3s;`;
            el.innerHTML = `<span style="color:rgba(255,255,255,0.2)">[${ts}]</span> <span style="color:${status === 'rejected' ? '#FFB800' : '#00FFFF'}">[${action}]</span> Packet ID ${id} ${status}.`;
            logContainer.prepend(el);
            setTimeout(() => { el.style.opacity = '1'; }, 10);
            if (logContainer.children.length > 20) logContainer.removeChild(logContainer.lastChild!);
        };
        const interval = setInterval(addLog, 2000);
        return () => clearInterval(interval);
    }, []);

    // Dynamic updates + alert
    useEffect(() => {
        const interval = setInterval(() => {
            if (latencyRef.current) latencyRef.current.innerText = (Math.random() * 20 + 5).toFixed(1) + 'ms';
            if (coordsRef.current) {
                const lat = (51.5074 + (Math.random() - 0.5) * 0.01).toFixed(4);
                const lng = (0.1278 + (Math.random() - 0.5) * 0.01).toFixed(4);
                coordsRef.current.innerText = `LAT: ${lat} N // LONG: ${lng} W`;
            }
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() < 0.05 && alertRef.current) {
                alertRef.current.classList.remove('hidden');
                setTimeout(() => alertRef.current?.classList.add('hidden'), 2000);
            }
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    // UTC clock
    useEffect(() => {
        const update = () => {
            if (utcClockRef.current) {
                utcClockRef.current.innerText = 'UTC ' + new Date().toISOString().split('T')[1].split('.')[0];
            }
        };
        const interval = setInterval(update, 1000);
        update();
        return () => clearInterval(interval);
    }, []);

    const handlePurge = () => {
        const overlay = flashOverlayRef.current;
        if (overlay) {
            overlay.style.background = 'rgba(255,0,68,0.6)';
            overlay.style.filter = 'brightness(2)';
            setTimeout(() => { overlay.style.background = 'transparent'; overlay.style.filter = 'brightness(1)'; }, 500);
        }
        speedRef.current = 15;
        setTimeout(() => { speedRef.current = 1; }, 1000);
        const terminal = threatTerminalRef.current;
        if (terminal) {
            const el = document.createElement('div');
            el.style.cssText = "font-family:'Orbitron',sans-serif;font-size:10px;background:rgba(255,0,68,0.15);padding:8px;border:1px solid rgba(255,0,68,0.4);margin-bottom:4px;color:#FF3366;font-weight:bold;";
            el.innerText = '[SYSTEM_PURGE] FLUX_CACHE_CLEARED_SUCCESSFULLY. RESTARTING_SYNC_PROCESS...';
            terminal.prepend(el);
        }
    };

    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;700;800&display=swap" rel="stylesheet" />

            <style jsx global>{`
        .font-orbitron { font-family: 'Orbitron', sans-serif; }
        .font-code { font-family: 'JetBrains Mono', monospace; }

        @keyframes scanlineAnim { 0% { top:0%; } 100% { top:100%; } }
        .scanline-beam-ds {
          position:fixed;top:0;left:0;width:100%;height:2px;
          background:linear-gradient(90deg,transparent,#00FFFF,transparent);
          box-shadow:0 0 15px #00FFFF;opacity:0.15;
          animation:scanlineAnim 8s linear infinite;
          pointer-events:none;z-index:101;
        }
        .crt-overlay-ds {
          background:linear-gradient(rgba(18,16,16,0) 50%,rgba(0,0,0,0.15) 50%),
            linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03));
          background-size:100% 3px,3px 100%;
          pointer-events:none;
        }
        .glass-panel-ds {
          backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
          background:rgba(0,0,0,0.60);
          border:1px solid rgba(0,255,255,0.15);
          box-shadow:inset 0 0 20px rgba(0,255,255,0.04);
        }
        .angular-cut-ds {
          clip-path:polygon(0 0,95% 0,100% 5%,100% 100%,5% 100%,0 95%);
        }
        .panel-cut-ds {
          clip-path:polygon(0 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,0 100%);
          border-left:1px solid rgba(0,255,255,0.25);
          border-top:1px solid rgba(0,255,255,0.25);
          background:rgba(0,0,0,0.70);
          backdrop-filter:blur(20px);
        }
        @keyframes ledBlink { from{opacity:0.3;transform:scale(0.9)} to{opacity:1;transform:scale(1.1)} }
        @keyframes radarRotate { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .radar-sweep-ds {
          animation:radarRotate 4s linear infinite;transform-origin:center;
        }
        @keyframes glitch {
          0%{text-shadow:2px 0 #FF3366,-2px 0 #00FFFF}
          2%{text-shadow:5px 0 #FF3366,-5px 0 #00FFFF;transform:skewX(10deg)}
          4%{text-shadow:-3px 0 #FF3366,3px 0 #00FFFF;transform:skewX(-5deg)}
          6%{text-shadow:none;transform:none}
        }
        .glitch-text-ds { animation:glitch 2s infinite; }
        @keyframes laserAnim {
          0%{transform:translateY(-100%);opacity:0}
          50%{opacity:0.4}
          100%{transform:translateY(100vh);opacity:0}
        }
        .laser-beam-ds {
          position:fixed;width:1px;height:20vh;
          background:linear-gradient(to bottom,transparent,#00FFFF,transparent);
          animation:laserAnim 4s cubic-bezier(0.4,0,0.6,1) infinite;z-index:10;
        }
        .terminal-scroll-ds::-webkit-scrollbar{width:4px}
        .terminal-scroll-ds::-webkit-scrollbar-track{background:transparent}
        .terminal-scroll-ds::-webkit-scrollbar-thumb{background:rgba(0,255,255,0.25);border-radius:2px}
        .terminal-scroll-ds::-webkit-scrollbar-thumb:hover{background:#00FFFF}
      `}</style>

            <div className="font-orbitron bg-black text-[#e0e3e5] overflow-hidden h-screen flex relative"
                style={{ backgroundImage: 'radial-gradient(circle at center,#050814 0%,#000000 100%)' }}>

                {/* Atmospheric layers */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <svg className="w-full h-full opacity-8">
                        <defs>
                            <pattern id="hexGridDS" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
                                <path d="M30 0 L60 15 L60 37 L30 52 L0 37 L0 15 Z" fill="none" stroke="#00FFFF" strokeWidth="0.4" opacity="0.35" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#hexGridDS)" />
                    </svg>
                </div>
                <div className="fixed inset-0 crt-overlay-ds pointer-events-none z-10" />
                <div className="scanline-beam-ds" />
                <div className="laser-beam-ds left-1/4" style={{ animationDelay: '0s' }} />
                <div className="laser-beam-ds left-1/2" style={{ animationDelay: '1.5s' }} />
                <div className="laser-beam-ds left-3/4" style={{ animationDelay: '3s' }} />

                {/* NEXUS glow borders */}
                <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-80 z-50" />
                <div className="fixed bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF00FF] to-transparent opacity-80 z-50" />
                <div className="fixed left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#00FF88] to-transparent opacity-70 z-50" />
                <div className="fixed right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#FF00FF] to-transparent opacity-70 z-50" />

                {/* Flash overlay */}
                <div ref={flashOverlayRef} className="fixed inset-0 pointer-events-none z-[200] transition-all duration-500" />

                {/* INTEGRATION DE LA SIDEBAR */}
                <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

                {/* CONTENEUR PRINCIPAL AJUSTÉ AU SIDEBAR */}
                <div className="flex-1 flex flex-col overflow-hidden relative z-20">

                    {/* ═══ HEADER ═══ */}
                    <header className="h-16 px-6 flex items-center justify-between border-b border-[#00FFFF22] glass-panel-ds shrink-0 relative">
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-60" />
                        <div className="flex items-center gap-6">
                            <h1 className="font-orbitron text-[18px] font-black tracking-widest text-[#00FFFF]"
                                style={{ textShadow: '0 0 15px rgba(0,255,255,0.8), 0 0 30px rgba(0,255,255,0.4)' }}>
                                CORE_STREAM_ANALYSIS // NETWORK_INGRESS
                            </h1>
                            <div className="h-8 w-px bg-[#00FFFF22]" />
                            <div className="flex gap-8 font-orbitron text-[10px] tracking-tighter">
                                <div className="flex flex-col">
                                    <span className="text-[#00FFFF88] text-[9px] tracking-[0.15em]">THROUGHPUT</span>
                                    <span ref={throughputRef} className="text-[#00FF88]" style={{ textShadow: '0 0 8px rgba(0,255,136,0.6)' }}>412.8 Mbps</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[#00FFFF88] text-[9px] tracking-[0.15em]">PACKET LOSS</span>
                                    <span className="text-[#00FFFF]">0.002%</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[#00FFFF88] text-[9px] tracking-[0.15em]">LATENCY</span>
                                    <span ref={latencyRef} className="text-[#00FFFF]">12.4ms</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-[#00FFFF11] border border-[#00FFFF33] px-3 py-1 rounded-full">
                                <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" style={{ boxShadow: '0 0 8px #00FF88' }} />
                                <span className="font-orbitron text-[10px] text-[#00FF88] tracking-widest">SYSTEM_STABLE</span>
                            </div>
                            <div className="px-4 py-1.5 border border-[#FF336644] bg-[#FF336611] flex items-center gap-2 rounded-full animate-pulse">
                                <span className="text-[#FF3366] text-sm">🛡</span>
                                <span className="font-orbitron text-[10px] text-[#FF3366] tracking-widest">FIREWALL: ENFORCED</span>
                            </div>
                            <div className="bg-[#FFB80011] border border-[#FFB80044] px-3 py-1 flex items-center gap-2 rounded-full animate-pulse">
                                <span className="text-[#FFB800] text-sm">⚠</span>
                                <span className="font-orbitron text-[10px] text-[#FFB800] tracking-widest">THREAT_INDEX: 2.4%</span>
                            </div>
                            <div className="flex gap-3 text-[#00FFFF88]">
                                {['🔔', '⚙', '👤'].map((icon, i) => (
                                    <span key={i} className="cursor-pointer hover:text-[#00FFFF] transition-all text-lg">{icon}</span>
                                ))}
                            </div>
                        </div>
                    </header>

                    {/* ═══ MAIN ═══ */}
                    <div className="flex flex-1 overflow-hidden relative">

                        {/* ── CENTRAL GRID ── */}
                        <main className="flex-1 flex flex-col overflow-hidden">
                            <div className="flex-1 p-4 grid grid-cols-12 gap-4 overflow-hidden relative">

                                {/* CENTRAL MATRIX CANVAS */}
                                <section className="col-span-12 lg:col-span-8 glass-panel-ds angular-cut-ds relative overflow-hidden group">
                                    <div className="absolute top-4 left-4 z-20 flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[#00FFFF] text-sm">◎</span>
                                            <span className="font-orbitron text-[10px] text-[#00FFFF88] tracking-[0.1em]">STREAM_SOURCE: 127.0.0.1</span>
                                        </div>
                                        <div ref={coordsRef} className="font-orbitron text-[10px] text-[#00FFFF44]">LAT: 51.5074 N // LONG: 0.1278 W</div>
                                    </div>

                                    <canvas ref={canvasRef} className="w-full h-full opacity-80" />

                                    {/* HUD crosshair */}
                                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20">
                                        <svg className="text-[#00FFFF]" width="400" height="400" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" fill="none" r="48" stroke="currentColor" strokeDasharray="1 2" strokeWidth="0.5" />
                                            <line stroke="currentColor" strokeWidth="0.2" x1="0" x2="100" y1="50" y2="50" />
                                            <line stroke="currentColor" strokeWidth="0.2" x1="50" x2="50" y1="0" y2="100" />
                                            <rect fill="none" height="10" stroke="currentColor" strokeWidth="0.5" width="10" x="45" y="45" />
                                        </svg>
                                    </div>
                                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                        <div className="w-48 h-48 border border-[#00FFFF22] rounded-full animate-pulse flex items-center justify-center">
                                            <div className="w-2 h-2 bg-[#00FFFF]" style={{ boxShadow: '0 0 10px #00FFFF' }} />
                                            {['top-0', 'bottom-0', 'left-0', 'right-0'].map((pos, i) => (
                                                <div key={i} className={`absolute ${pos} ${i < 2 ? 'left-1/2 -translate-x-1/2 w-[1px] h-4' : 'top-1/2 -translate-y-1/2 h-[1px] w-4'} bg-[#00FFFF]`} />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Malware alert */}
                                    <div ref={alertRef} className="hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                                        <div className="bg-[#FF336622] border-2 border-[#FF3366] p-6 glitch-text-ds backdrop-blur-md rounded-xl">
                                            <h2 className="font-orbitron text-[#FF3366] text-xl tracking-[0.2em]"
                                                style={{ textShadow: '0 0 20px rgba(255,51,102,0.8)' }}>
                                                MALWARE_SIGNATURE_DETECTED
                                            </h2>
                                            <p className="font-orbitron text-[10px] text-center mt-2 text-[#FF336688]">ORIGIN: UNKNOWN_IP_NODE_0x7F</p>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-4 right-4 z-20">
                                        <button onClick={handlePurge}
                                            className="px-8 py-3 font-orbitron tracking-widest text-[11px] font-bold text-white transition-all hover:brightness-125 active:scale-95 rounded-lg"
                                            style={{ background: '#FF0044', boxShadow: '0 0 20px rgba(255,0,68,0.5)' }}>
                                            PURGE FLUX
                                        </button>
                                    </div>
                                </section>

                                {/* RIGHT PANELS */}
                                <aside className="col-span-12 lg:col-span-4 flex flex-col gap-4 overflow-hidden">

                                    {/* Packet Inspection */}
                                    <div className="flex-[1.2] glass-panel-ds angular-cut-ds p-4 flex flex-col">
                                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-60" />
                                        <header className="flex justify-between items-center mb-3 border-b border-[#00FFFF22] pb-2">
                                            <h3 className="font-orbitron text-[10px] font-bold text-[#00FFFF] tracking-[0.15em]">PACKET INSPECTION</h3>
                                            <span className="font-orbitron text-[10px] text-[#00FFFF88]">THR: 2.4 GBPS</span>
                                        </header>
                                        <div className="flex-1 w-full relative">
                                            <svg className="w-full h-full" id="throughput-graph" viewBox="0 0 400 100">
                                                <defs>
                                                    <linearGradient id="line-grad-ds" x1="0" x2="0" y1="0" y2="1">
                                                        <stop offset="0%" stopColor="#00FFFF" />
                                                        <stop offset="100%" stopColor="transparent" />
                                                    </linearGradient>
                                                </defs>
                                                <path ref={graphPathRef} d="M0 80 Q 20 60, 40 80 T 80 50 T 120 70 T 160 40 T 200 60 T 240 30 T 280 50 T 320 20 T 360 40 T 400 30"
                                                    fill="none" stroke="#00FFFF" strokeWidth="1.5"
                                                    style={{ filter: 'drop-shadow(0 0 5px rgba(0,255,255,0.8))' }} />
                                                <path ref={graphAreaRef} d="M0 80 Q 20 60, 40 80 T 80 50 T 120 70 T 160 40 T 200 60 T 240 30 T 280 50 T 320 20 T 360 40 T 400 30 V 100 H 0 Z"
                                                    fill="url(#line-grad-ds)" opacity="0.3" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Threat Terminal */}
                                    <div className="flex-[2] glass-panel-ds angular-cut-ds p-4 flex flex-col overflow-hidden relative">
                                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-60" />
                                        <header className="flex justify-between items-center mb-2">
                                            <h3 className="font-orbitron text-[10px] font-bold text-[#00FFFF] tracking-[0.15em]">THREAT TERMINAL</h3>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-[#FF3366]" style={{ animation: 'ledBlink 1.5s infinite alternate' }} />
                                                <span className="font-orbitron text-[10px] text-[#FF3366]">LIVE</span>
                                            </div>
                                        </header>
                                        <div ref={threatTerminalRef} className="flex-1 terminal-scroll-ds overflow-y-auto space-y-1" />
                                    </div>

                                    {/* Node Cluster + Radar */}
                                    <div className="flex gap-3 flex-1">
                                        {/* Node cluster */}
                                        <div className="flex-1 glass-panel-ds angular-cut-ds p-4 relative">
                                            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-60" />
                                            <h3 className="font-orbitron text-[10px] font-bold text-[#00FFFF] tracking-[0.1em] mb-3">NODE_CLUSTER_Z-9</h3>
                                            <div ref={nodeContainerRef} className="grid grid-cols-5 gap-2" />
                                            <div className="mt-3 flex justify-between items-center">
                                                <div className="flex flex-col">
                                                    <span className="font-orbitron text-[9px] text-[#00FFFF88]">CLUSTER_SYNC</span>
                                                    <span className="font-orbitron text-[12px] text-[#00FF88]" style={{ textShadow: '0 0 8px rgba(0,255,136,0.6)' }}>98.2%</span>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="font-orbitron text-[9px] text-[#00FFFF88]">NODES_UP</span>
                                                    <span className="font-orbitron text-[12px] text-[#00FFFF]">14/15</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Threat Radar */}
                                        <div className="w-36 glass-panel-ds p-3 flex flex-col items-center justify-center relative">
                                            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-60" />
                                            <span className="font-orbitron text-[9px] text-[#00FFFF88] tracking-[0.1em] mb-3 w-full text-center">THREAT_RADAR</span>
                                            <div className="relative w-24 h-24 border border-[#00FFFF22] rounded-full flex items-center justify-center">
                                                <div className="absolute inset-0 rounded-full border border-[#00FFFF11]" />
                                                <div className="absolute inset-[20%] rounded-full border border-[#00FFFF11]" />
                                                <div className="absolute inset-[40%] rounded-full border border-[#00FFFF11]" />
                                                <div className="radar-sweep-ds absolute inset-0 rounded-full"
                                                    style={{ background: 'conic-gradient(from 0deg,transparent 0deg,rgba(0,255,255,0.25) 350deg,transparent 360deg)' }} />
                                                <div className="absolute w-2 h-2 bg-[#FF3366] rounded-full top-1/4 left-1/3 animate-ping" />
                                                <div className="absolute w-1 h-1 bg-[#00FF88] rounded-full bottom-1/3 right-1/4" style={{ boxShadow: '0 0 4px #00FF88' }} />
                                                <div className="absolute w-1 h-1 bg-[#00FF88] rounded-full top-1/2 right-1/2" style={{ boxShadow: '0 0 4px #00FF88' }} />
                                            </div>
                                        </div>
                                    </div>
                                </aside>
                            </div>

                            {/* BOTTOM ROW: Matrix + Flux + Wave + Log */}
                            <div className="p-4 pt-0 grid grid-cols-12 gap-4 h-56">

                                {/* Packet Matrix */}
                                <section className="col-span-4 panel-cut-ds p-3 flex flex-col">
                                    <div className="flex justify-between items-center mb-2 border-b border-[#00FFFF11] pb-1">
                                        <span className="font-orbitron text-[9px] text-[#00FFFF88] tracking-[0.1em]"># PACKET_MATRIX_X8</span>
                                        <div className="flex gap-4">
                                            <div className="text-right">
                                                <div className="font-orbitron text-[8px] text-[#00FFFF88]">THROUGHPUT</div>
                                                <div ref={throughputRef} className="font-orbitron text-[12px] text-[#00FFFF]" style={{ textShadow: '0 0 8px rgba(0,255,255,0.6)' }}>842 Mbps</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-orbitron text-[8px] text-[#00FFFF88]">DROP_RATE</div>
                                                <div className="font-orbitron text-[12px] text-[#FFB800]" style={{ textShadow: '0 0 8px rgba(255,184,0,0.6)' }}>0.00%</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div ref={matrixGridRef} className="flex-1 grid grid-cols-8 grid-rows-4 gap-1" />
                                </section>

                                {/* Flux Bars */}
                                <section className="col-span-2 panel-cut-ds p-3 flex flex-col">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-orbitron text-[9px] text-[#00FFFF88] tracking-[0.1em]">INGRESS_FLUX</span>
                                        <span className="font-orbitron text-[9px] text-[#00FF88]">STABLE</span>
                                    </div>
                                    <div ref={fluxBarsRef} className="flex-1 flex items-end justify-between gap-[2px]" />
                                </section>

                                {/* Waveform */}
                                <section className="col-span-3 panel-cut-ds p-3 flex flex-col">
                                    <div className="mb-2">
                                        <span className="font-orbitron text-[9px] text-[#00FFFF88] tracking-[0.1em]">JITTER_OSCILLOSCOPE</span>
                                    </div>
                                    <div className="flex-1 relative">
                                        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 100">
                                            <path ref={wave1Ref} d="" fill="none" stroke="#00FFFF" strokeWidth="1.5" opacity="0.7"
                                                style={{ filter: 'drop-shadow(0 0 3px rgba(0,255,255,0.8))' }} />
                                            <path ref={wave2Ref} d="" fill="none" stroke="#00FF88" strokeWidth="1" opacity="0.4"
                                                style={{ filter: 'drop-shadow(0 0 2px rgba(0,255,136,0.6))' }} />
                                        </svg>
                                    </div>
                                    <div className="mt-2 flex flex-col gap-1">
                                        <div className="flex justify-between font-orbitron text-[9px] text-[#00FF88]">
                                            <span>AZIMUTH VARIANCE</span><span>0.001°</span>
                                        </div>
                                        <div className="flex justify-between font-orbitron text-[9px] text-[#00FF88]">
                                            <span>ELEVATION DRIFT</span><span>0.002%</span>
                                        </div>
                                    </div>
                                </section>

                                {/* Log Terminal */}
                                <section className="col-span-3 panel-cut-ds flex flex-col overflow-hidden">
                                    <div className="px-3 py-2 border-b border-[#00FFFF11] bg-[#00FFFF08] flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[#00FFFF] text-sm">▸</span>
                                            <span className="font-orbitron text-[9px] text-[#00FFFF] tracking-[0.1em]">SYSTEM_LOG_TERMINAL</span>
                                        </div>
                                        <div className="font-orbitron text-[8px] text-[#00FFFF44]">ENCRYPTION: QUANTUM-AES-1024</div>
                                    </div>
                                    <div id="log-container-ds" className="flex-1 overflow-y-auto p-3 terminal-scroll-ds" />
                                </section>
                            </div>
                        </main>
                    </div>

                    {/* ═══ FOOTER ═══ */}
                    <footer className="h-16 glass-panel-ds border-t border-[#00FFFF22] px-6 flex items-center justify-between shrink-0 relative">
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF00FF] to-transparent opacity-40" />
                        <div className="flex items-center gap-4">
                            {[
                                { label: 'PAUSE STREAM', color: '#00FFFF' },
                                { label: 'ISOLATE ANOMALIES', color: '#FF3366' },
                                { label: 'INJECT DECOY FLUX', color: '#00FF88' },
                            ].map((btn) => (
                                <button key={btn.label}
                                    className="px-5 py-2 font-orbitron text-[9px] font-bold uppercase tracking-widest transition-all active:scale-95 rounded-lg"
                                    style={{ border: `1px solid ${btn.color}55`, color: btn.color, boxShadow: `0 0 10px ${btn.color}22` }}
                                    onMouseEnter={e => { (e.target as HTMLButtonElement).style.background = btn.color + '22'; }}
                                    onMouseLeave={e => { (e.target as HTMLButtonElement).style.background = 'transparent'; }}>
                                    {btn.label}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex gap-6 font-orbitron text-[10px] text-[#00FFFF88]">
                                <span>LATENCY: <span className="text-[#00FFFF]">4ms</span></span>
                                <span>BANDWIDTH: <span className="text-[#00FFFF]">10 Gbps</span></span>
                                <span>ENCRYPTION: <span className="text-[#00FFFF]">AES-512-NEURAL</span></span>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className="font-orbitron text-[9px] text-[#00FFFF88] tracking-[0.1em]">STREAM_SPEED_MODIFIER</span>
                                <div className="flex border border-[#00FFFF22] p-0.5 rounded-lg overflow-hidden">
                                    {[
                                        { label: 'X1', style: 'text-[#00FFFF88] hover:bg-[#00FFFF11]' },
                                        { label: 'X2', style: 'bg-gradient-to-r from-[#00FFFF] to-[#00FF88] text-black font-bold' },
                                        { label: 'OVERCLOCK', style: 'text-[#FF3366] font-bold hover:bg-[#FF336622]' },
                                    ].map((btn) => (
                                        <button key={btn.label}
                                            className={`px-3 py-1 font-orbitron text-[9px] transition-all ${btn.style}`}>
                                            {btn.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div ref={utcClockRef} className="font-orbitron text-[10px] text-[#00FFFF88]">UTC 00:00:00</div>
                                <div className="bg-gradient-to-r from-[#00FFFF] to-[#00FF88] text-black font-orbitron text-[9px] px-2 py-0.5 font-bold uppercase rounded">
                                    System_Active
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}