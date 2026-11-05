import type { Metadata } from 'next';
import ReportPage from '@/components/ReportPage';
import { reports } from '@/lib/site';

const r = reports.find((x) => x.slug === 'financial-report-cedar-initiative-2025')!;
export const metadata: Metadata = { title: r.title, description: r.subtitle, alternates: { canonical: '/financial-report-cedar-initiative-2025/' } };

export default function Page() {
  return <ReportPage title={r.title} subtitle={r.subtitle} file={r.file} />;
}
