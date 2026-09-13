import { useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight, Check, Copy, MapPin, Navigation, Phone } from "lucide-react";
import { toast } from "sonner";
import { MapView } from "@/components/Map";
import { PageEyebrow, SiteShell } from "@/components/SiteShell";

const ADDRESS = "118 Pine Street, Seattle, WA 98101";
const MAPS_URL = "https://maps.google.com/?q=118+Pine+Street+Seattle+WA";
const PHONE_DISPLAY = "(206) 555-0198";
const PHONE_HREF = "tel:+12065550198";
const STUDIO_POS = { lat: 47.6119, lng: -122.3378 };

type FormState = { name: string; email: string; topic: string; message: string };
const initial: FormState = { name: "", email: "", topic: "Booking help", message: "" };

export default function Visit() {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);

  function set<K extends keyof FormState>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function copyAddress() {
    navigator.clipboard
      ?.writeText(ADDRESS)
      .then(() => toast.success("Address copied.", { description: ADDRESS }))
      .catch(() => toast.info("Copy this address.", { description: ADDRESS }));
  }

  function copyPhone() {
    navigator.clipboard
      ?.writeText(PHONE_DISPLAY)
      .then(() => toast.success("Phone number copied.", { description: PHONE_DISPLAY }))
      .catch(() => toast.info("Call us at.", { description: PHONE_DISPLAY }));
  }

  function recenter() {
    if (mapRef.current) {
      mapRef.current.setCenter(STUDIO_POS);
      mapRef.current.setZoom(16);
      toast.success("Map centered on the studio.", { description: ADDRESS });
    } else {
      toast.info("Map is still loading.", { description: "Try again in a moment." });
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Partial<FormState> = {};
    if (form.name.trim().length < 2) next.name = "Tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.message && form.email.trim())) next.email = "Enter a valid email.";
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
        <div className="page-rail" aria-hidden="true"><span>06 / VISIT</span></div>
        <div>
          <PageEyebrow>Come by the studio</PageEyebrow>
          <h1>Find a little <em>time for you.</em></h1>
        </div>
        <p>Downtown Seattle, two blocks from the market. Walk-ins for retail — appointments for the chair.</p>
      </section>

      <section className="visit-layout">
        <div>
          <div className="visit-cards">
            <div className="visit-card">
              <span><MapPin size={18} /></span>
              <span><b>{ADDRESS}</b><small>Tue–Fri 9–6 · Sat–Sun 10–5 · Closed Mon</small></span>
              <div className="flex gap-1.5">
                <button className="mini-ghost" onClick={copyAddress} aria-label="Copy address"><Copy size={13} /> Copy</button>
                <a className="mini-book" href={MAPS_URL} target="_blank" rel="noreferrer">Open in Maps <ArrowUpRight size={13} /></a>
              </div>
            </div>
            <div className="visit-card">
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
            <div className="visit-card">
              <span><Navigation size={18} /></span>
              <span><b>Getting here</b><small>Light rail to Westlake · Street parking on Pine after 6</small></span>
              <button className="mini-ghost" onClick={recenter}>Center map</button>
            </div>
          </div>

          <form className="visit-form" onSubmit={submit} noValidate>
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
                <small className="text-[#68778a] text-[11px]">Demo only — validated locally, confirmed with a toast.</small>
              </>
            )}
          </form>
        </div>

        <div className="visit-map">
          <div className="visit-map-frame">
            <MapFallbackWrap mapRef={mapRef} />
          </div>
          <div className="visit-card">
            <span><Check size={18} /></span>
            <span><b>Look for the cobalt mark</b><small>Street-level studio with the angled blue stroke on glass</small></span>
            <Link href="/book" className="mini-book">Book <ArrowUpRight size={13} /></Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function MapFallbackWrap({ mapRef }: { mapRef: React.MutableRefObject<google.maps.Map | null> }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="map-fallback">
        <MapPin size={26} className="mx-auto text-[#2a5bff]" />
        <b>{ADDRESS}</b>
        <span>Live map unavailable offline — open it in Google Maps instead.</span>
        <a className="mini-book mx-auto" href={MAPS_URL} target="_blank" rel="noreferrer">
          Open in Maps <ArrowUpRight size={13} />
        </a>
      </div>
    );
  }

  return (
    <MapErrorBoundary onError={() => setFailed(true)}>
      <MapView
        className="h-[380px] w-full"
        initialCenter={STUDIO_POS}
        initialZoom={16}
        onMapReady={(map) => {
          mapRef.current = map;
          try {
            new window.google.maps.marker.AdvancedMarkerElement({
              map,
              position: STUDIO_POS,
              title: "Sable Hair Studio — 118 Pine St",
            });
          } catch {
            new window.google.maps.Marker({ map, position: STUDIO_POS, title: "Sable Hair Studio" });
          }
        }}
      />
    </MapErrorBoundary>
  );
}

import { Component, type ReactNode } from "react";

class MapErrorBoundary extends Component<{ children: ReactNode; onError: () => void }> {
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.props.children;
  }
}
