// Machine Learning Bangladesh (MLBD): Cedar's STEM program since September 2026.
// Facts below are taken from mlbangladesh.org (About and Programs pages, read 8 Nov 2026).
// MLBD keeps its own site, events system and Facebook group; this page introduces it to Cedar's audience.

const media = (id: string, w: 640 | 1024 | 1600 = 1024) => `https://mlbangladesh.org/media/${id}.w${w}.webp`;
const sb = (path: string, w = 880, h = 660) =>
  `https://zhqzscggtcjmtjvmmktp.supabase.co/storage/v1/render/image/public/event-media/65c9249e-0bae-4254-bc53-e82098c13948/${path}.webp?width=${w}&height=${h}&resize=cover&quality=80`;

export type ExtPhoto = { src: string; alt: string; caption: string };

export const mlbd = {
  slug: 'ml-bangladesh',
  name: 'Machine Learning Bangladesh',
  short: 'ML Bangladesh',
  url: 'https://mlbangladesh.org',
  group: 'https://www.facebook.com/groups/mlbd001',
  hostRequest: 'https://mlbangladesh.org/host-request',
  events: 'https://mlbangladesh.org/events',
  getInvolved: 'https://mlbangladesh.org/get-involved',
  sponsor: 'https://mlbangladesh.org/sponsor',
  joined: 'September 2026',
  kicker: 'STEM program',
  status: 'Ongoing',
  lead:
    'A volunteer-led AI, machine learning and developer community. One-day build events at universities, where students ship something working before they go home. Free to attend for now.',
  merger:
    'ML Bangladesh joined Cedar Initiative in September 2026 and is now Cedar’s STEM program. It keeps its name, its volunteers and its own website. Cedar adds governance, financial reporting and a wider volunteer base.',
  hero: {
    src: 'https://mlbangladesh.org/about/hacktoberfest-dhaka-emk-2026.webp',
    alt: 'Group photo of participants and volunteers at Hacktoberfest Hack Day Dhaka at the EMK Center',
    caption: 'Hacktoberfest Hack Day Dhaka, EMK Center · 18 October 2026',
  } satisfies ExtPhoto,
  stats: [
    { value: 7000, suffix: '+', label: 'Members in the Facebook group', period: 'Nov 2026' },
    { value: 353, label: 'Entrants in ML Olympiad 2024', period: 'Feb–May 2024, on Kaggle' },
    { value: 82, label: 'Teams from 42 universities', period: 'Build With Gemma, July 2026' },
    { value: 6, label: 'Universities reached by Build With AI Hack Days', period: 'May–Aug 2026' },
  ],
  programs: [
    { title: 'Build With AI Hack Days', when: 'Campus series', body: 'A free, one-day, in-person build event where students go from using AI to shipping something with it. Each stop needs a host department and a partner.' },
    { title: 'ML Club', when: 'Ongoing', body: 'Paper reading, back where the community started: pick one paper, read it as a group, and take turns explaining it, including the parts nobody understood.' },
    { title: 'Build Club', when: 'Since 1 June 2026', body: 'Post what you’re making with AI, get honest feedback, and pass on the tutorial that actually worked. Built for the quiet months between hackathons.' },
    { title: 'Study Jams', when: 'When hosted', body: 'Group study through Kaggle Learn and free courses, with assignments and someone to ask when you get stuck. Kaggle issues the certificate directly.' },
    { title: 'ML Olympiad', when: 'National, on Kaggle', body: 'A national machine learning competition. The 2024 edition, the CO2 Emissions Prediction Challenge, drew 353 entrants.' },
    { title: 'Speaker sessions', when: 'Monthly, online', body: 'Online talks open to any member who wants to teach. Recorded, and the speaker can post the recording too.' },
  ],
  timeline: [
    { date: 'Sep 2023', title: 'Founded as TFUG North Bengal', body: 'TensorFlow User Group North Bengal starts with online paper-reading sessions and monthly speaker talks, with GDG Dhaka and GDG Online.' },
    { date: 'Feb–May 2024', title: 'ML Olympiad 2024', body: 'The CO2 Emissions Prediction Challenge runs on Kaggle with GDG Dhaka. 353 entrants and a finale at UIU on 24–25 May. Featured on the Google Developers Blog.', href: 'https://developers.googleblog.com/en/ml-olympiad-2024-globally-distributed-ml-competitions-by-google-ml-community/' },
    { date: '12 Jul 2024', title: 'Renamed ML Bangladesh', body: 'The community has outgrown one region. Still a member of the Google AI Community Network.' },
    { date: '11 Oct 2025', title: 'Mini ML Fest', body: 'A mini conference at United International University.' },
    { date: 'May 2026', title: 'First in-person hackathons', body: 'Build With AI Hack Days start at UITS on 12 May, then DIU a week later.', photo: { src: sb('7cb1a0e9-b0c8-4bb5-a055-2acb32b48189'), alt: 'Students building at Build With AI Hack Days at Daffodil International University' } },
    { date: '26 Jul 2026', title: 'Build With Gemma @Bangladesh', body: 'A hybrid hackathon at UIU, part of Google DeepMind’s global series. Planned in about a week, judged on Kaggle: 82 teams from 42 universities.', photo: { src: sb('f4ac7ea3-04a1-4817-9a67-c2b3039abf6f'), alt: 'Participants at Build With Gemma at United International University' } },
    { date: 'Aug 2026', title: 'Hack Days tour', body: 'South East University, RUET, the EMK Center and Bangladesh Agricultural University in one month.', photo: { src: sb('430f5f04-5f32-4045-b707-2d492a141885'), alt: 'Students at Build With AI Hack Days at South East University' } },
    { date: 'Sep 2026', title: 'Joins Cedar Initiative', body: 'ML Bangladesh becomes Cedar’s STEM program. Tech For Her runs at the Asian University for Women on 25 September.', photo: { src: media('f6d05ba2-76b6-4bf6-98d2-52a37a856d6c'), alt: 'Participants at the Tech For Her hackathon at the Asian University for Women' } },
    { date: 'Oct 2026', title: 'Hacktoberfest and Kaggle', body: 'Hack days in Dinajpur (HSTU, 3 Oct) and Dhaka (18 Oct), plus the Kaggle Community Olympiad on PM2.5 forecasting for Dhaka.', photo: { src: media('eaa2f935-4d04-4699-b51b-189c4aaf6dad'), alt: 'Hacktoberfest Hack Days at Hajee Mohammad Danesh Science and Technology University, Dinajpur' } },
    { date: 'Next', title: '20+ campuses planned', body: 'More hackathons, more of them outside Dhaka. Build Club keeps going and ML Club comes back.' },
  ],
  principles: [
    { title: 'Free to attend, for now', body: 'Sponsors and hosts pay for food, travel, venues and swag. Their money never buys a seat.' },
    { title: 'You build something', body: 'Most events end with something you built and can show. The talks are there to get you started.' },
    { title: 'Beyond Dhaka', body: 'Hack days have run in Rajshahi, Mymensingh, Chattogram and Dinajpur as well as Dhaka.' },
    { title: 'No naming rights', body: 'A hackathon keeps its name whoever pays for the food. The event belongs to the students in the room.' },
  ],
  supporters: [
    'Major League Hacking', 'Google for Developers', 'Google Gemini', 'Gemma', 'DataCamp Donates', 'O’Reilly Media', 'ElevenLabs', 'Featherless AI',
    'Firecrawl', 'Gen.xyz', 'EMK Center', 'HerWILL', 'CHS Education', 'DianaHost', 'Enhanfy', 'Open Dimension', 'DigitalOcean', 'DEV Community', 'Genspark',
  ],
  press: [
    { outlet: 'The Daily Star', title: 'HerFinance crowned champion at ‘Tech for Her Hackathon 2026’', href: 'https://www.thedailystar.net/business/news/herfinance-crowned-champion-tech-her-hackathon-2026-4286956' },
    { outlet: 'The Business Standard', title: 'HerFinance crowned champion at HerWILL’s Tech for Her Hackathon 2026', href: 'https://www.tbsnews.net/economy/corporates/herfinance-crowned-champion-herwills-tech-her-hackathon-2026-1558386' },
  ],
  places: ['Dhaka', 'Rajshahi', 'Mymensingh', 'Chattogram', 'Dinajpur', 'Online'],
  gallery: [
    { src: media('4c6636e5-394c-466f-bfb6-21c751e31e4d'), alt: 'Participants at Hacktoberfest Hack Day Dhaka', caption: 'Hacktoberfest Hack Day, Dhaka · Oct 2026' },
    { src: media('eed460aa-b8a6-4e1e-9598-1a3ad6a73f8f'), alt: 'Build With AI Hack Days at the EMK Center in Dhaka', caption: 'Build With AI Hack Days, EMK Center · Aug 2026' },
    { src: sb('fab50c78-732a-4c87-be9c-020ba3a3eab4'), alt: 'Students at Build With AI Hack Days at RUET', caption: 'Build With AI Hack Days, RUET Rajshahi · Aug 2026' },
    { src: sb('f5f8ec0f-d91e-450c-a301-2adbd1802cbf'), alt: 'Students at Build With AI Hack Days at Bangladesh Agricultural University', caption: 'Build With AI Hack Days, BAU Mymensingh · Aug 2026' },
  ] satisfies ExtPhoto[],
};
