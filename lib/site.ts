export const site = {
  name: 'Cedar Initiative',
  legalName: 'The Cedar Initiative',
  acronym: 'Community Empowerment for Development & Advocacy Resilience',
  url: 'https://cedar-initiative.org',
  tagline: 'Be the Force for Good',
  subTagline: 'Built by U. Powered by purpose.',
  promise: 'Empowering Communities for a Sustainable Future.',
  description:
    'Cedar Initiative is a youth-led, volunteer-based nonprofit in Bangladesh empowering communities through climate action, education, wellness and innovation.',
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
  { href: '/our-work/', label: 'Our Work' },
  { href: '/our-team/', label: 'Team' },
  { href: '/outreach/', label: 'Outreach' },
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
    'Cedar Initiative (Community Empowerment for Development & Advocacy Resilience) is a newly established, unregistered, youth-led nonprofit committed to empowering communities through a multi-sectoral approach. Our mission is to foster sustainable progress, cultivate youth leadership and promote overall well-being, with a particular emphasis on impactful initiatives in Bangladesh and beyond.',
  whoWeAre2:
    'We address some of the most pressing challenges of our time — sustainability, climate innovation, mental health, education, clean water, food security and civic engagement. With a vision rooted in innovation, collaboration and compassion, we strive to create meaningful change and build resilient communities for a better, more sustainable future.',
  vision:
    'A world where empowered youth and communities lead sustainable progress, fostering resilience, equity, and well-being for all.',
  mission:
    'Empowering communities through climate action, education, wellness, and innovation to drive sustainable progress globally.',
};

export const wings = [
  { title: 'Climate Change', body: 'Fighting climate change and promoting sustainability through innovative, actionable initiatives.', icon: 'leaf' },
  { title: 'Community & Youth Empowerment', body: 'Nurturing the next generation of leaders and ensuring equitable access to quality education.', icon: 'sprout' },
  { title: 'Research & Innovation', body: 'Driving progress through groundbreaking research and innovation for a sustainable future.', icon: 'spark' },
  { title: 'Civic Engagement', body: 'Encouraging active community participation and informed decision-making.', icon: 'people' },
] as const;

export const values = [
  { title: 'Sustainability', body: 'Championing environmentally sound practices and long-term ecological balance.' },
  { title: 'Equity', body: 'Ensuring fair access to resources, opportunities, and well-being for all individuals and communities.' },
  { title: 'Youth-Driven Leadership', body: 'Nurturing and amplifying the voices and innovative solutions of young leaders.' },
  { title: 'Innovation', body: 'Embracing creative solutions, adaptive strategies, and technological advancements to address complex challenges.' },
  { title: 'Integrity', body: 'Upholding the highest standards of ethics, honesty, and accountability in all operations.' },
  { title: 'Transparency', body: 'Operating with openness, clarity, and full disclosure to build trust with all stakeholders.' },
] as const;

export const impact = [
  { value: 4250, suffix: '+', label: 'People impacted' },
  { value: 1000, suffix: '+', label: 'Clothes donated' },
  { value: 2, label: 'Programs completed' },
  { value: 2, label: 'Ongoing programs' },
  { value: 7, label: 'Trees planted' },
] as const;

export const joinOptions = [
  { title: 'Volunteer', body: 'Give your time and skills to campaigns, events and research.', image: 'join/volunteer', href: site.volunteerForm, cta: 'Apply to volunteer', external: true },
  { title: 'Regular Donor', body: 'Fuel programs every month with a recurring contribution.', image: 'join/regular-donor', href: '/contact/?subject=Regular%20Donor', cta: 'Become a donor' },
  { title: 'Lifetime & Donor Member', body: 'Stand with Cedar for the long run as a founding supporter.', image: 'join/lifetime-member', href: '/contact/?subject=Lifetime%20%26%20Donor%20Membership', cta: 'Enquire' },
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
