import { useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight, Check, Copy, MapPin, Navigation, Phone, Route } from "lucide-react";
import { toast } from "sonner";
import { StudioMap } from "@/components/StudioMap";
import { PageEyebrow, SiteShell, StudioStatus } from "@/components/SiteShell";
import { getStudioStatus } from "@/hooks/useScrollMotion";

const ADDRESS = "118 Pine Street, Seattle, WA 98101";
const MAPS_URL = "https://maps.google.com/?q=118+Pine+Street+Seattle+WA";
const PHONE_DISPLAY = "(206) 555-0198";
const PHONE_HREF = "tel:+12065550198";
const DIRECTIONS = [
  "Sable Hair Studio — 118 Pine Street, Seattle, WA 98101",
  "Light rail: Westlake Station, then a 6 minute walk up Pine.",
  "Driving: street parking on Pine is free after 6pm; paid garages on 2nd Ave.",
  "Look for the emerald stroke on the glass at street level.",
].join("\n");

type FormState = { name: string; email: string; topic: string; message: string };
const initial: FormState = { name: "", email: "", topic: "Booking help", message: "" };

export default function Visit() {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const status = getStudioStatus();

  function set<K extends keyof FormState>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function copy(text: string, message: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(message);
    } catch {
      toast.info("Copy this instead.", { description: text });
    }
  }

  const copyAddress = () => copy(ADDRESS, "Address copied.");
  const copyPhone = () => copy(PHONE_DISPLAY, "Phone number copied.");
  const copyDirections = () => copy(DIRECTIONS, "Directions copied.");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Partial<FormState> = {};
    if (form.name.trim().length < 2) next.name = "Tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Enter a valid email.";
    if (form.message.trim().length < 10) next.message = "Add a little detail (10+ characters).";
    setErrors(next);
    if (Object.keys(next).length) {
      toast.error("A few fields need attention.", { description: "Check the highlighted fields below." });
      return;
    }
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setSent(true);
      toast.success(`Thanks, ${form.name.trim().split(" ")[0]} — message saved (demo).`, {
        description: "We reply Tue–Sun during studio hours. Nothing was sent to a server.",
      });
    }, 800);
  }

  return (
    <SiteShell>
      <section className="page-hero">
        <div data-reveal="left">
          <PageEyebrow>Come by the studio</PageEyebrow>
          <h1>Find a little <em>time for you.</em></h1>
        </div>
        <div data-reveal="right" style={{ "--rd": "90ms" } as React.CSSProperties}>
          <p>Downtown Seattle, two blocks from the market. Walk-ins for retail — appointments for the chair.</p>
          <StudioStatus className="page-status" />
        </div>
      </section>

      <section className="visit-layout">
        <div>
          <div className="visit-cards">
            <div className="visit-card" data-reveal="up">
              <span><MapPin size={18} /></span>
              <span><b>{ADDRESS}</b><small>Tue–Fri 9–6 · Sat–Sun 10–5 · Closed Mon</small></span>
              <div className="flex gap-1.5">
                <button className="mini-ghost" onClick={copyAddress} aria-label="Copy address"><Copy size={13} /> Copy</button>
                <a className="mini-book" href={MAPS_URL} target="_blank" rel="noreferrer">Open in Maps <ArrowUpRight size={13} /></a>
              </div>
            </div>
            <div className="visit-card" data-reveal="up" style={{ "--rd": "80ms" } as React.CSSProperties}>
              <span><Phone size={18} /></span>
              <span><b>{PHONE_DISPLAY}</b><small>Demo line — tapping calls in a real browser</small></span>
              <div className="flex gap-1.5">
                <button className="mini-ghost" onClick={copyPhone}><Copy size={13} /> Copy</button>
                <a
                  className="mini-book"
                  href={PHONE_HREF}
                  onClick={() => toast.info("Placing a demo call…", { description: PHONE_DISPLAY })}
                >
                  Call
                </a>
              </div>
            </div>
            <div className="visit-card" data-reveal="up" style={{ "--rd": "160ms" } as React.CSSProperties}>
              <span><Navigation size={18} /></span>
              <span><b>Getting here</b><small>Light rail to Westlake · Street parking on Pine after 6</small></span>
              <button className="mini-ghost" onClick={copyDirections}><Route size={13} /> Directions</button>
            </div>
          </div>

          <form className="visit-form" onSubmit={submit} noValidate data-reveal="up">
            {sent ? (
              <div className="bag-confirm">
                <p className="service-category">Message saved</p>
                <b>Thanks — we’ll reply during studio hours.</b>
                <span>This demo stores nothing on a server. Want to lock a time now?</span>
                <div className="flex gap-2 flex-wrap">
                  <Link href="/book" className="primary-cta !py-2.5">Build your visit <ArrowUpRight size={14} /></Link>
                  <button type="button" className="ghost-cta" onClick={() => { setSent(false); setForm(initial); }}>Send another</button>
                </div>
              </div>
            ) : (
              <>
                <h3>Ask the studio anything.</h3>
                <p>Color questions, timing, accessibility needs — a human reads every note. Demo form with validation.</p>
                <div className="form-grid">
                  <div className="form-field">
                    <label htmlFor="visit-name">Name</label>
                    <input id="visit-name" autoComplete="name" value={form.name} onChange={(e) => set("name", e.target.value)} aria-invalid={Boolean(errors.name)} placeholder="Jordan Lee" />
                    {errors.name && <span className="field-error">{errors.name}</span>}
                  </div>
                  <div className="form-field">
                    <label htmlFor="visit-email">Email</label>
                    <input id="visit-email" type="email" autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)} aria-invalid={Boolean(errors.email)} placeholder="you@example.com" />
                    {errors.email && <span className="field-error">{errors.email}</span>}
                  </div>
                  <div className="form-field full">
                    <label htmlFor="visit-topic">Topic</label>
                    <select id="visit-topic" value={form.topic} onChange={(e) => set("topic", e.target.value)}>
                      <option>Booking help</option>
                      <option>Color consultation</option>
                      <option>Membership question</option>
                      <option>Accessibility or sensory needs</option>
                      <option>Something else</option>
                    </select>
                  </div>
                  <div className="form-field full">
                    <label htmlFor="visit-message">Message</label>
                    <textarea id="visit-message" rows={5} value={form.message} onChange={(e) => set("message", e.target.value)} aria-invalid={Boolean(errors.message)} placeholder="Tell us about your hair now and where you want it to go…" />
                    {errors.message && <span className="field-error">{errors.message}</span>}
                  </div>
                </div>
                <button className="primary-cta w-full !py-3" type="submit" disabled={sending}>
                  {sending ? "Saving demo message…" : "Send message"} <ArrowUpRight size={16} />
                </button>
                <small className="text-[#4E5B51] text-[11px]">Demo only — validated locally, confirmed with a toast.</small>
              </>
            )}
          </form>
        </div>

        <div className="visit-map">
          <div className="visit-map-frame map-frame" data-reveal="scale">
            <StudioMap />
          </div>
          <div className="visit-card" data-reveal="up">
            <span><Check size={18} /></span>
            <span>
              <b>{status.open ? "We’re open right now" : "Closed at the moment"}</b>
              <small>{status.label} · Look for the emerald stroke on the glass</small>
            </span>
            <Link href="/book" className="mini-book">Book <ArrowUpRight size={13} /></Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
