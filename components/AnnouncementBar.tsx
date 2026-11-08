import Link from 'next/link';
import data from '@/content/settings/announcement.json';

/** Site-wide notice, switched on and edited in the CMS (Settings → Announcement bar). */
export default function AnnouncementBar() {
  const a = data as { enabled: boolean; text: string; link?: string; link_label?: string };
  if (!a.enabled || !a.text) return null;
  return (
    <div className="relative z-[55] bg-cedar-900 px-[var(--gutter)] py-2.5 text-center text-sm text-white">
      {a.text}{' '}
      {a.link && (
        <Link href={a.link} className="font-semibold text-cedar-200 underline underline-offset-4 hover:text-white">
          {a.link_label || 'Learn more'}
        </Link>
      )}
    </div>
  );
}
