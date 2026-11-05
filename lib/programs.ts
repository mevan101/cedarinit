import type { GalleryGroup } from '@/components/Gallery';

export const ushnota = {
  slug: 'ushnota-abhijan-2025',
  title: 'Ushnota Abhijan 2025',
  kicker: 'Warmth Campaign',
  status: 'Ongoing',
  cover: 'ushnota/cover',
  short:
    'Collecting new and gently used winter clothes and distributing them among underprivileged families, street children and the homeless — spreading warmth, compassion and humanity through the cold season.',
  summary: [
    '“Ushnota Abhijan 2025” is a humanitarian initiative by Cedar Initiative aimed at providing warm clothing to underprivileged and vulnerable communities during winter. Every year, thousands of people across Bangladesh — especially in urban slums and northern districts — suffer from severe cold-related hardships. This campaign seeks to reduce their suffering by mobilizing communities, engaging youth volunteers, collecting winter clothing, and distributing them systematically to those most in need.',
    'The project will be implemented between December 2025 and January 2026 and aims to support 2,000+ beneficiaries across Dhaka, Rangpur, Dinajpur, Kurigram, Panchagarh, and Bhola. Cedar Initiative is seeking financial and in-kind support as well as partners to ensure the effective implementation of this campaign.',
  ],
  facts: [
    { label: 'Beneficiaries targeted', value: '2,000+' },
    { label: 'Districts', value: '6' },
    { label: 'Timeline', value: 'Dec 2025 – Jan 2026' },
  ],
  districts: ['Dhaka', 'Rangpur', 'Dinajpur', 'Kurigram', 'Panchagarh', 'Bhola'],
  shortTerm: [
    'Distribute new or gently used winter clothing among underserved communities.',
    'Mobilize schools, colleges, organizations, and volunteers to collect winter clothing.',
    'Conduct timely and efficient distribution activities in targeted locations.',
  ],
  longTerm: [
    'Establish a consistent annual winter relief program across multiple districts.',
    'Strengthen social responsibility and foster a culture of empathy and humanitarian values.',
    'Engage and train youth volunteers to participate in regular community service initiatives.',
  ],
  vision:
    'A Bangladesh where no vulnerable individual suffers from cold during winter, and where compassion and collective responsibility become the foundation of community culture.',
  mission: [
    'Establish an organized system for collecting, managing, and distributing winter clothing.',
    'Build strategic partnerships with schools, communities, youth groups, and institutions.',
    'Empower volunteers with the skills and motivation to lead community service activities.',
  ],
  beneficiaries: [
    'Street children',
    'Homeless and displaced individuals',
    'Low-income rural families',
    'Schoolchildren from financially distressed backgrounds',
    'Urban slum dwellers and marginalized communities',
  ],
  conclusion:
    '“Ushnota Abhijan 2025” is not just a winter clothing distribution initiative. It is a movement of empathy, solidarity, and human connection. By supporting this campaign, partners and donors can help thousands stay warm, safe, and dignified during winter. Cedar Initiative welcomes contributions through donations, volunteer engagement, and institutional collaboration.',
  signoff: 'Together, we can spread warmth and humanity — one person at a time.',
  report: '/financial-report-ushnota-abhijan-2025/',
};

const u = (name: string, alt: string) => ({ name, alt });
export const ushnotaGallery: GalleryGroup[] = [
  { label: 'Day 1', items: [u('ushnota/day-1', 'Volunteers collecting winter clothes at Tejgaon Government High School')] },
  { label: 'Day 2', items: [u('ushnota/day-2', 'Students donating winter clothes on day two of Ushnota Abhijan')] },
  { label: 'Day 3', items: [u('ushnota/day-3a', 'Students and teachers with donated clothes, day three'), u('ushnota/day-3b', 'Cedar volunteers receiving winter clothing donations')] },
  { label: 'Day 4', items: [u('ushnota/day-4a', 'Students lined up to donate warm clothes, day four'), u('ushnota/day-4b', 'Bags of donated winter clothing'), u('ushnota/day-4c', 'Volunteers and students at a collection drive')] },
  { label: 'Day 5', items: [u('ushnota/day-5a', 'Tejgaon Government Girls High School students donating clothes'), u('ushnota/day-5b', 'Group photo with donated clothes, day five'), u('ushnota/day-5c', 'Collected clothing ready for sorting')] },
  { label: 'Day 6', items: [u('ushnota/day-6', 'Collection at Nakhalpara Hossain Ali High School')] },
  { label: 'Distribution', items: [u('ushnota/distribution', 'Distributing winter clothes to families affected by the Karail slum fire'), u('ushnota/karail-1', 'Cedar volunteers delivering aid in Karail'), u('ushnota/karail-2', 'Winter clothes handed to families in Karail')] },
];

