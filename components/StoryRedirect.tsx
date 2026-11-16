'use client';

import { useEffect } from 'react';
import { supabaseLazy } from '@/lib/supabase-lazy';

/** On the 404 page: if the address is a story published since the last build, open it in the live reader. */
export default function StoryRedirect() {
  useEffect(() => {
    const m = location.pathname.match(/^\/([a-z0-9][a-z0-9-]{1,90})\/?$/);
    if (!m) return;
    supabaseLazy().then((sb) => sb?.from('site_posts').select('slug').eq('slug', m[1]).maybeSingle())
      .then((r) => { if (r?.data) location.replace(`/story/?s=${r.data.slug}`); }, () => {});
  }, []);
  return null;
}
