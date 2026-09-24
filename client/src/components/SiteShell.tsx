import { withBase } from "@/lib/withBase";
/** Chromatic Cut shell: editorial runway chrome with mock commerce actions. */
import { Link, useLocation } from "wouter";
import { ArrowUpRight, Heart, Instagram, LayoutDashboard, MapPin, Menu, Search, ShoppingBag, Sparkles, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
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
import { ServiceMatcher } from "@/components/ServiceMatcher";
import { BackToTop, ScrollProgress } from "@/components/MotionChrome";
import { isNewsletterSubscribed, markNewsletterSubscribed, useStudio } from "@/contexts/StudioStore";
import { getStudioStatus, useMotionSystem } from "@/hooks/useScrollMotion";

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
  const { addSubscriber } = useStudio();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(isNewsletterSubscribed());

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      toast.error("Enter a valid email to join the list.", { description: "Example: you@example.com" });
      return;
    }
    addSubscriber(value);
    markNewsletterSubscribed();
    setDone(true);
    setEmail("");
    toast.success("You’re on the Sable list.", { description: "Saved to subscriber roster in the Owner Dashboard." });
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

/** Live open/closed pill, computed from the studio's operating hours and settings. */
export function StudioStatus({ className }: { className?: string }) {
  const { settings } = useStudio();
  const status = getStudioStatus(new Date(), settings.operatingHours, settings.isOpenToday);

  return (
    <span className={className ? `status-pill ${className}` : "status-pill"}>
      <span className={status.open ? "status-dot" : "status-dot closed"} aria-hidden="true" />
      <span>
        <b>{status.open ? "Open today" : "Studio closed"}</b>
        <small>{status.open ? status.detail : "Appointments via calendar"}</small>
      </span>
    </span>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount, savedCount, setCartOpen, setSavedOpen, setPaletteOpen, matcherOpen, setMatcherOpen, settings } = useStudio();
  const activePath = location.split("?")[0];

  useMotionSystem();

  // Hold the page still behind the mobile panel, and let Escape close it.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // Close the panel whenever the route changes.
  useEffect(() => setMenuOpen(false), [activePath]);

  return (
    <div className="min-h-screen bg-[#F5F8F4] text-[#0A1F14]">
      {settings.announcementBanner.enabled && (
        <aside
          aria-label="Studio announcement"
          className="bg-[#0A1F14] text-[#E6EFE9] text-xs py-2 px-4 text-center font-medium tracking-wide flex flex-wrap items-center justify-center gap-2 sm:gap-3 border-b border-[#147A45]/30 relative z-40"
        >
          <div className="flex items-center gap-1.5">
            <Sparkles size={13} className="text-[#34D399] shrink-0" />
            <span>{settings.announcementBanner.message}</span>
          </div>
          <span className="hidden sm:inline text-white/30 text-xs">•</span>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#147A45] hover:bg-[#1C9656] text-white text-[11px] font-bold tracking-normal transition-all hover:scale-105 active:scale-95 shadow-xs"
          >
            <LayoutDashboard size={12} />
            <span>See Owner Dashboard</span>
            <ArrowUpRight size={12} />
          </Link>
        </aside>
      )}
      <ScrollProgress />
      <header className="site-header">
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
            <button className="header-icon-btn" onClick={() => setMatcherOpen(true)} aria-label="Find your service">
              <Sparkles size={17} />
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
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Demo account</span>
                  <span className="text-[10px] bg-[#147A45]/15 text-[#147A45] font-mono px-2 py-0.5 rounded-full font-bold">PORTFOLIO</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center justify-between text-[#147A45] font-semibold cursor-pointer">
                    <span className="flex items-center gap-2"><LayoutDashboard size={15} /> Owner Dashboard</span>
                    <span className="text-[10px] bg-[#147A45] text-white px-1.5 py-0.5 rounded">PORTAL</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => toast.info("Sign-in is mocked in this showcase.", { description: "No account needed to explore booking." })}>
                  Sign in (demo)
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/appointments" className="cursor-pointer">
                    All client appointments
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSavedOpen(true); }}>
                  Saved looks & chairs
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="cursor-pointer">
                    Studio operating settings
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              href="/dashboard"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#147A45]/40 bg-[#147A45]/10 hover:bg-[#147A45] text-[#147A45] hover:text-white text-xs font-semibold transition-all shadow-2xs hover:scale-105 active:scale-95 group ml-1"
              title="Studio Owner Dashboard Demo"
            >
              <LayoutDashboard size={13} className="text-[#147A45] group-hover:text-white transition-colors" />
              <span>Owner Dashboard</span>
            </Link>
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
            {nav.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={activePath === item.href ? "mobile-nav-link active" : "mobile-nav-link"}
                data-reveal="fade"
                style={{ "--rd": `${index * 35}ms` } as React.CSSProperties}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
                <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            ))}
            <button
              className="mobile-chrome-btn mobile-match-btn"
              data-reveal="fade"
              style={{ "--rd": "210ms" } as React.CSSProperties}
              onClick={() => { setMenuOpen(false); setMatcherOpen(true); }}
            >
              <Sparkles size={16} /> Find your service
            </button>
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
            <Link
              href="/dashboard"
              className="mobile-chrome-btn flex items-center justify-center gap-2 text-[#147A45] font-semibold border border-[#147A45]/30 bg-[#147A45]/10 mt-1 !py-3 rounded-full"
              onClick={() => setMenuOpen(false)}
            >
              <LayoutDashboard size={16} /> Studio Owner Dashboard
            </Link>
          </nav>
        )}
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <BrandMark />
            <p className="footer-intro">{settings.tagline || "Thoughtful cuts, lived-in color, and the kind of appointment plan that respects your calendar."}</p>
            <StudioStatus className="footer-status" />
            <div className="newsletter-block">
              <p className="footer-label">The Sable note — monthly</p>
              <NewsletterForm />
              <small>One email a month. Demo only — stored on this device.</small>
            </div>
          </div>
          <div className="footer-column">
            <p className="footer-label">Find us</p>
            <a href={settings.mapsUrl} target="_blank" rel="noreferrer"><MapPin size={15} /> {settings.address}</a>
            <Link href="/visit">Hours, map & contact</Link>
          </div>
          <div className="footer-column">
            <p className="footer-label">Hours</p>
            <p>
              {settings.operatingHours.find((h) => h.day === "Tuesday")?.closed ? "Tue Closed" : "Tue–Fri 9–6"}
              <br />
              {settings.operatingHours.find((h) => h.day === "Saturday")?.closed ? "Weekend Closed" : "Sat–Sun 10–5"}
            </p>
            <Link href="/book">Book a visit</Link>
          </div>
          <div className="footer-column">
            <p className="footer-label">Studio Portal</p>
            <Link href="/dashboard" className="text-[#34D399] font-medium flex items-center gap-1.5 hover:underline text-sm">
              <LayoutDashboard size={14} /> Owner Dashboard
            </Link>
            <Link href="/dashboard/appointments" className="text-xs text-[#9BB3A2] hover:text-white">
              Appointments & orders
            </Link>
            <Link href="/dashboard/settings" className="text-xs text-[#9BB3A2] hover:text-white">
              Hours & policies
            </Link>
            <button className="footer-match-link mt-2" onClick={() => setMatcherOpen(true)}>
              <Sparkles size={13} /> Find your service
            </button>
          </div>
        </div>
        <div className="footer-bottom"><span>© 2026 Sable Hair Studio</span><span>Cut with intention. Book with clarity.</span></div>
      </footer>
      <CommandPalette />
      <CartDrawer />
      <SavedDrawer />
      <ServiceMatcher open={matcherOpen} onOpenChange={setMatcherOpen} />
      <BackToTop />
      {/* Floating Demo Trigger for prospective clients & leads */}
      <aside aria-label="Portfolio showcase quick links" className="fixed bottom-5 right-5 z-40 flex items-center gap-2 print:hidden">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#0A1F14] hover:bg-[#147A45] text-white border border-[#147A45]/40 text-xs font-bold tracking-wide transition-all hover:scale-105 active:scale-95 shadow-lg group backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34D399] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34D399]"></span>
          </span>
          <LayoutDashboard size={13} className="text-[#34D399] group-hover:text-white transition-colors" />
          <span>Owner Dashboard</span>
          <ArrowUpRight size={12} className="text-white/60 group-hover:text-white transition-colors" />
        </Link>
      </aside>
    </div>
  );
}

export function PageEyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow"><span />{children}</p>;
}
