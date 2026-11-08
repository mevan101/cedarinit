import type { Metadata } from 'next';
import JoinClient from '@/components/platform/JoinClient';
export const metadata: Metadata = {
  title: 'Join Cedar: create your volunteer account',
  description: 'Create a free Cedar Initiative volunteer account to apply for roles, log your hours and get verifiable certificates.',
  alternates: { canonical: '/join/' },
  
};

export default function Page() {
  return (
    <>
      <section className="hero-pad pb-[var(--section-y)] pt-32 sm:pt-40">
        <div className="shell max-w-2xl">
          <h1 className="t-h1 text-ink">Join Cedar</h1>
          <p className="t-lead mt-4 max-w-2xl">One account for everything: apply for roles, log your hours, and download certificates anyone can verify.</p>
          <div className="mt-10">
            <JoinClient />
          </div>
        </div>
      </section>
    </>
  );
}
