"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Plane,
  AlertTriangle,
  FileText,
  BarChart3,
  Settings,
  Bell,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const navSections = [
  {
    label: "OVERVIEW",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", active: true },
      { icon: Plane, label: "Live Flights" },
      { icon: AlertTriangle, label: "Incidents" },
    ],
  },
  {
    label: "ANALYTICS",
    items: [
      { icon: BarChart3, label: "Reports" },
      { icon: FileText, label: "Compliance" },
      { icon: Shield, label: "Risk Matrix" },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      { icon: Bell, label: "Notifications" },
      { icon: Settings, label: "Settings" },
    ],
  },
]

export function SidebarNav() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex flex-col h-screen border-r border-sidebar-border bg-sidebar transition-all duration-300",
          collapsed ? "w-16" : "w-60"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
            <Shield className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-sidebar-accent-foreground tracking-wide">
                SkyGuard
              </span>
              <span className="text-[10px] text-sidebar-foreground uppercase tracking-widest">
                Flight Safety
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {navSections.map((section) => (
            <div key={section.label} className="mb-6">
              {!collapsed && (
                <p className="px-3 mb-2 text-[10px] font-semibold text-sidebar-foreground uppercase tracking-widest">
                  {section.label}
                </p>
              )}
              <ul className="flex flex-col gap-0.5">
                {section.items.map((item) => {
                  const button = (
                    <li key={item.label}>
                      <button
                        className={cn(
                          "flex items-center gap-3 w-full rounded-md px-3 py-2 text-sm transition-colors",
                          item.active
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                      >
                        <item.icon className="w-4 h-4 shrink-0" />
                        {!collapsed && <span>{item.label}</span>}
                      </button>
                    </li>
                  )

                  if (collapsed) {
                    return (
                      <Tooltip key={item.label}>
                        <TooltipTrigger asChild>{button}</TooltipTrigger>
                        <TooltipContent side="right" className="text-xs">
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    )
                  }

                  return button
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Collapse toggle */}
        <div className="border-t border-sidebar-border p-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-full rounded-md py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </aside>
    </TooltipProvider>
  )
}
