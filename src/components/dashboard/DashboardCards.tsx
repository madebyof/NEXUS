import { Activity, AlertTriangle, Shield } from "lucide-react";

interface DashboardCardsProps {
  totalFlights: number;
  activeAlerts: number;
  safetyScore: number;
}

export default function DashboardCards({
  totalFlights,
  activeAlerts,
  safetyScore,
}: DashboardCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-6 mb-6 max-lg:grid-cols-2 max-sm:grid-cols-1 max-sm:gap-4">
      {/* Active Flights Card */}
      <div className="relative group cursor-pointer">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00FFFF] to-[#0088FF] rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur-xl" />
        <div className="relative backdrop-blur-xl bg-gradient-to-br from-[#00FFFF11] to-[#0088FF11] rounded-2xl p-6 border border-[#00FFFF44] overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FFFF] opacity-5 rounded-full blur-3xl" />
          <div className="relative flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#00FFFF22"
                    strokeWidth="2"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#00FFFF"
                    strokeWidth="2"
                    strokeDasharray="283"
                    strokeDashoffset={283 - (283 * 0.78)}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Activity className="w-7 h-7 text-[#00FFFF]" />
                </div>
              </div>
              <div>
                <p className="text-[11px] text-[#00FFFF88] font-semibold tracking-[0.15em] mb-1">
                  ACTIVE FLIGHTS
                </p>
                <h3 className="text-[32px] font-bold bg-gradient-to-r from-[#00FFFF] to-[#0088FF] bg-clip-text text-transparent">
                  {totalFlights}
                </h3>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full bg-[#00FF8822] border border-[#00FF8844]">
              <span className="text-[11px] font-bold text-[#00FF88]">+2.4%</span>
            </div>
          </div>
          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-2 rounded-full bg-[#00000088] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00FFFF] to-[#0088FF] rounded-full relative"
                style={{ width: "78%" }}
              >
                <div className="absolute inset-0 bg-white opacity-30 animate-pulse" />
              </div>
            </div>
            <span className="text-[11px] text-[#00FFFF] font-bold">78%</span>
          </div>
        </div>
      </div>

      {/* Safety Alerts Card */}
      <div className="relative group cursor-pointer">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFB800] to-[#FF6600] rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur-xl" />
        <div className="relative backdrop-blur-xl bg-gradient-to-br from-[#FFB80011] to-[#FF660011] rounded-2xl p-6 border border-[#FFB80044] overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFB800] opacity-5 rounded-full blur-3xl" />
          <div className="relative flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 rounded-full border-2 border-[#FFB800] animate-ping opacity-30" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FFB800] to-[#FF6600] opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <AlertTriangle className="w-7 h-7 text-[#FFB800]" />
                </div>
              </div>
              <div>
                <p className="text-[11px] text-[#FFB80088] font-semibold tracking-[0.15em] mb-1">
                  SAFETY ALERTS
                </p>
                <h3 className="text-[32px] font-bold bg-gradient-to-r from-[#FFB800] to-[#FF6600] bg-clip-text text-transparent">
                  {activeAlerts}
                </h3>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full bg-[#FF336622] border border-[#FF336644]">
              <span className="text-[11px] font-bold text-[#FF3366]">-12%</span>
            </div>
          </div>
          <div className="relative space-y-2">
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#00000044]">
              <span className="text-[11px] text-[#FFB80088] tracking-[0.1em]">
                CRITICAL
              </span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1 rounded-full bg-[#00000088] overflow-hidden">
                  <div
                    className="h-full bg-[#FF3366] rounded-full"
                    style={{ width: "33%" }}
                  />
                </div>
                <span className="text-[11px] text-[#FF3366] font-bold">1</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#00000044]">
              <span className="text-[11px] text-[#FFB80088] tracking-[0.1em]">
                WARNING
              </span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1 rounded-full bg-[#00000088] overflow-hidden">
                  <div
                    className="h-full bg-[#FFB800] rounded-full"
                    style={{ width: Math.max(33, (activeAlerts - 1) * 33) + "%" }}
                  />
                </div>
                <span className="text-[11px] text-[#FFB800] font-bold">
                  {Math.max(0, activeAlerts - 1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Score Card */}
      <div className="relative group cursor-pointer max-lg:col-span-2 max-sm:col-span-1">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00FF88] to-[#00FFAA] rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur-xl" />
        <div className="relative backdrop-blur-xl bg-gradient-to-br from-[#00FF8811] to-[#00FFAA11] rounded-2xl p-6 border border-[#00FF8844] overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FF88] opacity-5 rounded-full blur-3xl" />
          <div className="relative flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14">
                <svg
                  className="absolute inset-0 w-full h-full -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#00FF8822"
                    strokeWidth="3"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#00FF88"
                    strokeWidth="3"
                    strokeDasharray="283"
                    strokeDashoffset={283 - (283 * safetyScore) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shield className="w-7 h-7 text-[#00FF88]" />
                </div>
              </div>
              <div>
                <p className="text-[11px] text-[#00FF8888] font-semibold tracking-[0.15em] mb-1">
                  SAFETY SCORE
                </p>
                <h3 className="text-[32px] font-bold bg-gradient-to-r from-[#00FF88] to-[#00FFAA] bg-clip-text text-transparent">
                  {safetyScore}%
                </h3>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full bg-[#00FF8822] border border-[#00FF8844]">
              <span className="text-[11px] font-bold text-[#00FF88]">+0.3%</span>
            </div>
          </div>
          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-2 rounded-full bg-[#00000088] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00FF88] to-[#00FFAA] rounded-full relative"
                style={{ width: safetyScore + "%" }}
              >
                <div className="absolute inset-0 bg-white opacity-30 animate-pulse" />
              </div>
            </div>
            <span className="text-[11px] text-[#00FF88] font-bold tracking-[0.1em]">
              OPTIMAL
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
