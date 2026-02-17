import { useState, useEffect } from "react";
import { Bell, ChevronRight, LogOut } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [pulsePhase, setPulsePhase] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [activeAlerts, setActiveAlerts] = useState(3);

  // Update animations
  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase((prev) => (prev + 0.05) % (Math.PI * 2));
      setRotationAngle((prev) => (prev + 0.3) % 360);
      setActiveAlerts(Math.floor(Math.random() * 5));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const navItems = [
    "OVERVIEW",
    "LIVE GRID",
    "NEURAL SCAN",
    "QUANTUM ALERTS",
    "PREDICTIVE",
    "WEATHER FLUX",
    "DATA STREAMS",
    "SYSTEM CORE",
  ];

  return (
    <div className="relative h-screen w-screen bg-[#000000] font-orbitron overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full">
          <defs>
            <radialGradient id="cosmicGlow" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#FF00FF" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#00FFFF" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
            <pattern
              id="hexGrid"
              x="0"
              y="0"
              width="60"
              height="52"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M30 0 L60 15 L60 37 L30 52 L0 37 L0 15 Z"
                fill="none"
                stroke="#00FFFF"
                strokeWidth="0.5"
                opacity="0.2"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexGrid)" />
          <circle cx="50%" cy="50%" r="40%" fill="url(#cosmicGlow)" />
        </svg>
      </div>

      {/* Top Border Glow */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent"
        style={{ opacity: 0.5 + Math.sin(pulsePhase) * 0.3 }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF00FF] to-transparent"
        style={{ opacity: 0.5 + Math.cos(pulsePhase) * 0.3 }}
      />
      <div
        className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#00FF88] to-transparent"
        style={{ opacity: 0.5 + Math.sin(pulsePhase * 1.3) * 0.3 }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#FFB800] to-transparent"
        style={{ opacity: 0.5 + Math.cos(pulsePhase * 1.3) * 0.3 }}
      />

      {/* Sidebar */}
      {!sidebarCollapsed && (
        <div className="absolute left-0 top-0 bottom-0 w-[320px] backdrop-blur-xl bg-gradient-to-br from-[#000000CC] via-[#0A0A1ECC] to-[#000000CC] border-r-[1px] border-[#00FFFF33] transition-all duration-500 overflow-hidden max-sm:w-[280px]">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-repeat-y" style={{backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #00FFFF 2px, #00FFFF 4px)"}} />
          </div>

          <div className="relative h-full flex flex-col">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-[#00FFFF33]">
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14">
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-[#00FFFF] to-[#FF00FF] rounded-full animate-spin"
                    style={{ animationDuration: "3s" }}
                  />
                  <div className="absolute inset-[2px] bg-[#000000] rounded-full flex items-center justify-center">
                    <svg
                      className="w-7 h-7 text-[#00FFFF]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="text-[20px] font-bold bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] bg-clip-text text-transparent">
                    NEXUS
                  </h1>
                  <p className="text-[11px] text-[#00FFFF88] tracking-[0.2em]">
                    COMMAND MATRIX
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {navItems.map((item, index) => (
                <div
                  key={index}
                  className="px-4 py-3 rounded-lg text-[12px] text-[#00FFFF88] hover:text-[#00FFFF] hover:bg-[#00FFFF11] transition-all cursor-pointer font-semibold tracking-[0.1em]"
                >
                  {item}
                </div>
              ))}
            </div>

            {/* User Profile */}
            <div className="p-4 border-t border-[#00FFFF33]">
              <div className="relative p-4 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00FFFF22] to-[#FF00FF22]" />
                <div className="absolute inset-0 backdrop-blur-sm" />
                <div className="relative flex items-center gap-3">
                  <div className="relative w-12 h-12">
                    <div
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-[#00FFFF] to-[#FF00FF]"
                      style={{
                        opacity: 0.3 + Math.sin(pulsePhase) * 0.2,
                      }}
                    />
                    <div className="absolute inset-[2px] rounded-full bg-[#000000] flex items-center justify-center text-[14px] font-bold text-[#00FFFF]">
                      OF
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold text-[#00FFFF]">
                      Odalric FASSINOU
                      <br />
                      <br />
                    </p>
                    <p className="text-[10px] text-[#00FFFF88] tracking-[0.15em]">
                      CHIEF OPERATOR
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-[#00FFFF] flex items-center justify-center cursor-pointer hover:bg-[#00FFFF22] transition-all">
                    <LogOut className="w-4 h-4 text-[#00FFFF]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Sidebar Button */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="absolute top-1/2 z-50 w-8 h-16 bg-gradient-to-r from-[#00FFFF22] to-transparent border-y border-r border-[#00FFFF44] rounded-r-lg flex items-center justify-center cursor-pointer hover:from-[#00FFFF44] transition-all transform -translate-y-1/2"
        style={{
          left: sidebarCollapsed ? "0px" : "320px",
        }}
      >
        <ChevronRight
          className="w-4 h-4 text-[#00FFFF] transition-transform duration-300"
          style={{
            transform: sidebarCollapsed ? "rotate(0deg)" : "rotate(180deg)",
          }}
        />
      </button>

      {/* Top Header */}
      <div
        className="absolute top-0 right-0 h-[80px] backdrop-blur-xl bg-gradient-to-b from-[#000000DD] to-transparent border-b border-[#00FFFF22] z-40 flex items-center justify-between px-8 max-sm:px-4"
        style={{
          left: sidebarCollapsed ? "0px" : "320px",
        }}
      >
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div
              className="w-2 h-2 rounded-full bg-[#00FF88]"
              style={{
                boxShadow: "0 0 10px #00FF88",
              }}
            />
            <div>
              <h2 className="text-[18px] font-bold text-[#00FFFF] tracking-[0.1em]">
                FLIGHT NEXUS
              </h2>
              <p className="text-[10px] text-[#00FFFF88] tracking-[0.2em]">
                REAL-TIME QUANTUM MONITORING
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#00FFFF44] bg-[#00000088]">
            <div
              className="w-2 h-2 rounded-full bg-[#00FF88]"
              style={{
                boxShadow: "0 0 8px #00FF88",
              }}
            />
            <span className="text-[11px] text-[#00FFFF] font-semibold tracking-[0.1em]">
              LIVE
            </span>
          </div>

          <div className="relative">
            <button className="w-10 h-10 rounded-full border border-[#00FFFF44] bg-[#00000088] flex items-center justify-center hover:bg-[#00FFFF22] transition-all">
              <Bell className="w-5 h-5 text-[#00FFFF]" />
              {activeAlerts > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FF3366] border-2 border-[#000000] flex items-center justify-center text-[9px] font-bold text-white">
                  {activeAlerts}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className="absolute top-[80px] bottom-0 left-0 right-0 p-6 overflow-y-auto max-sm:p-4 transition-all duration-500"
        style={{
          left: sidebarCollapsed ? "0px" : "320px",
        }}
      >
        {children}
      </div>
    </div>
  );
}
