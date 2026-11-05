import type { MetadataRoute } from 'next';
import { posts } from '@/lib/posts';
import { reports, site } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', 'about-us', 'our-work', 'our-team', 'outreach', 'contact', 'fiscal-sponsors', 'ushnota-abhijan-2025', 'csedweek2025', 'brand', ...reports.map((r) => r.slug)];
  return [
    ...pages.map((p) => ({ url: `${site.url}/${p ? `${p}/` : ''}`, changeFrequency: 'monthly' as const, priority: p ? 0.7 : 1 })),
    ...posts.map((p) => ({ url: `${site.url}/${p.slug}/`, lastModified: p.date, changeFrequency: 'yearly' as const, priority: 0.5 })),
  ];
}
