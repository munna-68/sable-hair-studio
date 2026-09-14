import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getRetailProduct } from "@/lib/shop-data";
import { getService, memberships } from "@/lib/salon-data";

export type CartKind = "service" | "product" | "membership";
export type CartItem = { kind: CartKind; id: string; qty: number };

type ResolvedCartItem = CartItem & { name: string; detail: string; price: number };

const CART_KEY = "sable-cart-v1";
const SAVED_SERVICES_KEY = "sable-saved-services-v1";
const SAVED_STYLISTS_KEY = "sable-saved-stylists-v1";
const SAVED_PRODUCTS_KEY = "sable-saved-products-v1";
const PLAN_KEY = "sable-active-plan-v1";
const NEWSLETTER_KEY = "sable-newsletter-v1";

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function resolveCartItem(item: CartItem): ResolvedCartItem | null {
  if (item.kind === "product") {
    const p = getRetailProduct(item.id);
    if (!p) return null;
    return { ...item, name: p.name, detail: p.size, price: p.price };
  }
  if (item.kind === "service") {
    const s = getService(item.id);
    if (!s) return null;
    return { ...item, name: s.name, detail: `${s.duration} min · ${s.category}`, price: s.price };
  }
  const m = memberships.find((plan) => plan.id === item.id);
  if (!m) return null;
  return { ...item, name: m.name, detail: m.cadence, price: m.price };
}

export async function shareLink(title: string, text: string) {
  const url = window.location.href;
  try {
    if (navigator.share) {
      await navigator.share({ title, text, url });
      toast.success("Shared — thanks for spreading the word.");
      return true;
    }
    throw new Error("no-share");
  } catch (err) {
    // User cancelled native share — stay quiet.
    if (err instanceof DOMException && err.name === "AbortError") return true;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied — paste it anywhere.", { description: title });
      return true;
    } catch {
      toast.info("Copy this link to share.", { description: url });
      return false;
    }
  }
}

type StudioStore = {
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  resolvedCart: ResolvedCartItem[];
  addToBag: (kind: CartKind, id: string, label?: string) => void;
  removeFromBag: (kind: CartKind, id: string) => void;
  setQty: (kind: CartKind, id: string, qty: number) => void;
  clearBag: () => void;
  savedServices: string[];
  savedStylists: string[];
  savedProducts: string[];
  savedCount: number;
  toggleSavedService: (id: string, label?: string) => void;
  toggleSavedStylist: (id: string, label?: string) => void;
  toggleSavedProduct: (id: string, label?: string) => void;
  isSavedService: (id: string) => boolean;
  isSavedStylist: (id: string) => boolean;
  isSavedProduct: (id: string) => boolean;
  activePlan: string | null;
  setActivePlan: (id: string | null, silent?: boolean) => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  savedOpen: boolean;
  setSavedOpen: (open: boolean) => void;
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  matcherOpen: boolean;
  setMatcherOpen: (open: boolean) => void;
};

const StudioContext = createContext<StudioStore | null>(null);