export const csedweek = {
  slug: 'csedweek2025',
  title: 'CSEdWeek 2025',
  kicker: 'Computer Science Education Week',
  status: 'Completed',
  cover: 'csedweek/rangpur-1',
  short:
    'A structured, accessible introduction to coding and AI for high-school students who rarely get exposure to digital skills — delivered at JAAGO Foundation School, Rangpur.',
  purpose:
    'The purpose of this program is to deliver a structured, accessible computer science learning experience to high school students who do not typically receive exposure to digital skills. This initiative focuses on foundational coding and introductory AI concepts, delivered through guided instructional activities during CSEdWeek.',
  objectives: [
    'Provide an introductory computer science experience to students in underserved communities.',
    'Facilitate a standardized instructional session using Code.org, Scratch, or an equivalent activity.',
    'Strengthen digital literacy and encourage interest in technology-related learning paths.',
    'Ensure consistent execution across multiple school sites through a formal implementation structure.',
  ],
  scope:
    'The program consists of a one-hour instructional session implemented within selected high schools. The session will utilize existing computer labs and will be delivered by a trained facilitator identified either by the school or by the implementation partner.',
  activities: [
    'Orientation on computer science and the purpose of CSEdWeek',
    'Demonstration of selected learning activity',
    'Hands-on student participation',
    'Summary and reflection',
    'Documentation and reporting',
  ],
  sponsor: { name: 'Enhanfy Global Ltd.', image: 'partners/enhanfy-global' },
  partner: { name: 'Youth for NextGen', image: 'partners/youth-for-nextgen' },
};

export const csedGallery: GalleryGroup[] = [
  {
    label: 'Rangpur',
    items: [
      u('csedweek/rangpur-1', 'Students at JAAGO Foundation School Rangpur during CSEdWeek'),
      u('csedweek/rangpur-2', 'A facilitator introduces AI concepts to students'),
      u('csedweek/rangpur-3', 'Students engaged in a hands-on coding activity'),
      u('csedweek/rangpur-4', 'Group photo of students and Cedar volunteers in Rangpur'),
      u('csedweek/rangpur-5', 'Classroom session during CS Ed Week 2025'),
    ],
  },
];

export const programs = [ushnota, csedweek];

