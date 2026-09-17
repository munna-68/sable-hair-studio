---
name: Sable Hair Studio — Quiet Expense
description: Bright product-green minimal system for a premium salon showcase. Same layout, new voice.
colors:
  paper: "#F5F8F4"
  card: "#FCFDFB"
  surface: "#E7ECE2"
  surface-deep: "#E2E9DC"
  ink: "#0A1F14"
  muted-ink: "#4E5B51"
  hairline: "#DCE3D6"
  accent: "#147A45"
  accent-vivid: "#27C46B"
  accent-soft: "#D8EEDD"
  utility-sage: "#1FA255"
  utility-clay: "#9C4A3C"
typography:
  display:
    fontFamily: "Marcellus, Georgia, serif"
    fontSize: "clamp(2.75rem, 5vw, 4.5rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Marcellus, Georgia, serif"
    fontSize: "clamp(2rem, 3.5vw, 3rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  label:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.14em"
rounded:
  pill: "999px"
  md: "16px"
  lg: "20px"
  photo: "24px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "32px"
  xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "14px 20px"
  button-primary-hover:
    backgroundColor: "{colors.accent-vivid}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "14px 20px"
  button-ghost:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "13px 18px"
  input-field:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "11px 13px"
  chip-selected:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "9px 12px"
  card-retail:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "22px"
  footer-base:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: "64px 32px 20px"
  nav-link-active:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "6px 2px"
---

# Design System: Sable Hair Studio — Quiet Expense

## 1. Overview

**Creative North Star: "The Vivid Greenhouse"**

A bright white room with product-grade green light. Ink that reads like pine-black, not black. One deep green for decisions and one vivid leaf for moments of energy, used the way a good product uses emphasis: rarely, precisely, and only where it moves the booking forward. The Chromatic Cut blues, the warm cream-and-bronze pass, and the muted Fog Pine pass are all retired as anti-references.

This system keeps every route, flow, and grid exactly where it is. Voice changes through color temperature, roundness, hairlines, and state treatments. Sections share one ground with hairline rules, never tinted bands. The footer owns the dark.

**Key Characteristics:**
- Bright light theme, near-white ground, never nocturnal, never cream, never flat gray-green.
- Product greens: deep for trust, vivid for energy, mint for selection.
- Round and friendly: pill actions, rounded cards, circle avatars, pill chips.
- Flat by default. Depth comes from white cards on white, hairlines, and hover lift.
- Function proves premium: accumulation, confirmation, and next-visit clarity over animation.
- Quiet type: one inscriptional serif for display, one humanist sans for everything else.
- Flat by default. Depth comes from tonal layering, not shadows.
- Function proves premium: accumulation, confirmation, and next-visit clarity over animation.

## 2. Colors

Near-white grounds with pine-black ink, a deep decision green, and one vivid leaf kept rare on purpose.

