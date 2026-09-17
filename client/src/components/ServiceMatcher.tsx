/**
 * ServiceMatcher — a working three-question consultation that recommends a
 * service (and the chair to sit in for it).
 *
 * This is the "meet the right chair for it" promise from the brand brief turned
 * into something you can actually operate. Scoring runs entirely on the local
 * service data; nothing leaves the browser.
 */

import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Clock3,
  RotateCcw,
  Scissors,
  ShieldCheck,
  Sparkles,
  Wand2,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getCompatibleStylists, getDepositAmount, services, type Service } from "@/lib/salon-data";

type Goal = "shape" | "depth" | "lighten" | "shine" | "groom";
type Time = "short" | "medium" | "long";
type Upkeep = "minimal" | "some" | "often";

type Profile = {
  goals: Goal[];
  commitment: Time;
  maintenance: "low" | "medium" | "high";
};

/**
 * Service character. Goals and maintenance are editorial judgements the salon
 * data does not carry; commitment is derived from the real duration below.
 */
const PROFILES: Record<string, Profile> = {
  "signature-cut": { goals: ["shape"], commitment: "medium", maintenance: "medium" },
  "precision-short": { goals: ["shape", "groom"], commitment: "short", maintenance: "low" },
  "lived-in-color": { goals: ["depth", "lighten"], commitment: "long", maintenance: "low" },
  "full-balayage": { goals: ["lighten"], commitment: "long", maintenance: "low" },
  "color-refresh": { goals: ["depth"], commitment: "medium", maintenance: "medium" },
  "keratin-smoothing": { goals: ["shine"], commitment: "long", maintenance: "low" },
  "repair-ritual": { goals: ["shine"], commitment: "short", maintenance: "low" },
  "grooming-detail": { goals: ["groom"], commitment: "short", maintenance: "high" },
};

const GOAL_OPTIONS: { id: Goal; label: string; hint: string }[] = [
  { id: "shape", label: "Shape or length", hint: "A cut that holds its line" },
  { id: "depth", label: "Depth or grey coverage", hint: "Roots, tone, richness" },
  { id: "lighten", label: "Lightening or dimension", hint: "Balayage, highlights" },
  { id: "shine", label: "Shine and manageability", hint: "Texture, smoothing, repair" },
  { id: "groom", label: "Grooming upkeep", hint: "Short cuts, beard, neckline" },
];

const TIME_OPTIONS: { id: Time; label: string; hint: string }[] = [
  { id: "short", label: "Under an hour", hint: "In and out" },
  { id: "medium", label: "A couple of hours", hint: "A proper sitting" },
  { id: "long", label: "As long as it takes", hint: "Time is not the constraint" },
];

const UPKEEP_OPTIONS: { id: Upkeep; label: string; hint: string }[] = [
  { id: "minimal", label: "As little as possible", hint: "Grow out gracefully" },
  { id: "some", label: "A visit or two a year", hint: "Keep it tidy" },
  { id: "often", label: "I like being in the chair", hint: "Book me often" },
];

const GOAL_COPY: Record<Goal, string> = {
  shape: "shape",
  depth: "depth",
  lighten: "lightening",
  shine: "shine and manageability",
  groom: "grooming upkeep",
};

function commitmentOf(service: Service): Time {
  if (service.duration <= 60) return "short";
  if (service.duration <= 150) return "medium";
  return "long";
}

