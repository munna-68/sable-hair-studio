import { useState, useMemo } from "react";
import { useStudio } from "@/contexts/StudioStore";
import { StudioInquiry } from "@/lib/defaultStudioData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Mail,
  Phone,
  User,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  Trash2,
  Send,
  MessageSquare,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { NewAppointmentModal } from "./NewAppointmentModal";

export default function InquiriesTab() {
  const { inquiries, updateInquiryStatus, deleteInquiry } = useStudio();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [selectedInquiry, setSelectedInquiry] = useState<StudioInquiry | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);

  // Conversion to appointment modal
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      if (statusFilter !== "all" && inq.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = inq.name.toLowerCase().includes(q);
        const matchEmail = inq.email.toLowerCase().includes(q);
        const matchTopic = inq.topic.toLowerCase().includes(q);
        const matchMsg = inq.message.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchTopic && !matchMsg) return false;
      }
      return true;
    });
  }, [inquiries, statusFilter, searchQuery]);

  const handleOpenDetail = (inq: StudioInquiry) => {
    setSelectedInquiry(inq);
    setReplyText(
      inq.replyNote ||
        `Hi ${inq.name.split(" ")[0]},\n\nThank you for reaching out to Sable Hair Studio! Regarding your note about ${inq.topic.toLowerCase()}:\n\nWe would love to help you plan your visit. Let us know if you'd like to reserve a time with our color or cut director.\n\nWarm regards,\nThe Sable Studio Team`
    );
    setDetailModalOpen(true);
  };

  const handleStatusChange = (status: StudioInquiry["status"]) => {
    if (!selectedInquiry) return;
    updateInquiryStatus(selectedInquiry.id, status);
    setSelectedInquiry((prev) => (prev ? { ...prev, status } : null));
    toast.success(`Inquiry marked as ${status.toUpperCase()}`);
  };

  const handleSendReply = () => {
    if (!selectedInquiry || !replyText.trim()) return;
    setIsSendingReply(true);
    window.setTimeout(() => {
      updateInquiryStatus(selectedInquiry.id, "replied", replyText.trim());
      setIsSendingReply(false);
      setDetailModalOpen(false);
      toast.success(`Simulated email reply sent to ${selectedInquiry.email}!`, {
        description: "Status updated to Replied with notes attached.",
      });
    }, 600);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this inquiry?")) {
      deleteInquiry(id);
      setDetailModalOpen(false);
      toast.info("Inquiry deleted.");
    }
  };

  const handleConvertToBooking = () => {
    setDetailModalOpen(false);
    setBookingModalOpen(true);
  };

  return (
    <div className="space-y-5">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between border-b border-[#DDE7DF] pb-3">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3.5 top-3 text-[#66756A]" />
          <input
            type="text"
            placeholder="Search inquiries by client name, email, or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#DDE7DF] bg-white text-xs text-[#0A1F14] focus:outline-none focus:border-[#147A45]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: "all", label: "All Messages" },
            { id: "new", label: "New" },
            { id: "in-review", label: "In Review" },
            { id: "replied", label: "Replied" },
            { id: "archived", label: "Archived" },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                statusFilter === st.id
                  ? "border-[#147A45] bg-[#147A45] text-white shadow-2xs"
                  : "border-[#DDE7DF] bg-white text-[#0A1F14] hover:bg-slate-50"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredInquiries.length > 0 ? (
          filteredInquiries.map((inq) => {
            const isNew = inq.status === "new";

            return (
              <article
                key={inq.id}
                onClick={() => handleOpenDetail(inq)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 shadow-2xs flex flex-col justify-between ${
                  isNew
                    ? "border-amber-300 bg-amber-50/40 hover:border-amber-400"
                    : "border-[#DDE7DF] bg-white hover:border-[#147A45]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700 bg-white px-2.5 py-0.5 rounded-full border border-slate-200 text-[10px] uppercase">
                      {inq.topic}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isNew
                          ? "bg-amber-500 text-white animate-pulse"
                          : inq.status === "replied"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {inq.status.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base text-[#0A1F14] mt-1.5">
                    {inq.name}
                  </h3>
                  <p className="text-xs text-[#66756A] mt-0.5 flex items-center gap-2">
                    <span>{inq.email}</span>
                    {inq.phone && <span>· {inq.phone}</span>}
                  </p>

                  <div className="p-3 rounded-xl bg-white/80 border border-slate-200/80 text-xs text-[#4E5B51] mt-3 line-clamp-3 leading-relaxed">
                    “{inq.message}”
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-[#66756A]">
                  <span className="font-mono text-[11px]">{inq.id}</span>
                  <span className="text-[#147A45] font-semibold text-xs flex items-center gap-1 hover:underline">
                    View & Reply <ArrowRight size={12} />
                  </span>
                </div>
              </article>
            );
          })
        ) : (
          <div className="col-span-2 py-12 text-center text-xs text-[#66756A] italic">
            No client inquiries matching this filter.
          </div>
        )}
      </div>

      {/* Detail & Reply Modal */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="max-w-xl p-0 rounded-2xl bg-white border border-[#DDE7DF] overflow-hidden">
          {selectedInquiry && (
            <>
              <div className="p-5 border-b border-[#DDE7DF] bg-[#F5F8F4] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-[#147A45] bg-[#147A45]/10 px-2 py-0.5 rounded">
                      {selectedInquiry.id}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full border border-slate-200 bg-white font-medium text-slate-700">
                      {selectedInquiry.topic}
                    </span>
                  </div>
                  <DialogTitle className="text-xl font-display text-[#0A1F14]">
                    {selectedInquiry.name}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-[#4E5B51] mt-0.5">
                    {selectedInquiry.email} {selectedInquiry.phone ? `· ${selectedInquiry.phone}` : ""}
                  </DialogDescription>
                </div>

                <button
                  onClick={() => handleDelete(selectedInquiry.id)}
                  className="p-2 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                  title="Delete Inquiry"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="p-5 space-y-4 text-xs">
                {/* Full Message */}
                <div className="space-y-1">
                  <span className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
                    Client Inquiry Message
                  </span>
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 leading-relaxed font-sans">
                    {selectedInquiry.message}
                  </div>
                </div>

                {/* Status Switcher */}
                <div className="space-y-1.5">
                  <span className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
                    Inquiry Status
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {(["new", "in-review", "replied", "archived"] as StudioInquiry["status"][]).map((st) => (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(st)}
                        className={`px-3 py-1 rounded-lg border text-xs font-semibold uppercase tracking-wider transition-all ${
                          selectedInquiry.status === st
                            ? "border-[#147A45] bg-[#147A45] text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reply Simulator */}
                <div className="space-y-1.5 pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1">
                      <MessageSquare size={13} className="text-[#147A45]" /> Email Response Draft
                    </span>
                    <button
                      type="button"
                      onClick={handleConvertToBooking}
                      className="text-xs text-[#147A45] font-semibold hover:underline flex items-center gap-1"
                    >
                      <Sparkles size={12} /> Convert to Appointment
                    </button>
                  </div>
                  <textarea
                    rows={5}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#147A45]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setDetailModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    disabled={isSendingReply}
                    onClick={handleSendReply}
                    className="px-5 py-2 rounded-xl bg-[#147A45] text-white font-medium hover:bg-[#0D5932] flex items-center gap-1.5 shadow-xs"
                  >
                    <Send size={13} /> {isSendingReply ? "Sending..." : "Send Reply"}
                  </button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Convert to Appointment Modal */}
      {selectedInquiry && (
        <NewAppointmentModal
          open={bookingModalOpen}
          onOpenChange={setBookingModalOpen}
        />
      )}
    </div>
  );
}
