---
name: cedar-design-engineering
description: Brand, layout, motion and writing rules for the Cedar Initiative website. Use before changing any page, component, CSS, animation or visible text in this repository.
---

# Cedar design engineering

The goal is a site that feels calm, trustworthy and quick: a youth-led nonprofit that shows its work honestly. Every rule below exists to protect that. Follow the house rules first; the general rules fill the gaps.

## House rules (Cedar-specific)

**Brand**
- Use the logo files in `public/brand/` (`logo.svg`, `logo-white.svg`, `logo-reverse.svg`, `wordmark.svg`, `mark.svg`). They are exported from the original `docs/brand/CI_LOGO.pdf`. Never retype "Cedar / Initiative" in a font or redraw the mark.
- Logo green is `#1A502A` (logo only). Interface green is the `cedar-*` scale (`cedar-700` = `#025730` for buttons and links). Ink, paper and ember tokens live in `app/globals.css` and `tailwind.config.ts`; reuse them, never add one-off hex values.
- Type: Anton for short uppercase display lines (`t-display`, `t-h1`, `t-h2`), Inter for everything people read, Noto Sans Bengali for Bangla.

**Layout**
- No small "eyebrow" labels above page headlines, and no decorative dash lines before labels or captions.
- Do not show headcounts on the Team page. Credit the co-founders equally.
- Images are never cropped in ways that cut people out; galleries keep their order (left to right, top to bottom).
- Every page must work at 320px wide with no sideways scroll, and at 200% zoom.

**Writing**
- Plain, specific, human sentences. No em dashes. No hype words ("empower", "transformative", "vibrant", "journey", "leverage", "testament").
- Never invent facts, numbers, quotes, partners or dates. Every statistic shows its period and a source link.
- Sentence case for headings and buttons. Second person when addressing the reader. Use the real ellipsis character `…`.
- Internal matters (negotiating terms, unconfirmed figures, staff notes) go in the dashboard's Team notes, never on public pages.

## Motion system (how it works here)

- `public/motion.js` adds `html.motion` unless the visitor prefers reduced motion. All movement CSS is scoped under `html.motion`, so reduced-motion visitors get still versions automatically.
- `html.no-sda` marks browsers without CSS scroll-driven animations; `.in` is added by an IntersectionObserver as a fallback. Keep both paths working.
- Home hero (`.orbit`): `motion.js` writes `--p` (0 to 1) as the visitor scrolls through it; CSS turns that into photos drifting out and the group photo growing.
- Opening sequence (`components/Intro.tsx` + the intro block in `motion.js`): the logo assembles while the hero's own photos spiral out from it as small dots, grow and land in their places (Web Animations API, measured from the real layout). It plays on every load of the home page, never on in-site navigation, and any tap, key or scroll skips it.
- Shared curve: `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)`. Buttons press to `scale: 0.97`; on mouse devices they lean a few pixels toward the cursor.

## General design-engineering rules

**Decide whether to animate**
- Ask how often people will see it. Things seen constantly (menus, hovers, keyboard actions) get little or no animation; rare moments (the opening, a success state) can be expressive.
- Every animation needs a job: show where something came from, confirm an action, explain a change, or soften something that would otherwise jump.

**Easing and timing**
- Entering or exiting: ease-out. Moving across the screen: ease-in-out. Colour and hover changes: ease. Constant loops: linear. Avoid ease-in for interface motion; it feels slow to respond.
- Interface motion stays under about 300ms (press feedback 100 to 160ms, small popovers 150 to 200ms). Drawers and dialogs may take up to about 500ms. Only storytelling moments like the opening run longer.
- Exits are faster than entrances.

**Shape of motion**
- Nothing appears from nothing: start entrances at about 0.9 to 0.95 scale (or at least half size for small dots) with opacity, not from `scale(0)`.
- Stagger groups by 30 to 80ms with uneven gaps; even steps look mechanical. Never block interaction while a stagger plays.
- A light blur (2 to 6px, never more than 20) can hide an awkward crossfade.
- Popovers and menus scale from the control that opened them; centred dialogs scale from the centre.
- Use CSS transitions for things people can interrupt (toggles, menus) and keyframes or the Web Animations API for fixed or measured sequences.

**Performance**
- Animate `transform`, `opacity`, and when needed `clip-path` and small `filter`. Do not animate width, height, top, margin or padding.
- Never `transition: all` (or Tailwind `transition-all`); list the properties.
- Gate hover effects with `@media (hover: hover) and (pointer: fine)`.
- Public pages load heavy libraries on demand: use `lib/supabase-lazy.ts`, not `lib/supabase-client.ts`, outside the dashboard.

**Interface details**
- Hit targets at least 44px. Every control has a visible focus style (the global `:focus-visible` ring) and an accessible name.
- `text-wrap: balance` on headings and `pretty` on paragraphs (already global). Tabular numbers for figures and money.
- Images carry `width` and `height` (or an aspect ratio) and real `alt` text; decorative images use `alt=""`.
- Decorative text (big step numbers, watermarks) gets `aria-hidden="true"`.
- Nested rounded corners are concentric: outer radius = inner radius + padding.
- Anything that moves on its own for more than five seconds needs a pause control (see the sponsor strip).

## Reduced motion

Reduced motion means fewer and gentler animations, not a broken page. Remove movement and position changes; keep short opacity fades that help understanding. Check that the page is complete and readable with motion off.
