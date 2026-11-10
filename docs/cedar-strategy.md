# Cedar Initiative: assessment, self-critique and plan

> Imported from the Devin session (Nov 2026). Measurements were taken on the merged site (commit b6b80f2) at 13 viewports across 3 routes.

## 1. What's been asked for

| Area | What you want | Status |
| --- | --- | --- |
| Public site | Clean, professional, trustworthy nonprofit design that feels like an experience | Built once, needs a redesign |
| Consistency | One design system that every page follows | Tokens exist; the system itself needs simplifying |
| Motion | Animation that tells a story, not basic fades | Not started |
| Wording | Natural, human writing; strong SEO | Audited below; no rewrites applied yet |
| Devices | Flip phones, dual-screen phones, phones, tablets, laptops, big monitors | Measured below; fixes not applied yet |
| Backend | Blogs, announcements, volunteers, team and ambassador profiles, roles, certificates with credentials, LinkedIn, uploads, offer and recommendation letters, MOUs and partnerships, all managed from an admin area | Designed; not built |

## 2. Self-critique of the current site

### Problems that hurt trust
- **"Support us" doesn't support anything.** It opens the contact form with subject "Donation" (`components/Header.tsx`). Donors hit a dead end.
- **Stale "live" badge.** Homepage says "Ushnota Abhijan · Winter campaign · live", hardcoded in `app/page.tsx`. That campaign ran in November 2025.
- **Weak numbers presented as headline impact.** "7 trees planted" next to "4,250 people impacted" in the same display style. No period, method or evidence link on any number.
- **Doesn't say what Cedar does until far down.** H1 is a slogan ("Be the force for good") then "Empowering Communities for a Sustainable Future". The concrete story (winter clothes for Karail slum families, CS education week in Rangpur) is buried.
- **Legal status isn't stated plainly.** An unregistered org asking for money must say so, and how money is handled (fiscal-sponsor search, financial reports).

### Design and UX problems
- Too much decoration: aurora gradients, glass cards, floating badges, grain, rotating icons, tilt-on-hover. Looks like a template. Glass costs GPU on low-end Android.
- Homepage too long: 23.8 screens at 320px; 40.5 screens on a 300×340 cover screen. Repeated sections (wings on Home and About, SDG strip, press, CTA).
- Main button hidden on common screens: at 1280×720 the 108px headline pushes buttons to y=798. Same in phone landscape (780×360) and dual-screen spread (1114×705).
- Big screens waste width: content stops at 1280px; on 3440px ultrawide ~63% is empty.
- Contact body text ~83–89 characters per line from tablet up (limit ~75).
- Floating chat button covers content on very small screens.
- Footer links are 18px tall tap targets (pass WCAG 2.5.8 only via spacing; below 44px comfort size).

### Wording and SEO problems
- AI-sounding vocabulary: "empower" variants ×20 across `lib/` and posts, "sustainable progress" ×4, "journey" ×4, "foster" ×6.
- Post titles don't match searches. Two start with "Empowering…". Seven near-identical "Ushnota Abhijan 2025 – Day 0X: …" titles; one is just "Ushnota Abhijan 2025 | Day-06".
- Thin metadata: descriptions repeat excerpts; no Article, Event or BreadcrumbList schema; one shared OG image.

### Worth keeping
Cedar green and the logo, self-hosted fonts and Bengali support, existing URLs, accessible menu/gallery/form behaviour, reduced-motion support, zero horizontal scroll at all 13 sizes tested.

## 3. What each kind of visitor needs

| Visitor | Question | Needs to see first | Missing today |
| --- | --- | --- | --- |
| Possible donor (BD or abroad) | Is this real? Where does the money go? | Concrete results, financial reports, legal status, a way to give | A working way to give; status is buried |
| Student volunteer | What would I do? Will I get a certificate? | Roles, time commitment, past volunteer work, verifiable certificates | Only a Google Form link |
| Campus ambassador | What's the role, what do I get? | Program, responsibilities, benefits | Program doesn't exist on site |
| Partner (NGO, school, company) | Can they deliver? Who's responsible? | Leadership, track record, contact person, how an MOU works | A partner page |
| Journalist / researcher | What happened, when, who to quote? | Dated facts, press kit, photos, contact | A press kit |
| Fiscal sponsor / funder | Governance, finances, plans | Board and advisers, policies, reports, roadmap | Policies, governance page |
| Credential verifier | Is this certificate genuine? | Verify page: Valid / Expired / Revoked | Doesn't exist |
| Low-end Android on mobile data | Will it load? | Fast first screen, light images | Glass effects and long pages are heavy |
| Screen-reader / keyboard user | Can I use it? | Order, labels, focus | Mostly fine |

