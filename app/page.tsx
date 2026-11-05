import Link from 'next/link';
import Img from '@/components/Img';
import Icon from '@/components/Icon';
import Reveal, { RiseText } from '@/components/Reveal';
import Counter from '@/components/Counter';
import GlassCard from '@/components/GlassCard';
import PostCard from '@/components/PostCard';
import { Aurora, ArrowLink, CTA, SectionHeading } from '@/components/ui';
import { about, impact, joinOptions, press, site, wings } from '@/lib/site';
import { programs } from '@/lib/programs';
import { posts } from '@/lib/posts';

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pb-16 pt-32 sm:pt-40 lg:min-h-[100svh] lg:pb-24">
        <Aurora />
        <div className="shell relative grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6 xl:col-span-6">
            <Reveal as="p" className="chip mb-6">
              <span className="h-2 w-2 rounded-full bg-cedar-500 shadow-[0_0_0_4px_rgb(var(--cedar-500)/0.2)]" aria-hidden="true" />
              Youth-led · Volunteer-powered · Bangladesh
            </Reveal>
            <RiseText as="h1" text="Be the force for good" className="t-display text-ink" />
            <Reveal as="p" delay={350} className="t-lead mt-7 max-w-xl">
              {site.promise} We are a youth-led movement turning climate action, education, wellness and innovation into
              real change for communities across Bangladesh. <span className="font-semibold text-ink">{site.subTagline}</span>
            </Reveal>
            <Reveal delay={450} className="mt-9 flex flex-col gap-3 xs:flex-row">
              <Link href="/our-work/" className="btn-primary">
                See our work <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <a href={site.volunteerForm} target="_blank" rel="noopener noreferrer" className="btn-glass">
                Join as a volunteer <Icon name="external" className="h-4 w-4" />
              </a>
            </Reveal>
          </div>

          <div className="relative lg:col-span-6">
            <Reveal variant="mask" delay={200} className="relative overflow-hidden rounded-5xl shadow-[0_50px_100px_-40px_rgb(var(--cedar-950)/0.55)]">
              <div className="aspect-[4/5] sm:aspect-[16/12] lg:aspect-[4/5]">
                <Img name="hero/group-banner" alt="Cedar Initiative volunteers and students gathered together at a community event" priority sizes="(min-width: 1024px) 50vw, 100vw" className="h-full w-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-cedar-950/45 via-transparent to-transparent" />
            </Reveal>
            <Reveal delay={600} className="absolute -bottom-6 left-4 right-4 xs:left-auto xs:right-6 xs:w-[18rem] sm:-left-6 sm:right-auto lg:-left-10">
              <GlassCard className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cedar-700">Impact so far</p>
                <p className="mt-1 font-display text-5xl text-ink"><Counter value={4250} suffix="+" /></p>
                <p className="text-sm text-ink-soft">people reached through our programs</p>
              </GlassCard>
            </Reveal>
            <Reveal delay={750} className="absolute -top-5 right-4 hidden sm:block lg:-right-4">
              <GlassCard className="flex items-center gap-3 p-3 pr-5">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-cedar-700 text-white"><Icon name="leaf" /></span>
                <span className="text-sm"><span className="block font-semibold text-ink">Ushnota Abhijan</span><span className="text-ink-muted">Winter campaign · live</span></span>
              </GlassCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Mission statement */}
      <section className="section pt-20">
        <div className="shell">
          <Reveal as="p" className="t-eyebrow">Our mission</Reveal>
          <Reveal as="p" delay={100} className="mt-6 max-w-5xl text-[clamp(1.6rem,3.6vw,3.25rem)] font-medium leading-[1.15] tracking-[-0.025em] text-ink">
            {about.mission.replace('.', '')}<span className="text-cedar-600">.</span>{' '}
            <span className="text-ink-muted">A world where youth and communities lead sustainable progress — with resilience, equity and well-being for all.</span>
          </Reveal>
        </div>
      </section>

      {/* Impact */}
      <section aria-labelledby="impact-title" className="pb-[var(--section-y)]">
        <div className="shell">
          <h2 id="impact-title" className="sr-only">Our impact in numbers</h2>
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
            {impact.map((m, i) => (
              <Reveal as="li" key={m.label} delay={i * 80} className={i === 0 ? 'col-span-2 md:col-span-1' : ''}>
                <GlassCard className="flex h-full flex-col justify-between gap-6 p-6 sm:p-7">
                  <span className="font-display text-[clamp(2.75rem,5vw,4rem)] leading-none text-cedar-700">
                    <Counter value={m.value} suffix={'suffix' in m ? m.suffix : ''} />
                  </span>
                  <span className="text-sm font-medium text-ink-soft">{m.label}</span>
                </GlassCard>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Who we are */}
      <section className="section bg-white">
        <div className="shell grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal variant="left" className="relative">
            <div className="overflow-hidden rounded-5xl">
              <div className="aspect-[5/4]">
                <Img name="about/who-we-are" alt="Members of Cedar Initiative during a community session" className="parallax h-full w-full object-cover" />
              </div>
            </div>
            <div className="absolute -bottom-8 -right-2 hidden w-44 overflow-hidden rounded-3xl border-4 border-white shadow-xl sm:block lg:-right-8 lg:w-52">
              <Img name="hero/circle-session" alt="" sizes="200px" className="aspect-square h-full w-full object-cover" />
            </div>
          </Reveal>
          <div>
            <SectionHeading eyebrow="Who we are" title="Rooted in community, built to last" lead={about.whoWeAre} />
            <Reveal delay={200} className="mt-6 text-ink-soft">{about.whoWeAre2}</Reveal>
            <Reveal delay={300} className="mt-8"><ArrowLink href="/about-us/">More about Cedar</ArrowLink></Reveal>
          </div>
        </div>
      </section>

      {/* Wings */}
      <section className="section relative overflow-hidden">
        <div className="shell">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <SectionHeading eyebrow="Programmatic wings" title="Four wings. One movement." lead="Every initiative we run grows from one of four focus areas, so effort compounds into lasting change." />
          </div>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {wings.map((w, i) => (
              <Reveal key={w.title} delay={i * 90} className="h-full">
                <GlassCard className="group flex h-full flex-col gap-10 p-7">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-cedar-700 text-white shadow-lg shadow-cedar-700/30 transition duration-500 group-hover:rotate-[-6deg] group-hover:scale-110">
                    <Icon name={w.icon} className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="font-display text-sm text-cedar-600">0{i + 1}</p>
                    <h3 className="t-h3 mt-2 text-ink">{w.title}</h3>
                    <p className="mt-3 text-[0.97rem] leading-relaxed text-ink-soft">{w.body}</p>
                  </div>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="on-dark section relative overflow-hidden bg-cedar-950 text-white">
        <Aurora tone="dark" />
        <div className="shell relative">
          <SectionHeading tone="dark" eyebrow="Key programs" title="Work that meets people where they are" lead="From winter relief in Dhaka’s slums to AI classrooms in Rangpur — our programs are designed with communities, delivered by volunteers and reported in the open." />
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {programs.map((p, i) => (
              <Reveal key={p.slug} delay={i * 120} variant="zoom">
                <Link href={`/${p.slug}/`} className="group relative block overflow-hidden rounded-5xl">
                  <div className="aspect-[4/5] xs:aspect-[4/3]">
                    <Img name={p.cover} alt="" sizes="(min-width: 1024px) 50vw, 100vw" className="h-full w-full object-cover transition duration-1000 ease-out group-hover:scale-105" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-cedar-950 via-cedar-950/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
                    <span className="chip !border-white/20 !bg-white/10 !text-white backdrop-blur">{p.status}</span>
                    <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-cedar-300">{p.kicker}</p>
                    <h3 className="mt-2 font-display text-[clamp(2rem,4vw,3.25rem)] uppercase leading-none text-white">{p.title}</h3>
                    <p className="mt-4 max-w-lg text-white/75">{p.short}</p>
                    <span className="mt-6 inline-flex items-center gap-2 font-semibold text-white">
                      Explore program <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Get involved */}
      <section className="section">
        <div className="shell">
          <SectionHeading align="center" eyebrow="Get involved" title="There’s a place for you here" lead="Whether you have an hour, a skill or a monthly gift to share, you can help a youth-led movement grow." />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {joinOptions.map((o, i) => (
              <Reveal key={o.title} delay={i * 90}>
                <article className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[0_20px_40px_-28px_rgb(var(--cedar-950)/0.35)]">
                  <div className="grain relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-cedar-600 via-cedar-700 to-cedar-900">
                    <Img name={o.image} alt="" sizes="200px" className="h-full w-full object-contain p-8 transition duration-700 group-hover:scale-110 group-hover:-rotate-3" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="t-h3 text-ink">{o.title}</h3>
                    <p className="mt-2 flex-1 text-[0.97rem] text-ink-soft">{o.body}</p>
                    {'external' in o && o.external ? (
                      <a href={o.href} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 font-semibold text-cedar-700 after:absolute after:inset-0">
                        {o.cta} <Icon name="external" className="h-4 w-4" /><span className="sr-only"> (opens Google Form in a new tab)</span>
                      </a>
                    ) : (
                      <Link href={o.href} className="mt-5 inline-flex items-center gap-2 font-semibold text-cedar-700 after:absolute after:inset-0">
                        {o.cta} <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section className="section bg-white">
        <div className="shell">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading eyebrow="News & updates" title="Latest from the field" />
            <Reveal><ArrowLink href="/outreach/">All stories</ArrowLink></Reveal>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 3).map((p, i) => (
              <Reveal key={p.slug} delay={i * 100} className="h-full"><PostCard post={p} /></Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Press */}
      <section className="section">
        <div className="shell">
          <SectionHeading eyebrow="In the media" title="As featured in" />
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {press.map((p, i) => (
              <Reveal as="li" key={p.outlet} delay={i * 100}>
                <a href={p.href} target="_blank" rel="noopener noreferrer" className="group block h-full">
                  <GlassCard className="flex h-full flex-col gap-5 p-7">
                    <p className="font-display text-2xl uppercase text-cedar-700">{p.outlet}</p>
                    <p lang={p.lang} className="flex-1 text-lg font-medium leading-snug text-ink">“{p.title}”</p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft group-hover:text-cedar-700">
                      Read the coverage <Icon name="external" className="h-4 w-4" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </span>
                  </GlassCard>
                </a>
              </Reveal>
            ))}
          </ul>
          <Reveal className="mt-16 overflow-hidden rounded-4xl bg-white p-4 sm:p-6">
            <p className="mb-4 text-center text-sm font-medium text-ink-muted">Our work advances the UN Sustainable Development Goals</p>
            <Img name="sdg/strip" alt="UN Sustainable Development Goals icons" sizes="100vw" className="mx-auto h-auto w-full max-w-5xl" />
          </Reveal>
        </div>
      </section>

      <CTA />
    </>
  );
}
