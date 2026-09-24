/** Chromatic Cut data model: transparent service logic and human specialist matching. */
export type Service = {
  id: string;
  name: string;
  category: "Cut" | "Color" | "Care" | "Grooming";
  description: string;
  duration: number;
  price: number;
  chemical: boolean;
  depositPercent: number;
};

export type Stylist = {
  id: string;
  name: string;
  role: string;
  initials: string;
  bio: string;
  specialties: string[];
  serviceIds: string[];
  weeklyHours: number[];
  accent: string;
};

export type Membership = {
  id: string;
  name: string;
  cadence: string;
  price: number;
  oneTimeValue: number;
  visit: string;
  intervalDays: number;
  detail: string;
  perks: string[];
};

export const services: Service[] = [
  {
    id: "signature-cut",
    name: "Signature Cut",
    category: "Cut",
    description: "A shape-led cut, finishing ritual, and care notes that fit your actual routine.",
    duration: 60,
    price: 92,
    chemical: false,
    depositPercent: 0,
  },
  {
    id: "precision-short",
    name: "Precision Short Cut",
    category: "Cut",
    description: "A focused clipper or scissor cut with a clean neckline and considered finish.",
    duration: 45,
    price: 68,
    chemical: false,
    depositPercent: 0,
  },
  {
    id: "lived-in-color",
    name: "Lived-In Color",
    category: "Color",
    description: "Dimensional, low-maintenance color placed to grow out softly and beautifully.",
    duration: 150,
    price: 265,
    chemical: true,
    depositPercent: 25,
  },
  {
    id: "full-balayage",
    name: "Full Balayage",
    category: "Color",
    description: "A full lightening session with custom placement, gloss, and a finish that photographs well.",
    duration: 210,
    price: 385,
    chemical: true,
    depositPercent: 30,
  },
  {
    id: "color-refresh",
    name: "Root + Gloss Refresh",
    category: "Color",
    description: "Targeted root coverage or tone refinement plus a luminous finishing gloss.",
    duration: 105,
    price: 178,
    chemical: true,
    depositPercent: 25,
  },
  {
    id: "keratin-smoothing",
    name: "Keratin Smoothing",
    category: "Care",
    description: "A consultation-led smoothing treatment for shine, manageability, and softer dry time.",
    duration: 180,
    price: 340,
    chemical: true,
    depositPercent: 30,
  },
  {
    id: "repair-ritual",
    name: "Repair Ritual",
    category: "Care",
    description: "A restorative in-chair treatment with scalp massage and customized home-care guidance.",
    duration: 45,
    price: 74,
    chemical: false,
    depositPercent: 0,
  },
  {
    id: "grooming-detail",
    name: "Grooming Detail",
    category: "Grooming",
    description: "A polished maintenance appointment for cut, beard, and neckline detail.",
    duration: 30,
    price: 48,
    chemical: false,
    depositPercent: 0,
  },
];

export const stylists: Stylist[] = [
  {
    id: "mara",
    name: "Mara Chen",
    role: "Color Director",
    initials: "MC",
    bio: "Dimensional brunettes, seamless blondes, and practical long-term color plans.",
    specialties: ["Balayage", "Color correction", "Glossing"],
    serviceIds: ["signature-cut", "lived-in-color", "full-balayage", "color-refresh", "repair-ritual"],
    weeklyHours: [2, 3, 4, 6],
    accent: "#d8e1ff",
  },
  {
    id: "noa",
    name: "Noa Williams",
    role: "Cut Specialist",
    initials: "NW",
    bio: "Graphic bobs, soft shags, and short shapes that keep their line between visits.",
    specialties: ["Precision cutting", "Bobs", "Texture"],
    serviceIds: ["signature-cut", "precision-short", "repair-ritual", "grooming-detail"],
    weeklyHours: [1, 2, 4, 5, 6],
    accent: "#d4f0e7",
  },
  {
    id: "sofia",
    name: "Sofia Reyes",
    role: "Texture + Care",
    initials: "SR",
    bio: "Healthy texture, smoothing plans, and color that respects the hair underneath.",
    specialties: ["Keratin", "Curly cuts", "Soft color"],
    serviceIds: ["signature-cut", "lived-in-color", "color-refresh", "keratin-smoothing", "repair-ritual"],
    weeklyHours: [0, 1, 3, 4, 5],
    accent: "#ffe2db",
  },
  {
    id: "eli",
    name: "Eli Brooks",
    role: "Grooming Lead",
    initials: "EB",
    bio: "Modern grooming and low-maintenance cuts with disciplined finishing detail.",
    specialties: ["Short cuts", "Grooming", "Scalp care"],
    serviceIds: ["signature-cut", "precision-short", "repair-ritual", "grooming-detail"],
    weeklyHours: [1, 2, 3, 5, 6],
    accent: "#e8defb",
  },
];

export const memberships: Membership[] = [
  {
    id: "blowout-club",
    name: "The Finish Club",
    cadence: "Monthly",
    price: 68,
    oneTimeValue: 88,
    visit: "One signature blowout or styling finish",
    intervalDays: 30,
    detail: "For the person who treats a great finish as part of their week, not a special occasion.",
    perks: ["One monthly finish", "Priority scheduling", "10% off add-on care"],
  },
  {
    id: "color-rhythm",
    name: "Color Rhythm",
    cadence: "Quarterly",
    price: 149,
    oneTimeValue: 178,
    visit: "Root + gloss refresh appointment",
    intervalDays: 90,
    detail: "A quieter way to keep your color intentional between larger transformation appointments.",
    perks: ["Refresh every 90 days", "Priority color window", "Complimentary repair ritual"],
  },
  {
    id: "cut-standard",
    name: "The Cut Standard",
    cadence: "Every 8 weeks",
    price: 79,
    oneTimeValue: 92,
    visit: "One signature cut with care check-in",
    intervalDays: 56,
    detail: "A dependable cadence for shape, health, and a better conversation about what is next.",
    perks: ["Automatic 8-week hold", "First choice on shifts", "15% off retail care"],
  },
];

