'use client';

import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import Icon from '../Icon';
import type { FormField } from '@/lib/forms';
import { usePlatform } from './usePlatform';
import { DemoBanner, Field, Notice, input } from './ui';

/** In-site application: signed-in volunteers apply with their profile plus the role's own questions. */
export default function ApplyForm({ slug, title, questions, open }: { slug: string; title: string; questions: FormField[]; open: boolean }) {
  const { p, me } = usePlatform();
  const [done, setDone] = useState(false);
  const [already, setAlready] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (me) p.myApplications().then((a) => setAlready(a.some((x) => x.opportunity === slug && x.status !== 'withdrawn')));
  }, [me, p, slug]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const answers: Record<string, string> = {};
    for (const q of questions) answers[q.label] = q.type === 'checkbox' ? (f.get(q.name) ? 'Yes' : 'No') : String(f.get(q.name) ?? '');
    setBusy(true);
    setErr('');
    try {
      await p.apply(slug, title, answers);
      setDone(true);
    } catch (x) {
      setErr((x as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (!open) return <Notice>This role isn&rsquo;t taking applications right now. Create an account and we&rsquo;ll tell you when it reopens.</Notice>;
  if (me === undefined) return <div className="h-40 animate-pulse rounded-[var(--radius-card)] bg-ink/5" />;
  if (!me)
    return (
      <div className="space-y-4 rounded-[var(--radius-card)] border border-ink/10 bg-white p-6 sm:p-8">
        <DemoBanner />
        <h2 className="t-h3 text-ink">Apply in two minutes</h2>
        <p className="text-ink-soft">Create a free volunteer account first. You&rsquo;ll use it to track your application, log your hours and get your certificates.</p>
        <Link href={`/join/?next=/opportunities/${slug}/%23apply`} className="btn-primary">Create account or sign in <Icon name="arrow" className="h-4 w-4" /></Link>
      </div>
    );
  if (done || already)
    return (
      <div role="status" className="rounded-[var(--radius-card)] border border-cedar-700/20 bg-cedar-50 p-6 sm:p-8">
        <p className="flex items-center gap-2 text-lg font-semibold text-cedar-900"><Icon name="check" /> {done ? 'Application sent.' : 'You have applied for this role.'}</p>
        <p className="mt-2 text-ink-soft">A team lead will review it and contact you. You can follow its status in your account.</p>
        <Link href="/account/" className="btn-primary mt-5">Go to my account <Icon name="arrow" className="h-4 w-4" /></Link>
      </div>
    );

  return (
    <form onSubmit={submit} className="space-y-5 rounded-[var(--radius-card)] border border-ink/10 bg-white p-6 sm:p-8">
      <DemoBanner />
      <h2 className="t-h3 text-ink">Apply: {title}</h2>
      <p className="text-sm text-ink-soft">Applying as <strong className="text-ink">{me.full_name || me.email}</strong>. Your profile (contact details, school, areas of interest) is shared with the team. <Link href="/account/" className="link-underline font-medium text-cedar-700">Edit profile</Link></p>
      {questions.map((q) => (
        <Field key={q.name} id={`q-${q.name}`} text={`${q.label}${q.required ? ' *' : ''}`} hint={q.help}>
          {q.type === 'textarea' ? <textarea id={`q-${q.name}`} name={q.name} required={q.required} rows={4} className={input} />
            : q.type === 'select' ? (
              <select id={`q-${q.name}`} name={q.name} required={q.required} defaultValue="" className={input}>
                <option value="" disabled>Choose…</option>{(q.options ?? []).map((o) => <option key={o}>{o}</option>)}
              </select>
            ) : q.type === 'checkbox' ? <input id={`q-${q.name}`} name={q.name} type="checkbox" required={q.required} className="mt-3 block h-5 w-5 accent-cedar-700" />
            : <input id={`q-${q.name}`} name={q.name} type={q.type} required={q.required} className={input} />}
        </Field>
      ))}
      {err && <Notice kind="error">{err}</Notice>}
      <button type="submit" disabled={busy} className="btn-primary w-full xs:w-auto">{busy ? 'Sending…' : 'Send application'} <Icon name="arrow" className="h-4 w-4" /></button>
    </form>
  );
}
