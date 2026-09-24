import { useState, useMemo } from "react";
import { useStudio } from "@/contexts/StudioStore";
import { SalonAppointment, AppointmentStatus, getIsoDateOffset } from "@/lib/defaultStudioData";
import {
  formatCurrency,
  getTimeBucket,
  TIME_BUCKET_LABELS,
  TimeBucket,
  APPOINTMENT_STATUS_CONFIG,
  PAYMENT_STATUS_CONFIG,
} from "./dashboardUtils";
import { AppointmentDetailModal } from "./AppointmentDetailModal";
import {
  Armchair,
  Calendar,
  Clock,
  Sparkles,
  Scissors,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  User,
  Plus,
  Tv2,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

interface TodayTabProps {
  onOpenNewAppointment: () => void;
  onOpenFloorMode: () => void;
}

export default function TodayTab({ onOpenNewAppointment, onOpenFloorMode }: TodayTabProps) {
  const { appointments, updateAppointmentStatus, updateAppointmentPayment, stats } = useStudio();
  const [selectedAppointment, setSelectedAppointment] = useState<SalonAppointment | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const todayStr = useMemo(() => getIsoDateOffset(0), []);

  // Today's appointments
  const todayApts = useMemo(() => {
    return appointments.filter((apt) => apt.dateKey === todayStr);
  }, [appointments, todayStr]);

  // Fallback to all upcoming/active if today has none
  const displayApts = todayApts.length > 0 ? todayApts : appointments.slice(0, 6);
  const isFallbackDate = todayApts.length === 0;

  // Next up to seat or next in chair
  const nextUp = useMemo(() => {
    const uncompleted = displayApts.filter((a) => a.status !== "completed" && a.status !== "cancelled");
    const inChair = uncompleted.find((a) => a.status === "in-chair" || a.status === "processing");
    if (inChair) return inChair;
    return uncompleted[0] || null;
  }, [displayApts]);

  // Group appointments into 3 time windows
  const groupedAppointments = useMemo(() => {
    const groups: Record<TimeBucket, SalonAppointment[]> = {
      morning: [],
      midday: [],
      afternoon: [],
    };

    displayApts.forEach((apt) => {
      const bucket = getTimeBucket(apt.timeSlot);
      groups[bucket].push(apt);
    });

    return groups;
  }, [displayApts]);

  const handleOpenDetails = (apt: SalonAppointment) => {
    setSelectedAppointment(apt);
    setModalOpen(true);
  };

  const cyclePayment = (e: React.MouseEvent, apt: SalonAppointment) => {
    e.stopPropagation();
    const nextStatusMap: Record<SalonAppointment["paymentStatus"], SalonAppointment["paymentStatus"]> = {
      pending: "deposit-paid",
      "deposit-paid": "completed",
      completed: "pending",
      refunded: "pending",
    };
    const next = nextStatusMap[apt.paymentStatus];
    updateAppointmentPayment(apt.id, next);
    toast.success(`Payment updated: ${PAYMENT_STATUS_CONFIG[next].label}`);
  };

  const handleAdvanceStatus = (e: React.MouseEvent, apt: SalonAppointment) => {
    e.stopPropagation();
    const transitions: Record<AppointmentStatus, AppointmentStatus> = {
      requested: "confirmed",
      confirmed: "in-chair",
      "in-chair": "processing",
      processing: "completed",
      completed: "completed",
      cancelled: "confirmed",
    };
    const next = transitions[apt.status];
    updateAppointmentStatus(apt.id, next);
    toast.success(`Status updated to ${APPOINTMENT_STATUS_CONFIG[next].label}`);
  };

  return (
    <div className="space-y-6">
      {/* Fallback Notice */}
      {isFallbackDate && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-900 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-amber-700" />
            <span>Showing active upcoming salon bookings while today’s morning schedule loads.</span>
          </div>
          <button
            onClick={onOpenNewAppointment}
            className="font-bold underline text-amber-950 hover:text-[#147A45]"
          >
            + Add Walk-In or Booking
          </button>
        </div>
      )}

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl border border-[#DDE7DF] bg-white shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#66756A] mb-1">
            <span>Today’s Revenue</span>
            <DollarSign size={15} className="text-[#147A45]" />
          </div>
          <div className="text-2xl font-display font-semibold text-[#0A1F14]">
            {formatCurrency(stats.todayRevenue)}
          </div>
          <span className="text-[11px] text-[#147A45] font-medium flex items-center gap-1 mt-0.5">
            <TrendingUp size={11} /> 100% deposit protected
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-[#DDE7DF] bg-white shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#66756A] mb-1">
            <span>Chairs in Session</span>
            <Armchair size={15} className="text-[#147A45]" />
          </div>
          <div className="text-2xl font-display font-semibold text-[#0A1F14]">
            {stats.inChairCount} / 4
          </div>
          <span className="text-[11px] text-[#66756A] mt-0.5 block">
            {stats.activeChairsCount} stylist station(s) active
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-[#DDE7DF] bg-white shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#66756A] mb-1">
            <span>Appointments</span>
            <Scissors size={15} className="text-[#147A45]" />
          </div>
          <div className="text-2xl font-display font-semibold text-[#0A1F14]">
            {displayApts.length}
          </div>
          <span className="text-[11px] text-[#147A45] font-medium mt-0.5 block">
            {displayApts.filter((a) => a.status === "completed").length} finished today
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-[#DDE7DF] bg-white shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#66756A] mb-1">
            <span>Pending Inquiries</span>
            <Sparkles size={15} className="text-amber-600" />
          </div>
          <div className="text-2xl font-display font-semibold text-[#0A1F14]">
            {stats.newInquiriesCount}
          </div>
          <span className="text-[11px] text-amber-700 font-medium mt-0.5 block">
            {stats.pendingConsultationsCount} chemical consult(s)
          </span>
        </div>
      </div>

      {/* Hero Focus: Next in Chair */}
      {nextUp && (
        <div className="relative overflow-hidden rounded-2xl border border-[#C5D9CB] bg-gradient-to-r from-[#E6EFE9] via-[#F5F8F4] to-[#E6EFE9] p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#147A45] text-white text-[11px] font-bold uppercase tracking-wider">
                  <Armchair size={12} /> Active Floor Pass
                </span>
                <span className="font-mono text-xs font-bold text-[#147A45] bg-white px-2 py-0.5 rounded border border-[#C5D9CB]">
                  {nextUp.id}
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${APPOINTMENT_STATUS_CONFIG[nextUp.status].badgeClass}`}>
                  {APPOINTMENT_STATUS_CONFIG[nextUp.status].label}
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-[#0A1F14]">
                  {nextUp.clientName} · {nextUp.serviceName}
                </h3>
                <p className="text-xs sm:text-sm text-[#4E5B51] mt-0.5">
                  Assigned to <b>{nextUp.stylistName}</b> (Chair 0{nextUp.chairNumber}) · Scheduled for <b>{nextUp.timeSlot}</b> ({nextUp.duration} min)
                </p>
              </div>

              {nextUp.clientNotes && (
                <p className="text-xs text-[#0A1F14] bg-white/80 p-2.5 rounded-xl border border-[#C5D9CB] max-w-2xl">
                  <b>Intake:</b> {nextUp.clientNotes}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={(e) => handleAdvanceStatus(e, nextUp)}
                className="px-4 py-2.5 rounded-xl bg-[#147A45] text-white text-xs font-semibold hover:bg-[#0D5932] shadow-xs flex items-center gap-1.5 transition-colors"
              >
                Advance Stage <ArrowRight size={14} />
              </button>
              <button
                onClick={() => handleOpenDetails(nextUp)}
                className="px-4 py-2.5 rounded-xl border border-[#C5D9CB] bg-white text-xs font-semibold text-[#0A1F14] hover:bg-slate-50 transition-colors shadow-2xs"
              >
                Full Formula & Notes
              </button>
              <button
                onClick={onOpenFloorMode}
                className="px-4 py-2.5 rounded-xl border border-[#147A45]/30 bg-[#147A45]/10 text-xs font-semibold text-[#147A45] hover:bg-[#147A45]/20 transition-colors flex items-center gap-1.5"
              >
                <Tv2 size={14} /> Station Tablet Mode
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grouped Day Timeline Windows */}
      <div className="space-y-6">
        {(["morning", "midday", "afternoon"] as TimeBucket[]).map((bucket) => {
          const list = groupedAppointments[bucket];
          const info = TIME_BUCKET_LABELS[bucket];

          return (
            <div key={bucket} className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#DDE7DF] pb-2">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-[#147A45]" />
                  <h3 className="font-display font-semibold text-[#0A1F14] text-base">
                    {info.title}
                  </h3>
                  <span className="text-xs text-[#66756A] font-mono">({info.hint})</span>
                </div>
                <span className="text-xs text-[#66756A] font-medium">
                  {list.length} appointment(s)
                </span>
              </div>

              {list.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
                  {list.map((apt) => {
                    const statusConfig = APPOINTMENT_STATUS_CONFIG[apt.status];
                    const paymentConfig = PAYMENT_STATUS_CONFIG[apt.paymentStatus];

                    return (
                      <article
                        key={apt.id}
                        onClick={() => handleOpenDetails(apt)}
                        className="group relative rounded-2xl border border-[#DDE7DF] bg-white p-4.5 hover:border-[#147A45] hover:shadow-sm transition-all cursor-pointer space-y-3"
                      >
                        {/* Header: ID, Chair, Status */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[#147A45] text-xs">
                              {apt.id}
                            </span>
                            <span className="text-[11px] font-semibold text-[#66756A] bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
                              <Armchair size={11} className="text-[#147A45]" /> Chair 0{apt.chairNumber}
                            </span>
                          </div>

                          <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${statusConfig.badgeClass}`}>
                            {statusConfig.label}
                          </span>
                        </div>

                        {/* Client & Service */}
                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="font-display text-base font-bold text-[#0A1F14] group-hover:text-[#147A45] transition-colors">
                              {apt.clientName}
                            </h4>
                            <span className="text-xs font-semibold text-[#0A1F14]">
                              {formatCurrency(apt.price)}
                            </span>
                          </div>
                          <p className="text-xs text-[#4E5B51] mt-0.5">
                            {apt.serviceName} · <b>{apt.timeSlot}</b> ({apt.duration}m)
                          </p>
                          <p className="text-[11px] text-[#66756A] mt-0.5">
                            Specialist: <b>{apt.stylistName}</b>
                          </p>
                        </div>

                        {/* Badges / Sensory Notices */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {apt.consultationRequired && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                              <ShieldCheck size={11} /> First-Time Consult
                            </span>
                          )}
                          {apt.sensitivities && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                              <AlertTriangle size={11} /> Sensitive
                            </span>
                          )}
                        </div>

                        {/* Footer Actions */}
                        <div className="pt-2 border-t border-[#DDE7DF]/60 flex items-center justify-between text-xs">
                          <button
                            type="button"
                            onClick={(e) => cyclePayment(e, apt)}
                            className={`px-2 py-1 rounded text-[11px] border font-medium hover:opacity-80 transition-opacity ${paymentConfig.badgeClass}`}
                          >
                            {paymentConfig.label}
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleAdvanceStatus(e, apt)}
                            className="px-2.5 py-1 rounded-lg bg-[#F5F8F4] hover:bg-[#E6EFE9] text-[#147A45] font-semibold text-[11px] border border-[#C5D9CB] flex items-center gap-1"
                          >
                            Advance <ArrowRight size={11} />
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 rounded-xl border border-dashed border-[#DDE7DF] bg-[#F5F8F4]/40 text-center text-xs text-[#66756A]">
                  No appointments scheduled for this window.
                </div>
              )}
            </div>
          );
        })}
      </div>

      <AppointmentDetailModal
        appointment={selectedAppointment}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
