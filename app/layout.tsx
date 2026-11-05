import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
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
  title: { default: `${site.name} — ${site.tagline}`, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  keywords: ['Cedar Initiative', 'youth-led nonprofit', 'Bangladesh', 'climate action', 'volunteer', 'Ushnota Abhijan', 'CSEdWeek'],
  openGraph: { type: 'website', siteName: site.name, locale: 'en_US', images: [{ url: '/images/hero/group-banner.webp', width: 1600, height: 900 }] },
  twitter: { card: 'summary_large_image', site: '@CedarInitiative' },
  icons: { icon: '/brand/icon.svg', apple: '/brand/logo.png' },
  alternates: { canonical: '/' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [{ color: '#F8F7F2' }],
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
  sameAs: socials.map((s) => s.href),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${bengali.variable} no-js`} id="top" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.remove('no-js')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
