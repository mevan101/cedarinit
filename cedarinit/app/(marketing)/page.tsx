import React from 'react';
import Hero from '@/components/Hero';
import KPI from '@/components/KPI';
import Section from '@/components/Section';
import { SiteContent } from '@/lib/types';
import content from '@/lib/content';

const HomePage: React.FC = () => {
  const { mission, founders, coreTeam, advisers } = content as SiteContent;

  return (
    <main>
      <Hero />
      <Section>
        <h2 className="text-2xl font-bold">Our Mission</h2>
        <p>{mission}</p>
      </Section>
      <KPI />
      <Section>
        <h2 className="text-2xl font-bold">Meet Our Team</h2>
        {/* Render team members here */}
      </Section>
      {/* Additional sections for values, CTAs, etc. */}
    </main>
  );
};

export default HomePage;