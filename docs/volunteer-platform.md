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

Every document gets an unguessable ID (e.g. `CI-2026-7F3K9QXM`), a QR code, a printable branded layout ("Save as PDF"),
and a LinkedIn "Add to profile" link that fills in the name, issuer, date, credential ID and verify URL.
Removal letters are never publicly verifiable.

## Demo mode

Until the backend is connected, the platform runs entirely in the visitor's browser with sample data and a yellow
"Demo mode" banner. Use it to try every screen; nothing is sent anywhere.

## Going live (Supabase, free tier)

1. Create a project at supabase.com (region: Singapore is closest to Bangladesh).
2. In the SQL editor, run `supabase/migrations/0001_volunteer_platform.sql`.
3. Make yourself admin: sign up on the site, then run `update profiles set role = 'admin' where email = 'you@…';` in the SQL editor.
4. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` on the host and rebuild. The demo banner disappears.
5. Email: create a Resend account, verify the cedar-initiative.org domain, then
   `supabase functions deploy send-email` and `supabase secrets set RESEND_API_KEY=… MAIL_FROM="Cedar Initiative <team@cedar-initiative.org>"`.
6. Auth → URL configuration: add `https://cedar-initiative.org/account/` as a redirect URL.

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
