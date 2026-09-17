import { useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight, Lock, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useStudio } from "@/contexts/StudioStore";

export function CartDrawer() {
  const { cartOpen, setCartOpen, resolvedCart, subtotal, setQty, removeFromBag, clearBag, cartCount } = useStudio();
  const [checkingOut, setCheckingOut] = useState(false);
  const [orderDone, setOrderDone] = useState<string | null>(null);

  function checkout() {
    if (!resolvedCart.length) return;
    setCheckingOut(true);
    window.setTimeout(() => {
      const orderNo = `SB-${Math.floor(1000 + Math.random() * 9000)}`;
      setOrderDone(orderNo);
      clearBag();
      setCheckingOut(false);
      toast.success(`Demo order ${orderNo} placed.`, {
        description: "No payment processed — this showcase uses local state only.",
      });
    }, 900);
  }

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md gap-0 p-0 overflow-hidden flex flex-col">
        <SheetHeader className="p-5 pb-4 border-b text-left">
          <SheetTitle className="font-display flex items-center gap-2 text-lg tracking-tight">
            <ShoppingBag size={19} className="text-[#147A45]" /> Your bag
            {cartCount > 0 && <span className="bag-count">{cartCount}</span>}
          </SheetTitle>
          <SheetDescription>Services, plans, and take-home care — held locally for this demo.</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-5 grid gap-3 content-start">
          {orderDone && (
            <div className="bag-confirm">
              <p className="service-category">Order confirmed</p>
              <b>{orderDone} — we’ll have it ready at pickup.</b>
              <span>Show this number at 118 Pine St, or mention it when you book. No charge in this demo.</span>
              <button className="text-cta" onClick={() => setOrderDone(null)}>Start a new bag</button>
            </div>
          )}
          {!resolvedCart.length && !orderDone && (
            <div className="bag-empty">
              <ShoppingBag size={30} className="text-[#66756A]" />
              <b>Your bag is empty.</b>
              <p>Add a service to hold pricing, a membership to start a rhythm, or take-home care to extend the result.</p>
              <div className="flex gap-2 flex-wrap">
                <Link href="/services" className="primary-cta !py-2.5" onClick={() => setCartOpen(false)}>
                  Browse services <ArrowUpRight size={15} />
                </Link>
                <button className="ghost-cta" onClick={() => { setCartOpen(false); }}>Keep looking</button>
              </div>
            </div>
          )}
          {resolvedCart.map((item) => (
            <article key={`${item.kind}-${item.id}`} className="bag-line">
              <div className="bag-line-main">
                <p className="service-category">{item.kind}</p>
                <b>{item.name}</b>
                <small>{item.detail}</small>
                <div className="qty-row">
                  <button aria-label="Decrease quantity" onClick={() => setQty(item.kind, item.id, item.qty - 1)}><Minus size={14} /></button>
                  <span aria-live="polite">{item.qty}</span>
                  <button aria-label="Increase quantity" onClick={() => setQty(item.kind, item.id, item.qty + 1)}><Plus size={14} /></button>
                </div>
              </div>
              <div className="bag-line-side">
                <b>${item.price * item.qty}</b>
                <button className="bag-remove" aria-label={`Remove ${item.name}`} onClick={() => removeFromBag(item.kind, item.id)}>
                  <Trash2 size={15} />
                </button>
              </div>
            </article>
          ))}
        </div>

        {resolvedCart.length > 0 && (
          <SheetFooter className="p-5 pt-4 border-t gap-3">
            <div className="bag-totals">
              <div><span>Subtotal</span><b>${subtotal}</b></div>
              <div><span>Studio pickup</span><b>Free</b></div>
              <small><Lock size={12} /> Demo checkout — no card, no backend. State persists in localStorage.</small>
            </div>
            <button className="primary-cta w-full !py-3.5" disabled={checkingOut} onClick={checkout}>
              {checkingOut ? "Placing demo order…" : `Checkout · $${subtotal}`} <ArrowUpRight size={16} />
            </button>
            <button className="ghost-cta w-full" onClick={() => { clearBag(); toast.info("Bag cleared."); }}>Clear bag</button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
