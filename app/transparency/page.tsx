import type { Metadata } from 'next';
import Link from 'next/link';
import Icon from '@/components/Icon';
import Reveal from '@/components/Reveal';
import { PageHero, SectionHeading } from '@/components/ui';
import { money, reports } from '@/lib/finance';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Transparency: financial reports',
  description: 'Every taka Cedar Initiative has raised and spent, program by program: who gave, what it paid for and what is left. Download any report as PDF or spreadsheet.',
  alternates: { canonical: '/transparency/' },
};

export default function TransparencyPage() {
  const years = Array.from(new Set(reports.map((r) => r.year))).sort().reverse();
  const totals = reports.filter((r) => r.kind === 'annual');
  const raised = totals.reduce((a, r) => a + r.raised, 0);
  const spent = totals.reduce((a, r) => a + r.spent, 0);
  return (
    <>
      <PageHero
        eyebrow="Transparency"
        title="Where every taka goes"
        lead={`We publish a report for every program and a statement for every year. Since ${site.founded} we have raised ${money(raised)} and spent ${money(spent)}.`}
      />
      <section className="pb-[var(--section-y)]">
        <div className="shell space-y-16">
          {years.map((y) => (
            <div key={y}>
              <SectionHeading eyebrow="Year" title={y} />
              <ul className="mt-8 grid gap-4 md:grid-cols-2">
                {reports.filter((r) => r.year === y).map((r, i) => (
                  <Reveal as="li" key={r.slug} delay={i * 70}>
                    <Link href={`/${r.slug}/`} className="group flex h-full flex-col rounded-[var(--radius-card)] border border-ink/10 bg-white p-7 transition hover:border-cedar-700/40">
                      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-cedar-700">{r.kind === 'annual' ? 'Annual statement' : 'Program report'}</span>
                      <span className="t-h3 mt-2 text-ink">{r.title}</span>
                      <span className="mt-3 flex-1 text-ink-soft">{r.summary}</span>
                      <span className="mt-6 grid grid-cols-3 gap-3 border-t border-ink/10 pt-5 text-sm">
                        <span><span className="block text-ink-muted">Raised</span><span className="font-semibold tabular-nums text-ink">{money(r.raised, r.currency)}</span></span>
                        <span><span className="block text-ink-muted">Spent</span><span className="font-semibold tabular-nums text-ink">{money(r.spent, r.currency)}</span></span>
                        <span><span className="block text-ink-muted">Balance</span><span className="font-semibold tabular-nums text-ink">{money(r.balance, r.currency)}</span></span>
                      </span>
                      <span className="mt-5 inline-flex items-center gap-2 font-semibold text-cedar-700">Open report <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                    </Link>
                  </Reveal>
                ))}
              </ul>
            </div>
          ))}
          <div className="rounded-[var(--radius-card)] border border-ink/10 bg-paper p-7">
            <h2 className="t-h3 text-ink">How we keep the books</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-ink-soft">
              <li>Every expense is entered with a bill number where we have one. Totals are calculated by the website, not typed by hand.</li>
              <li>We are not yet a registered organisation, so we never hold donations in a personal account. See <Link href="/give/" className="link-underline font-medium text-cedar-700">how giving works</Link>.</li>
              <li>Spot a mistake? Email <a href={`mailto:${site.email}?subject=Financial%20report`} className="link-underline font-medium text-cedar-700">{site.email}</a> and we will correct it publicly.</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
