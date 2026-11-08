import type { Metadata } from 'next';
import DocumentApp from '@/components/platform/DocumentApp';

export const metadata: Metadata = {
  title: 'Document',
  description: 'Cedar Initiative certificate or letter.',
  alternates: { canonical: '/document/' },
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <section className="hero-pad pb-[var(--section-y)] pt-32 sm:pt-40">
        <div className="shell max-w-6xl">
          <h1 className="sr-only">Document</h1>
          <div>
            <DocumentApp />
          </div>
        </div>
      </section>
    </>
  );
}
