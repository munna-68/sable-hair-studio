import { useState } from "react";
import { useLocation } from "wouter";
import DashboardLayout from "./DashboardLayout";
import TodayTab from "./TodayTab";
import AppointmentsTab from "./AppointmentsTab";
import RosterTab from "./RosterTab";
import ServicesTab from "./ServicesTab";
import InquiriesTab from "./InquiriesTab";
import ClientsTab from "./ClientsTab";
import InsightsTab from "./InsightsTab";
import FinancialsTab from "./FinancialsTab";
import SettingsTab from "./SettingsTab";
import { NewAppointmentModal } from "./NewAppointmentModal";
import FloorMode from "./FloorMode";

export default function Dashboard() {
  const [location] = useLocation();
  const [floorModeOpen, setFloorModeOpen] = useState(false);
  const [newAppointmentOpen, setNewAppointmentOpen] = useState(false);

  const path = location.replace(/\/$/, "");

  let ContentComponent: React.ReactNode;

  if (path === "/dashboard/appointments") {
    ContentComponent = <AppointmentsTab />;
  } else if (path === "/dashboard/roster") {
    ContentComponent = <RosterTab />;
  } else if (path === "/dashboard/services") {
    ContentComponent = <ServicesTab />;
  } else if (path === "/dashboard/inquiries") {
    ContentComponent = <InquiriesTab />;
  } else if (path === "/dashboard/clients") {
    ContentComponent = <ClientsTab />;
  } else if (path === "/dashboard/insights") {
    ContentComponent = <InsightsTab />;
  } else if (path === "/dashboard/financials") {
    ContentComponent = <FinancialsTab />;
  } else if (path === "/dashboard/settings") {
    ContentComponent = <SettingsTab />;
  } else {
    // Default to /dashboard (TodayTab)
    ContentComponent = (
      <TodayTab
        onOpenNewAppointment={() => setNewAppointmentOpen(true)}
        onOpenFloorMode={() => setFloorModeOpen(true)}
      />
    );
  }

  return (
    <>
      <DashboardLayout>{ContentComponent}</DashboardLayout>

      {floorModeOpen && (
        <FloorMode onClose={() => setFloorModeOpen(false)} />
      )}

      <NewAppointmentModal
        open={newAppointmentOpen}
        onOpenChange={setNewAppointmentOpen}
      />
    </>
  );
}
