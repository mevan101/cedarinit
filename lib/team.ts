import data from '@/content/team.json';

export type Person = { name: string; role: string; badge?: string; photo: string; facebook?: string; linkedin?: string; email?: string; bio?: string };
export type Team = { name: string; slug: string; description?: string; layout?: 'large' | 'grid'; members: Person[] };

/** Teams and members are edited in the CMS (Team collection, content/team.json). */
export const teams = (data as { teams: Team[] }).teams;
export const founders = teams.find((t) => t.slug === 'founders')?.members ?? [];
export const getTeam = (slug: string) => teams.find((t) => t.slug === slug);

export const foundingStory = [
  'Cedar Initiative was born from real experiences — from moments when each of us felt something was missing and wanted to make it right.',
  'Evan was a backbencher in class. Opportunities were rarely shared with him, and he often felt left out. That experience stayed with him. It made him believe that chances to grow should not depend on where you sit, who you know, or where you come from. He wants Cedar to be a place where everyone gets access to mentorship, learning, and guidance, even if they can’t afford it. He believes that technology can open doors for people who are usually left behind.',
  'Sharafat worked in different organizations and saw how easily trust can break when there’s no openness. He felt deeply that transparency and accountability are not optional — they are necessary. That’s why he joined Cedar: to help build an organization that people can believe in, one that is honest in action and purpose.',
  'Durjoy came with experience in climate action and a background in law. He knows that good intentions need strong foundations. He wants to help shape Cedar so it runs fairly, ethically, and sustainably, creating systems that last and truly serve people and the planet.',
  'Sabbir brings light to the team. He believes work should inspire and also bring joy. With his curiosity and focus on the Sustainable Development Goals, he makes sure Cedar keeps learning, stays creative, and always connects its work to real impact.',
];

export const nameStory = [
  'Choosing the name was also a fun story. Evan once lived in a place in the United States called Cedar Rapids. That one year was full of challenges and lessons, but it helped him grow stronger and more resilient. He always dreamed of starting an organization that values technology and innovation, not just advocacy. He shared this idea with these amazing people, and together they met several times, did research, spoke with others, and slowly shaped their vision.',
  'There were many discussions about the name, but “Cedar” felt right. A cedar tree stands for growth, resilience, health, friendship, love, care, and life. These are the same values the team wants to bring into their work.',
  'Together, they started Cedar Initiative because they have all seen what’s missing, and they want to fill that gap with hope, honesty, and opportunity. Their dream is simple: to build a community where everyone gets a chance to grow, where help is never out of reach, and where change begins with people who care.',
];
