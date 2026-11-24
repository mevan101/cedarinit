'use client';

import { useEffect, useState } from 'react';
import Collection from './Collection';
import { Badge, Card, Notice, fmtDate } from '../ui';
import { csvDownload, isLive, list, save, type Row } from './data';
import { safeMd } from '@/lib/safe-md';

const offline = <Notice>This works on the live site, where the dashboard is connected to the database.</Notice>;

/** Messages from the contact form and other forms on the site. */
export function Inbox() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [show, setShow] = useState<'active' | 'archived'>('active');
  const [err, setErr] = useState('');
  const load = () => list('form_submissions', 'created_at', false).then(setRows, (e) => setErr(e.message));
  useEffect(() => { if (isLive()) load(); }, []);
  if (!isLive()) return offline;

  const setStatus = async (r: Row, status: string) => { await save('form_submissions', { id: r.id, status }); load(); };
  const shown = (rows ?? []).filter((r) => (show === 'archived') === (r.status === 'archived'));
  const keys = Array.from(new Set(shown.flatMap((r) => Object.keys((r.data as object) ?? {}))));

  return (
    <Card
      title="Inbox"
      action={
        <span className="flex flex-wrap gap-2">
          <button type="button" className="btn-glass !min-h-[44px]" onClick={() => setShow(show === 'active' ? 'archived' : 'active')}>{show === 'active' ? 'Show archived' : 'Show current'}</button>
          <button type="button" className="btn-glass !min-h-[44px]" onClick={() => csvDownload('cedar-inbox.csv', [['Received', 'Form', 'Name', 'Email', 'Subject', 'Status', 'Page', ...keys], ...shown.map((r) => [String(r.created_at).slice(0, 16).replace('T', ' '), r.form as string, r.name as string, r.email as string, r.subject as string, r.status as string, r.page as string, ...keys.map((k) => (r.data as Record<string, string>)[k])])])}>Export to spreadsheet</button>
        </span>
      }
    >
      {err && <Notice kind="error">{err}</Notice>}
      {rows === null ? <div className="h-40 animate-pulse rounded-2xl bg-ink/5" /> : !shown.length ? <p className="text-ink-muted">No messages.</p> : (
        <ul className="divide-y divide-ink/10">
          {shown.map((r) => {
            const d = (r.data ?? {}) as Record<string, string>;
            const isOpen = open === r.id;
            return (
              <li key={String(r.id)} className="py-4">
                <button type="button" className="flex w-full flex-wrap items-center justify-between gap-3 text-left" aria-expanded={isOpen} onClick={() => { setOpen(isOpen ? null : String(r.id)); if (r.status === 'new') setStatus(r, 'read'); }}>
                  <span className="min-w-0">
                    <span className="block font-semibold text-ink">{String(r.subject || r.form)}</span>
                    <span className="text-sm text-ink-muted">{String(r.name ?? '')} {r.email ? `<${r.email}>` : ''} · {fmtDate(String(r.created_at))} · {String(r.form)}</span>
                  </span>
                  <Badge status={String(r.status)} />
                </button>
                {isOpen && (
                  <div className="mt-4 rounded-2xl bg-paper p-5">
                    <dl className="grid gap-3 text-sm sm:grid-cols-[10rem_1fr]">
                      {Object.entries(d).map(([k, v]) => <div key={k} className="contents"><dt className="font-semibold text-ink-soft">{k}</dt><dd className="whitespace-pre-wrap break-words text-ink">{v}</dd></div>)}
                    </dl>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {r.email ? <a className="btn-primary !min-h-[40px]" href={`mailto:${r.email}?subject=${encodeURIComponent(`Re: ${r.subject ?? 'your message to Cedar Initiative'}`)}`} onClick={() => setStatus(r, 'replied')}>Reply by email</a> : null}
                      <button type="button" className="btn-glass !min-h-[40px]" onClick={() => setStatus(r, r.status === 'archived' ? 'read' : 'archived')}>{r.status === 'archived' ? 'Move back' : 'Archive'}</button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

const CATS = ['Notice', 'Handbook', 'Contacts', 'Finance', 'Links', 'Meeting notes'];

/** Notes, contacts, links and handbook pages for the team only. Never shown on the public site. */
export function Internal({ canWrite }: { canWrite: boolean }) {
  const [cat, setCat] = useState('All');
  if (!isLive()) return offline;
  return (
    <div className="space-y-4">
      <Notice>Only signed-in team members can see this. Volunteers and visitors never can, and nothing here goes on the public site.</Notice>
      <nav aria-label="Note types" className="flex flex-wrap gap-2">
        {['All', ...CATS].map((c) => <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)} className={`min-h-[40px] rounded-full px-4 text-sm font-semibold ${cat === c ? 'bg-ink text-white' : 'border border-ink/15 text-ink-soft'}`}>{c}</button>)}
      </nav>
      <Collection
        key={cat}
        table="internal_notes" title="Team notes" order="updated_at" ascending={false} readOnly={!canWrite}
        filter={(r) => cat === 'All' || r.category === cat}
        newLabel="Add a note" defaults={{ category: cat === 'All' ? 'Notice' : cat, pinned: false, body: '' }}
        fields={[
          { name: 'title', label: 'Title', type: 'text', required: true, wide: true },
          { name: 'category', label: 'Type', type: 'select', options: CATS.map((c) => ({ value: c, label: c })) },
          { name: 'url', label: 'Link (optional)', type: 'url', hint: 'A shared drive folder, sheet or form.' },
          { name: 'pinned', label: 'Pin to the top', type: 'checkbox' },
          { name: 'body', label: 'Note', type: 'markdown' },
        ]}
        summary={(r) => (
          <details>
            <summary className="cursor-pointer list-none">
              <span className="font-semibold text-ink">{r.pinned ? '📌 ' : ''}{String(r.title)}</span>
              <span className="ml-2 text-sm text-ink-muted">{String(r.category)} · updated {fmtDate(String(r.updated_at))}</span>
            </summary>
            {r.url ? <a href={String(r.url)} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm font-semibold text-cedar-700 underline">{String(r.url)}</a> : null}
            <div className="prose-cedar mt-3 text-sm" dangerouslySetInnerHTML={{ __html: safeMd(String(r.body ?? '')) }} />
          </details>
        )}
      />
    </div>
  );
}

const TABLES: Record<string, string> = { site_posts: 'Story or page', site_team: 'Team member', site_sponsors: 'Sponsor', site_settings: 'Setting', internal_notes: 'Team note', documents: 'Certificate or letter', profiles: 'Role', applications: 'Application' };

/** Who changed what, for admins. */
export function Activity() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [err, setErr] = useState('');
  useEffect(() => { if (isLive()) list('audit_log', 'at', false).then((r) => setRows(r.slice(0, 300)), (e) => setErr(e.message)); }, []);
  if (!isLive()) return offline;
  const describe = (r: Row) => {
    const c = (r.changes ?? {}) as Record<string, unknown>;
    if (r.action !== 'update') return String((c.title ?? c.name ?? c.key ?? c.recipient_name ?? '') as string);
    return Object.entries(c).map(([k, v]) => {
      const { from, to } = v as { from: unknown; to: unknown };
      const short = (x: unknown) => { const s = typeof x === 'string' ? x : JSON.stringify(x); return s && s.length > 60 ? `${s.slice(0, 57)}…` : s; };
      return `${k}: ${short(from)} → ${short(to)}`;
    }).join(' · ');
  };
  return (
    <Card title="Activity" action={rows && <button type="button" className="btn-glass !min-h-[44px]" onClick={() => csvDownload('cedar-activity.csv', [['When', 'Who', 'What', 'Action', 'Details'], ...rows.map((r) => [String(r.at), r.actor_email as string, TABLES[r.table_name as string] ?? (r.table_name as string), r.action as string, describe(r)])])}>Export</button>}>
      {err && <Notice kind="error">{err}</Notice>}
      {rows === null ? <div className="h-40 animate-pulse rounded-2xl bg-ink/5" /> : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="text-ink-muted"><tr><th className="py-2 pr-3">When</th><th className="py-2 pr-3">Who</th><th className="py-2 pr-3">What</th><th className="py-2">Change</th></tr></thead>
            <tbody className="divide-y divide-ink/10">
              {rows.map((r) => (
                <tr key={String(r.id)} className="align-top">
                  <td className="whitespace-nowrap py-2 pr-3 text-ink-muted">{new Date(String(r.at)).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                  <td className="py-2 pr-3">{String(r.actor_email ?? 'System')}</td>
                  <td className="py-2 pr-3">{TABLES[r.table_name as string] ?? String(r.table_name)} <span className="text-ink-muted">({String(r.action)})</span></td>
                  <td className="break-words py-2 text-ink-soft">{describe(r)}</td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={4} className="py-6 text-ink-muted">No changes recorded yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
