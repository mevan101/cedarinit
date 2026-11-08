'use client';

import { useState, type FormEvent } from 'react';
import Icon from '../Icon';
import { usePlatform } from './usePlatform';
import { DemoBanner, Field, Notice, input } from './ui';

export default function AuthForm({ next = '/account/' }: { next?: string }) {
  const { p } = usePlatform();
  const [mode, setMode] = useState<'signup' | 'signin' | 'link'>('signup');
  const [state, setState] = useState<{ busy?: boolean; error?: string; info?: string }>({});

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get('email')).trim(), password = String(f.get('password') ?? ''), name = String(f.get('name') ?? '').trim();
    setState({ busy: true });
    try {
      if (mode === 'signup') {
        const r = await p.signUp(email, password, name);
        if (r.needsConfirm) return setState({ info: `We sent a confirmation link to ${email}. Open it to finish creating your account.` });
      } else if (mode === 'signin') await p.signIn(email, password);
      else {
        await p.sendLink(email);
        if (p.mode === 'live') return setState({ info: `Check ${email} for a sign-in link.` });
      }
      location.href = next;
    } catch (err) {
      setState({ error: (err as Error).message });
    }
  }

  const tab = (m: typeof mode, t: string) => (
    <button type="button" role="tab" aria-selected={mode === m} onClick={() => { setMode(m); setState({}); }} className={`min-h-[44px] flex-1 rounded-full px-4 text-sm font-semibold transition ${mode === m ? 'bg-cedar-700 text-white' : 'text-ink-soft hover:text-ink'}`}>{t}</button>
  );

  return (
    <div className="space-y-5">
      <DemoBanner />
      <div role="tablist" aria-label="Account" className="flex gap-1 rounded-full border border-ink/10 bg-white p-1">
        {tab('signup', 'Create account')}{tab('signin', 'Sign in')}{tab('link', 'Email me a link')}
      </div>
      <form onSubmit={submit} className="space-y-5 rounded-[var(--radius-card)] border border-ink/10 bg-white p-6 sm:p-8">
        {mode === 'signup' && <Field id="name" text="Full name"><input id="name" name="name" required autoComplete="name" className={input} /></Field>}
        <Field id="email" text="Email"><input id="email" name="email" type="email" required autoComplete="email" className={input} /></Field>
        {mode !== 'link' && (
          <Field id="password" text="Password" hint={mode === 'signup' ? 'At least 8 characters.' : undefined}>
            <input id="password" name="password" type="password" required minLength={8} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} className={input} />
          </Field>
        )}
        {state.error && <Notice kind="error">{state.error}</Notice>}
        {state.info && <Notice kind="ok">{state.info}</Notice>}
        <button type="submit" disabled={state.busy} className="btn-primary w-full">
          {state.busy ? 'Please wait…' : mode === 'signup' ? 'Create my volunteer account' : mode === 'signin' ? 'Sign in' : 'Send the link'} <Icon name="arrow" className="h-4 w-4" />
        </button>
        <p className="text-xs leading-relaxed text-ink-muted">
          We use your details only to run Cedar programs: matching you to roles, recording your hours and issuing certificates. You can ask us to delete your account at any time.
        </p>
      </form>
    </div>
  );
}