export const fiscal = {
  summary:
    'Cedar Initiative (Community Empowerment for Development & Advocacy Resilience) is a high-impact, youth-led program dedicated to empowering communities through climate action, education, wellness, and innovation to drive sustainable progress globally. We are currently seeking a strategic partnership with an established 501(c)(3) or a registered non-profit to serve as our Fiscal Sponsor. This relationship will provide the critical legal and fiduciary framework necessary for the Initiative to receive tax-deductible contributions and grants, ensuring maximum programmatic impact and compliance while the Initiative pursues independent legal status.',
  summary2:
    'This proposal outlines a framework for a fiscally responsible, mutually beneficial partnership based on compliance, transparency, and a shared commitment to youth & community development.',
  sections: [
    {
      n: 'II',
      title: 'The Initiative’s Core Requirements (The Ask)',
      intro: 'The following services and accommodations are requested from the Fiscal Sponsor to ensure the Initiative’s operational stability:',
      groups: [
        {
          title: 'Fiduciary and Legal Oversight',
          items: [
            ['Use of 501(c)(3) or Nonprofit Status', 'The Sponsor will extend its tax-exempt status to the Initiative, allowing us to receive grants and contributions that are tax-deductible to the fullest extent of the law.'],
            ['Financial Stewardship', 'The Sponsor will manage all funds, process accounts payable, administer payroll (if applicable), and provide necessary financial reports, exercising exclusive fiduciary control over all funds received on the Initiative’s behalf.'],
            ['Compliance and Reporting', 'The Sponsor will ensure the Initiative’s activities adhere to all federal and state regulations, including the proper allocation and use of funds in accordance with the Sponsor’s charitable mission and IRS/Local Government Taxation guidelines.'],
            ['Transitional Support', 'The sponsorship is requested for a defined, renewable period, serving as a stable bridge to allow the Initiative to successfully achieve its independent non-profit registration.'],
          ],
        },
        {
          title: 'Physical Resource Access (If available)',
          items: [
            ['Scheduled Meeting Space', 'We request the pre-arranged use of a conference room for up to four (4) structured meetings per quarter, subject to the Sponsor’s internal scheduling policies and availability.'],
            ['Event Venue Access', 'We request the potential reservation of the Sponsor’s event facility for up to two (2) annual, large-scale events, pending availability, a formal booking process, and adherence to all facility-use guidelines.'],
          ],
        },
      ],
    },
    {
      n: 'III',
      title: 'Value Proposition and Mutual Benefit',
      intro: 'In exchange for assuming fiduciary responsibility, the Initiative offers a demonstrable return on investment through visibility, accountability, and direct in-kind support.',
      groups: [
        {
          title: 'Brand Visibility and Credibility',
          items: [
            ['Digital Partnership', 'The Sponsor’s logo will be prominently featured on the landing page and partnership sections of the Cedar Initiative website, acknowledging the vital role of the fiscal sponsorship.'],
            ['Co-Branding on Initiatives', 'The Sponsor will receive co-branding on all public-facing materials, event signage, and media releases for programs conducted under this agreement.'],
            ['Public Acknowledgment', 'The Sponsor will be verbally recognized and thanked during the opening or closing remarks of every public event hosted by the Initiative.'],
            ['Social Media Synergy', 'A commitment to a minimum of one co-branded social media shout-out per month, highlighting the partnership’s achievements across all active platforms.'],
          ],
        },
        {
          title: 'Accountability and Transparency',
          items: [
            ['Total Financial Transparency', 'The Sponsor will receive full, comprehensive access to all financial reports, expense documentation, and grant reports, ensuring complete fiscal transparency and oversight.'],
            ['Programmatic Consultation', 'The Initiative commits to providing the Sponsor with advance notification and consultation on all new projects, strategic decisions, and intellectual property development related to its activities.'],
            ['Commitment to Program Integrity', 'The final agreement will affirm the Sponsor’s commitment to maintaining the specific mission, vision, and operational identity of the Cedar Initiative as the project lead.'],
          ],
        },
        {
          title: 'Direct Reciprocal Support (In-Kind)',
          items: [
            ['Skilled Volunteer Labor', 'The Initiative commits to providing the Sponsor with 20 hours per month of professional volunteer support from its leadership or youth cohort, offering high-value labor in areas such as event support, research, or communications.'],
          ],
        },
      ],
    },
    {
      n: 'IV',
      title: 'Proposed Financial and Compensation Model',
      intro: 'We recognize the significant administrative and legal costs associated with fiscal sponsorship and propose a tiered structure to ensure maximum resource efficiency for both parties.',
      groups: [
        {
          title: 'Administrative Fee Structure',
          items: [
            ['Introductory Investment Rate', 'We respectfully request a time-limited administrative fee of 3% on all funds received during the first 12 months of the agreement. This reduced rate is proposed as an investment in a high-potential startup, enabling the Initiative to maximize its initial program funding and demonstrate rapid impact.'],
            ['Standard Fee Transition', 'Following the introductory period, the administrative fee will transition to the Sponsor’s standard organizational rate for similar fiscal sponsorship projects.'],
          ],
        },
        {
          title: 'Compensation for Direct Services',
          items: [
            ['Project-Based Compensation', 'Compensation for any dedicated, hands-on programmatic support provided by the Sponsor’s staff (e.g., specific project management, grant writing, specialized consulting) will be negotiated separately. These fees will be explicitly itemized and budgeted within the relevant grant or project proposal, ensuring transparent payment for direct services, distinct from the administrative fee.'],
          ],
        },
      ],
    },
  ],
  conclusion:
    'The Cedar Initiative presents a unique opportunity for your organization to partner with a high-potential, compliant, and rapidly growing youth movement. We are prepared to submit a detailed programmatic plan and budget for your immediate review and welcome the opportunity to discuss this proposal further.',
  contact: { name: 'Md Shahriar Azad Evan', role: 'Lead of Program & Partnership', email: 'shahriar@cedar-initiative.org', phone: '+8801540405257' },
};
