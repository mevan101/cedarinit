import type { Metadata } from 'next';
import Img from '@/components/Img';
import Reveal from '@/components/Reveal';
import GlassCard from '@/components/GlassCard';
import { CTA, PageHero, SectionHeading } from '@/components/ui';
import { about, values, wings } from '@/lib/site';
import { founders, foundingStory, nameStory, portraitOf } from '@/lib/team';
import Icon from '@/components/Icon';

export const metadata: Metadata = {
  title: 'About us',
  description: 'Who we are, our vision, mission, values and the story behind the name Cedar Initiative.',
  alternates: { canonical: '/about-us/' },
};

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About us" title="Grown from real experiences" lead={about.whoWeAre} image="about/collage" imageAlt="Collage of Cedar Initiative volunteers, events and community work" />

      <section className="section pt-0">
        <div className="shell grid gap-5 md:grid-cols-2">
          {[{ k: 'Vision', v: about.vision, icon: 'spark' }, { k: 'Mission', v: about.mission, icon: 'leaf' }].map((x, i) => (
            <Reveal key={x.k} delay={i * 120}>
              <GlassCard className="flex h-full flex-col gap-6 p-8 sm:p-10">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cedar-700 text-white"><Icon name={x.icon} /></span>
                <h2 className="t-h2 !text-4xl text-ink">Our {x.k}</h2>
                <p className="text-xl leading-relaxed text-ink-soft">{x.v}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section bg-white">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <SectionHeading eyebrow="Our story" title="Why Cedar exists" />
              <p className="mt-5 text-ink-soft">Why each co-founder started Cedar, in their own words.</p>
              <Reveal delay={200} className="mt-8 hidden overflow-hidden rounded-4xl lg:block">
                <Img name="launch/circle-1" alt="Founding members of Cedar Initiative at the launch event" sizes="30vw" className="aspect-[4/5] w-full object-cover" />
              </Reveal>
            </div>
          </div>
          <div className="space-y-6 text-lg leading-[1.8] text-ink-soft lg:col-span-7 lg:col-start-6">
            <Reveal as="p" className="text-2xl font-medium leading-snug tracking-[-0.015em] text-ink">{foundingStory[0]}</Reveal>
            <ul className="!mt-12 space-y-10">
              {foundingStory.slice(1).map((para) => {
                const f = founders.find((x) => x.name.split(' ').some((n) => para.startsWith(`${n} `)));
                return (
                  <Reveal as="li" key={para.slice(0, 20)} className="grid gap-5 sm:grid-cols-[9rem_1fr] sm:gap-7">
                    {f && (
                      <div>
                        <div className="overflow-hidden rounded-3xl bg-paper-deep">
                          <Img name={portraitOf(f)} alt={`Portrait of ${f.name}`} sizes="144px" className="aspect-[4/5] w-full object-cover object-top" />
                        </div>
                        <p className="mt-3 text-sm font-semibold leading-tight text-ink">{f.name}</p>
                        <p className="text-xs leading-snug text-ink-muted">{f.badge} · {f.role.replace(/^Lead of /, '')}</p>
                      </div>
                    )}
                    <p>{para}</p>
                  </Reveal>
                );
              })}
            </ul>
            <Reveal as="h3" className="t-h3 !mt-14 text-ink">The story behind the name</Reveal>
            {nameStory.map((p, i) => (
              <Reveal as="p" key={`n${i}`}>{p}</Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHeading eyebrow="Core values" title="What we stand on" lead="Six commitments that shape every program, partnership and decision." />
          <ol className="mt-14 grid gap-px overflow-hidden rounded-4xl bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v, i) => (
              <Reveal as="li" key={v.title} delay={(i % 3) * 90} className="bg-paper p-8 transition-colors hover:bg-white sm:p-10">
                <p className="font-display text-5xl text-cedar-200">0{i + 1}</p>
                <h3 className="t-h3 mt-6 text-ink">{v.title}</h3>
                <p className="mt-3 text-ink-soft">{v.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section bg-white">
        <div className="shell">
          <SectionHeading eyebrow="Programmatic wings" title="How we organise our work" />
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {wings.map((w, i) => (
              <Reveal key={w.title} delay={(i % 2) * 100}>
                <div className="flex gap-5 rounded-4xl border border-ink/10 p-7">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cedar-50 text-cedar-700"><Icon name={w.icon} /></span>
                  <div>
                    <h3 className="t-h3 text-ink">{w.title}</h3>
                    <p className="mt-2 text-ink-soft">{w.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
