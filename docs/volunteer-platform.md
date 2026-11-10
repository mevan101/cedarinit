# Volunteer platform

Accounts, in-site applications, hours, certificates and letters, verification and messages.

| Who | Where | What they can do |
| --- | --- | --- |
| Anyone | `/opportunities/` | Browse open roles (edited in the CMS: *Open roles*) |
| Anyone | `/verify/` | Check a certificate or letter by ID or QR code: Valid, Revoked or Expired |
| Anyone | `/profile/?u=<handle>` | See a volunteer's public profile (only if they switch it on) |
| Volunteer | `/join/`, `/account/` | Create an account, edit profile and photo, apply in-site, log hours, download certificates and letters, add them to LinkedIn, read messages |
| Manager | `/staff/` | Review applications (status, notes, email the applicant), approve hours, record hours, export applications and volunteers to a spreadsheet |
| Issuer | `/staff/` | Everything a manager can do, plus issue and revoke certificates, appointment, offer, recommendation, experience and removal letters |
| Admin | `/staff/` | Everything, plus change people's roles |

Accounts use Supabase Auth (email and password, sign-in links, password reset).
Every document gets an unguessable ID (e.g. `CI-2026-7F3K9QXM`), a QR code, a printable branded layout ("Save as PDF"),
and a LinkedIn "Add to profile" link that fills in the name, issuer, date, credential ID and verify URL.
Removal letters are never publicly verifiable.

## Demo mode

Until the backend is connected, the platform runs entirely in the visitor's browser with sample data and a yellow
"Demo mode" banner. Use it to try every screen; nothing is sent anywhere.

## What is live (9 Nov 2026)

The Supabase project **Cedar** (`jczodfunfnbixlmdhgqr`, Tokyo) is set up: migrations 0001 to 0004 are applied, the
website content (settings, team, sponsors) is loaded, and the `send-email` and `publish-site` functions are deployed.
The site's public settings are in `.env.production` (the URL and the publishable key, both public by design).
Never put the `service_role` or `secret` key in the site.

## The team dashboard (/staff/)

| Role | Sees |
| --- | --- |
| volunteer | Own profile, applications, hours, certificates |
| editor | **Website** (stories, pages, team, sponsors, settings and links) and **Team notes**. No volunteer data. |
| manager | Applications, volunteers, hours, **Inbox** (contact form and site forms), Team notes (can write) |
| issuer | Manager rights plus certificates and letters |
| admin | Everything, including roles and the **Activity** log of every change |

Stories, pages and the announcement bar go live as soon as they are saved. Team, sponsors, contact details and links
are read at build time (`scripts/pull-site-data.mjs`), so they appear after **Publish the website**. Stories that
still live in `content/posts` can be edited in the dashboard: saving makes a copy in Supabase that replaces the file.

## Remaining setup (about 15 minutes, in the Cloudflare and Supabase dashboards)

1. **Connect the repo to Cloudflare.** Workers & Pages → Create → Import a repository → `mevan101/cedarinit`.
   Build command `npm run build`, deploy command `npx wrangler deploy`, production branch `main`.
   Every push then deploys, and the settings in `wrangler.jsonc` and `public/_headers` apply.
2. **Turn on the Publish button.** In that Worker: Settings → Builds → Deploy Hooks → create one for `main`, copy the
   URL, then in Supabase: Edge Functions → Secrets → add `CLOUDFLARE_DEPLOY_HOOK` with that URL.
3. **Domain.** Worker → Settings → Domains → add `cedar-initiative.org` (and `www`).
4. **Auth URLs.** Supabase → Authentication → URL configuration: Site URL `https://cedar-initiative.org`; redirect URLs
   `https://cedar-initiative.org/account/` and the `*.workers.dev` address.
5. **Email.** Supabase's built-in email sends only a few messages an hour. Add an SMTP sender under Authentication →
   Emails (Resend's free tier works after verifying `cedar-initiative.org`). For staff emails to volunteers, add the
   `RESEND_API_KEY` and `MAIL_FROM` secrets; without them messages are still saved to the volunteer's account.
6. **First admin.** Sign up on the site, then in the SQL editor:
   `update profiles set role = 'admin' where email = 'you@example.org';`

## Security

All access rules are enforced by Postgres row-level security, not by the website. Helper functions live in a
`private` schema the API doesn't expose; trigger functions can't be called over the API. Markdown written in the
dashboard is rendered without raw HTML and with only web, mail and phone links. Uploads are limited to images and
PDFs under 8 MB (SVG is refused because it can carry scripts). The contact form refuses more than five messages per
address in ten minutes. `public/_headers` sets a strict Content Security Policy and other security headers.

The RLS tests run on plain Postgres:

```bash
createdb cedar_test
psql -d cedar_test -f supabase/tests/00_supabase_stub.sql -f supabase/migrations/0001_volunteer_platform.sql
psql -d cedar_test -f supabase/tests/01_rls_test.sql
psql -d cedar_test -f supabase/migrations/0002_editor_role.sql -f supabase/migrations/0003_site_editor_internal.sql
psql -d cedar_test -f supabase/tests/02_site_editor_test.sql
```

`npm audit` reports advisories in Next.js 14 for its server (image optimiser, server components, rewrites). This site
is a static export with no Next.js server in production, so they don't apply; upgrade Next.js when convenient.

## Before relying on letters legally

Bangladesh's ICT Act 2006 recognises electronic signatures, but check with a lawyer whether appointment and removal
letters issued this way bind both sides. Agree who may sign which documents (the *issuer* role) before going live.
