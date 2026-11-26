'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import Icon from '../Icon';
import { authDestination } from '@/lib/auth-redirect';
import { usePlatform } from './usePlatform';
import { DemoBanner, Field, Notice, input } from './ui';

/** Firebase error codes in plain words. */
function friendly(msg: string) {
  if (/email-already-in-use|already registered/i.test(msg)) return 'An account with this email already exists. Sign in instead.';
  if (/invalid-credential|wrong-password|user-not-found|Invalid login credentials/i.test(msg)) return 'That email and password don’t match. Try again, or reset your password.';
  if (/weak-password|Password should be/i.test(msg)) return 'Choose a longer password (at least 8 characters).';
  if (/too-many-requests|rate limit/i.test(msg)) return 'Too many attempts. Wait a few minutes and try again.';
  if (/network|failed to fetch|load failed/i.test(msg)) return 'We couldn’t reach the server. Check your connection and try again.';
  return msg.replace(/^Firebase: /, '');
}

export default function AuthForm({ next = '/account/' }: { next?: string }) {
  const { p } = usePlatform();
  const destination = authDestination(next);
  const [mode, setMode] = useState<'signup' | 'signin' | 'link' | 'reset'>('signup');
  const [state, setState] = useState<{ busy?: boolean; error?: string; info?: string }>({});
  const inFlight = useRef(false);
  const feedback = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.error || state.info) feedback.current?.focus();
  }, [state.error, state.info]);

  function chooseMode(nextMode: typeof mode) {
    if (inFlight.current) return;
    setMode(nextMode);
    setState({});
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlight.current || state.busy) return;
    const f = new FormData(e.currentTarget);
    const email = String(f.get('email')).trim(), password = String(f.get('password') ?? ''), name = String(f.get('name') ?? '').trim();
    inFlight.current = true;
    setState({ busy: true });
    try {
      if (mode === 'signup') {
        const r = await p.signUp(email, password, name, destination);
        if (r.needsConfirm) return setState({ info: `We sent a confirmation link to ${email}. Open it to finish creating your account.` });
      } else if (mode === 'signin') await p.signIn(email, password);
      else if (mode === 'reset') {
        if (p.resetPassword) await p.resetPassword(email);
        return setState({ info: p.mode === 'demo' ? 'Demo mode: no email is sent. On the live site, a reset link goes to this address.' : `If ${email} has an account, a link to reset your password is on its way.` });
      }
      else {
        await p.sendLink(email, destination);
        if (p.mode === 'live') return setState({ info: `Check ${email} for a sign-in link.` });
      }
      location.href = destination;
    } catch (err) {
      setState({ error: (err as Error).message });
    } finally {
      inFlight.current = false;
    }
  }

  const method = (m: typeof mode, t: string) => (
    <button type="button" aria-pressed={mode === m} disabled={state.busy} onClick={() => chooseMode(m)} className={`min-h-[44px] flex-1 rounded-full px-4 py-2 text-sm font-semibold transition disabled:cursor-wait ${mode === m ? 'bg-cedar-700 text-white' : 'text-ink-soft hover:text-ink'}`}>{t}</button>
  );

  return (
    <div className="space-y-5">
      <DemoBanner />
      <div role="group" aria-label="Sign-in method" className="flex flex-wrap gap-1 rounded-3xl border border-ink/10 bg-white p-1">
        {method('signup', 'Create account')}{method('signin', 'Sign in')}{method('link', 'Email me a link')}
      </div>
      <form onSubmit={submit} className="space-y-5 rounded-[var(--radius-card)] border border-ink/10 bg-white p-6 sm:p-8">
        <fieldset disabled={state.busy} aria-busy={state.busy} className="space-y-5">
          <legend className="sr-only">{mode === 'signup' ? 'Create your volunteer account' : mode === 'signin' ? 'Sign in to your account' : mode === 'reset' ? 'Reset your password' : 'Sign in by email'}</legend>
          {mode === 'signup' && <Field id="name" text="Full name"><input id="name" name="name" required autoComplete="name" className={input} /></Field>}
          <Field id="email" text="Email"><input id="email" name="email" type="email" required autoComplete="email" className={input} /></Field>
          {mode !== 'link' && mode !== 'reset' && (
            <Field id="password" text="Password" hint={mode === 'signup' ? 'At least 8 characters.' : undefined}>
              <input id="password" name="password" type="password" required minLength={mode === 'signup' ? 8 : undefined} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} className={input} />
            </Field>
          )}
          {mode === 'signin' && <button type="button" onClick={() => chooseMode('reset')} className="min-h-[44px] text-left text-sm font-semibold text-cedar-700 underline underline-offset-4">Forgot your password?</button>}
          {mode === 'reset' && (
            <div className="space-y-2">
              <p className="text-sm text-ink-soft">Enter your email and we&rsquo;ll send you a link to choose a new password.</p>
              <button type="button" onClick={() => chooseMode('signin')} className="min-h-[44px] text-sm font-semibold text-cedar-700 underline underline-offset-4">Back to sign in</button>
            </div>
          )}
          <button type="submit" className="btn-primary w-full">
            {state.busy ? 'Please wait…' : mode === 'signup' ? 'Create my volunteer account' : mode === 'signin' ? 'Sign in' : mode === 'reset' ? 'Send reset link' : 'Send the link'} <Icon name="arrow" className="h-4 w-4" />
          </button>
        </fieldset>
        <span role="status" className="sr-only">{state.busy ? 'Please wait while we process your request.' : ''}</span>
        {(state.error || state.info) && (
          <div ref={feedback} tabIndex={-1}>
            {state.error && <Notice kind="error">{friendly(state.error)}</Notice>}
            {state.info && <Notice kind="ok">{state.info}</Notice>}
          </div>
        )}
        <p className="text-xs leading-relaxed text-ink-muted">
          We use your details only to run Cedar programs: matching you to roles, recording your hours and issuing certificates. You can ask us to delete your account at any time.
        </p>
      </form>
    </div>
  );
}
