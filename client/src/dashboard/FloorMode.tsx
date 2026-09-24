import { useState, useEffect, useMemo } from "react";
import { useStudio } from "@/contexts/StudioStore";
import { stylists, Service } from "@/lib/salon-data";
import { SalonAppointment, AppointmentStatus, getIsoDateOffset } from "@/lib/defaultStudioData";
import { APPOINTMENT_STATUS_CONFIG, formatCurrency } from "./dashboardUtils";
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Clock,
  User,
  Armchair,
  CheckCircle2,
  Bell,
  Volume2,
  VolumeX,
  ChevronRight,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { toast } from "sonner";

interface FloorModeProps {
  onClose: () => void;
}

export default function FloorMode({ onClose }: FloorModeProps) {
  const { appointments, updateAppointmentStatus } = useStudio();
  const todayStr = useMemo(() => getIsoDateOffset(0), []);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timers, setTimers] = useState<Record<string, { secondsLeft: number; isRunning: boolean }>>({
    mara: { secondsLeft: 1200, isRunning: false }, // 20m gloss
    noa: { secondsLeft: 0, isRunning: false },
    sofia: { secondsLeft: 2700, isRunning: false }, // 45m keratin
    eli: { secondsLeft: 0, isRunning: false },
  });

  // Today's active appointments
  const todayApts = useMemo(() => {
    return appointments.filter((apt) => apt.dateKey === todayStr && apt.status !== "cancelled");
  }, [appointments, todayStr]);

  // Group appointments by stylist/chair
  const chairData = useMemo(() => {
    return stylists.map((stylist, idx) => {
      const chairNum = idx + 1;
      const stylistApts = todayApts.filter((apt) => apt.stylistId === stylist.id);
      const activeApt =
        stylistApts.find((apt) => apt.status === "in-chair" || apt.status === "processing") || null;
      const upcomingApts = stylistApts.filter((apt) => apt.status === "confirmed" || apt.status === "requested");
      const completedApts = stylistApts.filter((apt) => apt.status === "completed");

      return {
        stylist,
        chairNum,
        activeApt,
        upcomingApts,
        completedApts,
      };
    });
  }, [todayApts]);

  // Timer tick effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        let changed = false;
        const next = { ...prev };
        Object.keys(next).forEach((key) => {
          if (next[key].isRunning && next[key].secondsLeft > 0) {
            next[key] = { ...next[key], secondsLeft: next[key].secondsLeft - 1 };
            changed = true;
            if (next[key].secondsLeft === 0) {
              if (soundEnabled) {
                toast.success(`Timer finished for Chair: ${key.toUpperCase()}!`, {
                  description: "Color/treatment ready to rinse.",
                });
              }
            }
          }
        });
        return changed ? next : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [soundEnabled]);

  const toggleTimer = (stylistId: string) => {
    setTimers((prev) => ({
      ...prev,
      [stylistId]: {
        secondsLeft: prev[stylistId]?.secondsLeft > 0 ? prev[stylistId].secondsLeft : 1200,
        isRunning: !prev[stylistId]?.isRunning,
      },
    }));
  };

  const resetTimer = (stylistId: string, minutes = 20) => {
    setTimers((prev) => ({
      ...prev,
      [stylistId]: {
        secondsLeft: minutes * 60,
        isRunning: false,
      },
    }));
    toast.info(`Timer reset to ${minutes}m`);
  };

  const handleSeatNext = (apt: SalonAppointment) => {
    updateAppointmentStatus(apt.id, "in-chair");
    toast.success(`Seated ${apt.clientName} at Chair 0${apt.chairNumber}`);
  };

  const handleStartProcessing = (apt: SalonAppointment) => {
    updateAppointmentStatus(apt.id, "processing");
    toggleTimer(apt.stylistId);
    toast.success(`Processing timer started for ${apt.clientName}`);
  };

  const handleCompleteApt = (apt: SalonAppointment) => {
    updateAppointmentStatus(apt.id, "completed");
    setTimers((prev) => ({
      ...prev,
      [apt.stylistId]: { secondsLeft: 0, isRunning: false },
    }));
    toast.success(`Chair 0${apt.chairNumber} finished — ${apt.clientName} checked out!`);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0A1F14] text-[#F5F8F4] flex flex-col overflow-hidden">
      {/* Top Floor Bar */}
      <header className="p-4 sm:p-5 border-b border-[#147A45]/30 bg-[#0D281A] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#147A45] text-white flex items-center justify-center shadow-xs">
            <Armchair size={20} />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-display tracking-tight text-white flex items-center gap-2">
              Sable Chair Floor Mode <span className="text-xs font-mono font-bold bg-[#147A45]/40 text-[#34D399] px-2 py-0.5 rounded">LIVE</span>
            </h1>
            <p className="text-xs text-[#9BB3A2]">
              Real-time salon floor & station timer view · {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border text-xs font-medium transition-colors ${
              soundEnabled
                ? "bg-[#147A45]/20 border-[#147A45]/40 text-[#34D399]"
                : "bg-white/5 border-white/10 text-white/50"
            }`}
            title="Toggle timer chimes"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 text-xs transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-medium hover:bg-white/20 transition-colors"
          >
            <X size={15} /> Exit Floor
          </button>
        </div>
      </header>

      {/* 4 Chairs Grid */}
      <div className="flex-1 overflow-x-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 items-start">
        {chairData.map(({ stylist, chairNum, activeApt, upcomingApts, completedApts }) => {
          const timer = timers[stylist.id] || { secondsLeft: 0, isRunning: false };
          const hasTimer = timer.secondsLeft > 0;

          return (
            <div
              key={stylist.id}
              className="rounded-2xl border border-[#147A45]/25 bg-[#0D281A]/80 backdrop-blur-md flex flex-col overflow-hidden shadow-lg h-full max-h-[calc(100vh-100px)]"
            >
              {/* Chair Header */}
              <div className="p-4 border-b border-[#147A45]/20 bg-[#143825]/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-slate-900 shadow-xs"
                    style={{ backgroundColor: stylist.accent }}
                  >
                    {stylist.initials}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm leading-tight">{stylist.name}</h3>
                    <p className="text-[11px] text-[#9BB3A2]">Chair 0{chairNum} · {stylist.role}</p>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    activeApt
                      ? "bg-[#147A45] text-white animate-pulse"
                      : "bg-white/10 text-white/60"
                  }`}
                >
                  {activeApt ? "OCCUPIED" : "OPEN"}
                </span>
              </div>

              {/* Active Chair Status */}
              <div className="p-4 space-y-3 flex-1 overflow-y-auto">
                {activeApt ? (
                  <div className="rounded-xl border border-[#34D399]/30 bg-[#147A45]/20 p-4 space-y-3 shadow-inner">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[#34D399] font-bold">{activeApt.id}</span>
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                        {activeApt.status === "processing" ? "Processing Color" : "In Chair"}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-display text-base text-white font-semibold">
                        {activeApt.clientName}
                      </h4>
                      <p className="text-xs text-[#9BB3A2] mt-0.5">
                        {activeApt.serviceName} ({activeApt.duration}m) · {activeApt.timeSlot}
                      </p>
                    </div>

                    {/* Timer Box for Color / Treatments */}
                    <div className="p-3 rounded-lg bg-black/30 border border-white/10 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase font-bold text-[#9BB3A2] flex items-center gap-1">
                          <Clock size={11} /> Color / Process Timer
                        </span>
                        <div className="font-mono text-xl font-bold tracking-wider text-white">
                          {formatSeconds(timer.secondsLeft)}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => toggleTimer(stylist.id)}
                          className={`p-2 rounded-lg font-bold text-xs ${
                            timer.isRunning
                              ? "bg-amber-500 text-black hover:bg-amber-400"
                              : "bg-[#147A45] text-white hover:bg-[#1E9E5B]"
                          }`}
                        >
                          {timer.isRunning ? <Pause size={14} /> : <Play size={14} />}
                        </button>
                        <button
                          onClick={() => resetTimer(stylist.id, 20)}
                          className="p-2 rounded-lg bg-white/10 text-white/80 hover:bg-white/20"
                          title="Reset 20m"
                        >
                          <RotateCcw size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Stage Advancers */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {activeApt.status === "in-chair" && (
                        <button
                          onClick={() => handleStartProcessing(activeApt)}
                          className="py-2 px-3 rounded-lg bg-purple-600/80 hover:bg-purple-600 text-white font-medium text-xs text-center transition-colors"
                        >
                          Start Timer
                        </button>
                      )}
                      <button
                        onClick={() => handleCompleteApt(activeApt)}
                        className="col-span-2 py-2 px-3 rounded-lg bg-[#147A45] hover:bg-[#1E9E5B] text-white font-medium text-xs text-center transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <CheckCircle2 size={13} /> Complete & Checkout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-xl border border-dashed border-white/15 bg-white/5 text-center space-y-2">
                    <Armchair size={26} className="mx-auto text-white/30" />
                    <p className="text-xs text-white/60 font-medium">Chair is sanitized & ready</p>
                  </div>
                )}

                {/* Next in Queue */}
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#9BB3A2] block">
                    Next Up ({upcomingApts.length})
                  </span>

                  {upcomingApts.length > 0 ? (
                    <div className="space-y-2">
                      {upcomingApts.slice(0, 3).map((apt) => (
                        <div
                          key={apt.id}
                          className="p-3 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between text-xs hover:border-[#147A45]/40 transition-colors"
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <b className="text-white">{apt.clientName}</b>
                              <span className="text-[10px] text-[#9BB3A2]">· {apt.timeSlot}</span>
                            </div>
                            <span className="text-[11px] text-[#9BB3A2] block">{apt.serviceName}</span>
                          </div>

                          {!activeApt && (
                            <button
                              onClick={() => handleSeatNext(apt)}
                              className="px-2.5 py-1 rounded-lg bg-[#147A45] hover:bg-[#1E9E5B] text-white font-medium text-[11px] flex items-center gap-1"
                            >
                              Seat <ChevronRight size={12} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-white/40 italic">No remaining clients today for this chair.</p>
                  )}
                </div>
              </div>

              {/* Completed Footer */}
              <div className="p-3 border-t border-[#147A45]/20 bg-[#143825]/20 text-[11px] text-[#9BB3A2] flex items-center justify-between">
                <span>Completed today:</span>
                <b className="text-white">{completedApts.length} clients</b>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
