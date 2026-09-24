/**
 * Motion system for the Chromatic Cut shell.
 *
 * One scroll listener, one observer, zero React re-renders. Everything is
 * expressed as a CSS custom property or a class on <html>, so the animation
 * layer stays in index.css where the rest of the design system lives.
 *
 * Contract with the stylesheet:
 *   [data-reveal]            -> fades/settles in once scrolled into view
 *   [data-parallax="0.12"]   -> translated by --py as it crosses the viewport
 *   html.is-scrolled         -> header condenses
 *   html.has-scrolled        -> back-to-top appears
 *   --scroll-progress (0..1) -> progress rail width
 */

import { useEffect } from "react";
import { parseTimeToMinutes } from "@/lib/salon-data";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function useMotionSystem() {
  useEffect(() => {
    const reduce = prefersReducedMotion();
    // Without IntersectionObserver there is nothing to reveal *on*, so every
    // element must be shown immediately rather than left at opacity 0.
    const canObserve = !reduce && "IntersectionObserver" in window;
    const seen = new WeakSet<Element>();
    let io: IntersectionObserver | null = null;

    if (canObserve) {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.setAttribute("data-revealed", "");
            io?.unobserve(entry.target);
          }
        },
        // Fire a touch before the element is fully in view so the settle
        // finishes as it arrives rather than starting once it is already read.
        { threshold: 0.08, rootMargin: "0px 0px -5% 0px" },
      );
    }

    function register(root: ParentNode) {
      if (!root.querySelectorAll) return;
      const all = Array.from(root.querySelectorAll("[data-reveal]"));
      if (!canObserve) {
        all.forEach((el) => el.setAttribute("data-revealed", ""));
        return;
      }
      all.forEach((el) => {
        if (seen.has(el) || el.hasAttribute("data-revealed")) return;
        seen.add(el);
        io?.observe(el);
      });
    }

    register(document);

    // Route changes and list re-renders swap DOM nodes in and out; re-scan.
    const mo = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of Array.from(record.addedNodes)) {
          if (node.nodeType !== 1) continue;
          const el = node as Element;
          if (el.matches?.("[data-reveal]") && !seen.has(el) && !el.hasAttribute("data-revealed")) {
            if (!canObserve) el.setAttribute("data-revealed", "");
            else {
              seen.add(el);
              io?.observe(el);
            }
          }
          register(el);
        }
      }
      parallaxDirty = true;
    });
    mo.observe(document.body, { childList: true, subtree: true });

    /* ---------------------------------------------------------------- *
     * Scroll-driven state
     * ---------------------------------------------------------------- */

    let parallaxEls: HTMLElement[] = [];
    let parallaxDirty = true;
    let frame = 0;

    function collectParallax() {
      parallaxEls = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
      parallaxDirty = false;
    }

    function applyParallax() {
      const vh = window.innerHeight;
      for (const el of parallaxEls) {
        const rect = el.getBoundingClientRect();
        // Skip anything comfortably off-screen — no point paying for it.
        if (rect.bottom < -vh || rect.top > vh * 2) continue;
        const speed = Number(el.dataset.parallax) || 0.1;
        const distanceFromCentre = rect.top + rect.height / 2 - vh / 2;
        const shift = Math.max(-90, Math.min(90, -distanceFromCentre * speed));
        el.style.setProperty("--py", `${shift.toFixed(2)}px`);
      }
    }

    function paint() {
      frame = 0;
      const y = window.scrollY;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;

      doc.style.setProperty("--scroll-progress", progress.toFixed(4));
      doc.classList.toggle("is-scrolled", y > 20);
      doc.classList.toggle("has-scrolled", y > 560);

      if (!reduce) {
        if (parallaxDirty) collectParallax();
        applyParallax();
      }
    }

    function onScroll() {
      if (frame) return;
      frame = window.requestAnimationFrame(paint);
    }

    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => {
      parallaxDirty = true;
      onScroll();
    });

    return () => {
      mo.disconnect();
      io?.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);
}