export function StudioProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() =>
    typeof window === "undefined" ? [] : readJSON<CartItem[]>(CART_KEY, []),
  );
  const [savedServices, setSavedServices] = useState<string[]>(() =>
    typeof window === "undefined" ? [] : readJSON<string[]>(SAVED_SERVICES_KEY, []),
  );
  const [savedStylists, setSavedStylists] = useState<string[]>(() =>
    typeof window === "undefined" ? [] : readJSON<string[]>(SAVED_STYLISTS_KEY, []),
  );
  const [savedProducts, setSavedProducts] = useState<string[]>(() =>
    typeof window === "undefined" ? [] : readJSON<string[]>(SAVED_PRODUCTS_KEY, []),
  );
  const [activePlan, setActivePlanState] = useState<string | null>(() =>
    typeof window === "undefined" ? null : readJSON<string | null>(PLAN_KEY, null),
  );
  const [cartOpen, setCartOpen] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [matcherOpen, setMatcherOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch { /* noop */ }
  }, [cart]);
  useEffect(() => {
    try {
      localStorage.setItem(SAVED_SERVICES_KEY, JSON.stringify(savedServices));
    } catch { /* noop */ }
  }, [savedServices]);
  useEffect(() => {
    try {
      localStorage.setItem(SAVED_STYLISTS_KEY, JSON.stringify(savedStylists));
    } catch { /* noop */ }
  }, [savedStylists]);
  useEffect(() => {
    try {
      localStorage.setItem(SAVED_PRODUCTS_KEY, JSON.stringify(savedProducts));
    } catch { /* noop */ }
  }, [savedProducts]);
  useEffect(() => {
    try {
      localStorage.setItem(PLAN_KEY, JSON.stringify(activePlan));
    } catch { /* noop */ }
  }, [activePlan]);

  const addToBag = useCallback((kind: CartKind, id: string, label?: string) => {
    setCart((prev) => {
      const found = prev.find((i) => i.kind === kind && i.id === id);
      if (found) {
        return prev.map((i) => (i.kind === kind && i.id === id ? { ...i, qty: Math.min(9, i.qty + 1) } : i));
      }
      return [...prev, { kind, id, qty: 1 }];
    });
    toast.success(`Added to bag — ${label ?? id}`, {
      description: "Saved in this demo. Open the bag to review.",
      action: { label: "Open bag", onClick: () => setCartOpen(true) },
    });
  }, []);

  const removeFromBag = useCallback((kind: CartKind, id: string) => {
    setCart((prev) => prev.filter((i) => !(i.kind === kind && i.id === id)));
    toast.info("Removed from bag.");
  }, []);

  const setQty = useCallback((kind: CartKind, id: string, qty: number) => {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((i) => !(i.kind === kind && i.id === id))
        : prev.map((i) => (i.kind === kind && i.id === id ? { ...i, qty: Math.min(9, qty) } : i)),
    );
  }, []);

  const clearBag = useCallback(() => {
    setCart([]);
  }, []);

  const toggleSavedService = useCallback((id: string, label?: string) => {
    setSavedServices((prev) => {
      const has = prev.includes(id);
      toast[has ? "info" : "success"](has ? `Unsaved ${label ?? id}.` : `Saved ${label ?? id}.`, {
        description: has ? undefined : "Find it anytime under Saved.",
      });
      return has ? prev.filter((s) => s !== id) : [...prev, id];
    });
  }, []);

  const toggleSavedStylist = useCallback((id: string, label?: string) => {
    setSavedStylists((prev) => {
      const has = prev.includes(id);
      toast[has ? "info" : "success"](has ? `Unsaved ${label ?? id}.` : `Saved ${label ?? id} to your chairs.`);
      return has ? prev.filter((s) => s !== id) : [...prev, id];
    });
  }, []);

  const toggleSavedProduct = useCallback((id: string, label?: string) => {
    setSavedProducts((prev) => {
      const has = prev.includes(id);
      toast[has ? "info" : "success"](has ? `Unsaved ${label ?? id}.` : `Saved ${label ?? id} to your shelf.`);
      return has ? prev.filter((s) => s !== id) : [...prev, id];
    });
  }, []);

  const setActivePlan = useCallback((id: string | null, silent = false) => {
    setActivePlanState(id);
    if (!silent) {
      if (id) {
        const plan = memberships.find((p) => p.id === id);
        toast.success(`Membership active — ${plan?.name ?? id}`, {
          description: "Demo only. Your next visit date is already generated.",
        });
      } else {
        toast.info("Membership paused.", { description: "Your rhythm is on hold in this demo." });
      }
    }
  }, []);

  const resolvedCart = useMemo(
    () => cart.map(resolveCartItem).filter((i): i is ResolvedCartItem => i !== null),
    [cart],
  );
  const subtotal = useMemo(() => resolvedCart.reduce((sum, i) => sum + i.price * i.qty, 0), [resolvedCart]);
  const cartCount = useMemo(() => cart.reduce((sum, i) => sum + i.qty, 0), [cart]);
  const savedCount = savedServices.length + savedStylists.length + savedProducts.length;

  const value: StudioStore = {
    cart,
    cartCount,
    subtotal,
    resolvedCart,
    addToBag,
    removeFromBag,
    setQty,
    clearBag,
    savedServices,
    savedStylists,
    savedProducts,
    savedCount,
    toggleSavedService,
    toggleSavedStylist,
    toggleSavedProduct,
    isSavedService: useCallback((id: string) => savedServices.includes(id), [savedServices]) as StudioStore["isSavedService"],
    isSavedStylist: useCallback((id: string) => savedStylists.includes(id), [savedStylists]) as StudioStore["isSavedStylist"],
    isSavedProduct: useCallback((id: string) => savedProducts.includes(id), [savedProducts]) as StudioStore["isSavedProduct"],
    activePlan,
    setActivePlan,
    cartOpen,
    setCartOpen,
    savedOpen,
    setSavedOpen,
    paletteOpen,
    setPaletteOpen,
    matcherOpen,
    setMatcherOpen,
  };

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

export function useStudio() {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error("useStudio must be used within StudioProvider");
  return ctx;
}

export function isNewsletterSubscribed() {
  try {
    return localStorage.getItem(NEWSLETTER_KEY) === "1";
  } catch {
    return false;
  }
}

export function markNewsletterSubscribed() {
  try {
    localStorage.setItem(NEWSLETTER_KEY, "1");
  } catch { /* noop */ }
}
