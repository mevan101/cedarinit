import type { Metadata } from 'next';
import Link from 'next/link';
import Img from '@/components/Img';
import Icon from '@/components/Icon';
import Reveal from '@/components/Reveal';
import Gallery from '@/components/Gallery';
import GlassCard from '@/components/GlassCard';
import PostCard from '@/components/PostCard';
import { CTA, PageHero, SectionHeading } from '@/components/ui';
import { ushnota as u, ushnotaGallery } from '@/lib/programs';
import { formatDate, posts } from '@/lib/posts';
import JsonLd, { breadcrumb } from '@/components/JsonLd';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Ushnota Abhijan 2025: winter clothes drive in Dhaka',
  description: 'Our 2025 winter clothes drive: collections in Dhaka schools from 4 November, then aid for families made homeless by the Karail slum fire. Diary and report.',
  alternates: { canonical: '/ushnota-abhijan-2025/' },
};

export default function Page() {
  const updates = posts.filter((p) => p.slug.startsWith('ushnota'));
  const dayOf = (slug: string) => Number(slug.match(/day-0?(\d+)/)?.[1] ?? 99);
  const diary = updates.slice().sort((a, b) => dayOf(a.slug) - dayOf(b.slug));
  return (
    <>
      <JsonLd
        data={[
          breadcrumb([{ name: 'Home', path: '/' }, { name: 'Our work', path: '/our-work/' }, { name: u.title, path: `/${u.slug}/` }], site.url),
          {
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: 'Ushnota Abhijan 2025 winter clothes drive',
            startDate: '2025-11-04',
            endDate: '2026-01-31',
            eventStatus: 'https://schema.org/EventScheduled',
            eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
            location: { '@type': 'Place', name: 'Dhaka', address: { '@type': 'PostalAddress', addressLocality: 'Dhaka', addressCountry: 'BD' } },
            organizer: { '@type': 'NGO', name: site.name, url: site.url },
            image: [`${site.url}/images/${u.cover}.webp`],
            description: u.short,
          },
        ]}
      />
      <PageHero eyebrow={`${u.kicker} · ${u.status}`} title="Ushnota Abhijan 2025" lead={u.short} image={u.cover} imageAlt="Volunteers with collected winter clothes for Ushnota Abhijan 2025" caption="Volunteers with donated clothes, Dhaka · November 2025">
        <div className="flex flex-col gap-3 xs:flex-row">
          <Link href="/give/" className="btn-primary">Fund the next drive <Icon name="arrow" className="h-4 w-4" /></Link>
          <Link href={u.report} className="btn-glass"><Icon name="file" className="h-4 w-4" /> Financial report</Link>
        </div>
      </PageHero>

      <section className="pb-[var(--section-y)]">
        <div className="shell">
          <ul className="grid gap-4 sm:grid-cols-3">
            {u.facts.map((f, i) => (
              <Reveal as="li" key={f.label} delay={i * 80}>
                <GlassCard className="p-7">
                  <p className="font-display text-[clamp(2rem,3.4vw,3rem)] leading-none text-cedar-700">{f.value}</p>
                  <p className="mt-2 text-sm font-medium text-ink-soft">{f.label}</p>
                </GlassCard>
              </Reveal>
            ))}
          </ul>
          <Reveal className="mt-10 max-w-3xl t-lead">{u.summary[1]}</Reveal>
          <Reveal as="ul" className="mt-6 flex flex-wrap gap-2" aria-label="Target districts">
            {u.districts.map((d) => <li key={d} className="chip"><Icon name="pin" className="h-3.5 w-3.5" />{d}</li>)}
          </Reveal>
        </div>
      </section>

      <section className="section bg-white">
        <div className="shell">
          <SectionHeading eyebrow="Objectives" title="What we set out to do" />
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {[{ t: 'Short-term objectives', items: u.shortTerm }, { t: 'Long-term objectives', items: u.longTerm }].map((g, i) => (
              <Reveal key={g.t} delay={i * 120} className="rounded-4xl border border-ink/10 p-8 sm:p-10">
                <h3 className="t-h3 text-ink">{g.t}</h3>
                <ul className="mt-6 space-y-4">
                  {g.items.map((it) => (
                    <li key={it} className="flex gap-3 text-ink-soft"><Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-cedar-600" />{it}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="on-dark section bg-cedar-900 text-white">
        <div className="shell grid gap-12 lg:grid-cols-2">
          <div>
            <Reveal as="p" className="t-eyebrow !text-cedar-300">Vision</Reveal>
            <Reveal as="p" delay={100} className="mt-6 text-[clamp(1.5rem,3vw,2.5rem)] font-medium leading-tight tracking-[-0.02em]">{u.vision}</Reveal>
          </div>
          <div>
            <Reveal as="p" className="t-eyebrow !text-cedar-300">Mission</Reveal>
            <ol className="mt-6 space-y-4">
              {u.mission.map((m, i) => (
                <Reveal as="li" key={m} delay={i * 100} className="glass-dark flex gap-4 rounded-3xl p-5">
                  <span className="font-display text-2xl text-cedar-300">0{i + 1}</span><span className="text-white/85">{m}</span>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Target beneficiaries" title="Who the campaign supports" />
            <ul className="mt-8 space-y-3">
              {u.beneficiaries.map((b, i) => (
                <Reveal as="li" key={b} delay={i * 70} className="flex items-center gap-4 rounded-2xl bg-white p-4 text-ink shadow-sm">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-cedar-50 text-cedar-700"><Icon name="people" className="h-4 w-4" /></span>{b}
                </Reveal>
              ))}
            </ul>
          </div>
          <Reveal variant="right" className="overflow-hidden rounded-4xl bg-white p-3 shadow-xl">
            <Img name="ushnota/process" alt="Ushnota Abhijan 2025 process: collection from schools and communities, sorting and cleaning, packaging, and distribution to families in need" className="w-full rounded-3xl" />
          </Reveal>
        </div>
      </section>

      <section className="section bg-white">
        <div className="shell">
          <SectionHeading eyebrow="Photo gallery" title="Day by day" lead="Moments from every collection drive and distribution." />
          <div className="mt-10"><Gallery groups={ushnotaGallery} label="Ushnota Abhijan photo gallery" /></div>
        </div>
      </section>

      {/* Scene 4: field diary, day by day */}
      <section aria-labelledby="diary-title" className="section">
        <div className="shell">
          <p className="t-eyebrow">Field diary</p>
          <h2 id="diary-title" className="t-h2 mt-5 text-ink">Day by day, then the fire</h2>
          <p className="t-lead measure mt-5">Scroll sideways through each collection day and the emergency response in Karail.</p>
          <div className="draw-line mt-8 h-0.5 w-full bg-cedar-700" aria-hidden="true" />
        </div>
        <ol className="track shell-wide mt-8" aria-label="Campaign diary, scroll sideways for more">
          {diary.map((p) => (
            <li key={p.slug} className="group relative flex flex-col overflow-hidden rounded-3xl border border-ink/10 bg-white">
              <div className="aspect-[4/3] overflow-hidden bg-paper-deep">
                <Img name={p.cover} alt="" sizes="24rem" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-sm font-semibold text-cedar-700">
                  {dayOf(p.slug) === 99 ? 'Emergency response' : `Day ${dayOf(p.slug)}`} · <time dateTime={p.date}>{formatDate(p.date)}</time>
                </p>
                <h3 className="mt-2 text-lg font-semibold leading-snug text-ink">
                  <Link href={`/${p.slug}/`} className="after:absolute after:inset-0">{p.title.replace(/^Winter clothes drive, day \d+: /, '')}</Link>
                </h3>
                <p className="mt-2 line-clamp-3 text-[0.95rem] text-ink-soft">{p.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <CTA title="Help the next winter drive" lead="Fund transport and clothes, run a collection at your school, or bring your organisation in as a partner." />
    </>
  );
}
