import { withBase } from "@/lib/withBase";
/** Chromatic Cut page: a human, straightforward studio story with practical contact details. */
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight, CalendarHeart, Copy, Heart, MapPin, Phone, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageEyebrow, SiteShell } from "@/components/SiteShell";
import { stylists, type Stylist } from "@/lib/salon-data";
import { shareLink, useStudio } from "@/contexts/StudioStore";

const ADDRESS = "118 Pine Street, Seattle, WA 98101";

export default function About() {
  const { toggleSavedStylist, isSavedStylist } = useStudio();
  const chairParam = new URLSearchParams(window.location.search).get("chair") ?? "";
  const [focus, setFocus] = useState<Stylist | null>(() => stylists.find((s) => s.id === chairParam) ?? null);

  useEffect(() => {
    if (chairParam) {
      const found = stylists.find((s) => s.id === chairParam);
      if (found) setFocus(found);
    }
  }, [chairParam]);

  function copyAddress() {
    navigator.clipboard
      ?.writeText(ADDRESS)
      .then(() => toast.success("Address copied.", { description: ADDRESS }))
      .catch(() => toast.info("Copy this address.", { description: ADDRESS }));
  }

  function step(dir: 1 | -1) {
    if (!focus) {
      setFocus(stylists[0]);
      return;
    }
    const idx = stylists.findIndex((s) => s.id === focus.id);
    setFocus(stylists[(idx + dir + stylists.length) % stylists.length]);
  }

  return (
    <SiteShell>
      <section className="about-hero"><div className="page-rail" aria-hidden="true"><span>06 / ABOUT</span></div><div className="about-copy"><div data-reveal="left"><PageEyebrow>A different kind of salon calendar</PageEyebrow><h1>We make space for a <em>better conversation.</em></h1></div><p data-reveal="left" style={{ "--rd": "70ms" } as React.CSSProperties}>Sable started with a simple belief: better hair is built through shared context. The right specialist, enough time, a clear plan — none of that should be hidden behind a generic booking button.</p><div className="hero-actions" data-reveal="left" style={{ "--rd": "130ms" } as React.CSSProperties}><Link href="/book" className="primary-cta">Meet your next chair <ArrowUpRight size={17} /></Link><Link href="/visit" className="text-cta">Visit the studio <ArrowUpRight size={16} /></Link></div></div><div className="about-image" data-reveal="right" style={{ "--rd": "90ms" } as React.CSSProperties}><img src={withBase("/images/sable-salon-interior_5d74e433.jpg")} alt="The airy, contemporary Sable salon interior" /><span className="about-image-caption">118 PINE STREET<br />SEATTLE, WA</span></div></section>
      <section className="studio-principles"><div data-reveal="left"><PageEyebrow>How we hold the room</PageEyebrow><h2>Personal, but never <em>precious.</em></h2></div><div className="principle-list"><article data-reveal="up" style={{ "--rd": "0ms" } as React.CSSProperties}><span>01</span><h3>Expertise is a conversation.</h3><p>We explain the trade-offs, the maintenance, and the next best move — in plain language.</p></article><article data-reveal="up" style={{ "--rd": "90ms" } as React.CSSProperties}><span>02</span><h3>Health makes the finish possible.</h3><p>Every significant color or texture decision starts with what the hair can actually support.</p></article><article data-reveal="up" style={{ "--rd": "180ms" } as React.CSSProperties}><span>03</span><h3>Time is part of the service.</h3><p>Real work needs real appointment windows, so the booking system protects them from the start.</p></article></div></section>
      <section className="team-section">
        <div className="team-heading" data-reveal="left"><PageEyebrow>Meet the chairs</PageEyebrow><h2>Specialists with a <em>specific point of view.</em></h2></div>
        <div className="team-grid">
          {stylists.map((stylist, index) => {
            const saved = isSavedStylist(stylist.id);
            return (
              <article
                className="team-card"
                key={stylist.id}
                data-reveal="up"
                style={{ "--rd": `${index * 80}ms` } as React.CSSProperties}
              >
                <div className="team-card-top">
                  <div className="team-avatar" style={{ backgroundColor: stylist.accent }}>{stylist.initials}</div>
                  <div className="flex gap-1.5">
                    <button className={saved ? "icon-btn saved" : "icon-btn"} aria-label={saved ? `Unsave ${stylist.name}` : `Save ${stylist.name}`} aria-pressed={saved} onClick={() => toggleSavedStylist(stylist.id, stylist.name)}>
                      <Heart size={15} fill={saved ? "currentColor" : "none"} />
                    </button>
                    <button className="icon-btn" aria-label={`Share ${stylist.name}`} onClick={() => shareLink(stylist.name, `${stylist.role} at Sable Hair Studio`)}>
                      <Share2 size={15} />
                    </button>
                  </div>
                </div>
                <p className="service-category">{stylist.role}</p>
                <h3>{stylist.name}</h3>
                <p>{stylist.bio}</p>
                <span>{stylist.specialties.join(" · ")}</span>
                <div className="mt-3">
                  <button className="text-cta !text-[12px]" onClick={() => setFocus(stylist)}>Chair story <ArrowUpRight size={14} /></button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <section className="contact-section">
        <div data-reveal="left"><PageEyebrow>Come by</PageEyebrow><h2>Find a little <em>time for you.</em></h2><p>{ADDRESS}<br />Tuesday–Friday 9–6 · Saturday–Sunday 10–5</p>
          <div className="flex gap-2 mt-4 flex-wrap">
            <button className="ghost-cta !bg-white/60" onClick={copyAddress}><Copy size={14} /> Copy address</button>
            <Link href="/visit" className="text-cta">Hours, map & contact <ArrowUpRight size={15} /></Link>
          </div>
        </div>
        <div className="contact-actions" data-reveal="right" style={{ "--rd": "80ms" } as React.CSSProperties}>
          <a href="https://maps.google.com/?q=118+Pine+Street+Seattle+WA" target="_blank" rel="noreferrer" className="contact-action"><MapPin size={20} /><span><b>Directions</b><small>Open maps</small></span><ArrowUpRight size={17} /></a>
          <a href="tel:+12065550198" className="contact-action" onClick={() => toast.info("Demo call — (206) 555-0198", { description: "Tapping dials in a real browser." })}><Phone size={20} /><span><b>Call the studio</b><small>(206) 555-0198</small></span><ArrowUpRight size={17} /></a>
          <Link href="/book" className="contact-action"><CalendarHeart size={20} /><span><b>Book online</b><small>Start an appointment plan</small></span><ArrowUpRight size={17} /></Link>
        </div>
      </section>

      <Dialog open={focus !== null} onOpenChange={(v) => { if (!v) setFocus(null); }}>
        <DialogContent className="sm:max-w-lg">
          {focus && (
            <>
              <DialogHeader className="text-left">
                <p className="service-category">{focus.role}</p>
                <DialogTitle className="font-display text-3xl tracking-tight">{focus.name}</DialogTitle>
                <DialogDescription className="text-[14px] leading-relaxed">{focus.bio}</DialogDescription>
              </DialogHeader>
              <div className="stylist-dialog-meta">
                {focus.specialties.map((s) => <span key={s} className="stylist-chip">{s}</span>)}
              </div>
              <p className="text-[13px] leading-relaxed text-[#38443B]">
                {focus.id === "mara" && "Mara leads color direction — expect a frank grow-out plan and a gloss sequence mapped before lightener touches hair."}
                {focus.id === "noa" && "Noa cuts with the calendar in mind: shapes that hold their line at week six, not just day one."}
                {focus.id === "sofia" && "Sofia pairs texture expertise with health-first smoothing — she will talk you out of work your hair can't support."}
                {focus.id === "eli" && "Eli runs the grooming chair with quiet precision: short cuts, beard lines, and finishes that stay sharp."}
              </p>
              <div className="flex gap-2 flex-wrap mt-2">
                <Link href="/book" className="primary-cta" onClick={() => setFocus(null)}>Book with {focus.name.split(" ")[0]} <ArrowUpRight size={15} /></Link>
                <button className="ghost-cta" onClick={() => toggleSavedStylist(focus.id, focus.name)}>
                  <Heart size={14} /> {isSavedStylist(focus.id) ? "Saved" : "Save chair"}
                </button>
                <button className="ghost-cta" onClick={() => shareLink(focus.name, focus.bio)}><Share2 size={14} /> Share</button>
              </div>
              <div className="quickview-nav !px-0">
                <button onClick={() => step(-1)}>← Prev chair</button>
                <span>{stylists.findIndex((s) => s.id === focus.id) + 1} / {stylists.length}</span>
                <button onClick={() => step(1)}>Next chair →</button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </SiteShell>
  );
}
