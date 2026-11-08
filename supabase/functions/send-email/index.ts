// Supabase Edge Function: lets staff email a volunteer from the staff area, and logs it.
// Deploy: supabase functions deploy send-email
// Secrets: supabase secrets set RESEND_API_KEY=... MAIL_FROM="Cedar Initiative <team@cedar-initiative.org>"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.118.0';

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, content-type, apikey, x-client-info' };

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

  // Act as the caller, so row-level security decides whether they're staff.
  const caller = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
  });
  const { data: isStaff } = await caller.rpc('has_role', { min_role: 'manager' });
  if (!isStaff) return json({ error: 'Staff only' }, 403);

  const { user_id, subject, body, application_id } = await req.json();
  if (!user_id || !subject || !body) return json({ error: 'user_id, subject and body are required' }, 400);
  const { data: person, error } = await caller.from('profiles').select('email, full_name').eq('id', user_id).single();
  if (error || !person) return json({ error: 'Volunteer not found' }, 404);

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${Deno.env.get('RESEND_API_KEY')}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: Deno.env.get('MAIL_FROM'), to: person.email, subject, text: `Dear ${person.full_name || 'volunteer'},\n\n${body}\n\nCedar Initiative\nhttps://cedar-initiative.org` }),
  });
  await caller.from('messages').insert({ user_id, subject, body, application_id: application_id ?? null, delivered: res.ok });
  return json({ ok: res.ok }, res.ok ? 200 : 502);
});
