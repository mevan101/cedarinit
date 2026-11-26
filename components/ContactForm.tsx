'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import Icon from './Icon';
import { site } from '@/lib/site';
import { formToObject, sendForm } from '@/lib/send-form';

type Status = 'idle' | 'sending' | 'sent' | 'error';
type Errors = Partial<Record<'name' | 'email' | 'subject' | 'message', string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Contact form. Posts the original Contact Form 7 field names to the existing
 * CF7 endpoint only when the site runs without Supabase. If sending fails,
 * the visitor is offered a pre-filled email so no message is ever lost.
 */
export default function ContactForm() {
  const id = useId();
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const [serverMsg, setServerMsg] = useState('');
  const [subject, setSubject] = useState('');
  const [ready, setReady] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get('subject');
    if (s) setSubject(s.slice(0, 160));
    const message = formRef.current?.elements.namedItem('your-message') as HTMLTextAreaElement | null;
    if (message && params.get('message')) message.value = params.get('message')!.slice(0, 5000);
    setReady(true);
    return () => requestRef.current?.abort();
  }, []);

  const validate = (fd: FormData): Errors => {
    const e: Errors = {};
    if (!String(fd.get('your-name') ?? '').trim()) e.name = 'Please enter your name.';
    const email = String(fd.get('your-email') ?? '').trim();
    if (!email) e.email = 'Please enter your email address.';
    else if (!EMAIL_RE.test(email)) e.email = 'Please enter a valid email address, like name@example.com.';
    if (!String(fd.get('your-subject') ?? '').trim()) e.subject = 'Please add a subject.';
    if (String(fd.get('your-message') ?? '').trim().length < 10) e.message = 'Please write a message of at least 10 characters.';
    return e;
  };

  const mailto = (fd: FormData) =>
    `mailto:${site.email}?subject=${encodeURIComponent(String(fd.get('your-subject') ?? ''))}&body=${encodeURIComponent(
      `${fd.get('your-message') ?? ''}\n\n${fd.get('your-name') ?? ''} <${fd.get('your-email') ?? ''}>`,
    )}`;

  const onSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (requestRef.current) return;
    const form = ev.currentTarget;
    const fd = new FormData(form);
    if (fd.get('website')) return; // honeypot
    const e = validate(fd);
    setErrors(e);
    if (Object.keys(e).length) {
      const first = form.querySelector<HTMLElement>(`[name="${{ name: 'your-name', email: 'your-email', subject: 'your-subject', message: 'your-message' }[Object.keys(e)[0] as keyof Errors]}"]`);
      first?.focus();
      return;
    }
    fd.delete('website');
    const controller = new AbortController();
    requestRef.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    const finish = () => {
      window.clearTimeout(timeout);
      requestRef.current = null;
      requestAnimationFrame(() => statusRef.current?.focus());
    };
    setStatus('sending');
    try {
      const f = formToObject(fd);
      const saved = await sendForm('contact', { name: f['your-name'], email: f['your-email'], subject: f['your-subject'], message: f['your-message'] }, controller.signal);
      if (saved) {
        setStatus('sent');
        setServerMsg('');
        form.reset();
        setSubject('');
        finish();
        return;
      }
    } catch {
      setStatus('error');
      setServerMsg(mailto(fd));
      finish();
      return;
    }
    fd.append('_wpcf7', site.contactFormId);
    fd.append('_wpcf7_unit_tag', site.contactUnitTag);
    fd.append('_wpcf7_container_post', '1287');
    fd.append('_wpcf7_locale', 'en_US');
    setStatus('sending');
    try {
      const res = await fetch(site.contactEndpoint, { method: 'POST', body: fd, signal: controller.signal });
      const json = (await res.json().catch(() => ({}))) as { status?: string; message?: string };
      if (res.ok && json.status === 'mail_sent') {
        setStatus('sent');
        setServerMsg('');
        form.reset();
        setSubject('');
      } else {
        throw new Error(json.message || `HTTP ${res.status}`);
      }
    } catch {
      setStatus('error');
      setServerMsg(mailto(fd));
    }
    finish();
  };

  const field = 'block min-h-12 w-full rounded-xl border border-ink/25 bg-paper px-4 py-3 text-base text-ink focus:border-cedar-700 focus:bg-white aria-[invalid=true]:border-red-700';
  const label = 'order-first mb-2 block text-sm font-semibold text-ink';

  const Err = ({ k }: { k: keyof Errors }) =>
    errors[k] ? (
      <p id={`${id}-${k}-err`} className="mt-2 flex items-center gap-1.5 text-sm font-medium text-red-700">
        <Icon name="close" className="h-4 w-4" /> {errors[k]}
      </p>
    ) : null;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-4" aria-describedby={`${id}-note`}>
      <p id={`${id}-note`} className="text-sm leading-relaxed text-ink-muted">All fields are required. Your details and message are shared with the Cedar team so they can reply by email. If we’ve started a message for you, add your details and remove anything that doesn’t apply.</p>
      {Object.keys(errors).length > 0 && <p role="alert" className="border-l-2 border-red-700 pl-4 text-sm font-medium text-red-700">Please check the marked fields. Your message is still here.</p>}
      <fieldset disabled={!ready || status === 'sending'} className="space-y-5 disabled:opacity-70">
      <legend className="sr-only">Your message to Cedar</legend>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <div className="flex flex-col">
            <input id={`${id}-name`} name="your-name" autoComplete="name" placeholder="Your name" className={field} aria-invalid={!!errors.name} aria-describedby={errors.name ? `${id}-name-err` : undefined} required />
            <label htmlFor={`${id}-name`} className={label}>Your name</label>
          </div>
          <Err k="name" />
        </div>
        <div>
          <div className="flex flex-col">
            <input id={`${id}-email`} name="your-email" type="email" inputMode="email" autoComplete="email" placeholder="Your email" className={field} aria-invalid={!!errors.email} aria-describedby={errors.email ? `${id}-email-err` : undefined} required />
            <label htmlFor={`${id}-email`} className={label}>Your email</label>
          </div>
          <Err k="email" />
        </div>
      </div>
      <div>
        <div className="flex flex-col">
          <input id={`${id}-subject`} name="your-subject" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} className={field} aria-invalid={!!errors.subject} aria-describedby={errors.subject ? `${id}-subject-err` : undefined} required />
          <label htmlFor={`${id}-subject`} className={label}>Subject</label>
        </div>
        <Err k="subject" />
      </div>
      <div>
        <div className="flex flex-col">
          <textarea id={`${id}-message`} name="your-message" rows={6} placeholder="Your message" className={`${field} resize-y`} aria-invalid={!!errors.message} aria-describedby={errors.message ? `${id}-message-err` : undefined} required />
          <label htmlFor={`${id}-message`} className={label}>What would you like to talk about?</label>
        </div>
        <Err k="message" />
      </div>
      <div className="hidden" aria-hidden="true">
        <label>Leave this empty <input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button type="submit" className="btn-primary w-full sm:w-auto" disabled={status === 'sending'} aria-disabled={status === 'sending'}>
          {status === 'sending' ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" /> Sending…
            </>
          ) : (
            <>
              Send message <Icon name="arrow" className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
      </fieldset>

      <div ref={statusRef} tabIndex={-1} role="status" aria-live="polite" className="outline-none">
        {status === 'sent' && (
          <p className="flex items-start gap-3 rounded-2xl border border-cedar-500/30 bg-cedar-50 p-4 text-cedar-900">
            <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0" />
            <span>Thank you. Your message has been received. Keep an eye on your email for a reply from the team.</span>
          </p>
        )}
        {status === 'error' && (
          <p className="rounded-2xl border border-amber-500/40 bg-amber-50 p-4 text-amber-950">
            We couldn’t confirm delivery. Your message is still here. <a href={serverMsg} className="font-semibold underline underline-offset-4">Open your message in your email app</a>, or copy it and email <a href={`mailto:${site.email}`} className="break-words font-semibold underline underline-offset-4">{site.email}</a>.
          </p>
        )}
      </div>
      <noscript><p className="text-sm text-ink-soft">This form needs JavaScript. You can email <a href={`mailto:${site.email}`} className="link-underline font-semibold text-cedar-700">{site.email}</a> instead.</p></noscript>
    </form>
  );
}