function score(service: Service, answers: { goal: Goal; time: Time; upkeep: Upkeep }) {
  const profile = PROFILES[service.id];
  if (!profile) return { total: 0, reasons: [] as string[] };

  const reasons: string[] = [];
  let total = 0;

  if (profile.goals.includes(answers.goal)) {
    total += 6;
    reasons.push(`Built for ${GOAL_COPY[answers.goal]}`);
  }

  const commitment = commitmentOf(service);
  if (commitment === answers.time) {
    total += 4;
    reasons.push(`Fits the ${service.duration} minutes you have`);
  } else if (answers.time === "long") {
    // Someone with unlimited time is still happy with a shorter service.
    total += 1;
  } else if (answers.time === "short" && commitment !== "short") {
    // A long service is a hard no for someone who is in and out.
    total -= 8;
  } else {
    total -= 2;
  }

  const upkeepWanted = answers.upkeep === "minimal" ? "low" : answers.upkeep === "some" ? "medium" : "high";
  if (profile.maintenance === upkeepWanted) {
    total += 3;
    reasons.push(
      upkeepWanted === "low"
        ? "Grows out slowly between visits"
        : upkeepWanted === "high"
          ? "Designed for frequent upkeep"
          : "A comfortable maintenance rhythm",
    );
  } else if (upkeepWanted === "low" && profile.maintenance === "high") {
    total -= 4;
  } else {
    total -= 1;
  }

  return { total, reasons };
}

type Answers = { goal: Goal; time: Time; upkeep: Upkeep };
const STEPS = ["What are we solving?", "How long can you sit?", "How much upkeep?"] as const;

