import type { Metadata } from 'next';
import Link from 'next/link';
import SiteSearch from '@/components/SiteSearch';
import Icon from '@/components/Icon';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search Cedar Initiative: stories from the field, programs, financial reports and volunteer roles.',
  alternates: { canonical: '/search/' },
  // The results are a view of pages that are already indexed; keep them out of search engines.
  robots: { index: false, follow: true },
};

const fallback = [
  { href: '/outreach/', label: 'All stories' },
  { href: '/our-work/', label: 'Programs' },
  { href: '/transparency/', label: 'Financial reports' },
  { href: '/opportunities/', label: 'Volunteer roles' },
];

export default function SearchPage() {
  return (
    <section className="pb-[var(--section-y)] pt-32 sm:pt-40">
      <div className="shell max-w-4xl">
        <h1 className="t-h2 text-ink">Search the site</h1>
        <p className="t-lead mt-4 max-w-[62ch]">
          Find a story, a program, a financial report or a volunteer role. Everything here is on this site; nothing is sent anywhere.
        </p>
        <div className="mt-10">
          <SiteSearch />
        </div>
        <noscript>
          <div className="mt-10 rounded-[var(--radius-card)] border border-ink/10 bg-white p-7">
            <p className="font-semibold text-ink">Search needs JavaScript.</p>
            <p className="mt-2 text-ink-soft">You can still browse everything directly:</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {fallback.map((f) => (
                <li key={f.href}>
                  <Link href={f.href} className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-ink/15 px-5 text-sm font-semibold text-ink">
                    {f.label} <Icon name="arrow" className="h-4 w-4" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </noscript>
      </div>
    </section>
  );
}
