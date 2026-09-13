/** Take-home retail shelf: mock commerce for the portfolio showcase. No backend — cart persists to localStorage. */

export type RetailProduct = {
  id: string;
  name: string;
  detail: string;
  price: number;
  size: string;
  tag: string;
  ritual: string;
};

export const retailProducts: RetailProduct[] = [
  {
    id: "mineral-shampoo",
    name: "Mineral Cleanse Shampoo",
    detail: "A gentle sulfate-free cleanse that keeps lived-in color luminous between visits.",
    price: 34,
    size: "240 ml",
    tag: "Color care",
    ritual: "Pair with Root + Gloss Refresh",
  },
  {
    id: "gloss-conditioner",
    name: "Gloss-Lock Conditioner",
    detail: "Weightless moisture with a soft reflective finish — no flattened roots.",
    price: 36,
    size: "240 ml",
    tag: "Color care",
    ritual: "Pair with Lived-In Color",
  },
  {
    id: "repair-mask",
    name: "Repair Ritual Mask",
    detail: "The in-chair treatment, bottled. Weekly restoration for lightened or smoothed hair.",
    price: 48,
    size: "180 ml",
    tag: "Treatment",
    ritual: "Extends Repair Ritual results",
  },
  {
    id: "smoothing-oil",
    name: "Smoothing Veil Oil",
    detail: "A single drop tames frizz and shortens dry time without residue.",
    price: 42,
    size: "50 ml",
    tag: "Finishing",
    ritual: "Pair with Keratin Smoothing",
  },
  {
    id: "texture-cream",
    name: "Shape Memory Cream",
    detail: "Soft definition for bobs, shags, and short shapes that need to hold their line.",
    price: 28,
    size: "100 ml",
    tag: "Styling",
    ritual: "Pair with Signature Cut",
  },
  {
    id: "scalp-tonic",
    name: "Scalp Reset Tonic",
    detail: "A cooling pre-wash tonic for balanced roots and longer time between cleanses.",
    price: 32,
    size: "120 ml",
    tag: "Scalp",
    ritual: "Pair with any cut service",
  },
];

export function getRetailProduct(id: string) {
  return retailProducts.find((p) => p.id === id);
}
