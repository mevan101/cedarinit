import type { Metadata } from 'next';
import Link from 'next/link';
import Icon from '@/components/Icon';
import Reveal from '@/components/Reveal';
import { PageHero } from '@/components/ui';
import { reports } from '@/lib/finance';
import { posts } from '@/lib/posts';
import { programs } from '@/lib/programs';
import { opportunities } from '@/lib/opportunities';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Open data',
  description:
    'Cedar Initiative’s figures and writing as plain JSON: impact numbers with their sources, programs, financial reports, stories and volunteer roles. No key, no sign-up.',
  alternates: { canonical: '/data/' },
};

const endpoints = [
  { path: '/api/organization.json', file: 'organization.json', body: 'Who Cedar is: mission, vision, founding team, contact details, social accounts, fiscal-sponsor status.', count: '' },
  { path: '/api/impact.json', file: 'impact.json', body: 'Every headline number on the site with the period it covers and the report or page it comes from.', count: '4 figures' },
  { path: '/api/programs.json', file: 'programs.json', body: 'Programs and campaigns with dates, places, partners and a link to each one’s financial report.', count: `${programs.length + 1} programs` },
  { path: '/api/reports.json', file: 'reports.json', body: 'Financial reports with totals, income by type and expenses by category, plus the PDFs and spreadsheets.', count: `${reports.length} reports` },
  { path: '/api/posts.json', file: 'posts.json', body: 'Published stories, newest first: title, date, category, description and cover image. The article HTML is on the page itself.', count: `${posts.length} stories` },
  { path: '/api/opportunities.json', file: 'opportunities.json', body: 'Volunteer roles, open ones first, with location, commitment and closing date.', count: `${opportunities.length} roles` },
];

export default function DataPage() {
  return (
    <>
      <PageHero
        eyebrow="Open data"
        title="Our figures, as plain files"
        lead="The numbers and the writing on this site are also published as JSON, built on every deploy from the same reports the pages use. No key, no sign-up, no rate limit."
      />

      <section className="pb-[var(--section-y)]">
        <div className="shell">
          <ul className="divide-y divide-ink/10 border-y border-ink/10">
            {endpoints.map((e, i) => (
              <Reveal as="li" key={e.path} delay={i * 60}>
                <div className="grid gap-3 py-6 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:gap-8">
                  <div>
                    <a href={e.path} className="link-underline break-all font-mono text-[0.95rem] font-semibold text-cedar-700">{e.path}</a>
                    {e.count && <span className="mt-1 block text-sm text-ink-muted">{e.count}</span>}
                  </div>
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                    <p className="max-w-[62ch] flex-1 text-ink-soft">{e.body}</p>
                    <a href={e.path} className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-cedar-700">
                      Open <Icon name="external" className="h-4 w-4" />
                      <span className="sr-only">(opens the raw file in a new tab)</span>
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>

          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            <Reveal>
              <h2 className="t-h3 text-ink">What is behind them</h2>
              <p className="mt-3 text-ink-soft">
                Every figure is calculated from the line items in the financial reports, not typed in. The stories come from the same Markdown
                files the pages are built from. If a report shows a mistake, the page and the JSON change together on the next deploy, because they
                are generated from one source.
              </p>
              <p className="mt-3 text-ink-soft">
                The same build also publishes a <a href="/search-index.json" className="link-underline font-medium text-cedar-700">search index</a> of
                every page, which is what the <Link href="/search/" className="link-underline font-medium text-cedar-700">site search</Link> reads.
              </p>
            </Reveal>
            <Reveal delay={90}>
              <h2 className="t-h3 text-ink">Using them</h2>
              <ul className="mt-3 space-y-3 text-ink-soft">
                <li>Quote a figure with its period and link the report it comes from. That is the standard we hold ourselves to.</li>
                <li>Photographs are not covered by this: they show real people who agreed to appear on our pages, not in someone else’s. Ask us first.</li>
                <li>
                  Something wrong or out of date? Email{' '}
                  <a href={`mailto:${site.email}?subject=Open%20data`} className="link-underline font-medium text-cedar-700">{site.email}</a> and we
                  will correct it publicly, as we do for the reports.
                </li>
              </ul>
              <p className="mt-6 text-sm text-ink-muted">
                Rebuilt on every deploy, from the same content the pages are built from.
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
