// Firestore security rules tests. Run:
//   npx firebase-tools@15.34.1 emulators:exec --only firestore "node firebase/tests/rules.test.mjs"
// (needs @firebase/rules-unit-testing and firebase installed, e.g. `npm i --no-save @firebase/rules-unit-testing@5 firebase`)
import { readFileSync } from 'node:fs';
import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where, addDoc } from 'firebase/firestore';

const env = await initializeTestEnvironment({ projectId: 'cedar-test', firestore: { rules: readFileSync(new URL('../../firestore.rules', import.meta.url), 'utf8') } });
await env.clearFirestore();
await env.withSecurityRulesDisabled(async (ctx) => {
  const db = ctx.firestore();
  await setDoc(doc(db, 'users/staff'), { email: 'staff@x.org', role: 'issuer', full_name: 'Staff' });
  await setDoc(doc(db, 'users/admin'), { email: 'admin@x.org', role: 'admin', full_name: 'Admin' });
  await setDoc(doc(db, 'users/bob'), { email: 'bob@x.org', role: 'volunteer', full_name: 'Bob' });
  await setDoc(doc(db, 'applications/bobapp'), { user_id: 'bob', opportunity: 'x', status: 'new' });
});
const as = (uid, email) => env.authenticatedContext(uid, { email }).firestore();
const vol = as('vol', 'vol@x.org'), staff = as('staff', 'staff@x.org'), admin = as('admin', 'admin@x.org'), anon = env.unauthenticatedContext().firestore();
let n = 0; const t = async (name, p) => { await p; n++; console.log('✓', name); };

await t('volunteer creates own profile as volunteer', assertSucceeds(setDoc(doc(vol, 'users/vol'), { email: 'vol@x.org', role: 'volunteer', full_name: 'Vol' })));
await t('cannot sign up as admin', assertFails(setDoc(doc(as('eve', 'eve@x.org'), 'users/eve'), { email: 'eve@x.org', role: 'admin' })));
await t('cannot promote self', assertFails(updateDoc(doc(vol, 'users/vol'), { role: 'admin' })));
await t('can edit own name', assertSucceeds(updateDoc(doc(vol, 'users/vol'), { full_name: 'Vol One' })));
await t('cannot read another volunteer', assertFails(getDoc(doc(vol, 'users/bob'))));
await t('staff reads volunteers', assertSucceeds(getDoc(doc(staff, 'users/bob'))));
await t('issuer cannot change roles', assertFails(updateDoc(doc(staff, 'users/bob'), { role: 'manager' })));
await t('admin changes roles', assertSucceeds(updateDoc(doc(admin, 'users/bob'), { role: 'manager' })));

await t('apply as yourself', assertSucceeds(setDoc(doc(vol, 'applications/a1'), { user_id: 'vol', opportunity: 'relief-volunteer', status: 'new', answers: {} })));
await t('cannot apply as someone else', assertFails(setDoc(doc(vol, 'applications/a2'), { user_id: 'bob', opportunity: 'x', status: 'new' })));
await t('cannot self-accept', assertFails(setDoc(doc(vol, 'applications/a3'), { user_id: 'vol', opportunity: 'y', status: 'accepted' })));
await t("cannot read others' applications", assertFails(getDoc(doc(vol, 'applications/bobapp'))));
await t('can list own applications', assertSucceeds(getDocs(query(collection(vol, 'applications'), where('user_id', '==', 'vol')))));
await t('cannot list all applications', assertFails(getDocs(collection(vol, 'applications'))));
await t('can withdraw own', assertSucceeds(updateDoc(doc(vol, 'applications/a1'), { status: 'withdrawn' })));
await t('staff accepts', assertSucceeds(updateDoc(doc(staff, 'applications/bobapp'), { status: 'accepted' })));

