/**
 * Scroll chrome and motion primitives for the Chromatic Cut shell.
 *
 * The heavy lifting lives in useScrollMotion; these are the thin pieces that
 * get placed in the tree.
 */

import { ArrowUp } from "lucide-react";
import { useCountUp } from "@/hooks/useScrollMotion";

/** Cobalt rail pinned to the top of the viewport, driven by --scroll-progress. */
export function ScrollProgress() {
  return (
    <div className="scroll-progress" role="presentation" aria-hidden="true">
      <span className="scroll-progress-bar" />
    </div>
  );
}

/** Appears once the reader is a screen or so down the page. */
export function BackToTop() {
  return (
    <button
      type="button"
      className="back-to-top"
      aria-label="Back to top"
      onClick={() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }}
    >
      <ArrowUp size={17} />
      <span>Top</span>
    </button>
  );
}

type RevealProps = {
  children: React.ReactNode;
  /** Direction the element settles in from. */
  from?: "up" | "down" | "left" | "right" | "fade" | "scale";
  /** Stagger offset in ms. */
  delay?: number;
  as?: "div" | "section" | "article" | "li" | "span" | "p" | "header" | "aside";
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Declarative wrapper for the reveal system. Most of the site uses the bare
 * `data-reveal` attribute instead — this is for places where the element also
 * needs a stagger delay that depends on render-time data.
 */
export function Reveal({ children, from = "up", delay = 0, as: Tag = "div", className, style }: RevealProps) {
  return (
    <Tag
      data-reveal={from}
      className={className}
      style={delay ? ({ ...style, "--rd": `${delay}ms` } as React.CSSProperties) : style}
    >
      {children}
    </Tag>
  );
}

/**
 * Number that counts up when scrolled into view. Falls back to the final value
 * immediately when the reader prefers reduced motion.
 */
export function CountUp({ to, suffix = "", className }: { to: number; suffix?: string; className?: string }) {
  const ref = useCountUp(to, { suffix });
  return (
    <span ref={ref} className={className}>
      {to}
      {suffix}
    </span>
  );
}
