import Link from 'next/link';
import Icon from './Icon';
import { Aurora } from './ui';
import Reveal from './Reveal';

export default function ReportPage({ title, subtitle, file }: { title: string; subtitle: string; file: string }) {
  return (
    <section className="relative overflow-hidden pb-[var(--section-y)] pt-36 sm:pt-44">
      <Aurora />
      <div className="shell relative">
        <Reveal as="p" className="t-eyebrow">Financial transparency</Reveal>
        <Reveal as="h1" className="t-h1 mt-5 text-ink">{title}</Reveal>
        <Reveal as="p" className="t-lead mt-4">{subtitle}</Reveal>
        <Reveal className="mt-8 flex flex-col gap-3 xs:flex-row">
          <a href={file} download className="btn-primary"><Icon name="download" className="h-4 w-4" /> Download PDF</a>
          <a href={file} target="_blank" rel="noopener noreferrer" className="btn-glass">Open in new tab <Icon name="external" className="h-4 w-4" /></a>
          <Link href="/our-work/#reports" className="btn-glass">All reports</Link>
        </Reveal>
        <Reveal variant="zoom" className="glass mt-12 overflow-hidden rounded-4xl p-2">
          <object data={`${file}#view=FitH`} type="application/pdf" className="h-[80vh] w-full rounded-3xl bg-white" aria-label={`${title} (PDF)`}>
            <p className="p-8 text-ink-soft">
              Your browser can’t display PDFs inline. <a className="font-semibold text-cedar-700 underline" href={file}>Download the report</a>.
            </p>
          </object>
        </Reveal>
      </div>
    </section>
  );
}
