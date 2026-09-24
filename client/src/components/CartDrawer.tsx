import { useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight, Lock, Minus, Plus, ShoppingBag, Trash2, CheckCircle2, User, Mail, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useStudio } from "@/contexts/StudioStore";
import { SalonOrder } from "@/lib/defaultStudioData";

export function CartDrawer() {
  const { cartOpen, setCartOpen, resolvedCart, subtotal, setQty, removeFromBag, clearBag, cartCount, addOrder } = useStudio();
  const [checkingOut, setCheckingOut] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [clientName, setClientName] = useState("Elena Vance");
  const [clientEmail, setClientEmail] = useState("elena.vance@example.com");
  const [clientPhone, setClientPhone] = useState("(206) 555-0142");
  const [orderDone, setOrderDone] = useState<SalonOrder | null>(null);

  function startCheckout() {
    if (!resolvedCart.length) return;
    setShowCheckoutForm(true);
  }

  function handleFinalizeCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim()) {
      toast.error("Please provide your name and email.");
      return;
    }

    setCheckingOut(true);
    window.setTimeout(() => {
      const tax = Number((subtotal * 0.1025).toFixed(2));
      const total = Number((subtotal + tax).toFixed(2));

      const newOrder = addOrder({
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim(),
        clientPhone: clientPhone.trim() || "(206) 555-0100",
        items: resolvedCart.map((i) => ({
          kind: i.kind,
          id: i.id,
          name: i.name,
          detail: i.detail,
          price: i.price,
          qty: i.qty,
        })),
        subtotal,
        tax,
        total,
        status: "ready-for-pickup",
        paymentStatus: "paid",
        paymentMethod: "Apple Pay (Demo)",
        pickupNotes: "118 Pine St retail desk hold",
      });

      setOrderDone(newOrder);
      clearBag();
      setShowCheckoutForm(false);
      setCheckingOut(false);

      toast.success(`Demo order ${newOrder.id} confirmed!`, {
        description: "Synced to the Owner Dashboard Orders tab.",
      });
    }, 700);
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
            <div className="bag-confirm border border-[#147A45]/30 bg-[#E6EFE9] p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#147A45] text-white text-[11px] font-semibold">
                  <CheckCircle2 size={12} /> {orderDone.id}
                </span>
                <span className="text-xs font-mono font-medium text-[#147A45]">Ready for Pickup</span>
              </div>
              <b className="text-base text-[#0A1F14] block leading-snug">
                Thank you, {orderDone.clientName}! Your order is held at the desk.
              </b>
              <p className="text-xs text-[#4E5B51] leading-relaxed">
                Show this number at 118 Pine St, or mention it when you check in. No card charged in this demo.
              </p>

              <div className="p-3 rounded-xl bg-white border border-[#C5D9CB] text-xs space-y-1.5">
                <div className="flex justify-between text-[#4E5B51]">
                  <span>Items</span>
                  <span>{orderDone.items.length} item(s)</span>
                </div>
                <div className="flex justify-between font-bold text-[#0A1F14]">
                  <span>Total</span>
                  <span>${orderDone.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href="/dashboard/appointments"
                  onClick={() => setCartOpen(false)}
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-full bg-[#147A45] text-white text-xs font-medium hover:bg-[#0D5932] transition-colors"
                >
                  <Sparkles size={13} /> View in Owner Dashboard <ArrowUpRight size={13} />
                </Link>
                <button
                  className="text-xs text-[#4E5B51] underline text-center py-1"
                  onClick={() => setOrderDone(null)}
                >
                  Start a new bag
                </button>
              </div>
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
                <button className="ghost-cta" onClick={() => setCartOpen(false)}>Keep looking</button>
              </div>
            </div>
          )}

          {showCheckoutForm && !orderDone && (
            <form onSubmit={handleFinalizeCheckout} className="p-4 rounded-2xl bg-[#F5F8F4] border border-[#DDE7DF] space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm text-[#0A1F14]">Pickup Contact</h4>
                <button
                  type="button"
                  onClick={() => setShowCheckoutForm(false)}
                  className="text-xs text-[#4E5B51] hover:underline"
                >
                  Back to bag
                </button>
              </div>
              <div className="space-y-2">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[#4E5B51]">Name</label>
                  <div className="relative mt-1">
                    <User size={14} className="absolute left-3 top-3 text-[#66756A]" />
                    <input
                      required
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#DDE7DF] bg-white text-xs text-[#0A1F14]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[#4E5B51]">Email</label>
                  <div className="relative mt-1">
                    <Mail size={14} className="absolute left-3 top-3 text-[#66756A]" />
                    <input
                      required
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#DDE7DF] bg-white text-xs text-[#0A1F14]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[#4E5B51]">Phone</label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#DDE7DF] bg-white text-xs text-[#0A1F14] mt-1"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={checkingOut}
                className="primary-cta w-full !py-2.5 text-xs justify-center"
              >
                {checkingOut ? "Placing order..." : `Confirm Demo Order · $${(subtotal * 1.1025).toFixed(2)}`}
              </button>
            </form>
          )}

          {!showCheckoutForm &&
            resolvedCart.map((item) => (
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

        {resolvedCart.length > 0 && !showCheckoutForm && (
          <SheetFooter className="p-5 pt-4 border-t gap-3">
            <div className="bag-totals">
              <div><span>Subtotal</span><b>${subtotal}</b></div>
              <div><span>Estimated WA Tax</span><b>${(subtotal * 0.1025).toFixed(2)}</b></div>
              <div><span>Studio pickup</span><b>Free</b></div>
              <small><Lock size={12} /> Demo checkout — syncs to Owner Dashboard Orders queue.</small>
            </div>
            <button className="primary-cta w-full !py-3.5" onClick={startCheckout}>
              Checkout · ${(subtotal * 1.1025).toFixed(2)} <ArrowUpRight size={16} />
            </button>
            <button className="ghost-cta w-full" onClick={() => { clearBag(); toast.info("Bag cleared."); }}>Clear bag</button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
