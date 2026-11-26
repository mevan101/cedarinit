# Cedar Initiative brand guide: Cedar Fieldnotes

Documentary photos and plain-spoken stories, with an editorial Paper/Cedar/Seedling identity. This combines the earlier Fieldnotes direction with the photo-led homepage and existing volunteer platform. The interactive guide is at `/brand/`.

## Organisation and voice

- Cedar Initiative is a youth-led volunteer group founded in Dhaka in 2025. ML Bangladesh is its STEM program.
- Cedar is not yet a registered organisation. Fiscal sponsorship is being arranged; do not imply an agreement or tax-deductible giving is already available. `/give/` is the current public source of giving information.
- Use the current factual copy from `lib/site.ts`, the original articles in `content/posts/`, and published program/report records. Do not invent figures, quotes, partners or dates.
- Credit all co-founders equally. Do not show team headcounts.
- Be warm, direct and specific: what happened, where, when, and what it cost. No hype, em dashes, pity-driven language or unexplained acronyms.
- Every impact figure must retain its counting period and source link. Program figures come from `lib/site.ts`; use `<Stat>` so the evidence stays with the number.
- Keep internal notes and unconfirmed agreements out of public pages. Preserve the wording of original news articles.

## Original logo assets

Use the supplied files exported from the original `docs/brand/CI_LOGO.pdf`. Never redraw the mark or retype the wordmark.

| File | Use |
| --- | --- |
| `public/brand/logo.svg` | Primary lockup on light backgrounds |
| `public/brand/logo-white.svg` | White lockup on dark backgrounds |
| `public/brand/logo-reverse.svg` | Original green mark with white wordmark |
| `public/brand/wordmark.svg` | Standalone wordmark |
| `public/brand/mark.svg` | Mark for small spaces and avatars |
| `public/brand/icon.svg` | App icon and favicon |
| `public/brand/icon-512.png` | Raster app icon |
| `public/brand/logo.png` | Raster lockup |

The logo uses its own green, `#1A502A`. This is **not** the interface green. Keep the original colours; choose a supplied light/reverse variant rather than recolouring an asset.

Clear space is the height of the “C” on every side. Minimum lockup width is 96px digitally or 25mm in print; use the mark below that. Do not stretch, rotate, outline, add shadows, or place the logo across faces or busy photography.

The earlier tree wordmark remains in `public/brand/legacy/` for original 2025 documents only. Do not replace logos inside published reports.

## Colour

Tokens live in `app/globals.css` and `tailwind.config.ts`. Components use tokens, not one-off hex values. The interactive palette provides copyable hex values and computed contrast for each displayed text/background pair.

| Token | Hex | Role |
| --- | --- | --- |
| `paper` | `#F6F4EB` | Reading surface |
| `paper-deep` | `#EBE8DB` | Evidence strips and quiet separation |
| `cedar-700` | `#025730` | Primary buttons and links |
| `seedling` | `#DCEE8F` | Invitations and restrained highlights |
| `ink` | `#0B1A12` | Headlines and body text |
| `ink-soft` | `#2D3D34` | Secondary copy |
| `ink-muted` | `#54635A` | Captions and metadata |
| `cedar-950` | `#011E11` | Dark chapters and footer |
| `ember` | `#F2B544` | Rare accent, not body text |

The complete Cedar ramp is unchanged: 50 `#F0FAF4`, 100 `#DCF3E6`, 200 `#B8E6CC`, 300 `#7FD6A4`, 400 `#3FA872`, 500 `#16884F`, 600 `#0A6E40`, 700 `#025730`, 800 `#024326`, 900 `#01331C`, 950 `#011E11`.

Body text needs at least 4.5:1 contrast; large text and interface boundaries need 3:1. On Paper use Ink or Cedar 600 and darker. On dark green use white, Paper, Seedling or a verified light Cedar shade. Check actual opacity and background, not just the nominal token.

## Typography

