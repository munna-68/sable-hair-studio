/** Chromatic Cut page: crisp service architecture with mock-commerce depth. */
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowUpRight, Clock3, Droplets, Eye, Heart, Search, Share2, ShieldCheck, ShoppingBag, Sparkles } from "lucide-react";
import { PageEyebrow, SiteShell } from "@/components/SiteShell";
import { ServiceQuickView } from "@/components/ServiceQuickView";
import { RetailGrid } from "@/components/ShowcaseBits";
import { getCancellationWindow, getCompatibleStylists, getDepositAmount, services, type Service } from "@/lib/salon-data";
import { shareLink, useStudio } from "@/contexts/StudioStore";

const categoryIcons = { Cut: Sparkles, Color: Droplets, Care: ShieldCheck, Grooming: Clock3 };
const categories = ["All", "Cut", "Color", "Care", "Grooming"] as const;

export default function Services() {
  const [, setLocation] = useLocation();
  const focusId = new URLSearchParams(window.location.search).get("focus") ?? "";
  const { addToBag, toggleSavedService, isSavedService, setMatcherOpen } = useStudio();
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [query, setQuery] = useState("");
  const [quickView, setQuickView] = useState<Service | null>(() => services.find((s) => s.id === focusId) ?? null);

  useEffect(() => {
    if (focusId.startsWith("shelf-")) {
      const el = document.getElementById(focusId);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (focusId) {
      const found = services.find((s) => s.id === focusId);
      if (found) setQuickView(found);
    }
  }, [focusId]);

  const filtered = useMemo(() => {
    return services.filter((s) => {
      const inCategory = category === "All" || s.category === category;
      const q = query.trim().toLowerCase();
      const inQuery = !q || `${s.name} ${s.description} ${s.category}`.toLowerCase().includes(q);
      return inCategory && inQuery;
    });
  }, [category, query]);

  function step(dir: 1 | -1) {
    const list = filtered.length ? filtered : services;
    if (!quickView) {
      setQuickView(list[0]);
      return;
    }
    const idx = list.findIndex((s) => s.id === quickView.id);
    const next = list[(idx + dir + list.length) % list.length];
    setQuickView(next);
  }

  return (
    <SiteShell>
      <section className="page-hero services-hero">
        <div data-reveal="left"><PageEyebrow>The work, clearly explained</PageEyebrow><h1>Plan for the <em>finish.</em><br />Stay for the detail.</h1></div>
        <div data-reveal="right" style={{ "--rd": "90ms" } as React.CSSProperties}>
          <p>Every service includes the information that affects your day: realistic time in chair, price, who does it, and any booking considerations.</p>
          <button className="primary-cta matcher-trigger" onClick={() => setMatcherOpen(true)}>
            Not sure? Answer three questions <Sparkles size={16} />
          </button>
        </div>
      </section>

      <div className="filter-bar" role="search">
        <div className="filter-inner">
          <label className="filter-search">
            <Search size={15} className="text-[#4E5B51]" />
            <input
              placeholder="Filter services — try “color” or “cut”"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Filter services"
            />
          </label>
          {categories.map((c) => (
            <button
              key={c}
              className={category === c ? "filter-chip active" : "filter-chip"}
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
            >
              {c}
            </button>
          ))}
          <span className="filter-count" aria-live="polite">{filtered.length} of {services.length} services</span>
        </div>
      </div>

      <section className="services-list">
        {filtered.map((service, index) => {
          const Icon = categoryIcons[service.category];
          const specialists = getCompatibleStylists(service.id);
          const deposit = getDepositAmount(service);
          const saved = isSavedService(service.id);
          return (
            <article
              className="service-row"
              key={service.id}
              data-reveal="up"
              style={{ "--rd": `${Math.min(index, 4) * 70}ms` } as React.CSSProperties}
            >
              <div className="service-row-index">{String(index + 1).padStart(2, "0")}</div>
              <div className="service-row-main">
                <div className="service-row-heading">
                  <span className="service-icon"><Icon size={17} /></span>
                  <div><p className="service-category">{service.category}</p><h2>{service.name}</h2></div>
                </div>
                <p className="service-description">{service.description}</p>
                <div className="specialist-line">
                  <span>Available with</span>
                  {specialists.map((stylist) => <span className="stylist-chip" key={stylist.id}>{stylist.initials} {stylist.name.split(" ")[0]}</span>)}
                </div>
              </div>
              <div className="service-row-facts">
                <p><span>Time</span><b>{service.duration} min</b></p>
                <p><span>Starting at</span><b>${service.price}</b></p>
                <p><span>Deposit</span><b>{deposit ? `$${deposit}` : "None"}</b></p>
                <p><span>Change window</span><b>{getCancellationWindow(service)} hrs</b></p>
              </div>
              <div className="row-cta-group">
                <Link href={`/book?service=${service.id}`} className="row-book" aria-label={`Book ${service.name}`}><span>Book</span><ArrowUpRight size={18} /></Link>
                <div className="row-actions">
                  <button className={saved ? "icon-btn saved" : "icon-btn"} aria-label={saved ? `Unsave ${service.name}` : `Save ${service.name}`} aria-pressed={saved} onClick={() => toggleSavedService(service.id, service.name)}>
                    <Heart size={15} fill={saved ? "currentColor" : "none"} />
                  </button>
                  <button className="icon-btn" aria-label={`Share ${service.name}`} onClick={() => shareLink(service.name, service.description)}>
                    <Share2 size={15} />
                  </button>
                  <button className="icon-btn" aria-label={`Quick view ${service.name}`} onClick={() => setQuickView(service)}>
                    <Eye size={15} />
                  </button>
                  <button className="icon-btn" aria-label={`Add ${service.name} to bag`} onClick={() => addToBag("service", service.id, service.name)}>
                    <ShoppingBag size={15} />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
        {!filtered.length && (
          <div className="service-row" data-reveal="fade">
            <div className="service-row-index">—</div>
            <div className="service-row-main">
              <h2>No services match “{query}”.</h2>
              <p className="service-description">Try “color”, “cut”, or clear the category filter. Or start from the full planner.</p>
              <button className="ghost-cta" onClick={() => { setQuery(""); setCategory("All"); }}>Clear filters</button>
            </div>
            <div />
            <Link href="/book" className="row-book"><span>Book</span><ArrowUpRight size={18} /></Link>
          </div>
        )}
      </section>

      <section className="shelf-section">
        <div className="shelf-head">
          <div data-reveal="left">
            <PageEyebrow>Take-home shelf</PageEyebrow>
            <h2>Extend the result <em>beyond the chair.</em></h2>
          </div>
          <p data-reveal="right" style={{ "--rd": "80ms" } as React.CSSProperties}>
            The same care we use in-studio, sized for home. Add to your bag for studio pickup — demo checkout, no card.
          </p>
        </div>
        <RetailGrid />
      </section>

      <section className="policy-panel">
        <div data-reveal="left"><PageEyebrow>Before you book</PageEyebrow><h2>Good work needs a protected <em>window.</em></h2></div>
        <div className="policy-cards">
          <div data-reveal="up" style={{ "--rd": "0ms" } as React.CSSProperties}><span>01</span><h3>Color + chemical work</h3><p>First-time guests complete a brief consultation or patch test before we confirm the service appointment.</p></div>
          <div data-reveal="up" style={{ "--rd": "90ms" } as React.CSSProperties}><span>02</span><h3>Deposits, scaled fairly</h3><p>Basic cuts stay deposit-free. Longer color, smoothing, and correction work reserve time with a service-specific deposit.</p></div>
          <div data-reveal="up" style={{ "--rd": "180ms" } as React.CSSProperties}><span>03</span><h3>Changes with enough notice</h3><p>Your exact cancellation window appears before confirmation. Changes outside that window can move your deposit forward.</p></div>
        </div>
      </section>

      <ServiceQuickView
        service={quickView}
        onClose={() => { setQuickView(null); setLocation("/services", { replace: true }); }}
        onPrev={() => step(-1)}
        onNext={() => step(1)}
      />
    </SiteShell>
  );
}
