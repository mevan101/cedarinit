import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../supabase-client';
import type { Application, Doc, HourEntry, Message, Platform, Profile, PublicProfile, VerifiedDoc } from './types';

/** Live backend: Supabase Auth + Postgres (row-level security in supabase/migrations) + Storage + the send-email function. */
export function supabasePlatform(): Platform & { resetPassword(email: string): Promise<void>; updatePassword(password: string): Promise<void>; onRecovery(cb: () => void): () => void } {
  const sb = supabase() as SupabaseClient;
  const uid = async () => (await sb.auth.getUser()).data.user?.id ?? null;
  const ok = <T>({ data, error }: { data: T; error: unknown }) => {
    if (error) throw new Error((error as { message?: string }).message ?? 'Request failed');
    return data as T;
  };

  return {
    mode: 'live',
    async me() {
      const id = await uid();
      if (!id) return null;
      return ok(await sb.from('profiles').select('*').eq('id', id).single()) as Profile;
    },
    onChange(cb) {
      const { data } = sb.auth.onAuthStateChange(() => cb());
      return () => data.subscription.unsubscribe();
    },
    async signUp(email, password, full_name) {
      const r = ok(await sb.auth.signUp({ email, password, options: { data: { full_name }, emailRedirectTo: `${location.origin}/account/` } }));
      return { needsConfirm: !r.session };
    },
    async signIn(email, password) {
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
    },
    async sendLink(email) { ok(await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: `${location.origin}/account/` } })); },
    async signOut() { await sb.auth.signOut(); },
    async resetPassword(email) {
      const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/account/?reset=1` });
      if (error) throw new Error(error.message);
    },
    async updatePassword(password) {
      const { error } = await sb.auth.updateUser({ password });
      if (error) throw new Error(error.message);
    },
    onRecovery(cb) {
      const { data } = sb.auth.onAuthStateChange((event) => { if (event === 'PASSWORD_RECOVERY') cb(); });
      return () => data.subscription.unsubscribe();
    },
    async saveProfile(patch) {
      const id = await uid();
      const { role: _r, id: _i, email: _e, created_at: _c, ...safe } = patch;
      return ok(await sb.from('profiles').update(safe).eq('id', id!).select('*').single()) as Profile;
    },
    async uploadPhoto(file) {
      const id = await uid();
      const path = `${id}/${Date.now()}-${file.name.replace(/[^\w.]+/g, '-')}`;
      ok(await sb.storage.from('avatars').upload(path, file, { upsert: true }));
      return sb.storage.from('avatars').getPublicUrl(path).data.publicUrl;
    },
    async apply(opportunity, opportunity_title, answers) {
      ok(await sb.from('applications').insert({ user_id: await uid(), opportunity, opportunity_title, answers }));
    },
    async myApplications() { return ok(await sb.from('applications').select('*').eq('user_id', (await uid())!).order('created_at', { ascending: false })) as Application[]; },
    async withdraw(id) { ok(await sb.from('applications').update({ status: 'withdrawn' }).eq('id', id)); },
    async logHours(e) { ok(await sb.from('hours').insert({ ...e, user_id: await uid() })); },
    async myHours() { return ok(await sb.from('hours').select('*').eq('user_id', (await uid())!).order('date', { ascending: false })) as HourEntry[]; },
    async myDocuments() { return ok(await sb.from('documents').select('*').eq('user_id', (await uid())!).order('issued_on', { ascending: false })) as Doc[]; },
    async myMessages() { return ok(await sb.from('messages').select('*').eq('user_id', (await uid())!).order('created_at', { ascending: false })) as Message[]; },
    async getDocument(id) { return (ok(await sb.from('documents').select('*').eq('id', id.toUpperCase()).maybeSingle()) as Doc | null) ?? null; },
    async verify(id) { return ((ok(await sb.rpc('verify_document', { doc_id: id })) as VerifiedDoc[])[0] ?? null); },
    async publicProfile(handle) { return ((ok(await sb.rpc('public_profile', { p_handle: handle })) as PublicProfile[])[0] ?? null); },

    async applications() {
      return ok(await sb.from('applications').select('*, profile:profiles(full_name, email, phone, institution)').order('created_at', { ascending: false })) as Application[];
    },
    async updateApplication(id, patch) { ok(await sb.from('applications').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id)); },
    async volunteers() { return ok(await sb.from('profiles').select('*').order('created_at', { ascending: false })) as Profile[]; },
    async setRole(userId, role) { ok(await sb.from('profiles').update({ role }).eq('id', userId)); },
    async allHours() { return ok(await sb.from('hours').select('*, profile:profiles!hours_user_id_fkey(full_name)').order('date', { ascending: false })) as HourEntry[]; },
    async setHoursStatus(id, status) { ok(await sb.from('hours').update({ status, approved_by: await uid() }).eq('id', id)); },
    async logHoursFor(user_id, e) { ok(await sb.from('hours').insert({ ...e, user_id, status: 'approved', logged_by: await uid(), approved_by: await uid() })); },
    async documents() { return ok(await sb.from('documents').select('*').order('created_at', { ascending: false })) as Doc[]; },
    async issue(d) { return ok(await sb.from('documents').insert(d).select('*').single()) as Doc; },
    async revoke(id, reason) { ok(await sb.from('documents').update({ status: 'revoked', revoked_reason: reason }).eq('id', id)); },
    async sendMessage(user_id, subject, body, application_id) {
      // The send-email function emails and logs the message. If it isn't deployed yet, still save the message to the account.
      const { data, error } = await sb.functions.invoke('send-email', { body: { user_id, subject, body, application_id } });
      if (!error && data?.ok) return { delivered: !!data.delivered };
      if (error) ok(await sb.from('messages').insert({ user_id, subject, body, application_id: application_id ?? null }));
      return { delivered: false };
    },
  };
}
