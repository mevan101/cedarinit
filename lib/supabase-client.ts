'use client';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// The URL and publishable key are public by design: row-level security in supabase/migrations protects the data.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;
/** One shared client for the whole site, or null when the site runs without a backend (demo / preview). */
export function supabase(): SupabaseClient | null {
  if (!url || !key) return null;
  if (!client) client = createClient(url, key, { auth: { persistSession: true, detectSessionInUrl: true } });
  return client;
}
