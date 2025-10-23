import React from 'react';
import { Section } from '@/components/Section';
import { SafeImage } from '@/components/SafeImage';
import { content } from '@/lib/content';

const AboutPage = () => {
  return (
    <Section>
      <h1 className="text-4xl font-bold mb-4">About Us</h1>
      <p className="mb-6">{content.mission}</p>
      <h2 className="text-2xl font-semibold mb-2">Our Goals</h2>
      <p className="mb-4">We aim to achieve the following pillars:</p>
      <ul className="list-disc list-inside mb-6">
        <li>Goal 1: Description</li>
        <li>Goal 2: Description</li>
        <li>Goal 3: Description</li>
      </ul>
      <h2 className="text-2xl font-semibold mb-2">Transparent Operations</h2>
      <p>{content.transparentOps}</p>
      <h2 className="text-2xl font-semibold mb-2">Meet Our Team</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {content.founders.map((member) => (
          <div key={member.name} className="border rounded-lg p-4">
            <SafeImage src={member.img} alt={member.name} className="rounded-full mb-2" />
            <h3 className="font-bold">{member.name}</h3>
            <p>{member.role}</p>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default AboutPage;