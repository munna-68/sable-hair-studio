import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SalonAppointment, AppointmentStatus, PaymentStatus } from "@/lib/defaultStudioData";
import { formatCurrency, APPOINTMENT_STATUS_CONFIG, PAYMENT_STATUS_CONFIG } from "./dashboardUtils";
import { useStudio } from "@/contexts/StudioStore";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Scissors,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  Printer,
  Edit,
  Trash2,
  Sparkles,
  ShieldCheck,
  Armchair,
} from "lucide-react";
import { toast } from "sonner";

interface AppointmentDetailModalProps {
  appointment: SalonAppointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AppointmentDetailModal({ appointment, open, onOpenChange }: AppointmentDetailModalProps) {
  const { updateAppointmentStatus, updateAppointmentPayment, updateAppointmentFormula, deleteAppointment } = useStudio();
  const [editingFormula, setEditingFormula] = useState(false);
  const [formulaText, setFormulaText] = useState("");

  if (!appointment) return null;

  const statusConfig = APPOINTMENT_STATUS_CONFIG[appointment.status];
  const paymentConfig = PAYMENT_STATUS_CONFIG[appointment.paymentStatus];

  const handleStatusChange = (newStatus: AppointmentStatus) => {
    updateAppointmentStatus(appointment.id, newStatus);
    toast.success(`Status changed to ${APPOINTMENT_STATUS_CONFIG[newStatus].label}`);
  };

  const handlePaymentCycle = () => {
    const sequence: PaymentStatus[] = ["pending", "deposit-paid", "completed"];
    const nextIdx = (sequence.indexOf(appointment.paymentStatus) + 1) % sequence.length;
    const nextStatus = sequence[nextIdx];
    updateAppointmentPayment(appointment.id, nextStatus);
    toast.success(`Payment updated: ${PAYMENT_STATUS_CONFIG[nextStatus].label}`);
  };

  const handleSaveFormula = () => {
    updateAppointmentFormula(appointment.id, formulaText);
    setEditingFormula(false);
    toast.success("Color formula notes updated.");
  };

  const handlePrintTicket = () => {
    window.print();
    toast.info("Preparing station intake ticket for print.");
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to remove this appointment?")) {
      deleteAppointment(appointment.id);
      onOpenChange(false);
      toast.info("Appointment cancelled and removed from queue.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl bg-white border border-[#DDE7DF]">
        <div className="p-6 border-b border-[#DDE7DF] bg-[#F5F8F4] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-bold text-[#147A45] bg-[#147A45]/10 px-2 py-0.5 rounded">
                {appointment.id}
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${statusConfig.badgeClass}`}>
                {statusConfig.label}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded border ${paymentConfig.badgeClass}`}>
                {paymentConfig.label}
              </span>
            </div>
            <DialogTitle className="text-xl font-display text-[#0A1F14]">
              {appointment.serviceName}
            </DialogTitle>
            <DialogDescription className="text-xs text-[#4E5B51] mt-0.5">
              Scheduled with {appointment.stylistName} · Chair {appointment.chairNumber}
            </DialogDescription>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintTicket}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DDE7DF] bg-white text-xs font-medium text-[#0A1F14] hover:bg-slate-50 transition-colors"
            >
              <Printer size={13} /> Print Ticket
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-xs font-medium text-rose-700 hover:bg-rose-100 transition-colors"
            >
              <Trash2 size={13} /> Cancel
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 text-sm">
          {/* Timing & Station Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div>
              <span className="text-[11px] font-semibold text-[#66756A] uppercase tracking-wider block">Date</span>
              <b className="text-slate-900 text-sm mt-0.5 block">{appointment.dateKey}</b>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#66756A] uppercase tracking-wider block">Time & Length</span>
              <b className="text-slate-900 text-sm mt-0.5 block">{appointment.timeSlot} ({appointment.duration}m)</b>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#66756A] uppercase tracking-wider block">Chair / Station</span>
              <b className="text-slate-900 text-sm mt-0.5 block flex items-center gap-1">
                <Armchair size={13} className="text-[#147A45]" /> Chair 0{appointment.chairNumber}
              </b>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#66756A] uppercase tracking-wider block">Service Total</span>
              <b className="text-[#147A45] text-sm mt-0.5 block">{formatCurrency(appointment.price)}</b>
            </div>
          </div>

          {/* Quick Stage Advancer */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#0A1F14] uppercase tracking-wider block">
              Progress Chair Stage:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {(["confirmed", "in-chair", "processing", "completed", "cancelled"] as AppointmentStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => handleStatusChange(st)}
                  className={`px-2.5 py-1.5 text-xs rounded-lg border font-medium transition-all text-center ${
                    appointment.status === st
                      ? "border-[#147A45] bg-[#147A45] text-white shadow-xs font-bold"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {APPOINTMENT_STATUS_CONFIG[st].label}
                </button>
              ))}
            </div>
          </div>

          {/* Client Contact Info */}
          <div className="space-y-2">
            <h4 className="font-semibold text-xs text-[#0A1F14] uppercase tracking-wider">Client Profile & Intake</h4>
            <div className="p-4 rounded-xl border border-[#DDE7DF] bg-[#F5F8F4]/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#147A45]/15 text-[#147A45] flex items-center justify-center font-bold text-xs">
                    {appointment.clientName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <b className="text-[#0A1F14]">{appointment.clientName}</b>
                    <span className="text-xs text-[#66756A] ml-2">
                      {appointment.isNewClient ? "First Visit Client" : "Returning Client"}
                    </span>
                  </div>
                </div>
                {appointment.consultationRequired && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                    <ShieldCheck size={12} /> Chemical Consult Flag
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#4E5B51] pt-1 border-t border-[#DDE7DF]/60">
                <div className="flex items-center gap-2">
                  <Mail size={13} className="text-[#66756A]" /> {appointment.clientEmail}
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={13} className="text-[#66756A]" /> {appointment.clientPhone}
                </div>
              </div>

              {appointment.clientNotes && (
                <div className="p-3 rounded-lg bg-white border border-[#DDE7DF] text-xs space-y-1">
                  <span className="font-semibold text-[#0A1F14]">Client Intake Notes:</span>
                  <p className="text-[#4E5B51]">{appointment.clientNotes}</p>
                </div>
              )}

              {appointment.sensitivities && (
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                  <AlertTriangle size={14} className="text-amber-700 shrink-0" />
                  <span><b>Sensitivities:</b> {appointment.sensitivities}</span>
                </div>
              )}
            </div>
          </div>

          {/* Color Formula Notes */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-xs text-[#0A1F14] uppercase tracking-wider">
                Color Formula & Technical Ledger
              </h4>
              {!editingFormula && (
                <button
                  onClick={() => {
                    setFormulaText(appointment.formulaNotes || "");
                    setEditingFormula(true);
                  }}
                  className="text-xs text-[#147A45] hover:underline flex items-center gap-1 font-medium"
                >
                  <Edit size={12} /> Edit Formula
                </button>
              )}
            </div>

            {editingFormula ? (
              <div className="space-y-2">
                <textarea
                  rows={3}
                  value={formulaText}
                  onChange={(e) => setFormulaText(e.target.value)}
                  placeholder="Root formula, gloss mix, volume, processing time..."
                  className="w-full p-3 rounded-xl border border-[#147A45] bg-white text-xs text-[#0A1F14] focus:outline-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingFormula(false)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveFormula}
                    className="px-3 py-1.5 text-xs rounded-lg bg-[#147A45] text-white font-medium hover:bg-[#0D5932]"
                  >
                    Save Formula
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700">
                {appointment.formulaNotes ? (
                  <p className="font-mono text-slate-800 leading-relaxed">{appointment.formulaNotes}</p>
                ) : (
                  <span className="text-slate-400 italic">No formula notes logged for this session yet.</span>
                )}
              </div>
            )}
          </div>

          {/* Settlement & Payment */}
          <div className="p-4 rounded-xl border border-[#DDE7DF] bg-[#F5F8F4] flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#0A1F14] block">Payment & Settlement</span>
              <p className="text-xs text-[#4E5B51]">
                Deposit: {appointment.deposit > 0 ? `$${appointment.deposit} paid` : "No deposit required"} · Total: {formatCurrency(appointment.price)}
              </p>
            </div>
            <button
              onClick={handlePaymentCycle}
              className="px-3.5 py-1.5 rounded-full bg-white border border-[#DDE7DF] text-xs font-semibold text-[#147A45] hover:bg-slate-50 shadow-2xs"
            >
              Cycle Payment Status
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
