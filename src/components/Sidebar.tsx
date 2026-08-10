"use client";

import React, { Dispatch, SetStateAction } from 'react';
import { LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  pulsePhase?: number;
  onClose?: () => void;
  collapsed?: boolean;
  setCollapsed?: Dispatch<SetStateAction<boolean>>;
}

export default function Sidebar ({ 
  pulsePhase = 0, 
  onClose, 
  collapsed = false, 
  setCollapsed 
}: SidebarProps) {
  const navItems = [
    { name: "OVERVIEW", link: "/dashboard" },
    { name: "LIVE GRID", link: "/live" },
    { name: "NEURAL SCAN", link: "/scan" },
    { name: "QUANTUM ALERTS", link: "/alerts" },
    { name: "PREDICTIVE", link: "/predictive" },
    { name: "WEATHER FLUX", link: "/weather" },
    { name: "DATA STREAMS", link: "/streams" },
    { name: "SYSTEM CORE", link: "/core" },
  ];

  return (
    <div className={`relative left-0 top-0 bottom-0 ${collapsed ? 'w-[80px]' : 'w-[320px]'} backdrop-blur-xl bg-gradient-to-br from-[#000000CC] via-[#0A0A1ECC] to-[#000000CC] border-r-[1px] border-[#00FFFF33] transition-all duration-300 overflow-hidden max-sm:w-[280px] shrink-0 z-30`}>
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-repeat-y" style={{backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #00FFFF 2px, #00FFFF 4px)"}} />
      </div>

      <div className="relative h-full flex flex-col justify-between">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-[#00FFFF33] flex items-center justify-between">
          <div className="flex items-center gap-4 overflow-hidden">
            <div className="relative w-10 h-10 shrink-0">
              <div
                className="absolute inset-0 bg-gradient-to-br from-[#00FFFF] to-[#FF00FF] rounded-full animate-spin"
                style={{ animationDuration: "3s" }}
              />
              <div className="absolute inset-[2px] bg-[#000000] rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-[#00FFFF]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
                </svg>
              </div>
            </div>
            {!collapsed && (
              <div className="flex-1 whitespace-nowrap">
                <h1 className="text-[18px] font-bold bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] bg-clip-text text-transparent">
                  NEXUS
                </h1>
                <p className="text-[10px] text-[#00FFFF88] tracking-[0.2em]">NEURAL NETWORK</p>
              </div>
            )}
          </div>

          {/* Toggle Collapse Button */}
          {setCollapsed && (
            <button 
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg border border-[#00FFFF33] text-[#00FFFF88] hover:text-[#00FFFF] hover:bg-[#00FFFF11] transition-all cursor-pointer"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {navItems.map((item, index) => (
            <a
              key={index}
              href={item.link}
              title={collapsed ? item.name : undefined}
              className={`block px-3 py-3 rounded-lg text-[12px] text-[#00FFFF88] hover:text-[#00FFFF] hover:bg-[#00FFFF11] transition-all cursor-pointer font-semibold tracking-[0.1em] ${collapsed ? 'text-center' : ''}`}
            >
              {collapsed ? item.name.substring(0, 3) : item.name}
            </a>
          ))}
        </div>

        {/* User Profile */}
        <div className="p-3 border-t border-[#00FFFF33]">
          <div className="relative p-3 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00FFFF22] to-[#FF00FF22]" />
            <div className="absolute inset-0 backdrop-blur-sm" />
            <div className="relative flex items-center gap-3">
              <div className="relative w-10 h-10 shrink-0">
                <div
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-[#00FFFF] to-[#FF00FF]"
                  style={{ opacity: 0.3 + Math.sin(pulsePhase) * 0.2 }}
                />
                <div className="absolute inset-[2px] rounded-full bg-[#000000] flex items-center justify-center text-[12px] font-bold text-[#00FFFF]">
                  OF
                </div>
              </div>
              {!collapsed && (
                <div className="flex-1 overflow-hidden whitespace-nowrap">
                  <p className="text-[12px] font-semibold text-[#00FFFF] truncate">Odalric FASSINOU</p>
                  <p className="text-[9px] text-[#00FFFF88] tracking-[0.15em]">CHIEF OPERATOR</p>
                </div>
              )}
              {!collapsed && (
                <div className="w-8 h-8 rounded-full border-2 border-[#00FFFF] flex items-center justify-center cursor-pointer hover:bg-[#00FFFF22] transition-all shrink-0">
                  <LogOut className="w-4 h-4 text-[#00FFFF]" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}