'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import Icon from '../Icon';
import type { AppStatus, Application, Doc, DocKind, HourEntry, Profile, Role } from '@/lib/platform';
import { canIssue, isStaff } from '@/lib/platform';
import { kindLabel, template } from '@/lib/platform/templates';
import { usePlatform } from './usePlatform';
import { Badge, Card, DemoBanner, Field, Notice, fmtDate, input } from './ui';

const STATUSES: AppStatus[] = ['new', 'reviewing', 'accepted', 'declined', 'withdrawn'];

function csvDownload(name: string, rows: (string | number | null | undefined)[][]) {
  const csv = rows.map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
  a.download = name;
  a.click();
}

export default function StaffApp() {
  const { p, me, tick, refresh } = usePlatform();
  const [tab, setTab] = useState<'applications' | 'volunteers' | 'hours' | 'documents'>('applications');
  const [apps, setApps] = useState<Application[]>([]);
  const [people, setPeople] = useState<Profile[]>([]);
  const [hours, setHours] = useState<HourEntry[]>([]);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [issueFor, setIssueFor] = useState<Profile | null>(null);
  const [messageTo, setMessageTo] = useState<{ person: Profile; app?: Application } | null>(null);

  useEffect(() => {
    if (!isStaff(me ?? null)) return;
    Promise.all([p.applications(), p.volunteers(), p.allHours(), p.documents()]).then(([a, v, h, d]) => { setApps(a); setPeople(v); setHours(h); setDocs(d); });
  }, [me, p, tick]);

  if (me === undefined) return <div className="h-64 animate-pulse rounded-[var(--radius-card)] bg-ink/5" />;
  if (!me || !isStaff(me))
    return (
      <div className="space-y-5">
        <DemoBanner />
        <Notice kind="error">The staff area is for Cedar team members. {me ? 'Ask an admin to give your account a staff role.' : <Link href="/join/?next=/staff/" className="font-semibold underline">Sign in</Link>}</Notice>
      </div>
    );

  const hoursOf = (id: string) => hours.filter((h) => h.user_id === id && h.status === 'approved').reduce((a, h) => a + Number(h.hours), 0);
  const pendingHours = hours.filter((h) => h.status === 'pending');
  const tabs = [['applications', `Applications (${apps.filter((a) => a.status === 'new').length} new)`], ['volunteers', `Volunteers (${people.length})`], ['hours', `Hours (${pendingHours.length} to approve)`], ['documents', `Certificates & letters (${docs.length})`]] as const;

  return (
    <div className="space-y-6">
      <DemoBanner />
      <nav aria-label="Staff sections" className="flex gap-1 overflow-x-auto rounded-full border border-ink/10 bg-white p-1">
        {tabs.map(([k, t]) => <button key={k} type="button" aria-current={tab === k ? 'page' : undefined} onClick={() => setTab(k)} className={`min-h-[44px] shrink-0 rounded-full px-4 text-sm font-semibold ${tab === k ? 'bg-cedar-700 text-white' : 'text-ink-soft hover:text-ink'}`}>{t}</button>)}
      </nav>

      {tab === 'applications' && <Applications apps={apps} people={people} onChange={refresh} onMessage={(person, app) => setMessageTo({ person, app })} />}

      {tab === 'volunteers' && (
        <Card title="Volunteers" action={<button type="button" className="btn-glass !min-h-[44px]" onClick={() => csvDownload('cedar-volunteers.csv', [['Name', 'Email', 'Phone', 'Institution', 'City', 'Areas', 'Verified hours', 'Role', 'Joined'], ...people.map((v) => [v.full_name, v.email, v.phone, v.institution, v.city, v.areas.join('; '), hoursOf(v.id), v.role, v.created_at.slice(0, 10)])])}>Export to spreadsheet</button>}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[46rem] text-left text-sm">
              <thead className="text-ink-muted"><tr><th className="py-2 pr-3">Name</th><th className="py-2 pr-3">Institution · city</th><th className="py-2 pr-3">Areas</th><th className="py-2 pr-3 text-right">Hours</th><th className="py-2 pr-3">Role</th><th className="py-2 text-right">Actions</th></tr></thead>
              <tbody className="divide-y divide-ink/10">
                {people.map((v) => (
                  <tr key={v.id}>
                    <td className="py-3 pr-3"><span className="block font-semibold text-ink">{v.full_name || '—'}</span><span className="text-ink-muted">{v.email}</span></td>
                    <td className="py-3 pr-3 text-ink-soft">{[v.institution, v.city].filter(Boolean).join(' · ') || '—'}</td>
                    <td className="py-3 pr-3 text-ink-soft">{v.areas.join(', ') || '—'}</td>
                    <td className="py-3 pr-3 text-right tabular-nums">{hoursOf(v.id)}</td>
                    <td className="py-3 pr-3">
                      {me.role === 'admin' && v.id !== me.id ? (
                        <select aria-label={`Role for ${v.full_name}`} value={v.role} onChange={(e) => p.setRole(v.id, e.target.value as Role).then(refresh)} className="rounded-xl border border-ink/15 bg-white px-2 py-1.5">
                          {(['volunteer', 'manager', 'issuer', 'admin'] as Role[]).map((r) => <option key={r}>{r}</option>)}
                        </select>
                      ) : <span className="capitalize">{v.role}</span>}
                    </td>
                    <td className="py-3 text-right">
                      <span className="inline-flex flex-wrap justify-end gap-2">
                        <button type="button" className="rounded-full border border-ink/15 px-3 py-1.5 font-semibold" onClick={() => setMessageTo({ person: v })}>Email</button>
                        {canIssue(me) && <button type="button" className="rounded-full bg-cedar-700 px-3 py-1.5 font-semibold text-white" onClick={() => { setIssueFor(v); setTab('documents'); }}>Issue document</button>}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === 'hours' && <Hours hours={hours} people={people} onChange={refresh} />}

      {tab === 'documents' && (
        <div className="space-y-6">
          {canIssue(me) ? <IssueForm people={people} hoursOf={hoursOf} hours={hours} initial={issueFor} me={me} onIssued={() => { setIssueFor(null); refresh(); }} /> : <Notice>Only credential issuers and admins can issue documents.</Notice>}
          <Card title="Issued documents">
            {docs.length === 0 ? <p className="text-ink-soft">Nothing issued yet.</p> : (
              <ul className="divide-y divide-ink/10">
                {docs.map((d) => (
                  <li key={d.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <span><span className="block font-semibold text-ink">{d.recipient_name} · {kindLabel[d.kind]}</span><span className="text-sm text-ink-muted"><span className="font-mono">{d.id}</span> · {fmtDate(d.issued_on)}{d.hours ? ` · ${d.hours} h` : ''}</span></span>
                    <span className="flex items-center gap-2">
                      <Badge status={d.status} />
                      <Link href={`/document/?id=${d.id}`} className="rounded-full border border-ink/15 px-3 py-1.5 text-sm font-semibold">Open</Link>
                      {d.status === 'valid' && canIssue(me) && <button type="button" className="rounded-full px-3 py-1.5 text-sm font-semibold text-red-700 underline" onClick={() => { const r = prompt('Reason for revoking (shown to staff only):'); if (r) p.revoke(d.id, r).then(refresh); }}>Revoke</button>}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      )}

      {messageTo && <MessageDialog to={messageTo.person} app={messageTo.app} onClose={() => setMessageTo(null)} />}
    </div>
  );
}

function Applications({ apps, people, onChange, onMessage }: { apps: Application[]; people: Profile[]; onChange: () => void; onMessage: (p: Profile, a: Application) => void }) {
  const { p } = usePlatform();
  const [filter, setFilter] = useState<'all' | AppStatus>('all');
  const [role, setRole] = useState('all');
  const [open, setOpen] = useState<string | null>(null);
  const roles = useMemo(() => Array.from(new Set(apps.map((a) => a.opportunity_title))), [apps]);
  const shown = apps.filter((a) => (filter === 'all' || a.status === filter) && (role === 'all' || a.opportunity_title === role));
  const questionKeys = Array.from(new Set(shown.flatMap((a) => Object.keys(a.answers))));
  return (
    <Card
      title="Applications"
      action={
        <span className="flex flex-wrap gap-2">
          <select aria-label="Filter by role" value={role} onChange={(e) => setRole(e.target.value)} className="rounded-full border border-ink/15 bg-white px-3 py-2 text-sm"><option value="all">All roles</option>{roles.map((r) => <option key={r}>{r}</option>)}</select>
          <select aria-label="Filter by status" value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)} className="rounded-full border border-ink/15 bg-white px-3 py-2 text-sm"><option value="all">All statuses</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
          <button type="button" className="btn-glass !min-h-[40px]" onClick={() => csvDownload('cedar-applications.csv', [['Applied', 'Role', 'Name', 'Email', 'Phone', 'Institution', 'Status', 'Staff notes', ...questionKeys], ...shown.map((a) => [a.created_at.slice(0, 10), a.opportunity_title, a.profile?.full_name, a.profile?.email, a.profile?.phone, a.profile?.institution, a.status, a.staff_notes, ...questionKeys.map((k) => a.answers[k])])])}>Export to spreadsheet</button>
        </span>
      }
    >
      {shown.length === 0 ? <p className="text-ink-soft">No applications match.</p> : (
        <ul className="divide-y divide-ink/10">
          {shown.map((a) => {
            const person = people.find((x) => x.id === a.user_id);
            return (
              <li key={a.id} className="py-4">
                <button type="button" aria-expanded={open === a.id} onClick={() => setOpen(open === a.id ? null : a.id)} className="flex w-full flex-wrap items-center justify-between gap-3 text-left">
                  <span><span className="block font-semibold text-ink">{a.profile?.full_name || a.profile?.email}</span><span className="text-sm text-ink-muted">{a.opportunity_title} · {fmtDate(a.created_at)}</span></span>
                  <span className="flex items-center gap-3"><Badge status={a.status} /><Icon name={open === a.id ? 'arrowUp' : 'arrow'} className="h-4 w-4 text-ink-muted" /></span>
                </button>
                {open === a.id && (
                  <div className="mt-4 grid gap-5 rounded-2xl bg-paper p-5 lg:grid-cols-2">
                    <dl className="space-y-3 text-sm">
                      {[['Email', a.profile?.email], ['Phone', a.profile?.phone], ['Institution', a.profile?.institution], ...Object.entries(a.answers)].map(([k, v]) => v ? <div key={k}><dt className="font-semibold text-ink">{k}</dt><dd className="whitespace-pre-line text-ink-soft">{v}</dd></div> : null)}
                    </dl>
                    <div className="space-y-3">
                      <Field id={`st-${a.id}`} text="Status">
                        <select id={`st-${a.id}`} value={a.status} onChange={(e) => p.updateApplication(a.id, { status: e.target.value as AppStatus }).then(onChange)} className={input}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
                      </Field>
                      <Field id={`nt-${a.id}`} text="Notes (staff only)">
                        <textarea id={`nt-${a.id}`} defaultValue={a.staff_notes ?? ''} rows={3} onBlur={(e) => p.updateApplication(a.id, { staff_notes: e.target.value }).then(onChange)} className={input} />
                      </Field>
                      {person && <button type="button" className="btn-primary !min-h-[44px]" onClick={() => onMessage(person, a)}>Email applicant</button>}
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

function Hours({ hours, people, onChange }: { hours: HourEntry[]; people: Profile[]; onChange: () => void }) {
  const { p } = usePlatform();
  async function add(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget, f = new FormData(form);
    await p.logHoursFor(String(f.get('user')), { program: String(f.get('program')), area: String(f.get('area')), date: String(f.get('date')), hours: Number(f.get('hours')), note: String(f.get('note') || '') || null });
    form.reset();
    onChange();
  }
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card title="Waiting for approval" className="lg:col-span-3">
        {hours.length === 0 ? <p className="text-ink-soft">No hours logged.</p> : (
          <ul className="divide-y divide-ink/10">
            {hours.slice().sort((a, b) => (a.status === 'pending' ? -1 : 1) - (b.status === 'pending' ? -1 : 1)).map((h) => (
              <li key={h.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <span><span className="block font-semibold text-ink">{h.profile?.full_name} · {h.hours} h</span><span className="text-sm text-ink-muted">{fmtDate(h.date)} · {h.program} · {h.area}{h.note ? ` · ${h.note}` : ''}</span></span>
                {h.status === 'pending' ? (
                  <span className="flex gap-2">
                    <button type="button" className="rounded-full bg-cedar-700 px-3 py-1.5 text-sm font-semibold text-white" onClick={() => p.setHoursStatus(h.id, 'approved').then(onChange)}>Approve</button>
                    <button type="button" className="rounded-full border border-ink/15 px-3 py-1.5 text-sm font-semibold" onClick={() => p.setHoursStatus(h.id, 'rejected').then(onChange)}>Reject</button>
                  </span>
                ) : <Badge status={h.status} />}
              </li>
            ))}
          </ul>
        )}
      </Card>
      <form onSubmit={add} className="lg:col-span-2">
        <Card title="Record hours for a volunteer">
          <div className="space-y-4">
            <Field id="h-user" text="Volunteer"><select id="h-user" name="user" required className={input}>{people.map((v) => <option key={v.id} value={v.id}>{v.full_name || v.email}</option>)}</select></Field>
            <Field id="h-program" text="Program"><input id="h-program" name="program" required placeholder="e.g. Ushnota Abhijan 2026" className={input} /></Field>
            <Field id="h-area" text="Area"><input id="h-area" name="area" required placeholder="e.g. Distribution" className={input} /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field id="h-date" text="Date"><input id="h-date" name="date" type="date" required className={input} /></Field>
              <Field id="h-hours" text="Hours"><input id="h-hours" name="hours" type="number" min="0.5" max="24" step="0.5" required className={input} /></Field>
            </div>
            <Field id="h-note" text="Note"><input id="h-note" name="note" className={input} /></Field>
            <button type="submit" className="btn-primary w-full">Add approved hours</button>
          </div>
        </Card>
      </form>
    </div>
  );
}

function IssueForm({ people, hoursOf, hours, initial, me, onIssued }: { people: Profile[]; hoursOf: (id: string) => number; hours: HourEntry[]; initial: Profile | null; me: Profile; onIssued: () => void }) {
  const { p } = usePlatform();
  const [userId, setUserId] = useState(initial?.id ?? people[0]?.id ?? '');
  const [kind, setKind] = useState<DocKind>('certificate');
  const [title, setTitle] = useState('');
  const [program, setProgram] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [signer, setSigner] = useState(me.full_name);
  const [signerTitle, setSignerTitle] = useState('');
  const [body, setBody] = useState('');
  const [done, setDone] = useState<Doc | null>(null);
  const [err, setErr] = useState('');
  useEffect(() => { if (initial) setUserId(initial.id); }, [initial]);
  const person = people.find((x) => x.id === userId);
  const progHours = hours.filter((h) => h.user_id === userId && h.status === 'approved' && (!program || h.program.toLowerCase().includes(program.toLowerCase())));
  const totalHours = program ? progHours.reduce((a, h) => a + Number(h.hours), 0) : hoursOf(userId);
  const areas = Array.from(new Set(progHours.map((h) => h.area)));
  const fill = () => setBody(template(kind, { name: person?.full_name || '', title: title || kindLabel[kind], program, hours: totalHours ? String(totalHours) : '', areas: areas.join(', ').toLowerCase(), from, to, signer }));
  useEffect(fill, [kind, userId]); // eslint-disable-line react-hooks/exhaustive-deps

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!person) return;
    if (/\[[^\]]+\]/.test(body)) return setErr('Fill in every [bracketed] part of the text before issuing.');
    try {
      const d = await p.issue({ user_id: person.id, recipient_name: person.full_name || person.email, kind, title: title || (kind === 'certificate' && program ? `${kindLabel[kind]}: ${program}` : kindLabel[kind]), program: program || null, hours: ['certificate', 'experience', 'recommendation'].includes(kind) && totalHours ? totalHours : null, areas, body, issued_on: new Date().toISOString().slice(0, 10), expires_on: null, signer_name: signer, signer_title: signerTitle });
      setDone(d); setErr(''); onIssued();
    } catch (x) { setErr((x as Error).message); }
  }
  return (
    <form onSubmit={submit}>
      <Card title="Issue a certificate or letter">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-4">
            <Field id="i-user" text="Volunteer"><select id="i-user" value={userId} onChange={(e) => setUserId(e.target.value)} className={input}>{people.map((v) => <option key={v.id} value={v.id}>{v.full_name || v.email}</option>)}</select></Field>
            <Field id="i-kind" text="Document"><select id="i-kind" value={kind} onChange={(e) => setKind(e.target.value as DocKind)} className={input}>{(Object.keys(kindLabel) as DocKind[]).map((k) => <option key={k} value={k}>{kindLabel[k]}</option>)}</select></Field>
            <Field id="i-title" text={kind === 'certificate' ? 'Title (optional)' : 'Role title'} hint={kind === 'certificate' ? 'Defaults to "Certificate of volunteering: <program>"' : 'e.g. Campus ambassador, Program volunteer'}><input id="i-title" value={title} onChange={(e) => setTitle(e.target.value)} onBlur={fill} className={input} /></Field>
            <Field id="i-program" text="Program" hint={`Verified hours found: ${totalHours}${areas.length ? ` (${areas.join(', ')})` : ''}`}><input id="i-program" value={program} onChange={(e) => setProgram(e.target.value)} onBlur={fill} placeholder="e.g. Ushnota Abhijan 2025" className={input} /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field id="i-from" text="From"><input id="i-from" value={from} onChange={(e) => setFrom(e.target.value)} onBlur={fill} placeholder="e.g. 1 March 2026" className={input} /></Field>
              <Field id="i-to" text="To"><input id="i-to" value={to} onChange={(e) => setTo(e.target.value)} onBlur={fill} placeholder="optional" className={input} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field id="i-signer" text="Signed by"><input id="i-signer" value={signer} onChange={(e) => setSigner(e.target.value)} required className={input} /></Field>
              <Field id="i-stitle" text="Signer's title"><input id="i-stitle" value={signerTitle} onChange={(e) => setSignerTitle(e.target.value)} required placeholder="e.g. Co-founder" className={input} /></Field>
            </div>
          </div>
          <div className="flex flex-col">
            <Field id="i-body" text="Text" hint="Edit freely. Anything in [brackets] must be filled in." className="flex flex-1 flex-col">
              <textarea id="i-body" value={body} onChange={(e) => setBody(e.target.value)} rows={14} className={`${input} flex-1 font-[inherit] leading-relaxed`} />
            </Field>
          </div>
        </div>
        {err && <div className="mt-5"><Notice kind="error">{err}</Notice></div>}
        {done && <div className="mt-5"><Notice kind="ok">Issued <span className="font-mono">{done.id}</span>. <Link href={`/document/?id=${done.id}`} className="font-semibold underline">Open it</Link> · it now appears in {done.recipient_name}&rsquo;s account.</Notice></div>}
        <button type="submit" className="btn-primary mt-6">Issue {kindLabel[kind].toLowerCase()} <Icon name="arrow" className="h-4 w-4" /></button>
      </Card>
    </form>
  );
}

function MessageDialog({ to, app, onClose }: { to: Profile; app?: Application; onClose: () => void }) {
  const { p } = usePlatform();
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'logged'>('idle');
  async function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setState('sending');
    const subject = String(f.get('subject')), body = String(f.get('body'));
    const r = await p.sendMessage(to.id, subject, body, app?.id);
    if (!r.delivered && p.mode === 'demo') window.open(`mailto:${to.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    setState(r.delivered ? 'sent' : 'logged');
  }
  return (
    <div role="dialog" aria-modal="true" aria-label={`Email ${to.full_name}`} className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/40 p-4 sm:items-center" onClick={onClose}>
      <form onSubmit={send} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg space-y-4 rounded-[var(--radius-card)] bg-white p-6 sm:p-8">
        <h2 className="t-h3 text-ink">Email {to.full_name || to.email}</h2>
        <Field id="m-subject" text="Subject"><input id="m-subject" name="subject" required defaultValue={app ? `Your application: ${app.opportunity_title}` : 'Message from Cedar Initiative'} className={input} /></Field>
        <Field id="m-body" text="Message"><textarea id="m-body" name="body" required rows={7} className={input} /></Field>
        {state === 'sent' && <Notice kind="ok">Sent, and saved to their account.</Notice>}
        {state === 'logged' && <Notice>{p.mode === 'demo' ? 'Demo mode: saved to their account and opened in your email app.' : 'Saved to their account, but the email could not be delivered.'}</Notice>}
        <div className="flex gap-2">
          <button type="submit" disabled={state === 'sending'} className="btn-primary">{state === 'sending' ? 'Sending…' : 'Send'}</button>
          <button type="button" onClick={onClose} className="btn-glass">Close</button>
        </div>
      </form>
    </div>
  );
}
