import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import ViewTransitions from '@/components/ViewTransitions';
import AnnouncementBar from '@/components/AnnouncementBar';
import announcement from '@/content/settings/announcement.json';
import { mlbd } from '@/lib/mlbd';
import { founders } from '@/lib/team';
import { site, socials } from '@/lib/site';
import { withBase } from '@/lib/base-path';
import './globals.css';

// Self-hosted (SIL OFL) so the site has no third-party font requests.
const display = localFont({ src: './fonts/anton-latin-400-normal.woff2', weight: '400', variable: '--font-display', display: 'swap' });
const sans = localFont({ src: './fonts/inter-latin-wght-normal.woff2', weight: '100 900', variable: '--font-sans', display: 'swap' });
const bengali = localFont({
  src: [
    { path: './fonts/noto-sans-bengali-bengali-400-normal.woff2', weight: '400' },
    { path: './fonts/noto-sans-bengali-bengali-600-normal.woff2', weight: '600' },
  ],
  variable: '--font-bengali',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name}: youth-led nonprofit in Bangladesh`, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  keywords: ['Cedar Initiative', 'youth-led nonprofit Bangladesh', 'volunteer Dhaka', 'winter clothes donation Bangladesh', 'Ushnota Abhijan', 'CSEdWeek Bangladesh', 'ML Bangladesh', 'AI hackathon Bangladesh'],
  openGraph: { type: 'website', siteName: site.name, locale: 'en_US', images: [{ url: '/og/default.jpg', width: 1200, height: 630, alt: 'Cedar Initiative volunteers with the Cedar banner in Dhaka' }] },
  twitter: { card: 'summary_large_image', site: '@CedarInitiative', images: ['/og/default.jpg'] },
  icons: {
    icon: [
      { url: withBase('/brand/icon.svg'), type: 'image/svg+xml' },
      { url: withBase('/brand/icon-512.png'), sizes: '512x512', type: 'image/png' },
    ],
    apple: withBase('/brand/icon-512.png'),
  },
  // Same Search Console verification as the old WordPress site, so ownership carries over.
  verification: { google: 'qC7-assEJn3xKmrglFDkRaA2Du9folnVe0xXNNnMybE' },
  alternates: { canonical: '/', types: { 'application/rss+xml': [{ url: '/feed.xml', title: 'Cedar Initiative news' }] } },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [{ color: '#F8F7F2' }],
  colorScheme: 'light',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'NGO',
  name: site.name,
  alternateName: site.acronym,
  url: site.url,
  logo: `${site.url}/brand/logo.png`,
  email: site.email,
  telephone: '+8801612383345',
  founder: founders.map((f) => ({ '@type': 'Person', name: f.name, jobTitle: f.role, sameAs: [f.linkedin, f.facebook].filter(Boolean) })),
  areaServed: 'Bangladesh',
  address: { '@type': 'PostalAddress', addressLocality: 'Dhaka', addressCountry: 'BD' },
  foundingDate: site.founded,
  description: site.description,
  sameAs: socials.map((s) => s.href),
  subOrganization: { '@type': 'Organization', name: mlbd.name, alternateName: 'MLBD', url: mlbd.url, foundingDate: '2023-09', sameAs: [mlbd.group] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${bengali.variable} no-js`} id="top" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "var d=document.documentElement;d.classList.remove('no-js');try{if(navigator.connection&&navigator.connection.saveData)d.classList.add('save-data')}catch(e){}" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={announcement.enabled ? 'has-notice' : undefined}>
        <Header notice={<AnnouncementBar />} />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <ChatWidget />
        <ViewTransitions />
        {/* Scroll motion for every browser, incl. phones without CSS scroll timelines (public/motion.js). */}
        <script src={withBase('/motion.js')} defer />
      </body>
    </html>
  );
}
