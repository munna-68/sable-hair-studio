/** Chromatic Cut page: recurring care as an active schedule, not an abstract pricing table. */
import { useState } from "react";
import { ArrowUpRight, CalendarCheck2, Check, PauseCircle, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { PageEyebrow, SiteShell } from "@/components/SiteShell";
import { getNextMembershipDate, memberships } from "@/lib/salon-data";

export default function Memberships() {
  const [activePlan, setActivePlan] = useState<string | null>(null);
  const selectedPlan = memberships.find((plan) => plan.id === activePlan);
  return (
    <SiteShell>
      <section className="page-hero membership-hero"><div className="page-rail" aria-hidden="true"><span>05 / MEMBERS</span></div><div><PageEyebrow>Care, already accounted for</PageEyebrow><h1>Good hair is less a <em>moment</em><br />than a rhythm.</h1></div><p>Choose a plan that matches how you maintain your cut, color, or finish. Your next visit is generated the moment you join.</p></section>
      {selectedPlan && <section className="active-plan-banner"><div className="active-plan-icon"><CalendarCheck2 size={22} /></div><div><p className="service-category">Your membership is active</p><h2>{selectedPlan.name}</h2><p>Your next auto-scheduled visit: <b>{getNextMembershipDate(selectedPlan.intervalDays)}</b></p></div><button className="pause-button" onClick={() => setActivePlan(null)}><PauseCircle size={16} /> Pause plan</button></section>}
      <section className="membership-grid">{memberships.map((plan, index) => <article className={activePlan === plan.id ? "plan-card active" : "plan-card"} key={plan.id}><div className="plan-card-top"><span>0{index + 1}</span><Sparkles size={18} /></div><p className="service-category">{plan.cadence}</p><h2>{plan.name}</h2><p className="plan-detail">{plan.detail}</p><div className="plan-price"><b>${plan.price}</b><span>per {plan.cadence === "Monthly" ? "month" : "visit"}</span></div><p className="plan-save">${plan.oneTimeValue} one-time value</p><div className="plan-visit"><CalendarCheck2 size={17} /><span><b>{plan.visit}</b><small>Next visit generated in {plan.intervalDays} days</small></span></div><ul>{plan.perks.map((perk) => <li key={perk}><Check size={15} /> {perk}</li>)}</ul><button className={activePlan === plan.id ? "plan-button active" : "plan-button"} onClick={() => setActivePlan(plan.id)}>{activePlan === plan.id ? "Membership active" : "Choose this rhythm"}<ArrowUpRight size={16} /></button></article>)}</section>
      <section className="membership-faq"><div><PageEyebrow>Good to know</PageEyebrow><h2>Flexible by design. <em>Specific</em> when it counts.</h2></div><div className="faq-list"><div><h3>Can I change my visit time?</h3><p>Yes. Your membership creates a preferred booking hold, then you can choose another compatible opening if your week changes.</p></div><div><h3>What if I need a bigger appointment?</h3><p>Your recurring visit becomes the foundation. Add-ons and larger color work are always priced and timed separately before you confirm.</p></div><div><h3>Can I pause?</h3><p>Absolutely. Plans are intended to support your routine, not lock you into a schedule that no longer fits it.</p></div></div></section>
      <section className="mini-cta"><p>Not ready for a rhythm yet?</p><Link href="/book" className="text-cta">Book one considered visit <ArrowUpRight size={16} /></Link></section>
    </SiteShell>
  );
}
