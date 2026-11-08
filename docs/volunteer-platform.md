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

## Going live: Supabase + Cloudflare

The Supabase project **Cedar** (`jczodfunfnbixlmdhgqr`, Tokyo) already exists and is empty. From a terminal on your computer, in this repo:

```bash
npx supabase@latest login
```

```bash
npx supabase@latest link --project-ref jczodfunfnbixlmdhgqr
```

```bash
npx supabase@latest db push
```

That applies `supabase/migrations/0001_volunteer_platform.sql` (tables, row-level security, the verify function).
Then in the Supabase dashboard:

1. **Authentication → URL configuration:** Site URL `https://cedar-initiative.org`; add redirect URLs `https://cedar-initiative.org/account/` and your `*.workers.dev` address.
2. **Authentication → Emails → SMTP:** Supabase's built-in email only reaches your own team. For sign-up confirmations and password-reset emails to reach volunteers, add an SMTP sender (Resend's free tier works: verify `cedar-initiative.org`, then paste its SMTP details).
3. **First admin:** sign up on the site, then in SQL editor run `update profiles set role = 'admin' where email = 'you@…';`.

Deploy the site to Cloudflare (Workers static assets, settings in `wrangler.jsonc`):

```bash
npx wrangler@4.152.0 login
```

```bash
NEXT_PUBLIC_SUPABASE_URL=https://jczodfunfnbixlmdhgqr.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key from Supabase > Project settings > API> npm run build
```

```bash
npx wrangler@4.152.0 deploy
```

The site is then live at `cedar-initiative.<your-subdomain>.workers.dev`. Point `cedar-initiative.org` at it under Workers → cedar-initiative → Settings → Domains.
The anon key is public by design; never put the `service_role` or `secret` key in the site.

Optional email from the staff area: `npx supabase@latest functions deploy send-email`, then
`npx supabase@latest secrets set RESEND_API_KEY=… MAIL_FROM="Cedar Initiative <team@cedar-initiative.org>"`.
Without it, staff messages are still saved to the volunteer's account.

## Security

All access rules are enforced by Postgres row-level security, not by the website. `supabase/tests/` runs them on plain
Postgres: volunteers can't change their role, apply as someone else, approve their own hours or issue documents; the
public can only verify, and only through `verify_document()`.

```bash
createdb cedar_test
psql -d cedar_test -f supabase/tests/00_supabase_stub.sql -f supabase/migrations/0001_volunteer_platform.sql -f supabase/tests/01_rls_test.sql
```

## Before relying on letters legally

Bangladesh's ICT Act 2006 recognises electronic signatures, but check with a lawyer whether appointment and removal
letters issued this way bind both sides. Agree who may sign which documents (the *issuer* role) before going live.
