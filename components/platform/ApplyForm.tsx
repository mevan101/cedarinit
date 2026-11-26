'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import Icon from '../Icon';
import type { FormField } from '@/lib/forms';
import { usePlatform } from './usePlatform';
import { DemoBanner, Field, Notice, input } from './ui';

/** In-site application: signed-in volunteers apply with their profile plus the role's own questions. */
export default function ApplyForm({
  slug,
  title,
  questions,
  open,
}: {
  slug: string;
  title: string;
  questions: FormField[];
  open: boolean;
}) {
  const { p, me } = usePlatform();
  const [done, setDone] = useState(false);
  const [already, setAlready] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const successRef = useRef<HTMLHeadingElement>(null);
  const sending = useRef(false);

  useEffect(() => {
    if (done) successRef.current?.focus();
  }, [done]);

  useEffect(() => {
    let active = true;
    setAlready(false);
    if (me)
      p.myApplications()
        .then((a) => {
          if (active) setAlready(a.some((x) => x.opportunity === slug && x.status !== 'withdrawn'));
        })
        .catch(() => {
          if (active)
            setErr('We couldn’t check your previous applications. You can check them in your account.');
        });
    return () => {
      active = false;
    };
  }, [me, p, slug]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending.current) return;
    sending.current = true;
    const f = new FormData(e.currentTarget);
    const answers: Record<string, string> = {};
    for (const q of questions)
      answers[q.label] = q.type === 'checkbox' ? (f.get(q.name) ? 'Yes' : 'No') : String(f.get(q.name) ?? '');
    setBusy(true);
    setErr('');
    try {
      await p.apply(slug, title, answers);
      setDone(true);
    } catch (x) {
      setErr((x as Error).message);
    } finally {
      sending.current = false;
      setBusy(false);
    }
  }

  function renderContent() {
    if (!open)
      return (
        <Notice>
          This role isn&rsquo;t taking applications right now.{' '}
          <Link href="/opportunities/#roles" className="font-semibold underline underline-offset-4">
            Explore other roles
          </Link>
          .
        </Notice>
      );
    if (me === undefined)
      return (
        <div
          aria-busy="true"
          role="status"
          className="rounded-[var(--radius-card)] border border-ink/10 bg-white p-8 text-ink-soft"
        >
          Checking your account…
        </div>
      );
    if (!me)
      return (
        <div className="space-y-4 rounded-[var(--radius-card)] border border-ink/10 bg-white p-6 sm:p-8">
          <DemoBanner />
          <h2 className="t-h3 text-ink">Ready to apply?</h2>
          <p className="text-ink-soft">
            Create a free volunteer account or sign in. Then answer this role’s questions. You can track the
            application and hear from the team in your account.
          </p>
          <Link href={`/join/?next=/opportunities/${slug}/%23apply`} className="btn-primary">
            Create account or sign in <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
      );
    if (done || already)
      return (
        <div className="rounded-[var(--radius-card)] border border-cedar-700/20 bg-cedar-50 p-6 sm:p-8">
          <h2
            ref={successRef}
            tabIndex={-1}
            className="flex items-center gap-2 text-lg font-semibold text-cedar-900"
          >
            <Icon name="check" /> {done ? 'Application sent.' : 'You have applied for this role.'}
          </h2>
          <p className="mt-2 text-ink-soft">
            A team lead will review it. Replies arrive by email and in Account &gt; Messages. You can follow
            the application’s status in your account.
          </p>
          <Link href="/account/" className="btn-primary mt-5">
            Go to my account <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
      );

    return (
      <form
        onSubmit={submit}
        aria-busy={busy}
        className="space-y-5 rounded-[var(--radius-card)] border border-ink/10 bg-white p-6 sm:p-8"
      >
        <DemoBanner />
        <h2 className="t-h3 text-ink">Apply: {title}</h2>
        <p className="text-sm text-ink-soft">
          Applying as <strong className="text-ink">{me.full_name || me.email}</strong>. Your profile (contact
          details, school, areas of interest) is shared with the team.{' '}
          <Link href="/account/" className="link-underline font-medium text-cedar-700">
            Edit profile
          </Link>
        </p>
        <p className="text-sm text-ink-muted">
          Fields marked “required” need an answer. Other questions are optional.
        </p>
        <fieldset disabled={busy} className="space-y-5">
          <legend className="sr-only">Questions for {title}</legend>
          {questions.map((q) => (
            <Field
              key={q.name}
              id={`q-${q.name}`}
              text={`${q.label}${q.required ? ' (required)' : ''}`}
              hint={q.help}
            >
              {q.type === 'textarea' ? (
                <textarea id={`q-${q.name}`} name={q.name} required={q.required} rows={4} className={input} />
              ) : q.type === 'select' ? (
                <select
                  id={`q-${q.name}`}
                  name={q.name}
                  required={q.required}
                  defaultValue=""
                  className={input}
                >
                  <option value="" disabled>
                    Choose…
                  </option>
                  {(q.options ?? []).map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              ) : q.type === 'checkbox' ? (
                <input
                  id={`q-${q.name}`}
                  name={q.name}
                  type="checkbox"
                  required={q.required}
                  className="mt-3 block h-5 w-5 accent-cedar-700"
                />
              ) : (
                <input
                  id={`q-${q.name}`}
                  name={q.name}
                  type={q.type}
                  required={q.required}
                  className={input}
                />
              )}
            </Field>
          ))}
        </fieldset>
        {err && <Notice kind="error">{err}</Notice>}
        <button type="submit" disabled={busy} className="btn-primary w-full xs:w-auto">
          {busy ? 'Sending…' : 'Send application'} <Icon name="arrow" className="h-4 w-4" />
        </button>
      </form>
    );
  }

  return (
    <>
      <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {busy ? 'Sending your application…' : done ? 'Your application has been sent.' : ''}
      </p>
      {renderContent()}
    </>
  );
}
