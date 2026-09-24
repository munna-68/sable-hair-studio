import { useMemo } from "react";
import { useStudio } from "@/contexts/StudioStore";
import { formatCurrency } from "./dashboardUtils";
import {
  TrendingUp,
  DollarSign,
  Users,
  Scissors,
  ShoppingBag,
  Armchair,
  Calendar,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function InsightsTab() {
  const { appointments, orders } = useStudio();

  // 7-day revenue mock trend
  const revenueTrendData = useMemo(() => {
    return [
      { day: "Mon", service: 1240, retail: 180, total: 1420 },
      { day: "Tue", service: 1820, retail: 240, total: 2060 },
      { day: "Wed", service: 2150, retail: 310, total: 2460 },
      { day: "Thu", service: 2480, retail: 420, total: 2900 },
      { day: "Fri", service: 3120, retail: 580, total: 3700 },
      { day: "Sat", service: 3640, retail: 720, total: 4360 },
      { day: "Sun", service: 1980, retail: 290, total: 2270 },
    ];
  }, []);

  // Category Distribution
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = { Color: 0, Cut: 0, Care: 0, Grooming: 0 };
    appointments.forEach((apt) => {
      if (counts[apt.category] !== undefined) {
        counts[apt.category] += 1;
      }
    });

    return [
      { name: "Color Plans", value: counts.Color || 4, color: "#147A45" },
      { name: "Precision Cuts", value: counts.Cut || 3, color: "#2E8B57" },
      { name: "Texture & Care", value: counts.Care || 2, color: "#66BB6A" },
      { name: "Grooming", value: counts.Grooming || 2, color: "#81C784" },
    ];
  }, [appointments]);

  // Stylist Booking Volume
  const stylistVolumeData = useMemo(() => {
    return [
      { name: "Mara (Color)", appointments: 18, revenue: 4770 },
      { name: "Noa (Cut)", appointments: 22, revenue: 2024 },
      { name: "Sofia (Care)", appointments: 14, revenue: 2890 },
      { name: "Eli (Grooming)", appointments: 26, revenue: 1612 },
    ];
  }, []);

  // Peak Booking Hours
  const peakHoursData = [
    { hour: "09 AM", count: 4 },
    { hour: "10 AM", count: 8 },
    { hour: "11 AM", count: 9 },
    { hour: "12 PM", count: 6 },
    { hour: "01 PM", count: 7 },
    { hour: "02 PM", count: 8 },
    { hour: "03 PM", count: 6 },
    { hour: "04 PM", count: 5 },
    { hour: "05 PM", count: 4 },
  ];

  return (
    <div className="space-y-6">
      {/* 4 KPI Top Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-5 rounded-2xl border border-[#DDE7DF] bg-white shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#66756A]">
            <span>Monthly Run Rate</span>
            <DollarSign size={16} className="text-[#147A45]" />
          </div>
          <div className="text-2xl font-display font-bold text-[#0A1F14]">$19,170</div>
          <span className="text-xs text-[#147A45] font-semibold flex items-center gap-1">
            <TrendingUp size={12} /> +14.2% vs previous month
          </span>
        </div>

        <div className="p-5 rounded-2xl border border-[#DDE7DF] bg-white shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#66756A]">
            <span>Average Ticket Size</span>
            <Scissors size={16} className="text-[#147A45]" />
          </div>
          <div className="text-2xl font-display font-bold text-[#0A1F14]">$168.40</div>
          <span className="text-xs text-[#66756A]">
            High color & add-on attachment
          </span>
        </div>

        <div className="p-5 rounded-2xl border border-[#DDE7DF] bg-white shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#66756A]">
            <span>Client Rebooking Rate</span>
            <Users size={16} className="text-[#147A45]" />
          </div>
          <div className="text-2xl font-display font-bold text-[#0A1F14]">78.4%</div>
          <span className="text-xs text-[#147A45] font-semibold flex items-center gap-1">
            <TrendingUp size={12} /> Membership cadence driver
          </span>
        </div>

        <div className="p-5 rounded-2xl border border-[#DDE7DF] bg-white shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#66756A]">
            <span>Chair Utilization</span>
            <Armchair size={16} className="text-[#147A45]" />
          </div>
          <div className="text-2xl font-display font-bold text-[#0A1F14]">84.2%</div>
          <span className="text-xs text-[#66756A]">
            Protected 30m turnover buffer
          </span>
        </div>
      </div>

      {/* Main Charts: 7-Day Revenue & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 7-Day Revenue Chart */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl border border-[#DDE7DF] bg-white shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#DDE7DF] pb-3">
            <div>
              <h3 className="font-display font-bold text-[#0A1F14] text-base">
                7-Day Revenue Velocity (Services vs. Retail Shelf)
              </h3>
              <p className="text-xs text-[#66756A]">
                Breakdown of in-chair appointments and retail product desk checkout.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#147A45]">
              Total: $19,170
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2EBE5" />
                <XAxis dataKey="day" stroke="#66756A" fontSize={12} tickLine={false} />
                <YAxis stroke="#66756A" fontSize={12} tickLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip
                  formatter={(val: any) => [`$${val}`, ""]}
                  contentStyle={{ backgroundColor: "#0A1F14", borderRadius: "12px", color: "#fff", border: "none", fontSize: "12px" }}
                />
                <Bar dataKey="service" name="Salon Services" fill="#147A45" radius={[6, 6, 0, 0]} stackId="a" />
                <Bar dataKey="retail" name="Take-Home Care" fill="#81C784" radius={[6, 6, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Donut */}
        <div className="p-5 sm:p-6 rounded-2xl border border-[#DDE7DF] bg-white shadow-2xs space-y-4">
          <div className="border-b border-[#DDE7DF] pb-3">
            <h3 className="font-display font-bold text-[#0A1F14] text-base">
              Service Distribution
            </h3>
            <p className="text-xs text-[#66756A]">Booking volume by department.</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#0A1F14", borderRadius: "8px", color: "#fff", border: "none", fontSize: "11px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {categoryData.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  {c.name}
                </span>
                <b>{c.value} bookings</b>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Specialist Volume & Peak Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stylist Breakdown */}
        <div className="p-5 sm:p-6 rounded-2xl border border-[#DDE7DF] bg-white shadow-2xs space-y-4">
          <div className="border-b border-[#DDE7DF] pb-3">
            <h3 className="font-display font-bold text-[#0A1F14] text-base">
              Specialist Booking Volume & Chair Gross
            </h3>
            <p className="text-xs text-[#66756A]">Volume and gross revenue across the 4 chairs.</p>
          </div>

          <div className="space-y-3 pt-1">
            {stylistVolumeData.map((s) => (
              <div key={s.name} className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <b className="text-slate-900">{s.name}</b>
                  <span className="text-slate-600">
                    {s.appointments} visits · <b>{formatCurrency(s.revenue)}</b>
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-[#147A45] h-2 rounded-full transition-all"
                    style={{ width: `${(s.revenue / 5000) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Hours */}
        <div className="p-5 sm:p-6 rounded-2xl border border-[#DDE7DF] bg-white shadow-2xs space-y-4">
          <div className="border-b border-[#DDE7DF] pb-3">
            <h3 className="font-display font-bold text-[#0A1F14] text-base">
              Peak Chair Occupancy Hours
            </h3>
            <p className="text-xs text-[#66756A]">Hourly demand density throughout the salon day.</p>
          </div>

          <div className="h-52 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakHoursData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2EBE5" />
                <XAxis dataKey="hour" stroke="#66756A" fontSize={11} tickLine={false} />
                <YAxis stroke="#66756A" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`${val} clients`, "Demand"]}
                  contentStyle={{ backgroundColor: "#0A1F14", borderRadius: "8px", color: "#fff", border: "none", fontSize: "11px" }}
                />
                <Bar dataKey="count" fill="#147A45" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
