'use client';

import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import Icon from '../Icon';
import type { Application, Doc, HourEntry, Message, Profile } from '@/lib/platform';
import { isStaff } from '@/lib/platform';
import { kindLabel, linkedInAddUrl } from '@/lib/platform/templates';
import { usePlatform } from './usePlatform';
import { Badge, Card, DemoBanner, Field, Notice, fmtDate, input } from './ui';

const AREAS = ['Collection', 'Sorting', 'Distribution', 'Teaching', 'Facilitation', 'Events', 'Mentoring', 'Communications', 'Design', 'Research', 'Data', 'Outreach', 'Leadership', 'Fundraising'];
const PROGRAMS = ['Ushnota Abhijan', 'CSEdWeek', 'ML Bangladesh', 'Climate', 'Communications', 'Other'];

export default function AccountApp() {
  const { p, me, refresh, tick } = usePlatform();
  const [apps, setApps] = useState<Application[]>([]);
  const [hours, setHours] = useState<HourEntry[]>([]);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [tab, setTab] = useState<'overview' | 'profile' | 'hours' | 'documents' | 'messages'>('overview');
  // Arriving from a password-reset email: ask for the new password first.
  const [recovering, setRecovering] = useState(false);
  useEffect(() => {
    if (new URLSearchParams(location.search).get('reset') === '1') setRecovering(true);
    return p.onRecovery?.(() => setRecovering(true));
  }, [p]);

  useEffect(() => {
    if (!me) return;
    Promise.all([p.myApplications(), p.myHours(), p.myDocuments(), p.myMessages()]).then(([a, h, d, m]) => { setApps(a); setHours(h); setDocs(d); setMsgs(m); });
  }, [me, p, tick]);

  if (me === undefined) return <div className="h-64 animate-pulse rounded-[var(--radius-card)] bg-ink/5" />;
  if (!me)
    return (
      <div className="space-y-5">
        <DemoBanner />
        <Card title="Sign in to your volunteer account">
          <p className="text-ink-soft">Track applications, log your hours and download certificates.</p>
          <Link href="/join/" className="btn-primary mt-5">Sign in or create an account <Icon name="arrow" className="h-4 w-4" /></Link>
        </Card>
      </div>
    );

  if (recovering && p.updatePassword) return <NewPassword onDone={() => { setRecovering(false); history.replaceState(null, '', '/account/'); }} />;

  const approved = hours.filter((h) => h.status === 'approved').reduce((a, h) => a + Number(h.hours), 0);
  const pending = hours.filter((h) => h.status === 'pending').reduce((a, h) => a + Number(h.hours), 0);
  const tabs = [['overview', 'Overview'], ['profile', 'Profile'], ['hours', 'Hours'], ['documents', `Certificates & letters (${docs.length})`], ['messages', `Messages (${msgs.length})`]] as const;

  return (
    <div className="space-y-6">
      <DemoBanner />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar me={me} />
          <div>
            <p className="text-lg font-semibold text-ink">{me.full_name || me.email}</p>
            <p className="text-sm text-ink-muted">{me.email}{me.role !== 'volunteer' && <> · <span className="font-semibold capitalize text-cedar-700">{me.role}</span></>}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {isStaff(me) && <Link href="/staff/" className="btn-primary !min-h-[44px]">Staff area <Icon name="arrow" className="h-4 w-4" /></Link>}
          {me.public_profile && me.handle && <Link href={`/profile/?u=${me.handle}`} className="btn-glass !min-h-[44px]">My public profile</Link>}
          <button type="button" onClick={() => p.signOut().then(refresh)} className="btn-glass !min-h-[44px]">Sign out</button>
        </div>
      </div>

      <nav aria-label="Account sections" className="flex gap-1 overflow-x-auto rounded-full border border-ink/10 bg-white p-1">
        {tabs.map(([k, t]) => (
          <button key={k} type="button" aria-current={tab === k ? 'page' : undefined} onClick={() => setTab(k)} className={`min-h-[44px] shrink-0 rounded-full px-4 text-sm font-semibold ${tab === k ? 'bg-cedar-700 text-white' : 'text-ink-soft hover:text-ink'}`}>{t}</button>
        ))}
      </nav>

      {tab === 'overview' && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cedar-700">Verified hours</p>
            <p className="mt-2 font-display text-6xl text-ink">{approved}</p>
            {pending > 0 && <p className="mt-1 text-sm text-ink-muted">+{pending} waiting for approval</p>}
            <button type="button" onClick={() => setTab('hours')} className="btn-glass mt-5 !min-h-[44px]">Log hours</button>
          </Card>
          <Card title="Applications" className="lg:col-span-2" action={<Link href="/opportunities/" className="link-underline text-sm font-semibold text-cedar-700">See open roles</Link>}>
            {apps.length === 0 ? <p className="text-ink-soft">No applications yet.</p> : (
              <ul className="divide-y divide-ink/10">
                {apps.map((a) => (
                  <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <span><span className="block font-semibold text-ink">{a.opportunity_title}</span><span className="text-sm text-ink-muted">Applied {fmtDate(a.created_at)}</span></span>
                    <span className="flex items-center gap-3"><Badge status={a.status} />{['new', 'reviewing'].includes(a.status) && <button type="button" className="text-sm text-ink-muted underline" onClick={() => p.withdraw(a.id).then(refresh)}>Withdraw</button>}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          {!me.full_name || !me.institution ? <div className="lg:col-span-3"><Notice>Finish your profile so team leads know who you are. <button type="button" className="font-semibold underline" onClick={() => setTab('profile')}>Edit profile</button></Notice></div> : null}
        </div>
      )}

      {tab === 'profile' && <ProfileForm me={me} onSaved={refresh} />}
      {tab === 'hours' && <HoursPanel hours={hours} onLogged={refresh} />}
      {tab === 'documents' && <DocsPanel docs={docs} />}
      {tab === 'messages' && (
        <Card title="Messages from the team">
          {msgs.length === 0 ? <p className="text-ink-soft">No messages yet. Emails the team sends you also appear here.</p> : (
            <ul className="space-y-4">{msgs.map((m) => <li key={m.id} className="rounded-2xl border border-ink/10 p-4"><p className="font-semibold text-ink">{m.subject}</p><p className="text-xs text-ink-muted">{fmtDate(m.created_at)}</p><p className="mt-2 whitespace-pre-line text-ink-soft">{m.body}</p></li>)}</ul>
          )}
        </Card>
      )}
    </div>
  );
}

function NewPassword({ onDone }: { onDone: () => void }) {
  const { p } = usePlatform();
  const [msg, setMsg] = useState<{ ok?: string; error?: string }>({});
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const a = String(f.get('pw')), b = String(f.get('pw2'));
    if (a !== b) return setMsg({ error: 'The two passwords don’t match.' });
    try { await p.updatePassword!(a); setMsg({ ok: 'Password changed. You’re signed in.' }); setTimeout(onDone, 1200); }
    catch (x) { setMsg({ error: (x as Error).message }); }
  }
  return (
    <form onSubmit={submit} className="max-w-lg">
      <Card title="Choose a new password">
        <div className="space-y-4">
          <Field id="pw" text="New password" hint="At least 8 characters."><input id="pw" name="pw" type="password" required minLength={8} autoComplete="new-password" className={input} /></Field>
          <Field id="pw2" text="Type it again"><input id="pw2" name="pw2" type="password" required minLength={8} autoComplete="new-password" className={input} /></Field>
          {msg.error && <Notice kind="error">{msg.error}</Notice>}
          {msg.ok && <Notice kind="ok">{msg.ok}</Notice>}
          <button type="submit" className="btn-primary">Save new password</button>
        </div>
      </Card>
    </form>
  );
}

function Avatar({ me, size = 'h-14 w-14' }: { me: Pick<Profile, 'photo_url' | 'full_name' | 'email'>; size?: string }) {
  return me.photo_url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={me.photo_url} alt="" className={`${size} rounded-full object-cover ring-2 ring-white`} />
  ) : (
    <span className={`${size} inline-flex items-center justify-center rounded-full bg-cedar-700 font-display text-xl text-white`}>{(me.full_name || me.email)[0]?.toUpperCase()}</span>
  );
}

function ProfileForm({ me, onSaved }: { me: Profile; onSaved: () => void }) {
  const { p } = usePlatform();
  const [areas, setAreas] = useState<string[]>(me.areas ?? []);
  const [photo, setPhoto] = useState(me.photo_url ?? '');
  const [msg, setMsg] = useState<{ ok?: string; error?: string }>({});
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const v = (k: string) => String(f.get(k) ?? '').trim() || null;
    try {
      await p.saveProfile({ full_name: v('full_name') ?? '', handle: v('handle')?.toLowerCase() ?? null, phone: v('phone'), institution: v('institution'), city: v('city'), bio: v('bio'), linkedin: v('linkedin'), areas, photo_url: photo || null, public_profile: f.get('public_profile') === 'on' });
      setMsg({ ok: 'Profile saved.' });
      onSaved();
    } catch (x) { setMsg({ error: (x as Error).message }); }
  }
  return (
    <form onSubmit={submit}>
      <Card title="Your profile">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex items-center gap-4 sm:col-span-2">
            <Avatar me={{ ...me, photo_url: photo }} size="h-20 w-20" />
            <label className="btn-glass !min-h-[44px] cursor-pointer">
              Upload photo
              <input type="file" accept="image/*" className="sr-only" onChange={async (e) => { const file = e.target.files?.[0]; if (file) setPhoto(await p.uploadPhoto(file)); }} />
            </label>
          </div>
          <Field id="full_name" text="Full name (as it should appear on certificates)"><input id="full_name" name="full_name" defaultValue={me.full_name} required className={input} /></Field>
          <Field id="phone" text="Phone or WhatsApp"><input id="phone" name="phone" type="tel" defaultValue={me.phone ?? ''} className={input} /></Field>
          <Field id="institution" text="School, university or workplace"><input id="institution" name="institution" defaultValue={me.institution ?? ''} className={input} /></Field>
          <Field id="city" text="City or district"><input id="city" name="city" defaultValue={me.city ?? ''} className={input} /></Field>
          <Field id="linkedin" text="LinkedIn profile URL"><input id="linkedin" name="linkedin" type="url" defaultValue={me.linkedin ?? ''} placeholder="https://www.linkedin.com/in/…" className={input} /></Field>
          <Field id="handle" text="Public profile address" hint="Lowercase letters, numbers and dashes, e.g. rahim-uddin"><input id="handle" name="handle" pattern="[a-z0-9-]{3,40}" defaultValue={me.handle ?? ''} className={input} /></Field>
          <Field id="bio" text="About you" className="sm:col-span-2"><textarea id="bio" name="bio" rows={3} maxLength={1200} defaultValue={me.bio ?? ''} className={input} /></Field>
          <fieldset className="sm:col-span-2">
            <legend className="text-sm font-semibold text-ink">Areas you want to work in</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {AREAS.map((a) => {
                const on = areas.includes(a);
                return <button key={a} type="button" aria-pressed={on} onClick={() => setAreas(on ? areas.filter((x) => x !== a) : [...areas, a])} className={`min-h-[40px] rounded-full border px-4 text-sm font-semibold ${on ? 'border-cedar-700 bg-cedar-700 text-white' : 'border-ink/15 text-ink-soft hover:text-ink'}`}>{a}</button>;
              })}
            </div>
          </fieldset>
          <label className="flex items-start gap-3 text-sm text-ink-soft sm:col-span-2">
            <input type="checkbox" name="public_profile" defaultChecked={me.public_profile} className="mt-0.5 h-5 w-5 accent-cedar-700" />
            Show a public profile with my name, photo, verified hours and certificates (never my email or phone).
          </label>
        </div>
        {msg.ok && <div className="mt-5"><Notice kind="ok">{msg.ok}</Notice></div>}
        {msg.error && <div className="mt-5"><Notice kind="error">{msg.error}</Notice></div>}
        <button type="submit" className="btn-primary mt-6">Save profile</button>
      </Card>
    </form>
  );
}

function HoursPanel({ hours, onLogged }: { hours: HourEntry[]; onLogged: () => void }) {
  const { p } = usePlatform();
  const [err, setErr] = useState('');
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    try {
      await p.logHours({ program: String(f.get('program')), area: String(f.get('area')), date: String(f.get('date')), hours: Number(f.get('hours')), note: String(f.get('note') || '') || null });
      form.reset();
      setErr('');
      onLogged();
    } catch (x) { setErr((x as Error).message); }
  }
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <form onSubmit={submit} className="lg:col-span-2">
        <Card title="Log hours">
          <div className="space-y-4">
            <Field id="program" text="Program"><select id="program" name="program" required className={input}>{PROGRAMS.map((x) => <option key={x}>{x}</option>)}</select></Field>
            <Field id="area" text="What you did"><select id="area" name="area" required className={input}>{AREAS.map((x) => <option key={x}>{x}</option>)}</select></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field id="date" text="Date"><input id="date" name="date" type="date" required max={new Date().toISOString().slice(0, 10)} className={input} /></Field>
              <Field id="hours" text="Hours"><input id="hours" name="hours" type="number" min="0.5" max="24" step="0.5" required className={input} /></Field>
            </div>
            <Field id="note" text="Note (optional)"><input id="note" name="note" className={input} /></Field>
            {err && <Notice kind="error">{err}</Notice>}
            <button type="submit" className="btn-primary w-full">Submit for approval</button>
            <p className="text-xs text-ink-muted">A team lead approves hours before they count towards certificates.</p>
          </div>
        </Card>
      </form>
      <Card title="Your hours" className="lg:col-span-3">
        {hours.length === 0 ? <p className="text-ink-soft">Nothing logged yet.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[28rem] text-left text-sm">
              <thead className="text-ink-muted"><tr><th className="py-2 pr-3">Date</th><th className="py-2 pr-3">Program · area</th><th className="py-2 pr-3 text-right">Hours</th><th className="py-2 text-right">Status</th></tr></thead>
              <tbody className="divide-y divide-ink/10">
                {hours.map((h) => <tr key={h.id}><td className="py-2.5 pr-3">{fmtDate(h.date)}</td><td className="py-2.5 pr-3">{h.program} · {h.area}</td><td className="py-2.5 pr-3 text-right tabular-nums">{h.hours}</td><td className="py-2.5 text-right"><Badge status={h.status} /></td></tr>)}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function DocsPanel({ docs }: { docs: Doc[] }) {
  const [copied, setCopied] = useState('');
  if (docs.length === 0) return <Card title="Certificates & letters"><p className="text-ink-soft">When the team issues you a certificate or letter, it appears here with a link anyone can use to check it.</p></Card>;
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {docs.map((d) => {
        const verify = `${location.origin}/verify/?id=${d.id}`;
        return (
          <li key={d.id} className="flex flex-col rounded-[var(--radius-card)] border border-ink/10 bg-white p-6">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cedar-700">{kindLabel[d.kind]}</p>
              <Badge status={d.status} />
            </div>
            <p className="mt-2 text-lg font-semibold text-ink">{d.title}</p>
            <p className="mt-1 text-sm text-ink-muted">Issued {fmtDate(d.issued_on)}{d.hours ? ` · ${d.hours} hours` : ''} · ID {d.id}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href={`/document/?id=${d.id}`} className="btn-primary !min-h-[44px]">View & download</Link>
              {d.kind !== 'termination' && d.status === 'valid' && (
                <>
                  <a href={linkedInAddUrl(d, location.origin)} target="_blank" rel="noopener noreferrer" className="btn-glass !min-h-[44px]"><Icon name="linkedin" className="h-4 w-4" /> Add to LinkedIn</a>
                  <button type="button" className="btn-glass !min-h-[44px]" onClick={() => navigator.clipboard?.writeText(verify).then(() => setCopied(d.id))}>{copied === d.id ? 'Link copied' : 'Copy verify link'}</button>
                </>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
