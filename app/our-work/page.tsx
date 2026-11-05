import type { Metadata } from 'next';
import Link from 'next/link';
import Img from '@/components/Img';
import Icon from '@/components/Icon';
import Reveal from '@/components/Reveal';
import PostCard from '@/components/PostCard';
import { CTA, PageHero, SectionHeading } from '@/components/ui';
import { programs } from '@/lib/programs';
import { posts } from '@/lib/posts';
import { reports } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Our work',
  description: 'Programs, campaigns and financial reports from Cedar Initiative — including Ushnota Abhijan 2025 and CSEdWeek 2025.',
  alternates: { canonical: '/our-work/' },
};

export default function WorkPage() {
  return (
    <>
      <PageHero eyebrow="Our work" title="Built by you, powered by purpose" lead="Every program is designed with the community it serves, delivered by volunteers, and reported openly." />

      <section className="pb-[var(--section-y)]">
        <div className="shell space-y-6">
          {programs.map((p, i) => (
            <Reveal key={p.slug} variant="zoom">
              <article className="group grid overflow-hidden rounded-5xl bg-white shadow-[0_30px_60px_-40px_rgb(var(--cedar-950)/0.5)] lg:grid-cols-2">
                <div className={`relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:min-h-[32rem] ${i % 2 ? 'lg:order-2' : ''}`}>
                  <Img name={p.cover} alt="" sizes="(min-width: 1024px) 50vw, 100vw" className="absolute inset-0 h-full w-full object-cover transition duration-1000 group-hover:scale-105" />
                </div>
                <div className="flex flex-col justify-center gap-5 p-8 sm:p-12 lg:p-16">
                  <span className="chip w-fit">{p.status}</span>
                  <p className="t-eyebrow">{p.kicker}</p>
                  <h2 className="t-h2 text-ink">{p.title}</h2>
                  <p className="t-lead">{p.short}</p>
                  <Link href={`/${p.slug}/`} className="btn-primary mt-3 w-full xs:w-fit">
                    Explore {p.title} <Icon name="arrow" className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section bg-white" id="reports">
        <div className="shell">
          <SectionHeading eyebrow="Transparency" title="Financial reports" lead="We publish what we raise and how it is spent, so every supporter can see their impact." />
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {reports.map((r, i) => (
              <Reveal as="li" key={r.slug} delay={i * 100}>
                <Link href={`/${r.slug}/`} className="group flex items-center gap-5 rounded-4xl border border-ink/10 p-6 transition hover:border-cedar-500/40 hover:bg-cedar-50/50 sm:p-8">
                  <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cedar-700 text-white"><Icon name="file" className="h-6 w-6" /></span>
                  <span className="flex-1">
                    <span className="block text-lg font-semibold text-ink">{r.title}</span>
                    <span className="text-sm text-ink-muted">{r.subtitle} · PDF</span>
                  </span>
                  <Icon name="arrow" className="h-5 w-5 text-cedar-700 transition group-hover:translate-x-1" />
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHeading eyebrow="News & updates" title="From the programs" />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.filter((p) => p.category !== 'News').slice(0, 6).map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 100} className="h-full"><PostCard post={p} /></Reveal>
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