export function getService(id?: string) {
  return services.find((service) => service.id === id);
}

export function getCompatibleStylists(serviceId?: string, customService?: Service) {
  if (!serviceId) return [];
  const directMatches = stylists.filter((stylist) => stylist.serviceIds.includes(serviceId));
  if (directMatches.length > 0) return directMatches;

  // For custom or newly added services, match based on category
  const targetCategory = customService?.category || getService(serviceId)?.category;
  if (targetCategory === "Color") {
    return stylists.filter((s) => s.id === "mara" || s.id === "sofia" || s.id === "noa");
  }
  if (targetCategory === "Grooming") {
    return stylists.filter((s) => s.id === "eli" || s.id === "noa");
  }
  // Cut or Care or unassigned
  return stylists;
}

export function getDepositAmount(service?: Service) {
  if (!service || service.depositPercent === 0) return 0;
  return Math.round((service.price * service.depositPercent) / 100);
}

export function getCancellationWindow(service?: Service) {
  return service && (service.chemical || service.duration >= 120) ? 48 : 24;
}

const scheduleBlocks: Record<string, { weekday: number; start: number; length: number }[]> = {
  mara: [
    { weekday: 2, start: 660, length: 120 },
    { weekday: 3, start: 540, length: 90 },
    { weekday: 4, start: 780, length: 90 },
    { weekday: 6, start: 600, length: 60 },
  ],
  noa: [
    { weekday: 1, start: 600, length: 60 },
    { weekday: 2, start: 720, length: 60 },
    { weekday: 4, start: 540, length: 120 },
    { weekday: 5, start: 780, length: 60 },
  ],
  sofia: [
    { weekday: 0, start: 720, length: 60 },
    { weekday: 1, start: 570, length: 90 },
    { weekday: 3, start: 660, length: 120 },
    { weekday: 5, start: 540, length: 90 },
  ],
  eli: [
    { weekday: 1, start: 720, length: 30 },
    { weekday: 2, start: 570, length: 60 },
    { weekday: 3, start: 780, length: 60 },
    { weekday: 5, start: 660, length: 90 },
  ],
};

function dateFromKey(key: string) {
  return new Date(`${key}T12:00:00`);
}

export function parseTimeToMinutes(timeSlot: string): number {
  const match = timeSlot.match(/^0?(\d+):(\d+)\s*(AM|PM)$/i);
  if (!match) return -1;
  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const isPM = match[3].toUpperCase() === "PM";
  if (isPM && hour < 12) hour += 12;
  if (!isPM && hour === 12) hour = 0;
  return hour * 60 + minute;
}

export function formatTime(minutes: number) {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${String(displayHour).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${suffix}`;
}

export interface SlotCheckOptions {
  existingAppointments?: { stylistId: string; dateKey: string; timeSlot: string; duration: number; status: string }[];
  blackoutDates?: string[];
  operatingHours?: { day: string; shortDay: string; open: string; close: string; closed: boolean }[];
  serviceObj?: Service;
}

export function getAvailableSlots(
  stylistId?: string,
  serviceId?: string,
  dateKey?: string,
  options?: SlotCheckOptions
) {
  const stylist = stylists.find((item) => item.id === stylistId);
  const service = options?.serviceObj || getService(serviceId);
  if (!stylist || !service || !dateKey) return [];

  // Blackout date check
  if (options?.blackoutDates?.includes(dateKey)) return [];

  const weekday = dateFromKey(dateKey).getDay();
  if (!stylist.weeklyHours.includes(weekday)) return [];

  let dayStart = 540;
  let dayEnd = 1080;

  if (options?.operatingHours && options.operatingHours[weekday]) {
    const dayConfig = options.operatingHours[weekday];
    if (dayConfig.closed) return [];
    const openMin = parseTimeToMinutes(dayConfig.open);
    const closeMin = parseTimeToMinutes(dayConfig.close);
    if (openMin > 0 && closeMin > openMin) {
      dayStart = openMin;
      dayEnd = closeMin;
    }
  }

  const blocked = [...(scheduleBlocks[stylist.id] ?? [])];

  // Dynamic booking conflict filter
  if (options?.existingAppointments) {
    options.existingAppointments
      .filter((apt) => apt.stylistId === stylistId && apt.dateKey === dateKey && apt.status !== "cancelled")
      .forEach((apt) => {
        const start = parseTimeToMinutes(apt.timeSlot);
        if (start >= 0) {
          blocked.push({
            weekday,
            start,
            length: apt.duration,
          });
        }
      });
  }

  const slotsCount = Math.floor((dayEnd - dayStart) / 30);
  return Array.from({ length: Math.max(0, slotsCount) }, (_, index) => dayStart + index * 30)
    .filter((start) => start + service.duration <= dayEnd)
    .filter(
      (start) =>
        !blocked
          .filter((block) => block.weekday === weekday)
          .some((block) => start < block.start + block.length && start + service.duration > block.start),
    )
    .map(formatTime);
}

export function getDateOptions(count = 7) {
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    return {
      value: date.toISOString().slice(0, 10),
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      number: date.getDate(),
      month: date.toLocaleDateString("en-US", { month: "short" }),
    };
  });
}

export function formatAppointmentDate(dateKey?: string) {
  if (!dateKey) return "Choose a date";
  return dateFromKey(dateKey).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function getNextMembershipDate(intervalDays: number) {
  const date = new Date();
  date.setDate(date.getDate() + intervalDays);
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}
