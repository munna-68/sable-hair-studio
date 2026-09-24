import { useState, useMemo } from "react";
import { useStudio } from "@/contexts/StudioStore";
import { stylists, Service } from "@/lib/salon-data";
import { SalonAppointment, getIsoDateOffset } from "@/lib/defaultStudioData";
import { formatCurrency } from "./dashboardUtils";
import {
  Armchair,
  Clock,
  User,
  Scissors,
  Sparkles,
  Calendar,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Droplet,
  Printer,
} from "lucide-react";
import { toast } from "sonner";

export default function RosterTab() {
  const { appointments } = useStudio();
  const todayStr = useMemo(() => getIsoDateOffset(0), []);

  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(0);
  const selectedDateStr = useMemo(() => getIsoDateOffset(selectedDayOffset), [selectedDayOffset]);

  // Appointments on selected date
  const dayAppointments = useMemo(() => {
    return appointments.filter(
      (apt) => apt.dateKey === selectedDateStr && apt.status !== "cancelled"
    );
  }, [appointments, selectedDateStr]);

  // Turnover Checklist state
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    barbicide: true,
    capes: true,
    foils: true,
    warmTowels: true,
    diffusers: false,
    retailStocked: true,
  });

  const toggleCheck = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePrintRoster = () => {
    window.print();
    toast.info("Printing chair schedule and station roster.");
  };

  return (
    <div className="space-y-6">
      {/* Date Switcher & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DDE7DF] pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[0, 1, 2, 3].map((offset) => {
            const date = new Date();
            date.setDate(date.getDate() + offset);
            const label = offset === 0 ? "Today" : offset === 1 ? "Tomorrow" : date.toLocaleDateString("en-US", { weekday: "short" });
            const dateFmt = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

            return (
              <button
                key={offset}
                onClick={() => setSelectedDayOffset(offset)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedDayOffset === offset
                    ? "bg-[#147A45] text-white shadow-xs"
                    : "bg-white border border-[#DDE7DF] text-[#0A1F14] hover:bg-slate-50"
                }`}
              >
                {label} · {dateFmt}
              </button>
            );
          })}
        </div>

        <button
          onClick={handlePrintRoster}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#DDE7DF] bg-white text-xs font-medium text-[#0A1F14] hover:bg-slate-50 transition-colors shadow-2xs self-start sm:self-auto"
        >
          <Printer size={13} /> Print Station Roster
        </button>
      </div>

      {/* 4 Chairs Visual Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stylists.map((stylist, idx) => {
          const chairNum = idx + 1;
          const chairApts = dayAppointments.filter((a) => a.stylistId === stylist.id);
          const totalMinutes = chairApts.reduce((sum, a) => sum + a.duration, 0);
          const totalChairRevenue = chairApts.reduce((sum, a) => sum + a.price, 0);
          const utilizationPercent = Math.min(100, Math.round((totalMinutes / 540) * 100)); // 9 hrs workday = 540m

          return (
            <div
              key={stylist.id}
              className="rounded-2xl border border-[#DDE7DF] bg-white overflow-hidden shadow-2xs flex flex-col"
            >
              {/* Chair Card Top */}
              <div className="p-4 border-b border-[#DDE7DF] bg-[#F5F8F4] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-slate-900 shadow-xs"
                    style={{ backgroundColor: stylist.accent }}
                  >
                    {stylist.initials}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-[#0A1F14] text-sm">Chair 0{chairNum}</h3>
                    <p className="text-[11px] text-[#4E5B51] font-medium">{stylist.name} · {stylist.role}</p>
                  </div>
                </div>

                <span className="text-xs font-bold text-[#147A45] font-mono">
                  {utilizationPercent}% booked
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 h-1.5">
                <div
                  className="bg-[#147A45] h-1.5 transition-all"
                  style={{ width: `${utilizationPercent}%` }}
                />
              </div>

              {/* Schedule List */}
              <div className="p-4 space-y-2.5 flex-1">
                <div className="flex items-center justify-between text-[11px] text-[#66756A] font-semibold uppercase tracking-wider mb-1">
                  <span>Timeline</span>
                  <span>{chairApts.length} client(s) · {totalMinutes}m</span>
                </div>

                {chairApts.length > 0 ? (
                  chairApts.map((apt) => (
                    <div
                      key={apt.id}
                      className="p-3 rounded-xl border border-[#DDE7DF] bg-[#F5F8F4]/50 hover:bg-[#E6EFE9] transition-colors space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <b className="text-slate-900 font-mono text-[11px]">{apt.timeSlot}</b>
                        <span className="text-[10px] font-semibold text-[#147A45] bg-white px-1.5 py-0.2 rounded border border-[#C5D9CB]">
                          {apt.duration} min
                        </span>
                      </div>
                      <div className="font-bold text-[#0A1F14]">{apt.clientName}</div>
                      <div className="text-[11px] text-[#4E5B51] flex items-center justify-between">
                        <span>{apt.serviceName}</span>
                        <b>{formatCurrency(apt.price)}</b>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs text-[#66756A] italic">
                    No bookings scheduled for this chair on this date.
                  </div>
                )}
              </div>

              {/* Summary Footer */}
              <div className="p-3 border-t border-[#DDE7DF] bg-[#F5F8F4] flex items-center justify-between text-xs text-[#4E5B51]">
                <span>Chair Revenue</span>
                <b className="text-[#0A1F14]">{formatCurrency(totalChairRevenue)}</b>
              </div>
            </div>
          );
        })}
      </div>

      {/* Station Turnover & Health Checklist */}
      <div className="rounded-2xl border border-[#DDE7DF] bg-white p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#DDE7DF] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-[#147A45]" />
            <div>
              <h3 className="font-display font-semibold text-[#0A1F14] text-base">
                Morning Station Turnover & Sanitation Checklist
              </h3>
              <p className="text-xs text-[#66756A]">
                Daily protocol before chairs open at 09:00 AM.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-semibold text-[#147A45]">
            {Object.values(checklist).filter(Boolean).length} / {Object.keys(checklist).length} Complete
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {[
            { id: "barbicide", label: "Barbicide jars fresh & shears disinfected" },
            { id: "capes", label: "Fresh laundered styling capes & neck strips stocked" },
            { id: "foils", label: "Color station foils & balayage boards prepped" },
            { id: "warmTowels", label: "Hot towel cabinet prepped with eucalyptus mist" },
            { id: "diffusers", label: "Ionic dryers & curl diffusers inspected at Chair 03" },
            { id: "retailStocked", label: "Retail display shelf dusted and restocked" },
          ].map((item) => (
            <label
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer select-none transition-all ${
                checklist[item.id]
                  ? "border-[#147A45]/40 bg-[#E6EFE9] text-[#0A1F14] font-medium"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                  checklist[item.id]
                    ? "bg-[#147A45] border-[#147A45] text-white"
                    : "border-slate-300 bg-white"
                }`}
              >
                {checklist[item.id] && <CheckCircle2 size={13} />}
              </div>
              <span className="text-xs">{item.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
