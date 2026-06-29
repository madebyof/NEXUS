'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import Sidebar from "@/components/Sidebar"; 

export default function QuantumAlerts() {
  const bodyBgRef = useRef<HTMLDivElement>(null);
  // Gestion de l'état d'ouverture/fermeture de la Sidebar
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const acknowledge = (alertId: string) => {
    const card = document.getElementById(alertId);
    if (!card) return;
    const btn = card.querySelector('.ack-btn') as HTMLButtonElement;
    if (!btn) return;

    card.style.opacity = '0.5';
    card.style.filter = 'grayscale(0.8)';
    card.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    card.classList.remove('hover:border-alert-red', 'animate-pulse-red');

    const accent = card.querySelector('.accent-bar') as HTMLElement;
    if (accent) {
      accent.classList.remove('animate-pulse');
      accent.style.background = 'rgba(16, 185, 129, 0.5)';
    }

    btn.innerHTML = '<span class="flex items-center gap-2"><span class="material-symbols-outlined text-[14px]">check_circle</span> ACK_OK // SYSTEM_SECURED</span>';
    btn.style.borderColor = '#00FFFF';
    btn.style.color = '#00FFFF';
    btn.style.backgroundColor = 'rgba(0, 255, 255, 0.08)';
    btn.classList.remove('hover:bg-alert-red', 'hover:text-black');
    btn.disabled = true;
    btn.classList.add('cursor-default');

    card.classList.add('scale-[0.98]');
    setTimeout(() => card.classList.remove('scale-[0.98]'), 150);
  };

  // Atmospheric micro-interactions
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      if (bodyBgRef.current) {
        bodyBgRef.current.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, #050814 0%, #000000 80%)`;
      }
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@100..900&family=JetBrains+Mono:wght@100..900&family=Inter:wght@100..900&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <style jsx global>{`
        .font-orbitron { font-family: 'Orbitron', sans-serif; }
        .font-jetbrains { font-family: 'JetBrains Mono', monospace; }

        .custom-scrollbar::-webkit-scrollbar { width: 3px; height: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,255,255,0.3); border-radius: 0; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,255,255,0.6); }

        .hex-overlay-qa {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.32v12.36l11 6.35 11-6.35V17.32L14 10.97 3 17.32z' fill='%2300FFFF' fill-opacity='0.04' fill-rule='evenodd'/%3E%3C/svg%3E");
        }

        @keyframes pulse-red {
          0% { box-shadow: 0 0 0 0 rgba(255, 51, 102, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(255, 51, 102, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 51, 102, 0); }
        }
        .animate-pulse-red { animation: pulse-red 2s infinite; }

        .glow-cyan { text-shadow: 0 0 8px rgba(0, 255, 255, 0.6); }
        .glow-magenta { text-shadow: 0 0 8px rgba(255, 0, 255, 0.6); }

        .glass-card {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          background: rgba(0, 0, 0, 0.55);
          border: 1px solid rgba(0, 255, 255, 0.15);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .scanline-qa {
          width: 100%;
          height: 2px;
          background: linear-gradient(to right, transparent, #00FFFF, transparent);
          box-shadow: 0 0 15px #00FFFF;
          opacity: 0.15;
          position: absolute;
          top: 0;
          left: 0;
          animation: scanQa 8s linear infinite;
          pointer-events: none;
        }
        @keyframes scanQa {
          0% { top: 0; }
          100% { top: 100%; }
        }

        .qa-root {
          background-color: #000000;
          background-image:
            radial-gradient(circle at top, rgba(0,255,255,0.08), transparent 30%),
            radial-gradient(circle at bottom right, rgba(255,0,255,0.06), transparent 25%),
            linear-gradient(180deg, #000000, #050814);
        }
      `}</style>

      <div ref={bodyBgRef} className="qa-root font-orbitron text-[#e3e2e3] overflow-hidden h-screen relative selection:bg-[#00FFFF]/30">

        {/* Hexagonal Grid Overlay */}
        <div className="fixed inset-0 hex-overlay-qa pointer-events-none opacity-40 z-0" />
        <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/80 z-0" />
        <div className="scanline-qa" />

        {/* NEXUS glow borders */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-80 z-50" />
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF00FF] to-transparent opacity-80 z-50" />
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#00FF88] to-transparent opacity-70 z-50" />
        <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#FF00FF] to-transparent opacity-70 z-50" />

        {/* Orbs */}
        <div className="fixed top-20 right-20 w-96 h-96 bg-[#00ffff]/5 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="fixed bottom-20 left-20 w-80 h-80 bg-[#ff00ff]/5 rounded-full blur-[100px] pointer-events-none z-0" />

        <div className="relative flex h-screen overflow-hidden z-10">

          {/* SIDEBAR INTEGRATION - Animation de largeur fluide sans Layout Shift brutal */}
          <div 
            className={`transition-all duration-300 ease-in-out h-full overflow-hidden shrink-0 border-r border-[#00FFFF22] ${
              sidebarCollapsed ? "w-0 opacity-0" : "w-80 opacity-100"
            }`}
          >
            <Sidebar pulsePhase={0} />
          </div>

          {/* TOGGLE BUTTON - Parfaitement synchronisé avec l'animation de la Sidebar */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute top-1/2 z-50 w-6 h-16 bg-gradient-to-r from-black/80 to-transparent border-y border-r border-[#00FFFF44] rounded-r-lg flex items-center justify-center cursor-pointer hover:from-[#00FFFF11] transition-all transform -translate-y-1/2 pointer-events-auto"
            style={{ 
              left: sidebarCollapsed ? "0px" : "320px",
              transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            }}
          >
            <ChevronRight
              className="w-4 h-4 text-[#00FFFF] transition-transform duration-300"
              style={{ transform: sidebarCollapsed ? "rotate(0deg)" : "rotate(180deg)" }}
            />
          </button>

          {/* Main Canvas */}
          <main className="flex-1 p-6 relative overflow-hidden flex flex-col gap-6">

            {/* Dashboard Header & Title Section */}
            <div className="flex justify-between items-end">
              <div>
                <div className="flex items-center gap-2 text-[#00FFFF] font-jetbrains text-[12px] mb-2 tracking-[0.1em]">
                  <span className="w-6 h-[1px] bg-[#00FFFF]" style={{ boxShadow: '0 0 6px #00FFFF' }} /> SECURITY_PROTOCOL_A7
                </div>
                <h2 className="font-orbitron text-4xl font-black text-white tracking-tighter" style={{ textShadow: '0 0 20px rgba(0,255,255,0.3)' }}>
                  QUANTUM_ALERTS <span className="text-white/30">//</span> <span className="text-[#00FFFF]" style={{ textShadow: '0 0 15px rgba(0,255,255,0.7)' }}>SEC_INCIDENTS</span>
                </h2>
              </div>
              <div className="text-right">
                <div className="font-jetbrains text-[12px] text-[#00FFFF88] tracking-[0.1em]">ACTIVE_SESSIONS</div>
                <div className="font-orbitron text-2xl font-bold text-white">
                  409 <span className="text-[#00FFFF]" style={{ textShadow: '0 0 8px rgba(0,255,255,0.7)' }}>/</span> 08
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-2 p-1 rounded-lg glass-card">
              <button className="px-6 py-2 font-orbitron text-[11px] tracking-widest bg-white/10 text-white hover:bg-white/20 transition-all border border-transparent rounded-md">
                [ALL]
              </button>
              <button className="px-6 py-2 font-orbitron text-[11px] tracking-widest bg-[#FF336622] text-[#FF3366] hover:bg-[#FF336633] transition-all border border-[#FF336655] animate-pulse-red rounded-md">
                [CRITICAL]
              </button>
              <button className="px-6 py-2 font-orbitron text-[11px] tracking-widest bg-[#FFB80022] text-[#FFB800] hover:bg-[#FFB80033] transition-all border border-[#FFB80055] rounded-md">
                [WARNING]
              </button>
              <button className="px-6 py-2 font-orbitron text-[11px] tracking-widest bg-[#00FFFF22] text-[#00FFFF] hover:bg-[#00FFFF33] transition-all border border-[#00FFFF55] rounded-md">
                [INFO]
              </button>
              <div className="ml-auto px-4 font-jetbrains text-[11px] text-[#00FFFF88] tracking-[0.1em]">
                FILTERED: 247_ENTRIES
              </div>
            </div>

            {/* Incident List Container */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">

              {/* Card 1: Critical */}
              <div className="glass-card rounded-xl p-5 group hover:border-[#FF3366] transition-all relative overflow-hidden" style={{ borderColor: 'rgba(255,51,102,0.3)' }} id="alert-1">
                <div className="accent-bar absolute top-0 left-0 w-1 h-full bg-[#FF3366] animate-pulse" style={{ boxShadow: '0 0 10px #FF3366' }} />
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-[#FF336622] border border-[#FF336644] rounded-lg">
                      <span className="material-symbols-outlined text-[#FF3366] animate-bounce" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-jetbrains text-[#FF3366] font-bold text-xs">[CRITICAL]</span>
                        <span className="font-jetbrains text-[#00FFFF66] text-[11px]">14:02:33.452</span>
                        <span className="font-jetbrains text-white/40 text-[11px]">0x42A19F88</span>
                      </div>
                      <h3 className="font-orbitron text-lg font-bold text-white group-hover:text-[#FF3366] transition-colors">UNAUTHORIZED_CORE_ACCESS_DETECTION</h3>
                      <div className="mt-1 font-jetbrains text-[10px] tracking-widest text-[#00FFFF66] flex items-center gap-2">
                        SUBSYSTEM: <span className="text-white">SECTOR_7G</span> | SOURCE: <span className="text-white">IP_192.168.10.42</span>
                      </div>
                    </div>
                  </div>
                  <button className="ack-btn px-6 py-3 bg-transparent border border-[#FF336666] text-[#FF3366] font-orbitron text-[10px] tracking-widest hover:bg-[#FF3366] hover:text-black transition-all group-active:scale-95 rounded-md" onClick={() => acknowledge('alert-1')}>
                    ACKNOWLEDGE
                  </button>
                </div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-[#FF336644]" />
              </div>

              {/* Card 2: Warning */}
              <div className="glass-card rounded-xl p-5 group hover:border-[#FFB800] transition-all relative" style={{ borderColor: 'rgba(255,184,0,0.2)' }} id="alert-2">
                <div className="accent-bar absolute top-0 left-0 w-1 h-full bg-[#FFB80088]" />
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-[#FFB80011] border border-[#FFB80033] rounded-lg">
                      <span className="material-symbols-outlined text-[#FFB800]">sensors</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-jetbrains text-[#FFB800] font-bold text-xs">[WARNING]</span>
                        <span className="font-jetbrains text-[#00FFFF66] text-[11px]">14:00:12.112</span>
                        <span className="font-jetbrains text-white/40 text-[11px]">0xFE391200</span>
                      </div>
                      <h3 className="font-orbitron text-lg font-bold text-white">LATENCY_SPIKE_DETECTED_IN_BACKBONE</h3>
                      <div className="mt-1 font-jetbrains text-[10px] tracking-widest text-[#00FFFF66] flex items-center gap-2">
                        SUBSYSTEM: <span className="text-white">UP_LINK_OS_2</span> | DEVIATION: <span className="text-white">+450ms</span>
                      </div>
                    </div>
                  </div>
                  <button className="ack-btn px-6 py-3 bg-transparent border border-[#FFB80066] text-[#FFB800] font-orbitron text-[10px] tracking-widest hover:bg-[#FFB800] hover:text-black transition-all rounded-md" onClick={() => acknowledge('alert-2')}>
                    ACKNOWLEDGE
                  </button>
                </div>
              </div>

              {/* Card 3: Info */}
              <div className="glass-card rounded-xl p-5 group hover:border-[#00FFFF] transition-all relative" style={{ borderColor: 'rgba(0,255,255,0.2)' }} id="alert-3">
                <div className="accent-bar absolute top-0 left-0 w-1 h-full bg-[#00FFFF55]" />
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-[#00FFFF11] border border-[#00FFFF33] rounded-lg">
                      <span className="material-symbols-outlined text-[#00FFFF]">info</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-jetbrains text-[#00FFFF] font-bold text-xs">[INFO]</span>
                        <span className="font-jetbrains text-[#00FFFF66] text-[11px]">13:58:05.901</span>
                        <span className="font-jetbrains text-white/40 text-[11px]">0x889A12B4</span>
                      </div>
                      <h3 className="font-orbitron text-lg font-bold text-white">SYSTEM_BACKUP_COMPLETED_SUCCESSFULLY</h3>
                      <div className="mt-1 font-jetbrains text-[10px] tracking-widest text-[#00FFFF66] flex items-center gap-2">
                        SUBSYSTEM: <span className="text-white">DATA_ARCHIVE</span> | SIZE: <span className="text-white">4.2 TB</span>
                      </div>
                    </div>
                  </div>
                  <button className="ack-btn px-6 py-3 bg-transparent border border-[#00FFFF66] text-[#00FFFF] font-orbitron text-[10px] tracking-widest hover:bg-[#00FFFF] hover:text-black transition-all rounded-md" onClick={() => acknowledge('alert-3')}>
                    ACKNOWLEDGE
                  </button>
                </div>
              </div>

              {/* Card 4: Critical */}
              <div className="glass-card rounded-xl p-5 group hover:border-[#FF3366] transition-all relative" style={{ borderColor: 'rgba(255,51,102,0.3)' }} id="alert-4">
                <div className="accent-bar absolute top-0 left-0 w-1 h-full bg-[#FF3366] animate-pulse" style={{ boxShadow: '0 0 10px #FF3366' }} />
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-[#FF336622] border border-[#FF336644] rounded-lg">
                      <span className="material-symbols-outlined text-[#FF3366]" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-jetbrains text-[#FF3366] font-bold text-xs">[CRITICAL]</span>
                        <span className="font-jetbrains text-[#00FFFF66] text-[11px]">13:55:40.002</span>
                        <span className="font-jetbrains text-white/40 text-[11px]">0xDEADBEEF</span>
                      </div>
                      <h3 className="font-orbitron text-lg font-bold text-white">PWR_MODULE_FAILURE_RACK_09</h3>
                      <div className="mt-1 font-jetbrains text-[10px] tracking-widest text-[#00FFFF66] flex items-center gap-2">
                        SUBSYSTEM: <span className="text-white">POWER_DIST</span> | TEMP: <span className="text-white">92°C</span>
                      </div>
                    </div>
                  </div>
                  <button className="ack-btn px-6 py-3 bg-transparent border border-[#FF336666] text-[#FF3366] font-orbitron text-[10px] tracking-widest hover:bg-[#FF3366] hover:text-black transition-all rounded-md" onClick={() => acknowledge('alert-4')}>
                    ACKNOWLEDGE
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Data Stream */}
            <div className="mt-auto flex items-center justify-between py-2 border-t border-[#00FFFF22] font-jetbrains text-[10px] text-[#00FFFF66] uppercase tracking-[0.3em]">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2"><span className="w-1 h-1 bg-[#00FFFF]" style={{ boxShadow: '0 0 4px #00FFFF' }} /> STREAM_ACTIVE</span>
                <span className="flex items-center gap-2"><span className="w-1 h-1 bg-[#FF00FF]" style={{ boxShadow: '0 0 4px #FF00FF' }} /> ENCRYPTION: AES-256</span>
              </div>
              <div className="flex items-center gap-8">
                <span>PACKET_LOSS: 0.0001%</span>
                <span>UPTIME: 142:55:09</span>
                <span className="text-[#00FFFF] glow-cyan">SECURE_LINK_STABLE</span>
              </div>
            </div>
          </main>

          {/* Right Side Panel: System Metrics */}
          <aside className="hidden xl:flex w-80 glass-card border-l border-[#00FFFF22] flex-col p-6 gap-6">
            <div>
              <h4 className="font-orbitron text-[10px] tracking-widest text-[#00FFFF88] mb-4 uppercase">Node Visualizers</h4>
              <div className="aspect-square bg-black/40 border border-[#00FFFF22] relative flex items-center justify-center overflow-hidden rounded-xl">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(0,255,255,0.1)" strokeWidth="3" />
                  <circle
                    cx="50" cy="50" r="45" fill="none"
                    stroke="#00FFFF" strokeWidth="3"
                    strokeDasharray="283" strokeDashoffset={283 - (283 * 0.88)}
                    style={{ filter: 'drop-shadow(0 0 6px rgba(0,255,255,0.8))' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="font-orbitron text-2xl font-black text-white glow-cyan">88%</div>
                  <div className="font-jetbrains text-[9px] text-[#00FFFF] tracking-widest uppercase">Node_Load</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-orbitron text-[10px] tracking-widest text-[#00FFFF88] mb-3 uppercase">Threat Density</h4>
              <div className="space-y-3">
                <div className="h-12 bg-white/5 border-l-2 border-[#00FFFF] p-2 flex flex-col justify-center rounded-r-lg">
                  <div className="flex justify-between text-[10px] font-jetbrains text-[#00FFFF88] mb-1">
                    <span>INT_PROTOCOLS</span>
                    <span className="text-[#00FFFF]">82%</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#00FFFF] glow-cyan rounded-full" style={{ width: '82%', boxShadow: '0 0 8px #00FFFF' }} />
                  </div>
                </div>
                <div className="h-12 bg-white/5 border-l-2 border-[#FF00FF] p-2 flex flex-col justify-center rounded-r-lg">
                  <div className="flex justify-between text-[10px] font-jetbrains text-[#FF00FF88] mb-1">
                    <span>EXT_FIREWALL</span>
                    <span className="text-[#FF00FF]">14%</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#FF00FF] glow-magenta rounded-full" style={{ width: '14%', boxShadow: '0 0 8px #FF00FF' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto">
              <div className="p-4 bg-[#FF336611] border border-[#FF336633] rounded-xl">
                <div className="flex items-center gap-2 font-orbitron text-[10px] text-[#FF3366] mb-2 font-bold tracking-[0.1em]">
                  <span className="material-symbols-outlined text-[14px]">gpp_maybe</span>
                  CRITICAL_NOTICE
                </div>
                <p className="font-jetbrains text-[10px] text-[#FFB80088] leading-relaxed">
                  Automated response protocols are engaged in Sector_7G. Manual override requires Level 5 clearance.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}