/** Chromatic Cut page: a calm desk-like booking sequence with real duration, fit, and policy logic. */
import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { AlertCircle, ArrowLeft, ArrowUpRight, CalendarDays, Check, CircleDollarSign, Clock3, ShieldCheck, UserRound } from "lucide-react";
import { PageEyebrow, SiteShell } from "@/components/SiteShell";
import { formatAppointmentDate, getAvailableSlots, getCancellationWindow, getCompatibleStylists, getDateOptions, getDepositAmount, getService, services } from "@/lib/salon-data";

export default function Booking() {
  const [location] = useLocation();
  const defaultService = new URLSearchParams(location.split("?")[1]).get("service") ?? "";
  const [serviceId, setServiceId] = useState(defaultService);
  const [isNewClient, setIsNewClient] = useState(true);
  const [stylistId, setStylistId] = useState("");
  const [dateKey, setDateKey] = useState("");
  const [time, setTime] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const dates = useMemo(() => getDateOptions(), []);
  const service = getService(serviceId);
  const compatibleStylists = getCompatibleStylists(serviceId);
  const slots = getAvailableSlots(stylistId, serviceId, dateKey);
  const consultationRequired = Boolean(service?.chemical && isNewClient);
  const deposit = getDepositAmount(service);
  const canConfirm = Boolean(serviceId && stylistId && dateKey && time);

  function selectService(nextService: string) {
    setServiceId(nextService);
    setStylistId("");
    setDateKey("");
    setTime("");
    setConfirmed(false);
  }

  function selectStylist(nextStylist: string) {
    setStylistId(nextStylist);
    setDateKey("");
    setTime("");
  }

  function selectDate(nextDate: string) {
    setDateKey(nextDate);
    setTime("");
  }

  if (confirmed && service) {
    return (
      <SiteShell>
        <section className="booking-confirmation"><div className="confirmation-card"><div className="confirmation-icon"><Check size={30} /></div><PageEyebrow>{consultationRequired ? "Consultation requested" : "Appointment held"}</PageEyebrow><h1>{consultationRequired ? <>Let’s start with the <em>right questions.</em></> : <>Your chair is <em>on the calendar.</em></>}</h1><p>{consultationRequired ? `Your ${service.name} request has been saved. We will use your ${formatAppointmentDate(dateKey).toLowerCase()} consultation window to confirm a service plan, patch-test needs, and the right appointment length before reserving the full visit.` : `Your ${service.name} appointment with ${compatibleStylists.find((stylist) => stylist.id === stylistId)?.name} is held for ${formatAppointmentDate(dateKey)} at ${time}.`}</p><div className="confirmation-details"><div><span>{consultationRequired ? "First step" : "When"}</span><b>{consultationRequired ? `${formatAppointmentDate(dateKey)} · ${time}` : `${formatAppointmentDate(dateKey)} · ${time}`}</b></div><div><span>{consultationRequired ? "Full service" : "Deposit"}</span><b>{consultationRequired ? `${service.duration} min · from $${service.price}` : deposit ? `$${deposit} due to reserve` : "No deposit required"}</b></div></div><div className="confirmation-actions"><button className="primary-cta" onClick={() => setConfirmed(false)}><ArrowLeft size={17} /> Edit request</button><Link href="/services" className="text-cta">Explore services <ArrowUpRight size={16} /></Link></div></div></section>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <section className="booking-header"><div className="page-rail" aria-hidden="true"><span>04 / BOOK</span></div><div><PageEyebrow>Appointment planner</PageEyebrow><h1>The right service.<br /><em>The right amount of time.</em></h1></div><p>Choose the work first. We will only show specialists and slots that can properly accommodate it.</p></section>
      <section className="booking-layout">
        <div className="booking-steps">
          <section className="booking-step"><div className="step-title"><span>01</span><div><h2>What are we making time for?</h2><p>Prices and timing are visible before you commit.</p></div></div><div className="booking-service-grid">{services.map((item) => <button key={item.id} className={serviceId === item.id ? "booking-service selected" : "booking-service"} onClick={() => selectService(item.id)}><span>{item.category}</span><b>{item.name}</b><small>{item.duration} min · ${item.price}</small></button>)}</div></section>

          <section className={service ? "booking-step" : "booking-step muted-step"}><div className="step-title"><span>02</span><div><h2>Are you new to Sable?</h2><p>We ask so chemical services begin safely and with context.</p></div></div><div className="choice-pair"><button className={isNewClient ? "choice-card selected" : "choice-card"} onClick={() => setIsNewClient(true)}><UserRound size={18} /><b>First visit</b><small>I am new to Sable</small></button><button className={!isNewClient ? "choice-card selected" : "choice-card"} onClick={() => setIsNewClient(false)}><Check size={18} /><b>Returning client</b><small>I have a service history</small></button></div>{consultationRequired && <div className="consultation-notice"><ShieldCheck size={19} /><p><b>Consultation required before confirmation.</b> Because this is your first chemical-service visit, we will start with a 15-minute consultation or patch-test step. Your full service is not confirmed until it is complete.</p></div>}</section>

          <section className={service ? "booking-step" : "booking-step muted-step"}><div className="step-title"><span>03</span><div><h2>Who should take the chair?</h2><p>Only specialists who provide this service are shown.</p></div></div>{service ? <div className="stylist-options">{compatibleStylists.map((stylist) => <button key={stylist.id} className={stylistId === stylist.id ? "stylist-option selected" : "stylist-option"} onClick={() => selectStylist(stylist.id)}><span className="initial-avatar" style={{ backgroundColor: stylist.accent }}>{stylist.initials}</span><span><b>{stylist.name}</b><small>{stylist.role}</small></span><em>{stylist.specialties.slice(0, 2).join(" · ")}</em></button>)}</div> : <p className="step-empty">Choose a service to meet your available specialists.</p>}</section>

          <section className={stylistId ? "booking-step" : "booking-step muted-step"}><div className="step-title"><span>04</span><div><h2>Find a real opening.</h2><p>Slots only appear when there is enough consecutive time for your selected service.</p></div></div><div className="date-options">{dates.map((date) => <button key={date.value} className={dateKey === date.value ? "date-option selected" : "date-option"} onClick={() => selectDate(date.value)}><span>{date.day}</span><b>{date.number}</b><small>{date.month}</small></button>)}</div>{dateKey && <div className="time-slots">{slots.length ? slots.map((slot) => <button key={slot} className={time === slot ? "time-slot selected" : "time-slot"} onClick={() => setTime(slot)}>{slot}</button>) : <div className="no-slots"><AlertCircle size={18} /> This specialist does not have a contiguous {service?.duration}-minute window on this date. Try another day.</div>}</div>}</section>
        </div>
        <aside className="booking-summary" aria-live="polite"><div className="summary-top"><PageEyebrow>Your visit</PageEyebrow><span className="summary-status">In progress</span></div>{service ? <><h2>{service.name}</h2><p className="summary-date"><CalendarDays size={16} /> {dateKey ? formatAppointmentDate(dateKey) : "Date to be selected"}</p><p className="summary-date"><Clock3 size={16} /> {time || "Time to be selected"}</p><div className="summary-line"><span>Service length</span><b>{service.duration} min</b></div><div className="summary-line"><span>Service total</span><b>${service.price}</b></div><div className="summary-line"><span>Deposit to reserve</span><b>{deposit ? `$${deposit}` : "None"}</b></div><div className="summary-policy"><CircleDollarSign size={18} /><p><b>{getCancellationWindow(service)}-hour change window</b><small>Outside this window, deposits can be moved forward. Inside it, the deposit may be retained for the protected chair time.</small></p></div>{consultationRequired && <div className="summary-gate"><ShieldCheck size={18} /><span>First-service consult required</span></div>}<button className="primary-cta summary-cta" disabled={!canConfirm} onClick={() => setConfirmed(true)}>{consultationRequired ? "Request consultation" : "Hold this appointment"}<ArrowUpRight size={17} /></button><p className="summary-footnote">No payment is processed in this demo. The service logic, timing, consultation gate, and policy state are fully interactive.</p></> : <div className="summary-empty"><CalendarDays size={24} /><p>Select a service to start building an appointment that fits.</p></div>}</aside>
      </section>
    </SiteShell>
  );
}
