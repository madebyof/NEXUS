"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle2, Info, Clock } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "critical" as const,
    title: "Turbulence Alert - FL1006",
    description: "Severe turbulence reported at FL350 over North Atlantic",
    time: "2 min ago",
    icon: AlertTriangle,
  },
  {
    id: 2,
    type: "resolved" as const,
    title: "Weather Advisory Cleared",
    description: "SIGMET for thunderstorm activity over KJFK resolved",
    time: "18 min ago",
    icon: CheckCircle2,
  },
  {
    id: 3,
    type: "info" as const,
    title: "NOTAM Update - EGLL",
    description: "Runway 09L/27R maintenance scheduled 0200-0600Z",
    time: "34 min ago",
    icon: Info,
  },
  {
    id: 4,
    type: "warning" as const,
    title: "Fuel Monitoring - FL1003",
    description: "Below optimal fuel reserve threshold en route SFO-ORD",
    time: "1 hr ago",
    icon: Clock,
  },
  {
    id: 5,
    type: "resolved" as const,
    title: "ATC Handoff Complete",
    description: "FL1009 successfully transferred to Tokyo Control",
    time: "1 hr ago",
    icon: CheckCircle2,
  },
]

const typeStyles = {
  critical: {
    badge: "bg-destructive/10 text-destructive border-destructive/20",
    icon: "text-destructive",
    label: "Critical",
  },
  warning: {
    badge: "bg-[hsl(38,92%,50%)]/10 text-[hsl(38,92%,50%)] border-[hsl(38,92%,50%)]/20",
    icon: "text-[hsl(38,92%,50%)]",
    label: "Warning",
  },
  resolved: {
    badge: "bg-accent/10 text-accent border-accent/20",
    icon: "text-accent",
    label: "Resolved",
  },
  info: {
    badge: "bg-primary/10 text-primary border-primary/20",
    icon: "text-primary",
    label: "Info",
  },
}

export function ActivityFeed() {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="py-3 px-5 border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-card-foreground">
            Recent Activity
          </CardTitle>
          <button className="text-xs text-primary hover:underline">
            View all
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-border">
          {activities.map((activity) => {
            const style = typeStyles[activity.type]
            return (
              <li
                key={activity.id}
                className="flex items-start gap-3 px-5 py-3.5 hover:bg-secondary/50 transition-colors"
              >
                <activity.icon className={`w-4 h-4 mt-0.5 shrink-0 ${style.icon}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-xs font-medium text-card-foreground truncate">
                      {activity.title}
                    </p>
                    <Badge
                      variant="outline"
                      className={`text-[9px] px-1.5 py-0 h-4 shrink-0 ${style.badge}`}
                    >
                      {style.label}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {activity.description}
                  </p>
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap mt-0.5">
                  {activity.time}
                </span>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
