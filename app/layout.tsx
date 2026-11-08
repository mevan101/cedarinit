import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import ViewTransitions from '@/components/ViewTransitions';
import { mlbd } from '@/lib/mlbd';
import { site, socials } from '@/lib/site';
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
  openGraph: { type: 'website', siteName: site.name, locale: 'en_US', images: [{ url: '/images/ushnota/day-4a.webp', alt: 'Students donating winter clothes at a Cedar collection drive in Dhaka' }] },
  twitter: { card: 'summary_large_image', site: '@CedarInitiative' },
  icons: { icon: '/brand/icon.svg', apple: '/brand/logo.png' },
  alternates: { canonical: '/' },
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
  telephone: '+8801540405257',
  founder: { '@type': 'Person', name: site.founder },
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
      <body>
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <ChatWidget />
        <ViewTransitions />
      </body>
    </html>
  );
}
