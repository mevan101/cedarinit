import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Cedar Initiative',
    short_name: 'Cedar',
    description: 'Youth-led relief and STEM education across Bangladesh.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F8F7F2',
    theme_color: '#F8F7F2',
    icons: [
      { src: '/brand/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  };
}
