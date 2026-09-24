import { useMemo } from "react";
import { useStudio } from "@/contexts/StudioStore";
import { formatCurrency, formatCurrencyDetailed } from "./dashboardUtils";
import {
  DollarSign,
  CreditCard,
  Download,
  Printer,
  TrendingUp,
  Receipt,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";

export default function FinancialsTab() {
  const { appointments, orders } = useStudio();

  // Financial Aggregations
  const serviceRevenue = useMemo(() => {
    return appointments.reduce((sum, a) => sum + (a.status !== "cancelled" ? a.price : 0), 0);
  }, [appointments]);

  const retailRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const depositsHeld = useMemo(() => {
    return appointments.reduce((sum, a) => sum + (a.depositStatus === "paid" ? a.deposit : 0), 0);
  }, [appointments]);

  const tipsEstimated = useMemo(() => {
    return appointments.reduce((sum, a) => sum + (a.tipAmount || (a.status === "completed" ? Math.round(a.price * 0.2) : 0)), 0);
  }, [appointments]);

  const grossTotal = serviceRevenue + retailRevenue;

  // Mock Ledger Transactions
  const ledgerRows = useMemo(() => {
    const aptRows = appointments.map((a) => ({
      id: `REC-${a.id.replace("APT-", "")}`,
      date: a.dateKey,
      client: a.clientName,
      type: "Salon Service",
      description: `${a.serviceName} (${a.stylistName})`,
      amount: a.price,
      tip: a.tipAmount || (a.status === "completed" ? Math.round(a.price * 0.2) : 0),
      method: a.paymentMethod || "Credit Card",
      status: a.paymentStatus === "completed" ? "Settled" : "Held / Deposit",
    }));

    const orderRows = orders.map((o) => ({
      id: `REC-${o.id.replace("SB-", "RET-")}`,
      date: o.createdAt.slice(0, 10),
      client: o.clientName,
      type: "Retail Desk",
      description: `${o.items.length} product(s) hold`,
      amount: o.total,
      tip: 0,
      method: o.paymentMethod || "Apple Pay",
      status: "Settled",
    }));

    return [...aptRows, ...orderRows];
  }, [appointments, orders]);

  const handleExportCSV = () => {
    const headers = ["Receipt ID", "Date", "Client", "Type", "Description", "Amount", "Tip", "Payment Method", "Status"];
    const rows = ledgerRows.map((r) => [
      r.id,
      r.date,
      `"${r.client}"`,
      r.type,
      `"${r.description}"`,
      r.amount.toFixed(2),
      r.tip.toFixed(2),
      r.method,
      r.status,
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `sable-financial-settlement-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Settlement ledger exported as CSV.");
  };

  const handlePrintSummary = () => {
    window.print();
    toast.info("Preparing financial settlement report for print.");
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DDE7DF] pb-3">
        <div>
          <h3 className="font-display font-bold text-[#0A1F14] text-lg">
            Financial Ledger & Settlement Portal
          </h3>
          <p className="text-xs text-[#66756A]">
            Gross service intake, retail sales, deposit holds, and stylist tip pool.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#147A45] text-white text-xs font-medium hover:bg-[#0D5932] transition-colors shadow-2xs"
          >
            <Download size={13} /> Export CSV
          </button>
          <button
            onClick={handlePrintSummary}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#DDE7DF] bg-white text-xs font-medium text-[#0A1F14] hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Printer size={13} /> Print Summary
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-[#DDE7DF] bg-white shadow-2xs space-y-1.5">
          <span className="text-xs text-[#66756A] uppercase font-semibold">Total Gross</span>
          <div className="text-2xl font-display font-bold text-[#0A1F14]">
            {formatCurrency(grossTotal)}
          </div>
          <span className="text-[11px] text-[#147A45] font-medium block">
            Services + retail desk
          </span>
        </div>

        <div className="p-5 rounded-2xl border border-[#DDE7DF] bg-white shadow-2xs space-y-1.5">
          <span className="text-xs text-[#66756A] uppercase font-semibold">Service Revenue</span>
          <div className="text-2xl font-display font-bold text-[#0A1F14]">
            {formatCurrency(serviceRevenue)}
          </div>
          <span className="text-[11px] text-[#66756A] block">
            {appointments.length} appointment tickets
          </span>
        </div>

        <div className="p-5 rounded-2xl border border-[#DDE7DF] bg-white shadow-2xs space-y-1.5">
          <span className="text-xs text-[#66756A] uppercase font-semibold">Take-Home Retail</span>
          <div className="text-2xl font-display font-bold text-[#0A1F14]">
            {formatCurrency(retailRevenue)}
          </div>
          <span className="text-[11px] text-[#66756A] block">
            {orders.length} retail bag orders
          </span>
        </div>

        <div className="p-5 rounded-2xl border border-[#DDE7DF] bg-white shadow-2xs space-y-1.5">
          <span className="text-xs text-[#66756A] uppercase font-semibold">Stylist Tip Pool</span>
          <div className="text-2xl font-display font-bold text-[#147A45]">
            {formatCurrency(tipsEstimated)}
          </div>
          <span className="text-[11px] text-[#66756A] block">
            Directly distributed to specialists
          </span>
        </div>
      </div>

      {/* Payment Split & Deposit Security Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-[#DDE7DF] bg-[#F5F8F4] space-y-1">
          <span className="text-xs font-semibold text-[#0A1F14] block">Credit Cards & Apple Pay</span>
          <b className="text-base text-[#147A45] font-display">94.5%</b>
          <p className="text-[11px] text-[#66756A]">Stripe / contactless tap terminal at station desk.</p>
        </div>

        <div className="p-4 rounded-xl border border-[#DDE7DF] bg-[#F5F8F4] space-y-1">
          <span className="text-xs font-semibold text-[#0A1F14] block">Deposit Protection Buffer</span>
          <b className="text-base text-[#147A45] font-display">{formatCurrency(depositsHeld)}</b>
          <p className="text-[11px] text-[#66756A]">Protected chair deposits under 48h cancellation terms.</p>
        </div>

        <div className="p-4 rounded-xl border border-[#DDE7DF] bg-[#F5F8F4] space-y-1">
          <span className="text-xs font-semibold text-[#0A1F14] block">Payout Schedule</span>
          <b className="text-base text-[#0A1F14] font-display">Daily Batch</b>
          <p className="text-[11px] text-[#66756A]">Automated 9pm Pacific settlement to studio checking.</p>
        </div>
      </div>

      {/* Transaction Ledger Table */}
      <div className="rounded-2xl border border-[#DDE7DF] bg-white overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-[#DDE7DF] bg-[#F5F8F4] flex items-center justify-between">
          <span className="font-display font-bold text-[#0A1F14] text-sm flex items-center gap-1.5">
            <Receipt size={15} className="text-[#147A45]" /> Settlement Activity Ledger
          </span>
          <span className="text-xs text-[#66756A]">
            Showing {ledgerRows.length} recent transactions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F8F4]/50 border-b border-[#DDE7DF] text-[#4E5B51] font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Receipt</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Item & Department</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Tip</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE7DF]/70 text-[#0A1F14]">
              {ledgerRows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#147A45] whitespace-nowrap">
                    {row.id}
                  </td>
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                    {row.date}
                  </td>
                  <td className="py-3 px-4 font-medium whitespace-nowrap">
                    {row.client}
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    <span className="font-medium text-[#0A1F14]">{row.description}</span>
                    <span className="text-[10px] text-[#66756A] block">({row.type})</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                    {row.method}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                    ${row.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-[#147A45] font-semibold whitespace-nowrap">
                    {row.tip > 0 ? `+$${row.tip}` : "—"}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        row.status === "Settled"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-sky-50 text-sky-800 border-sky-200"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
