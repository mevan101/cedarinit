'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import fileData from '@/content/settings/announcement.json';
import { liveSettings, type LiveAnnouncement } from '@/lib/live';
import { supabase } from '@/lib/supabase-client';

/** Site-wide notice, edited in the staff dashboard (Website → Settings). Changes show without a rebuild. */
export default function AnnouncementBar() {
  const [a, setA] = useState<LiveAnnouncement>(liveSettings.announcement ?? (fileData as LiveAnnouncement));
  useEffect(() => {
    supabase()?.from('site_settings').select('value').eq('key', 'announcement').maybeSingle()
      .then(({ data }) => { if (data?.value) setA(data.value as LiveAnnouncement); }, () => {});
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
