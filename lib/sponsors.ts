// Sponsors and supporters, past and present. Logos in public/images/sponsors (ML Bangladesh's from mlbangladesh.org/partners).
export type Sponsor = { name: string; logo: string; url?: string; with: 'Cedar' | 'ML Bangladesh'; tall?: boolean; xl?: boolean };

export const sponsors: Sponsor[] = [
  // Enhanfy is listed once (Cedar's CSEdWeek sponsor); ML Bangladesh's copy of its logo is used because it is tightly cropped.
  { name: 'Enhanfy Global Ltd.', logo: '/images/sponsors/enhanfy.png', with: 'Cedar' },
  { name: 'Youth for NextGen', logo: '/images/sponsors/youth-for-nextgen.png', with: 'Cedar', tall: true },
  { name: 'Google for Developers', logo: '/images/sponsors/google-for-developers.png', url: 'https://developers.google.com/', with: 'ML Bangladesh' },
  { name: 'Major League Hacking', logo: '/images/sponsors/mlh.png', url: 'https://mlh.io/', with: 'ML Bangladesh', tall: true },
  { name: 'Google Gemini', logo: '/images/sponsors/gemini.png', url: 'https://gemini.google.com/', with: 'ML Bangladesh' },
  { name: 'Gemma', logo: '/images/sponsors/gemma.png', url: 'https://deepmind.google/models/gemma/', with: 'ML Bangladesh' },
  { name: 'DataCamp Donates', logo: '/images/sponsors/datacamp-donates.png', url: 'https://www.datacamp.com/donates', with: 'ML Bangladesh' },
  { name: 'O’Reilly Media', logo: '/images/sponsors/oreilly.png', url: 'https://www.oreilly.com/', with: 'ML Bangladesh' },
  { name: 'ElevenLabs', logo: '/images/sponsors/elevenlabs.png', url: 'https://elevenlabs.io/', with: 'ML Bangladesh' },
  { name: 'Featherless AI', logo: '/images/sponsors/featherless.png', url: 'https://featherless.ai/', with: 'ML Bangladesh' },
  { name: 'Firecrawl', logo: '/images/sponsors/firecrawl.png', url: 'https://firecrawl.dev/', with: 'ML Bangladesh' },
  { name: 'Gen.xyz', logo: '/images/sponsors/xyz.png', url: 'https://gen.xyz/', with: 'ML Bangladesh', tall: true },
  { name: 'EMK Center', logo: '/images/sponsors/emk-center.png', url: 'https://emkcenter.org/', with: 'ML Bangladesh', tall: true, xl: true },
  { name: 'HerWILL', logo: '/images/sponsors/herwill.png', url: 'https://www.herwill.org/', with: 'ML Bangladesh', tall: true },
  { name: 'CHS Education', logo: '/images/sponsors/chs-education.png', url: 'https://chseducation.com/', with: 'ML Bangladesh', tall: true },
  { name: 'DianaHost', logo: '/images/sponsors/dianahost.png', url: 'https://www.dianahost.com/', with: 'ML Bangladesh' },
  { name: 'Open Dimension', logo: '/images/sponsors/opendimension.png', with: 'ML Bangladesh' },
  { name: 'DigitalOcean', logo: '/images/sponsors/digitalocean.png', url: 'https://www.digitalocean.com/', with: 'ML Bangladesh' },
  { name: 'DEV Community', logo: '/images/sponsors/dev.png', url: 'https://dev.to/', with: 'ML Bangladesh', tall: true },
  { name: 'Genspark', logo: '/images/sponsors/genspark.png', url: 'https://www.genspark.ai/', with: 'ML Bangladesh' },
];
