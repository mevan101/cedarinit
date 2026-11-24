// Supabase Edge Function: lets staff email a volunteer from the staff area, and logs it.
// Deploy: supabase functions deploy send-email
// Secrets: supabase secrets set RESEND_API_KEY=... MAIL_FROM="Cedar Initiative <team@cedar-initiative.org>"
// Optional: ALLOWED_ORIGINS="https://cedar-initiative.org,https://www.cedar-initiative.org"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.118.0';

const allowed = (Deno.env.get('ALLOWED_ORIGINS') ?? '').split(',').map((s) => s.trim()).filter(Boolean);
const corsFor = (origin: string | null) => ({
  'Access-Control-Allow-Origin': !allowed.length ? '*' : origin && allowed.includes(origin) ? origin : allowed[0],
  'Access-Control-Allow-Headers': 'authorization, content-type, apikey, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  Vary: 'Origin',
});

Deno.serve(async (req) => {
  const cors = corsFor(req.headers.get('Origin'));
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);

  // Act as the caller, so row-level security decides what they can see and write.
  const caller = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
  });
  const { data: auth } = await caller.auth.getUser();
  if (!auth?.user) return json({ error: 'Sign in first' }, 401);
  const { data: me } = await caller.from('profiles').select('role').eq('id', auth.user.id).single();
  if (!me || !['manager', 'issuer', 'admin'].includes(me.role)) return json({ error: 'Staff only' }, 403);

  let input: { user_id?: string; subject?: string; body?: string; application_id?: string };
  try { input = await req.json(); } catch { return json({ error: 'Send JSON' }, 400); }
  const { user_id, subject, body, application_id } = input;
  if (!user_id || !subject || !body) return json({ error: 'user_id, subject and body are required' }, 400);
  if (subject.length > 200 || body.length > 10000) return json({ error: 'Subject or message is too long' }, 400);
  const { data: person, error } = await caller.from('profiles').select('email, full_name').eq('id', user_id).single();
  if (error || !person) return json({ error: 'Volunteer not found' }, 404);

  let delivered = false;
  const key = Deno.env.get('RESEND_API_KEY');
  if (key) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: Deno.env.get('MAIL_FROM') ?? 'Cedar Initiative <onboarding@resend.dev>',
        to: person.email,
        subject: subject.replace(/[\r\n]+/g, ' '),
        text: `Dear ${person.full_name || 'volunteer'},\n\n${body}\n\nCedar Initiative\nhttps://cedar-initiative.org`,
      }),
    });
    delivered = res.ok;
  }
  // Logged either way, so it shows in the volunteer's inbox on the site.
  await caller.from('messages').insert({ user_id, subject, body, application_id: application_id ?? null, delivered });
  return json({ ok: true, delivered });
});
