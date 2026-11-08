import type { MetadataRoute } from 'next';
import { posts } from '@/lib/posts';
import { site } from '@/lib/site';
import { reports } from '@/lib/finance';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', 'about-us', 'our-work', 'ml-bangladesh', 'our-team', 'outreach', 'contact', 'give', 'volunteer', 'partner', 'fiscal-sponsors', 'transparency', 'ushnota-abhijan-2025', 'csedweek2025', 'brand', ...reports.map((r) => r.slug)];
  // Pages without their own date use the most recent site update.
  const lastModified = '2026-11-08';
  return [
    ...pages.map((p) => ({ url: `${site.url}/${p ? `${p}/` : ''}`, lastModified, changeFrequency: 'monthly' as const, priority: p ? 0.7 : 1 })),
    ...posts.map((p) => ({ url: `${site.url}/${p.slug}/`, lastModified: p.date, changeFrequency: 'yearly' as const, priority: 0.5 })),
  ];
}
