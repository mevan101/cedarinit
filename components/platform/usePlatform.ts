'use client';

import { useCallback, useEffect, useState } from 'react';
import { platform, type Profile } from '@/lib/platform';

/** Current user plus a refresh function. `me` is undefined while loading, null when signed out. */
export function usePlatform() {
  const p = platform();
  const [me, setMe] = useState<Profile | null | undefined>(undefined);
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick((t) => t + 1), []);
  useEffect(() => p.onChange(refresh), [p, refresh]);
  useEffect(() => {
    let live = true;
    p.me().then((m) => live && setMe(m)).catch(() => live && setMe(null));
    return () => { live = false; };
  }, [p, tick]);
  return { p, me, refresh, tick };
}

/** Read ?key= from the URL on the client (static export has no server-side search params). */
export function useQueryParam(key: string) {
  const [v, setV] = useState<string | null>(null);
  useEffect(() => setV(new URLSearchParams(location.search).get(key)), [key]);
  return v;
}
