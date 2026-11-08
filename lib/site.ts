export const site = {
  name: 'Cedar Initiative',
  legalName: 'The Cedar Initiative',
  acronym: 'Community Empowerment for Development & Advocacy Resilience',
  url: 'https://cedar-initiative.org',
  tagline: 'Be the Force for Good',
  subTagline: 'Built by U. Powered by purpose.',
  promise: 'Youth-led relief and STEM education across Bangladesh.',
  description:
    'Cedar Initiative is a youth-led volunteer group in Bangladesh. We run winter relief in Dhaka, computer science classes in Rangpur and, through ML Bangladesh, free AI hackathons on campuses.',
  founded: '2025',
  founder: 'Shahriar Azad Evan',
  email: 'info@cedar-initiative.org',
  phone: '+880 1540-405257',
  phoneHref: 'tel:+8801540405257',
  whatsapp: 'https://wa.me/8801612383345',
  messenger: 'https://m.me/cedar.initiative',
  volunteerForm: 'https://forms.gle/yA6EmMmDS4Yy1Pyh6',
  contactEndpoint:
    process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ??
    'https://cedar-initiative.org/wp-json/contact-form-7/v1/contact-forms/2674/feedback',
  contactFormId: '2674',
  contactUnitTag: 'wpcf7-f2674-p1287-o1',
  location: 'Dhaka, Bangladesh',
} as const;

export const nav = [
  { href: '/about-us/', label: 'About' },
  { href: '/our-work/', label: 'Our work' },
  { href: '/ml-bangladesh/', label: 'ML Bangladesh' },
  { href: '/outreach/', label: 'News' },
  { href: '/contact/', label: 'Contact' },
] as const;

