import type { Metadata } from 'next';
import Img from '@/components/Img';
import Icon from '@/components/Icon';
import Reveal from '@/components/Reveal';
import Gallery from '@/components/Gallery';
import PostCard from '@/components/PostCard';
import { CTA, PageHero, SectionHeading } from '@/components/ui';
import { csedweek as c, csedGallery } from '@/lib/programs';
import { posts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Computer Science Education Week (CSEdWeek) 2025',
  description: c.short,
  alternates: { canonical: '/csedweek2025/' },
};

export default function Page() {
  const updates = posts.filter((p) => p.slug === 'cs-ed-week-2025-in-rangpur');
  return (
    <>
      <PageHero eyebrow={`${c.kicker} · ${c.status}`} title="CSEdWeek 2025" lead={c.purpose} image={c.cover} imageAlt="Students at JAAGO Foundation School Rangpur during CSEdWeek 2025" />

      <section className="section pt-0">
        <div className="shell grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="02 · Objectives" title="Program objectives" />
            <ol className="mt-8 space-y-3">
              {c.objectives.map((o, i) => (
                <Reveal as="li" key={o} delay={i * 80} className="glass flex gap-4 rounded-3xl p-5">
                  <span className="font-display text-2xl text-cedar-600">0{i + 1}</span><span className="text-ink-soft">{o}</span>
                </Reveal>
              ))}
            </ol>
          </div>
          <div>
            <SectionHeading eyebrow="03 · Scope" title="Scope of activities" lead={c.scope} />
            <Reveal as="p" className="mt-8 font-semibold text-ink">Activities include:</Reveal>
            <ul className="mt-4 space-y-3">
              {c.activities.map((a) => (
                <Reveal as="li" key={a} className="flex gap-3 text-ink-soft"><Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-cedar-600" />{a}</Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="shell grid gap-5 md:grid-cols-2">
          {[{ k: 'Sponsored by', ...c.sponsor }, { k: 'Program partner', ...c.partner }].map((p, i) => (
            <Reveal key={p.k} delay={i * 100} className="flex flex-col items-center gap-6 rounded-4xl border border-ink/10 p-10 text-center">
              <p className="t-eyebrow">{p.k}</p>
              <Img name={p.image} alt={`${p.name} logo`} sizes="320px" className="h-24 w-auto object-contain" />
              <p className="font-semibold text-ink">{p.name}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHeading eyebrow="Photo gallery" title="Rangpur" />
          <div className="mt-10"><Gallery groups={csedGallery} label="CSEdWeek photo gallery" /></div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="shell">
          <SectionHeading eyebrow="News & updates" title="From the classroom" />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {updates.map((p) => <PostCard key={p.slug} post={p} />)}
          </div>
        </div>
      </section>
      <CTA title="Bring CSEdWeek to your school." lead="Partner with Cedar Initiative to give students their first hands-on experience with coding and AI." />
    </>
  );
}
