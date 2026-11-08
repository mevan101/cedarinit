# Cedar Initiative — Brand Guide (Cedar Editorial v2)

> **v2 (Nov 2026): documentary editorial.** Real photos with a caption giving place and date, solid flat cards, one accent colour.
> Glass blur is used only for floating chrome (`.chrome`: sticky header, menus, chat). The aurora and grain effects are retired (`<Aurora>` renders nothing).
> `.glass` / `<GlassCard>` remain as names but now render solid surfaces. Every impact number uses `<Stat>` and shows its period and source.
> Screen-class rules (short screens, dual-screen `viewport-segments`, coarse pointers, Save-Data) live at the end of `app/globals.css`.
> Hover styles apply only on devices that can hover (`future.hoverOnlyWhenSupported`).

The live, interactive version of this guide is at [`/brand`](https://cedar-initiative.org/brand/) (`app/brand/page.tsx`).
All values below are implemented as tokens in `app/globals.css` and `tailwind.config.ts`. **Never hard-code
colours, radii or easing in components — use the tokens.**

## 1. Who we are

- **Name:** Cedar Initiative — *Community Empowerment for Development & Advocacy Resilience*
- **What:** a youth-led, volunteer-based nonprofit working in Bangladesh (currently unregistered; path to 501(c)(3) via fiscal sponsorship).
- **Founder:** Shahriar Azad Evan
- **Tagline:** Be the Force for Good · *Built by U. Powered by purpose.*
- **Mission:** Empowering communities through climate action, education, wellness, and innovation to drive sustainable progress globally.
- **Vision:** A world where empowered youth and communities lead sustainable progress, fostering resilience, equity, and well-being for all.
- **Values:** Sustainability · Equity · Youth-Driven Leadership · Innovation · Integrity · Transparency

## 2. Logo

Two opposing cedar-green wedges rising past each other — a split "C" and "I" that reads as growth and balance — beside an Anton wordmark.

| File | Use |
| --- | --- |
| `public/brand/logo.svg` | Primary lockup on light backgrounds |
| `public/brand/logo-white.svg` | All-white, on photos / dark green |
| `public/brand/logo-reverse.svg` | Green mark + white wordmark on Cedar 950 |
| `public/brand/mark.svg` | Mark only (avatars, small sizes) |
| `public/brand/icon.svg` | App icon / favicon (white mark on Cedar 700) |

- Clear space = height of the "C" on every side. Minimum width 96px digital / 25mm print; use the mark alone below that.
- Don't recolour (outside Cedar ramp, white, black), stretch, rotate, outline, add shadows, or place on busy imagery without a scrim.

## 3. Colour

| Token | Hex | Role |
| --- | --- | --- |
| `cedar-700` | `#025730` | Primary — logo, primary buttons, links |
| `ink` | `#0B1A12` | Headlines and body text |
| `ink-soft` / `ink-muted` | `#2D3D34` / `#54635A` | Secondary text / meta (both AA on Paper) |
| `paper` | `#F8F7F2` | Page background |
| `cedar-950` | `#011E11` | Dark sections, footer |
| `ember` | `#F2B544` | Accent — highlights on dark surfaces only, ≤5% of a layout |

Full ramp: 50 `#F0FAF4` · 100 `#DCF3E6` · 200 `#B8E6CC` · 300 `#7FD6A4` · 400 `#3FA872` · 500 `#16884F` · 600 `#0A6E40` · 700 `#025730` · 800 `#024326` · 900 `#01331C` · 950 `#011E11`.

Contrast: body text ≥ 4.5:1, large text / UI ≥ 3:1 (WCAG 2.2 AA). On light, text uses Cedar 600+; on dark, Cedar 300 or lighter.

## 4. Typography

- **Display — Anton 400, uppercase.** The logo face. Headlines only, ≤ ~6 words, line-height 0.92–0.98.
- **Text — Inter 400/500/600.** Everything people read.
- **Bangla — Noto Sans Bengali 400/600** (automatic fallback in the `sans` stack; mark Bangla text with `lang="bn"`).

| Class | Font | Size (320px → 1440px+) | Use |
| --- | --- | --- | --- |
| `.t-display` | Anton | 44 → 120px | Home hero |
| `.t-h1` | Anton | 40 → 84px | Page titles |
| `.t-h2` | Anton | 32 → 60px | Section titles |
| `.t-h3` | Inter 600 | 20 → 24px | Card titles |
| `.t-lead` | Inter 400 | 17 → 21px | Intros |
| body | Inter 400 | 16–17px, 1.6–1.8 lh, 68ch measure | Paragraphs |
| `.t-eyebrow` | Inter 600 | 12px, 0.18em tracking, uppercase | Section labels |

## 5. Layout, spacing & surfaces

- 4px base grid. Container `.shell` = max 80rem with fluid gutter `clamp(20px, 4vw, 40px)`. Sections use `.section` = `clamp(72px, 10vw, 144px)` vertical padding.
- Breakpoints: `xs 400` · `sm 640` · `md 768` · `lg 1024` · `xl 1280` · `2xl 1536` · `3xl 1920`. Type and spacing are fluid (`clamp()`), so breakpoints only change layout.
- Radius: pills (999px) for buttons/nav/chips · 28px cards (`--radius-card`) · 32–40px feature panels.
- **Liquid glass** (`.glass`, `.glass-dark`, `<GlassCard>`) is for elements that float: header, stat cards, filters, chat, highlights. Translucent white gradient, 20–22px blur, 150–170% saturation, inner top highlight, soft cedar shadow, and a pointer-tracking specular sheen. Never use glass behind long text. Without `backdrop-filter` support it falls back to near-opaque.
- **Solid cards** (white, 28px radius, layered shadow) for reading: posts, people, forms.
- **Aurora** (`<Aurora>`) — blurred, slowly drifting cedar/ember blobs behind heroes and CTAs give the glass something to refract.

## 6. Components

`Header` (floating glass pill, hides on scroll-down, accessible mobile dialog) · `Footer` · `SectionHeading` · `PageHero` · `CTA` · `GlassCard` · `PostCard` · `PersonCard` · `Gallery` (filters + `<dialog>` lightbox with keyboard & swipe) · `Counter` · `ContactForm` · `ChatWidget` (WhatsApp / Messenger) · `Reveal` / `RiseText` · `Img` (responsive WebP) · `Icon` · `Logo` / `Mark`.

Buttons: `.btn-primary` (Cedar 700), `.btn-glass`, `.btn-light` and `.btn-ghost-dark` (on dark). Minimum height 48px. One primary button per view.

## 7. Motion

- Easing `cubic-bezier(0.22, 1, 0.36, 1)` (`--ease-out`); durations 0.3s (UI) to 1.1s (reveals).
- **Reveal** — fade + 28px rise + blur clears on viewport entry (variants: `left`, `right`, `zoom`, `mask`), staggered 80–120ms.
- **Rise** — headline words lift from a mask.
- **Parallax / scroll progress** — CSS scroll-driven animations (`animation-timeline`), progressive enhancement.
- **Count-up** — impact numbers; screen readers receive the final value immediately.
- `prefers-reduced-motion: reduce` disables every animation and shows content instantly. Content is never hidden if JavaScript fails (`.no-js`).

## 8. Accessibility checklist (WCAG 2.2 AA)

Semantic landmarks, one `h1` per page, skip link · visible 3px focus ring · touch targets ≥ 44×44px · descriptive `alt`, decorative images `alt=""` · forms with labels, inline errors, `aria-live` status · external links announce "opens in a new tab" · Bangla marked `lang="bn"` · safe-area insets on notched phones · reduced-motion support.

## 9. Imagery & voice

- Real people, real places, natural light. Always respect dignity and consent — no pity imagery. Optimised WebP in `public/images` (regenerate with `npx -p sharp node scripts/optimize-images.mjs <uploads-dir>`).
- Voice: hopeful, honest, specific. Use real names, places, numbers and dates. Avoid hype, jargon and unexplained acronyms.
