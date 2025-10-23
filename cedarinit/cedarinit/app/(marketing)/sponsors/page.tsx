import React from 'react';
import { Section } from '@/components/Section';
import { Card } from '@/components/Card';
import { SafeLink } from '@/components/SafeLink';
import { content } from '@/lib/content';

const SponsorsPage = () => {
  return (
    <Section title="Our Sponsors" description="Meet the organizations that support our mission.">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.sponsors.map((sponsor) => (
          <Card key={sponsor.name} title={sponsor.name} image={sponsor.logo}>
            <p>{sponsor.description}</p>
            <SafeLink href={sponsor.website} target="_blank" rel="noopener noreferrer">
              Learn more
            </SafeLink>
          </Card>
        ))}
      </div>
    </Section>
  );
};

export default SponsorsPage;