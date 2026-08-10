'use client';

import React, { useEffect, useRef, useState } from 'react';
import Sidebar from "@/components/Sidebar";
import { ChevronRight } from "lucide-react";

export default function NeuralOS() {
  const containerRef = useRef(null);
  const logContainerRef = useRef(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = "https://ajax.googleapis.com/ajax/libs/threejs/r125/three.min.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const win = window as any;
        if (!containerRef.current || !win.THREE) return;

        const THREE = win.THREE;
        const container = containerRef.current;
        let width = container.clientWidth || window.innerWidth;
        let height = container.clientHeight || window.innerHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0x404040, 2);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0x00f2ff, 2);
        pointLight.position.set(10, 10, 10);
        scene.add(pointLight);

        const networkGroup = new THREE.Group();
        scene.add(networkGroup);

        const nodeGeom = new THREE.IcosahedronGeometry(0.5, 0);
        const edgeGeom = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);

        const greenMat = new THREE.MeshPhongMaterial({ color: 0x00ff88, emissive: 0x00ff88, emissiveIntensity: 0.8 });
        const orangeMat = new THREE.MeshPhongMaterial({ color: 0xffaa00, emissive: 0xffaa00, emissiveIntensity: 0.8 });
        const redMat = new THREE.MeshPhongMaterial({ color: 0xff0044, emissive: 0xff0044, emissiveIntensity: 0.8 });

        const gridHelper = new THREE.GridHelper(50, 50, 0x00f2ff, 0x111111);
        gridHelper.position.y = -5;
        scene.add(gridHelper);

        const nodes = [
          { pos: [0, 0, 0], status: 'ok', type: 'Server' },
          { pos: [5, 2, -3], status: 'latency', type: 'Router' },
          { pos: [-4, -1, 4], status: 'critical', type: 'Switch' },
          { pos: [3, -3, 2], status: 'ok', type: 'Server' },
          { pos: [-6, 3, -2], status: 'ok', type: 'Router' }
        ];

        const nodeMeshes = [];
        nodes.forEach(n => {
          const mat = n.status === 'ok' ? greenMat : (n.status === 'latency' ? orangeMat : redMat);
          const mesh = new THREE.Mesh(nodeGeom, mat);
          mesh.position.set(...n.pos);
          const haloGeom = new THREE.SphereGeometry(0.8, 16, 16);
          const haloMat = new THREE.MeshBasicMaterial({ color: mat.color, transparent: true, opacity: 0.2 });
          const halo = new THREE.Mesh(haloGeom, haloMat);
          mesh.add(halo);
          networkGroup.add(mesh);
          nodeMeshes.push(mesh);
        });

        for (let i = 0; i < nodeMeshes.length; i++) {
          for (let j = i + 1; j < nodeMeshes.length; j++) {
            const start = nodeMeshes[i].position;
            const end = nodeMeshes[j].position;
            const dist = start.distanceTo(end);
            const line = new THREE.Mesh(edgeGeom, new THREE.MeshBasicMaterial({ color: 0x00f2ff, transparent: true, opacity: 0.3 }));
            line.position.copy(start);
            line.position.lerp(end, 0.5);
            line.scale.set(1, dist, 1);
            line.lookAt(end);
            line.rotateX(Math.PI / 2);
            networkGroup.add(line);
          }
        }

        camera.position.z = 12;

        let animationFrameId;
        const animate = () => {
          animationFrameId = requestAnimationFrame(animate);
          networkGroup.rotation.y += 0.002;
          networkGroup.rotation.x += 0.001;
          nodeMeshes.forEach((m, i) => {
            if (m.children[0]) {
              m.children[0].scale.setScalar(1 + Math.sin(Date.now() * 0.005 + i) * 0.1);
            }
          });
          renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
          const w = container.clientWidth || window.innerWidth;
          const h = container.clientHeight || window.innerHeight;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        };
        window.addEventListener('resize', handleResize);

        // Observer to capture container dimension changes when layout shifts (sidebar toggle)
        const resizeObserver = new ResizeObserver(() => {
          handleResize();
        });
        if (container) resizeObserver.observe(container);

        return () => {
          window.removeEventListener('resize', handleResize);
          if (container) resizeObserver.unobserve(container);
          cancelAnimationFrame(animationFrameId);
          if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
        };
      };
    }
  }, []);

  useEffect(() => {
    const logContainer = logContainerRef.current;
    const entries = [
      "PACKET_LOSS: 0.002% >> NEGLIGIBLE",
      "RE-ROUTE: SECTOR_4 >> COMPLETED",
      "HANDSHAKE: GATEWAY_B >> SECURE",
      "OPTIMIZATION: CACHE_SYNC >> DONE",
      "LATENCY_SPIKE: REGION_EAST >> 45ms",
      "RESOURCE_ALLOC: VM_INST_09 >> 4.2GB"
    ];

    function addLog() {
      if (!logContainer) return;
      const time = new Date().toLocaleTimeString([], { hour12: false });
      const entry = entries[Math.floor(Math.random() * entries.length)];
      const div = document.createElement('div');
      div.className = "flex gap-3 animate-pulse";
      div.style.cssText = "font-family: 'Orbitron', sans-serif; font-size: 10px; color: rgba(0,255,255,0.7);";
      div.innerHTML = `<span style="color:rgba(0,255,255,0.35)">[${time}]</span><span>${entry}</span>`;
      logContainer.prepend(div);
      if (logContainer.children.length > 15) {
        logContainer.removeChild(logContainer.lastChild);
      }
      setTimeout(() => div.classList.remove('animate-pulse'), 1000);
    }

    const intervalId = setInterval(addLog, 4000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

      <style dangerouslySetInnerHTML={{
        __html: `
  .glass-panel {
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    background: rgba(0, 0, 0, 0.55);
    border: 1px solid rgba(0, 255, 255, 0.15);
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.05);
  }
  .nexus-glow {
    box-shadow: 0 0 12px rgba(0, 255, 255, 0.4);
  }
  .scan-line {
    width: 100%;
    height: 2px;
    background: linear-gradient(to right, transparent, #00FFFF, transparent);
    box-shadow: 0 0 15px #00FFFF;
    position: absolute;
    top: 0;
    left: 0;
    animation: scan 4s linear infinite;
  }
  @keyframes scan {
    0% { top: 0%; opacity: 0; }
    50% { opacity: 1; }
    100% { top: 100%; opacity: 0; }
  }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
  ::-webkit-scrollbar-thumb { background: rgba(0,255,255,0.3); border-radius: 2px; }
  ::-webkit-scrollbar-thumb:hover { background: #00FFFF; }
  .font-orbitron { font-family: 'Orbitron', sans-serif; }
  .font-mono-nexus { font-family: 'JetBrains Mono', monospace; }
` }} />

      <div className="font-orbitron bg-[#000000] text-[#e0e3e5] overflow-hidden min-h-screen relative"
        style={{
          backgroundImage: `
            radial-gradient(circle at top, rgba(0,255,255,0.08), transparent 30%),
            radial-gradient(circle at bottom right, rgba(255,0,255,0.06), transparent 25%),
            linear-gradient(180deg, #000000, #050814)
          `
        }}
      >
        {/* Hex grid background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full">
            <defs>
              <pattern id="hexGrid" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
                <path d="M30 0 L60 15 L60 37 L30 52 L0 37 L0 15 Z" fill="none" stroke="#00FFFF" strokeWidth="0.5" opacity="0.5" />
              </pattern>
              <radialGradient id="cosmicGlow" cx="50%" cy="50%">
                <stop offset="0%" stopColor="#FF00FF" stopOpacity="0.25" />
                <stop offset="50%" stopColor="#00FFFF" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexGrid)" />
            <circle cx="50%" cy="50%" r="40%" fill="url(#cosmicGlow)" />
          </svg>
        </div>

        {/* NEXUS glow borders */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-80 z-50" />
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF00FF] to-transparent opacity-80 z-50" />
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#00FF88] to-transparent opacity-70 z-50" />
        <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#FF00FF] to-transparent opacity-70 z-50" />

        {/* Orbs */}
        <div className="fixed top-20 right-20 w-96 h-96 bg-[#00ffff]/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="fixed bottom-20 left-20 w-80 h-80 bg-[#ff00ff]/8 rounded-full blur-[100px] pointer-events-none" />

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

          {/* Main Content Area */}
          <main className="flex-1 relative overflow-hidden transition-all duration-300">
            {/* Three.js Network Scene */}
            <div className="absolute inset-0 w-full h-full opacity-70">
              <div ref={containerRef} id="threejs-container-ANIMATION_2" style={{ width: '100%', height: '100%' }} />
            </div>

            {/* HUD Overlays */}
            <div className="absolute inset-0 p-8 flex flex-col pointer-events-none justify-between h-full">

              {/* Top Row: Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pointer-events-auto">

                {/* CPU Usage */}
                <div className="glass-panel border-l-2 border-l-[#00FFFF] p-4 rounded-lg relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-60" />
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-orbitron text-[10px] font-bold text-[#00FFFF88] tracking-[0.15em]">CPU_LOAD</span>
                    <span className="text-[#00FFFF] text-sm">⬡</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-orbitron text-2xl font-bold text-[#00FFFF]">42.8</span>
                    <span className="font-orbitron text-xs text-[#00FFFF88]">%</span>
                  </div>
                  <div className="w-full bg-[#00FFFF11] h-1 mt-3 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-[#00FFFF] to-[#00FF88] h-full rounded-full" style={{ width: '42.8%' }}>
                      <div className="w-full h-full bg-white opacity-20 animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Uptime */}
                <div className="glass-panel border-l-2 border-l-[#00FFFF] p-4 rounded-lg relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-60" />
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-orbitron text-[10px] font-bold text-[#00FFFF88] tracking-[0.15em]">UPTIME</span>
                    <span className="text-[#00FFFF] text-sm">◈</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-orbitron text-xl font-bold text-[#00FFFF]">124:14:02</span>
                  </div>
                  <div className="font-orbitron text-[10px] text-[#00FF88] mt-2 tracking-[0.1em]">STABILITY: 99.98%</div>
                </div>

                {/* Latency */}
                <div className="glass-panel border-l-2 border-l-[#00FFFF] p-4 rounded-lg relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-60" />
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-orbitron text-[10px] font-bold text-[#00FFFF88] tracking-[0.15em]">LATENCY</span>
                    <span className="text-[#00FFFF] text-sm">◎</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-orbitron text-2xl font-bold text-[#00FFFF]">12</span>
                    <span className="font-orbitron text-xs text-[#00FFFF88]">ms</span>
                  </div>
                  <div className="font-orbitron text-[10px] text-[#00FFFF88] mt-2 tracking-[0.1em]">GLOBAL_AVERAGE_TTL</div>
                </div>

                {/* Node Status */}
                <div className="glass-panel border-l-2 border-l-[#00FFFF] p-4 rounded-lg relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-60" />
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-orbitron text-[10px] font-bold text-[#00FFFF88] tracking-[0.15em]">NODES_ACTIVE</span>
                    <span className="text-[#00FFFF] text-sm">⬡</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-orbitron text-2xl font-bold text-[#00FFFF]">1,402</span>
                  </div>
                  <div className="flex gap-1 mt-3">
                    <div className="h-1 flex-1 rounded-full bg-gradient-to-r from-[#00FFFF] to-[#00FF88]" />
                    <div className="h-1 flex-1 rounded-full bg-gradient-to-r from-[#00FFFF] to-[#00FF88]" />
                    <div className="h-1 flex-1 rounded-full bg-gradient-to-r from-[#00FFFF] to-[#00FF88]" />
                    <div className="h-1 flex-1 rounded-full bg-[#FF3366]" />
                    <div className="h-1 flex-1 rounded-full bg-[#00FFFF22]" />
                  </div>
                </div>
              </div>

              {/* Middle Content */}
              <div className="flex-1 flex gap-6 mt-6 min-h-0 items-stretch">

                {/* Left Column: Node Details */}
                <div className="w-72 flex flex-col gap-4 pointer-events-auto justify-between">
                  <div className="glass-panel p-5 flex-1 overflow-hidden relative rounded-xl">
                    <div className="scan-line" />
                    <h3 className="font-orbitron text-[11px] font-bold text-[#00FFFF] border-b border-[#00FFFF22] pb-3 mb-4 flex items-center gap-2 tracking-[0.15em]">
                      <span className="w-2 h-2 rounded-full bg-[#00FFFF] inline-block" style={{ boxShadow: '0 0 6px #00FFFF' }} />
                      NODE_DETAILS
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="font-orbitron text-[9px] text-[#00FFFF88] tracking-[0.15em] mb-1">IDENTIFIER</div>
                        <div className="font-orbitron text-[12px] text-[#00FFFF]">NX-742-ALPHA</div>
                      </div>
                      <div>
                        <div className="font-orbitron text-[9px] text-[#00FFFF88] tracking-[0.15em] mb-1">COORDINATES</div>
                        <div className="font-orbitron text-[12px] text-[#00FFFF]">34.05°N, 118.24°W</div>
                      </div>
                      <div>
                        <div className="font-orbitron text-[9px] text-[#00FFFF88] tracking-[0.15em] mb-1">LOAD_BALANCING</div>
                        <div className="font-orbitron text-[12px] text-[#00FF88]" style={{ textShadow: '0 0 8px rgba(0,255,136,0.8)' }}>ACTIVE</div>
                      </div>
                      <div className="pt-3 border-t border-[#00FFFF22]">
                        <img alt=" mother board circuitry" className="w-full h-32 object-cover rounded-lg" style={{ filter: 'grayscale(1) brightness(0.4) sepia(1) hue-rotate(150deg)' }} src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOIrlI73RAGW6WaXcD-mQwzmNRVoHWIsMZCD5Oi_hKr6qm5dGOnjZ49PW56tqDJyldrZP55htKDLV6HFQazBUQpmkuBXN9sHI002CTL5mYY5zHJmk2m5MFfi-uF53AuJMGOmcYiP1OuKuDW6HEToW5QnFS31_boo7nB7_u7dIybiY3fR7rxTUWm3pazcJPZR9j8bdcAsrbmWniIzyez_3Euepqh0nny41Q36cnrkZjB8XhMMDfXkYxPNcz1T9k1oopGHNdDXko7ZmP" />
                      </div>
                    </div>
                  </div>

                  <div className="glass-panel p-4 rounded-xl border border-[#FFB80033] relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FFB800] to-transparent opacity-60" />
                    <div className="flex items-center gap-2 font-orbitron text-[11px] font-bold text-[#FFB800] mb-2 tracking-[0.1em]">
                      <span className="w-2 h-2 rounded-full bg-[#FFB800] animate-ping inline-block" style={{ boxShadow: '0 0 6px #FFB800' }} />
                      CRITICAL_ZONE
                    </div>
                    <div className="font-orbitron text-[10px] text-[#FFB80088] leading-relaxed tracking-[0.05em]">
                      Security protocols at 92% efficiency. Potential handshake anomaly detected in Sector 7-G.
                    </div>
                  </div>
                </div>

                {/* Center: View Controls */}
                <div className="flex-1 flex flex-col justify-end">
                  <div className="flex justify-center mb-6 pointer-events-auto">
                    <div className="glass-panel flex p-1 rounded-xl border border-[#00FFFF33]">
                      <button className="px-4 py-2 font-orbitron text-[10px] text-[#000000] bg-gradient-to-r from-[#00FFFF] to-[#00FF88] rounded-lg tracking-[0.1em] font-bold" style={{ boxShadow: '0 0 15px rgba(0,255,255,0.3)' }}>
                        ORBIT_VIEW
                      </button>
                      <button className="px-4 py-2 font-orbitron text-[10px] text-[#00FFFF88] hover:text-[#00FFFF] transition-colors tracking-[0.1em]">
                        NODE_FOCUS
                      </button>
                      <button className="px-4 py-2 font-orbitron text-[10px] text-[#00FFFF88] hover:text-[#00FFFF] transition-colors tracking-[0.1em]">
                        ISOLATE_TRAFFIC
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column: Traffic & Alerts */}
                <div className="w-80 flex flex-col gap-4 pointer-events-auto justify-between">

                  {/* Traffic Log */}
                  <div className="glass-panel flex-1 flex flex-col overflow-hidden rounded-xl">
                    <div className="p-4 border-b border-[#00FFFF22] flex justify-between items-center">
                      <span className="font-orbitron text-[11px] font-bold text-[#00FFFF] tracking-[0.15em]">TRAFFIC_LOG</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#00FF88]" style={{ boxShadow: '0 0 6px #00FF88' }} />
                        <span className="font-orbitron text-[9px] text-[#00FF88] animate-pulse tracking-[0.1em]">LIVE</span>
                      </div>
                    </div>
                    <div ref={logContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                      <div className="flex gap-3">
                        <span className="font-orbitron text-[10px] text-[#00FFFF44]">[14:22:01]</span>
                        <span className="font-orbitron text-[10px] text-[#00FFFF88]">INCOMING: 192.168.1.45 &gt;&gt; SECURED</span>
                      </div>
                      <div className="flex gap-3">
                        <span className="font-orbitron text-[10px] text-[#00FFFF44]">[14:22:04]</span>
                        <span className="font-orbitron text-[10px] text-[#00FFFF88]">HANDSHAKE: NODE_04 &gt;&gt; VERIFIED</span>
                      </div>
                      <div className="flex gap-3">
                        <span className="font-orbitron text-[10px] text-[#00FFFF44]">[14:22:12]</span>
                        <span className="font-orbitron text-[10px] text-[#FF3366]">TIMEOUT: NODE_88 &gt;&gt; RETRYING...</span>
                      </div>
                      <div className="flex gap-3">
                        <span className="font-orbitron text-[10px] text-[#00FFFF44]">[14:22:15]</span>
                        <span className="font-orbitron text-[10px] text-[#00FFFF88]">ENCRYPTION: AES-256 &gt;&gt; STABLE</span>
                      </div>
                      <div className="flex gap-3">
                        <span className="font-orbitron text-[10px] text-[#00FFFF44]">[14:22:19]</span>
                        <span className="font-orbitron text-[10px] text-[#00FFFF88]">DIVERGENCE: LOAD_BALANCE &gt;&gt; RE-ROUTE</span>
                      </div>
                      <div className="flex gap-3">
                        <span className="font-orbitron text-[10px] text-[#00FFFF44]">[14:22:25]</span>
                        <span className="font-orbitron text-[10px] text-[#00FFFF88]">HEARTBEAT: ALL_SYSTEMS &gt;&gt; OK</span>
                      </div>
                      <div className="flex gap-3">
                        <span className="font-orbitron text-[10px] text-[#00FFFF44]">[14:22:31]</span>
                        <span className="font-orbitron text-[10px] text-[#00FFFF88]">INCOMING: 10.0.4.122 &gt;&gt; AUTH_REQ</span>
                      </div>
                    </div>
                  </div>

                  {/* Active Alerts */}
                  <div className="glass-panel h-64 flex flex-col rounded-xl border border-[#FF336633]">
                    <div className="p-4 border-b border-[#FF336622] flex justify-between items-center">
                      <span className="font-orbitron text-[11px] font-bold text-[#FF3366] tracking-[0.15em]">ACTIVE_ALERTS</span>
                      <span className="bg-[#FF336622] border border-[#FF336644] text-[#FF3366] px-2 py-0.5 font-orbitron text-[9px] font-bold rounded-full">
                        2_PENDING
                      </span>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      <div className="p-4 border-b border-[#FF336611] hover:bg-[#FF336611] cursor-pointer group transition-all">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-orbitron text-[10px] font-bold text-[#FF3366] tracking-[0.1em]">MALFORMED_PACKET</span>
                          <span className="font-orbitron text-[9px] text-[#00FFFF88]">2m ago</span>
                        </div>
                        <div className="font-orbitron text-[9px] text-[#FFB80088] group-hover:text-[#FFB800] transition-colors leading-relaxed">
                          Detected repeated malformed TCP header attempts from Port 8080.
                        </div>
                      </div>
                      <div className="p-4 border-b border-[#FF336611] hover:bg-[#FF336611] cursor-pointer group transition-all">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-orbitron text-[10px] font-bold text-[#FF3366] tracking-[0.1em]">THERMAL_THRESHOLD</span>
                          <span className="font-orbitron text-[9px] text-[#00FFFF88]">12m ago</span>
                        </div>
                        <div className="font-orbitron text-[9px] text-[#FFB80088] group-hover:text-[#FFB800] transition-colors leading-relaxed">
                          Node NX-Alpha reporting core temps at 84°C. Fan array engaged.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Status Bar */}
              <div className="mt-6 flex justify-between items-center pointer-events-auto border-t border-[#00FFFF22] pt-4">
                <div className="flex gap-6 items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00FF88]" style={{ boxShadow: '0 0 6px #00FF88' }} />
                    <span className="font-orbitron text-[10px] text-[#00FFFF88] tracking-[0.1em]">NETWORK_THROUGHPUT:</span>
                    <span className="font-orbitron text-[10px] text-[#00FFFF] font-bold">8.42 GB/s</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-orbitron text-[10px] text-[#00FFFF88] tracking-[0.1em]">ACTIVE_SESSIONS:</span>
                    <span className="font-orbitron text-[10px] text-[#00FFFF] font-bold">2,118</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    <img className="w-7 h-7 rounded-full border-2 border-[#00FFFF44]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCK0p7SCtBjhxHaW-Zz7m8WPjYFdIeSgQpCuNsZ8pyH89Xk1IbHkUgY-_OGEG6HWXAquhbR-O-_RrxmdITr4gnDz-81y8ZpdfKCBILiRWV2iZW1ubNYJwBRiDNunpsuDCqiUPeoNgWuSEotkIrlK6YmjbDMl4lQZczqm_zHdrtscgZutynKXuMnJDTQWnCpIBHndQsTxvZXerHR-vii0zRUas61MvXh6ymujVoqLsD2Lqvq236goStBEiT9Ikx7QS2bgrCSk733PVHM" alt="" />
                    <img className="w-7 h-7 rounded-full border-2 border-[#00FFFF44]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBL4mnQPjXCx0HsuSr_HEnf3kKGVFswLUq7JIJkXKO5b1LBQHwGnDrYQ8LBEu3SNTKuhZsQhKNxBTsPiwFlu7H09B_Ty7RGxZJQoM0uHzxV5HumRHYDLoBpJps37SX-3v-Uz1k11vz6OO2wUheGzrcra1SXooUXj7sHhsXS4vwm6NwymBkiFGUX9NjAeHOM02bdJV_vxmFdFktSvUNYG0nCOYc6gSbTrpdf6dSgEeJ7WfVIdyEL6eqN8MJdWS2CLcgp4YoUehoq5a0Q" alt="" />
                    <div className="w-7 h-7 rounded-full border-2 border-[#00FFFF44] bg-[#00FFFF22] flex items-center justify-center font-orbitron text-[8px] font-bold text-[#00FFFF]">+12</div>
                  </div>
                  <span className="font-orbitron text-[10px] text-[#00FFFF88] tracking-[0.1em]">OPERATORS_ONLINE</span>
                </div>
              </div>

            </div>
          </main>
        </div>

        <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000_100%)]" />
      </div>
    </>
  );
}