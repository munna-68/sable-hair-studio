import { withBase } from "@/lib/withBase";
/** Chromatic Cut shell: editorial runway chrome with mock commerce actions. */
import { Link, useLocation } from "wouter";
import { ArrowUpRight, Heart, Instagram, MapPin, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CartDrawer } from "@/components/CartDrawer";
import { CommandPalette } from "@/components/CommandPalette";
import { SavedDrawer } from "@/components/SavedDrawer";
import { isNewsletterSubscribed, markNewsletterSubscribed, useStudio } from "@/contexts/StudioStore";

const nav = [
  { href: "/", label: "Studio" },
  { href: "/services", label: "Services" },
  { href: "/memberships", label: "Memberships" },
  { href: "/about", label: "About" },
  { href: "/visit", label: "Visit" },
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

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(isNewsletterSubscribed());

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      toast.error("Enter a valid email to join the list.", { description: "Example: you@example.com" });
      return;
    }
    markNewsletterSubscribed();
    setDone(true);
    setEmail("");
    toast.success("You’re on the Sable list.", { description: "One thoughtful email a month. No noise — demo only." });
  }

  if (done) {
    return <p className="newsletter-done">You’re on the list — see you in the next note.</p>;
  }

  return (
    <form className="newsletter-form" onSubmit={submit}>
      <label className="sr-only" htmlFor="newsletter-email">Email address</label>
      <input
        id="newsletter-email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Join <ArrowUpRight size={14} /></button>
    </form>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount, savedCount, setCartOpen, setSavedOpen, setPaletteOpen } = useStudio();
  const activePath = location.split("?")[0];

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
              <Link key={item.href} href={item.href} className={activePath === item.href ? "nav-link active" : "nav-link"}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <button className="header-icon-btn search-pill" onClick={() => setPaletteOpen(true)} aria-label="Search (Command K)">
              <Search size={16} />
              <span className="search-pill-text">Search</span>
              <kbd className="search-kbd">⌘K</kbd>
            </button>
            <button className="header-icon-btn" onClick={() => setSavedOpen(true)} aria-label={`Open saved (${savedCount})`}>
              <Heart size={18} />
              {savedCount > 0 && <span className="header-badge">{savedCount}</span>}
            </button>
            <button className="header-icon-btn" onClick={() => setCartOpen(true)} aria-label={`Open bag (${cartCount})`}>
              <ShoppingBag size={18} />
              {cartCount > 0 && <span className="header-badge">{cartCount}</span>}
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="header-icon-btn" aria-label="Account menu">
                  <UserRound size={18} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel>Demo account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => toast.info("Sign-in is mocked in this showcase.", { description: "No account needed to explore booking." })}>
                  Sign in (demo)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success("Visit history synced — demo.", { description: "2 past cuts · 1 color plan on file." })}>
                  Past visits
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSavedOpen(true); }}>
                  Saved looks & chairs
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.info("Preferences saved locally.", { description: "Low-scent products · Saturday mornings." })}>
                  Preferences
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/book" className="book-link">
              Book a visit <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
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
            <div className="mobile-chrome-row">
              <button className="mobile-chrome-btn" onClick={() => { setMenuOpen(false); setPaletteOpen(true); }}>
                <Search size={16} /> Search
              </button>
              <button className="mobile-chrome-btn" onClick={() => { setMenuOpen(false); setSavedOpen(true); }}>
                <Heart size={16} /> Saved{savedCount > 0 ? ` (${savedCount})` : ""}
              </button>
              <button className="mobile-chrome-btn" onClick={() => { setMenuOpen(false); setCartOpen(true); }}>
                <ShoppingBag size={16} /> Bag{cartCount > 0 ? ` (${cartCount})` : ""}
              </button>
            </div>
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
            <div className="newsletter-block">
              <p className="footer-label">The Sable note — monthly</p>
              <NewsletterForm />
              <small>One email a month. Demo only — stored on this device.</small>
            </div>
          </div>
          <div className="footer-column">
            <p className="footer-label">Find us</p>
            <a href="https://maps.google.com/?q=118+Pine+Street+Seattle+WA" target="_blank" rel="noreferrer"><MapPin size={15} /> 118 Pine Street<br />Seattle, WA 98101</a>
            <Link href="/visit">Hours, map & contact</Link>
          </div>
          <div className="footer-column">
            <p className="footer-label">Hours</p>
            <p>Tue–Fri 9–6<br />Sat–Sun 10–5</p>
            <Link href="/book">Book a visit</Link>
          </div>
          <div className="footer-column">
            <p className="footer-label">Say hello</p>
            <a href="mailto:hello@sablestudio.example">hello@sablestudio.example</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><Instagram size={15} /> @sablehairstudio</a>
            <Link href="/services">Services & timing</Link>
          </div>
        </div>
        <div className="footer-bottom"><span>© 2026 Sable Hair Studio</span><span>Cut with intention. Book with clarity.</span></div>
      </footer>
      <CommandPalette />
      <CartDrawer />
      <SavedDrawer />
    </div>
  );
}

export function PageEyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow"><span />{children}</p>;
}
