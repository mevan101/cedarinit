import type { Metadata } from 'next';
import Link from 'next/link';
import Icon from '@/components/Icon';
import Reveal from '@/components/Reveal';
import { FieldHero, SectionHeading } from '@/components/ui';
import { money, reports } from '@/lib/finance';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Transparency: financial reports',
  description: 'Read Cedar Initiative’s published financial reports, with income, expenses and balances calculated from the records. Download PDFs and spreadsheets.',
  alternates: { canonical: '/transparency/' },
};

export default function TransparencyPage() {
  const years = Array.from(new Set(reports.map((r) => r.year))).sort().reverse();
  const totals = reports.filter((r) => r.kind === 'annual');
  const raised = totals.reduce((a, r) => a + r.raised, 0);
  const spent = totals.reduce((a, r) => a + r.spent, 0);
  return (
    <>
      <FieldHero
        title="Where every taka goes"
        lead={`Read the records behind the work. Our published annual statements record ${money(raised)} raised and ${money(spent)} spent. This archive currently covers ${years.join(', ')}, not every year of Cedar’s activity.`}
        image="ushnota/day-4b"
        alt="Cedar volunteers with collected winter clothing at a Dhaka school"
        caption="Winter clothes collection, Dhaka · Ushnota Abhijan 2025"
      />
      <section className="pb-[var(--section-y)]">
        <div className="shell space-y-16">
          {years.map((y) => (
            <div key={y}>
              <SectionHeading eyebrow="Year" title={y} />
              <ul className="mt-8 grid gap-4 md:grid-cols-2">
                {reports.filter((r) => r.year === y).map((r, i) => (
                  <Reveal as="li" key={r.slug} delay={i * 70}>
                    <article className="group relative flex h-full flex-col rounded-[var(--radius-card)] border border-ink/15 bg-white p-6 sm:p-7">
                      <p className="text-sm text-cedar-700">{r.kind === 'annual' ? 'Annual statement' : 'Program report'}</p>
                      <h3 className="t-h3 mt-2 text-ink"><Link href={`/${r.slug}/`} className="after:absolute after:inset-0 after:rounded-[var(--radius-card)]">{r.title}</Link></h3>
                      <p className="mt-3 flex-1 text-ink-soft">{r.summary}</p>
                      <dl className="mt-6 grid gap-3 border-t border-ink/10 pt-5 text-sm xs:grid-cols-3">
                        {[['Raised', r.raised], ['Spent', r.spent], ['Balance', r.balance]].map(([label, amount]) => <div key={label}><dt className="text-ink-muted">{label}</dt><dd className="font-semibold tabular-nums text-ink">{money(Number(amount), r.currency)}</dd></div>)}
                      </dl>
                      <span aria-hidden="true" className="mt-5 inline-flex items-center gap-2 font-semibold text-cedar-700">Open report <Icon name="arrow" className="h-4 w-4" /></span>
                    </article>
                  </Reveal>
                ))}
              </ul>
            </div>
          ))}
          <div className="rounded-[var(--radius-card)] border border-ink/10 bg-paper p-7">
            <h2 className="t-h3 text-ink">How we keep the books</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-ink-soft">
              <li>Every expense is entered with a bill number where we have one. Totals are calculated by the website, not typed by hand.</li>
              <li>These records show income and expenses, not a measure of long-term change. Read each report for its period, contributors and any activity counts included.</li>
              <li>We are not yet a registered organisation. A fiscal sponsor is still being arranged. See <Link href="/give/" className="link-underline font-medium text-cedar-700">what to know before giving</Link>.</li>
              <li>Spot a mistake? Email <a href={`mailto:${site.email}?subject=Financial%20report`} className="link-underline font-medium text-cedar-700">{site.email}</a> and we will correct it publicly.</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
