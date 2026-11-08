import type { Metadata } from 'next';
import Link from 'next/link';
import Img from '@/components/Img';
import ExtImg from '@/components/ExtImg';
import Icon from '@/components/Icon';
import Reveal, { RiseText } from '@/components/Reveal';
import Stat from '@/components/Stat';
import PostCard from '@/components/PostCard';
import { ArrowLink, SectionHeading } from '@/components/ui';
import { impact, press, reports, site } from '@/lib/site';
import { founders } from '@/lib/team';
import { mlbd } from '@/lib/mlbd';
import { posts } from '@/lib/posts';

export const metadata: Metadata = {
  title: { absolute: 'Cedar Initiative: youth-led nonprofit in Bangladesh' },
  description:
    'Student volunteers in Bangladesh running winter relief in Dhaka, computer science classes in Rangpur and free AI hackathons on campuses through ML Bangladesh.',
  alternates: { canonical: '/' },
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

const paths = [
  { href: '/give/', title: 'Give', body: 'Pay for warm clothes, transport and teaching materials. Every campaign gets a public financial report.', cta: 'How giving works' },
  { href: '/volunteer/', title: 'Volunteer', body: 'Help at a collection drive, teach a session, or run a hackathon. Pick one event or stay on for a season.', cta: 'See volunteer roles' },
  { href: '/partner/', title: 'Partner', body: 'Schools, universities, NGOs and companies: host a program, co-run a campaign, or sponsor one.', cta: 'How partnerships work' },
];

export default function Home() {
  return (
    <>
      {/* 1. What Cedar does */}
      <section className="hero-pad relative pb-14 pt-28 sm:pb-20 sm:pt-36 lg:pt-40">
        <div className="shell hero-grid fold-split">
          <div className="hero-copy">
            <Reveal as="p" className="t-eyebrow hide-tiny mb-5">Be the force for good</Reveal>
            <RiseText as="h1" text="Youth-led relief and STEM education across Bangladesh" className="t-display text-ink" />
            <Reveal as="p" delay={300} className="hero-lead t-lead measure mt-6">
              We&rsquo;re student volunteers. Last winter we brought warm clothes to families in Dhaka&rsquo;s Karail slum and ran a computer
              science week in Rangpur. Through ML Bangladesh, we now run free AI hackathons on campuses across the country.
            </Reveal>
            <Reveal delay={400} className="hero-cta mt-8 flex flex-col gap-3 xs:flex-row">
              <Link href="#work" className="btn-primary">
                See our work <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <Link href="#help" className="btn-glass">
                Ways to help
              </Link>
            </Reveal>
          </div>
          <figure className="hero-photo-wrap">
            <div className="overflow-hidden rounded-4xl bg-paper-deep">
              <Img
                name="ushnota/day-4a"
                alt="Schoolgirls queue to hand over winter clothes to Cedar volunteers at a collection table"
                priority
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="hero-photo focus-in aspect-[4/3] h-full w-full object-cover lg:aspect-[4/5]"
              />
            </div>
            <figcaption className="figcap">Collection drive at Tejgaon Government Girls High School, Dhaka · November 2025</figcaption>
          </figure>
        </div>
      </section>

      {/* 2. The work, with photos and places */}
      <section id="work" className="section bg-white">
        <div className="shell">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading eyebrow="What we do" title="Three programs, real places" />
            <Reveal><ArrowLink href="/our-work/">All programs and reports</ArrowLink></Reveal>
          </div>
          <ul className="mt-12 grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {work.map((w, i) => (
              <Reveal as="li" key={w.href} delay={i * 90} className={i === 1 ? 'md:order-first lg:order-none' : ''}>
                <article className="group relative flex h-full flex-col">
                  <figure>
                    <div className="overflow-hidden rounded-3xl bg-paper-deep">
                      {'ext' in w ? (
                        <ExtImg src={w.ext.src} alt={w.ext.alt} className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                      ) : (
                        <Img name={w.image} alt={w.alt} sizes="(min-width: 1024px) 30vw, (min-width: 768px) 50vw, 100vw" className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                      )}
                    </div>
                    <figcaption className="figcap">{w.caption}</figcaption>
                  </figure>
                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-cedar-700">{w.kicker}</p>
                  <h3 className="t-h3 mt-2 text-ink">
                    <Link href={w.href} className="after:absolute after:inset-0">{w.title}</Link>
                  </h3>
                  <p className="mt-3 flex-1 text-ink-soft">{w.body}</p>
                  <span aria-hidden="true" className="mt-5 inline-flex items-center gap-2 font-semibold text-cedar-700">
                    Read more <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. Proof, every number with its period and source */}
      <section className="on-dark section bg-cedar-950 text-white">
        <div className="shell">
          <SectionHeading tone="dark" eyebrow="The evidence" title="What the work adds up to" lead="Each figure shows when it was counted and where it comes from. Follow the source to check it." />
          <ul className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {impact.map((s, i) => (
              <Reveal as="li" key={s.label} delay={i * 80}>
                <Stat stat={s} tone="dark" />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. How to help: three separate paths */}
      <section id="help" className="section">
        <div className="shell">
          <SectionHeading eyebrow="How to help" title="Give, volunteer or partner" lead="Three separate paths. Pick the one that fits and you’ll only see what you need." />
          <ul className="mt-12 grid gap-4 md:grid-cols-3">
            {paths.map((p, i) => (
              <Reveal as="li" key={p.href} delay={i * 90}>
                <Link href={p.href} className="group flex h-full flex-col rounded-[var(--radius-card)] border border-ink/10 bg-white p-7 transition hover:border-cedar-700/40 sm:p-8">
                  <span className="font-display text-4xl uppercase text-ink">{p.title}</span>
                  <span className="mt-4 flex-1 text-ink-soft">{p.body}</span>
                  <span className="mt-6 inline-flex items-center gap-2 font-semibold text-cedar-700">
                    {p.cta} <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. Why Cedar can be trusted */}
      <section className="section bg-white">
        <div className="shell">
          <SectionHeading eyebrow="Accountability" title="Who we are, in plain terms" />
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
                        <span className="text-sm text-ink-muted">{r.subtitle}</span>
                      </span>
                      <Icon name="file" className="h-5 w-5 shrink-0 text-cedar-700" />
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={180}>
              <h3 className="t-h3 text-ink">The people responsible</h3>
              <ul className="mt-4 flex -space-x-3" aria-label="Founding team">
                {founders.map((f) => (
                  <li key={f.name} className="overflow-hidden rounded-full border-4 border-white bg-paper-deep">
                    <Img name={f.photo} alt={`${f.name}, ${f.badge ?? f.role}`} sizes="64px" className="h-16 w-16 object-cover" />
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-ink-soft">
                Founded by {site.founder} with three co-founders, each leading one area: programs, IT and communication, innovation, and policy.
              </p>
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
            <SectionHeading eyebrow="From the field" title="Latest stories" />
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
    </>
  );
}
