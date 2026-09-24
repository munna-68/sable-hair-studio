/** Chromatic Cut page: a calm desk-like booking sequence with real duration, fit, and policy logic. */
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  CalendarDays,
  Check,
  CircleDollarSign,
  Clock3,
  ExternalLink,
  Phone,
  Mail,
  User,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { PageEyebrow, SiteShell } from "@/components/SiteShell";
import {
  formatAppointmentDate,
  getAvailableSlots,
  getCancellationWindow,
  getCompatibleStylists,
  getDateOptions,
  getDepositAmount,
  stylists,
} from "@/lib/salon-data";
import { shareLink, useStudio } from "@/contexts/StudioStore";
import { SalonAppointment } from "@/lib/defaultStudioData";

export default function Booking() {
  const [location] = useLocation();
  const queryService = new URLSearchParams(location.split("?")[1]).get("service") ?? "";
  const { services, appointments, settings, addAppointment, addToBag } = useStudio();

  const [serviceId, setServiceId] = useState(queryService);
  const [isNewClient, setIsNewClient] = useState(true);
  const [stylistId, setStylistId] = useState("");
  const [dateKey, setDateKey] = useState("");
  const [time, setTime] = useState("");

  // Client Details state
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientNotes, setClientNotes] = useState("");

  const [createdApt, setCreatedApt] = useState<SalonAppointment | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const dates = useMemo(() => getDateOptions(14), []);
  const service = useMemo(() => services.find((s) => s.id === serviceId), [services, serviceId]);
  const compatibleStylists = useMemo(() => getCompatibleStylists(serviceId, service), [serviceId, service]);
  const slots = useMemo(() => {
    return getAvailableSlots(stylistId, serviceId, dateKey, {
      existingAppointments: appointments,
      blackoutDates: settings.blackoutDates,
      operatingHours: settings.operatingHours,
      serviceObj: service,
    });
  }, [stylistId, serviceId, dateKey, appointments, settings.blackoutDates, settings.operatingHours, service]);

  const consultationRequired = Boolean(service?.chemical && isNewClient);
  const deposit = getDepositAmount(service);

  const canConfirm = Boolean(
    serviceId && stylistId && dateKey && time && clientName.trim() && clientEmail.trim()
  );

  useEffect(() => {
    if (queryService && queryService !== serviceId) {
      const found = services.find((s) => s.id === queryService);
      if (found) {
        setServiceId(queryService);
        setStylistId("");
        setDateKey("");
        setTime("");
        setConfirmed(false);
        setCreatedApt(null);
        toast.info(`Planner started with ${found.name}.`, {
          description: `${found.duration} min · from $${found.price}`,
        });
      }
    }
  }, [queryService, services]);

  function selectService(nextService: string) {
    const found = services.find((s) => s.id === nextService);
    setServiceId(nextService);
    setStylistId("");
    setDateKey("");
    setTime("");
    setConfirmed(false);
    setCreatedApt(null);
    if (found) toast.success(`${found.name} selected.`, { description: "Now meet the chairs qualified for it." });
  }

  function selectStylist(nextStylist: string) {
    setStylistId(nextStylist);
    setDateKey("");
    setTime("");
    const st = stylists.find((s) => s.id === nextStylist);
    if (st) toast.success(`${st.name} — chair held for now.`, { description: "Pick a day with enough consecutive time." });
  }

  function selectDate(nextDate: string) {
    setDateKey(nextDate);
    setTime("");
  }

  function quickFillDemoInfo() {
    setClientName("Elena Vance");
    setClientEmail("elena.vance@example.com");
    setClientPhone("(206) 555-0142");
    setClientNotes("Soft lived-in blend; low-maintenance growout.");
    toast.info("Filled with demo client profile.");
  }

  function confirm() {
    if (!service || !stylistId || !dateKey || !time) {
      toast.error("Please complete steps 1 through 4 first.");
      return;
    }

    if (!clientName.trim() || !clientEmail.trim()) {
      toast.error("Please provide your name and email address.");
      return;
    }

    const matchedStylist = stylists.find((s) => s.id === stylistId);
    const chairMap: Record<string, number> = { mara: 1, noa: 2, sofia: 3, eli: 4 };

    const newApt = addAppointment({
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      clientPhone: clientPhone.trim() || "(206) 555-0100",
      serviceId: service.id,
      serviceName: service.name,
      category: service.category,
      duration: service.duration,
      price: service.price,
      deposit: deposit,
      depositStatus: deposit > 0 ? "paid" : "waived",
      paymentStatus: deposit > 0 ? "deposit-paid" : "pending",
      stylistId,
      stylistName: matchedStylist?.name ?? "Assigned Specialist",
      chairNumber: chairMap[stylistId] || 1,
      dateKey,
      timeSlot: time,
      status: "confirmed",
      isNewClient,
      consultationRequired,
      consultationStatus: consultationRequired ? "pending" : "not-required",
      clientNotes: clientNotes.trim() || undefined,
    });

    setCreatedApt(newApt);
    setConfirmed(true);

    toast.success(
      consultationRequired ? "Consultation requested & synced!" : "Appointment reserved & synced!",
      {
        description: `${service.name} · ${formatAppointmentDate(dateKey)} at ${time}`,
      },
    );
  }

  function downloadIcs() {
    if (!service || !createdApt) return;
    const title = `Sable Hair Studio: ${service.name}`;
    const desc = `Appointment with ${createdApt.stylistName} at Sable Hair Studio (${settings.address}). Confirmation #${createdApt.id}.`;

    // Calculate exact start and end times based on slot and duration
    const match = createdApt.timeSlot.match(/^0?(\d+):(\d+)\s*(AM|PM)$/i);
    let startH = 10;
    let startM = 0;
    if (match) {
      let h = parseInt(match[1], 10);
      const m = parseInt(match[2], 10);
      const isPM = match[3].toUpperCase() === "PM";
      if (isPM && h < 12) h += 12;
      if (!isPM && h === 12) h = 0;
      startH = h;
      startM = m;
    }
    const totalStartMinutes = startH * 60 + startM;
    const totalEndMinutes = totalStartMinutes + (createdApt.duration || 60);
    const endH = Math.floor(totalEndMinutes / 60);
    const endM = totalEndMinutes % 60;

    const dtStart = `${dateKey.replace(/-/g, "")}T${String(startH).padStart(2, "0")}${String(startM).padStart(2, "0")}00`;
    const dtEnd = `${dateKey.replace(/-/g, "")}T${String(endH).padStart(2, "0")}${String(endM).padStart(2, "0")}00`;

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Sable Hair Studio//Booking//EN",
      "BEGIN:VEVENT",
      `SUMMARY:${title}`,
      `DESCRIPTION:${desc}`,
      `LOCATION:${settings.address}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `sable-visit-${createdApt.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Calendar invite downloaded (.ics)");
  }

  if (confirmed && service && createdApt) {
    return (
      <SiteShell>
        <section className="booking-confirmation">
          <div className="confirmation-card">
            <div className="confirmation-icon">
              <Check size={30} />
            </div>
            <PageEyebrow>
              {consultationRequired ? "Consultation registered" : "Appointment confirmed"}
            </PageEyebrow>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#147A45]/10 text-[#147A45] font-mono text-xs font-semibold mb-3">
              <span>CONFIRMATION:</span>
              <strong className="tracking-wider">{createdApt.id}</strong>
            </div>
            <h1>
              {consultationRequired ? (
                <>Let’s start with the <em>right questions.</em></>
              ) : (
                <>Your chair is <em>on the calendar.</em></>
              )}
            </h1>
            <p>
              {consultationRequired
                ? `Your ${service.name} request has been logged. We will use your ${formatAppointmentDate(dateKey).toLowerCase()} consultation window to confirm a service plan, patch-test needs, and the right appointment length before reserving the full visit.`
                : `Your ${service.name} appointment with ${createdApt.stylistName} is confirmed for ${formatAppointmentDate(dateKey)} at ${time}. Client intake saved for ${createdApt.clientName}.`}
            </p>

            <div className="confirmation-details">
              <div>
                <span>{consultationRequired ? "First step" : "When"}</span>
                <b>{`${formatAppointmentDate(dateKey)} · ${time}`}</b>
              </div>
              <div>
                <span>Specialist & Chair</span>
                <b>{`${createdApt.stylistName} (Chair ${createdApt.chairNumber})`}</b>
              </div>
              <div>
                <span>Client on file</span>
                <b>{createdApt.clientName}</b>
              </div>
              <div>
                <span>{consultationRequired ? "Full service" : "Deposit / Total"}</span>
                <b>
                  {consultationRequired
                    ? `${service.duration} min · from $${service.price}`
                    : deposit
                    ? `$${deposit} deposit paid · $${service.price} total`
                    : `$${service.price} due in chair`}
                </b>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#E6EFE9] border border-[#C5D9CB] text-xs text-[#0A1F14] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-[#147A45] flex items-center gap-1.5">
                  <Sparkles size={14} /> Synced live to the Owner Dashboard
                </p>
                <p className="text-[#4E5B51] mt-0.5">
                  This booking now appears instantly in Today's Chair Pass and the Appointments Queue.
                </p>
              </div>
              <Link
                href={`/dashboard/appointments`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#147A45] text-white text-xs font-medium hover:bg-[#0D5932] transition-colors whitespace-nowrap shadow-xs"
              >
                View in Owner Dashboard <ArrowUpRight size={13} />
              </Link>
            </div>

            <div className="confirmation-actions">
              <button className="primary-cta" onClick={downloadIcs}>
                <Calendar size={16} /> Add to Calendar (.ics)
              </button>
              <button
                className="ghost-cta"
                onClick={() => {
                  setConfirmed(false);
                  toast.info("Back to editing.", { description: "Your selections are intact." });
                }}
              >
                <ArrowLeft size={16} /> Edit request
              </button>
              <button className="ghost-cta" onClick={() => addToBag("service", service.id, service.name)}>
                <ShoppingBag size={15} /> Add to bag
              </button>
              <button className="ghost-cta" onClick={() => shareLink(service.name, `My Sable visit: ${service.name}`)}>
                <Share2 size={15} /> Share visit
              </button>
              <Link href="/services" className="text-cta">
                Explore services <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <section className="booking-header">
        <div data-reveal="left">
          <PageEyebrow>Appointment planner</PageEyebrow>
          <h1>The right service.<br /><em>The right amount of time.</em></h1>
        </div>
        <p data-reveal="right" style={{ "--rd": "90ms" } as React.CSSProperties}>
          Choose the work first. We will only show specialists and slots that can properly accommodate it.
        </p>
      </section>

      <section className="booking-layout">
        <div className="booking-steps">
          {/* STEP 01 */}
          <section className="booking-step" data-reveal="up">
            <div className="step-title">
              <span>01</span>
              <div>
                <h2>What are we making time for?</h2>
                <p>Prices and timing are visible before you commit.</p>
              </div>
            </div>
            <div className="booking-service-grid">
              {services.map((item) => (
                <button
                  key={item.id}
                  className={serviceId === item.id ? "booking-service selected" : "booking-service"}
                  aria-pressed={serviceId === item.id}
                  onClick={() => selectService(item.id)}
                >
                  <span>{item.category}</span>
                  <b>{item.name}</b>
                  <small>{item.duration} min · ${item.price}</small>
                </button>
              ))}
            </div>
          </section>

          {/* STEP 02 */}
          <section
            className={service ? "booking-step" : "booking-step muted-step"}
            data-reveal="up"
            style={{ "--rd": "80ms" } as React.CSSProperties}
          >
            <div className="step-title">
              <span>02</span>
              <div>
                <h2>Are you new to Sable?</h2>
                <p>We ask so chemical services begin safely and with context.</p>
              </div>
            </div>
            <div className="choice-pair">
              <button
                className={isNewClient ? "choice-card selected" : "choice-card"}
                aria-pressed={isNewClient}
                onClick={() => {
                  setIsNewClient(true);
                  toast.info("First visit — welcome.", { description: "Chemical services will start with a consult." });
                }}
              >
                <UserRound size={18} />
                <b>First visit</b>
                <small>I am new to Sable</small>
              </button>
              <button
                className={!isNewClient ? "choice-card selected" : "choice-card"}
                aria-pressed={!isNewClient}
                onClick={() => {
                  setIsNewClient(false);
                  toast.success("Welcome back.", { description: "Full booking unlocked for chemical services." });
                }}
              >
                <Check size={18} />
                <b>Returning client</b>
                <small>I have a service history</small>
              </button>
            </div>
            {consultationRequired && (
              <div className="consultation-notice">
                <ShieldCheck size={19} />
                <p>
                  <b>Consultation required before confirmation.</b> Because this is your first chemical-service visit, we will start with a 15-minute consultation or patch-test step. Your full service is not confirmed until it is complete.
                </p>
              </div>
            )}
          </section>

          {/* STEP 03 */}
          <section
            className={service ? "booking-step" : "booking-step muted-step"}
            data-reveal="up"
            style={{ "--rd": "140ms" } as React.CSSProperties}
          >
            <div className="step-title">
              <span>03</span>
              <div>
                <h2>Who should take the chair?</h2>
                <p>Only specialists who provide this service are shown.</p>
              </div>
            </div>
            {service ? (
              <div className="stylist-options">
                {compatibleStylists.map((stylist) => (
                  <button
                    key={stylist.id}
                    className={stylistId === stylist.id ? "stylist-option selected" : "stylist-option"}
                    aria-pressed={stylistId === stylist.id}
                    onClick={() => selectStylist(stylist.id)}
                  >
                    <span className="initial-avatar" style={{ backgroundColor: stylist.accent }}>
                      {stylist.initials}
                    </span>
                    <span>
                      <b>{stylist.name}</b>
                      <small>{stylist.role}</small>
                    </span>
                    <em>{stylist.specialties.slice(0, 2).join(" · ")}</em>
                  </button>
                ))}
              </div>
            ) : (
              <p className="step-empty">Choose a service to meet your available specialists.</p>
            )}
          </section>

          {/* STEP 04 */}
          <section
            className={stylistId ? "booking-step" : "booking-step muted-step"}
            data-reveal="up"
            style={{ "--rd": "200ms" } as React.CSSProperties}
          >
            <div className="step-title">
              <span>04</span>
              <div>
                <h2>Find a real opening.</h2>
                <p>Slots only appear when there is enough consecutive time for your selected service.</p>
              </div>
            </div>
            <div className="date-options">
              {dates.map((date) => {
                const isBlackout = settings.blackoutDates.includes(date.value);
                return (
                  <button
                    key={date.value}
                    className={`${dateKey === date.value ? "date-option selected" : "date-option"} ${isBlackout ? "opacity-60 border-dashed" : ""}`}
                    aria-pressed={dateKey === date.value}
                    onClick={() => {
                      if (isBlackout) {
                        toast.info("Studio closure / holiday on this date.", {
                          description: "Choose another date to view openings.",
                        });
                      }
                      selectDate(date.value);
                    }}
                  >
                    <span>{date.day}</span>
                    <b>{date.number}</b>
                    <small>{isBlackout ? "Closed" : date.month}</small>
                  </button>
                );
              })}
            </div>
            {dateKey && (
              <div className="time-slots">
                {slots.length ? (
                  slots.map((slot) => (
                    <button
                      key={slot}
                      className={time === slot ? "time-slot selected" : "time-slot"}
                      aria-pressed={time === slot}
                      onClick={() => {
                        setTime(slot);
                        toast.success(`${slot} selected.`, { description: "Add your contact details below." });
                      }}
                    >
                      {slot}
                    </button>
                  ))
                ) : (
                  <div className="no-slots">
                    <AlertCircle size={18} /> This specialist does not have a contiguous {service?.duration}-minute window on this date. Try another day.
                  </div>
                )}
              </div>
            )}
          </section>

          {/* STEP 05: Client Details */}
          <section
            className={time ? "booking-step" : "booking-step muted-step"}
            data-reveal="up"
            style={{ "--rd": "260ms" } as React.CSSProperties}
          >
            <div className="step-title">
              <span>05</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2>Who is this appointment for?</h2>
                  <button
                    type="button"
                    onClick={quickFillDemoInfo}
                    className="text-xs text-[#147A45] hover:underline font-medium flex items-center gap-1"
                  >
                    <Sparkles size={12} /> Auto-fill demo
                  </button>
                </div>
                <p>We send confirmation and appointment notes directly to you.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#0A1F14] uppercase tracking-wider">
                  Full Name <span className="text-emerald-700">*</span>
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-3.5 text-[#66756A]" />
                  <input
                    type="text"
                    placeholder="Elena Vance"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#DDE7DF] bg-white text-sm text-[#0A1F14] focus:outline-none focus:border-[#147A45] focus:ring-1 focus:ring-[#147A45]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#0A1F14] uppercase tracking-wider">
                  Email Address <span className="text-emerald-700">*</span>
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-3.5 text-[#66756A]" />
                  <input
                    type="email"
                    placeholder="elena.vance@example.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#DDE7DF] bg-white text-sm text-[#0A1F14] focus:outline-none focus:border-[#147A45] focus:ring-1 focus:ring-[#147A45]"
                  />
                </div>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-[#0A1F14] uppercase tracking-wider">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-3.5 text-[#66756A]" />
                  <input
                    type="tel"
                    placeholder="(206) 555-0142"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#DDE7DF] bg-white text-sm text-[#0A1F14] focus:outline-none focus:border-[#147A45] focus:ring-1 focus:ring-[#147A45]"
                  />
                </div>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-[#0A1F14] uppercase tracking-wider">
                  Hair Goals, Sensitivities, or Current Condition (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Grown-out balayage from 6 months ago, prefer cool water, sensitive scalp..."
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#DDE7DF] bg-white text-sm text-[#0A1F14] focus:outline-none focus:border-[#147A45] focus:ring-1 focus:ring-[#147A45]"
                />
              </div>
            </div>
          </section>
        </div>

        {/* SUMMARY ASIDE */}
        <aside className="booking-summary" aria-live="polite" data-reveal="up" style={{ "--rd": "120ms" } as React.CSSProperties}>
          <div className="summary-top">
            <PageEyebrow>Your visit</PageEyebrow>
            <span className="summary-status">In progress</span>
          </div>
          {service ? (
            <>
              <h2>{service.name}</h2>
              <p className="summary-date">
                <CalendarDays size={16} /> {dateKey ? formatAppointmentDate(dateKey) : "Date to be selected"}
              </p>
              <p className="summary-date">
                <Clock3 size={16} /> {time || "Time to be selected"}
              </p>
              {stylistId && (
                <p className="summary-date">
                  <UserRound size={16} /> {stylists.find((s) => s.id === stylistId)?.name}
                </p>
              )}
              <div className="summary-line">
                <span>Service length</span>
                <b>{service.duration} min</b>
              </div>
              <div className="summary-line">
                <span>Service total</span>
                <b>${service.price}</b>
              </div>
              <div className="summary-line">
                <span>Deposit to reserve</span>
                <b>{deposit ? `$${deposit}` : "None"}</b>
              </div>
              <div className="summary-policy">
                <CircleDollarSign size={18} />
                <p>
                  <b>{getCancellationWindow(service)}-hour change window</b>
                  <small>Outside this window, deposits can be moved forward. Inside it, the deposit may be retained for the protected chair time.</small>
                </p>
              </div>
              {consultationRequired && (
                <div className="summary-gate">
                  <ShieldCheck size={18} />
                  <span>First-service consult required</span>
                </div>
              )}
              <button
                className="primary-cta summary-cta"
                disabled={!canConfirm}
                onClick={confirm}
              >
                {consultationRequired ? "Request consultation" : "Hold this appointment"}
                <ArrowUpRight size={17} />
              </button>
              {!canConfirm && (
                <p className="text-xs text-[#66756A] text-center mt-2">
                  {!serviceId
                    ? "Select a service"
                    : !stylistId
                    ? "Select a specialist"
                    : !dateKey || !time
                    ? "Pick date & time"
                    : "Enter your name & email"}
                </p>
              )}
              <p className="summary-footnote">
                Demo showcase. Bookings sync instantly to the local studio database and Owner Dashboard.
              </p>
            </>
          ) : (
            <div className="summary-empty">
              <CalendarDays size={24} />
              <p>Select a service to start building an appointment that fits.</p>
            </div>
          )}
        </aside>
      </section>

      {/* Persistent action bar on small screens */}
      <div className={canConfirm ? "booking-dock visible" : "booking-dock"} aria-hidden={!canConfirm}>
        <div className="booking-dock-main">
          <b>{service ? service.name : "Choose a service"}</b>
          <small>
            {canConfirm
              ? `${formatAppointmentDate(dateKey)} · ${time} · ${deposit ? `$${deposit} deposit` : "no deposit"}`
              : "Complete the steps to hold a chair"}
          </small>
        </div>
        <button className="primary-cta" disabled={!canConfirm} onClick={confirm}>
          {consultationRequired ? "Request consult" : "Hold it"} <ArrowUpRight size={16} />
        </button>
      </div>
    </SiteShell>
  );
}
