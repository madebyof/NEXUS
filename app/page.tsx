import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatCards } from "@/components/dashboard/stat-cards"
import { FlightMap } from "@/components/dashboard/flight-map"
import { ActivityFeed } from "@/components/dashboard/activity-feed"

export default function DashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <SidebarNav />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col gap-5">
            {/* Stat cards row */}
            <StatCards />

            {/* Map and activity grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2">
                <FlightMap />
              </div>
              <div className="lg:col-span-1">
                <ActivityFeed />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
