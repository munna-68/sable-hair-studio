import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useStudio } from "@/contexts/StudioStore";
import {
  Calendar,
  Scissors,
  Armchair,
  ShoppingBag,
  Mail,
  Users,
  TrendingUp,
  CircleDollarSign,
  Sliders,
  Tv2,
  Plus,
  ArrowUpRight,
  Menu as MenuIcon,
  X,
  Sparkles,
  ExternalLink,
  RotateCcw,
} from "lucide-react";
import { NewAppointmentModal } from "./NewAppointmentModal";
import FloorMode from "./FloorMode";

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  badgeColor?: string;
  title: string;
  subtitle: string;
}

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location] = useLocation();
  const { stats, appointments, resetToDefaults } = useStudio();

  const [floorModeOpen, setFloorModeOpen] = useState(false);
  const [newAppointmentOpen, setNewAppointmentOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      id: "today",
      label: "Today's Chair Pass",
      href: "/dashboard",
      icon: <Calendar size={17} />,
      badge: stats.todayAppointmentsCount > 0 ? stats.todayAppointmentsCount : undefined,
      badgeColor: "bg-[#147A45] text-white",
      title: "Today's Chair Pass",
      subtitle: "Daily service windows, chair status & in-station progression",
    },
    {
      id: "appointments",
      label: "Appointments & Orders",
      href: "/dashboard/appointments",
      icon: <Scissors size={17} />,
      badge: appointments.filter((a) => a.status === "confirmed" || a.status === "requested").length,
      badgeColor: "bg-[#0A1F14] text-white",
      title: "Appointments & Orders Queue",
      subtitle: "Client bookings, stage filters, intake sheets & retail pickups",
    },
    {
      id: "roster",
      label: "Chair Roster",
      href: "/dashboard/roster",
      icon: <Armchair size={17} />,
      title: "Chair & Stylist Roster",
      subtitle: "Daily timeline across all 4 chairs, turnover checklist & utilization",
    },
    {
      id: "services",
      label: "Services & Shelf",
      href: "/dashboard/services",
      icon: <ShoppingBag size={17} />,
      badge: stats.lowStockProductsCount > 0 ? stats.lowStockProductsCount : undefined,
      badgeColor: "bg-rose-600 text-white",
      title: "Services & Retail Shelf",
      subtitle: "Live catalog pricing, duration, chemical gates & inventory steppers",
    },
    {
      id: "inquiries",
      label: "Inquiries & Consults",
      href: "/dashboard/inquiries",
      icon: <Mail size={17} />,
      badge: stats.newInquiriesCount > 0 ? stats.newInquiriesCount : undefined,
      badgeColor: "bg-amber-600 text-white",
      title: "Client Inquiries & Consultations",
      subtitle: "Contact form messages, chemical intake requests & email reply simulator",
    },
    {
      id: "clients",
      label: "Clientele Directory",
      href: "/dashboard/clients",
      icon: <Users size={17} />,
      badge: stats.totalClientsCount,
      badgeColor: "bg-slate-200 text-slate-800",
      title: "Clientele Directory & Hair Profiles",
      subtitle: "Client hair diagnostic profiles, technical color formulas & visit history",
    },
    {
      id: "insights",
      label: "Analytics & Velocity",
      href: "/dashboard/insights",
      icon: <TrendingUp size={17} />,
      title: "Studio Analytics & Velocity",
      subtitle: "7-day revenue velocity, department shares & peak chair hours",
    },
    {
      id: "financials",
      label: "Financials & Ledger",
      href: "/dashboard/financials",
      icon: <CircleDollarSign size={17} />,
      title: "Financial Ledger & Settlements",
      subtitle: "Gross sales, service breakdown, retail intake, tip pool & CSV export",
    },
    {
      id: "settings",
      label: "Studio Settings",
      href: "/dashboard/settings",
      icon: <Sliders size={17} />,
      title: "Studio Operations & Policies",
      subtitle: "Hours of operation, cancellation windows, announcement banner & demo reset",
    },
  ];

  const currentPath = location.replace(/\/$/, "");
  const activeItem =
    navItems.find((item) => item.href === currentPath) ||
    navItems.find((item) => currentPath.startsWith(item.href) && item.href !== "/dashboard") ||
    navItems[0];

  return (
    <div className="min-h-screen bg-[#F5F8F4] flex flex-col lg:flex-row text-[#0A1F14]">
      {/* SIDEBAR NAVIGATION (Desktop) */}
      <aside className="hidden lg:flex w-72 flex-col justify-between border-r border-[#DDE7DF] bg-white p-5 shrink-0 min-h-screen">
        <div className="space-y-6">
          {/* Studio Brand Mark & Portal Badge */}
          <div className="space-y-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#147A45] flex items-center justify-center text-white font-serif font-bold text-base shadow-2xs">
                S
              </div>
              <div>
                <span className="font-display font-bold text-sm tracking-tight text-[#0A1F14] block leading-none">
                  SABLE HAIR STUDIO
                </span>
                <span className="text-[10px] text-[#66756A] uppercase tracking-wider font-semibold block mt-1">
                  118 Pine St · Seattle
                </span>
              </div>
            </Link>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#147A45]/10 text-[#147A45] text-[11px] font-bold tracking-wide w-full justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles size={12} /> OWNER PORTAL
              </span>
              <span className="text-[10px] font-mono opacity-80">v2.4 DEMO</span>
            </div>
          </div>

          {/* Quick Intake Actions */}
          <div className="space-y-2">
            <button
              onClick={() => setNewAppointmentOpen(true)}
              className="w-full py-2.5 px-3.5 rounded-xl bg-[#147A45] text-white font-medium text-xs hover:bg-[#0D5932] transition-colors shadow-2xs flex items-center justify-center gap-2"
            >
              <Plus size={15} /> + Walk-In / Phone Booking
            </button>
            <button
              onClick={() => setFloorModeOpen(true)}
              className="w-full py-2 px-3 rounded-xl border border-[#147A45]/30 bg-[#147A45]/5 text-[#147A45] font-semibold text-xs hover:bg-[#147A45]/15 transition-colors flex items-center justify-center gap-2"
            >
              <Tv2 size={14} /> Station Tablet Mode
            </button>
          </div>

          {/* Nav List */}
          <nav className="space-y-1" aria-label="Dashboard navigation">
            {navItems.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? currentPath === "/dashboard" || currentPath === ""
                  : currentPath.startsWith(item.href);

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#147A45] text-white shadow-2xs"
                      : "text-[#4E5B51] hover:bg-[#F5F8F4] hover:text-[#0A1F14]"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </span>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive ? "bg-white text-[#147A45]" : item.badgeColor || "bg-slate-200 text-slate-800"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-[#DDE7DF] space-y-2 text-xs">
          <Link
            href="/"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-[#147A45] hover:bg-[#E6EFE9] transition-colors font-semibold"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={14} /> View Public Website
            </span>
            <ArrowUpRight size={13} />
          </Link>

          <button
            onClick={() => {
              if (confirm("Reset demo data to clean state?")) resetToDefaults();
            }}
            className="w-full flex items-center justify-center gap-1.5 py-2 text-[11px] text-[#66756A] hover:text-rose-600 transition-colors"
          >
            <RotateCcw size={12} /> Reset Showcase State
          </button>
        </div>
      </aside>

      {/* MOBILE TOP BAR */}
      <div className="lg:hidden p-4 border-b border-[#DDE7DF] bg-white flex items-center justify-between sticky top-0 z-30">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#147A45] text-white flex items-center justify-center font-bold text-xs">
            S
          </div>
          <span className="font-display font-bold text-sm text-[#0A1F14]">
            SABLE PORTAL
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setNewAppointmentOpen(true)}
            className="p-2 rounded-lg bg-[#147A45] text-white text-xs font-semibold"
            title="Add Booking"
          >
            <Plus size={15} />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border border-[#DDE7DF] text-[#0A1F14]"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bottom-0 z-40 bg-white p-5 overflow-y-auto space-y-4">
          <div className="space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setNewAppointmentOpen(true);
              }}
              className="w-full py-2.5 rounded-xl bg-[#147A45] text-white font-medium text-xs flex items-center justify-center gap-2"
            >
              <Plus size={15} /> + Walk-In / Phone Booking
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setFloorModeOpen(true);
              }}
              className="w-full py-2 rounded-xl border border-[#147A45] text-[#147A45] font-semibold text-xs flex items-center justify-center gap-2"
            >
              <Tv2 size={14} /> Station Tablet Mode
            </button>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold ${
                  item.href === currentPath
                    ? "bg-[#147A45] text-white"
                    : "text-[#4E5B51] hover:bg-[#F5F8F4]"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-[#DDE7DF]">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 text-xs font-semibold text-[#147A45]"
            >
              <span>View Public Storefront</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="p-5 sm:p-7 border-b border-[#DDE7DF] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-display font-bold text-[#0A1F14]">
              {activeItem.title}
            </h1>
            <p className="text-xs text-[#66756A] mt-0.5">{activeItem.subtitle}</p>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => setFloorModeOpen(true)}
              className="px-3.5 py-2 rounded-xl border border-[#147A45]/30 bg-[#147A45]/10 text-xs font-semibold text-[#147A45] hover:bg-[#147A45]/20 transition-colors flex items-center gap-1.5"
            >
              <Tv2 size={14} /> Station Tablet Mode
            </button>
            <button
              onClick={() => setNewAppointmentOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#147A45] text-white text-xs font-medium hover:bg-[#0D5932] transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <Plus size={14} /> + New Booking
            </button>
          </div>
        </header>

        {/* Tab Page Outlet */}
        <main className="flex-1 p-4 sm:p-7 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Live Floor Mode Modal */}
      {floorModeOpen && (
        <FloorMode onClose={() => setFloorModeOpen(false)} />
      )}

      {/* New Appointment Modal */}
      <NewAppointmentModal
        open={newAppointmentOpen}
        onOpenChange={setNewAppointmentOpen}
      />
    </div>
  );
}
