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

Accounts use Firebase Authentication (email and password, sign-in links, password reset, email verification).
Every document gets an unguessable ID (e.g. `CI-2026-7F3K9QXM`), a QR code, a printable branded layout ("Save as PDF"),
and a LinkedIn "Add to profile" link that fills in the name, issuer, date, credential ID and verify URL.
Removal letters are never publicly verifiable.

## Demo mode

Until the backend is connected, the platform runs entirely in the visitor's browser with sample data and a yellow
"Demo mode" banner. Use it to try every screen; nothing is sent anywhere.

## Going live on Firebase (free Spark plan is enough)

Do these once in the [Firebase console](https://console.firebase.google.com/). Leave the ML Bangladesh and AI hackathon projects alone.

1. **Project.** Use an empty project (or *Add project*) and rename it: Project settings → General → *Project name* → `Cedar Initiative`.
   Note the *Project ID* (e.g. `cedar-initiative`) and put it in `.firebaserc`.
2. **Web app.** Project settings → General → *Your apps* → *Add app* → Web. Copy `apiKey`, `authDomain`, `projectId` and `appId`
   into the host's environment as `NEXT_PUBLIC_FIREBASE_API_KEY`, `..._AUTH_DOMAIN`, `..._PROJECT_ID`, `..._APP_ID`, then rebuild.
   These values are public by design; the security rules protect the data. The demo banner disappears.
3. **Sign-in.** Build → Authentication → *Get started* → Sign-in method → enable **Email/Password** and **Email link (passwordless sign-in)**.
   Settings → *Authorised domains* → add `cedar-initiative.org`. Templates → set the sender name to *Cedar Initiative*
   (this is the email for verification, sign-in links and password resets).
4. **Database.** Build → Firestore Database → *Create database* (region `asia-south1`, Mumbai, is closest), *production mode*.
   Rules tab → paste the contents of `firestore.rules` → *Publish*. (Or `npx firebase-tools deploy --only firestore:rules`.)
5. **First admin.** Sign up on the site. In Firestore → `users` → your document, change `role` from `volunteer` to `admin`.
   From then on, admins change other people's roles in `/staff/` → Volunteers.
6. **Emails from the staff area (optional).** Messages are always saved to the volunteer's account. To also email them, upgrade to the
   pay-as-you-go plan and install the *Trigger Email from Firestore* extension with collection `mail` (it reads what the staff area queues).

## Security

All access rules are enforced by Firestore security rules, not by the website. `firebase/tests/rules.test.mjs` checks 41 cases
on the Firestore emulator: volunteers can't change their role, apply as someone else, approve their own hours, issue documents
or fake their public hours; the public can verify a document only by its exact ID and can never list them; removal letters are
never publicly verifiable.

```bash
npm i --no-save @firebase/rules-unit-testing@5 firebase-tools@15.34.1
npx firebase emulators:exec --only firestore --project cedar-test "node firebase/tests/rules.test.mjs"
```

To try the whole site against local Firebase: run `npx firebase emulators:start --only auth,firestore --project cedar-test`,
build with `NEXT_PUBLIC_FIREBASE_EMULATOR=1` plus any placeholder config values, and serve `out/`.

## Before relying on letters legally

Bangladesh's ICT Act 2006 recognises electronic signatures, but check with a lawyer whether appointment and removal
letters issued this way bind both sides. Agree who may sign which documents (the *issuer* role) before going live.
