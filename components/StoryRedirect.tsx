'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';

/** On the 404 page: if the address is a story published since the last build, open it in the live reader. */
export default function StoryRedirect() {
  useEffect(() => {
    const m = location.pathname.match(/^\/([a-z0-9][a-z0-9-]{1,90})\/?$/);
    if (!m) return;
    supabase()?.from('site_posts').select('slug').eq('slug', m[1]).maybeSingle()
      .then(({ data }) => { if (data) location.replace(`/story/?s=${data.slug}`); }, () => {});
  }, []);
  return null;
}