await t('log own pending hours', assertSucceeds(setDoc(doc(vol, 'hours/h1'), { user_id: 'vol', program: 'P', area: 'A', date: '2026-11-01', hours: 4, status: 'pending' })));
await t('cannot log pre-approved hours', assertFails(setDoc(doc(vol, 'hours/h2'), { user_id: 'vol', program: 'P', area: 'A', date: '2026-11-01', hours: 4, status: 'approved' })));
await t('cannot log 30 hours in a day', assertFails(setDoc(doc(vol, 'hours/h3'), { user_id: 'vol', program: 'P', area: 'A', date: '2026-11-01', hours: 30, status: 'pending' })));
await t('cannot approve own hours', assertFails(updateDoc(doc(vol, 'hours/h1'), { status: 'approved' })));
await t('staff approves hours', assertSucceeds(updateDoc(doc(staff, 'hours/h1'), { status: 'approved' })));

const cert = { user_id: 'vol', recipient_name: 'Vol One', kind: 'certificate', title: 'Certificate', status: 'valid' };
await t('volunteer cannot issue a certificate', assertFails(setDoc(doc(vol, 'documents/CI-2026-ABCDEFGH'), cert)));
await t('issuer issues a certificate', assertSucceeds(setDoc(doc(staff, 'documents/CI-2026-ABCDEFGH'), cert)));
await t('rejects badly formed IDs', assertFails(setDoc(doc(staff, 'documents/my-cert'), cert)));
await t('recipient reads own certificate', assertSucceeds(getDoc(doc(vol, 'documents/CI-2026-ABCDEFGH'))));
await t('other volunteers cannot read it', assertFails(getDoc(doc(as('carol', 'carol@x.org'), 'documents/CI-2026-ABCDEFGH'))));
await t('issuer cannot rewrite a certificate', assertFails(updateDoc(doc(staff, 'documents/CI-2026-ABCDEFGH'), { title: 'Something else' })));
await t('issuer revokes', assertSucceeds(updateDoc(doc(staff, 'documents/CI-2026-ABCDEFGH'), { status: 'revoked', revoked_reason: 'Issued in error' })));

await t('issuer publishes verification', assertSucceeds(setDoc(doc(staff, 'verifications/CI-2026-ABCDEFGH'), { kind: 'certificate', recipient_name: 'Vol One', status: 'valid' })));
await t('removal letters are never public', assertFails(setDoc(doc(staff, 'verifications/CI-2026-ZZZZZZZZ'), { kind: 'termination', status: 'valid' })));
await t('anyone can verify by ID', assertSucceeds(getDoc(doc(anon, 'verifications/CI-2026-ABCDEFGH'))));
await t('nobody can list verifications', assertFails(getDocs(collection(anon, 'verifications'))));
await t('anonymous cannot read documents', assertFails(getDoc(doc(anon, 'documents/CI-2026-ABCDEFGH'))));

await t('claim a public handle', assertSucceeds(setDoc(doc(vol, 'publicProfiles/vol-one'), { uid: 'vol', full_name: 'Vol One' })));
await t("cannot take someone else's handle", assertFails(setDoc(doc(as('carol', 'carol@x.org'), 'publicProfiles/vol-one'), { uid: 'bob' })));
await t('cannot fake verified hours', assertFails(setDoc(doc(vol, 'publicStats/vol'), { approved_hours: 999 })));
await t('staff writes verified hours', assertSucceeds(setDoc(doc(staff, 'publicStats/vol'), { approved_hours: 4 })));
await t('anyone reads public stats', assertSucceeds(getDoc(doc(anon, 'publicStats/vol'))));

await t('volunteer cannot send messages', assertFails(addDoc(collection(vol, 'messages'), { user_id: 'bob', subject: 'x', body: 'y' })));
await t('staff queues email', assertSucceeds(addDoc(collection(staff, 'mail'), { to: 'vol@x.org', message: { subject: 'Hi', text: 'Hello' } })));
await t('nobody reads the outbox', assertFails(getDocs(collection(staff, 'mail'))));

console.log(`\n${n} rules tests passed`);
await env.cleanup();
