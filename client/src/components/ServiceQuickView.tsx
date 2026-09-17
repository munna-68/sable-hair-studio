import { Link } from "wouter";
import { ArrowLeft, ArrowRight, ArrowUpRight, Clock3, Heart, Share2, ShieldCheck, ShoppingBag } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getCancellationWindow, getCompatibleStylists, getDepositAmount, services, type Service } from "@/lib/salon-data";
import { shareLink, useStudio } from "@/contexts/StudioStore";

const stories: Record<string, string> = {
  "signature-cut": "Mara maps the shape dry first, then cuts to how your hair actually falls by week three — not just day one.",
  "precision-short": "Noa works in small sections with the neckline cleaned twice, so short shapes keep their edge longer.",
  "lived-in-color": "Our most-requested grow-out. Hand-placed dimension with a gloss that softens the line for months.",
  "full-balayage": "A full transformation session: custom lightener placement, bond care, gloss, and a photographed finish check.",
  "color-refresh": "The maintenance appointment that keeps color intentional — roots blended, tone corrected, gloss sealed.",
  "keratin-smoothing": "Sofia starts every smoothing visit with a health check and a frank dry-time conversation.",
  "repair-ritual": "Scalp massage, steam, and a customized mask — plus honest home-care notes, not a product push.",
  "grooming-detail": "Eli's disciplined 30 minutes: cut, beard line, neckline, and a finish that reads polished, not fussy.",
};

export function ServiceQuickView({ service, onClose, onPrev, onNext }: {
  service: Service | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const { addToBag, toggleSavedService, isSavedService } = useStudio();
  const open = service !== null;
  const specialists = service ? getCompatibleStylists(service.id) : [];
  const deposit = getDepositAmount(service ?? undefined);
  const saved = service ? isSavedService(service.id) : false;
  const index = service ? services.findIndex((s) => s.id === service.id) : -1;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden gap-0 border-[#DCE3D6]">
        {service && (
          <div className="quickview">
            <div className="quickview-top">
              <p className="service-category">{service.category} · {String(index + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}</p>
              <div className="flex gap-1.5">
                <button className={saved ? "icon-btn saved" : "icon-btn"} aria-label={saved ? `Unsave ${service.name}` : `Save ${service.name}`} onClick={() => toggleSavedService(service.id, service.name)}>
                  <Heart size={17} fill={saved ? "currentColor" : "none"} />
                </button>
                <button className="icon-btn" aria-label={`Share ${service.name}`} onClick={() => shareLink(service.name, service.description)}>
                  <Share2 size={17} />
                </button>
              </div>
            </div>
            <DialogHeader className="text-left px-6 pt-1">
              <DialogTitle className="font-display text-3xl tracking-tight">{service.name}</DialogTitle>
              <DialogDescription className="text-[14px] leading-relaxed text-[#38443B]">{service.description}</DialogDescription>
            </DialogHeader>
            <p className="quickview-story">{stories[service.id] ?? service.description}</p>
            <div className="quickview-meta">
              <div><Clock3 size={15} /><span><b>{service.duration} min</b><small>in chair</small></span></div>
              <div><span className="qv-price">${service.price}</span><span><b>from ${service.price}</b><small>{deposit ? `$${deposit} deposit` : "no deposit"}</small></span></div>
              <div><ShieldCheck size={15} /><span><b>{getCancellationWindow(service)}h window</b><small>to change</small></span></div>
            </div>
            <div className="quickview-chairs">
              <span>Available with</span>
              {specialists.map((st) => <em key={st.id}>{st.initials} {st.name.split(" ")[0]}</em>)}
              {service.chemical && <em className="chem">First visit? Consult first</em>}
            </div>
            <div className="quickview-actions">
              <Link href={`/book?service=${service.id}`} className="primary-cta" onClick={onClose}>
                Book this service <ArrowUpRight size={16} />
              </Link>
              <button className="ghost-cta" onClick={() => addToBag("service", service.id, service.name)}>
                <ShoppingBag size={15} /> Add to bag
              </button>
            </div>
            <div className="quickview-nav">
              <button onClick={onPrev} aria-label="Previous service"><ArrowLeft size={16} /> Prev</button>
              <span>{index + 1} / {services.length}</span>
              <button onClick={onNext} aria-label="Next service">Next <ArrowRight size={16} /></button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
