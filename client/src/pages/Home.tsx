import { withBase } from "@/lib/withBase";
/** Chromatic Cut page: editorial runway composition with mineral surfaces and emerald decisions. */
import { Link } from "wouter";
import { ArrowUpRight, CalendarClock, Check, Clock3, Palette, Scissors, Sparkles } from "lucide-react";
import { PageEyebrow, SiteShell } from "@/components/SiteShell";
import { ColorCompare, PressStrip, RetailGrid, ReviewCarousel } from "@/components/ShowcaseBits";
import { CountUp } from "@/components/MotionChrome";
import { services } from "@/lib/salon-data";
import { useStudio } from "@/contexts/StudioStore";

const featured = [services[2], services[0], services[5]];

/** Stagger step used for headline and card entrances. */
const STEP = 60;

export default function Home() {
  const { setMatcherOpen } = useStudio();

  return (
    <SiteShell>
      <section className="hero-section">
        <div className="hero-rail" aria-hidden="true"><span>01 / STUDIO</span></div>
        <div className="hero-copy">
          <div data-reveal="fade"><PageEyebrow>Color. Cut. Care.</PageEyebrow></div>
          <h1>
            <span className="hero-line" data-reveal="up" style={{ "--rd": `${STEP}ms` } as React.CSSProperties}>
              Hair with a
            </span>
            <span className="hero-line" data-reveal="up" style={{ "--rd": `${STEP * 2}ms` } as React.CSSProperties}>
              <em>point of view.</em>
            </span>
          </h1>
          <p className="hero-text" data-reveal="up" style={{ "--rd": `${STEP * 3}ms` } as React.CSSProperties}>
            Sable is a detail-oriented salon for lived-in color, precision cutting, and plans that make sense after you leave the chair.
          </p>
          <div className="hero-actions" data-reveal="up" style={{ "--rd": `${STEP * 4}ms` } as React.CSSProperties}>
            <Link href="/book" className="primary-cta">Find your appointment <ArrowUpRight size={17} /></Link>
            <button className="text-cta" onClick={() => setMatcherOpen(true)}>
              Not sure what to book? <Sparkles size={15} />
            </button>
          </div>
          <div className="hero-notes" data-reveal="fade" style={{ "--rd": `${STEP * 5}ms` } as React.CSSProperties}>
            <span><b><CountUp to={4} /></b> specialist chairs</span>
            <span><b>1:1</b> color consults</span>
            <span><b><CountUp to={48} suffix="h" /></b> chemical service window</span>
          </div>
        </div>
        <div className="hero-image-wrap">
          <div className="hero-image-layer" data-parallax="0.075">
            <img src={withBase("/images/sable-hero-editorial_4512985d.jpg")} alt="A stylist finishing a dimensional color service in the Sable studio" className="hero-image" />
          </div>
          <div className="hero-image-caption"><span>DIMENSIONAL COLOR</span><span>01—24</span></div>
        </div>
      </section>

      <PressStrip />

      <section className="service-intro" id="approach">
        <div className="section-rail" aria-hidden="true"><span>02</span></div>
        <div className="intro-statement">
          <div data-reveal="left"><PageEyebrow>The Sable standard</PageEyebrow></div>
          <h2 data-reveal="up" style={{ "--rd": "70ms" } as React.CSSProperties}>
            The best appointments feel <em>considered</em> before they begin.
          </h2>
        </div>
        <div className="intro-detail" data-reveal="right" style={{ "--rd": "120ms" } as React.CSSProperties}>
          <p>We match the right service to the right specialist, protect enough time for the work, and explain what happens next without making you hunt for the fine print.</p>
          <Link href="/services" className="text-cta">Browse all services <ArrowUpRight size={16} /></Link>
        </div>
      </section>

      <section className="service-strip">
        {featured.map((service, index) => (
          <Link
            key={service.id}
            href={`/services?focus=${service.id}`}
            className="service-strip-item"
            data-reveal="up"
            style={{ "--rd": `${index * 90}ms` } as React.CSSProperties}
          >
            <span className="service-index">0{index + 1}</span>
            <div><p className="service-category">{service.category}</p><h3>{service.name}</h3></div>
            <div className="service-meta"><span>{service.duration} min</span><strong>${service.price}</strong></div>
            <ArrowUpRight className="service-arrow" size={18} />
          </Link>
        ))}
      </section>

      <section className="booking-feature">
        <div className="booking-visual" data-reveal="left">
          <img src={withBase("/images/sable-stylist-work_da71216e.jpg")} alt="A Sable colorist applying a precise highlight placement" />
          <div className="visual-stamp"><Palette size={18} /><span>Color<br />plans</span></div>
        </div>
        <div className="booking-copy">
          <div data-reveal="right"><PageEyebrow>Booking that respects the work</PageEyebrow></div>
          <h2 data-reveal="right" style={{ "--rd": "60ms" } as React.CSSProperties}>
            More than the nearest open <em>slot.</em>
          </h2>
          <p data-reveal="right" style={{ "--rd": "110ms" } as React.CSSProperties}>
            Each service has a real duration. Each specialist has their own availability. Your appointment only appears when the chair has enough uninterrupted time to do it well.
          </p>
          <div className="workflow-list">
            <div data-reveal="right" style={{ "--rd": "160ms" } as React.CSSProperties}><span><Scissors size={18} /></span><p><b>Choose your service</b><small>See clear prices, timing, and what each visit is built for.</small></p></div>
            <div data-reveal="right" style={{ "--rd": "220ms" } as React.CSSProperties}><span><CalendarClock size={18} /></span><p><b>Meet the right chair</b><small>We only show specialists qualified for the work you selected.</small></p></div>
            <div data-reveal="right" style={{ "--rd": "280ms" } as React.CSSProperties}><span><Check size={18} /></span><p><b>Know the commitments</b><small>Deposit and cancellation details are specific to your appointment.</small></p></div>
          </div>
          <div className="hero-actions" data-reveal="right" style={{ "--rd": "330ms" } as React.CSSProperties}>
            <Link href="/book" className="primary-cta">Build your visit <ArrowUpRight size={17} /></Link>
            <button className="text-cta" onClick={() => setMatcherOpen(true)}>
              Answer three questions <Sparkles size={15} />
            </button>
          </div>
        </div>
      </section>

      <section className="membership-callout">
        <div className="membership-image">
          <div className="parallax-layer" data-parallax="0.05">
            <img src={withBase("/images/sable-tools-closeup_5145f9af.jpg")} alt="Professional salon tools arranged on a stone worktable" />
          </div>
        </div>
        <div className="membership-copy">
          <div data-reveal="up"><PageEyebrow>Stay in rhythm</PageEyebrow></div>
          <h2 data-reveal="up" style={{ "--rd": "60ms" } as React.CSSProperties}>
            Your best hair has a <em>cadence.</em>
          </h2>
          <p data-reveal="up" style={{ "--rd": "110ms" } as React.CSSProperties}>
            Our memberships keep your finish, refresh, or cut on a rhythm that works with your actual life — with member pricing and your next visit already in view.
          </p>
          <div data-reveal="up" style={{ "--rd": "160ms" } as React.CSSProperties}>
            <Link href="/memberships" className="white-cta">Explore memberships <ArrowUpRight size={17} /></Link>
          </div>
        </div>
        <div className="membership-note"><Clock3 size={18} /><span>Next visit,<br />already considered.</span></div>
      </section>

      <section className="shelf-section shelf-compare">
        <div className="shelf-head">
          <div data-reveal="left">
            <PageEyebrow>See the difference</PageEyebrow>
            <h2>Depth does the work. <em>Gloss does the rest.</em></h2>
          </div>
          <p data-reveal="right" style={{ "--rd": "80ms" } as React.CSSProperties}>
            The same placement, photographed flat and then finished. Drag the divider to see what the final gloss adds.
          </p>
        </div>
        <ColorCompare />
      </section>

      <ReviewCarousel />

      <section className="shelf-section">
        <div className="shelf-head">
          <div data-reveal="left">
            <PageEyebrow>The home shelf</PageEyebrow>
            <h2>What we send home <em>with you.</em></h2>
          </div>
          <p data-reveal="right" style={{ "--rd": "80ms" } as React.CSSProperties}>
            A short shelf of refills and finishers — the same formulas from your appointment. Save a favorite or add it to your bag for pickup.
          </p>
        </div>
        <RetailGrid compact />
        <div style={{ marginTop: "1.6rem" }} data-reveal="up">
          <Link href="/services?focus=shelf-mineral-shampoo" className="text-cta">Browse the full shelf <ArrowUpRight size={16} /></Link>
        </div>
      </section>

      <section className="final-cta">
        <div data-reveal="up"><PageEyebrow>First time at Sable?</PageEyebrow></div>
        <h2 data-reveal="up" style={{ "--rd": "60ms" } as React.CSSProperties}>
          A little context makes a better <em>result.</em>
        </h2>
        <p data-reveal="up" style={{ "--rd": "110ms" } as React.CSSProperties}>
          New to chemical color, smoothing, or major lightening? We will begin with a dedicated consultation or patch-test step before confirming the full service.
        </p>
        <div className="hero-actions" data-reveal="up" style={{ "--rd": "160ms" } as React.CSSProperties}>
          <Link href="/book" className="primary-cta">Start with a consultation <ArrowUpRight size={17} /></Link>
          <Link href="/visit" className="text-cta">Find the studio <ArrowUpRight size={16} /></Link>
        </div>
      </section>
    </SiteShell>
  );
}
