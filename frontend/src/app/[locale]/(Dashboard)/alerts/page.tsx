"use client";

import { SecurityProvider, useSecurity }
  from "@/context/SecurityContext";

import AlertStatsCards
  from "@/components/alerts/AlertStatsCards";

import AlertsTable
  from "@/components/alerts/AlertsTable";

import EventTimeline
  from "@/components/alerts/EventTimeline";

import EventDetailDrawer
  from "@/components/alerts/EventDetailDrawer";

import ThreatLevelBanner
  from "@/components/alerts/ThreatLevelBanner";
import IncidentGrid from "@/components/alerts/IncidentGrid";

function AlertsDashboard() {
  const {
    stats,
    events,
    timeline,
    selectedEvent,
    setSelectedEvent,
    acknowledge,
    loading,
  } = useSecurity();

  if (loading) {
    return (
      <div className="p-10 text-white">
        Loading Security Center...
      </div>
    );
  }

  return (
    <div className="p-6 text-white">

      <h1 className="text-3xl font-bold mb-6">
        Security Operations Center
      </h1>

      <ThreatLevelBanner
        stats={stats}
      />

      <AlertStatsCards
        stats={stats}
      />

      <div className="grid grid-cols-12 gap-6">

        <div className="col-span-8">

          <IncidentGrid
            events={events}
            onSelect={
              setSelectedEvent
            }
            onAcknowledge={
              acknowledge
            }
          />

        </div>

        <div className="col-span-4">

          <EventTimeline
            timeline={timeline}
          />

        </div>

      </div>

      <EventDetailDrawer
        event={selectedEvent}
        onClose={() =>
          setSelectedEvent(null)
        }
      />

    </div>
  );
}

export default function AlertsPage() {
  return (
    <SecurityProvider>
      <AlertsDashboard />
    </SecurityProvider>
  );
}