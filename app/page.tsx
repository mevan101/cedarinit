import type { Metadata } from 'next';
import Link from 'next/link';
import Img from '@/components/Img';
import Icon from '@/components/Icon';
import Reveal, { RiseText } from '@/components/Reveal';
import Stat from '@/components/Stat';
import PostCard from '@/components/PostCard';
import { ArrowLink, CTA, SectionHeading } from '@/components/ui';
import { impact, press, site } from '@/lib/site';
import { reports, money } from '@/lib/finance';
import { founders, portraitOf } from '@/lib/team';
import { mlbd } from '@/lib/mlbd';
import { posts } from '@/lib/posts';
import Intro from '@/components/Intro';
import { LogoMarquee } from '@/components/LogoWall';

export const metadata: Metadata = {
  title: { absolute: 'Cedar Initiative: youth-led nonprofit in Bangladesh' },
  description:
    'Student volunteers in Bangladesh running winter relief in Dhaka, computer science classes in Rangpur and free AI hackathons on campuses through ML Bangladesh.',
  alternates: { canonical: '/', types: { 'application/rss+xml': [{ url: '/feed.xml', title: 'Cedar Initiative news' }] } },
};

const work = [
  {
    href: '/ushnota-abhijan-2025/',
    kicker: 'Relief',
    title: 'Winter clothes for families in Dhaka',
    body: 'Ushnota Abhijan collected winter clothes in Dhaka schools in November 2025. When fire tore through Karail slum, volunteers took them straight to the families who lost their homes.',
    image: 'ushnota/distribution',
    alt: 'Cedar volunteers record aid for a family in Karail after the fire',
    caption: 'Karail, Dhaka · November 2025',
  },
  {
    href: '/ml-bangladesh/',
    kicker: 'STEM · ML Bangladesh',
    title: 'Free AI hackathons on university campuses',
    body: 'ML Bangladesh joined Cedar in September 2026. Its one-day build events have run at universities in Dhaka, Rajshahi, Mymensingh, Chattogram and Dinajpur.',
    ext: mlbd.gallery[0],
    caption: mlbd.gallery[0].caption,
  },
  {
    href: '/csedweek2025/',
    kicker: 'Education',
    title: 'Computer science week in Rangpur',
    body: 'For CSEdWeek 2025 we taught coding and the basics of AI to students at JAAGO Foundation School, Rangpur, with a facilitator and the school’s own computer lab.',
    image: 'csedweek/rangpur-1',
    alt: 'Students and Cedar volunteers at JAAGO Foundation School, Rangpur',
    caption: 'JAAGO Foundation School, Rangpur · CSEdWeek 2025',
  },
] as const;

const tiles = [
  { image: 'mlbd/hacktoberfest-dhaka', alt: 'Students building projects at Hacktoberfest Hack Day in Dhaka', caption: 'Hack day · Dhaka', pos: '50% 40%' },
  { image: 'ushnota/day-4a', alt: 'Schoolgirls queue to hand over winter clothes to Cedar volunteers', caption: 'Winter drive · Dhaka', pos: '55% 30%' },
  { image: 'csedweek/rangpur-1', alt: 'Students and volunteers at JAAGO Foundation School, Rangpur', caption: 'CSEdWeek · Rangpur', pos: '50% 35%' },
  { image: 'ushnota/distribution', alt: 'Cedar volunteers record aid for a family in Karail after the fire', caption: 'Fire response · Karail', pos: '50% 40%' },
  { image: 'mlbd/tech-for-her-auw', alt: 'Participants at the Tech For Her hackathon at the Asian University for Women', caption: 'Tech For Her · Chattogram', pos: '50% 45%' },
  { image: 'mlbd/build-with-gemma-uiu', alt: 'Teams at Build With Gemma at United International University', caption: 'Build With Gemma · Dhaka', pos: '50% 40%' },
];

const places = [
  { name: 'Dhaka', when: 'Since November 2025', what: 'Winter clothes drives in four schools, the Karail fire response, and ML Bangladesh hack days at UIU, DIU, UITS, SEU and the EMK Center.' },
  { name: 'Rangpur', when: 'December 2025', what: 'CSEdWeek: coding and AI for students at JAAGO Foundation School.' },
  { name: 'Rajshahi', when: 'July–August 2026', what: 'Build With AI Hack Days at Rajshahi University and RUET.' },
  { name: 'Mymensingh', when: 'August 2026', what: 'Build With AI Hack Days at Bangladesh Agricultural University.' },
  { name: 'Chattogram', when: 'September 2026', what: 'Tech For Her hackathon at the Asian University for Women.' },
  { name: 'Dinajpur', when: 'October 2026', what: 'Hacktoberfest Hack Days at HSTU.' },
];


