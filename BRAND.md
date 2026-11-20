# Cedar Initiative — Cedar Fieldnotes

Edition 02. The website’s visual identity and working brand guide.
The interactive guide lives at `/brand/` and includes copyable colours and downloadable logo assets.
Tokens live in `app/globals.css` and `tailwind.config.ts`; use them instead of hard-coded colours.

## Identity

**Cedar Initiative** means Community Empowerment for Development & Advocacy Resilience.
We are a youth-led, volunteer-based initiative in Bangladesh, currently unregistered and seeking fiscal sponsorship.
Our tagline remains **Be the Force for Good**. Our mission covers climate action, education, wellness, and innovation.

Fieldnotes is the design direction, not a new organisation name: grounded green, warm paper, documentary photographs,
numbered sections, fine rules, confident headlines, and practical invitations to act.
Keep the existing Cedar logo; don’t replace a recognisable identity just to make a new-looking website.

## Logo

| Asset                           | Use                                  |
| ------------------------------- | ------------------------------------ |
| `public/brand/logo.svg`         | Primary lockup on light backgrounds  |
| `public/brand/logo-white.svg`   | All-white lockup on dark backgrounds |
| `public/brand/logo-reverse.svg` | Green mark with white wordmark       |
| `public/brand/mark.svg`         | Mark alone, compact applications     |
| `public/brand/icon.svg`         | Favicon, white mark on Cedar         |
| `public/brand/logo.png`         | Raster export                        |

Keep clear space equal to the height of the wordmark’s C. Use the full lockup at 96px wide or larger.
Use the mark below that. Never stretch, rotate, outline, shadow, or recolour with accent colours.
On busy photography, use a solid panel rather than relying on a subtle scrim.

## Colour

| Name       | Token        | Hex       | Role                                         |
| ---------- | ------------ | --------- | -------------------------------------------- |
| Cedar      | `cedar-700`  | `#025730` | Logo, primary actions, links                 |
| Paper      | `paper`      | `#F6F4EB` | Main canvas                                  |
| Deep paper | `paper-deep` | `#EBE8DB` | Quiet section contrast                       |
| Seedling   | `lime`       | `#DCEE8F` | Involvement panels, highlights on dark green |
| Ink        | `ink`        | `#0B1A12` | Headlines and body text                      |
| Soft ink   | `ink-soft`   | `#2D3D34` | Secondary reading text                       |
| Muted ink  | `ink-muted`  | `#54635A` | Captions and metadata                        |
| Clay       | `clay`       | `#B74928` | Occasional editorial symbols and details     |
| Deep Cedar | `cedar-800`  | `#024326` | Impact sections                              |
| Forest     | `cedar-950`  | `#011E11` | Footer                                       |

The existing Cedar ramp and Ember tokens remain available for older content, but Seedling and Clay define new accents.
Most of a layout is Paper or deep green. Don’t sprinkle every accent into every component.

Verified, rounded contrast ratios: Cedar on Paper **7.9:1**, Ink on Seedling **14.2:1**, white on Cedar **8.7:1**.
Normal text needs 4.5:1; large text and meaningful UI need 3:1. Seedling is not text on Paper.
Never communicate status with colour alone.

## Typography

All fonts are self-hosted. Anton 400 carries short, uppercase headlines; Inter 400–600 carries reading and navigation.
Noto Sans Bengali 400/600 is the Bangla fallback; use `lang="bn"` for Bengali content.

| Role            | Class              | Scale    | Notes                      |
| --------------- | ------------------ | -------- | -------------------------- |
| Homepage hero   | `.hero-title`      | 56–116px | Anton, 1.06 leading        |
| General display | `.t-display`       | 44–120px | Anton; very short lines    |
| Page title      | `.t-h1`            | 40–84px  | Anton                      |
| Section title   | `.t-h2`            | 40–72px  | Anton, 1.04 leading        |
| Statement       | `.statement-title` | 30–44px  | Inter 500, sentence case   |
| Card title      | `.t-h3`            | 20–24px  | Inter 600                  |
| Intro           | `.t-lead`          | 17–21px  | Inter 400                  |
| Field label     | `.field-label`     | 11px     | Uppercase, 0.13em tracking |

Body copy uses 16–18px, 1.6–1.8 leading, and a comfortable measure (up to 68ch for articles).
Don’t set paragraphs in Anton. Don’t squeeze text to make a grid fit; change the grid.

## Layout and surfaces

- 4px spacing rhythm. `.shell` is at most 88rem, with 20–72px fluid gutters.
- `.section` uses 64–120px vertical padding. Fine 1px rules give structure.
- Numbered labels add an editorial rhythm. Asymmetric desktop grids return to a clear mobile reading order.
- Solid Paper, white, and deep Cedar surfaces. Typically 4–8px corners, 6px buttons, 8px cards.
- One expressive corner on the homepage photo and one Seedling stamp are deliberate exceptions, not a motif to repeat everywhere.
- No gradient fog, floating glass panels, decorative parallax, or heavy shadows.
- `.glass`, `.glass-dark`, and `GlassCard` are legacy names for **solid** surfaces, retained for existing page imports.

Breakpoints: 400, 640, 768, 1024, 1280, 1536, and 1920px. Type is fluid; breakpoints change composition.

## Components and interaction

The fixed Paper header stays available; active links use a fine underline. The mobile menu is a native modal dialog
with browser focus containment, Escape handling, a visible close button, scroll locking, and automatic closing on desktop resize.

Use `.btn-primary` for the next step, `.btn-glass` for a bordered secondary action, and `.text-link` for a quiet route onward.
Primary buttons are at least 50px high (44px in the header). Copy-colour controls announce success or a manual-copy fallback.
Keep existing volunteer forms, contact details, news URLs, gallery controls, financial reports, and social channels working.

Motion should be a short fade or small shift. Content remains readable without JavaScript.
Respect `prefers-reduced-motion`: no animated entrances or scrolling for visitors who opt out.

## Photography

Use real photographs from Cedar’s work: listening, planning, collecting, teaching, and working alongside communities.
Keep skin tones natural. Avoid stock-purpose imagery, pity-led framing, text over faces, and misleading crops.
Confirm consent and appropriate permission before publishing, especially for children.
Write meaningful alt text; purely decorative images use empty alt text. Optimised WebP files live in `public/images/`.

## Voice and trust

Warm, direct, specific. A youth movement, not a corporate impact deck.

| Say                                                           | Avoid                                                       |
| ------------------------------------------------------------- | ----------------------------------------------------------- |
| “There’s a place for you here.”                               | Guilt or manufactured urgency                               |
| “Volunteers collected winter clothes for families in Karail.” | “Saving the helpless.”                                      |
| Names, places, dates, and concrete actions                    | Jargon and unsupported superlatives                         |
| Clear registration status and financial reports               | Implying legal status or tax deductibility we cannot verify |

Separate targets from outcomes. Date project updates and verify new impact numbers before publishing them.
The homepage uses existing published figures, not invented donations, fabricated testimonials, or a new claim of independent verification.

## Accessibility

Target WCAG 2.2 AA; this is a design target, not a certification. Use one h1, semantic landmarks, a skip link,
visible focus rings, descriptive links, at least 44px interactive targets, labels, inline errors, and live status messages.
Check 320px layouts, keyboard navigation, 200% zoom, reduced motion, and contrast. External links opening a new tab should say so accessibly.
