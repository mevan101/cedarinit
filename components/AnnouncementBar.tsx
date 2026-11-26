'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import fileData from '@/content/settings/announcement.json';
import { liveSettings, type LiveAnnouncement } from '@/lib/live';
import { supabaseLazy } from '@/lib/supabase-lazy';

/** What this build was compiled with. Rendered synchronously, so the bar never pops in after first paint. */
const buildTime: LiveAnnouncement = liveSettings.announcement ?? (fileData as LiveAnnouncement);

/**
 * Site-wide notice, edited in the staff dashboard (Website → Settings).
 *
 * Mounted on every route, so it must be free when there is nothing to show. A build-time announcement
 * that is off (the usual case) returns null before touching Supabase: loading supabase-js and making a
 * round trip for a disabled setting cost every visitor a 184 kB chunk and a failed request. When a build
 * does ship an enabled announcement, the dashboard copy still wins, which keeps "edit the text without
 * a rebuild" for the one case where it matters.
 */
export default function AnnouncementBar() {
  const [a, setA] = useState<LiveAnnouncement>(buildTime);

  useEffect(() => {
    if (!buildTime.enabled || !buildTime.text) return;
    let live = true;
    supabaseLazy()
      .then((sb) => sb?.from('site_settings').select('value').eq('key', 'announcement').maybeSingle())
      .then((r) => { if (live && r?.data?.value) setA(r.data.value as LiveAnnouncement); }, () => {});
    return () => { live = false; };
  }, []);

  if (!a.enabled || !a.text) return null;
  const external = a.link && /^https?:/.test(a.link);
  return (
    <div className="relative z-[55] bg-cedar-900 px-[var(--gutter)] py-2.5 text-center text-sm text-white">
      {a.text}{' '}
      {a.link && (external ? (
        <a href={a.link} target="_blank" rel="noopener noreferrer" className="font-semibold text-cedar-200 underline underline-offset-4 hover:text-white">{a.link_label || 'Learn more'}</a>
      ) : (
        <Link href={a.link} className="font-semibold text-cedar-200 underline underline-offset-4 hover:text-white">{a.link_label || 'Learn more'}</Link>
      ))}
    </div>
  );
}
