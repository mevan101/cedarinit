import { posts } from './posts';
import { pages } from './pages';
import { programs } from './programs';
import { reports, money } from './finance';
import { opportunities } from './opportunities';
import { site } from './site';
import type { SearchDoc } from './search-score';

/**
 * The site search index, built at build time and published at /search-index.json
 * (see app/search-index.json/route.ts). Everything here comes from the site's own
 * content: stories, programs, reports, roles and the standing pages.
 */
const trim = (s: string, n = 180) => {
  const plain = s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return plain.length > n ? `${plain.slice(0, n).replace(/\s+\S*$/, '')}…` : plain;
};

/** Standing pages. The copy repeats what the page itself says, so a result never over-promises. */
const standing: SearchDoc[] = [
  {
    title: 'Cedar Initiative',
    description: site.description,
    url: '/',
    type: 'Page',
    keywords: 'home homepage youth-led nonprofit bangladesh volunteer relief stem',
  },
  {
    title: 'About Cedar Initiative',
    description: 'Who we are, our mission and vision, the four areas we work in and the values we hold ourselves to. A youth-led volunteer group in Dhaka, founded in 2025.',
    url: '/about-us/',
    type: 'Page',
    keywords: 'mission vision values climate education wellness innovation who we are',
  },
  {
    title: 'Our work',
    description: 'The programs: Ushnota Abhijan winter relief, CSEdWeek in Rangpur, ML Bangladesh hackathons, and a financial report for each one.',
    url: '/our-work/',
    type: 'Page',
    keywords: 'programmes campaigns projects impact relief education ai hackathon',
  },
  {
    title: 'ML Bangladesh',
    description: 'Cedar’s STEM program since September 2026: free one-day AI hackathons, ML Club, Build Club and Kaggle competitions on campuses across Bangladesh.',
    url: '/ml-bangladesh/',
    type: 'Page',
    keywords: 'machine learning mlbd ai hackathon club campus kaggle build with gemma study jam',
  },
  {
    title: 'Our team',
    description: 'The co-founders and the volunteers who run Cedar’s programs, and what each of them is responsible for.',
    url: '/our-team/',
    type: 'Page',
    keywords: 'people founders leadership staff volunteers who runs cedar',
  },
  {
    title: 'News and stories',
    description: 'Campaign diaries, milestones and press coverage, written by the volunteers who were there.',
    url: '/outreach/',
    type: 'Page',
    keywords: 'blog news updates stories press media coverage field diary',
  },
  {
    title: 'Give',
    description: 'How to give to Cedar while we are not yet a registered organisation: who receives gifts, what they pay for, and which report covers it.',
    url: '/give/',
    type: 'Page',
    keywords: 'donate donation giving gift bKash bank transfer sponsor funding support monthly donor',
  },
  {
    title: 'Transparency: every financial report',
    description: 'Every taka raised and spent, program by program: who gave, what it paid for, what is left. Download any report as PDF or spreadsheet.',
    url: '/transparency/',
    type: 'Page',
    keywords: 'accounts finance expenses income budget audit receipts accountability money',
  },
  {
    title: 'Volunteer',
    description: 'The volunteer roles we run, what a first event is like, the three steps to join, and how verified hours and certificates work.',
    url: '/volunteer/',
    type: 'Page',
    keywords: 'volunteering join help out weekend students facilitator crew certificate hours',
  },
  {
    title: 'Open volunteer roles',
    description: 'Roles open now, with the commitment each one asks for. Apply on this site and follow your application in your account.',
    url: '/opportunities/',
    type: 'Page',
    keywords: 'jobs apply application openings recruitment roles vacancy',
  },
  {
    title: 'Partner with Cedar',
    description: 'Host a program, co-run a campaign or sponsor one. What a school, university, NGO or company can do with us.',
    url: '/partner/',
    type: 'Page',
    keywords: 'partnership sponsorship corporate school university ngo collaborate host event',
  },
  {
    title: 'Contact',
    description: `Email ${site.email}, call or message us on WhatsApp, or send the contact form. Based in ${site.location}.`,
    url: '/contact/',
    type: 'Page',
    keywords: 'email phone whatsapp messenger address get in touch enquiry',
  },
  {
    title: 'Verify a certificate',
    description: 'Check a Cedar volunteer certificate by its ID or QR code: the hours, the program and the areas the volunteer worked in.',
    url: '/verify/',
    type: 'Page',
    keywords: 'certificate verification qr hours reference employer university check',
  },
  {
    title: 'Fiscal sponsor proposal',
    description: 'What a fiscal sponsor would hold for Cedar, what we would report and what we are asking for, while Cedar is unregistered.',
    url: '/fiscal-sponsors/',
    type: 'Page',
    keywords: 'fiscal sponsorship 501c3 registered charity legal status proposal',
  },
  {
    title: 'Create your volunteer account',
    description: 'One free account to apply for roles, log hours and download certificates.',
    url: '/join/',
    type: 'Page',
    keywords: 'sign up register account login apply',
  },
  {
    title: 'Brand guide',
    description: 'Cedar’s logo files, colours, type, layout and motion rules, and how to use them correctly.',
    url: '/brand/',
    type: 'Page',
    keywords: 'logo colours fonts design tokens press kit media kit',
  },
];

export const searchIndex: SearchDoc[] = [
  ...standing,
  ...programs.map<SearchDoc>((p) => ({
    title: p.title,
    description: trim(p.lead || p.description || ''),
    url: `/${p.slug}/`,
    type: 'Program',
    date: p.end_date || p.start_date,
    keywords: [p.kicker, p.status, ...(p.places ?? []), ...(p.partners ?? []).map((x) => x.name)].filter(Boolean).join(' '),
  })),
  ...posts.map<SearchDoc>((p) => ({
    title: p.sourceTitle || p.title,
    description: trim(p.description || p.excerpt),
    url: `/${p.slug}/`,
    type: 'Story',
    date: p.date,
    keywords: p.category,
  })),
  ...reports.map<SearchDoc>((r) => ({
    title: r.title,
    description: trim(`${r.kind === 'annual' ? 'Annual statement' : 'Program report'} for ${r.year}: ${money(r.raised, r.currency)} raised, ${money(r.spent, r.currency)} spent. ${r.summary ?? ''}`),
    url: `/${r.slug}/`,
    type: 'Report',
    date: r.published,
    keywords: `accounts finance money ${r.year} ${r.program ?? ''} raised spent balance pdf spreadsheet`,
  })),
  ...opportunities.map<SearchDoc>((o) => ({
    title: o.title,
    description: trim(o.summary),
    url: `/opportunities/${o.slug}/`,
    type: 'Role',
    date: o.deadline,
    keywords: `${o.program} ${o.location} ${o.commitment} ${o.status} ${o.areas.join(' ')}`,
  })),
  ...pages.map<SearchDoc>((p) => ({
    title: p.title,
    description: trim(p.description || p.lead || ''),
    url: `/${p.slug}/`,
    type: 'Page',
  })),
];
