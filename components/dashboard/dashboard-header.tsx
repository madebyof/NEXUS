"use client"

import { Bell, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function DashboardHeader() {
  return (
    <header className="flex items-center justify-between h-14 px-6 border-b border-border bg-card">
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-semibold text-foreground">Dashboard</h1>
        <Badge variant="outline" className="text-[10px] border-accent/30 text-accent font-mono gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          System Operational
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden md:flex">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search flights, incidents..."
            className="w-64 h-8 pl-8 pr-3 bg-secondary border border-border rounded-md text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors" aria-label="Notifications">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
        </button>

        {/* User avatar */}
        <button className="flex items-center gap-2 pl-2" aria-label="User menu">
          <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
            <span className="text-[10px] font-semibold text-primary">OC</span>
          </div>
        </button>
      </div>
    </header>
  )
}
