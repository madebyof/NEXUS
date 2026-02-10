"use client"

import React from "react"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Maximize2, Layers, RotateCcw } from "lucide-react"

interface Flight {
  id: string
  callsign: string
  x: number
  y: number
  angle: number
  speed: number
  status: "normal" | "warning" | "critical"
  altitude: number
  origin: string
  destination: string
}

function generateFlights(): Flight[] {
  const statuses: Flight["status"][] = ["normal", "normal", "normal", "normal", "normal", "warning", "critical"]
  const routes = [
    { origin: "JFK", destination: "LAX" },
    { origin: "LHR", destination: "CDG" },
    { origin: "SFO", destination: "ORD" },
    { origin: "NRT", destination: "SIN" },
    { origin: "DXB", destination: "FRA" },
    { origin: "SYD", destination: "HND" },
    { origin: "ATL", destination: "DFW" },
    { origin: "PEK", destination: "ICN" },
    { origin: "MIA", destination: "EWR" },
    { origin: "YYZ", destination: "MEX" },
    { origin: "AMS", destination: "IST" },
    { origin: "BKK", destination: "HKG" },
    { origin: "SEA", destination: "DEN" },
    { origin: "FCO", destination: "MAD" },
    { origin: "GRU", destination: "BOG" },
  ]

  return routes.map((route, i) => ({
    id: `FL${(1000 + i).toString()}`,
    callsign: `${route.origin}${(100 + i * 7).toString()}`,
    x: 0.08 + Math.random() * 0.84,
    y: 0.1 + Math.random() * 0.8,
    angle: Math.random() * 360,
    speed: 400 + Math.random() * 200,
    status: statuses[i % statuses.length],
    altitude: 25000 + Math.floor(Math.random() * 16000),
    origin: route.origin,
    destination: route.destination,
  }))
}

