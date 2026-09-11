import { withBase } from "@/lib/withBase";
/** Chromatic Cut page: editorial runway composition with cool mineral surfaces and cobalt decisions. */
import { Link } from "wouter";
import { ArrowDown, ArrowUpRight, CalendarClock, Check, Clock3, Palette, Scissors, Sparkles } from "lucide-react";
import { PageEyebrow, SiteShell } from "@/components/SiteShell";
import { services } from "@/lib/salon-data";

const featured = [services[2], services[0], services[5]];

export default function Home() {
  return (
    <SiteShell>
      <section className="hero-section">
        <div className="hero-rail" aria-hidden="true"><span>01 / STUDIO</span></div>
        <div className="hero-copy">
          <PageEyebrow>Color. Cut. Care.</PageEyebrow>
          <h1>Hair with a <em>point of view.</em></h1>
          <p className="hero-text">Sable is a detail-oriented salon for lived-in color, precision cutting, and plans that make sense after you leave the chair.</p>
          <div className="hero-actions">
            <Link href="/book" className="primary-cta">Find your appointment <ArrowUpRight size={17} /></Link>
            <a href="#approach" className="text-cta">How we work <ArrowDown size={16} /></a>
          </div>
          <div className="hero-notes"><span><b>4</b> specialist chairs</span><span><b>1:1</b> color consults</span><span><b>48h</b> chemical service window</span></div>
        </div>
        <div className="hero-image-wrap">
          <img src={withBase("/images/sable-hero-editorial_4512985d.jpg")} alt="A stylist finishing a dimensional color service in the Sable studio" className="hero-image" />
          <div className="hero-image-caption"><span>DIMENSIONAL COLOR</span><span>01—24</span></div>
        </div>
      </section>

      <section className="service-intro" id="approach">
        <div className="section-rail" aria-hidden="true"><span>02</span></div>
        <div className="intro-statement">
          <PageEyebrow>The Sable standard</PageEyebrow>
          <h2>The best appointments feel <em>considered</em> before they begin.</h2>
        </div>
        <div className="intro-detail">
          <p>We match the right service to the right specialist, protect enough time for the work, and explain what happens next without making you hunt for the fine print.</p>
          <Link href="/services" className="text-cta">Browse all services <ArrowUpRight size={16} /></Link>
        </div>
      </section>

      <section className="service-strip">
        {featured.map((service, index) => (
          <Link key={service.id} href="/services" className="service-strip-item">
            <span className="service-index">0{index + 1}</span>
            <div><p className="service-category">{service.category}</p><h3>{service.name}</h3></div>
            <div className="service-meta"><span>{service.duration} min</span><strong>${service.price}</strong></div>
            <ArrowUpRight className="service-arrow" size={18} />
          </Link>
        ))}
      </section>

      <section className="booking-feature">
        <div className="booking-visual">
          <img src={withBase("/images/sable-stylist-work_da71216e.jpg")} alt="A Sable colorist applying a precise highlight placement" />
          <div className="visual-stamp"><Palette size={18} /><span>Color<br />plans</span></div>
        </div>
        <div className="booking-copy">
          <PageEyebrow>Booking that respects the work</PageEyebrow>
          <h2>More than the nearest open <em>slot.</em></h2>
          <p>Each service has a real duration. Each specialist has their own availability. Your appointment only appears when the chair has enough uninterrupted time to do it well.</p>
          <div className="workflow-list">
            <div><span><Scissors size={18} /></span><p><b>Choose your service</b><small>See clear prices, timing, and what each visit is built for.</small></p></div>
            <div><span><CalendarClock size={18} /></span><p><b>Meet the right chair</b><small>We only show specialists qualified for the work you selected.</small></p></div>
            <div><span><Check size={18} /></span><p><b>Know the commitments</b><small>Deposit and cancellation details are specific to your appointment.</small></p></div>
          </div>
          <Link href="/book" className="primary-cta">Build your visit <ArrowUpRight size={17} /></Link>
        </div>
      </section>

      <section className="membership-callout">
        <div className="membership-image"><img src={withBase("/images/sable-tools-closeup_5145f9af.jpg")} alt="Professional salon tools arranged on a stone worktable" /></div>
        <div className="membership-copy">
          <PageEyebrow>Stay in rhythm</PageEyebrow>
          <h2>Your best hair has a <em>cadence.</em></h2>
          <p>Our memberships keep your finish, refresh, or cut on a rhythm that works with your actual life — with member pricing and your next visit already in view.</p>
          <Link href="/memberships" className="white-cta">Explore memberships <ArrowUpRight size={17} /></Link>
        </div>
        <div className="membership-note"><Clock3 size={18} /><span>Next visit,<br />already considered.</span></div>
      </section>

      <section className="final-cta">
        <PageEyebrow>First time at Sable?</PageEyebrow>
        <h2>A little context makes a better <em>result.</em></h2>
        <p>New to chemical color, smoothing, or major lightening? We will begin with a dedicated consultation or patch-test step before confirming the full service.</p>
        <Link href="/book" className="primary-cta">Start with a consultation <ArrowUpRight size={17} /></Link>
      </section>
    </SiteShell>
  );
}
