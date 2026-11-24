import type { Metadata } from 'next';
import PublicProfileApp from '@/components/platform/PublicProfileApp';

export const metadata: Metadata = {
  title: 'Volunteer profile',
  description: 'A Cedar Initiative volunteer profile with verified hours and certificates.',
  alternates: { canonical: '/profile/' },
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <section className="hero-pad pb-[var(--section-y)] pt-32 sm:pt-40">
        <div className="shell max-w-4xl">
          <h1 className="sr-only">Volunteer profile</h1>
          <div>
            <PublicProfileApp />
          </div>
        </div>
      </section>
    </>
  );
}
