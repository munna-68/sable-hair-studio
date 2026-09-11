import { withBase } from "@/lib/withBase";
/** Chromatic Cut component: an editorial runway shell with a cobalt mark and clear exits. */
import { Link, useLocation } from "wouter";
import { Menu, X, ArrowUpRight, Instagram, MapPin } from "lucide-react";
import { useState } from "react";

const nav = [
  { href: "/", label: "Studio" },
  { href: "/services", label: "Services" },
  { href: "/memberships", label: "Memberships" },
  { href: "/about", label: "About" },
];

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="brand-mark" aria-label="Sable Hair Studio home">
      <img src={withBase("/images/sable-logo-mark_4168f6a7.png")} alt="" className="brand-symbol" />
      {!compact && (
        <span className="brand-type">
          SABLE <small>HAIR STUDIO</small>
        </span>
      )}
    </Link>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f8fb] text-[#172133]">
      <header className="site-header">
        <div className="studio-rail" aria-hidden="true">
          <span>SEATTLE, WA</span>
        </div>
        <div className="header-inner">
          <BrandMark />
          <nav className="desktop-nav" aria-label="Primary navigation">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className={location === item.href ? "nav-link active" : "nav-link"}>
                {item.label}
              </Link>
            ))}
          </nav>
          <Link href="/book" className="book-link">
            Book a visit <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
          <button className="mobile-menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation" aria-expanded={menuOpen}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {menuOpen && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
            <Link href="/book" className="mobile-book-link" onClick={() => setMenuOpen(false)}>
              Book a visit <ArrowUpRight size={16} />
            </Link>
          </nav>
        )}
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div className="footer-rail" aria-hidden="true"><span>09</span></div>
        <div className="footer-grid">
          <div>
            <BrandMark />
            <p className="footer-intro">Thoughtful cuts, lived-in color, and the kind of appointment plan that respects your calendar.</p>
          </div>
          <div className="footer-column">
            <p className="footer-label">Find us</p>
            <a href="https://maps.google.com/?q=118+Pine+Street+Seattle+WA" target="_blank" rel="noreferrer"><MapPin size={15} /> 118 Pine Street<br />Seattle, WA 98101</a>
          </div>
          <div className="footer-column">
            <p className="footer-label">Hours</p>
            <p>Tue–Fri 9–6<br />Sat–Sun 10–5</p>
          </div>
          <div className="footer-column">
            <p className="footer-label">Say hello</p>
            <a href="mailto:hello@sablestudio.example">hello@sablestudio.example</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><Instagram size={15} /> @sablehairstudio</a>
          </div>
        </div>
        <div className="footer-bottom"><span>© 2026 Sable Hair Studio</span><span>Cut with intention. Book with clarity.</span></div>
      </footer>
    </div>
  );
}

export function PageEyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow"><span />{children}</p>;
}
