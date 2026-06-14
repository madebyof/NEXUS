"use client";

import { useState, useEffect } from "react";
import Dashboard from "@/components/dashboard";
import VisualizationArea from "@/components/VisualizationArea";

export default function Page() {
  const [totalFlights, setTotalFlights] = useState(1247);
  const [activeAlerts, setActiveAlerts] = useState(3);
  const [safetyScore, setSafetyScore] = useState(98.7);

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalFlights((prev) => prev + Math.floor(Math.random() * 10) - 5);
      setActiveAlerts(Math.floor(Math.random() * 5));
      setSafetyScore(Math.max(95, Math.min(99.9, 98 + Math.random() * 1.5)));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Dashboard.DashboardLayout>
      <Dashboard.DashboardCards
        totalFlights={totalFlights}
        activeAlerts={activeAlerts}
        safetyScore={Number(safetyScore.toFixed(1))}
      />
      <VisualizationArea />
    </Dashboard.DashboardLayout>
  );
}
