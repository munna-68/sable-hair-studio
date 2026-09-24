import { AppointmentStatus, PaymentStatus } from "@/lib/defaultStudioData";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyDetailed(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export type TimeBucket = "morning" | "midday" | "afternoon";

export const TIME_BUCKET_LABELS: Record<TimeBucket, { title: string; hint: string }> = {
  morning: { title: "Morning Service", hint: "09:00 AM – 12:00 PM" },
  midday: { title: "Midday Window", hint: "12:00 PM – 03:00 PM" },
  afternoon: { title: "Late Afternoon", hint: "03:00 PM – 06:00 PM" },
};

export function getTimeBucket(timeSlot: string): TimeBucket {
  const match = timeSlot.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return "morning";
  let hour = parseInt(match[1], 10);
  const period = match[3].toUpperCase();
  if (period === "PM" && hour < 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  if (hour < 12) return "morning";
  if (hour < 15) return "midday";
  return "afternoon";
}

export const APPOINTMENT_STATUS_CONFIG: Record<
  AppointmentStatus,
  { label: string; badgeClass: string; dotClass: string }
> = {
  requested: {
    label: "Consult Requested",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
    dotClass: "bg-amber-500",
  },
  confirmed: {
    label: "Confirmed",
    badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
    dotClass: "bg-blue-500",
  },
  "in-chair": {
    label: "In Chair",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold animate-pulse",
    dotClass: "bg-emerald-600",
  },
  processing: {
    label: "Color Processing",
    badgeClass: "bg-purple-100 text-purple-800 border-purple-300 font-medium",
    dotClass: "bg-purple-600",
  },
  completed: {
    label: "Completed",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    dotClass: "bg-slate-400",
  },
  cancelled: {
    label: "Cancelled",
    badgeClass: "bg-rose-100 text-rose-700 border-rose-200",
    dotClass: "bg-rose-500",
  },
};

export const PAYMENT_STATUS_CONFIG: Record<
  PaymentStatus,
  { label: string; badgeClass: string }
> = {
  pending: {
    label: "Balance Due",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
  },
  "deposit-paid": {
    label: "Deposit Paid",
    badgeClass: "bg-sky-50 text-sky-700 border-sky-200",
  },
  completed: {
    label: "Settled in Full",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200 font-medium",
  },
  refunded: {
    label: "Refunded",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

export function formatFriendlyTime(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  } catch {
    return dateStr;
  }
}
