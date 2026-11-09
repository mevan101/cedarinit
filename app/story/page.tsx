import type { Metadata } from 'next';
import StoryReader from '@/components/StoryReader';

export const metadata: Metadata = { title: 'Story', robots: { index: false, follow: true }, alternates: { canonical: '/outreach/' } };

/** Shows a story the moment it is published in the dashboard, before the next site build gives it its own page. */
export default function Page() {
  return <StoryReader />;
}
