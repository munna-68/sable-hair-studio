import { useState } from "react";
import { useStudio } from "@/contexts/StudioStore";
import { DayHours } from "@/lib/defaultStudioData";
import {
  Sliders,
  Clock,
  MapPin,
  Phone,
  Mail,
  Megaphone,
  Calendar,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export default function SettingsTab() {
  const { settings, updateSettings, toggleBlackoutDate, resetToDefaults, subscribers } = useStudio();

  // Operating Hours state
  const [hours, setHours] = useState<DayHours[]>(settings.operatingHours);

  // Profile state
  const [studioName, setStudioName] = useState(settings.studioName);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [cancelHours, setCancelHours] = useState(settings.cancellationWindowHours);
  const [depositPct, setDepositPct] = useState(settings.defaultDepositPercent);
  const [isOpenToday, setIsOpenToday] = useState(settings.isOpenToday);

  // Announcement Banner
  const [bannerEnabled, setBannerEnabled] = useState(settings.announcementBanner.enabled);
  const [bannerMessage, setBannerMessage] = useState(settings.announcementBanner.message);

  // New blackout date
  const [newBlackout, setNewBlackout] = useState("");

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      studioName,
      address,
      phone,
      email,
      cancellationWindowHours: Number(cancelHours),
      defaultDepositPercent: Number(depositPct),
      isOpenToday,
      announcementBanner: {
        ...settings.announcementBanner,
        enabled: bannerEnabled,
        message: bannerMessage,
      },
      operatingHours: hours,
    });
  };

  const handleToggleDayClosed = (dayIdx: number) => {
    setHours((prev) =>
      prev.map((h, i) => (i === dayIdx ? { ...h, closed: !h.closed } : h))
    );
  };

  const handleHourChange = (dayIdx: number, field: "open" | "close", val: string) => {
    setHours((prev) =>
      prev.map((h, i) => (i === dayIdx ? { ...h, [field]: val } : h))
    );
  };

  const handleAddBlackout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlackout) return;
    toggleBlackoutDate(newBlackout);
    setNewBlackout("");
    toast.success(`Holiday / closure date updated.`);
  };

  const handleConfirmReset = () => {
    if (confirm("Are you sure you want to reset all demo showcase data back to default? All custom appointments will be restored to clean demo state.")) {
      resetToDefaults();
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Studio Profile & Hours */}
        <div className="p-6 rounded-2xl border border-[#DDE7DF] bg-white shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-[#DDE7DF] pb-3">
            <div>
              <h3 className="font-display font-bold text-[#0A1F14] text-base">
                Studio Information & Operating Status
              </h3>
              <p className="text-xs text-[#66756A]">
                Controls address, telephone, and real-time open status on the storefront.
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none bg-[#F5F8F4] px-3 py-1.5 rounded-full border border-[#DDE7DF]">
              <span className="text-xs font-semibold text-[#0A1F14]">
                {isOpenToday ? "Studio Open Today" : "Studio Closed Today"}
              </span>
              <input
                type="checkbox"
                checked={isOpenToday}
                onChange={(e) => setIsOpenToday(e.target.checked)}
                className="w-4 h-4 text-[#147A45]"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
                Studio Name
              </label>
              <input
                type="text"
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs mt-1"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
                Phone Display
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs mt-1"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs mt-1"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
                Inquiry Routing Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs mt-1"
              />
            </div>
          </div>

          {/* Operating Hours Table */}
          <div className="space-y-2 pt-2">
            <span className="font-semibold text-slate-800 uppercase tracking-wider text-[11px] block">
              Weekly Service Schedule (Tue–Sun)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
              {hours.map((h, idx) => (
                <div
                  key={h.day}
                  className={`p-3 rounded-xl border transition-colors ${
                    h.closed ? "bg-slate-100/70 border-slate-200 text-slate-400" : "bg-[#F5F8F4] border-[#DDE7DF]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <b className="text-slate-900 font-semibold">{h.day}</b>
                    <button
                      type="button"
                      onClick={() => handleToggleDayClosed(idx)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        h.closed ? "bg-slate-300 text-slate-700" : "bg-[#147A45] text-white"
                      }`}
                    >
                      {h.closed ? "CLOSED" : "OPEN"}
                    </button>
                  </div>
                  {!h.closed && (
                    <div className="flex items-center gap-2 text-[11px] text-slate-700">
                      <input
                        type="text"
                        value={h.open}
                        onChange={(e) => handleHourChange(idx, "open", e.target.value)}
                        className="w-20 px-2 py-1 rounded border border-[#C5D9CB] bg-white text-center font-mono text-xs"
                      />
                      <span>to</span>
                      <input
                        type="text"
                        value={h.close}
                        onChange={(e) => handleHourChange(idx, "close", e.target.value)}
                        className="w-20 px-2 py-1 rounded border border-[#C5D9CB] bg-white text-center font-mono text-xs"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cancellation & Deposit Policies */}
        <div className="p-6 rounded-2xl border border-[#DDE7DF] bg-white shadow-2xs space-y-4">
          <div className="border-b border-[#DDE7DF] pb-3">
            <h3 className="font-display font-bold text-[#0A1F14] text-base">
              Booking Policy & Deposit Thresholds
            </h3>
            <p className="text-xs text-[#66756A]">
              Controls the cancellation lock window and deposit requirements on public `/book`.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
                Cancellation Change Window (Hours)
              </label>
              <select
                value={cancelHours}
                onChange={(e) => setCancelHours(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs mt-1"
              >
                <option value={24}>24 Hours Notice</option>
                <option value={48}>48 Hours Notice (Default for Chemical Services)</option>
                <option value={72}>72 Hours Notice</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
                Default Service Deposit (%)
              </label>
              <input
                type="number"
                min={0}
                max={50}
                value={depositPct}
                onChange={(e) => setDepositPct(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs mt-1"
              />
            </div>
          </div>
        </div>

        {/* Announcement Banner */}
        <div className="p-6 rounded-2xl border border-[#DDE7DF] bg-white shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#DDE7DF] pb-3">
            <div>
              <h3 className="font-display font-bold text-[#0A1F14] text-base">
                Public Announcement Banner
              </h3>
              <p className="text-xs text-[#66756A]">
                Displays at the very top of all public pages when active.
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <span className="text-xs font-semibold text-slate-800">
                {bannerEnabled ? "Banner Active" : "Banner Hidden"}
              </span>
              <input
                type="checkbox"
                checked={bannerEnabled}
                onChange={(e) => setBannerEnabled(e.target.checked)}
                className="w-4 h-4 text-[#147A45]"
              />
            </label>
          </div>

          <div className="space-y-2 text-xs">
            <label className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
              Banner Copy
            </label>
            <input
              type="text"
              placeholder="e.g. Spring color openings now live..."
              value={bannerMessage}
              onChange={(e) => setBannerMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900"
            />
            {bannerEnabled && (
              <div className="p-2.5 rounded-xl bg-[#0A1F14] text-[#E6EFE9] text-xs font-medium text-center flex items-center justify-center gap-2 mt-2">
                <Sparkles size={12} className="text-[#34D399]" />
                <span>Preview: {bannerMessage}</span>
              </div>
            )}
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#147A45] text-white font-medium hover:bg-[#0D5932] shadow-xs text-xs"
          >
            Save All Settings
          </button>
        </div>
      </form>

      {/* Holiday / Blackout Closures */}
      <div className="p-6 rounded-2xl border border-[#DDE7DF] bg-white shadow-2xs space-y-4">
        <div className="border-b border-[#DDE7DF] pb-3">
          <h3 className="font-display font-bold text-[#0A1F14] text-base">
            Holiday Closures & Studio Blackout Dates
          </h3>
          <p className="text-xs text-[#66756A]">
            Dates on which no public appointments can be booked.
          </p>
        </div>

        <form onSubmit={handleAddBlackout} className="flex gap-2 max-w-sm">
          <input
            type="date"
            value={newBlackout}
            onChange={(e) => setNewBlackout(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[#147A45] text-white text-xs font-medium hover:bg-[#0D5932]"
          >
            Add Date
          </button>
        </form>

        <div className="flex flex-wrap gap-2 pt-1 text-xs">
          {settings.blackoutDates.map((d) => (
            <span
              key={d}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-mono text-xs"
            >
              {d}
              <button
                type="button"
                onClick={() => toggleBlackoutDate(d)}
                className="text-slate-400 hover:text-rose-600 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Newsletter Subscribers Roster */}
      <div className="p-6 rounded-2xl border border-[#DDE7DF] bg-white shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#DDE7DF] pb-3">
          <div>
            <h3 className="font-display font-bold text-[#0A1F14] text-base">
              The Sable Note — Newsletter Subscriber Roster
            </h3>
            <p className="text-xs text-[#66756A]">
              Collected from the footer monthly note intake form ({subscribers.length} total).
            </p>
          </div>
          <span className="font-mono text-xs font-bold text-[#147A45]">
            {subscribers.length} subscribers
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {subscribers.map((email) => (
            <span
              key={email}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6EFE9] border border-[#C5D9CB] text-[#147A45] text-xs font-mono"
            >
              <Mail size={12} /> {email}
            </span>
          ))}
        </div>
      </div>

      {/* Demo Reset Danger Zone */}
      <div className="p-6 rounded-2xl border border-rose-200 bg-rose-50/50 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-rose-900 text-sm">
            Showcase Demo Data Reset
          </h4>
          <p className="text-xs text-rose-700 mt-0.5">
            Reset all appointments, retail orders, inquiries, and settings to their pristine showcase defaults.
          </p>
        </div>

        <button
          type="button"
          onClick={handleConfirmReset}
          className="px-4 py-2 rounded-xl bg-white border border-rose-300 text-rose-700 text-xs font-bold hover:bg-rose-100 transition-colors shadow-2xs flex items-center gap-1.5 shrink-0"
        >
          <RotateCcw size={13} /> Reset Demo Data
        </button>
      </div>
    </div>
  );
}
