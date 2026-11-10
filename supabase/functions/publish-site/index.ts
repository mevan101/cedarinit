// Supabase Edge Function: the dashboard's "Publish the website" button. Editors and admins only.
// It calls the Cloudflare Workers Builds deploy hook, which rebuilds the site with the latest dashboard content.
// Secret: supabase secrets set CLOUDFLARE_DEPLOY_HOOK=https://api.cloudflare.com/client/v4/workers/builds/deploy_hooks/<id>
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.118.0';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type, apikey, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

  const caller = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
  });
  const { data: auth } = await caller.auth.getUser();
  if (!auth?.user) return json({ ok: false, message: 'Sign in first.' }, 401);
  const { data: me } = await caller.from('profiles').select('role').eq('id', auth.user.id).single();
  if (!me || !['editor', 'admin'].includes(me.role)) return json({ ok: false, message: 'Only editors can publish the website.' }, 403);

  const hook = Deno.env.get('CLOUDFLARE_DEPLOY_HOOK');
  if (!hook) return json({ ok: false, message: 'Publishing is not connected yet. Ask an admin to add the Cloudflare deploy hook (see docs/volunteer-platform.md).' });

  // One publish at a time is plenty: Cloudflare merges repeated requests while a build is starting.
  const res = await fetch(hook, { method: 'POST' });
  const body = await res.json().catch(() => ({}));
  await caller.from('site_settings').upsert({ key: 'last_publish', value: { at: new Date().toISOString(), by: auth.user.email, ok: res.ok } });
  if (!res.ok) return json({ ok: false, message: 'Cloudflare did not accept the request. Try again in a minute.' }, 502);
  return json({ ok: true, message: body?.result?.already_exists ? 'A publish is already running. Your changes will be included.' : 'Publishing. The site updates in about two minutes.' });
});