### Primary
- **Pine Black** (#0A1F14 / oklch(22% 0.03 155)): reading text, primary buttons, summary panels, the footer. The workhorse. Never pure black.
- **Deep Green** (#147A45 / oklch(53% 0.12 150)): decisive states in text and line. Active nav marker, links, labels, focus rings, selected borders. Always AA on white.
- **Vivid Leaf** (#27C46B / oklch(72% 0.17 150)): energy only. Primary hover grounds with pine-black text, count badges, progress fills, status dots, small graphic ticks. Rare by doctrine.

### Neutral
- **Stone White** (#F5F8F4 / oklch(96% 0.008 130)): page ground. Bright, faintly green, calm.
- **Card White** (#FCFDFB / oklch(99% 0.004 130)): cards, inputs, sheets. Lifts off the ground with a hairline, never a shadow at rest.
- **Fog Surface** (#E7ECE2 / oklch(92% 0.015 130)): quiet wells and hover tints.
- **Sage Smoke** (#4E5B51 / oklch(50% 0.03 140)): secondary copy, metadata, placeholders.
- **Hairline Mist** (#DCE3D6 / oklch(89% 0.02 135)): every border, divider, and grid line. Cool, never blue-gray, never warm sand.
- **Mint Wash** (#D8EEDD / oklch(90% 0.04 145)): selected washes, notice grounds, active fills.
- **Signal Green** (#1FA255 / oklch(64% 0.15 150)): availability dots and tiny functional marks only.
- **Fired Clay** (#9C4A3C / oklch(52% 0.09 35)): error and destructive utility only.

### Named Rules (optional, powerful)
**The Leaf Rarity Rule.** Vivid leaf covers at most 10 percent of any screen. Deep green carries trust; vivid carries energy. If vivid spreads, it stops being premium.
**The One Ground Rule.** Sections share the stone-white ground with hairline rules. No tinted color-block bands. The footer is the single deliberate dark.

## 3. Typography

**Display Font:** Marcellus (with Georgia fallback)
**Body Font:** Manrope (with system-ui fallback)
**Label Font:** Manrope Bold, uppercase

**Character:** Inscriptional calm on top, humanist clarity underneath. Display speaks once per screen in a quiet Roman voice. Body carries booking detail, prices, and policies without shouting. No geometric grotesk energy, no system-default hardness.

### Hierarchy
- **Display** (400, clamp(2.75rem, 5vw, 4.5rem), 1.02): hero and page headlines only. Sentence case, tracking minus 0.02em.
- **Headline** (400, clamp(2rem, 3.5vw, 3rem), 1.05): section statements, plan names, confirmation titles.
- **Title** (600, 20px, 1.3): card titles, service names, dialog headings. Tracking minus 0.01em.
- **Body** (400, 16px, 1.65): copy, prices, policies, form detail. Max line length 68ch.
- **Label** (700, 11px, 0.14em, uppercase): eyebrows, metadata, rails, table headers, status pills.

### Named Rules (optional)
**The One Serif Rule.** Marcellus appears in display and headline only. Everything else is Manrope. Never set body or UI in the serif.
**The Scale Step Rule.** Adjacent type steps hold at least a 1.25 ratio. Flat scales read as uncommitted and are forbidden.

## 4. Elevation

Flat by default with white-on-white layering. Cards lift off the ground with hairlines, never shadows at rest. Shadows appear only as a response to state (hover lift of 2px, open drawers, sticky header after scroll). No ambient card shadows, no glass blur as decoration, no heavy luxury drop shadows.

### Shadow Vocabulary (if applicable)
- **Resting lift** (`box-shadow: none`): cards, rows, panels at rest. Separation comes from hairlines and tone.
- **Hover lift** (`box-shadow: 0 10px 24px -18px rgba(10,31,20,.45)`): interactive cards rising 2px on hover.
- **Header seal** (`box-shadow: 0 14px 30px -26px rgba(10,31,20,.5)`): sticky header after scroll only.
- **Drawer rise** (`box-shadow: -18px 0 44px -28px rgba(10,31,20,.5)`): cart, saved, and palette surfaces.

### Named Rules (optional)
**The Flat-By-Default Rule.** Surfaces are flat at rest. A shadow without a state change is a bug.

## 5. Components

### Buttons
- **Shape:** full pill (999px radius). Every action, from header CTA to drawer buttons.
- **Primary:** pine-black ground with stone-white text, 14px 20px padding, 13px bold Manrope. Compresses slightly on press, flips to vivid leaf with pine-black text on hover.
- **Hover / Focus:** hover goes vivid with a 2px lift. Focus shows a 3px deep-green outline offset 3px. Never a blue glow.
- **Secondary / Ghost:** transparent or card-white ground, 1px hairline stroke, ink text, pill. Hover tints border and text to deep green.

### Chips
- **Style:** card-white ground, 1px hairline border, sage-smoke text, full pill. Filter and option chips share the shape.
- **State:** selected pairs mint wash ground with ink text and a deep-green border. Never a left stripe. Shape or label change accompanies color.

### Cards / Containers
- **Corner Style:** retail, plan, and team cards round (20px) with breathing gaps, never hairline grids. Interface tiles round (16px); small icon tiles round (10px); avatars circle. Only photography takes the soft photo corner (24px).
- **Background:** card white on stone white, separated by 1px hairline mist.
- **Shadow Strategy:** flat at rest per Elevation. Hover lift 2px where the card is a link.
- **Border:** 1px hairline mist throughout. Full borders only.
- **Internal Padding:** 16px tight, 22px cards, 32px plus editorial.

### Inputs / Fields
- **Style:** card-white ground, 1px hairline stroke, 16px radius (search runs full pill), 16px Manrope.
- **Focus:** deep-green 2px outline. Never blue.
- **Error / Disabled:** error pairs fired-clay border with a clay label line. Disabled drops to 45 percent opacity with no pointer events.

### Navigation
- Header on blurred stone white with a hairline base rule. Manrope 13px semibold, sage-smoke at rest, ink on hover. Active state is ink text with a short deep-green underline marker. Circle icon buttons; pill search. Mobile panel is a full stone sheet with staggered fade, no glass.

### Footer (signature component)
Pine-black footer is the single deliberate dark: #0A1F14 ground, mint-tinted secondary text, vivid leaf reserved for hover states and the newsletter Join action. No other section takes a tinted ground.

### Booking Summary (signature component)
Pine-black panel with stone-white text is retained as the one dark anchor on the booking route: #0A1F14 ground, deep-green dividers, mint status pill. It echoes the footer, which is why both still feel expensive.

## 6. Do's and Don'ts

### Do:
- **Do** keep layout, routes, and flows untouched. This pass is voice only.
- **Do** hold vivid leaf to 10 percent or less per screen. Deep green carries trust; vivid carries energy.
- **Do** round primary actions, chips, slots, and status to pills; keep utility buttons (Bag/Share/Copy/Directions `.mini-ghost`) as compact 10px rounded-rects with inline icon+label. Cards at 20px, address/contact cards and form fields at 12px.
- **Do** keep sections on the one shared ground with hairline rules. Only the footer goes dark.
- **Do** set display in Marcellus and everything functional in Manrope.
- **Do** use full 1px hairline mist borders for separation.
- **Do** pair every color signal (selected, available, error) with a label or shape change.
- **Do** honor reduced motion: disable parallax, marquee, and reveal choreography on request.

### Don't:
- **Don't** use cobalt blue, ink-black panels, or porcelain-blue chrome. The old Chromatic Cut tokens are retired.
- **Don't** use warm cream, sand, bronze, espresso, or muted pine-on-stone flatness. All three earlier passes are retired.
- **Don't** ship sharp square buttons or hairline-grid card walls. Pills and gapped rounded cards, always.
- **Don't** give any section its own tinted color-block band. Seamless ground, hairline rules, dark footer.
- **Don't** use Space Grotesk, DM Sans, Inter, or any reflex-reject family for new type.
- **Don't** use gradient text, glassmorphism cards, or decorative blur.
- **Don't** use side-stripe accent borders (border-left or border-right greater than 1px as decoration) on cards, rows, notices, or selected states. Use full borders, fern wash grounds, or nothing.
- **Don't** build identical icon-plus-heading card grids or hero-metric stat blocks. Vary rhythm per the existing editorial layout.
- **Don't** ship gold-on-black luxury cliché, heavy shadows, or stock-glamour staging.
- **Don't** set body copy in all caps or letter-space body text. Reserve caps for 11px labels.
- **Don't** animate layout properties. Ease state changes out with exponential curves only.