export function ServiceMatcher({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});

  const ranked = useMemo(() => {
    if (!answers.goal || !answers.time || !answers.upkeep) return [];
    const full = answers as Answers;
    return services
      .map((service) => ({ service, ...score(service, full) }))
      .sort((a, b) => b.total - a.total || a.service.price - b.service.price);
  }, [answers]);

  const best = ranked[0];
  const runnersUp = ranked.slice(1, 3);
  const done = step === 3;

  function reset() {
    setStep(0);
    setAnswers({});
  }

  function chooseGoal(goal: Goal) {
    setAnswers((prev) => ({ ...prev, goal }));
    setStep(1);
  }
  function chooseTime(time: Time) {
    setAnswers((prev) => ({ ...prev, time }));
    setStep(2);
  }
  function chooseUpkeep(upkeep: Upkeep) {
    setAnswers((prev) => ({ ...prev, upkeep }));
    setStep(3);
  }

  const chairs = best ? getCompatibleStylists(best.service.id) : [];
  const leadChair = chairs[0];
  const deposit = best ? getDepositAmount(best.service) : 0;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) window.setTimeout(reset, 220);
      }}
    >
      <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden border-[#DCE3D6]">
        <div className="matcher">
          <header className="matcher-head">
            <div>
              <p className="service-category">Consultation, before the chair</p>
              <DialogTitle className="font-display text-2xl tracking-tight">Find your service</DialogTitle>
            </div>
            <span className="matcher-step-count">{done ? "Result" : `${step + 1} / 3`}</span>
          </header>

          <div className="matcher-progress" aria-hidden="true">
            {STEPS.map((label, index) => (
              <span key={label} className={index <= step ? "matcher-progress-seg active" : "matcher-progress-seg"} />
            ))}
          </div>

          <DialogDescription className="sr-only">
            Answer three questions to get a recommended service and stylist.
          </DialogDescription>

          <div className="matcher-body">
            {step === 0 && (
              <div className="matcher-question">
                <h3>What are we solving?</h3>
                <p>Pick the outcome that matters most. You can refine it in the chair.</p>
                <div className="matcher-options">
                  {GOAL_OPTIONS.map((option, index) => (
                    <button
                      key={option.id}
                      className="matcher-option"
                      data-reveal="up"
                      style={{ "--rd": `${index * 45}ms` } as React.CSSProperties}
                      onClick={() => chooseGoal(option.id)}
                    >
                      <Scissors size={17} />
                      <span>
                        <b>{option.label}</b>
                        <small>{option.hint}</small>
                      </span>
                      <ArrowUpRight size={15} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="matcher-question">
                <h3>How long can you sit?</h3>
                <p>We only show work that genuinely fits the window you have.</p>
                <div className="matcher-options">
                  {TIME_OPTIONS.map((option, index) => (
                    <button
                      key={option.id}
                      className="matcher-option"
                      data-reveal="up"
                      style={{ "--rd": `${index * 45}ms` } as React.CSSProperties}
                      onClick={() => chooseTime(option.id)}
                    >
                      <Clock3 size={17} />
                      <span>
                        <b>{option.label}</b>
                        <small>{option.hint}</small>
                      </span>
                      <ArrowUpRight size={15} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="matcher-question">
                <h3>How much upkeep do you want?</h3>
                <p>This decides whether we place colour to grow out, or to stay sharp.</p>
                <div className="matcher-options">
                  {UPKEEP_OPTIONS.map((option, index) => (
                    <button
                      key={option.id}
                      className="matcher-option"
                      data-reveal="up"
                      style={{ "--rd": `${index * 45}ms` } as React.CSSProperties}
                      onClick={() => chooseUpkeep(option.id)}
                    >
                      <Sparkles size={17} />
                      <span>
                        <b>{option.label}</b>
                        <small>{option.hint}</small>
                      </span>
                      <ArrowUpRight size={15} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {done && best && (
              <div className="matcher-result" data-reveal="scale">
                <p className="service-category">Best match</p>
                <h3>{best.service.name}</h3>
                <p className="matcher-result-copy">{best.service.description}</p>

                {best.reasons.length > 0 && (
                  <ul className="matcher-reasons">
                    {best.reasons.map((reason) => (
                      <li key={reason}>
                        <Check size={14} /> {reason}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="matcher-facts">
                  <div>
                    <Clock3 size={15} />
                    <span>
                      <b>{best.service.duration} min</b>
                      <small>in chair</small>
                    </span>
                  </div>
                  <div>
                    <Wand2 size={15} />
                    <span>
                      <b>${best.service.price}</b>
                      <small>{deposit ? `$${deposit} deposit` : "no deposit"}</small>
                    </span>
                  </div>
                  <div>
                    <ShieldCheck size={15} />
                    <span>
                      <b>{best.service.chemical ? "Consult first" : "Book directly"}</b>
                      <small>{best.service.chemical ? "First-time chemical visit" : "No patch test needed"}</small>
                    </span>
                  </div>
                </div>

                {leadChair && (
                  <div className="matcher-chair">
                    <span className="initial-avatar" style={{ backgroundColor: leadChair.accent }}>
                      {leadChair.initials}
                    </span>
                    <span>
                      <b>Best chair: {leadChair.name}</b>
                      <small>
                        {leadChair.role} · {leadChair.specialties.slice(0, 2).join(" · ")}
                      </small>
                    </span>
                  </div>
                )}

                {runnersUp.length > 0 && (
                  <div className="matcher-also">
                    <span>Also worth considering</span>
                    <div>
                      {runnersUp.map(({ service }) => (
                        <Link key={service.id} href={`/services?focus=${service.id}`} onClick={() => onOpenChange(false)}>
                          {service.name} <ArrowUpRight size={12} />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <div className="matcher-actions">
                  <Link
                    href={`/book?service=${best.service.id}`}
                    className="primary-cta"
                    onClick={() => onOpenChange(false)}
                  >
                    Book {best.service.name} <ArrowUpRight size={16} />
                  </Link>
                  <button className="ghost-cta" onClick={reset}>
                    <RotateCcw size={14} /> Start over
                  </button>
                </div>
                <p className="matcher-footnote">
                  A suggestion, not a verdict — your stylist confirms the plan in the chair.
                </p>
              </div>
            )}
          </div>

          {step > 0 && !done && (
            <footer className="matcher-foot">
              <button className="matcher-back" onClick={() => setStep((s) => Math.max(0, s - 1))}>
                <ArrowLeft size={15} /> Back
              </button>
              <span>Answers stay on this device.</span>
            </footer>
          )}
          {done && (
            <footer className="matcher-foot">
              <button className="matcher-back" onClick={() => setStep(2)}>
                <ArrowLeft size={15} /> Change upkeep
              </button>
              <span>Recommendation recalculates instantly.</span>
            </footer>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
