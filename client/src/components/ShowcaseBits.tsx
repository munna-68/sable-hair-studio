import { Heart, ShoppingBag } from "lucide-react";
import { retailProducts } from "@/lib/shop-data";
import { useStudio } from "@/contexts/StudioStore";

export function PressStrip() {
  return (
    <section className="press-strip" aria-label="Editorial mentions">
      <span className="press-label">Noted by editors</span>
      <div className="press-names">
        <span>SEATTLE MET</span>
        <span>BEHIND THE CHAIR</span>
        <span>MODERN SALON</span>
        <span>THE STRANGER</span>
      </div>
      <small>Neighborhood “best color” roundups · 2024–2026</small>
    </section>
  );
}

export function RetailGrid({ compact = false }: { compact?: boolean }) {
  const { addToBag, toggleSavedProduct, isSavedProduct } = useStudio();
  const list = compact ? retailProducts.slice(0, 3) : retailProducts;
  return (
    <div className="retail-grid">
      {list.map((p, i) => {
        const saved = isSavedProduct(p.id);
        return (
          <article key={p.id} className="retail-card" id={`shelf-${p.id}`}>
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
