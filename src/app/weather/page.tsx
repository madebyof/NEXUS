'use client';

import React, { useEffect, useRef, useState } from 'react';
import Sidebar from "@/components/Sidebar";
import { ChevronRight } from "lucide-react";

export default function WeatherFlux() {
  // ÉTAT POUR LE SIDEBAR
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const tempRef = useRef<HTMLSpanElement>(null);
  const humRef = useRef<HTMLSpanElement>(null);
  const humBarRef = useRef<HTMLDivElement>(null);
  const windRef = useRef<HTMLDivElement>(null);
  const windCircleRef = useRef<SVGPathElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const fadeMatrixRef = useRef<HTMLDivElement>(null);
  const fluxBarsRef = useRef<HTMLDivElement>(null);

  // Initialize matrix, flux bars, and real-time updates
  useEffect(() => {
    const fadeMatrix = fadeMatrixRef.current;
    const fluxBarsContainer = fluxBarsRef.current;
    if (!fadeMatrix || !fluxBarsContainer) return;

    // Initialize Matrix
    fadeMatrix.innerHTML = '';
    for (let i = 0; i < 32; i++) {
      const cell = document.createElement('div');
      cell.style.cssText = 'background:rgba(0,255,255,0.1);border:1px solid rgba(0,255,255,0.08);transition:all 0.5s;';
      fadeMatrix.appendChild(cell);
    }

    // Initialize Flux Bars
    fluxBarsContainer.innerHTML = '';
    for (let i = 0; i < 30; i++) {
      const bar = document.createElement('div');
      bar.style.cssText = `width:4px;background:#00FFFF;transition:all 0.3s;height:${Math.random() * 100}%;opacity:${(i / 30).toFixed(2)};`;
      fluxBarsContainer.appendChild(bar);
    }

    const updateData = () => {
      if (tempRef.current) tempRef.current.innerText = (19.4 + (Math.random() * 0.2 - 0.1)).toFixed(1);
      const currentHum = Math.floor(42 + (Math.random() * 4 - 2));
      if (humRef.current) humRef.current.innerText = currentHum + '%';
      if (humBarRef.current) humBarRef.current.style.width = currentHum + '%';

      const wind = Math.floor(12 + Math.random() * 5);
      if (windRef.current) windRef.current.innerText = wind + ' KT';
      if (windCircleRef.current) windCircleRef.current.style.strokeDasharray = `${wind * 2.5}, 100`;

      const cells = fadeMatrix.children;
      const idx = Math.floor(Math.random() * cells.length);
      const cell = cells[idx] as HTMLElement;
      cell.style.background = 'rgba(0,255,255,0.5)';
      setTimeout(() => { cell.style.background = 'rgba(0,255,255,0.1)'; }, 1000);

      const bars = fluxBarsContainer.children;
      for (const b of Array.from(bars)) {
        const bar = b as HTMLElement;
        if (Math.random() > 0.7) {
          bar.style.height = Math.random() * 100 + '%';
          bar.style.background = Math.random() > 0.8 ? '#00FF88' : '#00FFFF';
        }
      }

      const now = new Date();
      if (timeRef.current) timeRef.current.innerText = now.toUTCString().split(' ')[4] + ' UTC';
    };

    const intervalUpdate = setInterval(updateData, 2000);
    updateData();
    return () => clearInterval(intervalUpdate);
  }, []);

  // Logs
  useEffect(() => {
    const logContainer = logContainerRef.current;
    if (!logContainer) return;
    const logTemplates = [
      "[ANALYSIS] Ionospheric scintillation detected at Northern quadrant.",
      "[INFO] Routine calibration of ILS Glide Path antenna completed.",
      "[CORRELATION] Solar radiation spike matches 0.02dB attenuation increase.",
      "[SYSTEM] Handoff to redundant sensor grid RSI_02 successful.",
      "[WARNING] Ambient moisture in Server Hall B approaching dew point."
    ];
    const addLog = () => {
      const log = document.createElement('p');
      log.style.cssText = "font-family:'Orbitron',sans-serif;font-size:10px;color:rgba(0,255,255,0.7);margin-bottom:4px;";
      log.innerHTML = `<span style="color:#00FFFF">[LOG]</span> ${logTemplates[Math.floor(Math.random() * logTemplates.length)]}`;
      logContainer.prepend(log);
      if (logContainer.children.length > 20) logContainer.lastElementChild?.remove();
    };
    const intervalLog = setInterval(addLog, 7000);
    return () => clearInterval(intervalLog);
  }, []);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;700;800&display=swap" rel="stylesheet" />

      <style jsx global>{`
        .font-orbitron { font-family: 'Orbitron', sans-serif; }
        .font-code { font-family: 'JetBrains Mono', monospace; }

        @keyframes pulse-cyan {
          0%, 100% { box-shadow: 0 0 10px rgba(0,255,255,0.2); }
          50% { box-shadow: 0 0 20px rgba(0,255,255,0.5); }
        }
        @keyframes scanlineAnim {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        .scanline-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(to bottom, transparent 50%, rgba(0,255,255,0.015) 50%);
          background-size: 100% 4px;
          pointer-events: none; z-index: 50;
        }
        .scanline-beam {
          position: fixed; top: 0; left: 0; width: 100%; height: 2px;
          background: linear-gradient(to right, transparent, #00FFFF, transparent);
          box-shadow: 0 0 15px #00FFFF;
          opacity: 0.15;
          animation: scanlineAnim 8s linear infinite;
          pointer-events: none; z-index: 51;
        }
        .angular-cut {
          clip-path: polygon(0 0, 95% 0, 100% 15%, 100% 100%, 5% 100%, 0 85%);
        }
        .angular-cut-header {
          clip-path: polygon(0 0, 100% 0, 98% 100%, 2% 100%);
        }
        .glass-panel {
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(0,255,255,0.15);
          box-shadow: 0 0 20px rgba(0,255,255,0.04);
        }
        .text-glow-cyan { text-shadow: 0 0 8px rgba(0,255,255,0.6); }
        .text-glow-amber { text-shadow: 0 0 8px rgba(255,184,0,0.6); }
        .text-glow-emerald { text-shadow: 0 0 8px rgba(0,255,136,0.6); }
        .grid-bg {
          background-image:
            linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        @keyframes dash { to { stroke-dashoffset: 0; } }
        .chart-path {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: dash 5s linear forwards infinite;
        }
        .terminal-scrollbar::-webkit-scrollbar { width: 4px; }
        .terminal-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .terminal-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,255,255,0.2); border-radius: 2px; }
        .terminal-scrollbar::-webkit-scrollbar-thumb:hover { background: #00FFFF; }
        @keyframes spin5 { to { transform: rotate(360deg); } }
        .spin5 { animation: spin5 5s linear infinite; }
      `}</style>

      {/* CHANGEMENT ICI : flex relative h-screen pour forcer l'alignement horizontal */}
      <div className="font-orbitron bg-black text-[#e0e3e5] overflow-hidden h-screen grid-bg relative flex"
        style={{
          backgroundImage: `
            radial-gradient(circle at top, rgba(0,255,255,0.07), transparent 30%),
            radial-gradient(circle at bottom right, rgba(255,0,255,0.05), transparent 25%),
            linear-gradient(180deg,#000000,#050814),
            linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: 'auto,auto,auto,40px 40px,40px 40px'
        }}
      >
        <div className="scanline-overlay" />
        <div className="scanline-beam" />

        {/* NEXUS hex grid overlay */}
        <div className="absolute inset-0 opacity-8 pointer-events-none z-0">
          <svg className="w-full h-full">
            <defs>
              <pattern id="hexGridWF" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
                <path d="M30 0 L60 15 L60 37 L30 52 L0 37 L0 15 Z" fill="none" stroke="#00FFFF" strokeWidth="0.3" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexGridWF)" />
          </svg>
        </div>

        {/* NEXUS glow borders */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-80 z-50" />
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF00FF] to-transparent opacity-80 z-50" />
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#00FF88] to-transparent opacity-70 z-50" />
        <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#FF00FF] to-transparent opacity-70 z-50" />

        {/* Orbs */}
        <div className="fixed top-20 right-20 w-96 h-96 bg-[#00ffff]/5 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="fixed bottom-20 left-72 w-80 h-80 bg-[#ff00ff]/5 rounded-full blur-[100px] pointer-events-none z-0" />

        {/* Sidebar container */}
        <div
          className={`transition-all duration-300 ease-in-out h-full overflow-hidden flex-shrink-0 relative z-30 ${
            sidebarCollapsed ? "w-0 opacity-0" : "w-80 opacity-100"
          }`}
        >
          <Sidebar pulsePhase={0} />
        </div>
        
        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute top-1/2 z-50 w-8 h-16 bg-gradient-to-r from-[#00FFFF22] to-transparent border-y border-r border-[#00FFFF44] rounded-r-lg flex items-center justify-center cursor-pointer hover:from-[#00FFFF44] transition-all transform -translate-y-1/2 pointer-events-auto"
          style={{
            left: sidebarCollapsed ? "0px" : "320px",
            transition: "left 0.3s ease-in-out"
          }}
        >
          <ChevronRight
            className="w-4 h-4 text-[#00FFFF] transition-transform duration-300"
            style={{ transform: sidebarCollapsed ? "rotate(0deg)" : "rotate(180deg)" }}
          />
        </button>

        {/* CHANGEMENT ICI : flex-1 au lieu de ml-64 pour s'adapter automatiquement à la sidebar */}
        <main className="flex-1 h-screen flex flex-col p-6 space-y-6 overflow-y-auto terminal-scrollbar relative z-10">

          {/* TACTICAL HEADER */}
          <header className="w-full angular-cut-header p-6 flex items-center justify-between relative overflow-hidden flex-shrink-0"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0,255,255,0.2)', boxShadow: '0 0 30px rgba(0,255,255,0.08)' }}>
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-60" />
            <div className="flex items-center space-x-6">
              <div className="flex flex-col">
                <h2 className="font-orbitron text-[#00FFFF] text-glow-cyan tracking-[0.2em] text-[15px] font-bold">
                  WEATHER_FLUX // ENVIRONMENTAL_CORRELATION
                </h2>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2 font-orbitron text-[10px] text-[#00FF88]">
                    <span className="w-2 h-2 bg-[#00FF88] rounded-full animate-pulse" style={{ boxShadow: '0 0 6px #00FF88' }} />
                    <span className="tracking-[0.1em]">METEO_SATELLITE: SYNCED</span>
                  </div>
                  <div className="flex items-center space-x-2 font-orbitron text-[10px] text-[#00FF88] border-l border-[#00FFFF22] pl-4">
                    <span className="w-2 h-2 bg-[#00FF88] rounded-full" style={{ boxShadow: '0 0 6px #00FF88' }} />
                    <span className="tracking-[0.1em]">SENSOR_GRID: 100% OPERATIONAL</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center bg-[#FFB80011] border border-[#FFB800] px-4 py-2 angular-cut animate-pulse rounded-lg">
              <span className="text-[#FFB800] mr-2 text-xl" style={{ textShadow: '0 0 10px rgba(255,184,0,0.8)' }}>⚠</span>
              <span className="font-orbitron text-[#FFB800] text-[12px] tracking-widest font-bold text-glow-amber">
                ENVIRONMENTAL_RISK_INDEX: MODERATE (34%)
              </span>
            </div>
          </header>

          {/* MAIN DASHBOARD GRID */}
          <div className="grid grid-cols-12 gap-6 flex-1">

            {/* SERVER HALL SENSORS */}
            <section className="col-span-12 lg:col-span-5 flex flex-col space-y-6">
              <div className="glass-panel p-6 angular-cut relative group rounded-xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-60" />
                <div className="absolute top-0 right-0 p-2 font-orbitron text-[10px] text-[#00FFFF33]">SEC_HALL_01_SENSOR</div>
                <h3 className="font-orbitron text-[#e0e3e5] text-[11px] font-bold mb-6 flex items-center tracking-[0.1em]">
                  <span className="text-[#00FFFF] mr-2">🌡</span>
                  MIRE / RSI THERMAL TELEMETRY
                </h3>
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <p className="font-orbitron text-[9px] text-[#00FFFF88] tracking-[0.15em] mb-1">CURRENT TEMPERATURE</p>
                    <div className="flex items-baseline">
                      <span ref={tempRef} className="font-orbitron text-6xl font-black text-[#00FFFF] text-glow-cyan">19.4</span>
                      <span className="font-orbitron text-2xl text-[#00FFFF] ml-2">°C</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-orbitron text-[9px] text-[#00FF88] tracking-[0.1em] mb-1">DEVIATION</p>
                    <p className="font-orbitron textxl text-[#00FF88] text-glow-emerald">+0.02% NOMINAL</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center font-orbitron text-[10px]">
                    <span className="text-[#00FFFF88] tracking-[0.1em]">HUMIDITY INDEX</span>
                    <span ref={humRef} className="text-[#00FFFF]">42%</span>
                  </div>
                  <div className="w-full h-1 bg-[#00FFFF11] rounded-full relative overflow-hidden">
                    <div ref={humBarRef} className="absolute top-0 left-0 h-full bg-[#00FFFF] rounded-full transition-all duration-1000"
                      style={{ width: '42%', boxShadow: '0 0 10px rgba(0,255,255,0.8)' }} />
                    <div className="absolute top-0 right-[58%] h-3 w-[1px] bg-white opacity-60" />
                  </div>
                </div>
              </div>

              <div className="glass-panel p-6 border-l-4 border-[#FFB800] rounded-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FFB800] to-transparent opacity-60" />
                <h3 className="font-orbitron text-[#FFB800] text-[11px] font-bold mb-4 flex items-center tracking-[0.1em] text-glow-amber">
                  <span className="mr-2">⚡</span>
                  NTP DRIFT ALERT / PACKET LOSS RISK
                </h3>
                <div className="bg-[#FFB80008] p-4 border border-[#FFB80022] space-y-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex space-x-3">
                      <span className="text-[#FFB800] text-xl">↻</span>
                      <div>
                        <p className="font-orbitron text-[#FFB800] text-[11px] tracking-[0.1em]">STRATUM 1 CLOCK DESYNC DETECTED</p>
                        <p className="font-orbitron text-[#00FFFF88] text-[10px] mt-1 leading-relaxed">External RFI noise floor rising. Potential impact on GPS timing synchronization.</p>
                      </div>
                    </div>
                    <span className="font-orbitron text-[10px] text-[#FFB80066] whitespace-nowrap ml-2">T+14:02:11</span>
                  </div>
                  <div className="pt-2 border-t border-[#FFB80011] flex justify-between items-center">
                    <span className="font-orbitron text-[10px] text-[#00FFFF88]">CORRELATION ID: #NTP-442-X</span>
                    <button className="font-orbitron text-[10px] font-bold text-[#FFB800] underline uppercase hover:text-white transition-colors">Run Diagnostics</button>
                  </div>
                </div>
              </div>
            </section>

            {/* EXTERNAL CONDITIONS */}
            <section className="col-span-12 lg:col-span-7 grid grid-cols-2 gap-6">
              <div className="col-span-2 glass-panel p-6 angular-cut rounded-xl overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-60" />
                <h3 className="font-orbitron text-[#e0e3e5] text-[11px] font-bold mb-6 flex items-center tracking-[0.1em]">
                  <span className="text-[#00FFFF] mr-2">🛰</span>
                  AERONAUTICAL INFRASTRUCTURE HUD
                </h3>
                <div className="grid grid-cols-3 gap-8">
                  {/* Wind Speed */}
                  <div className="flex flex-col items-center p-4 bg-black/60 border border-[#00FFFF11] hover:border-[#00FFFF44] transition-colors rounded-xl">
                    <div className="relative w-20 h-20 mb-4">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none" stroke="rgba(0,255,255,0.1)" strokeWidth="2" />
                        <path ref={windCircleRef}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none" stroke="#00FFFF" strokeDasharray="35, 100" strokeLinecap="butt" strokeWidth="2"
                          style={{ filter: 'drop-shadow(0 0 4px rgba(0,255,255,0.8))', transition: 'stroke-dasharray 1s' }} />
                      </svg>
                      <div ref={windRef} className="absolute inset-0 flex items-center justify-center font-orbitron text-[11px] text-[#00FFFF] text-glow-cyan">
                        14 KT
                      </div>
                    </div>
                    <span className="font-orbitron text-[10px] text-[#00FFFF88] tracking-[0.1em]">WIND SPEED</span>
                  </div>

                  {/* Lightning Risk */}
                  <div className="flex flex-col items-center p-4 bg-black/60 border border-[#FFB80011] hover:border-[#FFB80044] transition-colors rounded-xl">
                    <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
                      <span className="text-4xl animate-pulse" style={{ color: '#FFB800', textShadow: '0 0 15px rgba(255,184,0,0.8)', filter: 'drop-shadow(0 0 8px rgba(255,184,0,0.6))' }}>⚡</span>
                      <div className="absolute inset-0 border-2 border-[#FFB80022] rounded-full spin5" />
                    </div>
                    <span className="font-orbitron text-[10px] text-[#00FFFF88] tracking-[0.1em]">LIGHTNING RISK: LOW</span>
                  </div>

                  {/* Precipitation */}
                  <div className="flex flex-col items-center p-4 bg-black/60 border border-[#00FFFF11] hover:border-[#00FFFF44] transition-colors rounded-xl">
                    <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
                      <span className="text-4xl" style={{ color: '#00FFFF', textShadow: '0 0 15px rgba(0,255,255,0.8)' }}>🌧</span>
                      <div className="absolute bottom-2 font-orbitron text-[10px] text-[#00FFFF]">0.2 mm/h</div>
                    </div>
                    <span className="font-orbitron text-[10px] text-[#00FFFF88] tracking-[0.1em]">PRECIPITATION</span>
                  </div>
                </div>
              </div>

              {/* Rain Fade Matrix */}
              <div className="col-span-1 glass-panel p-6 relative h-64 overflow-hidden rounded-xl">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-60" />
                <h3 className="font-orbitron text-[#e0e3e5] text-[10px] font-bold mb-4 tracking-[0.15em]">RAIN FADE MATRIX</h3>
                <div ref={fadeMatrixRef} className="grid grid-cols-8 gap-1 h-32" />
                <div className="mt-4 flex justify-between items-center font-orbitron text-[10px]">
                  <span className="text-[#00FFFF88] tracking-[0.1em]">SIGNAL ATTENUATION</span>
                  <span className="text-[#00FFFF]">-2.4 dB</span>
                </div>
              </div>

              {/* ILS / VOR Signal */}
              <div className="col-span-1 glass-panel p-6 relative h-64 overflow-hidden rounded-xl">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-60" />
                <h3 className="font-orbitron text-[#e0e3e5] text-[10px] font-bold mb-4 tracking-[0.15em]">ILS / VOR SIGNAL STABILITY</h3>
                <div className="w-full h-32 relative">
                  <svg className="w-full h-full" viewBox="0 0 100 40">
                    <path className="chart-path" fill="none" stroke="#00FFFF" strokeWidth="0.5"
                      d="M0 20 Q 10 5, 20 20 T 40 20 T 60 20 T 80 20 T 100 20"
                      style={{ filter: 'drop-shadow(0 0 3px rgba(0,255,255,0.8))' }} />
                    <path className="chart-path" fill="none" stroke="#00FF88" strokeWidth="0.3" opacity="0.5"
                      d="M0 25 Q 15 10, 30 25 T 60 25 T 90 25 T 120 25"
                      style={{ filter: 'drop-shadow(0 0 2px rgba(0,255,136,0.6))' }} />
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-20" />
                </div>
                <div className="mt-4 flex flex-col space-y-1">
                  <div className="flex justify-between font-orbitron text-[10px] text-[#00FF88]">
                    <span className="tracking-[0.1em]">AZIMUTH VARIANCE</span>
                    <span>0.001°</span>
                  </div>
                  <div className="flex justify-between font-orbitron text-[10px] text-[#00FF88]">
                    <span className="tracking-[0.1em]">ELEVATION DRIFT</span>
                    <span>0.002%</span>
                  </div>
                </div>
              </div>
            </section>

            {/* AI CORRELATION MODULE */}
            <section className="col-span-12 glass-panel p-6 grid grid-cols-1 md:grid-cols-2 gap-8 border-t-2 border-[#00FFFF] rounded-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-80" />
              <div>
                <h3 className="font-orbitron text-[#e0e3e5] text-[11px] font-bold mb-4 flex items-center tracking-[0.1em]">
                  <span className="text-[#00FFFF] mr-2">🧠</span>
                  AI CORRELATION ENGINE (V.4.2)
                </h3>
                <div ref={logContainerRef} className="space-y-1 h-40 overflow-y-auto terminal-scrollbar">
                  <p className="font-orbitron text-[10px] text-[#00FFFF66]">[BOOT] Neural correlation engine active...</p>
                  <p className="font-orbitron text-[10px] text-[#00FFFF88]">
                    <span className="text-[#00FFFF]">[ANALYSIS]</span> Humidity spike at Antenna Area West correlates with a 0.04% increase in Packet Loss.
                  </p>
                  <p className="font-orbitron text-[10px] text-[#FFB800]">
                    <span className="text-[#FFB800]">[ALERT]</span> Precipitation intensity threshold approached for Ku-band uplink.
                  </p>
                  <p className="font-orbitron text-[10px] text-[#00FFFF88]">
                    <span className="text-[#00FFFF]">[PREDICT]</span> Estimated fading event in T-45 mins based on cloud vector.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute top-0 right-0 font-orbitron text-[10px] text-[#00FFFF88] tracking-[0.1em]">REAL-TIME FLUX CORRELATION</div>
                <div className="w-full h-full flex items-end space-x-1 pt-6">
                  <div ref={fluxBarsRef} className="flex items-end justify-between w-full h-40 gap-[2px]" />
                </div>
              </div>
            </section>
          </div>

          {/* FOOTER */}
          <footer className="flex justify-between items-center font-orbitron text-[10px] text-[#00FFFF44] pt-4 border-t border-[#00FFFF11]">
            <div className="flex space-x-6 tracking-[0.1em]">
              <span>LATENCY: 12ms</span>
              <span>UPTIME: 99.999%</span>
              <span>ENCRYPTION: AES-512-NEURAL</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>SYSTEM TIME:</span>
              <span>14:02:44 UTC</span>
            </div>
          </footer>
        </main>

        <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000_100%)] z-0" />
      </div>
    </>
  );
}