**Direction:** the homepage answers, in order: what Cedar does → proof it works → how to help (Give, Volunteer, Partner as three separate paths) → why it can be trusted (reports, status, people). Everything else moves to its own page.

## 4. Changes per screen class

| Screen class (tested) | Now | Should do |
| --- | --- | --- |
| Flip cover screen (300×340) | Header, chip and 2 lines of H1 fill the screen; chat button covers text; 40 screens of scroll | Very-short-screen mode: hide chip, smaller H1, chat button in footer area, first button on first screen |
| Narrow phone (320×568) | First button at y=641 | Short H1, one sentence, buttons above fold, image after buttons |
| Common phone (360×780) | Buttons visible | Keep; cut homepage from 17 screens to ~8 |
| Unfolded flip, tall (412×915) | Fine, lots of empty space at top | Full-screen photo-story opening |
| Phone landscape (780×360) | 66px H1, buttons hidden | `max-height: 500px` query: compact hero, no full-height sections, no scroll-pinned scenes |
| Dual-screen, one screen (540×720) | Fine | Same as tablet portrait |
| Dual-screen spread (1114×705) | Layout runs across hinge; 95px H1 crosses seam | `@media (horizontal-viewport-segments: 2)` + `env(viewport-segment-*)`: story left, photo/actions right; `vertical-viewport-segments: 2` for stacked |
| Tablet (768×1024) | Fine; Contact lines ~88 chars | Two-column layouts, text max ~68ch |
| Short laptop (1280×720) | 108px H1, buttons below fold | Scale H1 by `min(vw, vh)`; H1 under ~40% of screen height |
| Laptop (1440×900) | Good | Keep |
| 1080p (1920×1080) | Good, growing margins | Wider grid (1440px max) |
| QHD / ultrawide (2560–3440×1440) | Capped at 1280px, ~63% empty | Text stays readable width; photos, galleries, story scenes full-bleed up to ~1920px |
| Touch vs mouse | Hover everywhere | Hover only on `(hover: hover) and (pointer: fine)`; 44px targets on `(pointer: coarse)` |
| Low data / low power | All glass and aurora always render | `prefers-reduced-data` + Save-Data; flat surfaces on small screens |
| Reduced motion | Supported | Every animated scene gets a still version that tells the story |

Components should use container queries so a card looks right in a 3-column grid or on a dual-screen half.

## 5. Visual direction
- From glassmorphism showcase → **documentary editorial**: real photos, confident type, white space, one accent colour.
- Cedar green; Anton only for short display words; Inter for everything else; Noto Sans Bengali for Bangla.
- Glass only where it does a job (sticky header, modals). Remove auroras and grain from content.
- Every impact number sits next to its period, method and source link.
- Photos lead: every program page opens with a field photo and a caption with place and date.

## 6. Motion concept: "From one act to a movement"

| Scene | Where | What happens | Reduced-motion |
| --- | --- | --- | --- |
| 1. Opening | Home hero | Headline appears word by word in <0.8s; field photo comes into focus | Still photo, headline in place |
| 2. One to many | Home, after hero | On scroll, one dot becomes dozens forming a Dhaka/Rangpur map outline labelled with real program locations | Static labelled map |
| 3. The evidence | Impact section | Numbers count up only once period and source are on screen; each links to a report | Plain numbers |
| 4. Field diary | Ushnota Abhijan page | Horizontal day-by-day timeline (Day 1–6, then fire response) with parallax photos | Vertical list |
| 5. Page changes | All routes | View Transitions between list and detail pages | Instant change |
| 6. Credential moment | Verify page | Seal draws itself, then status appears | Status immediately |

Rules: CSS scroll-driven animations behind `@supports (animation-timeline: view())` first; small JS library only for scenes 2 and 4. Animate only transform, opacity, clip-path. No scroll-pinning on `max-height: 600px` or coarse-pointer landscape. Animation JS ≤ 25 KB gzip. Usable without JS. Nothing flashes more than 3×/second.