export default function Home() {
  return (
    <>
      {/* 1. What Cedar does. On large screens: field photos float around the headline, then drift away
             as the launch-day group photo grows to fill the screen (scroll-driven, CSS only). */}
      <Intro />
      <section className="orbit" aria-labelledby="hero-title">
        <div className="orbit-stage">
          <div className="orbit-copy">
            <RiseText id="hero-title" as="h1" text="Young people. Real work." className="orbit-title t-display text-ink" />
            <Reveal as="p" delay={180} className="hero-lead t-lead mx-auto mt-6 max-w-[34rem]">
              Winter relief in Dhaka. Coding classes in Rangpur. Free AI hackathons across Bangladesh.
              We&rsquo;re the student volunteers who make it happen.
            </Reveal>
            <Reveal delay={250} className="hero-cta mt-8 flex flex-col justify-center gap-3 xs:flex-row">
              <Link href="/opportunities/" className="btn-primary">Find your role <Icon name="arrow" className="h-4 w-4" /></Link>
              <Link href="#work" className="btn-glass">See the work</Link>
            </Reveal>
          </div>
          <ul className="orbit-tiles" aria-label="Photos from our programs">
            {tiles.map((t, i) => (
              <li key={t.image} className={`orbit-tile orbit-t${i + 1}`} style={{ ['--i' as string]: i }}>
                <div className="orbit-spin">
                  <figure>
                    <Img name={t.image} alt={t.alt} priority={i < 2} sizes="(min-width: 1024px) 24vw, 50vw" className="h-full w-full object-cover" style={{ objectPosition: t.pos }} />
                    <figcaption>{t.caption}</figcaption>
                  </figure>
                </div>
              </li>
            ))}
          </ul>
          <figure className="orbit-group">
            <Img name="hero/group-banner" alt="Cedar Initiative volunteers with the Cedar banner on launch day" sizes="100vw" className="h-full w-full object-cover" />
            <figcaption className="orbit-group-caption">
              <span className="block font-display text-[clamp(1.75rem,3.4vw,3rem)] uppercase leading-none">Every one of us is a volunteer</span>
              <span className="mt-2 block text-sm text-white/80">Launch day, Dhaka · September 2025</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Evidence before claims: the period and source stay beside every figure. */}
      <section id="evidence" aria-label="Our work in numbers, with sources" className="home-evidence border-y border-ink/15 bg-paper-deep py-10 sm:py-12">
        <div className="shell">
          <ul className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {impact.map((stat) => (
              <li key={stat.label}><Stat stat={stat} /></li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. The work: panels stack as you scroll on large screens */}
      <section id="work" className="section bg-white">
        <div className="shell">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading title="Good starts with showing up." lead="A collection drive. A classroom. A day spent building something together. Here’s what that looks like on the ground." />
            <Reveal><ArrowLink href="/our-work/">All programs and reports</ArrowLink></Reveal>
          </div>
          <ul className="stack mt-12">
            {work.map((w, i) => (
              <li key={w.href} className="stack-card" style={{ ['--n' as string]: i }}>
                <article className="group relative grid overflow-hidden rounded-5xl border border-ink/10 bg-paper lg:grid-cols-2">
                  <figure className="relative overflow-hidden bg-paper-deep lg:order-2">
                    {'ext' in w ? (
                      <Img name={w.ext.src} alt={w.ext.alt} sizes="(min-width: 1024px) 45vw, 100vw" className="aspect-[4/3] h-full w-full object-cover transition duration-1000 group-hover:scale-[1.04]" />
                    ) : (
                      <Img name={w.image} alt={w.alt} sizes="(min-width: 1024px) 45vw, 100vw" className="aspect-[4/3] h-full w-full object-cover transition duration-1000 group-hover:scale-[1.04]" />
                    )}
                    <figcaption className="absolute bottom-3 left-3 rounded-full bg-ink/70 px-3 py-1 text-xs text-white backdrop-blur-sm">{w.caption}</figcaption>
                  </figure>
                  <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
                    <p aria-hidden="true" className="font-display text-6xl leading-none text-cedar-700/25">0{i + 1}</p>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-cedar-700">{w.kicker}</p>
                    <h3 className="mt-2 font-display text-[clamp(2rem,3.6vw,3.25rem)] uppercase leading-[0.95] text-ink">
                      <Link href={w.href} className="after:absolute after:inset-0">{w.title}</Link>
                    </h3>
                    <p className="t-lead mt-4">{w.body}</p>
                    <span aria-hidden="true" className="mt-8 inline-flex items-center gap-2 font-semibold text-cedar-700">
                      Read more <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="places-title" className="on-dark section bg-cedar-950 text-white">
        <div className="shell">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <h2 id="places-title" className="t-h2 max-w-xl">Rooted in Dhaka.<br />Reaching further.</h2>
            <p className="t-lead max-w-xl !text-white/75">Cedar began with local volunteers. Through ML Bangladesh, the work now connects schools and campuses in these six cities.</p>
          </div>
          <ul className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {places.map((place, i) => (
              <Reveal as="li" key={place.name} delay={i * 35} className="border-t border-white/25 pt-5">
                <h3 className="font-display text-3xl uppercase text-seedling">{place.name}</h3>
                <p className="mt-2 text-sm font-medium text-white/75">{place.when}</p>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-white/80">{place.what}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Partners and supporters */}
      <section aria-label="Sponsors and supporters" className="border-b border-ink/10 bg-white py-12">
        <p className="shell text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">Sponsored and supported by</p>
        <div className="mt-7"><LogoMarquee /></div>
      </section>

      {/* 5. Why Cedar can be trusted */}
      <section className="section bg-white">
        <div className="shell">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading title="Our work. An open book." lead="The people behind it, the money that goes into it, and the limits we’re honest about." />
            <ArrowLink href="/transparency/" className="shrink-0">Read all reports</ArrowLink>
          </div>
          <div className="mt-12 grid gap-10 lg:grid-cols-3">
            <Reveal>
              <h3 className="t-h3 text-ink">Legal status</h3>
              <p className="mt-3 text-ink-soft">
                Cedar is a volunteer group founded in {site.founded}. We are <strong className="font-semibold text-ink">not yet a registered organisation</strong>, so we
                never take donations into a personal account. We are setting up a fiscal sponsor to receive gifts for us.
              </p>
              <ArrowLink href="/give/" className="mt-4">How giving works</ArrowLink>
            </Reveal>
            <Reveal delay={90}>
              <h3 className="t-h3 text-ink">Financial reports</h3>
              <ul className="mt-3 divide-y divide-ink/10 border-y border-ink/10">
                {reports.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/${r.slug}/`} className="group flex min-h-[56px] items-center justify-between gap-4 py-3">
                      <span>
                        <span className="block font-semibold text-ink group-hover:text-cedar-700">{r.title}</span>
                        <span className="text-sm text-ink-muted">{r.kind === 'annual' ? 'Annual statement' : 'Program report'} · {money(r.spent, r.currency)} spent</span>
                      </span>
                      <Icon name="file" className="h-5 w-5 shrink-0 text-cedar-700" />
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={180}>
              <h3 className="t-h3 text-ink">The people responsible</h3>
              <p className="mt-3 text-ink-soft">Founded in {site.founded}. Cedar is led by its {founders.length} co-founders, each responsible for one part of the work.</p>
              <ul className="mt-5 grid grid-cols-1 gap-x-4 gap-y-5 xs:grid-cols-2" aria-label="Co-founders">
                {founders.map((f) => (
                  <li key={f.name} className="flex items-center gap-3">
                    <span className="shrink-0 overflow-hidden rounded-full bg-paper-deep ring-1 ring-ink/10">
                      <Img name={portraitOf(f)} alt="" sizes="56px" className="h-14 w-14 object-cover object-top" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold leading-tight text-ink">{f.name}</span>
                      <span className="block text-xs leading-snug text-ink-muted">{f.role.replace(/^Lead of /, '')}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <ArrowLink href="/our-team/" className="mt-4">Meet the team</ArrowLink>
            </Reveal>
          </div>

          <Reveal className="mt-16 border-t border-ink/10 pt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">In the press</p>
            <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
              {[...press.map((p) => ({ outlet: p.outlet, href: p.href })), ...mlbd.press.map((p) => ({ outlet: `${p.outlet} (ML Bangladesh)`, href: p.href }))].map((p) => (
                <li key={p.href}>
                  <a href={p.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center gap-2 font-semibold text-ink hover:text-cedar-700">
                    {p.outlet} <Icon name="external" className="h-4 w-4 text-ink-muted" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* 6. Latest */}
      <section className="section">
        <div className="shell">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading title="Notes from the field." />
            <Reveal><ArrowLink href="/outreach/">All stories</ArrowLink></Reveal>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 3).map((p, i) => (
              <Reveal key={p.slug} delay={i * 100} className={`h-full ${i === 2 ? 'md:hidden lg:block' : ''}`}>
                <PostCard post={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CTA id="help" />
    </>
  );
}
