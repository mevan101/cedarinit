import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import PersonCard from '@/components/PersonCard';
import { CTA, PageHero, SectionHeading } from '@/components/ui';
import { teams } from '@/lib/team';

export const metadata: Metadata = {
  title: 'Our team',
  description: 'The founders, team members, ML Bangladesh volunteers, campus ambassadors and advisers who run Cedar Initiative, grouped by team.',
  alternates: { canonical: '/our-team/' },
};

export default function TeamPage() {
  const shown = teams.filter((t) => t.members.length > 0);
  return (
    <>
      <PageHero eyebrow="Our team" title="The people behind the work" lead="Students, researchers and young professionals, all volunteers. Each team has a lead you can contact.">
        <nav aria-label="Teams" className="flex flex-wrap gap-2">
          {shown.map((t) => (
            <a key={t.slug} href={`#${t.slug}`} className="inline-flex min-h-[44px] items-center rounded-full border border-ink/15 bg-white px-4 text-sm font-semibold text-ink-soft hover:border-cedar-700/40 hover:text-ink">
              {t.name}
            </a>
          ))}
        </nav>
      </PageHero>
      {shown.map((t, ti) => (
        <section key={t.slug} id={t.slug} className={`section ${ti === 0 ? 'pt-0' : ''} ${ti % 2 ? 'bg-white' : ''}`}>
          <div className="shell">
            <SectionHeading title={t.name} lead={t.description || undefined} />
            <ul className={`mt-10 grid gap-5 ${t.layout === 'large' ? 'sm:grid-cols-2 lg:grid-cols-4' : 'xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'}`}>
              {t.members.map((p, i) => (
                <Reveal as="li" key={p.name} delay={(i % 5) * 70}>
                  <PersonCard person={p} large={t.layout === 'large'} />
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      ))}
      <CTA title="Join the team" lead="We’re looking for volunteers, researchers, designers, organisers and storytellers." />
    </>
  );
}
