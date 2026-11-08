import Link from 'next/link';
import Img from './Img';
import Icon from './Icon';
import Reveal from './Reveal';
import Gallery from './Gallery';
import Blocks from './Blocks';
import JsonLd, { breadcrumb } from './JsonLd';
import { CTA, PageHero, SectionHeading } from './ui';
import { formatDate } from '@/lib/post-types';
import { getPost } from '@/lib/posts';
import { getReport, money } from '@/lib/finance';
import type { Program } from '@/lib/programs';
import { site } from '@/lib/site';

const dayOf = (slug: string) => Number(slug.match(/day-0?(\d+)/)?.[1] ?? NaN);

/** One template for every program page. All content comes from content/programs/<slug>.md. */
export default function ProgramView({ program: p }: { program: Program }) {
  const report = p.report ? getReport(p.report) : undefined;
  const diary = (p.diary ?? []).map(getPost).filter(Boolean) as NonNullable<ReturnType<typeof getPost>>[];
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = p.events.filter((e) => (e.end_date ?? e.date) >= today);
  const past = p.events.filter((e) => (e.end_date ?? e.date) < today).reverse();
  const dates = p.start_date ? (p.end_date && p.end_date !== p.start_date ? `${formatDate(p.start_date)} – ${formatDate(p.end_date)}` : formatDate(p.start_date)) : '';

  return (
    <>
      <JsonLd
        data={[
          breadcrumb([{ name: 'Home', path: '/' }, { name: 'Our work', path: '/our-work/' }, { name: p.title, path: `/${p.slug}/` }], site.url),
          ...[{ title: p.title, date: p.start_date, end_date: p.end_date, place: p.places?.[0], body: p.description }, ...p.events]
            .filter((e) => e.date)
            .map((e) => ({
              '@context': 'https://schema.org',
              '@type': 'Event',
              name: e.title,
              startDate: e.date,
              endDate: e.end_date || e.date,
              eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
              location: { '@type': 'Place', name: e.place || 'Bangladesh', address: { '@type': 'PostalAddress', addressLocality: e.place || 'Bangladesh', addressCountry: 'BD' } },
              organizer: { '@type': 'NGO', name: site.name, url: site.url },
              image: [`${site.url}${p.cover}`],
              description: e.body || p.description,
            })),
        ]}
      />
      <PageHero eyebrow={[p.kicker, p.status].filter(Boolean).join(' · ')} title={p.title} lead={p.lead} image={p.cover} imageAlt={p.cover_alt} caption={p.cover_caption}>
        <div className="flex flex-col gap-3 xs:flex-row">
          <Link href="/give/" className="btn-primary">Fund the next one <Icon name="arrow" className="h-4 w-4" /></Link>
          {report && <Link href={`/${report.slug}/`} className="btn-glass"><Icon name="file" className="h-4 w-4" /> Where the money went</Link>}
        </div>
      </PageHero>

      {/* At a glance */}
      <section className="pb-[var(--section-y)]">
        <div className="shell">
          <dl className="grid gap-x-8 gap-y-8 border-y border-ink/10 py-8 sm:grid-cols-2 lg:grid-cols-4">
            {dates && <div><dt className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">When</dt><dd className="mt-2 font-semibold text-ink">{dates}</dd></div>}
            {p.places && p.places.length > 0 && <div><dt className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">Where</dt><dd className="mt-2 font-semibold text-ink">{p.places.join(', ')}</dd></div>}
            {(p.facts ?? []).map((f) => (
              <div key={f.label}><dt className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">{f.label}</dt><dd className="mt-2 font-display text-3xl text-cedar-700">{f.value}</dd></div>
            ))}
          </dl>
          {p.bodyHtml && <Reveal className="prose-cedar mt-12" ><div dangerouslySetInnerHTML={{ __html: p.bodyHtml }} /></Reveal>}
        </div>
      </section>

      {/* Money, up front */}
      {report && (
        <section className="on-dark section bg-cedar-950 text-white">
          <div className="shell grid gap-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-5">
              <p className="t-eyebrow !text-cedar-300">The money</p>
              <h2 className="t-h2 mt-5">{money(report.raised, report.currency)} raised, {money(report.spent, report.currency)} spent</h2>
              <p className="t-lead mt-5 !text-white/75">{report.summary}</p>
              <Link href={`/${report.slug}/`} className="btn-light mt-8">Read the full report <Icon name="arrow" className="h-4 w-4" /></Link>
            </div>
            <ul className="space-y-4 lg:col-span-6 lg:col-start-7">
              {report.byCategory.map((c) => {
                const pct = report.spent ? Math.round((c.amount / report.spent) * 100) : 0;
                return (
                  <li key={c.label}>
                    <div className="flex justify-between gap-4 text-sm"><span className="font-medium">{c.label}</span><span className="tabular-nums text-white/70">{money(c.amount, report.currency)}</span></div>
                    <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/10" aria-hidden="true"><div className="bar-fill h-full rounded-full bg-cedar-300" style={{ width: `${Math.max(pct, 1)}%` }} /></div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {/* Objectives and who it serves */}
      {((p.objectives ?? []).length > 0 || (p.audience ?? []).length > 0) && (
        <section className="section bg-white">
          <div className="shell grid gap-6 lg:grid-cols-3">
            {(p.objectives ?? []).map((g, i) => (
              <Reveal key={g.heading} delay={i * 90} className="rounded-[var(--radius-card)] border border-ink/10 p-7 sm:p-8">
                <h2 className="t-h3 text-ink">{g.heading}</h2>
                <ul className="mt-5 space-y-3">
                  {g.items.map((it) => <li key={it} className="flex gap-3 text-ink-soft"><Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-cedar-600" />{it}</li>)}
                </ul>
              </Reveal>
            ))}
            {(p.audience ?? []).length > 0 && (
              <Reveal delay={180} className="rounded-[var(--radius-card)] bg-cedar-50 p-7 sm:p-8">
                <h2 className="t-h3 text-ink">{p.audience_heading || 'Who it serves'}</h2>
                <ul className="mt-5 space-y-3">
                  {p.audience!.map((a) => <li key={a} className="flex gap-3 text-ink"><Icon name="people" className="mt-0.5 h-5 w-5 shrink-0 text-cedar-700" />{a}</li>)}
                </ul>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {/* Events */}
      {p.events.length > 0 && (
        <section className="section">
          <div className="shell">
            <SectionHeading eyebrow="Events" title={upcoming.length ? 'Coming up' : 'Past events'} />
            <ol className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
              {[...upcoming, ...past].map((e) => (
                <li key={e.date + e.title} className="grid gap-4 py-6 sm:grid-cols-[10rem_1fr_auto] sm:items-center">
                  <p className="font-semibold text-cedar-700"><time dateTime={e.date}>{formatDate(e.date)}</time></p>
                  <div>
                    <p className="text-lg font-semibold text-ink">{e.title}</p>
                    <p className="text-sm text-ink-muted">{[e.place, (e.end_date ?? e.date) >= today ? 'Upcoming' : 'Done'].filter(Boolean).join(' · ')}</p>
                    {e.body && <p className="mt-2 text-ink-soft">{e.body}</p>}
                  </div>
                  {e.link && <a href={e.link} className="btn-glass">Details <Icon name="arrow" className="h-4 w-4" /></a>}
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Field diary */}
      {diary.length > 0 && (
        <section aria-labelledby="diary-title" className="section">
          <div className="shell">
            <p className="t-eyebrow">Field diary</p>
            <h2 id="diary-title" className="t-h2 mt-5 text-ink">{p.diary_heading || 'From the field'}</h2>
            <div className="draw-line mt-8 h-0.5 w-full bg-cedar-700" aria-hidden="true" />
          </div>
          <ol className="track shell-wide mt-8" aria-label="Field diary, scroll sideways for more">
            {diary.map((d) => (
              <li key={d.slug} className="group relative flex flex-col overflow-hidden rounded-3xl border border-ink/10 bg-white">
                <div className="aspect-[4/3] overflow-hidden bg-paper-deep">
                  <Img name={d.cover} alt="" sizes="24rem" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-sm font-semibold text-cedar-700">
                    {Number.isNaN(dayOf(d.slug)) ? d.category : `Day ${dayOf(d.slug)}`} · <time dateTime={d.date}>{formatDate(d.date)}</time>
                  </p>
                  <h3 className="mt-2 text-lg font-semibold leading-snug text-ink">
                    <Link href={`/${d.slug}/`} className="after:absolute after:inset-0">{d.title.replace(/^Winter clothes drive, day \d+: /, '')}</Link>
                  </h3>
                  <p className="mt-2 line-clamp-3 text-[0.95rem] text-ink-soft">{d.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {p.blocks.length > 0 && <div className="pt-4"><Blocks blocks={p.blocks} /></div>}

      {/* Partners */}
      {(p.partners ?? []).length > 0 && (
        <section className="section bg-white">
          <div className="shell">
            <SectionHeading eyebrow="With" title="Who made it possible" />
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {p.partners!.map((pt) => (
                <li key={pt.name} className="flex items-center gap-5 rounded-[var(--radius-card)] border border-ink/10 p-6">
                  {pt.logo ? <Img name={pt.logo} alt="" sizes="96px" className="h-14 w-20 shrink-0 object-contain" /> : <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cedar-50 font-display text-2xl text-cedar-700">{pt.name[0]}</span>}
                  <span>
                    <span className="block font-semibold text-ink">{pt.url ? <a href={pt.url} target="_blank" rel="noopener noreferrer" className="hover:text-cedar-700">{pt.name}</a> : pt.name}</span>
                    {pt.role && <span className="text-sm text-ink-muted">{pt.role}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {(p.gallery ?? []).length > 0 && (
        <section className="section">
          <div className="shell">
            <SectionHeading eyebrow="Photos" title="In pictures" />
            <div className="mt-10">
              <Gallery
                label={`${p.title} photo gallery`}
                groups={Array.from(new Set(p.gallery!.map((g) => g.caption || 'Photos'))).map((label) => ({
                  label,
                  items: p.gallery!.filter((g) => (g.caption || 'Photos') === label).map((g) => ({ name: g.image, alt: g.alt || '' })),
                }))}
              />
            </div>
          </div>
        </section>
      )}

      <CTA title={p.cta_heading || 'Three ways to help'} lead={p.cta_body} />
    </>
  );
}
