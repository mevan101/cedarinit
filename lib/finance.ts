import { readDir } from './markdown';

export type Income = { source: string; type: 'donation' | 'sponsorship' | 'grant' | 'in-kind' | 'other'; amount: number; date?: string; note?: string };
export type Expense = { bill_no?: string; date?: string; category: string; item: string; amount: number; note?: string; receipt?: string };
export type BudgetLine = { category: string; amount: number; note?: string };
type Raw = {
  title: string; kind: 'program' | 'annual'; program?: string; year: string; period_start?: string; period_end?: string; currency?: string;
  status?: 'draft' | 'final'; summary?: string; prepared_by?: string; approved_by?: string; published?: string; includes?: string[];
  budget?: BudgetLine[]; income?: Income[]; expenses?: Expense[]; outputs?: { label: string; value: string }[];
  attachments?: { label: string; file: string }[]; internal_notes?: string;
};

const sum = (xs: { amount: number }[]) => xs.reduce((a, x) => a + (Number(x.amount) || 0), 0);
function group<T extends { amount: number }>(xs: T[], key: (x: T) => string) {
  const m = new Map<string, number>();
  for (const x of xs) m.set(key(x), (m.get(key(x)) ?? 0) + (Number(x.amount) || 0));
  return Array.from(m, ([label, amount]) => ({ label, amount })).sort((a, b) => b.amount - a.amount);
}

const raw = readDir<Raw>('content/reports', '.json');

/** Financial reports, entered line by line in the CMS (Reports collection). Totals are calculated here, never typed. */
export const reports = raw
  .map((r) => {
    const children = (r.includes ?? []).map((s) => raw.find((x) => x.slug === s)).filter(Boolean) as typeof raw;
    const income = [...(r.income ?? []), ...children.flatMap((c) => (c.income ?? []).map((i) => ({ ...i, note: i.note || c.title })))];
    const expenses = [...(r.expenses ?? []), ...children.flatMap((c) => (c.expenses ?? []).map((e) => ({ ...e, category: e.category, program: c.title })))];
    const raised = sum(income), spent = sum(expenses);
    const byCategory = group(r.expenses ?? [], (e) => e.category || 'Other');
    const budget = (r.budget ?? []).map((b) => ({ ...b, actual: byCategory.find((c) => c.label === b.category)?.amount ?? 0 }));
    const programs = children.map((c) => ({ slug: c.slug, title: c.title, raised: sum(c.income ?? []), spent: sum(c.expenses ?? []) }));
    const own = group(r.expenses ?? [], (e) => e.category || 'Other');
    return {
      ...r,
      slug: r.slug,
      currency: r.currency || 'BDT',
      ownIncome: r.income ?? [],
      ownExpenses: r.expenses ?? [],
      income,
      expenses,
      raised,
      spent,
      balance: raised - spent,
      byCategory: r.kind === 'annual' ? [...own, ...programs.map((p) => ({ label: p.title, amount: p.spent }))].sort((a, b) => b.amount - a.amount) : byCategory,
      byType: group(income, (i) => i.type || 'other'),
      donors: group(income, (i) => i.source),
      budget,
      budgetTotal: sum(r.budget ?? []),
      programs,
    };
  })
  .filter((r) => r.status !== 'draft' || process.env.NEXT_PUBLIC_SHOW_DRAFTS === '1')
  .sort((a, b) => (a.kind === b.kind ? (b.period_end ?? b.year).localeCompare(a.period_end ?? a.year) : a.kind === 'annual' ? -1 : 1));

export type Report = (typeof reports)[number];
export const getReport = (slug: string) => reports.find((r) => r.slug === slug);
export const reportForProgram = (program: string) => reports.find((r) => r.program === program);

export const money = (n: number, currency = 'BDT') => `${currency === 'BDT' ? '৳' : currency + ' '}${n.toLocaleString('en-US')}`;

export function toCsv(r: Report) {
  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const rows = [
    ['Section', 'Date', 'Reference', 'Category / type', 'Description', `Amount (${r.currency})`],
    ...r.income.map((i) => ['Income', i.date, '', i.type, i.source + (i.note ? ` (${i.note})` : ''), i.amount]),
    ...r.expenses.map((e) => ['Expense', e.date, e.bill_no, e.category, e.item + ('program' in e && e.program ? ` (${e.program})` : ''), e.amount]),
    ['Total', '', '', '', 'Raised', r.raised],
    ['Total', '', '', '', 'Spent', r.spent],
    ['Total', '', '', '', 'Balance', r.balance],
  ];
  return rows.map((row) => row.map(esc).join(',')).join('\n');
}
