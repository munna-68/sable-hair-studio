import { Link } from "wouter";
import { ArrowRight, ArrowUpRight, Search } from "lucide-react";
import { PageEyebrow, SiteShell } from "@/components/SiteShell";
import { useStudio } from "@/contexts/StudioStore";

const shortcuts = [
  { href: "/book", label: "Appointment planner", hint: "4 calm steps" },
  { href: "/services", label: "Services & timing", hint: "8 services" },
  { href: "/memberships", label: "Membership rhythms", hint: "3 plans" },
  { href: "/visit", label: "Hours, map & contact", hint: "118 Pine St" },
];

export default function NotFound() {
  const { setPaletteOpen } = useStudio();

  return (
    <SiteShell>
      <section className="notfound-wrap">
        <div className="page-rail" aria-hidden="true"><span>404</span></div>
        <div>
          <PageEyebrow>Off the runway</PageEyebrow>
          <p className="notfound-code">40<em>4</em></p>
          <h1 className="sr-only">Page not found</h1>
          <h2 className="font-display text-3xl tracking-tight mt-2">That chair doesn’t exist.</h2>
          <p>The page moved, was renamed, or never had an appointment. Let’s get you back to something with better lighting.</p>
          <div className="notfound-links">
            <Link href="/" className="primary-cta">Back to the studio <ArrowUpRight size={16} /></Link>
            <button className="ghost-cta" onClick={() => setPaletteOpen(true)}>
              <Search size={15} /> Search everything
            </button>
          </div>
        </div>
        <aside className="notfound-card">
          <p className="service-category">Where to instead?</p>
          <b>Every path below is open — no dead ends here.</b>
          <nav>
            {shortcuts.map((s) => (
              <Link key={s.href} href={s.href}>
                <span>{s.label} <small className="block text-[11px] font-normal text-[#4E5B51]">{s.hint}</small></span>
                <ArrowRight size={16} />
              </Link>
            ))}
          </nav>
        </aside>
      </section>
    </SiteShell>
  );
}
