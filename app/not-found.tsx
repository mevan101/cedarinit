import Link from 'next/link';
import { Aurora } from '@/components/ui';

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80svh] items-center overflow-hidden pt-32">
      <Aurora />
      <div className="shell relative text-center">
        <p className="t-eyebrow justify-center">Error 404</p>
        <h1 className="t-display mt-4 text-ink">Lost in the forest</h1>
        <p className="t-lead mx-auto mt-6 max-w-lg">The page you’re looking for has moved or never existed. Let’s get you back on the trail.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 xs:flex-row">
          <Link href="/" className="btn-primary">Go home</Link>
          <Link href="/outreach/" className="btn-glass">Read our stories</Link>
        </div>
      </div>
    </section>
  );
}
