import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useStudio } from "@/contexts/StudioStore";
import { stylists, getDateOptions, getAvailableSlots, getDepositAmount } from "@/lib/salon-data";
import { getIsoDateOffset } from "@/lib/defaultStudioData";
import { User, Mail, Phone, Calendar, Clock, Armchair, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface NewAppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate?: string;
  defaultTime?: string;
  defaultStylistId?: string;
}

export function NewAppointmentModal({
  open,
  onOpenChange,
  defaultDate,
  defaultTime,
  defaultStylistId,
}: NewAppointmentModalProps) {
  const { services, addAppointment } = useStudio();

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [serviceId, setServiceId] = useState(services[0]?.id || "signature-cut");
  const [stylistId, setStylistId] = useState(defaultStylistId || "mara");
  const [dateKey, setDateKey] = useState(defaultDate || getIsoDateOffset(0));
  const [timeSlot, setTimeSlot] = useState(defaultTime || "11:00 AM");
  const [clientNotes, setClientNotes] = useState("");
  const [isWalkIn, setIsWalkIn] = useState(true);

  const selectedService = services.find((s) => s.id === serviceId) || services[0];
  const dates = getDateOptions(14);
  const slots = getAvailableSlots(stylistId, serviceId, dateKey);
  const availableSlots = slots.length > 0 ? slots : ["09:30 AM", "11:00 AM", "01:30 PM", "03:00 PM", "04:30 PM"];

  const handleQuickDemoFill = () => {
    setClientName("Audrey Hepburn");
    setClientEmail("audrey@hollywood.example");
    setClientPhone("(206) 555-0992");
    setClientNotes("Requested quiet chair session; soft gloss refresh.");
    toast.info("Filled with demo client profile.");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      toast.error("Please enter a client name.");
      return;
    }

    const matchedStylist = stylists.find((s) => s.id === stylistId);
    const chairMap: Record<string, number> = { mara: 1, noa: 2, sofia: 3, eli: 4 };
    const deposit = getDepositAmount(selectedService);

    const newApt = addAppointment({
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim() || `${clientName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      clientPhone: clientPhone.trim() || "(206) 555-0100",
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      category: selectedService.category,
      duration: selectedService.duration,
      price: selectedService.price,
      deposit: isWalkIn ? 0 : deposit,
      depositStatus: isWalkIn ? "waived" : deposit > 0 ? "paid" : "waived",
      paymentStatus: isWalkIn ? "pending" : "deposit-paid",
      stylistId,
      stylistName: matchedStylist?.name ?? "Assigned Specialist",
      chairNumber: chairMap[stylistId] || 1,
      dateKey,
      timeSlot,
      status: isWalkIn ? "in-chair" : "confirmed",
      isNewClient: false,
      consultationRequired: selectedService.chemical,
      consultationStatus: selectedService.chemical ? "approved" : "not-required",
      clientNotes: clientNotes.trim() ? `${isWalkIn ? "[Walk-in] " : ""}${clientNotes}` : isWalkIn ? "[Walk-in desk booking]" : undefined,
    });

    toast.success(`Booked ${newApt.id} for ${newApt.clientName}!`, {
      description: `${newApt.serviceName} with ${newApt.stylistName} at ${newApt.timeSlot}`,
    });

    onOpenChange(false);
    setClientName("");
    setClientEmail("");
    setClientPhone("");
    setClientNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 rounded-2xl bg-white border border-[#DDE7DF] overflow-hidden">
        <div className="p-6 border-b border-[#DDE7DF] bg-[#F5F8F4] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#147A45] bg-[#147A45]/10 px-2 py-0.5 rounded">
                Front Desk Intake
              </span>
            </div>
            <DialogTitle className="text-xl font-display text-[#0A1F14]">
              New Appointment / Walk-in Booking
            </DialogTitle>
            <DialogDescription className="text-xs text-[#4E5B51] mt-0.5">
              Add a walk-in guest or take a phone reservation directly into the schedule.
            </DialogDescription>
          </div>
          <button
            type="button"
            onClick={handleQuickDemoFill}
            className="text-xs text-[#147A45] hover:underline font-semibold flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-lg border border-[#DDE7DF]"
          >
            <Sparkles size={13} /> Auto-fill Demo
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Booking Type Pill */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsWalkIn(true)}
              className={`flex-1 py-2 rounded-xl border text-xs font-semibold transition-all ${
                isWalkIn
                  ? "border-[#147A45] bg-[#147A45] text-white shadow-2xs"
                  : "border-slate-200 bg-slate-50 text-slate-700"
              }`}
            >
              Direct Walk-In (Seat Now)
            </button>
            <button
              type="button"
              onClick={() => setIsWalkIn(false)}
              className={`flex-1 py-2 rounded-xl border text-xs font-semibold transition-all ${
                !isWalkIn
                  ? "border-[#147A45] bg-[#147A45] text-white shadow-2xs"
                  : "border-slate-200 bg-slate-50 text-slate-700"
              }`}
            >
              Phone / Future Reservation
            </button>
          </div>

          {/* Client Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
                Client Name <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <User size={13} className="absolute left-3 top-3 text-slate-400" />
                <input
                  required
                  type="text"
                  placeholder="e.g. Maya Lin"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#147A45]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
                Phone Number
              </label>
              <div className="relative">
                <Phone size={13} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="tel"
                  placeholder="(206) 555-0100"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#147A45]"
                />
              </div>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
                Email Address
              </label>
              <div className="relative">
                <Mail size={13} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  placeholder="maya.lin@example.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#147A45]"
                />
              </div>
            </div>
          </div>

          {/* Service & Specialist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
                Service Menu Item
              </label>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#147A45]"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.duration}m · ${s.price})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
                Specialist / Chair
              </label>
              <select
                value={stylistId}
                onChange={(e) => setStylistId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#147A45]"
              >
                {stylists.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} — {st.role}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
                Date
              </label>
              <select
                value={dateKey}
                onChange={(e) => setDateKey(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#147A45]"
              >
                {dates.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.day}, {d.month} {d.number} ({d.value})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
                Time Window
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#147A45]"
              >
                {availableSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
              Notes / Technical Instructions
            </label>
            <input
              type="text"
              placeholder="e.g. Wash & blowout finish requested, quiet chair..."
              value={clientNotes}
              onChange={(e) => setClientNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#147A45]"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <div className="text-slate-600 text-[11px]">
              Total: <b>${selectedService.price}</b> · {selectedService.duration} min
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#147A45] text-white font-medium hover:bg-[#0D5932] shadow-xs flex items-center gap-1.5"
              >
                <Plus size={14} /> Confirm Reservation
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
