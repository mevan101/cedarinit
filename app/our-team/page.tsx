import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import PersonCard from '@/components/PersonCard';
import { CTA, PageHero, SectionHeading } from '@/components/ui';
import { advisers, coreTeam } from '@/lib/team';

export const metadata: Metadata = {
  title: 'Our team',
  description: 'Meet the founders, team members and advisers who power Cedar Initiative.',
  alternates: { canonical: '/our-team/' },
};

export default function TeamPage() {
  const founders = coreTeam.filter((p) => p.founderRole);
  const members = coreTeam.filter((p) => !p.founderRole);
  return (
    <>
      <PageHero eyebrow="Our team" title="The people behind the purpose" lead="A volunteer team of students, researchers and young professionals — united by the belief that change begins with people who care." />
      <section className="section pt-0">
        <div className="shell">
          <SectionHeading eyebrow="Founders" title="Founding team" />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {founders.map((p, i) => (
              <Reveal as="li" key={p.name} delay={i * 80}><PersonCard person={p} large /></Reveal>
            ))}
          </ul>
        </div>
      </section>
      <section className="section bg-white">
        <div className="shell">
          <SectionHeading eyebrow="Core team" title="Team members" />
          <ul className="mt-10 grid gap-5 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {members.map((p, i) => (
              <Reveal as="li" key={p.name} delay={i * 70}><PersonCard person={p} /></Reveal>
            ))}
          </ul>
        </div>
      </section>
      <section className="section">
        <div className="shell">
          <SectionHeading eyebrow="Advisory" title="Advisers" />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {advisers.map((p) => (
              <Reveal as="li" key={p.name}><PersonCard person={p} /></Reveal>
            ))}
          </ul>
        </div>
      </section>
      <CTA title="Join the team." lead="We’re always looking for volunteers, researchers, designers, organisers and storytellers." />
    </>
  );
}
