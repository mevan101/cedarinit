'use client';

import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * The shared Supabase client, loaded on demand. Public pages use this so the Supabase library (~75 KB)
 * is downloaded only when a page talks to the backend, not with every page's first load.
 * Shares the one client with lib/supabase-client.ts (the dashboard), so there is never a second session.
 */
export async function supabaseLazy(): Promise<SupabaseClient | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return null;
  return (await import('./supabase-client')).supabase();
}
