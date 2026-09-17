import { Link } from "wouter";
import { ArrowUpRight, Heart } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { getService, stylists } from "@/lib/salon-data";
import { getRetailProduct } from "@/lib/shop-data";
import { useStudio } from "@/contexts/StudioStore";

export function SavedDrawer() {
  const { savedOpen, setSavedOpen, savedServices, savedStylists, savedProducts, toggleSavedService, toggleSavedStylist, toggleSavedProduct } = useStudio();
  const empty = savedServices.length + savedStylists.length + savedProducts.length === 0;

  return (
    <Sheet open={savedOpen} onOpenChange={setSavedOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md gap-0 p-0 overflow-hidden flex flex-col">
        <SheetHeader className="p-5 pb-4 border-b text-left">
          <SheetTitle className="font-display flex items-center gap-2 text-lg tracking-tight">
            <Heart size={19} className="text-[#147A45]" /> Saved
          </SheetTitle>
          <SheetDescription>Services, chairs, and shelf picks you hearted — kept on this device.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-5 grid gap-5 content-start">
          {empty && (
            <div className="bag-empty">
              <Heart size={30} className="text-[#66756A]" />
              <b>Nothing saved yet.</b>
              <p>Tap the heart on any service, stylist, or take-home product and it will wait for you here.</p>
              <Link href="/services" className="primary-cta !py-2.5" onClick={() => setSavedOpen(false)}>
                Find something to save <ArrowUpRight size={15} />
              </Link>
            </div>
          )}
          {savedServices.length > 0 && (
            <section>
              <p className="service-category mb-2">Services · {savedServices.length}</p>
              <div className="grid gap-2">
                {savedServices.map((id) => {
                  const s = getService(id);
                  if (!s) return null;
                  return (
                    <div key={id} className="saved-line">
                      <div><b>{s.name}</b><small>{s.duration} min · from ${s.price}</small></div>
                      <div className="flex gap-1.5">
                        <Link href={`/book?service=${s.id}`} className="mini-book" onClick={() => setSavedOpen(false)}>Book</Link>
                        <button className="mini-ghost" onClick={() => toggleSavedService(id, s.name)}>Remove</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
          {savedStylists.length > 0 && (
            <section>
              <p className="service-category mb-2">Chairs · {savedStylists.length}</p>
              <div className="grid gap-2">
                {savedStylists.map((id) => {
                  const st = stylists.find((s) => s.id === id);
                  if (!st) return null;
                  return (
                    <div key={id} className="saved-line">
                      <div><b>{st.name}</b><small>{st.role}</small></div>
                      <div className="flex gap-1.5">
                        <Link href="/book" className="mini-book" onClick={() => setSavedOpen(false)}>Book</Link>
                        <button className="mini-ghost" onClick={() => toggleSavedStylist(id, st.name)}>Remove</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
          {savedProducts.length > 0 && (
            <section>
              <p className="service-category mb-2">Shelf · {savedProducts.length}</p>
              <div className="grid gap-2">
                {savedProducts.map((id) => {
                  const p = getRetailProduct(id);
                  if (!p) return null;
                  return (
                    <div key={id} className="saved-line">
                      <div><b>{p.name}</b><small>{p.size} · ${p.price}</small></div>
                      <button className="mini-ghost" onClick={() => toggleSavedProduct(id, p.name)}>Remove</button>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
