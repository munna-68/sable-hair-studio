/** Chromatic Cut page: recurring care as an active schedule, not an abstract pricing table. */
import { ArrowUpRight, CalendarCheck2, Check, PauseCircle, Share2, ShoppingBag, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { PageEyebrow, SiteShell } from "@/components/SiteShell";
import { getNextMembershipDate, memberships } from "@/lib/salon-data";
import { shareLink, useStudio } from "@/contexts/StudioStore";

export default function Memberships() {
  const { activePlan, setActivePlan, addToBag } = useStudio();
  const selectedPlan = memberships.find((plan) => plan.id === activePlan);

  function choose(planId: string, planName: string) {
    if (activePlan === planId) {
      toast.info("That rhythm is already active.", { description: "Pause it to try a different cadence." });
      return;
    }
    setActivePlan(planId);
  }

  return (
    <SiteShell>
      <section className="page-hero membership-hero"><div data-reveal="left"><PageEyebrow>Care, already accounted for</PageEyebrow><h1>Good hair is less a <em>moment</em><br />than a rhythm.</h1></div><p data-reveal="right" style={{ "--rd": "90ms" } as React.CSSProperties}>Choose a plan that matches how you maintain your cut, color, or finish. Your next visit is generated the moment you join.</p></section>
      {selectedPlan && <section className="active-plan-banner" data-reveal="scale"><div className="active-plan-icon"><CalendarCheck2 size={22} /></div><div><p className="service-category">Your membership is active</p><h2>{selectedPlan.name}</h2><p>Your next auto-scheduled visit: <b>{getNextMembershipDate(selectedPlan.intervalDays)}</b></p></div><button className="pause-button" onClick={() => setActivePlan(null)}><PauseCircle size={16} /> Pause plan</button></section>}
      <section className="membership-grid">
        {memberships.map((plan, index) => (
          <article
            className={activePlan === plan.id ? "plan-card active" : "plan-card"}
            key={plan.id}
            data-reveal="up"
            style={{ "--rd": `${index * 100}ms` } as React.CSSProperties}
          >
            <div className="plan-card-top"><span>0{index + 1}</span><Sparkles size={18} /></div>
            <p className="service-category">{plan.cadence}</p>
            <h2>{plan.name}</h2>
            <p className="plan-detail">{plan.detail}</p>
            <div className="plan-price"><b>${plan.price}</b><span>per {plan.cadence === "Monthly" ? "month" : "visit"}</span></div>
            <p className="plan-save">${plan.oneTimeValue} one-time value</p>
            <div className="plan-visit"><CalendarCheck2 size={17} /><span><b>{plan.visit}</b><small>Next visit generated in {plan.intervalDays} days</small></span></div>
            <ul>{plan.perks.map((perk) => <li key={perk}><Check size={15} /> {perk}</li>)}</ul>
            <div className="plan-actions">
              <button className={activePlan === plan.id ? "plan-button active" : "plan-button"} onClick={() => choose(plan.id, plan.name)}>{activePlan === plan.id ? "Membership active" : "Choose this rhythm"}<ArrowUpRight size={16} /></button>
              <div className="plan-secondary">
                <button className="mini-ghost" onClick={() => addToBag("membership", plan.id, plan.name)}>
                  <ShoppingBag size={13} /> Bag
                </button>
                <button className="mini-ghost" aria-label={`Share ${plan.name}`} onClick={() => shareLink(plan.name, plan.detail)}>
                  <Share2 size={13} /> Share
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
      <section className="membership-faq"><div data-reveal="left"><PageEyebrow>Good to know</PageEyebrow><h2>Flexible by design. <em>Specific</em> when it counts.</h2></div><div className="faq-list"><div data-reveal="up" style={{ "--rd": "0ms" } as React.CSSProperties}><h3>Can I change my visit time?</h3><p>Yes. Your membership creates a preferred booking hold, then you can choose another compatible opening if your week changes.</p></div><div data-reveal="up" style={{ "--rd": "90ms" } as React.CSSProperties}><h3>What if I need a bigger appointment?</h3><p>Your recurring visit becomes the foundation. Add-ons and larger color work are always priced and timed separately before you confirm.</p></div><div data-reveal="up" style={{ "--rd": "180ms" } as React.CSSProperties}><h3>Can I pause?</h3><p>Absolutely. Plans are intended to support your routine, not lock you into a schedule that no longer fits it.</p></div></div></section>
      <section className="mini-cta" data-reveal="fade"><p>Not ready for a rhythm yet?</p><Link href="/book" className="text-cta">Book one considered visit <ArrowUpRight size={16} /></Link></section>
    </SiteShell>
  );
}
