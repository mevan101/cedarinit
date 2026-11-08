import type { Metadata } from 'next';
import AccountApp from '@/components/platform/AccountApp';

export const metadata: Metadata = {
  title: 'My volunteer account',
  description: 'Your Cedar Initiative applications, hours, certificates and letters.',
  alternates: { canonical: '/account/' },
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <section className="hero-pad pb-[var(--section-y)] pt-32 sm:pt-40">
        <div className="shell max-w-6xl">
          <h1 className="t-h1 text-ink">My Cedar</h1>
          <div className="mt-10">
            <AccountApp />
          </div>
        </div>
      </section>
    </>
  );
}
