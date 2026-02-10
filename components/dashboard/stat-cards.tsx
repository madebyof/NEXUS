"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Plane, ShieldCheck, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

const stats = [
  {
    title: "Active Flights",
    value: "1,284",
    change: "+12",
    changeLabel: "from last hour",
    trend: "up" as const,
    icon: Plane,
    iconColor: "text-[hsl(199,89%,48%)]",
    iconBg: "bg-[hsl(199,89%,48%)]/10",
  },
  {
    title: "Safety Score",
    value: "98.7%",
    change: "+0.3%",
    changeLabel: "from yesterday",
    trend: "up" as const,
    icon: ShieldCheck,
    iconColor: "text-[hsl(152,69%,45%)]",
    iconBg: "bg-[hsl(152,69%,45%)]/10",
  },
  {
    title: "Open Incidents",
    value: "3",
    change: "-2",
    changeLabel: "from yesterday",
    trend: "down" as const,
    icon: AlertTriangle,
    iconColor: "text-[hsl(38,92%,50%)]",
    iconBg: "bg-[hsl(38,92%,50%)]/10",
  },
]

export function StatCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-border bg-card">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {stat.title}
                </p>
                <p className="text-2xl font-semibold text-card-foreground font-mono tracking-tight">
                  {stat.value}
                </p>
              </div>
              <div className={cn("flex items-center justify-center w-10 h-10 rounded-lg", stat.iconBg)}>
                <stat.icon className={cn("w-5 h-5", stat.iconColor)} />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3">
              {stat.trend === "up" ? (
                <TrendingUp className="w-3.5 h-3.5 text-[hsl(152,69%,45%)]" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-[hsl(152,69%,45%)]" />
              )}
              <span className="text-xs font-medium text-[hsl(152,69%,45%)]">
                {stat.change}
              </span>
              <span className="text-xs text-muted-foreground">
                {stat.changeLabel}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
