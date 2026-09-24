import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Heart, MoveHorizontal, Quote, ShoppingBag, Star } from "lucide-react";
import { withBase } from "@/lib/withBase";
import { retailProducts } from "@/lib/shop-data";
import { useStudio } from "@/contexts/StudioStore";

const PRESS = ["SEATTLE MET", "BEHIND THE CHAIR", "MODERN SALON", "THE STRANGER", "PUGET SOUND WEEKLY", "CAPITOL HILL TIMES"];

/**
 * Editorial mentions as a continuous marquee. The list is rendered twice so the
 * -50% translate loops seamlessly; the duplicate is hidden from assistive tech.
 */
export function PressStrip() {
  return (
    <section className="press-strip" aria-label="Editorial mentions">
      <span className="press-label">Noted by editors</span>
      <div className="press-marquee">
        <div className="press-track">
          {PRESS.map((name) => (
            <span key={name}>{name}</span>
          ))}
          {PRESS.map((name) => (
            <span key={`dup-${name}`} aria-hidden="true">
              {name}
            </span>
          ))}
        </div>
      </div>
      <small>“Best color” roundups · 2024–2026</small>
    </section>
  );
}

export function RetailGrid({ compact = false }: { compact?: boolean }) {
  const { retailProducts, addToBag, toggleSavedProduct, isSavedProduct } = useStudio();
  const list = compact ? retailProducts.slice(0, 3) : retailProducts;
  return (
    <div className="retail-grid">
      {list.map((p, i) => {
        const saved = isSavedProduct(p.id);
        return (
          <article
            key={p.id}
            className="retail-card"
            id={`shelf-${p.id}`}
            data-reveal="up"
            style={{ "--rd": `${i * 70}ms` } as React.CSSProperties}
          >
            <div className="retail-top">
              <span className="service-category">{p.tag}</span>
              <span className="retail-index">0{i + 1}</span>
            </div>
            <h3>{p.name}</h3>
            <p>{p.detail}</p>
            <small>{p.size} · {p.ritual}</small>
            <div className="retail-foot">
              <b>${p.price}</b>
              <div className="flex gap-1.5">
                <button
                  className={saved ? "icon-btn saved" : "icon-btn"}
                  aria-label={saved ? `Unsave ${p.name}` : `Save ${p.name}`}
                  aria-pressed={saved}
                  onClick={() => toggleSavedProduct(p.id, p.name)}
                >
                  <Heart size={16} fill={saved ? "currentColor" : "none"} />
                </button>
                <button className="mini-book" onClick={() => addToBag("product", p.id, p.name)}>
                  <ShoppingBag size={14} /> Add
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

/**
 * Drag-to-compare colour plate. The right side is the finished, glossed result;
 * the left is the same frame as grown-out colour. Driven by a real range input
 * so it works by drag, click and keyboard.
 *
 * Both sides are real photography shot from the same locked-off setup, so the
 * seam lines up exactly: `before.png` / `after.png` in `client/public/images/`
 * are both 1536×1024, which means `object-fit: cover` crops them identically at
 * every viewport. Keep any replacement pair at a matching aspect ratio and
 * framing or the divider will jump as it crosses the join.
 */
export function ColorCompare() {
  const [pos, setPos] = useState(52);
  const [touched, setTouched] = useState(false);
  const frame = useRef<number>(0);

  return (
    <div className="compare" data-reveal="scale">
      <div className="compare-stage" style={{ "--pos": `${pos}%` } as React.CSSProperties}>
        <img
          className="compare-after"
          src={withBase("/images/after.png")}
          alt="The same hair after a gloss — deep, reflective brown with a light-catching finish"
          loading="lazy"
          decoding="async"
        />
        <div className="compare-before" aria-hidden="true">
          <img src={withBase("/images/before.png")} alt="" loading="lazy" decoding="async" />
        </div>

        <div className="compare-handle" aria-hidden="true">
          <span className="compare-line" />
          <span className="compare-knob">
            <MoveHorizontal size={16} />
          </span>
        </div>

        <span className="compare-tag compare-tag-left" aria-hidden="true">Grown out</span>
        <span className="compare-tag compare-tag-right" aria-hidden="true">Re-glossed</span>

        {!touched && <span className="compare-hint">Drag to compare</span>}

        <input
          className="compare-range"
          type="range"
          min={4}
          max={96}
          value={pos}
          aria-label="Compare grown-out colour with the finished gloss"
          onChange={(e) => {
            const next = Number(e.target.value);
            setTouched(true);
            cancelAnimationFrame(frame.current);
            frame.current = requestAnimationFrame(() => setPos(next));
          }}
        />
      </div>
      <div className="compare-foot">
        <p>
          <b>What a gloss actually changes.</b> Placement and depth do the heavy lifting — the
          finishing gloss is what makes light catch the surface.
        </p>
        <small>Grown-out versus re-glossed, shot from the same setup. Ask for a strand test in the chair.</small>
      </div>
    </div>
  );
}

const REVIEWS = [
  {
    quote:
      "The consultation alone was worth the visit. She explained exactly how my grow-out would look at week eight, then cut for that.",
    name: "Priya N.",
    detail: "Lived-In Color · Signature Cut",
  },
  {
    quote:
      "First salon that told me what my hair couldn't take instead of selling me the biggest ticket. Came out better for it.",
    name: "Devon A.",
    detail: "Keratin Smoothing",
  },
  {
    quote:
      "I book the same 90 minutes every ten weeks and never think about it again. That is the whole review.",
    name: "Marta L.",
    detail: "Color Rhythm member",
  },
  {
    quote:
      "Walked in for a neckline cleanup, left with an actual plan for the next six months. Genuinely good at listening.",
    name: "Sam O.",
    detail: "Grooming Detail",
  },
];

export function ReviewCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = REVIEWS.length;

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % total), 6500);
    return () => window.clearInterval(id);
  }, [paused, total]);

  const review = REVIEWS[index];

  return (
    <section
      className="reviews"
      aria-roledescription="carousel"
      aria-label="What clients say"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="reviews-inner">
        <div className="reviews-head" data-reveal="left">
          <span className="reviews-stars" aria-hidden="true">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} size={14} fill="currentColor" />
            ))}
          </span>
          <p className="service-category">4.9 average · 312 visits this year</p>
        </div>

        <figure className="reviews-quote" data-reveal="up">
          <Quote size={26} className="reviews-mark" aria-hidden="true" />
          <blockquote key={index} className="reviews-text">
            {review.quote}
          </blockquote>
          <figcaption>
            <b>{review.name}</b>
            <small>{review.detail}</small>
          </figcaption>
        </figure>

        <div className="reviews-controls">
          <button
            className="reviews-arrow"
            aria-label="Previous review"
            onClick={() => setIndex((i) => (i - 1 + total) % total)}
          >
            <ArrowLeft size={16} />
          </button>
          <div className="reviews-dots">
            {REVIEWS.map((r, i) => (
              <button
                key={r.name}
                className={i === index ? "reviews-dot active" : "reviews-dot"}
                aria-label={`Review ${i + 1} of ${total}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
          <button
            className="reviews-arrow"
            aria-label="Next review"
            onClick={() => setIndex((i) => (i + 1) % total)}
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
