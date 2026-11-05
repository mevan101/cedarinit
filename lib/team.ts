export type Person = {
  name: string;
  role: string;
  founderRole?: string;
  image: string;
  facebook?: string;
  linkedin?: string;
};

export const advisers: Person[] = [
  { name: 'Luke Palandech', role: 'Teacher, Prairie Hill Elementary School, Cedar Rapids, IA, USA', image: 'team/luke-palandech' },
];

export const coreTeam: Person[] = [
  { name: 'Shahriar Azad Evan', role: 'Lead of Program & Partnership', founderRole: 'Founder', image: 'team/shahriar-azad-evan', facebook: 'https://www.facebook.com/shahriarazadevan', linkedin: 'https://www.linkedin.com/in/msaevan101' },
  { name: 'Sharafat Karim', role: 'Lead of IT & Communication', founderRole: 'Co-Founder', image: 'team/sharafat-karim', facebook: 'https://www.facebook.com/sharafatkarim.bd', linkedin: 'https://www.linkedin.com/in/sharafat-karim/' },
  { name: 'Sabbir Ahmed', role: 'Lead of Innovation & Development', founderRole: 'Co-Founder', image: 'team/sabbir-ahmed', facebook: 'https://www.facebook.com/sabbir1192', linkedin: 'https://www.linkedin.com/in/me-sabbir-ahmed' },
  { name: 'Naimur Rahman Durjoy', role: 'Lead of Policy & Documentation', founderRole: 'Co-Founder', image: 'team/naimur-rahman-durjoy', facebook: 'https://www.facebook.com/activistdurjoy', linkedin: 'https://www.linkedin.com/in/nrdurjoy421' },
  { name: 'Saif Imtiajul', role: 'Data Analyst, Research Team', image: 'team/saif-imtiajul', facebook: 'https://www.facebook.com/Saif.imtiajul/', linkedin: 'https://www.linkedin.com/in/saif-imtiajul/' },
  { name: 'Adiba Jaman', role: 'Member, Communication Team', image: 'team/adiba-jaman' },
  { name: 'Md Abdulla Redwan', role: 'Member, Research Team', image: 'team/md-abdulla-redwan', facebook: 'https://www.facebook.com/abdulla.redwan.2025', linkedin: 'https://www.linkedin.com/in/md-abdulla-r-ab4aa8327' },
  { name: 'Sanzida Ali Tanfi', role: 'Member, Program & Partnership Team', image: 'team/sanzida-ali-tanfi', facebook: 'https://www.facebook.com/sanzidaarmin.tanfi.1' },
  { name: 'Halimaa Khatun', role: 'Member, Community Mobilizer Team', image: 'team/halimaa-khatun', facebook: 'https://www.facebook.com/maliha.akter.538634' },
];

export const founders = coreTeam.filter((p) => p.founderRole);

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
