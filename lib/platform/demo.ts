import type { Application, Doc, HourEntry, Message, Platform, Profile, Role } from './types';

/**
 * Demo backend: same behaviour as the live one, but everything is stored in this browser (localStorage).
 * Used for previews and while Supabase isn't connected. Nothing leaves the device.
 */
const KEY = 'cedar-demo-v1';
type DB = { me: string | null; profiles: Profile[]; applications: Application[]; hours: HourEntry[]; documents: Doc[]; messages: Message[] };

const now = () => new Date().toISOString();
const rid = () => Math.random().toString(36).slice(2, 10);
const docId = () => `CI-${new Date().getFullYear()}-${Array.from({ length: 8 }, () => '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'[Math.floor(Math.random() * 32)]).join('')}`;

function seed(): DB {
  const vol: Profile = { id: 'demo-volunteer', email: 'rahim.sample@example.org', full_name: 'Rahim Uddin (sample)', handle: 'rahim-sample', institution: 'Dhaka College', city: 'Dhaka', bio: 'Sample volunteer used in the demo.', linkedin: '', areas: ['Distribution', 'Logistics'], public_profile: true, role: 'volunteer', created_at: '2025-10-20T10:00:00Z' };
  const staff: Profile = { id: 'demo-staff', email: 'staff.sample@example.org', full_name: 'Staff member (sample)', handle: null, areas: [], public_profile: false, role: 'admin', created_at: '2025-09-01T10:00:00Z' };
  return {
    me: null,
    profiles: [vol, staff],
    applications: [
      { id: 'app1', user_id: vol.id, opportunity: 'relief-volunteer', opportunity_title: 'Relief volunteer', answers: { why: 'I want to help families in my city stay warm.', availability: 'Weekends' }, status: 'accepted', staff_notes: 'Great at the Day 4 drive.', created_at: '2025-10-25T09:00:00Z', updated_at: '2025-10-28T09:00:00Z' },
    ],
    hours: [
      { id: 'h1', user_id: vol.id, program: 'Ushnota Abhijan 2025', area: 'Collection', date: '2025-11-04', hours: 5, status: 'approved', created_at: now() },
      { id: 'h2', user_id: vol.id, program: 'Ushnota Abhijan 2025', area: 'Distribution', date: '2025-11-27', hours: 7, status: 'approved', created_at: now() },
      { id: 'h3', user_id: vol.id, program: 'Ushnota Abhijan 2025', area: 'Sorting', date: '2025-11-15', hours: 3, note: 'Sorted clothes at the storehouse', status: 'pending', created_at: now() },
    ],
    documents: [
      { id: 'CI-2025-DEMO7K3Q', user_id: vol.id, recipient_name: 'Rahim Uddin (sample)', kind: 'certificate', title: 'Certificate of volunteering: Ushnota Abhijan 2025', program: 'Ushnota Abhijan 2025', hours: 12, areas: ['Collection', 'Distribution'], body: 'This certifies that Rahim Uddin (sample) volunteered with Cedar Initiative on Ushnota Abhijan 2025, contributing 12 hours in collection and distribution.\n\nWe thank them for their time and care.', issued_on: '2026-01-25', expires_on: null, signer_name: 'Sharafat Karim', signer_title: 'Co-founder, Lead of IT & Communication', status: 'valid', created_at: now() },
    ],
    messages: [],
  };
}

function load(): DB {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as DB;
  } catch {}
  const db = seed();
  save(db);
  return db;
}
const listeners = new Set<() => void>();
function save(db: DB) {
  try { localStorage.setItem(KEY, JSON.stringify(db)); } catch {}
  listeners.forEach((l) => l());
}
function tx<T>(fn: (db: DB) => T): T { const db = load(); const r = fn(db); save(db); return r; }
const meOrThrow = (db: DB) => { const p = db.profiles.find((x) => x.id === db.me); if (!p) throw new Error('Please sign in'); return p; };
const staffOrThrow = (db: DB) => { const p = meOrThrow(db); if (p.role === 'volunteer') throw new Error('Staff only'); return p; };
const withProfile = <T extends { user_id: string }>(db: DB, x: T) => ({ ...x, profile: db.profiles.find((p) => p.id === x.user_id) });

