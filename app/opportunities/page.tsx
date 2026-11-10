import type { Metadata } from 'next';
import Link from 'next/link';
import Icon from '@/components/Icon';
import Reveal from '@/components/Reveal';
import { PageHero } from '@/components/ui';
import { opportunities } from '@/lib/opportunities';

export const metadata: Metadata = {
  title: 'Volunteer roles in Bangladesh',
  description: 'Open volunteer roles at Cedar Initiative: winter relief in Dhaka, teaching coding in schools, running AI hackathons with ML Bangladesh, communications and research.',
  alternates: { canonical: '/opportunities/' },
};

export default function OpportunitiesPage() {
  const open = opportunities.filter((o) => o.status === 'open');
  return (
    <>
      <PageHero eyebrow="Open roles" title="Find your role" lead={`${open.length} volunteer roles open now. Apply on this site with one account, follow your application, and get a certificate with verified hours when you finish.`}>
        <div className="flex flex-col gap-3 xs:flex-row">
          <Link href="/join/" className="btn-primary">Create your account <Icon name="arrow" className="h-4 w-4" /></Link>
          <Link href="/verify/" className="btn-glass">Verify a certificate</Link>
        </div>
      </PageHero>
      <section className="pb-[var(--section-y)]">
        <div className="shell">
          <ul className="grid gap-4 md:grid-cols-2">
            {opportunities.map((o, i) => (
              <Reveal as="li" key={o.slug} delay={(i % 2) * 80}>
                <Link href={`/opportunities/${o.slug}/`} className="group flex h-full flex-col rounded-[var(--radius-card)] border border-ink/10 bg-white p-7 transition hover:-translate-y-0.5 hover:border-cedar-700/40 hover:shadow-[0_20px_40px_-28px_rgb(var(--cedar-950)/0.35)]">
                  <span className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-cedar-700">{o.program}</span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${o.status === 'open' ? 'bg-cedar-50 text-cedar-800' : 'bg-ink/10 text-ink-muted'}`}>{o.status === 'open' ? 'Open' : 'Closed'}</span>
                  </span>
                  <span className="t-h3 mt-3 text-ink">{o.title}</span>
                  <span className="mt-3 flex-1 text-ink-soft">{o.summary}</span>
                  <span className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-muted">
                    <span className="inline-flex items-center gap-1.5"><Icon name="pin" className="h-4 w-4" />{o.location}</span>
                    <span className="inline-flex items-center gap-1.5"><Icon name="calendar" className="h-4 w-4" />{o.commitment}</span>
                  </span>
                  <span className="mt-5 inline-flex items-center gap-2 font-semibold text-cedar-700">View role and apply <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
