# Cedar Initiative — website

The website for [Cedar Initiative](https://cedar-initiative.org), a youth-led, volunteer-based nonprofit in Bangladesh.

Next.js 14 (App Router, static export) · TypeScript · Tailwind CSS. No server or database. `npm run build` writes a static site to `out/` that any host can serve (Hostinger, Netlify, Vercel, GitHub Pages, Cloudflare Pages).

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm run build      # static site in ./out
npm start          # preview ./out
```

## Structure

| Path | What |
| --- | --- |
| `app/` | Routes. URLs match the original WordPress site (`/about-us/`, `/our-work/`, `/<post-slug>/`, …) |
| `components/` | Shared UI: `Header`, `Footer`, `GlassCard`, `Reveal`, `Gallery`, `ContactForm`, … |
| `lib/site.ts`, `lib/team.ts`, `lib/programs.ts` | Editable content: contact details, team, programs, impact numbers |
| `content/posts.json` | News posts migrated from WordPress |
| `public/images/` | Optimised WebP images (`lib/image-manifest.json` holds dimensions) |
| `public/reports/` | Financial report PDFs |
| `public/brand/` | Logo files (SVG/PNG) |
| `BRAND.md` · `/brand` | Brand guide and design system |

## Content updates

- **News post:** add an entry to `content/posts.json` (`slug`, `title`, `date`, `category`, `cover`, `excerpt`, `gallery`, `html`) and its images to `public/images/news/`. Then add each image's size to `lib/image-manifest.json`, or regenerate the manifest with `scripts/optimize-images.mjs`.
- **Team member:** edit `lib/team.ts` and add a portrait to `public/images/team/`.
- **Impact numbers:** edit `impact` in `lib/site.ts`.

## Contact form

The form posts the original Contact Form 7 fields (`your-name`, `your-email`, `your-subject`, `your-message`) to the existing CF7 REST endpoint. That endpoint saves submissions to Google Sheets. To point the form somewhere else, set `NEXT_PUBLIC_CONTACT_ENDPOINT` (see `.env.example`). The endpoint must allow cross-origin `POST` from the site's domain. If the endpoint can't be reached, the form gives the visitor a pre-filled email instead.
