import type { Metadata } from 'next';
import NewsList from '@/components/NewsList';
import Reveal from '@/components/Reveal';
import GlassCard from '@/components/GlassCard';
import Icon from '@/components/Icon';
import { CTA, PageHero, SectionHeading } from '@/components/ui';
import { categories, posts } from '@/lib/posts';
import { press, site } from '@/lib/site';
import JsonLd, { breadcrumb } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Outreach & news',
  description: 'Stories, campaign diaries, achievements and press coverage from Cedar Initiative.',
  alternates: { canonical: '/outreach/' },
};

export default function OutreachPage() {
  return (
    <>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Outreach & news',
            url: `${site.url}/outreach/`,
            description: 'Stories, campaign diaries, achievements and press coverage from Cedar Initiative.',
            isPartOf: { '@type': 'WebSite', name: site.name, url: site.url },
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: posts.slice(0, 20).map((p, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                url: `${site.url}/${p.slug}/`,
                name: p.title,
              })),
            },
          },
          breadcrumb([{ name: 'Home', path: '/' }, { name: 'News', path: '/outreach/' }], site.url),
        ]}
      />
      <PageHero eyebrow="Outreach" title="Stories from the field" lead="Campaign diaries, milestones and press coverage, written by the volunteers who were there." />
      <section className="pb-[var(--section-y)]">
        <div className="shell"><NewsList posts={posts.map((p) => ({ ...p, html: "", sourceTitle: "" }))} categories={categories} /></div>
      </section>
      <section className="section bg-white">
        <div className="shell">
          <SectionHeading eyebrow="Press" title="Media coverage" />
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {press.map((p, i) => (
              <Reveal as="li" key={p.outlet} delay={i * 100}>
                <a href={p.href} target="_blank" rel="noopener noreferrer" className="group block h-full">
                  <GlassCard className="flex h-full flex-col gap-5 p-7">
                    <p className="font-display text-2xl uppercase text-cedar-700">{p.outlet}</p>
                    <p lang={p.lang} className="flex-1 text-lg font-medium leading-snug text-ink">“{p.title}”</p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft group-hover:text-cedar-700">
                      Read the coverage <Icon name="external" className="h-4 w-4" /><span className="sr-only">(opens in a new tab)</span>
                    </span>
                  </GlassCard>
                </a>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
      <CTA />
    </>
  );
}
