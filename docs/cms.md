# Editing the site (content manager)

The site has a WordPress-style editor at **`/admin/`** (Decap CMS, open source, free).
Everything you change there is saved as a file in this GitHub repo, so every edit has a history and can be undone.

## What you can edit

| In the admin | What it controls | Stored in |
| --- | --- | --- |
| **Articles** | News, campaign diaries and stories, with cover photo, gallery, category, search description and a rich-text editor (headings, lists, links, quotes, images) | `content/posts/*.md` |
| **Pages** | New pages built from sections: text, photo, gallery, call-to-action button, form, YouTube video, team list | `content/pages/*.md` |
| **Forms** | Forms with any questions (short/long text, email, phone, number, date, link, dropdown, tick box). Add one to any page with a *Form* section | `content/forms/*.json` |
| **Team** | Teams and members: add, remove, reorder, create new teams (e.g. campus ambassadors, ML Bangladesh) | `content/team.json` |
| **Settings → Announcement bar** | A site-wide notice with a link, switched on or off | `content/settings/announcement.json` |
| **Media** | Uploaded photos and files | `public/uploads/` |

Tick **Hide from the site** to keep an article or page as a draft.
Programs (Ushnota, CSEdWeek, ML Bangladesh) and the homepage are still edited in code for now.

## Editing on your own computer (works today)

```bash
npm install
npm run cms      # terminal 1: local content server
npm run dev      # terminal 2: the site
```

Open http://localhost:3000/admin/ and click **Login**. No GitHub sign-in is needed: changes are written straight into your local copy. Commit and push them as usual.

## Turning on /admin/ for the live site

Two things are needed. Both are one-time.

1. **Hosting that rebuilds on every change.** The site is static, so it must be rebuilt after each edit. Connect the repo to
   Cloudflare Pages, Netlify or Vercel (build command `npm run build`, output folder `out`). Each Publish in the admin then
   goes live in about a minute.
2. **A GitHub sign-in for editors.** Decap uses GitHub accounts, so each editor needs a GitHub account with write access to the repo.
   - *On Netlify:* create a GitHub OAuth app (Settings → Developer settings → OAuth Apps, callback `https://api.netlify.com/auth/done`),
     then add its ID and secret in Netlify → Site configuration → Access & security → OAuth. Nothing else to change.
   - *On Cloudflare or Vercel:* deploy a small OAuth helper (for example `sveltia-cms-auth` on Cloudflare Workers), then set `base_url`
     in `public/admin/config.yml` to its address.

With `publish_mode: editorial_workflow`, the live admin gets a **Workflow** board: Draft → In review → Ready. Each draft is a
GitHub pull request, so someone can review an article before it goes live.

## Where form submissions go

Each form has a *Where submissions go* field. Paste a form endpoint there, for example a free Formspree form or a Google Apps Script
that writes to a Google Sheet. If it's left empty, the form opens an email draft to info@cedar-initiative.org.
A proper inbox for applications (with volunteer records and certificates) is Phase 2 in `docs/cedar-strategy.md`.

## Rules the editor enforces

- Web addresses: lowercase letters, numbers and dashes. Don't reuse a built-in address (about-us, our-work, ml-bangladesh, our-team,
  outreach, contact, give, volunteer, partner, brand) or another article's.
- Photos: landscape covers at least 1600px wide, team photos square at least 600px, files under 500 KB. Always fill in the description.
