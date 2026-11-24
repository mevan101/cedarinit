# Cedar Initiative website: notes for AI agents

Read this first. It applies to every agent working here (Claude, Devin, Copilot, Cursor and others).

## The project

- Website for Cedar Initiative, a youth-led volunteer group in Bangladesh. ML Bangladesh (mlbangladesh.org) is its STEM program.
- Next.js 14 App Router, **static export** (`output: 'export'`, built to `out/`), Tailwind 3.4, TypeScript.
- Backend: Supabase project `jczodfunfnbixlmdhgqr` (row-level security in `supabase/migrations`, tests in `supabase/tests`).
- Hosting: Cloudflare Workers static assets (`wrangler.jsonc`, `public/_headers`, `public/_redirects`).
- Team dashboard at `/staff/` edits the site through Supabase; `scripts/pull-site-data.mjs` copies that content into `content/live/*.json` before each build.

## Commands

```bash
npm ci
npx tsc --noEmit
npm run build        # prebuild pulls dashboard content; works offline with the saved snapshot
npx serve@14 out     # or: cd out && python3 -m http.server 4330
```

## How agents collaborate here

- Active branch: `claude/laughing-clarke-y3dcy8`. Do not commit to it directly unless you are the agent that owns it.
- Work on your own branch from it (`devin/<topic>`, `agent/<topic>`) and open a pull request **into that branch**, not into `main`. Never merge your own pull request.
- One focused change per commit, with a message that says what and why.
- Never deploy, and never change: Supabase data or settings, Cloudflare settings, secrets, `.env*`, `supabase/migrations/`, `wrangler.jsonc`, `public/_headers`. Ask in the pull request instead.
- Do not rewrite the wording of news articles in `content/posts/`. They are Cedar's original text.

## Before you change UI, animation or copy

Load the skills in `.agents/skills/`:

- `cedar-design-engineering`: brand, layout, motion and writing rules for this site. Required for any UI work.
- `cedar-verify`: how to prove a change works (build, accessibility scan, narrow screens, reduced motion, screenshots).

Reference skills these are based on (install them for deeper guidance; do not commit them):

```bash
npx skills add emilkowalski/skills --skill emil-design-eng -y
npx skills add jakubkrehel/skills -y
npx skills add vercel-labs/agent-skills --skill web-design-guidelines --skill vercel-react-best-practices -y
```