export const demoPlatform: Platform & { signInAs(kind: 'volunteer' | 'staff'): Promise<void>; reset(): void } = {
  mode: 'demo',
  async me() { const db = load(); return db.profiles.find((p) => p.id === db.me) ?? null; },
  onChange(cb) { listeners.add(cb); return () => listeners.delete(cb); },
  async signUp(email, _password, full_name) {
    tx((db) => {
      let p = db.profiles.find((x) => x.email === email);
      if (!p) { p = { id: rid(), email, full_name, areas: [], public_profile: false, role: 'volunteer', created_at: now() }; db.profiles.push(p); }
      db.me = p.id;
    });
    return { needsConfirm: false };
  },
  async signIn(email) { tx((db) => { const p = db.profiles.find((x) => x.email === email); if (!p) throw new Error('No account with that email in this demo. Create one first.'); db.me = p.id; }); },
  async sendLink(email) { return this.signIn(email, ''); },
  async signInAs(kind) { tx((db) => { db.me = kind === 'staff' ? 'demo-staff' : 'demo-volunteer'; }); },
  async signOut() { tx((db) => { db.me = null; }); },
  reset() { try { localStorage.removeItem(KEY); } catch {} listeners.forEach((l) => l()); },
  async saveProfile(patch) {
    return tx((db) => {
      const p = meOrThrow(db);
      if (patch.handle && db.profiles.some((x) => x.handle === patch.handle && x.id !== p.id)) throw new Error('That profile address is taken');
      const { role: _r, id: _i, email: _e, ...safe } = patch;
      Object.assign(p, safe);
      return { ...p };
    });
  },
  async uploadPhoto(file) {
    return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = () => rej(new Error('Could not read the photo')); r.readAsDataURL(file); });
  },
  async apply(opportunity, opportunity_title, answers) {
    tx((db) => {
      const p = meOrThrow(db);
      if (db.applications.some((a) => a.user_id === p.id && a.opportunity === opportunity && a.status !== 'withdrawn')) throw new Error('You have already applied for this role');
      db.applications.unshift({ id: rid(), user_id: p.id, opportunity, opportunity_title, answers, status: 'new', created_at: now(), updated_at: now() });
    });
  },
  async myApplications() { const db = load(); return db.applications.filter((a) => a.user_id === db.me); },
  async withdraw(id) { tx((db) => { const a = db.applications.find((x) => x.id === id && x.user_id === db.me); if (a) a.status = 'withdrawn'; }); },
  async logHours(e) { tx((db) => { db.hours.unshift({ ...e, id: rid(), user_id: meOrThrow(db).id, status: 'pending', created_at: now() }); }); },
  async myHours() { const db = load(); return db.hours.filter((h) => h.user_id === db.me).sort((a, b) => b.date.localeCompare(a.date)); },
  async myDocuments() { const db = load(); return db.documents.filter((d) => d.user_id === db.me); },
  async myMessages() { const db = load(); return db.messages.filter((m) => m.user_id === db.me); },
  async getDocument(id) { const db = load(); const me = db.profiles.find((p) => p.id === db.me); const d = db.documents.find((x) => x.id === id.toUpperCase()); return d && me && (me.role !== 'volunteer' || d.user_id === me.id) ? d : null; },
  async verify(id) {
    const d = load().documents.find((x) => x.id === id.trim().toUpperCase());
    if (!d || d.kind === 'termination') return null;
    const { user_id: _u, body: _b, revoked_reason: _r, created_at: _c, ...pub } = d;
    return { ...pub, status: d.status === 'revoked' ? 'revoked' : d.expires_on && d.expires_on < now().slice(0, 10) ? 'expired' : 'valid' };
  },
  async publicProfile(handle) {
    const db = load(); const p = db.profiles.find((x) => x.handle === handle && x.public_profile);
    if (!p) return null;
    return {
      full_name: p.full_name, handle: p.handle, photo_url: p.photo_url, institution: p.institution, city: p.city, bio: p.bio, linkedin: p.linkedin, areas: p.areas,
      approved_hours: db.hours.filter((h) => h.user_id === p.id && h.status === 'approved').reduce((a, h) => a + h.hours, 0),
      documents: db.documents.filter((d) => d.user_id === p.id && d.status === 'valid' && ['certificate', 'recommendation', 'experience'].includes(d.kind)).map(({ id, title, kind, issued_on }) => ({ id, title, kind, issued_on })),
    };
  },

  async applications() { const db = load(); staffOrThrow(db); return db.applications.map((a) => withProfile(db, a)); },
  async updateApplication(id, patch) { tx((db) => { staffOrThrow(db); const a = db.applications.find((x) => x.id === id); if (a) Object.assign(a, patch, { updated_at: now() }); }); },
  async volunteers() { const db = load(); staffOrThrow(db); return db.profiles; },
  async setRole(userId, role: Role) { tx((db) => { if (staffOrThrow(db).role !== 'admin') throw new Error('Only an admin can change roles'); const p = db.profiles.find((x) => x.id === userId); if (p) p.role = role; }); },
  async allHours() { const db = load(); staffOrThrow(db); return db.hours.map((h) => withProfile(db, h)).sort((a, b) => b.date.localeCompare(a.date)); },
  async setHoursStatus(id, status) { tx((db) => { staffOrThrow(db); const h = db.hours.find((x) => x.id === id); if (h) h.status = status; }); },
  async logHoursFor(userId, e) { tx((db) => { staffOrThrow(db); db.hours.unshift({ ...e, id: rid(), user_id: userId, status: 'approved', created_at: now() }); }); },
  async documents() { const db = load(); staffOrThrow(db); return db.documents; },
  async issue(d) {
    return tx((db) => {
      const s = staffOrThrow(db);
      if (s.role !== 'issuer' && s.role !== 'admin') throw new Error('Only credential issuers can issue documents');
      const doc: Doc = { ...d, id: docId(), status: 'valid', created_at: now() };
      db.documents.unshift(doc);
      return doc;
    });
  },
  async revoke(id, reason) { tx((db) => { staffOrThrow(db); const d = db.documents.find((x) => x.id === id); if (d) { d.status = 'revoked'; d.revoked_reason = reason; } }); },
  async sendMessage(userId, subject, body, applicationId) {
    tx((db) => { staffOrThrow(db); db.messages.unshift({ id: rid(), user_id: userId, application_id: applicationId, subject, body, delivered: false, created_at: now() }); });
    return { delivered: false };
  },
};