/**
 * Counts a number up once its element scrolls into view. Returns a ref to
 * attach; the element's text content is driven imperatively so we never
 * re-render the tree on every frame.
 */
export function useCountUp(target: number, options?: { duration?: number; suffix?: string }) {
  const { duration = 900, suffix = "" } = options ?? {};

  return (node: HTMLElement | null) => {
    if (!node) return;
    if (prefersReducedMotion()) {
      node.textContent = `${target}${suffix}`;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.disconnect();
          const start = performance.now();
          const step = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            // easeOutCubic — settles rather than stopping dead.
            const eased = 1 - Math.pow(1 - t, 3);
            node.textContent = `${Math.round(target * eased)}${suffix}`;
            if (t < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.6 },
    );
    observer.observe(node);
  };
}

/** Formats the studio's next open/close moment for the live status pill. */
export function getStudioStatus(
  now = new Date(),
  customHours?: { day: string; shortDay: string; open: string; close: string; closed: boolean }[],
  isOpenTodayOverride = true
) {
  if (!isOpenTodayOverride) {
    return { open: false, label: "Studio closed today", detail: "Appointments can still be booked online." };
  }

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const formatMinutes = (mins: number) => {
    const hour = Math.floor(mins / 60);
    const m = mins % 60;
    const suffix = hour >= 12 ? "PM" : "AM";
    const h = hour % 12 || 12;
    return m === 0 ? `${h}:00 ${suffix}` : `${h}:${String(m).padStart(2, "0")} ${suffix}`;
  };

  const day = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  if (customHours && customHours.length === 7) {
    const today = customHours[day];
    if (today && !today.closed) {
      const openMin = parseTimeToMinutes(today.open);
      const closeMin = parseTimeToMinutes(today.close);
      if (openMin > 0 && closeMin > openMin) {
        if (currentMinutes >= openMin && currentMinutes < closeMin) {
          return { open: true, label: `Open now · closes ${formatMinutes(closeMin)}`, detail: "Walk in for retail, book for the chair." };
        }
        if (currentMinutes < openMin) {
          return { open: false, label: `Closed · opens ${formatMinutes(openMin)} today`, detail: "Appointments can still be booked online." };
        }
      }
    }

    for (let step = 1; step <= 7; step++) {
      const nextDay = (day + step) % 7;
      const next = customHours[nextDay];
      if (next && !next.closed) {
        const nextOpen = parseTimeToMinutes(next.open);
        const when = step === 1 ? "tomorrow" : dayNames[nextDay];
        return { open: false, label: `Closed · opens ${when} ${formatMinutes(nextOpen)}`, detail: "Appointments can still be booked online." };
      }
    }

    return { open: false, label: "Closed", detail: "Appointments can still be booked online." };
  }

  // Fallback printed hours
  const hours: Record<number, [number, number] | null> = {
    0: [10, 17],
    1: null,
    2: [9, 18],
    3: [9, 18],
    4: [9, 18],
    5: [9, 18],
    6: [10, 17],
  };
  const label = (hour: number) => {
    const suffix = hour >= 12 ? "PM" : "AM";
    const h = hour % 12 || 12;
    return `${h}:00 ${suffix}`;
  };

  const today = hours[day];

  if (today) {
    const [open, close] = today;
    if (currentMinutes >= open * 60 && currentMinutes < close * 60) {
      return { open: true, label: `Open now · closes ${label(close)}`, detail: "Walk in for retail, book for the chair." };
    }
    if (currentMinutes < open * 60) {
      return { open: false, label: `Closed · opens ${label(open)} today`, detail: "Appointments can still be booked online." };
    }
  }

  for (let step = 1; step <= 7; step++) {
    const nextDay = (day + step) % 7;
    const next = hours[nextDay];
    if (next) {
      const when = step === 1 ? "tomorrow" : dayNames[nextDay];
      return { open: false, label: `Closed · opens ${when} ${label(next[0])}`, detail: "Appointments can still be booked online." };
    }
  }

  return { open: false, label: "Closed", detail: "Appointments can still be booked online." };
}
