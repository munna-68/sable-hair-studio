import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Service, Stylist, services as initialServices, stylists as initialStylists, memberships } from "@/lib/salon-data";
import { RetailProduct, retailProducts as initialRetailProducts } from "@/lib/shop-data";
import {
  SalonAppointment,
  SalonOrder,
  SalonOrderItem,
  StudioInquiry,
  SalonClient,
  StudioSettings,
  AppointmentStatus,
  PaymentStatus,
  getDefaultAppointments,
  getDefaultOrders,
  getDefaultInquiries,
  getDefaultClients,
  getDefaultSettings,
  getDefaultSubscribers,
  getIsoDateOffset,
} from "@/lib/defaultStudioData";

export type CartKind = "service" | "product" | "membership";
export type CartItem = { kind: CartKind; id: string; qty: number };
export type ResolvedCartItem = CartItem & { name: string; detail: string; price: number };

const STORAGE_KEYS = {
  CART: "sable-cart-v2",
  SAVED_SERVICES: "sable-saved-services-v2",
  SAVED_STYLISTS: "sable-saved-stylists-v2",
  SAVED_PRODUCTS: "sable-saved-products-v2",
  ACTIVE_PLAN: "sable-active-plan-v2",
  APPOINTMENTS: "sable-appointments-v2",
  ORDERS: "sable-orders-v2",
  INQUIRIES: "sable-inquiries-v2",
  CLIENTS: "sable-clients-v2",
  SERVICES: "sable-services-v2",
  PRODUCTS: "sable-products-v2",
  SETTINGS: "sable-settings-v2",
  SUBSCRIBERS: "sable-subscribers-v2",
};

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
    const p = initialRetailProducts.find((prod) => prod.id === item.id);
    if (!p) return null;
    return { ...item, name: p.name, detail: p.size, price: p.price };
  }
  if (item.kind === "service") {
    const s = initialServices.find((serv) => serv.id === item.id);
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

export interface StudioStats {
  todayAppointmentsCount: number;
  todayRevenue: number;
  activeChairsCount: number;
  inChairCount: number;
  totalClientsCount: number;
  newInquiriesCount: number;
  pendingConsultationsCount: number;
  readyOrdersCount: number;
  lowStockProductsCount: number;
}

export interface StudioStoreContextType {
  // Storefront & Cart
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

  // Data Entities
  appointments: SalonAppointment[];
  orders: SalonOrder[];
  inquiries: StudioInquiry[];
  clients: SalonClient[];
  services: Service[];
  retailProducts: RetailProduct[];
  settings: StudioSettings;
  subscribers: string[];
  stats: StudioStats;

  // Operations: Appointments
  addAppointment: (data: Omit<SalonAppointment, "id" | "createdAt">) => SalonAppointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  updateAppointmentPayment: (id: string, paymentStatus: PaymentStatus, method?: "card" | "apple-pay" | "cash" | "membership", tip?: number) => void;
  updateAppointmentFormula: (id: string, formulaNotes: string) => void;
  updateAppointment: (id: string, patch: Partial<SalonAppointment>) => void;
  deleteAppointment: (id: string) => void;

  // Operations: Orders
  addOrder: (data: Omit<SalonOrder, "id" | "createdAt">) => SalonOrder;
  updateOrderStatus: (id: string, status: SalonOrder["status"]) => void;
  updateOrderPayment: (id: string, paymentStatus: SalonOrder["paymentStatus"]) => void;
  deleteOrder: (id: string) => void;

  // Operations: Inquiries
  addInquiry: (data: Omit<StudioInquiry, "id" | "createdAt">) => StudioInquiry;
  updateInquiryStatus: (id: string, status: StudioInquiry["status"], replyNote?: string) => void;
  deleteInquiry: (id: string) => void;

  // Operations: Services & Products
  updateService: (id: string, patch: Partial<Service>) => void;
  addService: (service: Service) => void;
  deleteService: (id: string) => void;
  updateRetailProduct: (id: string, patch: Partial<RetailProduct>) => void;
  updateProductStock: (id: string, delta: number) => void;
  addRetailProduct: (product: RetailProduct) => void;
  deleteRetailProduct: (id: string) => void;

  // Operations: Clients
  addClient: (data: Omit<SalonClient, "id" | "totalVisits" | "totalSpend" | "formulas" | "lastVisitDate">) => SalonClient;
  updateClient: (id: string, patch: Partial<SalonClient>) => void;
  addClientFormula: (clientId: string, formula: string, stylist: string) => void;

  // Operations: Settings & System
  updateSettings: (patch: Partial<StudioSettings>) => void;
  toggleBlackoutDate: (dateKey: string) => void;
  addSubscriber: (email: string) => boolean;
  resetToDefaults: () => void;
}

const StudioContext = createContext<StudioStoreContextType | null>(null);

export function StudioProvider({ children }: { children: React.ReactNode }) {
  // Storefront navigation & bag states
  const [cart, setCart] = useState<CartItem[]>(() =>
    typeof window === "undefined" ? [] : readJSON<CartItem[]>(STORAGE_KEYS.CART, []),
  );
  const [savedServices, setSavedServices] = useState<string[]>(() =>
    typeof window === "undefined" ? [] : readJSON<string[]>(STORAGE_KEYS.SAVED_SERVICES, []),
  );
  const [savedStylists, setSavedStylists] = useState<string[]>(() =>
    typeof window === "undefined" ? [] : readJSON<string[]>(STORAGE_KEYS.SAVED_STYLISTS, []),
  );
  const [savedProducts, setSavedProducts] = useState<string[]>(() =>
    typeof window === "undefined" ? [] : readJSON<string[]>(STORAGE_KEYS.SAVED_PRODUCTS, []),
  );
  const [activePlan, setActivePlanState] = useState<string | null>(() =>
    typeof window === "undefined" ? null : readJSON<string | null>(STORAGE_KEYS.ACTIVE_PLAN, null),
  );
  const [cartOpen, setCartOpen] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [matcherOpen, setMatcherOpen] = useState(false);

  // Business state
  const [appointments, setAppointments] = useState<SalonAppointment[]>(() =>
    typeof window === "undefined" ? getDefaultAppointments() : readJSON<SalonAppointment[]>(STORAGE_KEYS.APPOINTMENTS, getDefaultAppointments()),
  );
  const [orders, setOrders] = useState<SalonOrder[]>(() =>
    typeof window === "undefined" ? getDefaultOrders() : readJSON<SalonOrder[]>(STORAGE_KEYS.ORDERS, getDefaultOrders()),
  );
  const [inquiries, setInquiries] = useState<StudioInquiry[]>(() =>
    typeof window === "undefined" ? getDefaultInquiries() : readJSON<StudioInquiry[]>(STORAGE_KEYS.INQUIRIES, getDefaultInquiries()),
  );
  const [clients, setClients] = useState<SalonClient[]>(() =>
    typeof window === "undefined" ? getDefaultClients() : readJSON<SalonClient[]>(STORAGE_KEYS.CLIENTS, getDefaultClients()),
  );
  const [services, setServices] = useState<Service[]>(() =>
    typeof window === "undefined" ? initialServices : readJSON<Service[]>(STORAGE_KEYS.SERVICES, initialServices),
  );
  const [retailProducts, setRetailProducts] = useState<RetailProduct[]>(() =>
    typeof window === "undefined" ? initialRetailProducts : readJSON<RetailProduct[]>(STORAGE_KEYS.PRODUCTS, initialRetailProducts),
  );
  const [settings, setSettings] = useState<StudioSettings>(() =>
    typeof window === "undefined" ? getDefaultSettings() : readJSON<StudioSettings>(STORAGE_KEYS.SETTINGS, getDefaultSettings()),
  );
  const [subscribers, setSubscribers] = useState<string[]>(() =>
    typeof window === "undefined" ? getDefaultSubscribers() : readJSON<string[]>(STORAGE_KEYS.SUBSCRIBERS, getDefaultSubscribers()),
  );

  // Persistence effects
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart)); } catch {}
  }, [cart]);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.SAVED_SERVICES, JSON.stringify(savedServices)); } catch {}
  }, [savedServices]);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.SAVED_STYLISTS, JSON.stringify(savedStylists)); } catch {}
  }, [savedStylists]);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.SAVED_PRODUCTS, JSON.stringify(savedProducts)); } catch {}
  }, [savedProducts]);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.ACTIVE_PLAN, JSON.stringify(activePlan)); } catch {}
  }, [activePlan]);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments)); } catch {}
  }, [appointments]);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders)); } catch {}
  }, [orders]);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries)); } catch {}
  }, [inquiries]);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients)); } catch {}
  }, [clients]);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services)); } catch {}
  }, [services]);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(retailProducts)); } catch {}
  }, [retailProducts]);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings)); } catch {}
  }, [settings]);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(subscribers)); } catch {}
  }, [subscribers]);

  // Bag methods
  const addToBag = useCallback((kind: CartKind, id: string, label?: string) => {
    setCart((prev) => {
      const found = prev.find((i) => i.kind === kind && i.id === id);
      if (found) {
        return prev.map((i) => (i.kind === kind && i.id === id ? { ...i, qty: Math.min(9, i.qty + 1) } : i));
      }
      return [...prev, { kind, id, qty: 1 }];
    });
    toast.success(`Added to bag — ${label ?? id}`, {
      description: "Saved in your bag. Review and checkout anytime.",
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

  // Saved items
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
          description: "Your rhythm is set. Next visit date auto-generated.",
        });
      } else {
        toast.info("Membership paused.", { description: "Your rhythm is on hold in this demo." });
      }
    }
  }, []);

  const resolvedCart = useMemo(() => {
    return cart.map((item) => {
      if (item.kind === "product") {
        const p = retailProducts.find((prod) => prod.id === item.id) ?? initialRetailProducts.find((prod) => prod.id === item.id);
        if (!p) return null;
        return { ...item, name: p.name, detail: p.size, price: p.price };
      }
      if (item.kind === "service") {
        const s = services.find((serv) => serv.id === item.id) ?? initialServices.find((serv) => serv.id === item.id);
        if (!s) return null;
        return { ...item, name: s.name, detail: `${s.duration} min · ${s.category}`, price: s.price };
      }
      const m = memberships.find((plan) => plan.id === item.id);
      if (!m) return null;
      return { ...item, name: m.name, detail: m.cadence, price: m.price };
    }).filter((i): i is ResolvedCartItem => i !== null);
  }, [cart, retailProducts, services]);

  const subtotal = useMemo(() => resolvedCart.reduce((sum, i) => sum + i.price * i.qty, 0), [resolvedCart]);
  const cartCount = useMemo(() => cart.reduce((sum, i) => sum + i.qty, 0), [cart]);
  const savedCount = savedServices.length + savedStylists.length + savedProducts.length;

  // Appointment Actions
  const addAppointment = useCallback((data: Omit<SalonAppointment, "id" | "createdAt">): SalonAppointment => {
    const id = `APT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApt: SalonAppointment = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    };
    setAppointments((prev) => [newApt, ...prev]);

    // Also link or update Client profile
    setClients((prev) => {
      const existing = prev.find((c) => c.email.toLowerCase() === data.clientEmail.toLowerCase() || c.phone === data.clientPhone);
      if (existing) {
        return prev.map((c) =>
          c.id === existing.id
            ? {
                ...c,
                totalVisits: c.totalVisits + 1,
                totalSpend: c.totalSpend + data.price,
                lastVisitDate: data.dateKey,
              }
            : c,
        );
      } else {
        const initials = data.clientName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2) || "CL";
        const newClient: SalonClient = {
          id: `cli-${Date.now()}`,
          name: data.clientName,
          email: data.clientEmail,
          phone: data.clientPhone,
          initials,
          accent: "#d8e1ff",
          totalVisits: 1,
          totalSpend: data.price,
          preferredStylistId: data.stylistId,
          hairProfile: "New client intake",
          formulas: data.formulaNotes ? [{ date: data.dateKey, formula: data.formulaNotes, stylist: data.stylistName }] : [],
          sensitivities: data.sensitivities,
          lastVisitDate: data.dateKey,
        };
        return [newClient, ...prev];
      }
    });

    return newApt;
  }, []);

  const updateAppointmentStatus = useCallback((id: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status } : apt)),
    );
  }, []);

  const updateAppointmentPayment = useCallback((id: string, paymentStatus: PaymentStatus, method?: "card" | "apple-pay" | "cash" | "membership", tip?: number) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id
          ? {
              ...apt,
              paymentStatus,
              ...(method ? { paymentMethod: method } : {}),
              ...(tip !== undefined ? { tipAmount: tip } : {}),
            }
          : apt,
      ),
    );
  }, []);

  const updateAppointmentFormula = useCallback((id: string, formulaNotes: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, formulaNotes } : apt)),
    );
  }, []);

  const updateAppointment = useCallback((id: string, patch: Partial<SalonAppointment>) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, ...patch } : apt)),
    );
  }, []);

  const deleteAppointment = useCallback((id: string) => {
    setAppointments((prev) => prev.filter((apt) => apt.id !== id));
  }, []);

  // Order Actions
  const addOrder = useCallback((data: Omit<SalonOrder, "id" | "createdAt">): SalonOrder => {
    const id = `SB-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: SalonOrder = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  }, []);

  const updateOrderStatus = useCallback((id: string, status: SalonOrder["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o)),
    );
  }, []);

  const updateOrderPayment = useCallback((id: string, paymentStatus: SalonOrder["paymentStatus"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, paymentStatus } : o)),
    );
  }, []);

  const deleteOrder = useCallback((id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  }, []);

  // Inquiry Actions
  const addInquiry = useCallback((data: Omit<StudioInquiry, "id" | "createdAt">): StudioInquiry => {
    const id = `INQ-${Math.floor(200 + Math.random() * 800)}`;
    const newInquiry: StudioInquiry = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    };
    setInquiries((prev) => [newInquiry, ...prev]);
    return newInquiry;
  }, []);

  const updateInquiryStatus = useCallback((id: string, status: StudioInquiry["status"], replyNote?: string) => {
    setInquiries((prev) =>
      prev.map((inq) =>
        inq.id === id
          ? {
              ...inq,
              status,
              ...(replyNote ? { replyNote } : {}),
            }
          : inq,
      ),
    );
  }, []);

  const deleteInquiry = useCallback((id: string) => {
    setInquiries((prev) => prev.filter((inq) => inq.id !== id));
  }, []);

  // Service & Product actions
  const updateService = useCallback((id: string, patch: Partial<Service>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    toast.success("Service updated.", { description: "Changes reflected immediately across booking and menu." });
  }, []);

  const addService = useCallback((service: Service) => {
    setServices((prev) => [...prev, service]);
    toast.success("Service created.", { description: `${service.name} is now available to book.` });
  }, []);

  const deleteService = useCallback((id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    toast.info("Service removed from catalog.");
  }, []);

  const updateRetailProduct = useCallback((id: string, patch: Partial<RetailProduct>) => {
    setRetailProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    toast.success("Product updated.");
  }, []);

  const updateProductStock = useCallback((id: string, delta: number) => {
    setRetailProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const currentStock = (p as any).stock ?? 12;
        const nextStock = Math.max(0, currentStock + delta);
        return { ...p, stock: nextStock };
      }),
    );
  }, []);

  const addRetailProduct = useCallback((product: RetailProduct) => {
    setRetailProducts((prev) => [...prev, product]);
    toast.success("Product added to shelf.");
  }, []);

  const deleteRetailProduct = useCallback((id: string) => {
    setRetailProducts((prev) => prev.filter((p) => p.id !== id));
    toast.info("Product removed from shelf.");
  }, []);

  // Client actions
  const addClient = useCallback((data: Omit<SalonClient, "id" | "totalVisits" | "totalSpend" | "formulas" | "lastVisitDate">): SalonClient => {
    const id = `cli-${Date.now()}`;
    const initials = data.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "CL";
    const newClient: SalonClient = {
      ...data,
      id,
      initials,
      totalVisits: 0,
      totalSpend: 0,
      formulas: [],
      lastVisitDate: getIsoDateOffset(0),
    };
    setClients((prev) => [newClient, ...prev]);
    toast.success(`Client profile created for ${data.name}.`);
    return newClient;
  }, []);

  const updateClient = useCallback((id: string, patch: Partial<SalonClient>) => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    toast.success("Client profile updated.");
  }, []);

  const addClientFormula = useCallback((clientId: string, formula: string, stylist: string) => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId
          ? {
              ...c,
              formulas: [{ date: getIsoDateOffset(0), formula, stylist }, ...c.formulas],
            }
          : c,
      ),
    );
    toast.success("Color formula logged to client history.");
  }, []);

  // Settings & System
  const updateSettings = useCallback((patch: Partial<StudioSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
    toast.success("Studio settings updated.");
  }, []);

  const toggleBlackoutDate = useCallback((dateKey: string) => {
    setSettings((prev) => {
      const has = prev.blackoutDates.includes(dateKey);
      return {
        ...prev,
        blackoutDates: has
          ? prev.blackoutDates.filter((d) => d !== dateKey)
          : [...prev.blackoutDates, dateKey],
      };
    });
  }, []);

  const addSubscriber = useCallback((email: string): boolean => {
    const clean = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) return false;
    setSubscribers((prev) => (prev.includes(clean) ? prev : [clean, ...prev]));
    return true;
  }, []);

  const resetToDefaults = useCallback(() => {
    setAppointments(getDefaultAppointments());
    setOrders(getDefaultOrders());
    setInquiries(getDefaultInquiries());
    setClients(getDefaultClients());
    setServices(initialServices);
    setRetailProducts(initialRetailProducts);
    setSettings(getDefaultSettings());
    setSubscribers(getDefaultSubscribers());
    toast.success("Showcase data restored.", {
      description: "All appointments, orders, and services reset to pristine demo state.",
    });
  }, []);

  // Calculated Stats
  const stats: StudioStats = useMemo(() => {
    const todayStr = getIsoDateOffset(0);
    const todayApts = appointments.filter((apt) => apt.dateKey === todayStr && apt.status !== "cancelled");
    const todayRevenue = todayApts.reduce((sum, apt) => sum + apt.price + (apt.tipAmount || 0), 0);
    const inChairCount = appointments.filter((apt) => apt.dateKey === todayStr && (apt.status === "in-chair" || apt.status === "processing")).length;
    const activeChairsCount = new Set(todayApts.filter((apt) => apt.status === "in-chair" || apt.status === "processing").map((a) => a.chairNumber)).size;
    const newInquiriesCount = inquiries.filter((inq) => inq.status === "new").length;
    const pendingConsultationsCount = appointments.filter((apt) => apt.consultationRequired && apt.consultationStatus === "pending").length;
    const readyOrdersCount = orders.filter((o) => o.status === "ready-for-pickup").length;
    const lowStockProductsCount = retailProducts.filter((p: any) => (p.stock !== undefined ? p.stock <= 3 : false)).length;

    return {
      todayAppointmentsCount: todayApts.length,
      todayRevenue,
      activeChairsCount,
      inChairCount,
      totalClientsCount: clients.length,
      newInquiriesCount,
      pendingConsultationsCount,
      readyOrdersCount,
      lowStockProductsCount,
    };
  }, [appointments, inquiries, orders, clients, retailProducts]);

  const value: StudioStoreContextType = {
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
    isSavedService: useCallback((id: string) => savedServices.includes(id), [savedServices]),
    isSavedStylist: useCallback((id: string) => savedStylists.includes(id), [savedStylists]),
    isSavedProduct: useCallback((id: string) => savedProducts.includes(id), [savedProducts]),
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

    appointments,
    orders,
    inquiries,
    clients,
    services,
    retailProducts,
    settings,
    subscribers,
    stats,

    addAppointment,
    updateAppointmentStatus,
    updateAppointmentPayment,
    updateAppointmentFormula,
    updateAppointment,
    deleteAppointment,

    addOrder,
    updateOrderStatus,
    updateOrderPayment,
    deleteOrder,

    addInquiry,
    updateInquiryStatus,
    deleteInquiry,

    updateService,
    addService,
    deleteService,
    updateRetailProduct,
    updateProductStock,
    addRetailProduct,
    deleteRetailProduct,

    addClient,
    updateClient,
    addClientFormula,

    updateSettings,
    toggleBlackoutDate,
    addSubscriber,
    resetToDefaults,
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
    return localStorage.getItem("sable-newsletter-v2") === "1";
  } catch {
    return false;
  }
}

export function markNewsletterSubscribed() {
  try {
    localStorage.setItem("sable-newsletter-v2", "1");
  } catch {}
}