## 7. Wording and SEO

Voice rules: specific over general (place, date, number, name). Short sentences. "We", not "the organization". No "empower", "journey", "foster", "beacon". Show the work.

| Where | Now | Suggested |
| --- | --- | --- |
| Home H1 | Be the force for good | Youth-led relief and education across Bangladesh (keep "Be the force for good" as eyebrow) |
| Home lead | Empowering Communities for a Sustainable Future. We are a youth-led movement… | We're student volunteers in Bangladesh. Last winter we brought warm clothes to families in Dhaka's Karail slum, and we ran a computer science week for students in Rangpur. |
| Home title tag | Cedar Initiative — Be the Force for Good | Cedar Initiative: youth-led nonprofit in Bangladesh |
| Post | Ushnota Abhijan 2025 \| Day-06 | Winter clothes drive, day 6: what we delivered in [place] |
| Post | Empowering the Future: Cedar Initiative Hosts CS Ed Week 2025 in Rangpur | CSEdWeek 2025 in Rangpur: what students built in one week |
| Post | Ushnota Abhijan 2025 — Immediate Humanitarian Response to the Karail Slum Fire | Karail slum fire: how our volunteers responded |

Technical SEO: unique 140–160 char meta description per page; per-page OG images; Article schema for posts, Event for programs, BreadcrumbList everywhere; group the seven campaign-day posts under one campaign page; hreflang only once a real Bangla version exists; `lastmod` in sitemap.

Never invent metrics, partners, dates or legal status. Rewrites needing missing facts get marked for the owner to fill in.

## 8. Backend and admin portal

- **Stack:** Next.js (static export → hybrid), Postgres + Auth + Storage on Supabase (or equivalent), row-level security, background jobs for PDFs and email.
- **Signatures:** Documenso (open source, self-hostable) or DocuSign for MOUs/partnerships. Don't build signatures in-house.
- **Credentials:** unguessable ID per certificate, public `/verify/{id}` (Valid / Expired / Revoked), QR code, branded PDF, Open Badges 3.0 / W3C VC 2.0 record, prefilled LinkedIn "Add to Profile" link.

| Phase | What you get |
| --- | --- |
| 1. Public redesign | Sections 2–7, on the current static site |
| 2. Publishing and people | Admin login with 2FA; posts, announcements, programs, reports; volunteer applications (replacing Google Form); team, adviser, ambassador and campus-ambassador profiles; roles and permissions |
| 3. Credentials | Certificate templates, bulk issue to a program roster, verify page, QR, LinkedIn link, revocation, upload of past certificates |
| 4. Documents | Offer and recommendation letters from templates with approval and serial numbers; MOUs via e-signature provider |
| 5. Governance | Audit log, backups, data-retention and consent rules, transparency page, policy library |

Roles: Owner, Admin, Communications, Program lead, Volunteer manager, Credential issuer, Authorized signer, Finance, Volunteer/member.

Legal note: Bangladesh's ICT Act 2006 recognizes electronic signatures; check bindingness of MOUs/offer letters with a Bangladeshi lawyer.

## 9. Open decisions
1. **Donations while unregistered:** bKash/Nagad to a named account with clear status wording / "Contact us to give" with honest wording until a fiscal sponsor / hide giving and focus on Volunteer and Partner.
2. **Backend hosting:** Supabase (managed, free tier) OK, or fully self-hosted?
3. **E-signatures:** Documenso or DocuSign?
4. **Verify page public fields:** name, credential title, date only (recommended), or more?
5. **Signers:** which roles can sign offer letters, recommendation letters, MOUs?

## 10. Next step
Phase 1 on a new branch: cleaner homepage structure, fixes for every screen class, motion scenes 1, 3 and 5, rewritten copy and titles, fixed giving path (after decision 1), per-page metadata and schema. Re-test the 13 viewports, then PR. Phase 2 starts after decisions 2–5.

Sources cited by Devin: NN/g nonprofit website study (60 sites); W3C WCAG 2.2 (2.3.3, 2.5.8); Chrome docs on scroll-driven animations; MDN / web.dev on viewport segments; W3C VC Data Model 2.0; 1EdTech Open Badges 3.0; LinkedIn Add to Profile; Bangladesh ICT Act 2006.
