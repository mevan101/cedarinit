import { initializeApp, getApps, type FirebaseOptions } from 'firebase/app';
import {
  getAuth, connectAuthEmulator, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail,
  sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, sendEmailVerification, signOut, updateProfile,
} from 'firebase/auth';
import {
  getFirestore, connectFirestoreEmulator, doc, getDoc, getDocs, type Query, type DocumentData, setDoc, updateDoc, deleteDoc, addDoc, collection, query, where, writeBatch, serverTimestamp,
} from 'firebase/firestore';
import type { Application, Doc, HourEntry, Message, Platform, Profile, PublicProfile, VerifiedDoc } from './types';

/**
 * Live backend: Firebase Authentication (email + password, sign-in links, password reset, email verification)
 * and Cloud Firestore. Access rules are in firestore.rules and tested in firebase/tests.
 * Profile photos are resized in the browser and stored on the profile (no Cloud Storage needed).
 */
export function firebasePlatform(config: FirebaseOptions): Platform & { resetPassword(email: string): Promise<void> } {
  const app = getApps()[0] ?? initializeApp(config);
  const auth = getAuth(app);
  const db = getFirestore(app);
  // Local testing against `firebase emulators:start` (never set in production builds).
  if (process.env.NEXT_PUBLIC_FIREBASE_EMULATOR === '1' && !(globalThis as { __cedarEmu?: boolean }).__cedarEmu) {
    (globalThis as { __cedarEmu?: boolean }).__cedarEmu = true;
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
  }
  const now = () => new Date().toISOString();
  const uid = () => { const u = auth.currentUser?.uid; if (!u) throw new Error('Please sign in'); return u; };
  const all = async <T>(q: Query<DocumentData>) => (await getDocs(q)).docs.map((d) => ({ id: d.id, ...d.data() }) as T);
  const newest = <T extends { created_at?: string; date?: string; issued_on?: string }>(xs: T[]) => xs.sort((a, b) => String(b.date ?? b.issued_on ?? b.created_at).localeCompare(String(a.date ?? a.issued_on ?? a.created_at)));
  const docId = () => { const a = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; const r = crypto.getRandomValues(new Uint8Array(8)); return `CI-${new Date().getFullYear()}-${Array.from(r, (b) => a[b % 32]).join('')}`; };

  // Finish a sign-in link when the user lands back on the site.
  if (typeof window !== 'undefined' && isSignInWithEmailLink(auth, location.href)) {
    const email = localStorage.getItem('cedar-signin-email') || prompt('Confirm your email to finish signing in') || '';
    if (email) signInWithEmailLink(auth, email, location.href).then(() => { localStorage.removeItem('cedar-signin-email'); history.replaceState(null, '', location.pathname); });
  }

  async function ensureProfile(): Promise<Profile | null> {
    const u = auth.currentUser;
    if (!u) return null;
    const ref = doc(db, 'users', u.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) return { id: u.uid, ...snap.data() } as Profile;
    const p: Omit<Profile, 'id'> = { email: u.email ?? '', full_name: u.displayName ?? '', areas: [], public_profile: false, role: 'volunteer', created_at: now() };
    await setDoc(ref, p);
    return { id: u.uid, ...p };
  }

  async function syncPublicStats(userId: string) {
    const hrs = await all<HourEntry>(query(collection(db, 'hours'), where('user_id', '==', userId)));
    const docs = await all<Doc>(query(collection(db, 'documents'), where('user_id', '==', userId)));
    await setDoc(doc(db, 'publicStats', userId), {
      approved_hours: hrs.filter((h) => h.status === 'approved').reduce<number>((a, h) => a + Number(h.hours), 0),
      documents: docs.filter((d) => d.status === 'valid' && ['certificate', 'recommendation', 'experience'].includes(d.kind)).map(({ id, title, kind, issued_on }) => ({ id, title, kind, issued_on })),
    });
  }

  return {
    mode: 'live',
    async me() {
      await auth.authStateReady();
      return ensureProfile();
    },
    onChange(cb) { return onAuthStateChanged(auth, () => cb()); },
    async signUp(email, password, fullName) {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: fullName });
      await setDoc(doc(db, 'users', cred.user.uid), { email, full_name: fullName, areas: [], public_profile: false, role: 'volunteer', created_at: now() });
      sendEmailVerification(cred.user, { url: `${location.origin}/account/` }).catch(() => {});
      return { needsConfirm: false };
    },
    async signIn(email, password) { await signInWithEmailAndPassword(auth, email, password); },
    async sendLink(email) {
      await sendSignInLinkToEmail(auth, email, { url: `${location.origin}/account/`, handleCodeInApp: true });
      localStorage.setItem('cedar-signin-email', email);
    },
    async resetPassword(email) { await sendPasswordResetEmail(auth, email, { url: `${location.origin}/join/` }); },
    async signOut() { await signOut(auth); },
    async saveProfile(patch) {
      const id = uid();
      const { role: _r, id: _i, email: _e, created_at: _c, ...safe } = patch;
      const before = (await getDoc(doc(db, 'users', id))).data() as Profile;
      if (safe.handle && safe.handle !== before.handle) {
        const taken = await getDoc(doc(db, 'publicProfiles', safe.handle));
        if (taken.exists() && taken.data().uid !== id) throw new Error('That profile address is taken');
      }
      await updateDoc(doc(db, 'users', id), safe);
      const p = { ...before, ...safe, id } as Profile;
      // Keep the opt-in public profile in step, and remove it when switched off or renamed.
      if (before.handle && (before.handle !== p.handle || !p.public_profile)) await deleteDoc(doc(db, 'publicProfiles', before.handle)).catch(() => {});
      if (p.public_profile && p.handle) {
        await setDoc(doc(db, 'publicProfiles', p.handle), { uid: id, full_name: p.full_name, handle: p.handle, photo_url: p.photo_url ?? null, institution: p.institution ?? null, city: p.city ?? null, bio: p.bio ?? null, linkedin: p.linkedin ?? null, areas: p.areas ?? [] });
      }
      return p;
    },
    async uploadPhoto(file) {
      // Square 320px WebP, small enough to live on the profile document.
      const bmp = await createImageBitmap(file);
      const s = Math.min(bmp.width, bmp.height);
      const c = document.createElement('canvas');
      c.width = c.height = 320;
      c.getContext('2d')!.drawImage(bmp, (bmp.width - s) / 2, (bmp.height - s) / 4, s, s, 0, 0, 320, 320);
      return c.toDataURL('image/webp', 0.82);
    },

    async apply(opportunity, opportunity_title, answers) {
      const id = `${uid()}_${opportunity}`;
      const existing = await getDoc(doc(db, 'applications', id)).catch(() => null);
      if (existing?.exists() && existing.data().status !== 'withdrawn') throw new Error('You have already applied for this role');
      const me = (await getDoc(doc(db, 'users', uid()))).data() as Profile;
      await setDoc(doc(db, 'applications', id), {
        user_id: uid(), opportunity, opportunity_title, answers, status: 'new', created_at: now(), updated_at: now(),
        profile: { full_name: me.full_name, email: me.email, phone: me.phone ?? null, institution: me.institution ?? null },
      });
    },
    async myApplications() { return newest(await all<Application>(query(collection(db, 'applications'), where('user_id', '==', uid())))); },
    async withdraw(id) { await updateDoc(doc(db, 'applications', id), { status: 'withdrawn', updated_at: now() }); },
    async logHours(e) { await addDoc(collection(db, 'hours'), { ...e, user_id: uid(), status: 'pending', created_at: now() }); },
    async myHours() { return newest(await all<HourEntry>(query(collection(db, 'hours'), where('user_id', '==', uid())))); },
    async myDocuments() { return newest(await all<Doc>(query(collection(db, 'documents'), where('user_id', '==', uid())))); },
    async myMessages() { return newest(await all<Message>(query(collection(db, 'messages'), where('user_id', '==', uid())))); },
    async getDocument(id) {
      const s = await getDoc(doc(db, 'documents', id.trim().toUpperCase())).catch(() => null);
      return s?.exists() ? ({ id: s.id, ...s.data() } as Doc) : null;
    },
    async verify(id) {
      const s = await getDoc(doc(db, 'verifications', id.trim().toUpperCase())).catch(() => null);
      if (!s?.exists()) return null;
      const v = { id: s.id, ...s.data() } as VerifiedDoc;
      if (v.status === 'valid' && v.expires_on && v.expires_on < now().slice(0, 10)) v.status = 'expired';
      return v;
    },
    async publicProfile(handle) {
      const p = await getDoc(doc(db, 'publicProfiles', handle)).catch(() => null);
      if (!p?.exists()) return null;
      const stats = await getDoc(doc(db, 'publicStats', p.data().uid)).catch(() => null);
      return { ...(p.data() as PublicProfile), approved_hours: stats?.data()?.approved_hours ?? 0, documents: stats?.data()?.documents ?? [] };
    },

    async applications() { return newest(await all<Application>(collection(db, 'applications'))); },
    async updateApplication(id, patch) { await updateDoc(doc(db, 'applications', id), { ...patch, updated_at: now() }); },
    async volunteers() { return newest(await all<Profile>(collection(db, 'users'))); },
    async setRole(userId, role) { await updateDoc(doc(db, 'users', userId), { role }); },
    async allHours() {
      const [h, users] = await Promise.all([all<HourEntry>(collection(db, 'hours')), all<Profile>(collection(db, 'users'))]);
      return newest(h.map((x) => ({ ...x, profile: { full_name: users.find((u) => u.id === x.user_id)?.full_name ?? '' } })));
    },
    async setHoursStatus(id, status) {
      const s = await getDoc(doc(db, 'hours', id));
      await updateDoc(doc(db, 'hours', id), { status, approved_by: uid() });
      await syncPublicStats(s.data()!.user_id);
    },
    async logHoursFor(userId, e) {
      await addDoc(collection(db, 'hours'), { ...e, user_id: userId, status: 'approved', logged_by: uid(), approved_by: uid(), created_at: now() });
      await syncPublicStats(userId);
    },
    async documents() { return newest(await all<Doc>(collection(db, 'documents'))); },
    async issue(d) {
      const id = docId();
      const full: Doc = { ...d, id, status: 'valid', created_at: now() };
      const b = writeBatch(db);
      const { id: _id, ...data } = full;
      b.set(doc(db, 'documents', id), { ...data, issued_by: uid() });
      if (d.kind !== 'termination') {
        b.set(doc(db, 'verifications', id), {
          recipient_name: d.recipient_name, kind: d.kind, title: d.title, program: d.program ?? null, hours: d.hours ?? null, areas: d.areas,
          issued_on: d.issued_on, expires_on: d.expires_on ?? null, signer_name: d.signer_name, signer_title: d.signer_title, status: 'valid',
        });
      }
      await b.commit();
      await syncPublicStats(d.user_id);
      return full;
    },
    async revoke(id, reason) {
      const b = writeBatch(db);
      b.update(doc(db, 'documents', id), { status: 'revoked', revoked_reason: reason });
      const v = await getDoc(doc(db, 'verifications', id));
      if (v.exists()) b.update(doc(db, 'verifications', id), { status: 'revoked' });
      await b.commit();
      const d = await getDoc(doc(db, 'documents', id));
      await syncPublicStats(d.data()!.user_id);
    },
    async sendMessage(userId, subject, body, applicationId) {
      const u = (await getDoc(doc(db, 'users', userId))).data() as Profile;
      await addDoc(collection(db, 'messages'), { user_id: userId, application_id: applicationId ?? null, subject, body, delivered: false, created_at: now(), sent_by: uid() });
      // Picked up by the "Trigger Email from Firestore" extension, if installed.
      await addDoc(collection(db, 'mail'), { to: u.email, message: { subject, text: `Dear ${u.full_name || 'volunteer'},\n\n${body}\n\nCedar Initiative\nhttps://cedar-initiative.org` }, created_at: serverTimestamp() });
      return { delivered: false };
    },
  };
}
