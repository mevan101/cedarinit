import type { Metadata } from 'next';
import Link from 'next/link';
import Icon from '@/components/Icon';
import RoleFinder from '@/components/RoleFinder';
import { FieldHero } from '@/components/ui';
import { opportunities } from '@/lib/opportunities';

export const metadata: Metadata = {
  title: 'Volunteer roles in Bangladesh',
  description: 'Open volunteer roles at Cedar Initiative: winter relief in Dhaka, teaching coding in schools, running AI hackathons with ML Bangladesh, communications and research.',
  alternates: { canonical: '/opportunities/' },
};

export default function OpportunitiesPage() {
  const open = opportunities.filter((o) => o.status === 'open');
  return (
    <>
      <FieldHero title="Find your kind of useful" lead="Find a role that fits your skills, your place and the time you have. Read the details first. You’ll only need an account when you apply." image="ushnota/day-4a" alt="Students hand over winter clothing to Cedar volunteers at a school collection table" caption="Winter clothes collection, Dhaka · Ushnota Abhijan 2025">
        <div className="flex flex-col gap-3 xs:flex-row">
          <a href="#roles" className="btn-primary">Explore {open.length} open {open.length === 1 ? 'role' : 'roles'} <Icon name="arrow" className="h-4 w-4" /></a>
          <Link href="/volunteer/" className="btn-glass">How volunteering works</Link>
        </div>
      </FieldHero>
      <section id="roles" aria-label="Volunteer roles" className="pb-[var(--section-y)]">
        <div className="shell">
          <RoleFinder roles={opportunities.map(({ slug, title, summary, program, location, commitment, status, areas }) => ({ slug, title, summary, program, location, commitment, status, areas }))} />
        </div>
      </section>
    </>
  );
}
