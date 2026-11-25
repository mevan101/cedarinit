import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import Icon from '@/components/Icon';
import { PageHero } from '@/components/ui';
import { giving, site } from '@/lib/site';
import { reports, money } from '@/lib/finance';
import MoneySplit from '@/components/MoneySplit';

export const metadata: Metadata = {
  title: 'Give',
  description:
    'How to give to Cedar Initiative. We are not yet a registered organisation, so donations go through a registered fiscal sponsor, and every taka is reported.',
  alternates: { canonical: '/give/' },
};

export default function GivePage() {
  const { sponsor, methods } = giving;
  const ready = sponsor !== null && methods.length > 0;
  // Donors ask one question above all others: where does the money actually go?
  // Both answers below are calculated from the published reports, not typed in.
  const annual = reports.find((r) => r.kind === 'annual');
  const programReports = reports.filter((r) => r.kind === 'program');

  return (
    <>
      <PageHero
        eyebrow="Give"
        title="Fund the next winter drive and classroom"
        lead="Your gift pays for warm clothes, transport and teaching materials. We publish a financial report for every campaign."
      >
        <div className="flex flex-col gap-3 xs:flex-row">
          <Link href={ready ? '#how-title' : '/contact/?subject=Donation'} className="btn-primary">
            {ready ? 'See how to give' : 'Contact us to give'} <Icon name="arrow" className="h-4 w-4" />
          </Link>
          <Link href="#status-title" className="btn-glass">Read our legal status</Link>
        </div>
      </PageHero>

      <section className="section bg-white">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="space-y-12 lg:col-span-7">
            <Reveal as="section" aria-labelledby="status-title">
              <h2 id="status-title" className="t-h3 text-ink">Our legal status</h2>
              <p className="mt-4 max-w-[68ch] text-ink-soft">
                Cedar Initiative is a volunteer group founded in {site.founded}. We are <strong className="text-ink">not yet a registered
                organisation</strong>, so we don&rsquo;t take donations into a personal account.{' '}
                {sponsor ? (
                  <>
                    Gifts are received by our fiscal sponsor,{' '}
                    {sponsor.url ? (
                      <a href={sponsor.url} target="_blank" rel="noopener noreferrer" className="link-underline font-medium text-cedar-700">{sponsor.name}</a>
                    ) : (
                      <strong className="text-ink">{sponsor.name}</strong>
                    )}
                    , which holds the money for Cedar&rsquo;s programs and signs off on how it&rsquo;s spent. {sponsor.registration}
                  </>
                ) : (
                  <>
                    We&rsquo;re setting up a fiscal sponsor: a registered organisation that receives gifts on our behalf and checks how they&rsquo;re spent.
                    Until that&rsquo;s confirmed, please contact us before giving and we&rsquo;ll tell you exactly where your money goes.
                  </>
                )}
              </p>
            </Reveal>

            <Reveal as="section" aria-labelledby="how-title">
              <h2 id="how-title" className="t-h3 text-ink">How to give</h2>
              {ready ? (
                <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                  {methods.map((m) => (
                    <div key={m.label} className="rounded-3xl border border-ink/10 bg-paper/60 p-6">
                      <dt className="text-sm font-semibold uppercase tracking-[0.12em] text-cedar-700">{m.label}</dt>
                      <dd className="mt-2 text-lg font-semibold text-ink">{m.detail}</dd>
                      {m.note && <dd className="mt-1 text-sm text-ink-soft">{m.note}</dd>}
                    </div>
                  ))}
                </dl>
              ) : (
                <div className="mt-5 flex flex-col gap-3 xs:flex-row">
                  <Link href="/contact/?subject=Donation" className="btn-primary">
                    Contact us to give <Icon name="arrow" className="h-4 w-4" />
                  </Link>
                  <a href={`mailto:${site.email}?subject=Donation`} className="btn-glass">
                    Email {site.email}
                  </a>
                </div>
              )}
              <p className="mt-5 max-w-[68ch] text-sm text-ink-muted">
                Giving from outside Bangladesh, or as a company? <Link href="/contact/?subject=Donation" className="link-underline font-medium text-cedar-700">Get in touch</Link> and we&rsquo;ll send the right details.
              </p>
            </Reveal>
          </div>

          <aside className="lg:col-span-4 lg:col-start-9" aria-labelledby="reports-title">
            <Reveal className="rounded-4xl border border-ink/10 bg-paper/60 p-7">
              <h2 id="reports-title" className="text-sm font-semibold uppercase tracking-[0.12em] text-cedar-700">Every report</h2>
              <ul className="mt-5 space-y-4">
                {reports.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/${r.slug}/`} className="group flex items-start justify-between gap-4">
                      <span>
                        <span className="block font-semibold text-ink group-hover:text-cedar-700">{r.title}</span>
                        <span className="text-sm text-ink-soft">{r.kind === 'annual' ? 'Annual statement' : 'Program report'} · {money(r.spent, r.currency)} spent</span>
                      </span>
                      <Icon name="arrow" className="mt-1 h-4 w-4 shrink-0 text-cedar-600" />
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-ink/10 pt-5 text-sm text-ink-soft">
                Can&rsquo;t give money? <Link href="/opportunities/" className="link-underline font-medium text-cedar-700">Volunteer with us</Link>{' '}
                or <Link href="/fiscal-sponsors/" className="link-underline font-medium text-cedar-700">become our fiscal sponsor</Link>.
              </p>
            </Reveal>
          </aside>
        </div>
      </section>

      <section className="section bg-white" aria-labelledby="money-title">
        <div className="shell">
          <h2 id="money-title" className="t-h2 text-ink">What a gift pays for</h2>
          <p className="t-lead mt-4 max-w-[62ch]">
            Before people give, they want to know where the money goes. These are the figures from our own reports, added up from the bills behind
            them. Nothing here is a projection.
          </p>

          {annual && (
            <Reveal className="mt-12 rounded-4xl border border-ink/10 p-7 sm:p-10">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="t-h3 text-ink">{annual.title}</h3>
                <span className="text-sm text-ink-muted">Published {annual.published ? new Date(`${annual.published}T00:00:00Z`).toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' }) : annual.year}</span>
              </div>
              <p className="mt-2 max-w-[64ch] text-ink-soft">{annual.summary}</p>
              <div className="mt-8">
                <MoneySplit report={annual} />
              </div>
            </Reveal>
          )}

          {programReports.length > 0 && (
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {programReports.map((r, i) => (
                <Reveal key={r.slug} delay={i * 80} className="flex h-full flex-col rounded-4xl border border-ink/10 p-7">
                  <h3 className="t-h3 text-ink">{r.title}</h3>
                  <p className="mt-2 text-sm text-ink-muted">
                    {r.kind === 'annual' ? 'Annual statement' : 'Program report'} · {money(r.spent, r.currency)} spent
                  </p>
                  <ul className="mt-5 flex-1 divide-y divide-ink/10 border-y border-ink/10">
                    {r.byCategory.map((c) => (
                      <li key={c.label} className="flex items-baseline justify-between gap-4 py-2.5 text-[0.97rem]">
                        <span className="text-ink-soft">{c.label}</span>
                        <span className="shrink-0 font-semibold tabular-nums text-ink">{money(c.amount, r.currency)}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={`/${r.slug}/`} className="mt-5 inline-flex min-h-[44px] items-center gap-2 font-semibold text-cedar-700">
                    Read the report <Icon name="arrow" className="h-4 w-4" />
                  </Link>
                </Reveal>
              ))}
            </div>
          )}

          <p className="mt-8 max-w-[70ch] text-sm text-ink-muted">
            Every expense carries a bill number where we have one, and the totals are added up by the website rather than typed in. See{' '}
            <Link href="/transparency/" className="link-underline font-medium text-cedar-700">all reports</Link>, or take the figures as{' '}
            <Link href="/data/" className="link-underline font-medium text-cedar-700">JSON</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
