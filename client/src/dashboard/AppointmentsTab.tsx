import { useState, useMemo } from "react";
import { useStudio } from "@/contexts/StudioStore";
import { SalonAppointment, SalonOrder, AppointmentStatus, getIsoDateOffset } from "@/lib/defaultStudioData";
import {
  formatCurrency,
  formatCurrencyDetailed,
  APPOINTMENT_STATUS_CONFIG,
  PAYMENT_STATUS_CONFIG,
} from "./dashboardUtils";
import { AppointmentDetailModal } from "./AppointmentDetailModal";
import {
  Search,
  Filter,
  Calendar,
  Printer,
  ShoppingBag,
  Scissors,
  CheckCircle2,
  Clock,
  User,
  Armchair,
  ArrowUpRight,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

export default function AppointmentsTab() {
  const { appointments, orders, updateAppointmentStatus, updateOrderStatus, updateOrderPayment } = useStudio();

  const [activeSubTab, setActiveSubTab] = useState<"appointments" | "orders">("appointments");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "tomorrow" | "upcoming">("all");

  const [selectedAppointment, setSelectedAppointment] = useState<SalonAppointment | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const todayStr = useMemo(() => getIsoDateOffset(0), []);
  const tomorrowStr = useMemo(() => getIsoDateOffset(1), []);

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      // Status filter
      if (statusFilter !== "all" && apt.status !== statusFilter) return false;

      // Date filter
      if (dateFilter === "today" && apt.dateKey !== todayStr) return false;
      if (dateFilter === "tomorrow" && apt.dateKey !== tomorrowStr) return false;
      if (dateFilter === "upcoming" && apt.dateKey < todayStr) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = apt.clientName.toLowerCase().includes(q);
        const matchService = apt.serviceName.toLowerCase().includes(q);
        const matchStylist = apt.stylistName.toLowerCase().includes(q);
        const matchId = apt.id.toLowerCase().includes(q);
        if (!matchName && !matchService && !matchStylist && !matchId) return false;
      }

      return true;
    });
  }, [appointments, statusFilter, dateFilter, searchQuery, todayStr, tomorrowStr]);

  // Filtered Retail Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = o.clientName.toLowerCase().includes(q);
        const matchId = o.id.toLowerCase().includes(q);
        if (!matchName && !matchId) return false;
      }
      return true;
    });
  }, [orders, searchQuery]);

  const handleOpenDetails = (apt: SalonAppointment) => {
    setSelectedAppointment(apt);
    setModalOpen(true);
  };

  const handlePrintDailySheet = () => {
    window.print();
    toast.info("Preparing master daily schedule for print.");
  };

  const handleToggleOrderStatus = (order: SalonOrder) => {
    const nextStatus = order.status === "collected" ? "ready-for-pickup" : "collected";
    updateOrderStatus(order.id, nextStatus);
    toast.success(`Order ${order.id} marked as ${nextStatus === "collected" ? "Collected / Picked Up" : "Ready for Pickup"}`);
  };

  return (
    <div className="space-y-5">
      {/* Sub-Tabs: Appointments vs Orders */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DDE7DF] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab("appointments")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === "appointments"
                ? "bg-[#147A45] text-white shadow-xs"
                : "bg-white border border-[#DDE7DF] text-[#0A1F14] hover:bg-slate-50"
            }`}
          >
            <Scissors size={14} /> Salon Appointments ({appointments.length})
          </button>
          <button
            onClick={() => setActiveSubTab("orders")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === "orders"
                ? "bg-[#147A45] text-white shadow-xs"
                : "bg-white border border-[#DDE7DF] text-[#0A1F14] hover:bg-slate-50"
            }`}
          >
            <ShoppingBag size={14} /> Retail & Bag Orders ({orders.length})
          </button>
        </div>

        <button
          onClick={handlePrintDailySheet}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#DDE7DF] bg-white text-xs font-medium text-[#0A1F14] hover:bg-slate-50 transition-colors shadow-2xs self-start sm:self-auto"
        >
          <Printer size={13} /> Print Schedule Sheet
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3.5 top-3 text-[#66756A]" />
          <input
            type="text"
            placeholder={
              activeSubTab === "appointments"
                ? "Search client, service, specialist, or ID..."
                : "Search order ID or customer name..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#DDE7DF] bg-white text-xs text-[#0A1F14] focus:outline-none focus:border-[#147A45]"
          />
        </div>

        {activeSubTab === "appointments" && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 rounded-xl border border-[#DDE7DF] bg-white text-xs text-[#0A1F14] focus:outline-none focus:border-[#147A45]"
            >
              <option value="all">All Stages</option>
              <option value="confirmed">Confirmed</option>
              <option value="in-chair">In Chair</option>
              <option value="processing">Processing</option>
              <option value="requested">Consult Needed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="p-2 rounded-xl border border-[#DDE7DF] bg-white text-xs text-[#0A1F14] focus:outline-none focus:border-[#147A45]"
            >
              <option value="all">All Dates</option>
              <option value="today">Today Only</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="upcoming">All Upcoming</option>
            </select>
          </div>
        )}
      </div>

      {/* APPOINTMENTS TABLE VIEW */}
      {activeSubTab === "appointments" && (
        <div className="rounded-2xl border border-[#DDE7DF] bg-white overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F8F4] border-b border-[#DDE7DF] text-[#4E5B51] font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">ID & Date</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Service & Chair</th>
                  <th className="py-3 px-4">Specialist</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Price / Deposit</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE7DF]/70 text-[#0A1F14]">
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((apt) => {
                    const statusConfig = APPOINTMENT_STATUS_CONFIG[apt.status];
                    const paymentConfig = PAYMENT_STATUS_CONFIG[apt.paymentStatus];

                    return (
                      <tr
                        key={apt.id}
                        onClick={() => handleOpenDetails(apt)}
                        className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                      >
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <b className="font-mono text-xs text-[#147A45] block">{apt.id}</b>
                          <span className="text-[11px] text-[#66756A]">
                            {apt.dateKey} · <b>{apt.timeSlot}</b>
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <b className="text-sm text-[#0A1F14] block">{apt.clientName}</b>
                          <span className="text-[11px] text-[#66756A] block">{apt.clientPhone}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-medium text-[#0A1F14] block">{apt.serviceName}</span>
                          <span className="text-[11px] text-[#66756A] flex items-center gap-1 mt-0.5">
                            <Armchair size={11} className="text-[#147A45]" /> Chair 0{apt.chairNumber} ({apt.duration}m)
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-medium text-slate-800">{apt.stylistName}</span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-medium ${statusConfig.badgeClass}`}>
                            {statusConfig.label}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <b className="text-slate-900 block">{formatCurrency(apt.price)}</b>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border inline-block mt-0.5 ${paymentConfig.badgeClass}`}>
                            {paymentConfig.label}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleOpenDetails(apt)}
                            className="px-2.5 py-1 rounded-lg border border-[#DDE7DF] bg-white text-[11px] font-medium text-[#147A45] hover:bg-slate-50 transition-colors"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-xs text-[#66756A] italic">
                      No appointments matching this search or filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RETAIL ORDERS VIEW */}
      {activeSubTab === "orders" && (
        <div className="rounded-2xl border border-[#DDE7DF] bg-white overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F8F4] border-b border-[#DDE7DF] text-[#4E5B51] font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Order ID & Date</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Pickup Status</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE7DF]/70 text-[#0A1F14]">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => {
                    const isCollected = order.status === "collected";

                    return (
                      <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <b className="font-mono text-xs text-[#147A45] block">{order.id}</b>
                          <span className="text-[11px] text-[#66756A]">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <b className="text-sm text-[#0A1F14] block">{order.clientName}</b>
                          <span className="text-[11px] text-[#66756A]">{order.clientPhone}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            {order.items.map((i, idx) => (
                              <div key={idx} className="text-xs text-slate-800">
                                {i.qty}× <b>{i.name}</b> <span className="text-[#66756A]">({i.detail})</span>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <b className="text-slate-900 block">${order.total.toFixed(2)}</b>
                          <span className="text-[11px] text-[#66756A]">Tax: ${order.tax.toFixed(2)}</span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                              isCollected
                                ? "bg-slate-100 text-slate-700 border-slate-200"
                                : "bg-emerald-100 text-emerald-800 border-emerald-300 animate-pulse"
                            }`}
                          >
                            <CheckCircle2 size={11} /> {isCollected ? "Collected" : "Ready for Desk Pickup"}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="text-[11px] text-slate-700 font-medium block">
                            {order.paymentMethod}
                          </span>
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                            Paid in Full
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleToggleOrderStatus(order)}
                            className="px-3 py-1 rounded-lg border border-[#DDE7DF] bg-white text-[11px] font-semibold text-[#147A45] hover:bg-slate-50 transition-colors shadow-2xs"
                          >
                            {isCollected ? "Reopen Hold" : "Mark Collected"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-xs text-[#66756A] italic">
                      No retail orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AppointmentDetailModal
        appointment={selectedAppointment}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
