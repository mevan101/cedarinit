import type { Metadata } from 'next';
import StaffApp from '@/components/platform/StaffApp';

export const metadata: Metadata = {
  title: 'Staff area',
  description: 'Cedar Initiative staff area.',
  alternates: { canonical: '/staff/' },
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <section className="hero-pad pb-[var(--section-y)] pt-32 sm:pt-40">
        <div className="shell max-w-6xl">
          <h1 className="t-h1 text-ink">Staff area</h1>
          <p className="t-lead mt-4 max-w-2xl">Review applications, approve hours, and issue certificates and letters.</p>
          <div className="mt-10">
            <StaffApp />
          </div>
        </div>
      </section>
    </>
  );
}
