'use client';

import React, { useEffect, useRef, useState } from 'react';
import Sidebar from "@/components/Sidebar";
import { ChevronRight } from "lucide-react";

export default function SystemCore() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [pulsePhase, setPulsePhase] = useState(0);

  const auditTerminalRef = useRef<HTMLDivElement>(null);
  const connectionBtnRef = useRef<HTMLButtonElement>(null);

  const [cpuVal, setCpuVal] = useState(85);
  const [ramVal, setRamVal] = useState(62);
  const [jitterVal, setJitterVal] = useState(15);
  const [packetVal, setPacketVal] = useState(1);
  const [threatIndex, setThreatIndex] = useState('02.4');
  const [threatColor, setThreatColor] = useState('#00FF88');
  const [warningState, setWarningState] = useState<'ok' | 'warn' | 'critical'>('ok');
  const [connStatus, setConnStatus] = useState<'idle' | 'connecting' | 'success'>('idle');
  const [isFlashing, setIsFlashing] = useState(false);

  // Pulse phase animation (pour la Sidebar)
  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase((prev) => (prev + 0.05) % (Math.PI * 2));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Threat index updater
  const updateThreat = (cpu: number, ram: number, jitter: number) => {
    const threat = ((cpu + ram + (jitter * 2)) / 30).toFixed(1);
    setThreatIndex(threat.padStart(4, '0'));
    const n = parseFloat(threat);
    if (n > 8) { setThreatColor('#FF3366'); setWarningState('critical'); }
    else if (n > 5) { setThreatColor('#FFB800'); setWarningState('warn'); }
    else { setThreatColor('#00FF88'); setWarningState('ok'); }
  };

  useEffect(() => { updateThreat(cpuVal, ramVal, jitterVal); }, [cpuVal, ramVal, jitterVal]);

  // Audit log spawner
  useEffect(() => {
    const terminal = auditTerminalRef.current;
    if (!terminal) return;
    const events = [
      { msg: 'PACKET_ROUTED: NODE_A -> NODE_D', color: 'rgba(0,255,255,0.4)' },
      { msg: 'HEARTBEAT_ACK: LATENCY 22ms', color: 'rgba(224,227,229,0.6)' },
      { msg: 'ENCRYPTION_ROTATED: 4096-BIT', color: '#00FFFF' },
      { msg: 'ANOMALY_CLEARED', color: '#00FF88' },
    ];
    const interval = setInterval(() => {
      if (terminal.children.length > 50) terminal.removeChild(terminal.firstChild!);
      const evt = events[Math.floor(Math.random() * events.length)];
      const log = document.createElement('div');
      log.style.cssText = `font-family:'Orbitron',sans-serif;font-size:10px;color:${evt.color};margin-bottom:4px;`;
      log.innerText = `[${new Date().toLocaleTimeString()}] ${evt.msg}`;
      terminal.appendChild(log);
      terminal.scrollTop = terminal.scrollHeight;
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const recalibrateSystem = () => {
    setIsFlashing(true);
    const terminal = auditTerminalRef.current;
    if (terminal) {
      const log = document.createElement('div');
      log.style.cssText = "font-family:'Orbitron',sans-serif;font-size:10px;color:#00FFFF;margin-bottom:4px;";
      log.innerText = `[${new Date().toLocaleTimeString()}] SYSTEM_RECALIBRATION_TRIGGERED...`;
      terminal.appendChild(log);
      terminal.scrollTop = terminal.scrollHeight;
    }
    setTimeout(() => {
      setIsFlashing(false);
      alert('MATRIX_CONFIGURATION_APPLIED: Core sync established.');
    }, 500);
  };

  const testConnection = () => {
    setConnStatus('connecting');
    const terminal = auditTerminalRef.current;
    setTimeout(() => {
      setConnStatus('success');
      if (terminal) {
        const log = document.createElement('div');
        log.style.cssText = "font-family:'Orbitron',sans-serif;font-size:10px;color:#00FF88;margin-bottom:4px;";
        log.innerText = `[${new Date().toLocaleTimeString()}] GNS3_HANDSHAKE: 192.168.100.42:3080 SUCCESS`;
        terminal.appendChild(log);
        terminal.scrollTop = terminal.scrollHeight;
      }
      setTimeout(() => setConnStatus('idle'), 2000);
    }, 1500);
  };

  const warningBg = warningState === 'critical'
    ? 'rgba(255,51,102,0.1)' : warningState === 'warn'
    ? 'rgba(255,184,0,0.07)' : 'transparent';
  const warningBorder = warningState === 'critical'
    ? '#FF3366' : warningState === 'warn'
    ? '#FFB800' : 'rgba(58,73,75,0.4)';
  const warningText = warningState === 'critical'
    ? 'CRITICAL: SYSTEM INSTABILITY DETECTED. REDUCE LOAD IMMEDIATELY.'
    : warningState === 'warn'
    ? 'WARNING: Thresholds approaching maximum capacity.'
    : 'Environment stable. All parameters within safe margins.';
  const warningTextColor = warningState === 'critical'
    ? '#FF3366' : warningState === 'warn'
    ? '#FFB800' : 'rgba(132,148,149,0.8)';

  const sidebarWidth = sidebarCollapsed ? '0px' : '320px';

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;700;800&display=swap" rel="stylesheet" />

      <style jsx global>{`
        .font-orbitron { font-family: 'Orbitron', sans-serif; }
        .font-code { font-family: 'JetBrains Mono', monospace; }

        .glass-panel-sc {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          background: rgba(0,0,0,0.60);
          border: 1px solid rgba(0,255,255,0.15);
          box-shadow: 0 0 20px rgba(0,255,255,0.04);
        }
        .angular-panel-sc {
          clip-path: polygon(0% 0%, 100% 0%, 100% 90%, 95% 100%, 0% 100%);
          border-left: 2px solid #00FFFF;
        }
        @keyframes scanlineSC { 0%{top:0%} 100%{top:100%} }
        .scanline-sc {
          width:100%;height:2px;
          background:linear-gradient(to right,transparent,#00FFFF,transparent);
          box-shadow:0 0 15px #00FFFF;
          position:fixed;top:0;left:0;pointer-events:none;
          animation:scanlineSC 8s linear infinite;opacity:0.15;z-index:200;
        }
        @keyframes recalibrate {
          0%{filter:brightness(5) saturate(2)}
          50%{filter:invert(1)}
          100%{filter:brightness(1) saturate(1)}
        }
        .flash-recalibrate-sc { animation:recalibrate 0.4s ease-out; }
        .matrix-text-sc { text-shadow:0 0 5px #00FF88; }
        .glow-cyan-sc { box-shadow:0 0 15px rgba(0,255,255,0.35); }
        .glow-green-sc { box-shadow:0 0 15px rgba(0,255,136,0.35); }

        .terminal-scroll-sc::-webkit-scrollbar{width:4px}
        .terminal-scroll-sc::-webkit-scrollbar-track{background:transparent}
        .terminal-scroll-sc::-webkit-scrollbar-thumb{background:rgba(0,255,255,0.25);border-radius:2px}
        .terminal-scroll-sc::-webkit-scrollbar-thumb:hover{background:#00FFFF}

        input[type=range].nexus-slider {
          -webkit-appearance:none;appearance:none;
          height:4px;background:rgba(58,73,75,0.3);border-radius:2px;outline:none;width:100%;
        }
        input[type=range].nexus-slider::-webkit-slider-thumb {
          -webkit-appearance:none;appearance:none;
          width:14px;height:14px;border-radius:50%;
          background:#00FFFF;cursor:pointer;
          box-shadow:0 0 8px rgba(0,255,255,0.8);
        }
        input[type=range].nexus-slider.green::-webkit-slider-thumb{background:#00FF88;box-shadow:0 0 8px rgba(0,255,136,0.8);}
        input[type=range].nexus-slider.amber::-webkit-slider-thumb{background:#FFB800;box-shadow:0 0 8px rgba(255,184,0,0.8);}
        input[type=range].nexus-slider.red::-webkit-slider-thumb{background:#FF3366;box-shadow:0 0 8px rgba(255,51,102,0.8);}

        input[type=text].nexus-input, input[type=password].nexus-input {
          background:rgba(0,0,0,0.5);
          border:1px solid rgba(58,73,75,0.4);
          color:#e1fdff;
          font-family:'JetBrains Mono',monospace;
          padding:8px 12px;width:100%;outline:none;
          transition:border-color 0.2s;
          border-radius:4px;
        }
        input[type=text].nexus-input:focus,
        input[type=password].nexus-input:focus {
          border-color:#00FFFF;box-shadow:0 0 8px rgba(0,255,255,0.2);
        }
        input[type=text].nexus-cmd {
          background:transparent;border:none;outline:none;
          color:#e1fdff;font-family:'JetBrains Mono',monospace;font-size:11px;
          text-transform:uppercase;flex:1;
        }
        input[type=text].nexus-cmd::placeholder{color:rgba(132,148,149,0.3)}
      `}</style>

      {/* ROOT — h-screen + flex pour sidebar/main côte à côte */}
      <div
        className={`font-orbitron bg-black text-[#e0e3e5] h-screen w-screen overflow-hidden flex relative ${isFlashing ? 'flash-recalibrate-sc' : ''}`}
        style={{
          backgroundImage: `
            radial-gradient(circle at top, rgba(0,255,255,0.07), transparent 30%),
            radial-gradient(circle at bottom right, rgba(255,0,255,0.05), transparent 25%),
            linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: 'auto, auto, 40px 40px, 40px 40px'
        }}
      >
        {/* Hex overlay */}
        <div className="fixed inset-0 opacity-5 pointer-events-none z-0">
          <svg className="w-full h-full">
            <defs>
              <pattern id="hexSC" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
                <path d="M30 0 L60 15 L60 37 L30 52 L0 37 L0 15 Z" fill="none" stroke="#00FFFF" strokeWidth="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexSC)" />
          </svg>
        </div>

        {/* Scanline */}
        <div className="scanline-sc" />

        {/* NEXUS glow borders */}
        <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-80 z-50 pointer-events-none" />
        <div className="fixed bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF00FF] to-transparent opacity-80 z-50 pointer-events-none" />
        <div className="fixed left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#00FF88] to-transparent opacity-70 z-50 pointer-events-none" />
        <div className="fixed right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#FF00FF] to-transparent opacity-70 z-50 pointer-events-none" />

        {/* Orbs */}
        <div className="fixed top-20 right-20 w-96 h-96 bg-[#00ffff]/5 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="fixed bottom-20 left-72 w-80 h-80 bg-[#ff00ff]/5 rounded-full blur-[100px] pointer-events-none z-0" />

        {/* ── SIDEBAR (position absolue, pas dans le flux) ── */}
        <div
          className="absolute left-0 top-0 bottom-0 z-30 overflow-hidden transition-all duration-500"
          style={{ width: sidebarWidth }}
        >
          <Sidebar pulsePhase={pulsePhase} />
        </div>

        {/* ── TOGGLE BUTTON ── */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute top-1/2 z-50 w-8 h-16 bg-gradient-to-r from-[#00FFFF22] to-transparent border-y border-r border-[#00FFFF44] rounded-r-lg flex items-center justify-center cursor-pointer hover:from-[#00FFFF44] transition-all -translate-y-1/2"
          style={{ left: sidebarCollapsed ? '0px' : '320px', transition: 'left 0.5s ease-in-out' }}
        >
          <ChevronRight
            className="w-4 h-4 text-[#00FFFF] transition-transform duration-300"
            style={{ transform: sidebarCollapsed ? 'rotate(0deg)' : 'rotate(180deg)' }}
          />
        </button>

        {/* ── ZONE DROITE : header + main ── */}
        <div
          className="flex flex-col flex-1 h-screen overflow-hidden transition-all duration-500 relative z-10"
          style={{ marginLeft: sidebarCollapsed ? '0px' : '320px' }}
        >
          {/* ── TOP NAV ── */}
          <header className="h-[80px] shrink-0 flex items-center justify-between px-8 border-b border-[#00FFFF22] relative"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(20px)' }}>
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-40" />
            <div className="flex items-center gap-8">
              <div className="font-orbitron text-[16px] font-bold text-[#00FFFF] uppercase tracking-widest"
                style={{ textShadow: '0 0 12px rgba(0,255,255,0.6)' }}>SYSTEM_CORE</div>
              <nav className="hidden md:flex gap-6">
                {['Network', 'Nodes', 'Firewall'].map((label) => (
                  <a key={label} href="#" className="font-orbitron text-[11px] text-[#00FFFF88] hover:text-[#00FFFF] transition-all tracking-[0.1em] uppercase">
                    {label}
                  </a>
                ))}
                <a href="#" className="font-orbitron text-[11px] text-[#00FFFF] border-b border-[#00FFFF] tracking-[0.1em] uppercase"
                  style={{ textShadow: '0 0 8px rgba(0,255,255,0.6)' }}>Uplink</a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-[#00FF8811] border border-[#00FF8833] rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" style={{ boxShadow: '0 0 6px #00FF88' }} />
                <span className="font-orbitron text-[10px] text-[#00FF88] font-bold tracking-tighter">SYSTEM_STATUS_OPTIMAL</span>
              </div>
              <div className="flex items-center gap-3 text-[#00FFFF88]">
                {['🔔', '🛡', '⚙'].map((icon, i) => (
                  <span key={i} className="cursor-pointer hover:text-[#00FFFF] transition-all text-lg">{icon}</span>
                ))}
              </div>
              <div className="w-8 h-8 border border-[#00FFFF33] overflow-hidden rounded"
                style={{ boxShadow: '0 0 8px rgba(0,255,255,0.2)' }}>
                <img className="w-full h-full object-cover opacity-80"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQN1HL0HAHCxSGbPeOhQCXvb1a6ipK1US_UBJCV6A738BJbUsyn2YnB5WFz2dhsGNxMBUbdTV1n3en88-v-WHZdLp3IkizfMJj8AbEzUPDUTKUowM2gzy_lfxMJfL54vBqdAA0I1q5GklFZjaZyxGE7s46DWrpyJNTkoct35AF-phD1gs6D5eRUCEi9e_gcnGfJ64gYLDWIpQ4MZWnQpGkKQvdQksebRpeFWvaVAPv_sWbUlPN3JED5XMDxsXTDSjpA8og5X-yjSW1"
                  alt="operator" />
              </div>
            </div>
          </header>

          {/* ── MAIN SCROLLABLE ── */}
          <main className="flex-1 overflow-y-auto p-6 relative terminal-scroll-sc">
            <div className="grid grid-cols-12 gap-6">

              {/* GNS3 SERVER CONFIG */}
              <section className="col-span-12 lg:col-span-4 glass-panel-sc angular-panel-sc p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-60" />
                <div className="flex justify-between items-start mb-6">
                  <h2 className="font-orbitron text-[14px] text-[#00FFFF] uppercase tracking-widest"
                    style={{ textShadow: '0 0 10px rgba(0,255,255,0.5)' }}>GNS3 Server</h2>
                  <span className="text-[#00FFFF88] text-xl">◎</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="font-orbitron text-[9px] text-[#00FFFF88] uppercase block mb-1 tracking-[0.15em]">Target Host IP</label>
                    <input className="nexus-input" type="text" defaultValue="192.168.100.42" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-orbitron text-[9px] text-[#00FFFF88] uppercase block mb-1 tracking-[0.15em]">Port</label>
                      <input className="nexus-input" type="text" defaultValue="3080" />
                    </div>
                    <div>
                      <label className="font-orbitron text-[9px] text-[#00FFFF88] uppercase block mb-1 tracking-[0.15em]">Auth Level</label>
                      <div className="px-3 py-2 border border-[#00FF8833] font-code text-[#00FF88] text-[11px] matrix-text-sc rounded">ENCRYPTED</div>
                    </div>
                  </div>
                  <div>
                    <label className="font-orbitron text-[9px] text-[#00FFFF88] uppercase block mb-1 tracking-[0.15em]">Auth Token</label>
                    <input className="nexus-input" type="password" defaultValue="************************" />
                  </div>

                  {/* Oscilloscope */}
                  <div className="h-24 bg-black border border-[#00FFFF22] relative overflow-hidden mt-6 rounded-lg">
                    <svg className="w-full h-full" viewBox="0 0 200 60" fill="none" stroke="#00FF88" strokeWidth="1.5"
                      style={{ filter: 'drop-shadow(0 0 4px rgba(0,255,136,0.8))' }}>
                      <path d="M0 30 L20 30 L25 10 L30 50 L35 30 L200 30">
                        <animate attributeName="d" dur="2s" repeatCount="indefinite"
                          values="M0 30 L20 30 L25 10 L30 50 L35 30 L200 30;M0 30 L50 30 L55 5 L60 55 L65 30 L200 30;M0 30 L80 30 L85 15 L90 45 L95 30 L200 30;M0 30 L20 30 L25 10 L30 50 L35 30 L200 30" />
                      </path>
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/80" />
                    <div className="absolute top-2 left-2 font-orbitron text-[8px] text-[#00FF88] opacity-70">LIVE_HEARTBEAT: 42ms</div>
                  </div>

                  <button ref={connectionBtnRef} onClick={testConnection}
                    className={`w-full mt-4 py-3 font-orbitron text-[11px] font-bold tracking-widest uppercase transition-all rounded-lg ${
                      connStatus === 'success'
                        ? 'bg-[#00FF88] text-black glow-green-sc'
                        : connStatus === 'connecting'
                        ? 'border border-[#00FFFF44] text-[#00FFFF88] opacity-50 cursor-not-allowed'
                        : 'border border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black glow-cyan-sc'
                    }`}
                    disabled={connStatus === 'connecting'}>
                    {connStatus === 'success' ? 'SUCCESS: LINK ESTABLISHED' : connStatus === 'connecting' ? 'CONNECTING...' : 'Test Connection'}
                  </button>
                </div>
              </section>

              {/* THRESHOLD ALERT ENGINE */}
              <section className="col-span-12 lg:col-span-8 glass-panel-sc p-6 relative overflow-hidden rounded-xl">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-60" />
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="font-orbitron text-[14px] text-[#00FFFF] uppercase tracking-widest"
                      style={{ textShadow: '0 0 10px rgba(0,255,255,0.5)' }}>Threshold Engine</h2>
                    <p className="font-code text-[11px] text-[#00FFFF88] opacity-60 mt-1">System-wide performance limiters</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="font-orbitron text-[10px] font-bold text-[#00FFFF88] tracking-[0.1em]">THREAT_INDEX</div>
                    <div className="font-orbitron text-3xl font-black"
                      style={{ color: threatColor, textShadow: `0 0 15px ${threatColor}88` }}>
                      {threatIndex}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                  {[
                    { id: 'cpu', label: 'CPU CORE ALLOCATION', val: cpuVal, setVal: setCpuVal, max: 100, color: 'cyan', display: `${cpuVal}%` },
                    { id: 'ram', label: 'RAM BUFFER THRESHOLD', val: ramVal, setVal: setRamVal, max: 100, color: 'green', display: `${ramVal}%` },
                    { id: 'jitter', label: 'LATENCY JITTER TOLERANCE', val: jitterVal, setVal: setJitterVal, max: 50, color: 'amber', display: `${jitterVal}ms` },
                    { id: 'packet', label: 'PACKET LOSS TRIGGER', val: packetVal, setVal: setPacketVal, max: 10, color: 'red', display: `${(packetVal * 0.05).toFixed(2)}%` },
                  ].map((slider) => {
                    const barColor = slider.color === 'cyan' ? '#00FFFF' : slider.color === 'green' ? '#00FF88' : slider.color === 'amber' ? '#FFB800' : '#FF3366';
                    const filledBars = Math.round((slider.val / slider.max) * 5);
                    return (
                      <div key={slider.id} className="space-y-3">
                        <div className="flex justify-between">
                          <span className="font-orbitron text-[10px] text-[#00FFFF] tracking-[0.1em]">{slider.label}</span>
                          <span className="font-orbitron text-[10px]" style={{ color: barColor }}>{slider.display}</span>
                        </div>
                        <input
                          type="range" min={0} max={slider.max} value={slider.val}
                          onChange={(e) => {
                            const v = parseInt(e.target.value);
                            slider.setVal(v as any);
                            if (slider.id !== 'packet') updateThreat(
                              slider.id === 'cpu' ? v : cpuVal,
                              slider.id === 'ram' ? v : ramVal,
                              slider.id === 'jitter' ? v : jitterVal
                            );
                          }}
                          className={`nexus-slider ${slider.color}`}
                        />
                        <div className="h-1 flex gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex-1 rounded-full transition-all"
                              style={{ background: i < filledBars ? barColor : 'rgba(58,73,75,0.3)', boxShadow: i < filledBars ? `0 0 4px ${barColor}66` : 'none' }} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 p-4 flex items-center gap-4 transition-all rounded-lg"
                  style={{ background: warningBg, border: `1px solid ${warningBorder}` }}>
                  <span style={{ color: warningTextColor, fontSize: '18px' }}>
                    {warningState === 'critical' ? '⚠' : warningState === 'warn' ? '⚡' : '🛡'}
                  </span>
                  <p className="font-orbitron text-[10px] uppercase tracking-[0.05em]" style={{ color: warningTextColor }}>
                    {warningText}
                  </p>
                </div>
              </section>

              {/* OPERATOR ACCESS MANAGEMENT */}
              <section className="col-span-12 xl:col-span-7 glass-panel-sc p-6 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-60" />
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-orbitron text-[14px] text-[#00FFFF] uppercase tracking-widest"
                    style={{ textShadow: '0 0 10px rgba(0,255,255,0.5)' }}>Operator Access</h2>
                  <div className="flex gap-2">
                    {['＋', '↻'].map((icon, i) => (
                      <button key={i} className="bg-[#00FFFF11] hover:bg-[#00FFFF22] text-[#00FFFF] p-1 border border-[#00FFFF22] rounded transition-all font-orbitron text-sm w-8 h-8 flex items-center justify-center">
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-code text-[11px]">
                    <thead>
                      <tr className="border-b border-[#00FFFF22]">
                        {['Operator ID', 'Role', 'Session Key', 'Clearance', 'Action'].map((h, i) => (
                          <th key={h} className={`pb-3 px-2 font-orbitron text-[9px] text-[#00FFFF88] uppercase tracking-[0.15em] ${i === 4 ? 'text-right' : ''}`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#00FFFF11]">
                      {[
                        { initials: '01', name: 'Operator-01', role: 'Observer', key: 'KX-772-AQ', clearance: 'LVL_2', avatarColor: '#00FFFF', roleColor: '#00FFFF88', clearanceColor: '#00FFFF88' },
                        { initials: 'RT', name: 'Admin-Root', role: 'Superuser', key: 'SY-001-FF', clearance: 'ULTRA', avatarColor: '#00FF88', roleColor: '#00FF88', clearanceColor: '#00FF88' },
                        { initials: 'ST', name: 'Stitch', role: 'Archivist', key: 'ZZ-981-LC', clearance: 'LVL_4', avatarColor: '#FF00FF', roleColor: '#00FFFF88', clearanceColor: '#00FFFF88' },
                      ].map((op) => (
                        <tr key={op.name} className="hover:bg-[#00FFFF08] transition-colors">
                          <td className="py-4 px-2">
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-full flex items-center justify-center font-orbitron text-[9px] font-bold"
                                style={{ background: `${op.avatarColor}22`, border: `1px solid ${op.avatarColor}44`, color: op.avatarColor }}>
                                {op.initials}
                              </div>
                              <span className="font-orbitron text-[11px] text-[#e0e3e5]">{op.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-2 font-orbitron text-[11px]" style={{ color: op.roleColor }}>{op.role}</td>
                          <td className="py-4 px-2 font-code text-[10px] text-[#00FFFF44]">{op.key}</td>
                          <td className="py-4 px-2">
                            <span className="font-orbitron text-[9px] px-2 py-0.5 border rounded"
                              style={{ borderColor: `${op.clearanceColor}66`, color: op.clearanceColor }}>
                              {op.clearance}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-right">
                            <button className="font-orbitron text-[9px] text-[#FF3366] hover:underline uppercase tracking-widest transition-colors hover:text-[#FF6688]">
                              Revoke
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* QUANTUM AUDIT TRAIL */}
              <section className="col-span-12 xl:col-span-5 glass-panel-sc p-6 flex flex-col h-[400px] rounded-xl relative overflow-hidden border border-[#00FFFF22]">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-60" />
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-orbitron text-[14px] text-[#00FFFF] uppercase tracking-widest"
                    style={{ textShadow: '0 0 10px rgba(0,255,255,0.5)' }}>Audit Trail</h2>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" style={{ boxShadow: '0 0 6px #00FF88' }} />
                    <div className="font-orbitron text-[10px] text-[#00FFFF88]">SYNC: 0.003ms</div>
                  </div>
                </div>
                <div ref={auditTerminalRef}
                  className="flex-1 terminal-scroll-sc overflow-y-auto font-code leading-relaxed space-y-1 pr-2">
                  {[
                    { msg: '[14:22:01.002] INITIALIZING_QUANTUM_CORE...', color: 'rgba(132,148,149,0.6)' },
                    { msg: '[14:22:01.450] SHADER_INIT_SUCCESS: 0x8823FFA', color: '#00FF88' },
                    { msg: '[14:22:02.100] OPERATOR_ROOT_LOGIN: KEY_VERIFIED', color: 'rgba(224,227,229,0.6)' },
                    { msg: '[14:23:45.922] WARN: PACKET_LOSS_SPIKE_DETECTION_NODE_7', color: '#FFB800' },
                    { msg: '[14:24:10.005] SYNC_HUNTING: ATTEMPT_01', color: 'rgba(132,148,149,0.6)' },
                    { msg: '[14:24:15.881] BROADCAST_EMITTED: HEX_GRID_RENDER_CALL', color: 'rgba(224,227,229,0.6)' },
                    { msg: '[14:25:00.000] CRITICAL_OVERRIDE_ACTIVE', color: '#FF3366' },
                  ].map((log, i) => (
                    <div key={i} className="font-orbitron text-[10px]" style={{ color: log.color }}>
                      {log.msg}
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-[#00FFFF22] flex gap-2 items-center">
                  <span className="font-orbitron text-[#00FFFF] text-sm">&gt;&gt;</span>
                  <input type="text" className="nexus-cmd" placeholder="ENTER SYSTEM COMMAND..." />
                </div>
              </section>
            </div>

            {/* Spacer pour le bouton fixe */}
            <div className="h-24" />
          </main>
        </div>

        {/* GLOBAL ACTION BUTTON */}
        <div className="fixed bottom-10 right-10 z-50">
          <button onClick={recalibrateSystem}
            className="flex items-center gap-4 px-8 py-4 font-orbitron text-[13px] font-bold tracking-[0.2em] text-black transition-all transform hover:-translate-y-1 active:translate-y-0 rounded-xl"
            style={{ background: 'linear-gradient(90deg,#00FFFF,#00FF88)', boxShadow: '0 0 30px rgba(0,255,255,0.5)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 50px rgba(0,255,255,0.7)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 30px rgba(0,255,255,0.5)'; }}>
            APPLY MATRIX CONFIG
            <span className="font-orbitron text-lg">⚡</span>
          </button>
        </div>
      </div>
    </>
  );
}