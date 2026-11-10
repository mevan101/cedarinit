'use client';

import { demoPlatform } from './demo';
import { supabasePlatform } from './supabase';
import type { Platform } from './types';

export * from './types';

// The Supabase URL and anon key are public by design: row-level security in supabase/migrations protects the data.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

type Full = Platform & { resetPassword?: (email: string) => Promise<void>; updatePassword?: (password: string) => Promise<void>; onRecovery?: (cb: () => void) => () => void };
let instance: Full | null = null;
/** Supabase when its URL and anon key are set at build time, otherwise the in-browser demo. */
export function platform(): Full {
  if (!instance) instance = url && key ? supabasePlatform() : demoPlatform;
  return instance;
}
export { demoPlatform };
