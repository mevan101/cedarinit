'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { withBase, withoutBase } from '@/lib/base-path';

/** On the 404 page: if the address is a story published since the last build, open it in the live reader. */
export default function StoryRedirect() {
  useEffect(() => {
    const m = withoutBase(location.pathname).match(/^\/([a-z0-9][a-z0-9-]{1,90})\/?$/);
    if (!m) return;
    supabase()?.from('site_posts').select('slug').eq('slug', m[1]).maybeSingle()
      .then(({ data }) => { if (data) location.replace(withBase(`/story/?s=${data.slug}`)); }, () => {});
  }, []);
  return null;
}
