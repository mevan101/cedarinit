import React from 'react';
import { TeamMember, SiteContent } from '@/lib/types';
import { content } from '@/lib/content';
import Section from '@/components/Section';
import Card from '@/components/Card';

const TeamPage: React.FC = () => {
  const { founders, coreTeam, advisers } = content;

  const renderTeamMembers = (members: TeamMember[]) => {
    return members.map((member) => (
      <Card key={member.name} title={member.name} image={member.img} description={member.role} />
    ));
  };

  return (
    <Section title="Meet Our Team">
      <h2 className="text-2xl font-bold mb-4">Founders</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {renderTeamMembers(founders)}
      </div>
      <h2 className="text-2xl font-bold mt-8 mb-4">Core Team</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {renderTeamMembers(coreTeam)}
      </div>
      <h2 className="text-2xl font-bold mt-8 mb-4">Advisers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {renderTeamMembers(advisers)}
      </div>
    </Section>
  );
};

export default TeamPage;