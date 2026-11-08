'use client';

import { demoPlatform } from './demo';
import { firebasePlatform } from './firebase';
import type { Platform } from './types';

export * from './types';

// Firebase web config is public by design (security comes from firestore.rules), so it can live in env vars at build time.
const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

type Full = Platform & { resetPassword?: (email: string) => Promise<void> };
let instance: Full | null = null;
/** Firebase when its config is set, otherwise the in-browser demo. */
export function platform(): Full {
  if (!instance) instance = config.apiKey && config.projectId ? firebasePlatform(config) : demoPlatform;
  return instance;
}
export { demoPlatform };
