import { Service, Stylist, services as initialServices, stylists as initialStylists, memberships } from "./salon-data";
import { RetailProduct, retailProducts as initialRetailProducts } from "./shop-data";

export type AppointmentStatus =
  | "requested"
  | "confirmed"
  | "in-chair"
  | "processing"
  | "completed"
  | "cancelled";

export type PaymentStatus = "pending" | "deposit-paid" | "completed" | "refunded";

export interface SalonAppointment {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceId: string;
  serviceName: string;
  category: "Cut" | "Color" | "Care" | "Grooming";
  duration: number; // in minutes
  price: number;
  deposit: number;
  depositStatus: "pending" | "paid" | "waived";
  paymentStatus: PaymentStatus;
  paymentMethod?: "card" | "apple-pay" | "cash" | "membership";
  tipAmount?: number;
  stylistId: string;
  stylistName: string;
  chairNumber: number;
  dateKey: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:00 AM"
  status: AppointmentStatus;
  isNewClient: boolean;
  consultationRequired: boolean;
  consultationStatus?: "not-required" | "pending" | "approved";
  clientNotes?: string;
  formulaNotes?: string;
  sensitivities?: string;
  createdAt: string;
}

export interface SalonOrderItem {
  kind: "product" | "service" | "membership";
  id: string;
  name: string;
  detail: string;
  price: number;
  qty: number;
}

export interface SalonOrder {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  items: SalonOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: "pending" | "ready-for-pickup" | "collected" | "cancelled";
  paymentStatus: "paid" | "pending";
  paymentMethod: string;
  pickupNotes?: string;
  createdAt: string;
}

export interface StudioInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  topic: string;
  message: string;
  status: "new" | "in-review" | "replied" | "archived";
  replyNote?: string;
  createdAt: string;
}

export interface SalonClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  initials: string;
  accent: string;
  totalVisits: number;
  totalSpend: number;
  preferredStylistId: string;
  membershipPlan?: string;
  hairProfile: string;
  formulas: { date: string; formula: string; stylist: string }[];
  sensitivities?: string;
  internalNotes?: string;
  lastVisitDate: string;
}

export interface DayHours {
  day: string;
  shortDay: string;
  open: string;
  close: string;
  closed: boolean;
}

export interface StudioSettings {
  studioName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  mapsUrl: string;
  isOpenToday: boolean;
  cancellationWindowHours: number;
  defaultDepositPercent: number;
  announcementBanner: {
    enabled: boolean;
    message: string;
    type: "info" | "emerald" | "notice";
  };
  operatingHours: DayHours[];
  blackoutDates: string[];
}