export const socials = [
  { label: 'Facebook', href: 'https://www.facebook.com/cedar.initiative', icon: 'facebook' },
  { label: 'Instagram', href: 'https://www.instagram.com/cedar.initiative/', icon: 'instagram' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/cedar-initiative', icon: 'linkedin' },
  { label: 'X (Twitter)', href: 'https://x.com/CedarInitiative', icon: 'x' },
  { label: 'YouTube', href: 'https://www.youtube.com/@CEDARInitiative', icon: 'youtube' },
] as const;

export const about = {
  whoWeAre:
    'Cedar Initiative (Community Empowerment for Development & Advocacy Resilience) is a youth-led volunteer group founded in Dhaka in 2025. We are not yet a registered organisation. Students and young professionals plan and run every program, and we publish a financial report for each one.',
  whoWeAre2:
    'We work where we can show results: warm clothes for families in Dhaka’s slums, computer science classes in schools that have no CS teacher, and, since ML Bangladesh joined us in September 2026, free AI and machine learning hackathons on university campuses across the country.',
  vision:
    'A Bangladesh where young people can help their own communities, and where getting into science and technology doesn’t depend on where you went to school.',
  mission:
    'We organise young volunteers to deliver relief, teach computer science and AI, and take on climate work, and we report openly on what each program did.',
};

export const wings = [
  { title: 'Climate Change', body: 'Climate training for young people and small, local projects that cut waste and plant trees.', icon: 'leaf' },
  { title: 'Community & Youth', body: 'Winter relief, emergency response and volunteering that gives students real responsibility.', icon: 'sprout' },
  { title: 'STEM & Innovation', body: 'Computer science weeks in schools and, through ML Bangladesh, AI hackathons and study clubs on campus.', icon: 'spark' },
  { title: 'Civic Engagement', body: 'Helping young people take part in public debate, youth councils and local decisions.', icon: 'people' },
] as const;

export const values = [
  { title: 'Sustainability', body: 'Championing environmentally sound practices and long-term ecological balance.' },
  { title: 'Equity', body: 'Ensuring fair access to resources, opportunities, and well-being for all individuals and communities.' },
  { title: 'Youth-Driven Leadership', body: 'Nurturing and amplifying the voices and innovative solutions of young leaders.' },
  { title: 'Innovation', body: 'Embracing creative solutions, adaptive strategies, and technological advancements to address complex challenges.' },
  { title: 'Integrity', body: 'Upholding the highest standards of ethics, honesty, and accountability in all operations.' },
  { title: 'Transparency', body: 'Operating with openness, clarity, and full disclosure to build trust with all stakeholders.' },
] as const;

/** Headline numbers. Every one carries its period and a source link (strategy §5). */
export type Stat = { value: number; suffix?: string; label: string; period: string; source: { label: string; href: string; external?: boolean } };
export const impact: Stat[] = [
  { value: 4250, suffix: '+', label: 'People reached by Cedar programs', period: '2025', source: { label: 'Cedar financial report 2025', href: '/financial-report-cedar-initiative-2025/' } },
  { value: 1000, suffix: '+', label: 'Winter clothes collected and handed out', period: 'Nov 2025 – Jan 2026', source: { label: 'Ushnota Abhijan report', href: '/financial-report-ushnota-abhijan-2025/' } },
  { value: 7000, suffix: '+', label: 'Members of the ML Bangladesh community', period: 'Facebook group, Nov 2026', source: { label: 'mlbangladesh.org', href: 'https://mlbangladesh.org/about', external: true } },
  { value: 82, label: 'Teams from 42 universities at Build With Gemma', period: 'July 2026, UIU Dhaka', source: { label: 'ML Bangladesh programs', href: 'https://mlbangladesh.org/programs', external: true } },
];

// Kept for older imports. TODO(Evan): confirm the 2025 figures against program records.
export const impactNote = { period: '2025', source: '/financial-report-cedar-initiative-2025/' } as const;

// Giving runs through a registered fiscal sponsor while Cedar is unregistered.
// TODO(Evan): fill in once the sponsor agreement is confirmed. While `sponsor` is null,
// /give/ explains the status and asks donors to get in touch instead of showing payment details.
export const giving = {
  sponsor: null as null | {
    name: string; // e.g. the registered youth organisation's legal name
    registration: string; // e.g. 'Registered with the Department of Youth Development, reg. no. …'
    url?: string;
  },
  methods: [] as { label: string; detail: string; note?: string }[], // e.g. { label: 'bKash (merchant)', detail: '01XXXXXXXXX', note: 'Reference: CEDAR' }
};

export const joinOptions = [
  { title: 'Volunteer', body: 'Give your time and skills to campaigns, events and research.', image: 'join/volunteer', href: '/volunteer/', cta: 'See volunteer roles' },
  { title: 'Regular Donor', body: 'Fuel programs every month with a recurring contribution.', image: 'join/regular-donor', href: '/give/', cta: 'How to give' },
  { title: 'Lifetime & Donor Member', body: 'Stand with Cedar for the long run as a founding supporter.', image: 'join/lifetime-member', href: '/give/', cta: 'How to give' },
  { title: 'Career', body: 'Grow with a youth-led team building the future of impact.', image: 'join/career', href: '/contact/?subject=Career', cta: 'Get in touch' },
] as const;

export const press = [
  { outlet: 'Peokoton', title: 'Cedar Initiative launched in Dhaka to empower communities through technology and social good.', href: 'https://www.facebook.com/share/p/19z9ZVXJQP/', image: 'launch/09', lang: 'en' },
  { outlet: 'Jagoron News', title: 'সিডার ইনিশিয়েটিভের যাত্রা শুরু ঢাকায়, প্রযুক্তি ও সমাজসেবার মিলনে টেকসই ভবিষ্যতের অঙ্গীকার', href: 'https://jagoronnews.com/news/detail/3523/', image: 'launch/03', lang: 'bn' },
  { outlet: 'The Business Standard', title: 'Bangladeshi youth win top spot in CICA Artificial Intelligence Art Competition', href: 'https://www.tbsnews.net/bangladesh/bangladeshi-youth-wins-top-spot-cica-artificial-intelligence-art-competition-1284891', image: 'news/cica-art-competition', lang: 'en' },
] as const;

export const reports = [
  { slug: 'financial-report-cedar-initiative-2025', title: 'Financial Report 2025', subtitle: 'Cedar Initiative — annual statement', file: '/reports/Financial-Report-Cedar-Initiative-2025.pdf', year: '2025' },
  { slug: 'financial-report-ushnota-abhijan-2025', title: 'Ushnota Abhijan 2025', subtitle: 'Campaign financial report', file: '/reports/Financial-Report-Ushnota-Abhijan-2025.pdf', year: '2025' },
] as const;
