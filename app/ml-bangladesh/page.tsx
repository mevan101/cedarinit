import type { Metadata } from 'next';
import Img from '@/components/Img';
import Icon from '@/components/Icon';
import Reveal, { RiseText } from '@/components/Reveal';
import Stat from '@/components/Stat';
import JsonLd, { breadcrumb } from '@/components/JsonLd';
import { CTA, SectionHeading } from '@/components/ui';
import { mlbd as m } from '@/lib/mlbd';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'ML Bangladesh: free AI hackathons and ML clubs',
  description:
    'Machine Learning Bangladesh, Cedar’s STEM program since September 2026: free one-day AI hackathons on campuses, ML Club, Build Club and Kaggle competitions.',
  alternates: { canonical: '/ml-bangladesh/' },
  openGraph: { title: 'ML Bangladesh · Cedar Initiative', images: [{ url: m.hero.src, alt: m.hero.alt }] },
};

const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumb([{ name: 'Home', path: '/' }, { name: 'Our work', path: '/our-work/' }, { name: 'ML Bangladesh', path: '/ml-bangladesh/' }], site.url),
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: m.name,
            alternateName: ['MLBD', 'TFUG North Bengal'],
            url: m.url,
            foundingDate: '2023-09',
            parentOrganization: { '@type': 'NGO', name: site.name, url: site.url },
            sameAs: [m.group],
          },
        ]}
      />

      <section className="hero-pad pb-12 pt-28 sm:pb-16 sm:pt-36">
        <div className="shell hero-grid fold-split">
          <div className="hero-copy">
            <p className="t-eyebrow hide-tiny mb-5">{m.kicker} · joined Cedar {m.joined}</p>
            <RiseText as="h1" text="ML Bangladesh" className="t-display text-ink" />
            <Reveal as="p" delay={250} className="hero-lead t-lead measure mt-6">{m.lead}</Reveal>
            <Reveal delay={350} className="hero-cta mt-8 flex flex-col gap-3 xs:flex-row">
              <a href={m.url} {...ext} className="btn-primary">
                Visit mlbangladesh.org <Icon name="external" className="h-4 w-4" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <a href={m.group} {...ext} className="btn-glass">
                Join the Facebook group<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </Reveal>
          </div>
          <figure className="hero-photo-wrap">
            <div className="overflow-hidden rounded-4xl bg-paper-deep">
              <Img name={m.hero.src} alt={m.hero.alt} priority sizes="(min-width: 1024px) 50vw, 100vw" className="hero-photo focus-in aspect-[4/3] w-full object-cover" />
            </div>
            <figcaption className="figcap">{m.hero.caption}</figcaption>
          </figure>
        </div>
      </section>

      <section className="pb-[var(--section-y)]">
        <div className="shell">
          <Reveal className="rounded-[var(--radius-card)] border border-cedar-700/20 bg-cedar-50 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cedar-700">ML Bangladesh and Cedar</p>
            <p className="measure mt-3 text-lg text-ink">{m.merger}</p>
          </Reveal>
        </div>
      </section>

      <section className="on-dark section bg-cedar-950 text-white">
        <div className="shell">
          <SectionHeading tone="dark" eyebrow="Since 2023" title="ML Bangladesh in numbers" lead="Counted by ML Bangladesh. Most of these happened before it joined Cedar." />
          <ul className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {m.stats.map((s, i) => (
              <Reveal as="li" key={s.label} delay={i * 80}>
                <Stat tone="dark" stat={{ ...s, source: { label: 'mlbangladesh.org', href: `${m.url}/about`, external: true } }} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHeading eyebrow="Programs" title="What ML Bangladesh runs" lead="ML Club and Build Club run all year. Hackathons, study jams and talks happen when a campus or partner makes them possible." />
          <ul className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
            {m.programs.map((p, i) => (
              <Reveal as="li" key={p.title} delay={(i % 3) * 80} className="bg-white p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cedar-700">{p.when}</p>
                <h3 className="t-h3 mt-2 text-ink">{p.title}</h3>
                <p className="mt-3 text-ink-soft">{p.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Scene 4: field diary, a horizontal timeline */}
      <section aria-labelledby="timeline-title" className="section bg-white">
        <div className="shell">
          <p className="t-eyebrow">How it got here</p>
          <h2 id="timeline-title" className="t-h2 mt-5 text-ink">From a reading group to campus hackathons</h2>
          <div className="draw-line mt-8 h-0.5 w-full bg-cedar-700" aria-hidden="true" />
        </div>
        <ol className="track shell-wide mt-8" aria-label="ML Bangladesh timeline, scroll sideways for more">
          {m.timeline.map((t) => (
            <li key={t.title} className="flex flex-col overflow-hidden rounded-3xl border border-ink/10 bg-paper">
              {'photo' in t && t.photo ? (
                <div className="aspect-[4/3] overflow-hidden bg-paper-deep">
                  <Img name={t.photo.src} alt={t.photo.alt} sizes="24rem" className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="relative flex aspect-[4/3] flex-col justify-end overflow-hidden bg-cedar-900 p-6 text-white">
                  <svg aria-hidden="true" viewBox="0 0 200 150" className="absolute -right-6 -top-6 h-40 w-40 text-cedar-700">
                    <path d="M40 10 C 110 12 160 50 190 110 L 160 140 C 130 85 90 60 30 55 Z" fill="currentColor" />
                    <path d="M10 70 C 80 55 140 80 175 130 L 165 150 C 120 115 70 105 15 110 Z" fill="currentColor" opacity="0.6" />
                  </svg>
                  {'card' in t && t.card && (
                    <>
                      <span className="relative font-display text-6xl uppercase leading-none">{t.card.big}</span>
                      <span className="relative mt-2 text-sm text-cedar-200">{t.card.small}</span>
                    </>
                  )}
                </div>
              )}
              <div className="flex flex-1 flex-col p-6">
                <p className="text-sm font-semibold text-cedar-700"><time>{t.date}</time></p>
                <h3 className="mt-1 text-lg font-semibold leading-snug text-ink">{t.title}</h3>
                <p className="mt-2 text-[0.97rem] text-ink-soft">{t.body}</p>
                {'href' in t && t.href && (
                  <a href={t.href} {...ext} className="link-underline mt-auto inline-flex min-h-[44px] items-center gap-1.5 pt-3 text-sm font-semibold text-cedar-700">
                    Read more <Icon name="external" className="h-3.5 w-3.5" /><span className="sr-only">(opens in a new tab)</span>
                  </a>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="section">
        <div className="shell-wide">
          <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {m.gallery.map((g) => (
              <Reveal as="li" key={g.src}>
                <figure>
                  <div className="overflow-hidden rounded-3xl bg-paper-deep">
                    <Img name={g.src} alt={g.alt} sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw" className="h-auto w-full" />
                  </div>
                  <figcaption className="figcap">{g.caption}</figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section bg-white">
        <div className="shell grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="How it runs" title="Rules we keep" />
            <ul className="mt-10 space-y-6">
              {m.principles.map((p) => (
                <Reveal as="li" key={p.title} className="border-l-2 border-cedar-700 pl-5">
                  <h3 className="font-semibold text-ink">{p.title}</h3>
                  <p className="mt-1 text-ink-soft">{p.body}</p>
                </Reveal>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading eyebrow="Supporters" title="Who has backed it" />
            <Reveal as="ul" className="mt-10 flex flex-wrap gap-2" aria-label="ML Bangladesh supporters">
              {m.supporters.map((s) => (
                <li key={s} className="rounded-full border border-ink/10 px-4 py-2 text-sm font-medium text-ink-soft">{s}</li>
              ))}
            </Reveal>
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">In the press</p>
            <ul className="mt-3 space-y-2">
              {m.press.map((p) => (
                <li key={p.href}>
                  <a href={p.href} {...ext} className="group inline-flex min-h-[44px] items-start gap-2 py-1">
                    <span>
                      <span className="block text-sm font-semibold text-cedar-700">{p.outlet}</span>
                      <span className="text-ink group-hover:underline">{p.title}</span>
                    </span>
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHeading eyebrow="Get involved" title="Bring ML Bangladesh to your campus" lead="Tell ML Bangladesh which department, club or society would host, and they’ll take it from there. You can also speak, judge, mentor or sponsor." />
          <div className="mt-8 flex flex-col gap-3 xs:flex-row">
            <a href={m.hostRequest} {...ext} className="btn-primary">Request an event <Icon name="external" className="h-4 w-4" /><span className="sr-only">(opens in a new tab)</span></a>
            <a href={m.sponsor} {...ext} className="btn-glass">Sponsor an event<span className="sr-only"> (opens in a new tab)</span></a>
            <a href={m.events} {...ext} className="btn-glass">See upcoming events<span className="sr-only"> (opens in a new tab)</span></a>
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
