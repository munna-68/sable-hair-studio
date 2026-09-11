/** Chromatic Cut page: crisp service architecture and transparent timing without a generic menu grid. */
import { Link } from "wouter";
import { ArrowUpRight, Clock3, Droplets, ShieldCheck, Sparkles } from "lucide-react";
import { PageEyebrow, SiteShell } from "@/components/SiteShell";
import { getCancellationWindow, getCompatibleStylists, getDepositAmount, services } from "@/lib/salon-data";

const categoryIcons = { Cut: Sparkles, Color: Droplets, Care: ShieldCheck, Grooming: Clock3 };

export default function Services() {
  return (
    <SiteShell>
      <section className="page-hero services-hero">
        <div className="page-rail" aria-hidden="true"><span>03 / SERVICES</span></div>
        <div><PageEyebrow>The work, clearly explained</PageEyebrow><h1>Plan for the <em>finish.</em><br />Stay for the detail.</h1></div>
        <p>Every service includes the information that affects your day: realistic time in chair, price, who does it, and any booking considerations.</p>
      </section>

      <section className="services-list">
        {services.map((service, index) => {
          const Icon = categoryIcons[service.category];
          const specialists = getCompatibleStylists(service.id);
          const deposit = getDepositAmount(service);
          return (
            <article className="service-row" key={service.id}>
              <div className="service-row-index">{String(index + 1).padStart(2, "0")}</div>
              <div className="service-row-main"><div className="service-row-heading"><span className="service-icon"><Icon size={17} /></span><div><p className="service-category">{service.category}</p><h2>{service.name}</h2></div></div><p className="service-description">{service.description}</p><div className="specialist-line"><span>Available with</span>{specialists.map((stylist) => <span className="stylist-chip" key={stylist.id}>{stylist.initials} {stylist.name.split(" ")[0]}</span>)}</div></div>
              <div className="service-row-facts"><p><span>Time</span><b>{service.duration} min</b></p><p><span>Starting at</span><b>${service.price}</b></p><p><span>Deposit</span><b>{deposit ? `$${deposit}` : "None"}</b></p><p><span>Change window</span><b>{getCancellationWindow(service)} hrs</b></p></div>
              <Link href={`/book?service=${service.id}`} className="row-book" aria-label={`Book ${service.name}`}><span>Book</span><ArrowUpRight size={18} /></Link>
            </article>
          );
        })}
      </section>

      <section className="policy-panel">
        <div><PageEyebrow>Before you book</PageEyebrow><h2>Good work needs a protected <em>window.</em></h2></div>
        <div className="policy-cards"><div><span>01</span><h3>Color + chemical work</h3><p>First-time guests complete a brief consultation or patch test before we confirm the service appointment.</p></div><div><span>02</span><h3>Deposits, scaled fairly</h3><p>Basic cuts stay deposit-free. Longer color, smoothing, and correction work reserve time with a service-specific deposit.</p></div><div><span>03</span><h3>Changes with enough notice</h3><p>Your exact cancellation window appears before confirmation. Changes outside that window can move your deposit forward.</p></div></div>
      </section>
    </SiteShell>
  );
}