export function FlightMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [flights] = useState<Flight[]>(generateFlights)
  const [hoveredFlight, setHoveredFlight] = useState<Flight | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const flightPositions = useRef<Flight[]>(flights)
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    function resize() {
      if (!canvas || !container) return
      const dpr = window.devicePixelRatio || 1
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener("resize", resize)

    // World map path data (simplified continents)
    function drawMap(w: number, h: number) {
      if (!ctx) return
      ctx.clearRect(0, 0, w, h)

      // Background
      ctx.fillStyle = "hsl(220, 20%, 7%)"
      ctx.fillRect(0, 0, w, h)

      // Grid
      ctx.strokeStyle = "hsl(220, 14%, 12%)"
      ctx.lineWidth = 0.5

      const gridSpacingX = w / 18
      const gridSpacingY = h / 9

      for (let i = 1; i < 18; i++) {
        ctx.beginPath()
        ctx.moveTo(i * gridSpacingX, 0)
        ctx.lineTo(i * gridSpacingX, h)
        ctx.stroke()
      }
      for (let i = 1; i < 9; i++) {
        ctx.beginPath()
        ctx.moveTo(0, i * gridSpacingY)
        ctx.lineTo(w, i * gridSpacingY)
        ctx.stroke()
      }

      // Simplified continent outlines
      ctx.fillStyle = "hsl(220, 14%, 14%)"
      ctx.strokeStyle = "hsl(220, 14%, 22%)"
      ctx.lineWidth = 1

      // North America
      ctx.beginPath()
      ctx.moveTo(w * 0.08, h * 0.18)
      ctx.lineTo(w * 0.18, h * 0.12)
      ctx.lineTo(w * 0.24, h * 0.15)
      ctx.lineTo(w * 0.22, h * 0.28)
      ctx.lineTo(w * 0.27, h * 0.3)
      ctx.lineTo(w * 0.26, h * 0.4)
      ctx.lineTo(w * 0.2, h * 0.42)
      ctx.lineTo(w * 0.18, h * 0.48)
      ctx.lineTo(w * 0.15, h * 0.45)
      ctx.lineTo(w * 0.1, h * 0.35)
      ctx.lineTo(w * 0.06, h * 0.26)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      // South America
      ctx.beginPath()
      ctx.moveTo(w * 0.2, h * 0.52)
      ctx.lineTo(w * 0.25, h * 0.5)
      ctx.lineTo(w * 0.28, h * 0.55)
      ctx.lineTo(w * 0.3, h * 0.65)
      ctx.lineTo(w * 0.27, h * 0.78)
      ctx.lineTo(w * 0.24, h * 0.85)
      ctx.lineTo(w * 0.22, h * 0.82)
      ctx.lineTo(w * 0.19, h * 0.7)
      ctx.lineTo(w * 0.18, h * 0.58)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      // Europe
      ctx.beginPath()
      ctx.moveTo(w * 0.42, h * 0.14)
      ctx.lineTo(w * 0.48, h * 0.12)
      ctx.lineTo(w * 0.52, h * 0.16)
      ctx.lineTo(w * 0.53, h * 0.24)
      ctx.lineTo(w * 0.5, h * 0.3)
      ctx.lineTo(w * 0.46, h * 0.28)
      ctx.lineTo(w * 0.43, h * 0.22)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      // Africa
      ctx.beginPath()
      ctx.moveTo(w * 0.44, h * 0.35)
      ctx.lineTo(w * 0.52, h * 0.33)
      ctx.lineTo(w * 0.56, h * 0.4)
      ctx.lineTo(w * 0.57, h * 0.55)
      ctx.lineTo(w * 0.54, h * 0.68)
      ctx.lineTo(w * 0.5, h * 0.72)
      ctx.lineTo(w * 0.46, h * 0.65)
      ctx.lineTo(w * 0.43, h * 0.5)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      // Asia
      ctx.beginPath()
      ctx.moveTo(w * 0.55, h * 0.1)
      ctx.lineTo(w * 0.65, h * 0.08)
      ctx.lineTo(w * 0.78, h * 0.12)
      ctx.lineTo(w * 0.82, h * 0.2)
      ctx.lineTo(w * 0.8, h * 0.32)
      ctx.lineTo(w * 0.75, h * 0.4)
      ctx.lineTo(w * 0.68, h * 0.38)
      ctx.lineTo(w * 0.6, h * 0.35)
      ctx.lineTo(w * 0.56, h * 0.28)
      ctx.lineTo(w * 0.54, h * 0.18)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      // Australia
      ctx.beginPath()
      ctx.moveTo(w * 0.78, h * 0.6)
      ctx.lineTo(w * 0.88, h * 0.58)
      ctx.lineTo(w * 0.9, h * 0.65)
      ctx.lineTo(w * 0.87, h * 0.72)
      ctx.lineTo(w * 0.82, h * 0.73)
      ctx.lineTo(w * 0.78, h * 0.68)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
    }

    function drawFlights(w: number, h: number, time: number) {
      if (!ctx) return
      const currentFlights = flightPositions.current

      currentFlights.forEach((flight) => {
        const x = flight.x * w
        const y = flight.y * h

        // Pulsing glow for critical/warning
        if (flight.status === "critical" || flight.status === "warning") {
          const pulse = 0.4 + Math.sin(time * 0.004) * 0.3
          const glowColor =
            flight.status === "critical"
              ? `hsla(0, 72%, 51%, ${pulse})`
              : `hsla(38, 92%, 50%, ${pulse})`
          ctx.beginPath()
          ctx.arc(x, y, 12, 0, Math.PI * 2)
          ctx.fillStyle = glowColor
          ctx.fill()
        }

        // Flight icon (triangle pointing in direction)
        const angleRad = (flight.angle * Math.PI) / 180
        const size = 6
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(angleRad)

        ctx.beginPath()
        ctx.moveTo(0, -size)
        ctx.lineTo(-size * 0.6, size * 0.6)
        ctx.lineTo(0, size * 0.3)
        ctx.lineTo(size * 0.6, size * 0.6)
        ctx.closePath()

        ctx.fillStyle =
          flight.status === "critical"
            ? "hsl(0, 72%, 51%)"
            : flight.status === "warning"
              ? "hsl(38, 92%, 50%)"
              : "hsl(199, 89%, 48%)"
        ctx.fill()

        ctx.restore()

        // Callsign label
        ctx.font = "9px system-ui, sans-serif"
        ctx.fillStyle =
          flight.status === "critical"
            ? "hsl(0, 72%, 70%)"
            : flight.status === "warning"
              ? "hsl(38, 92%, 70%)"
              : "hsl(215, 15%, 55%)"
        ctx.textAlign = "left"
        ctx.fillText(flight.callsign, x + 10, y + 3)
      })
    }

    let lastTime = 0
    function animate(time: number) {
      if (!canvas || !container) return
      const rect = container.getBoundingClientRect()
      const w = rect.width
      const h = rect.height
      const dt = (time - lastTime) / 1000
      lastTime = time

      // Slowly move flights
      flightPositions.current = flightPositions.current.map((f) => {
        const rad = (f.angle * Math.PI) / 180
        let nx = f.x + Math.sin(rad) * 0.003 * dt
        let ny = f.y - Math.cos(rad) * 0.003 * dt

        // Wrap around
        if (nx < 0) nx = 1
        if (nx > 1) nx = 0
        if (ny < 0) ny = 1
        if (ny > 1) ny = 0

        return { ...f, x: nx, y: ny }
      })

      drawMap(w, h)
      drawFlights(w, h, time)
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const rect = container.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    const w = rect.width
    const h = rect.height

    let found: Flight | null = null
    for (const flight of flightPositions.current) {
      const fx = flight.x * w
      const fy = flight.y * h
      const dist = Math.sqrt((mx - fx) ** 2 + (my - fy) ** 2)
      if (dist < 18) {
        found = flight
        break
      }
    }

    setHoveredFlight(found)
    if (found) {
      setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }
  }

  return (
    <Card className="flex-1 border-border bg-card overflow-hidden relative">
      <CardHeader className="flex flex-row items-center justify-between py-3 px-5 border-b border-border">
        <div className="flex items-center gap-3">
          <CardTitle className="text-sm font-medium text-card-foreground">
            Global Flight Tracker
          </CardTitle>
          <Badge variant="outline" className="text-[10px] border-border text-muted-foreground font-mono">
            LIVE
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-md text-muted-foreground hover:text-card-foreground hover:bg-secondary transition-colors" aria-label="Reset view">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 rounded-md text-muted-foreground hover:text-card-foreground hover:bg-secondary transition-colors" aria-label="Toggle layers">
            <Layers className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 rounded-md text-muted-foreground hover:text-card-foreground hover:bg-secondary transition-colors" aria-label="Fullscreen">
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-0 relative" ref={containerRef}>
        <canvas
          ref={canvasRef}
          className="w-full h-[500px] cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredFlight(null)}
        />
        {hoveredFlight && (
          <div
            className="absolute pointer-events-none z-20 bg-popover border border-border rounded-lg p-3 shadow-xl"
            style={{
              left: tooltipPos.x + 16,
              top: tooltipPos.y - 10,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-card-foreground">
                {hoveredFlight.callsign}
              </span>
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  hoveredFlight.status === "critical"
                    ? "bg-destructive"
                    : hoveredFlight.status === "warning"
                      ? "bg-[hsl(38,92%,50%)]"
                      : "bg-accent"
                }`}
              />
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
              <span className="text-muted-foreground">Route</span>
              <span className="text-card-foreground font-mono">
                {hoveredFlight.origin} → {hoveredFlight.destination}
              </span>
              <span className="text-muted-foreground">Altitude</span>
              <span className="text-card-foreground font-mono">
                {hoveredFlight.altitude.toLocaleString()} ft
              </span>
              <span className="text-muted-foreground">Speed</span>
              <span className="text-card-foreground font-mono">
                {Math.round(hoveredFlight.speed)} kts
              </span>
              <span className="text-muted-foreground">Status</span>
              <span
                className={`font-medium capitalize ${
                  hoveredFlight.status === "critical"
                    ? "text-destructive"
                    : hoveredFlight.status === "warning"
                      ? "text-[hsl(38,92%,50%)]"
                      : "text-accent"
                }`}
              >
                {hoveredFlight.status}
              </span>
            </div>
          </div>
        )}

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-popover/90 border border-border rounded-lg p-3 backdrop-blur-sm">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Status
          </p>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[hsl(199,89%,48%)]" />
              <span className="text-[10px] text-card-foreground">Normal</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[hsl(38,92%,50%)]" />
              <span className="text-[10px] text-card-foreground">Warning</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-destructive" />
              <span className="text-[10px] text-card-foreground">Critical</span>
            </div>
          </div>
        </div>

        {/* Flight count */}
        <div className="absolute bottom-4 right-4 bg-popover/90 border border-border rounded-lg px-3 py-2 backdrop-blur-sm">
          <p className="text-[10px] text-muted-foreground">Tracking</p>
          <p className="text-sm font-semibold text-card-foreground font-mono">
            {flights.length} flights
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
