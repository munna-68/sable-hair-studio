import { useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { ArrowUpRight, CalendarHeart, Heart, MapPin, Search, ShoppingBag, Sparkles, UserRound } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { memberships, services, stylists } from "@/lib/salon-data";
import { retailProducts } from "@/lib/shop-data";
import { useStudio } from "@/contexts/StudioStore";

const pages = [
  { href: "/", label: "Studio — home", hint: "Start here" },
  { href: "/services", label: "Services — menu & timing", hint: "8 services" },
  { href: "/book", label: "Book — appointment planner", hint: "4 steps" },
  { href: "/memberships", label: "Memberships — rhythms", hint: "3 plans" },
  { href: "/about", label: "About — chairs & studio", hint: "4 stylists" },
  { href: "/visit", label: "Visit — map, hours & contact", hint: "118 Pine St" },
];

export function CommandPalette() {
  const { paletteOpen, setPaletteOpen, setCartOpen, setSavedOpen } = useStudio();
  const [, setLocation] = useLocation();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(!paletteOpen);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paletteOpen, setPaletteOpen]);

  const go = (href: string) => {
    setPaletteOpen(false);
    setLocation(href);
  };

  const groups = useMemo(() => ({ pages, services, stylists, memberships, retailProducts }), []);

  return (
    <CommandDialog open={paletteOpen} onOpenChange={setPaletteOpen} title="Search Sable" description="Jump to services, stylists, plans, and pages.">
      <CommandInput placeholder="Search services, stylists, plans, pages…" />
      <CommandList>
        <CommandEmpty>No matches. Try “color”, “cut”, “Mara”, or “membership”.</CommandEmpty>
        <CommandGroup heading="Pages">
          {groups.pages.map((p) => (
            <CommandItem key={p.href} value={`page ${p.label}`} onSelect={() => go(p.href)}>
              <Search size={15} />
              <span>{p.label}</span>
              <span className="ml-auto text-xs text-muted-foreground">{p.hint}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Services">
          {groups.services.map((s) => (
            <CommandItem key={s.id} value={`service ${s.name} ${s.category}`} onSelect={() => go(`/services?focus=${s.id}`)}>
              <Sparkles size={15} />
              <span>{s.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">{s.duration} min · ${s.price}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Chairs">
          {groups.stylists.map((s) => (
            <CommandItem key={s.id} value={`stylist ${s.name} ${s.role}`} onSelect={() => go(`/about?chair=${s.id}`)}>
              <UserRound size={15} />
              <span>{s.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">{s.role}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Memberships & shelf">
          {groups.memberships.map((m) => (
            <CommandItem key={m.id} value={`membership ${m.name}`} onSelect={() => go("/memberships")}>
              <CalendarHeart size={15} />
              <span>{m.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">${m.price}</span>
            </CommandItem>
          ))}
          {groups.retailProducts.map((p) => (
            <CommandItem key={p.id} value={`product ${p.name} ${p.tag}`} onSelect={() => go(`/services?focus=shelf-${p.id}`)}>
              <ShoppingBag size={15} />
              <span>{p.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">${p.price}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Studio actions">
          <CommandItem value="action open bag" onSelect={() => { setPaletteOpen(false); setCartOpen(true); }}>
            <ShoppingBag size={15} /> Open bag
          </CommandItem>
          <CommandItem value="action open saved" onSelect={() => { setPaletteOpen(false); setSavedOpen(true); }}>
            <Heart size={15} /> Open saved
          </CommandItem>
          <CommandItem value="action visit" onSelect={() => go("/visit")}>
            <MapPin size={15} /> Get directions <ArrowUpRight size={14} className="ml-auto" />
          </CommandItem>
          <CommandItem value="action book" onSelect={() => go("/book")}>
            <CalendarHeart size={15} /> Start booking <ArrowUpRight size={14} className="ml-auto" />
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
