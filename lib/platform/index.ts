'use client';

import { demoPlatform } from './demo';
import { supabasePlatform } from './supabase';
import type { Platform } from './types';

export * from './types';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let instance: Platform | null = null;
/** Live Supabase when NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set, otherwise the in-browser demo. */
export function platform(): Platform {
  if (!instance) instance = url && key ? supabasePlatform(url, key) : demoPlatform;
  return instance;
}
export { demoPlatform };