- **Anton 400:** short display lines, displayed in uppercase. Write sentence-case source text. Keep headlines brief and remove small eyebrow labels above page headlines.
- **Inter 400/500/600:** readable text, forms, buttons and captions.
- **Noto Sans Bengali 400/600:** Bangla, with `lang="bn"` on the relevant text.
- Body copy is 16–17px with generous line height and a comfortable reading measure. Captions are generally 14px. Let text wrap; never shrink important copy to force a fit.
- Use `text-wrap: balance` for headings and `pretty` for paragraphs. Figures and money use tabular numbers.

| Class | Font | Fluid size |
| --- | --- | --- |
| `.t-display` | Anton | 36–112px; homepage orbit has its own 48–128px scale |
| `.t-h1` | Anton | 36–80px |
| `.t-h2` | Anton | 32–60px |
| `.t-h3` | Inter 600 | 20–24px |
| `.t-lead` | Inter | 17–21px |

## Layout and surfaces

- Use a 4px base grid. `.shell` is 88rem maximum, increasing to 90rem on very wide displays. Gutter is `clamp(1.25rem, 4.5vw, 4.5rem)`.
- `.section` uses `clamp(4rem, 8vw, 7.5rem)` vertical padding, with tighter short-screen rules.
- `--radius-card` is 12px. Shared feature radii derive from it. Buttons use 8px corners; small badges can remain pills.
- Use Paper for the page, white for reading cards, a fine border for separation, Cedar 950 for a strong chapter and Seedling for the closing invitation. No ornamental gradients, grain or glass behind text.
- Navigation is a persistent solid bar. The mobile menu uses native `<dialog>` for focus containment, Escape and focus return. JavaScript-disabled mobile visitors get ordinary navigation links.
- `.glass`, `.glass-dark` and `<GlassCard>` are compatibility names for solid surfaces. `.chrome` remains available to existing platform controls; it is not the default design language. `<Aurora>` remains a no-op.
- Contact is explicit in the navigation, footer and contact page. Do not add a floating launcher over content.

## Documentary photography

- Use the existing real program imagery with useful alt text and captions that give the actual place/date.
- Preserve people in the frame and gallery order, left to right and top to bottom. Prefer uncropped images when a crop would remove someone.
- Respect dignity and consent; never use pity imagery or generic stock heroes.
- Keep the existing processed team portraits: white background, faint contour lines and green shapes. Use the portrait pipeline, not hand-edited replacements.
- Keep responsive images dimensioned to prevent layout shift.

## Motion and resilience

- Preserve the homepage opening: original logo and program photos, a full homepage load only, skipped by any key, tap or scroll. In-site navigation must not replay it.
- Hero photo mosaic, group-photo expansion, program stack panels, report bars and verify seal remain progressive enhancements. `public/motion.js` supplies the scroll values and observer fallback.
- Content is **visible by default**. `Reveal`/`RiseText` animate only after observation; an unavailable observer must not leave words or cards hidden. Counters keep their real value until animation begins and always expose the final value to screen readers.
- Entrance motion is brief. Shared easing is `cubic-bezier(0.22, 1, 0.36, 1)`. Interface feedback generally stays under 300ms; rare storytelling sequences can run longer.
- Animate transform, opacity, clip-path and small filters, never layout properties. No `transition: all`. Gate hover effects to fine pointers that can hover.
- Decorative photo drift settles within four seconds. Anything moving automatically beyond five seconds needs a pause control, as the sponsor strip has.
- Reduced motion gives a complete still page: no opening, parallax, decorative loops or count-up.

## Verification

Follow `.agents/skills/cedar-verify/SKILL.md`: typecheck, production export, axe scans, narrow screens, zoom, reduced motion, console and before/after screenshots. Check 320px and 360px without sideways scroll, 200% zoom, keyboard focus, and JavaScript/observer fallbacks.

Use `NEXT_PUBLIC_SUPABASE_URL= npm run build` for demo/offline form checks; do not write to live Supabase or send real contact/volunteer submissions. Keep the volunteer/account/staff platform, original news/report routes and downloads intact. Changes go through a review PR, never an unrequested production deployment.
