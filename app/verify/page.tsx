import type { Metadata } from 'next';
import VerifyApp from '@/components/platform/VerifyApp';

export const metadata: Metadata = {
  title: 'Verify a certificate or letter',
  description: 'Check that a Cedar Initiative certificate, appointment or recommendation letter is genuine. Enter the document ID or scan the QR code.',
  alternates: { canonical: '/verify/' },
  
};

export default function Page() {
  return (
    <>
      <section className="hero-pad pb-[var(--section-y)] pt-32 sm:pt-40">
        <div className="shell max-w-4xl">
          <h1 className="t-h1 text-ink">Check a Cedar document</h1>
          <p className="t-lead mt-4 max-w-2xl">Enter the ID printed on the certificate or letter, or scan its QR code. We show whether it is valid, revoked or expired.</p>
          <div className="mt-10">
            <VerifyApp />
          </div>
        </div>
      </section>
    </>
  );
}
