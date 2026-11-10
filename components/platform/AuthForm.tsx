'use client';

import { useState, type FormEvent } from 'react';
import Icon from '../Icon';
import { usePlatform } from './usePlatform';
import { DemoBanner, Field, Notice, input } from './ui';
import { withBase } from '@/lib/base-path';

/** Firebase error codes in plain words. */
function friendly(msg: string) {
  if (/email-already-in-use|already registered/i.test(msg)) return 'An account with this email already exists. Sign in instead.';
  if (/invalid-credential|wrong-password|user-not-found|Invalid login credentials/i.test(msg)) return 'That email and password don’t match. Try again, or reset your password.';
  if (/weak-password|Password should be/i.test(msg)) return 'Choose a longer password (at least 8 characters).';
  if (/too-many-requests|rate limit/i.test(msg)) return 'Too many attempts. Wait a few minutes and try again.';
  if (/network/.test(msg)) return 'We couldn’t reach the server. Check your connection and try again.';
  return msg.replace(/^Firebase: /, '');
}

export default function AuthForm({ next = '/account/' }: { next?: string }) {
  const { p } = usePlatform();
  const [mode, setMode] = useState<'signup' | 'signin' | 'link' | 'reset'>('signup');
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
      else if (mode === 'reset') {
        if (p.resetPassword) await p.resetPassword(email);
        return setState({ info: p.mode === 'demo' ? 'Demo mode: no email is sent. On the live site, a reset link goes to this address.' : `If ${email} has an account, a link to reset your password is on its way.` });
      }
      else {
        await p.sendLink(email);
        if (p.mode === 'live') return setState({ info: `Check ${email} for a sign-in link.` });
      }
      location.href = withBase(next);
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
        {mode !== 'link' && mode !== 'reset' && (
          <Field id="password" text="Password" hint={mode === 'signup' ? 'At least 8 characters.' : undefined}>
            <input id="password" name="password" type="password" required minLength={8} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} className={input} />
          </Field>
        )}
        {mode === 'signin' && <button type="button" onClick={() => { setMode('reset'); setState({}); }} className="text-sm font-semibold text-cedar-700 underline underline-offset-4">Forgot your password?</button>}
        {mode === 'reset' && <p className="text-sm text-ink-soft">Enter your email and we&rsquo;ll send you a link to choose a new password.</p>}
        {state.error && <Notice kind="error">{friendly(state.error)}</Notice>}
        {state.info && <Notice kind="ok">{state.info}</Notice>}
        <button type="submit" disabled={state.busy} className="btn-primary w-full">
          {state.busy ? 'Please wait…' : mode === 'signup' ? 'Create my volunteer account' : mode === 'signin' ? 'Sign in' : mode === 'reset' ? 'Send reset link' : 'Send the link'} <Icon name="arrow" className="h-4 w-4" />
        </button>
        <p className="text-xs leading-relaxed text-ink-muted">
          We use your details only to run Cedar programs: matching you to roles, recording your hours and issuing certificates. You can ask us to delete your account at any time.
        </p>
      </form>
    </div>
  );
}
