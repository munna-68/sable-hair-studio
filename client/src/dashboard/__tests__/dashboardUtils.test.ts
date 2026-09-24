import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  formatCurrencyDetailed,
  getTimeBucket,
  APPOINTMENT_STATUS_CONFIG,
  PAYMENT_STATUS_CONFIG,
} from "../dashboardUtils";
import { getIsoDateOffset, getDefaultAppointments, getDefaultOrders, getDefaultInquiries } from "@/lib/defaultStudioData";

describe("Dashboard Utils & Data", () => {
  it("formats currency correctly without cents", () => {
    expect(formatCurrency(0)).toBe("$0");
    expect(formatCurrency(92)).toBe("$92");
    expect(formatCurrency(1450)).toBe("$1,450");
  });

  it("formats detailed currency with cents", () => {
    expect(formatCurrencyDetailed(92.5)).toBe("$92.50");
    expect(formatCurrencyDetailed(0)).toBe("$0.00");
  });

  it("categorizes time slots into morning, midday, afternoon", () => {
    expect(getTimeBucket("09:30 AM")).toBe("morning");
    expect(getTimeBucket("11:00 AM")).toBe("morning");
    expect(getTimeBucket("12:00 PM")).toBe("midday");
    expect(getTimeBucket("01:30 PM")).toBe("midday");
    expect(getTimeBucket("02:30 PM")).toBe("midday");
    expect(getTimeBucket("03:30 PM")).toBe("afternoon");
    expect(getTimeBucket("05:00 PM")).toBe("afternoon");
  });

  it("handles fallback time slot gracefully", () => {
    expect(getTimeBucket("invalid")).toBe("morning");
  });

  it("has status configs for all appointment statuses", () => {
    const statuses = ["requested", "confirmed", "in-chair", "processing", "completed", "cancelled"] as const;
    statuses.forEach((status) => {
      expect(APPOINTMENT_STATUS_CONFIG[status]).toBeDefined();
      expect(APPOINTMENT_STATUS_CONFIG[status].label).toBeTruthy();
      expect(APPOINTMENT_STATUS_CONFIG[status].badgeClass).toBeTruthy();
    });
  });

  it("has payment configs for all payment statuses", () => {
    const payments = ["pending", "deposit-paid", "completed", "refunded"] as const;
    payments.forEach((payment) => {
      expect(PAYMENT_STATUS_CONFIG[payment]).toBeDefined();
      expect(PAYMENT_STATUS_CONFIG[payment].label).toBeTruthy();
    });
  });

  it("computes ISO date offset accurately", () => {
    const today = getIsoDateOffset(0);
    const tomorrow = getIsoDateOffset(1);
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(tomorrow).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(today).not.toBe(tomorrow);
  });

  it("provides rich default mock appointments", () => {
    const apts = getDefaultAppointments();
    expect(apts.length).toBeGreaterThanOrEqual(8);
    const today = getIsoDateOffset(0);
    const todayApts = apts.filter((a) => a.dateKey === today);
    expect(todayApts.length).toBeGreaterThan(0);
  });

  it("provides rich default retail orders and inquiries", () => {
    const orders = getDefaultOrders();
    expect(orders.length).toBeGreaterThanOrEqual(3);
    const inqs = getDefaultInquiries();
    expect(inqs.length).toBeGreaterThanOrEqual(3);
  });
});