export function getIsoDateOffset(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export function getDefaultSettings(): StudioSettings {
  return {
    studioName: "Sable Hair Studio",
    tagline: "Thoughtful cuts, lived-in color, and considered time.",
    address: "118 Pine Street, Seattle, WA 98101",
    phone: "(206) 555-0198",
    email: "hello@sablestudio.example",
    mapsUrl: "https://maps.google.com/?q=118+Pine+Street+Seattle+WA",
    isOpenToday: true,
    cancellationWindowHours: 48,
    defaultDepositPercent: 25,
    announcementBanner: {
      enabled: true,
      message: "Spring appointments are now live. Reserve early for dimensional color sessions.",
      type: "emerald",
    },
    operatingHours: [
      { day: "Sunday", shortDay: "Sun", open: "10:00 AM", close: "05:00 PM", closed: false },
      { day: "Monday", shortDay: "Mon", open: "09:00 AM", close: "06:00 PM", closed: true },
      { day: "Tuesday", shortDay: "Tue", open: "09:00 AM", close: "06:00 PM", closed: false },
      { day: "Wednesday", shortDay: "Wed", open: "09:00 AM", close: "06:00 PM", closed: false },
      { day: "Thursday", shortDay: "Thu", open: "09:00 AM", close: "06:00 PM", closed: false },
      { day: "Friday", shortDay: "Fri", open: "09:00 AM", close: "06:00 PM", closed: false },
      { day: "Saturday", shortDay: "Sat", open: "10:00 AM", close: "05:00 PM", closed: false },
    ],
    blackoutDates: [
      getIsoDateOffset(14),
      getIsoDateOffset(28),
    ],
  };
}

export function getDefaultClients(): SalonClient[] {
  return [
    {
      id: "cli-1",
      name: "Elena Vance",
      email: "elena.vance@example.com",
      phone: "(206) 555-0142",
      initials: "EV",
      accent: "#d8e1ff",
      totalVisits: 8,
      totalSpend: 1840,
      preferredStylistId: "mara",
      membershipPlan: "Color Rhythm",
      hairProfile: "Fine, high-density, cool natural level 6 brunette",
      formulas: [
        { date: getIsoDateOffset(-60), formula: "Root: 6N + 6NA with 20vol. Lowlight: 7NB. Gloss: 9V + 9GI clear.", stylist: "Mara Chen" },
        { date: getIsoDateOffset(-140), formula: "Balayage blonde highlights: Clay lightener + 25vol. Tone: 9GI + 9V.", stylist: "Mara Chen" },
      ],
      sensitivities: "Sensitive nape, cool water rinse preferred",
      internalNotes: "Prefers tea with oat milk; quiet chair during root processing.",
      lastVisitDate: getIsoDateOffset(-12),
    },
    {
      id: "cli-2",
      name: "Marcus Thorne",
      email: "marcus.thorne@example.com",
      phone: "(206) 555-0189",
      initials: "MT",
      accent: "#e8defb",
      totalVisits: 14,
      totalSpend: 780,
      preferredStylistId: "eli",
      membershipPlan: "The Cut Standard",
      hairProfile: "Coarse, straight, square fade with natural cowlick",
      formulas: [],
      sensitivities: "No menthol aftershave",
      internalNotes: "Book every 4 weeks; prefers clean tapered neckline.",
      lastVisitDate: getIsoDateOffset(-24),
    },
    {
      id: "cli-3",
      name: "Chloe St. James",
      email: "chloe.stjames@example.com",
      phone: "(206) 555-0231",
      initials: "CS",
      accent: "#ffe2db",
      totalVisits: 5,
      totalSpend: 1420,
      preferredStylistId: "sofia",
      membershipPlan: "The Finish Club",
      hairProfile: "3B curly texture, prone to moisture loss, medium porosity",
      formulas: [
        { date: getIsoDateOffset(-45), formula: "Keratin Complex express treatment + botanical moisture bath.", stylist: "Sofia Reyes" },
      ],
      sensitivities: "Sulfates, high heat",
      internalNotes: "Always diffuse on low heat. Loves Mineral Moisture Balm.",
      lastVisitDate: getIsoDateOffset(-18),
    },
    {
      id: "cli-4",
      name: "Julian Brooks",
      email: "j.brooks@example.com",
      phone: "(206) 555-0374",
      initials: "JB",
      accent: "#d4f0e7",
      totalVisits: 6,
      totalSpend: 590,
      preferredStylistId: "noa",
      hairProfile: "Medium straight, jaw-length architectural bob",
      formulas: [],
      sensitivities: "None reported",
      internalNotes: "Exacting lines; dry-cut detailing on weight line.",
      lastVisitDate: getIsoDateOffset(-30),
    },
    {
      id: "cli-5",
      name: "Maya Lin",
      email: "maya.lin@example.com",
      phone: "(206) 555-0455",
      initials: "ML",
      accent: "#d8e1ff",
      totalVisits: 3,
      totalSpend: 820,
      preferredStylistId: "mara",
      hairProfile: "Thick Asian hair, previously bleached ends, level 3 natural",
      formulas: [
        { date: getIsoDateOffset(-90), formula: "Tone: 7NA + 8T Shades EQ. Bond builder added to all bowls.", stylist: "Mara Chen" },
      ],
      sensitivities: "High sensitivity to bleach on scalp — foil placement off-root only",
      internalNotes: "Prefers silent appointments for laptop work.",
      lastVisitDate: getIsoDateOffset(-40),
    },
    {
      id: "cli-6",
      name: "Soren Alexander",
      email: "soren.a@example.com",
      phone: "(206) 555-0612",
      initials: "SA",
      accent: "#e8defb",
      totalVisits: 4,
      totalSpend: 310,
      preferredStylistId: "eli",
      hairProfile: "Wavy, medium density, beard maintenance",
      formulas: [],
      sensitivities: "None",
      internalNotes: "Matte paste styling only.",
      lastVisitDate: getIsoDateOffset(-8),
    },
  ];
}

export function getDefaultAppointments(): SalonAppointment[] {
  const today = getIsoDateOffset(0);
  const tomorrow = getIsoDateOffset(1);
  const inTwoDays = getIsoDateOffset(2);
  const yesterday = getIsoDateOffset(-1);

  return [
    // Today's appointments
    {
      id: "APT-1081",
      clientName: "Elena Vance",
      clientEmail: "elena.vance@example.com",
      clientPhone: "(206) 555-0142",
      serviceId: "lived-in-color",
      serviceName: "Lived-In Color",
      category: "Color",
      duration: 150,
      price: 265,
      deposit: 66,
      depositStatus: "paid",
      paymentStatus: "deposit-paid",
      stylistId: "mara",
      stylistName: "Mara Chen",
      chairNumber: 1,
      dateKey: today,
      timeSlot: "10:00 AM",
      status: "in-chair",
      isNewClient: false,
      consultationRequired: false,
      consultationStatus: "not-required",
      clientNotes: "Refreshing lived-in dimension and melting roots slightly lower.",
      formulaNotes: "Root: 6N + 20vol. Tone: 9V Shades EQ gloss 15m.",
      sensitivities: "Cool water rinse preferred",
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: "APT-1082",
      clientName: "Marcus Thorne",
      clientEmail: "marcus.thorne@example.com",
      clientPhone: "(206) 555-0189",
      serviceId: "precision-short",
      serviceName: "Precision Short Cut",
      category: "Cut",
      duration: 45,
      price: 68,
      deposit: 0,
      depositStatus: "waived",
      paymentStatus: "completed",
      paymentMethod: "card",
      tipAmount: 18,
      stylistId: "eli",
      stylistName: "Eli Brooks",
      chairNumber: 4,
      dateKey: today,
      timeSlot: "09:30 AM",
      status: "completed",
      isNewClient: false,
      consultationRequired: false,
      consultationStatus: "not-required",
      clientNotes: "Tight taper on sides, 1.5 scissor length on top.",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "APT-1083",
      clientName: "Chloe St. James",
      clientEmail: "chloe.stjames@example.com",
      clientPhone: "(206) 555-0231",
      serviceId: "keratin-smoothing",
      serviceName: "Keratin Smoothing",
      category: "Care",
      duration: 180,
      price: 340,
      deposit: 102,
      depositStatus: "paid",
      paymentStatus: "deposit-paid",
      stylistId: "sofia",
      stylistName: "Sofia Reyes",
      chairNumber: 3,
      dateKey: today,
      timeSlot: "11:30 AM",
      status: "confirmed",
      isNewClient: false,
      consultationRequired: false,
      consultationStatus: "not-required",
      clientNotes: "Pre-vacation humidity defense treatment; focus on crown frizz.",
      sensitivities: "Sulfates, high heat",
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    },
    {
      id: "APT-1084",
      clientName: "Julian Brooks",
      clientEmail: "j.brooks@example.com",
      clientPhone: "(206) 555-0374",
      serviceId: "signature-cut",
      serviceName: "Signature Cut",
      category: "Cut",
      duration: 60,
      price: 92,
      deposit: 0,
      depositStatus: "waived",
      paymentStatus: "pending",
      stylistId: "noa",
      stylistName: "Noa Williams",
      chairNumber: 2,
      dateKey: today,
      timeSlot: "01:30 PM",
      status: "confirmed",
      isNewClient: false,
      consultationRequired: false,
      consultationStatus: "not-required",
      clientNotes: "Sharpening French bob line, gentle fringe texturing.",
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
    {
      id: "APT-1085",
      clientName: "Avery Sterling",
      clientEmail: "avery.sterling@example.com",
      clientPhone: "(206) 555-0721",
      serviceId: "color-refresh",
      serviceName: "Root + Gloss Refresh",
      category: "Color",
      duration: 105,
      price: 178,
      deposit: 45,
      depositStatus: "paid",
      paymentStatus: "deposit-paid",
      stylistId: "mara",
      stylistName: "Mara Chen",
      chairNumber: 1,
      dateKey: today,
      timeSlot: "02:30 PM",
      status: "confirmed",
      isNewClient: true,
      consultationRequired: true,
      consultationStatus: "approved",
      clientNotes: "First visit for root gloss; consult was approved via photos.",
      formulaNotes: "Expect 40% grey at temple; 5N + 6NA recommended.",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "APT-1086",
      clientName: "Miles Harrison",
      clientEmail: "miles.h@example.com",
      clientPhone: "(206) 555-0814",
      serviceId: "grooming-detail",
      serviceName: "Grooming Detail",
      category: "Grooming",
      duration: 30,
      price: 48,
      deposit: 0,
      depositStatus: "waived",
      paymentStatus: "pending",
      stylistId: "eli",
      stylistName: "Eli Brooks",
      chairNumber: 4,
      dateKey: today,
      timeSlot: "04:00 PM",
      status: "confirmed",
      isNewClient: true,
      consultationRequired: false,
      clientNotes: "Beard shape and neckline for weekend event.",
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    },

    // Tomorrow's appointments
    {
      id: "APT-1087",
      clientName: "Maya Lin",
      clientEmail: "maya.lin@example.com",
      clientPhone: "(206) 555-0455",
      serviceId: "full-balayage",
      serviceName: "Full Balayage",
      category: "Color",
      duration: 210,
      price: 385,
      deposit: 115,
      depositStatus: "paid",
      paymentStatus: "deposit-paid",
      stylistId: "mara",
      stylistName: "Mara Chen",
      chairNumber: 1,
      dateKey: tomorrow,
      timeSlot: "10:00 AM",
      status: "confirmed",
      isNewClient: false,
      consultationRequired: false,
      clientNotes: "Full summer lightening, soft cool vanilla tones.",
      formulaNotes: "Clay lightener + 25vol, bond builder step 1.",
      sensitivities: "Foil placement off-root only",
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: "APT-1088",
      clientName: "Clara Bennett",
      clientEmail: "clara.b@example.com",
      clientPhone: "(206) 555-0932",
      serviceId: "signature-cut",
      serviceName: "Signature Cut",
      category: "Cut",
      duration: 60,
      price: 92,
      deposit: 0,
      depositStatus: "waived",
      paymentStatus: "pending",
      stylistId: "noa",
      stylistName: "Noa Williams",
      chairNumber: 2,
      dateKey: tomorrow,
      timeSlot: "11:30 AM",
      status: "confirmed",
      isNewClient: true,
      consultationRequired: false,
      clientNotes: "Looking for curtain bangs and long layers for movement.",
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: "APT-1089",
      clientName: "Lucas Romero",
      clientEmail: "lucas.romero@example.com",
      clientPhone: "(206) 555-0988",
      serviceId: "repair-ritual",
      serviceName: "Repair Ritual",
      category: "Care",
      duration: 45,
      price: 74,
      deposit: 0,
      depositStatus: "waived",
      paymentStatus: "pending",
      stylistId: "sofia",
      stylistName: "Sofia Reyes",
      chairNumber: 3,
      dateKey: tomorrow,
      timeSlot: "02:00 PM",
      status: "confirmed",
      isNewClient: false,
      consultationRequired: false,
      clientNotes: "Scalp soothing ritual post-travel.",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },

    // In two days
    {
      id: "APT-1090",
      clientName: "Dominique Rossi",
      clientEmail: "d.rossi@example.com",
      clientPhone: "(206) 555-1102",
      serviceId: "lived-in-color",
      serviceName: "Lived-In Color",
      category: "Color",
      duration: 150,
      price: 265,
      deposit: 66,
      depositStatus: "paid",
      paymentStatus: "deposit-paid",
      stylistId: "sofia",
      stylistName: "Sofia Reyes",
      chairNumber: 3,
      dateKey: inTwoDays,
      timeSlot: "10:30 AM",
      status: "requested",
      isNewClient: true,
      consultationRequired: true,
      consultationStatus: "pending",
      clientNotes: "First time at Sable. Box dyed dark brown 4 months ago.",
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    },

    // Yesterday completed
    {
      id: "APT-1080",
      clientName: "Soren Alexander",
      clientEmail: "soren.a@example.com",
      clientPhone: "(206) 555-0612",
      serviceId: "precision-short",
      serviceName: "Precision Short Cut",
      category: "Cut",
      duration: 45,
      price: 68,
      deposit: 0,
      depositStatus: "waived",
      paymentStatus: "completed",
      paymentMethod: "apple-pay",
      tipAmount: 15,
      stylistId: "eli",
      stylistName: "Eli Brooks",
      chairNumber: 4,
      dateKey: yesterday,
      timeSlot: "03:30 PM",
      status: "completed",
      isNewClient: false,
      consultationRequired: false,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
  ];
}

export function getDefaultOrders(): SalonOrder[] {
  return [
    {
      id: "SB-4819",
      clientName: "Elena Vance",
      clientEmail: "elena.vance@example.com",
      clientPhone: "(206) 555-0142",
      items: [
        {
          kind: "product",
          id: "gloss-rinse",
          name: "Acidic Gloss Finishing Rinse",
          detail: "250 ml",
          price: 42,
          qty: 1,
        },
        {
          kind: "product",
          id: "scalp-serum",
          name: "Botanical Scalp Reset Serum",
          detail: "50 ml",
          price: 48,
          qty: 1,
        },
      ],
      subtotal: 90,
      tax: 9.18,
      total: 99.18,
      status: "ready-for-pickup",
      paymentStatus: "paid",
      paymentMethod: "Apple Pay",
      pickupNotes: "Hold for Elena during her 10 AM color appointment.",
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
    {
      id: "SB-4820",
      clientName: "Chloe St. James",
      clientEmail: "chloe.stjames@example.com",
      clientPhone: "(206) 555-0231",
      items: [
        {
          kind: "product",
          id: "moisture-balm",
          name: "Mineral Moisture Balm",
          detail: "150 ml",
          price: 38,
          qty: 2,
        },
      ],
      subtotal: 76,
      tax: 7.75,
      total: 83.75,
      status: "pending",
      paymentStatus: "paid",
      paymentMethod: "Credit Card (ending 4012)",
      pickupNotes: "Pickup this Friday afternoon.",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "SB-4815",
      clientName: "David Miller",
      clientEmail: "david.m@example.com",
      clientPhone: "(206) 555-0551",
      items: [
        {
          kind: "product",
          id: "texture-spray",
          name: "Pacific Sea Salt Finishing Mist",
          detail: "200 ml",
          price: 34,
          qty: 1,
        },
      ],
      subtotal: 34,
      tax: 3.47,
      total: 37.47,
      status: "collected",
      paymentStatus: "paid",
      paymentMethod: "Credit Card (ending 8821)",
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    },
  ];
}

export function getDefaultInquiries(): StudioInquiry[] {
  return [
    {
      id: "INQ-201",
      name: "Dominique Rossi",
      email: "d.rossi@example.com",
      phone: "(206) 555-1102",
      topic: "Color consultation",
      message: "Hi there! I had boxed dark brown color done about 4 months ago and I am looking to transition into a softer lived-in bronde. Is a consultation required before I schedule the 3-hour appointment with Mara?",
      status: "new",
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
    {
      id: "INQ-202",
      name: "Talia Nguyen",
      email: "talia.nguyen@example.com",
      phone: "(206) 555-0891",
      topic: "Accessibility or sensory needs",
      message: "Hello! I have severe sensory sensitivities to strong synthetic fragrances and chemical odors. Does Sable offer low-scent days or quiet-chair sessions in the early morning?",
      status: "in-review",
      replyNote: "Yes — Tuesday mornings 9-11am are dedicated quiet hours with natural low-scent lines.",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "INQ-203",
      name: "Garrett Walsh",
      email: "garrett.walsh@example.com",
      phone: "(206) 555-0974",
      topic: "Membership question",
      message: "I am interested in The Cut Standard membership. If I am traveling for 6 weeks during summer, can I pause the 8-week cadence and resume in September?",
      status: "replied",
      replyNote: "Confirmed that membership holds can be paused anytime with zero penalty.",
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    },
    {
      id: "INQ-204",
      name: "Kelsey Miller",
      email: "kelsey.m@example.com",
      topic: "Booking help",
      message: "I need to book hair styling for myself and two bridal party members on October 10th. Do you do private studio buyouts for Saturday mornings?",
      status: "new",
      createdAt: new Date(Date.now() - 86400000 * 1.5).toISOString(),
    },
  ];
}

export function getDefaultSubscribers(): string[] {
  return [
    "elena.vance@example.com",
    "marcus.thorne@example.com",
    "chloe.stjames@example.com",
    "maya.lin@example.com",
    "j.brooks@example.com",
    "d.rossi@example.com",
    "talia.nguyen@example.com",
  ];
}
