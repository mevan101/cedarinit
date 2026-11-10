'use client';

import { supabase } from './supabase-client';

/**
 * Saves a form submission to Supabase (staff read it in the dashboard: Inbox). Returns false when the site has no
 * backend, so the caller can fall back. Throws with a readable message if the database refuses (e.g. too many messages).
 */
export async function sendForm(form: string, fields: Record<string, string>): Promise<boolean> {
  const sb = supabase();
  if (!sb) return false;
  const pick = (...keys: string[]) => keys.map((k) => fields[k]).find((v) => v && v.trim())?.trim().slice(0, 300) || null;
  const { error } = await sb.from('form_submissions').insert({
    form: form.toLowerCase().replace(/[^a-z0-9-]+/g, '-').slice(0, 60) || 'form',
    name: pick('name', 'your-name', 'full_name'),
    email: pick('email', 'your-email'),
    subject: pick('subject', 'your-subject'),
    data: fields,
    page: location.pathname.slice(0, 300),
  });
  if (error) throw new Error(error.message);
  return true;
}

export const formToObject = (fd: FormData) => {
  const o: Record<string, string> = {};
  fd.forEach((v, k) => { if (typeof v === 'string' && k !== 'website') o[k] = o[k] ? `${o[k]}, ${v}` : v.slice(0, 5000); });
  return o;
};
