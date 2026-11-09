-- Cedar Initiative: website editing from the dashboard, the internal team area, an audit log, and security fixes.
-- Run after 0001 and 0002. ("editor" is added to app_role in 0002, because Postgres can't use a new enum value
-- in the same transaction that adds it.)
--
-- Roles after this migration:
--   volunteer  own profile, applications, hours, documents
--   editor     edits the public website (stories, pages, team, sponsors, links, settings). No volunteer data.
--   manager    applications, hours, messages, internal area
--   issuer     manager + issues and revokes certificates and letters
--   admin      everything, including roles and the audit log

-- ------------------------------------------------------------ helpers live in a schema the API doesn't expose
create schema if not exists private;
grant usage on schema private to anon, authenticated;

-- Moving the function keeps every policy that already uses it (policies point at the function, not its name).
alter function public.has_role(public.app_role) set schema private;

create or replace function private.has_role(min_role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles p where p.id = auth.uid() and (
      p.role = 'admin'
      or (min_role = 'manager' and p.role in ('manager', 'issuer'))
      or (min_role = 'issuer' and p.role = 'issuer')
      or (min_role = 'editor' and p.role = 'editor')
      or (min_role = 'volunteer')
    )
  );
$$;

-- Anyone on the team (not a plain volunteer).
create or replace function private.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role <> 'volunteer');
$$;

revoke all on function private.has_role(public.app_role) from public;
revoke all on function private.is_staff() from public;
grant execute on function private.has_role(public.app_role) to anon, authenticated;
grant execute on function private.is_staff() to anon, authenticated;

-- The role guard called has_role by its old name; point it at the new home.
create or replace function public.protect_role()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  -- auth.uid() is null for the service role and the SQL editor, which is how the first admin is set up.
  if new.role is distinct from old.role and auth.uid() is not null and not private.has_role('admin') then
    raise exception 'Only an admin can change roles';
  end if;
  return new;
end;
$$;

-- Trigger functions should never be callable over the API.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.protect_role() from public, anon, authenticated;

alter function public.new_document_id() set search_path = public, extensions;

-- Volunteers can't change their own email in the profile table (auth owns it).
create or replace function private.protect_profile()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not private.has_role('admin') then
    new.email := old.email;
    new.created_at := old.created_at;
  end if;
  return new;
end;
$$;
create trigger profiles_protect_fields before update on public.profiles for each row execute function private.protect_profile();

-- Managers need to see editors and other staff in the people list; editors see only themselves (already covered).

-- ------------------------------------------------------------ audit log
create table public.audit_log (
  id bigint generated always as identity primary key,
  actor uuid default auth.uid(),
  actor_email text,
  table_name text not null,
  row_id text,
  action text not null check (action in ('insert', 'update', 'delete')),
  changes jsonb not null default '{}',
  at timestamptz not null default now()
);
create index audit_log_at on public.audit_log (at desc);
alter table public.audit_log enable row level security;
create policy "admins read" on public.audit_log for select using (private.has_role('admin'));
-- No insert/update/delete policies: only the trigger below writes, and nobody edits history.

create or replace function private.audit()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  r jsonb := case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end;
  diff jsonb := '{}';
  k text;
begin
  if tg_op = 'UPDATE' then
    for k in select jsonb_object_keys(to_jsonb(new)) loop
      if to_jsonb(new) -> k is distinct from to_jsonb(old) -> k and k not in ('updated_at') then
        diff := diff || jsonb_build_object(k, jsonb_build_object('from', to_jsonb(old) -> k, 'to', to_jsonb(new) -> k));
      end if;
    end loop;
    if diff = '{}' then return new; end if;
  else
    diff := r;
  end if;
  -- Long text bodies make the log unreadable; keep their size instead.
  if diff ? 'body' and tg_op <> 'UPDATE' then diff := diff - 'body' || jsonb_build_object('body', '(' || length(r ->> 'body') || ' characters)'); end if;
  insert into audit_log (actor, actor_email, table_name, row_id, action, changes)
  values (auth.uid(), (select email from profiles where id = auth.uid()), tg_table_name, coalesce(r ->> 'id', r ->> 'key'), lower(tg_op), diff);
  return case when tg_op = 'DELETE' then old else new end;
end;
$$;
revoke all on function private.audit() from public, anon, authenticated;

create trigger audit_profiles after update on public.profiles for each row
  when (old.role is distinct from new.role) execute function private.audit();
create trigger audit_documents after insert or update on public.documents for each row execute function private.audit();
create trigger audit_applications after update on public.applications for each row
  when (old.status is distinct from new.status) execute function private.audit();

create or replace function private.touch()
returns trigger language plpgsql set search_path = public as $$ begin new.updated_at := now(); new.updated_by := auth.uid(); return new; end; $$;

-- ------------------------------------------------------------ website: settings (contact, social links, banner, footer links)
create table public.site_settings (
  key text primary key check (key ~ '^[a-z0-9_]{2,40}$'),
  value jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id) default auth.uid()
);
alter table public.site_settings enable row level security;
create policy "public read" on public.site_settings for select using (true);
create policy "editors write" on public.site_settings for insert with check (private.has_role('editor'));
create policy "editors update" on public.site_settings for update using (private.has_role('editor'));
create policy "editors delete" on public.site_settings for delete using (private.has_role('editor'));
create trigger site_settings_touch before update on public.site_settings for each row execute function private.touch();
create trigger audit_site_settings after insert or update or delete on public.site_settings for each row execute function private.audit();

-- ------------------------------------------------------------ website: stories and pages
create table public.site_posts (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'story' check (kind in ('story', 'page')),
  slug text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{1,90}$'),
  title text not null check (char_length(title) between 2 and 200),
  excerpt text check (char_length(excerpt) <= 400),
  description text check (char_length(description) <= 300),
  body text not null default '' check (char_length(body) <= 100000),
  gallery jsonb not null default '[]' check (jsonb_typeof(gallery) = 'array'),
  cover_url text,
  cover_alt text,
  category text,
  author text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id) default auth.uid()
);
alter table public.site_posts enable row level security;
create policy "public reads published" on public.site_posts for select
  using ((status = 'published' and published_at <= now()) or private.has_role('editor'));
create policy "editors write" on public.site_posts for insert with check (private.has_role('editor'));
create policy "editors update" on public.site_posts for update using (private.has_role('editor'));
create policy "editors delete" on public.site_posts for delete using (private.has_role('editor'));
create trigger site_posts_touch before update on public.site_posts for each row execute function private.touch();
create trigger audit_site_posts after insert or update or delete on public.site_posts for each row execute function private.audit();

-- ------------------------------------------------------------ website: team members
create table public.site_team (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title text not null default '',
  team text not null default 'Volunteers',
  bio text check (char_length(bio) <= 1500),
  photo_url text,
  linkedin text,
  founder boolean not null default false,
  sort int not null default 100,
  visible boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id) default auth.uid()
);
alter table public.site_team enable row level security;
create policy "public reads visible" on public.site_team for select using (visible or private.has_role('editor'));
create policy "editors write" on public.site_team for insert with check (private.has_role('editor'));
create policy "editors update" on public.site_team for update using (private.has_role('editor'));
create policy "editors delete" on public.site_team for delete using (private.has_role('editor'));
create trigger site_team_touch before update on public.site_team for each row execute function private.touch();
create trigger audit_site_team after insert or update or delete on public.site_team for each row execute function private.audit();

-- ------------------------------------------------------------ website: sponsors and partners
create table public.site_sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text not null,
  url text,
  program text not null default 'Cedar',
  size text not null default 'normal' check (size in ('normal', 'tall', 'xl')),
  sort int not null default 100,
  visible boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id) default auth.uid()
);
alter table public.site_sponsors enable row level security;
create policy "public reads visible" on public.site_sponsors for select using (visible or private.has_role('editor'));
create policy "editors write" on public.site_sponsors for insert with check (private.has_role('editor'));
create policy "editors update" on public.site_sponsors for update using (private.has_role('editor'));
create policy "editors delete" on public.site_sponsors for delete using (private.has_role('editor'));
create trigger site_sponsors_touch before update on public.site_sponsors for each row execute function private.touch();
create trigger audit_site_sponsors after insert or update or delete on public.site_sponsors for each row execute function private.audit();

-- ------------------------------------------------------------ internal team area (never public)
create table public.internal_notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null default '' check (char_length(body) <= 50000),
  category text not null default 'Notice' check (category in ('Notice', 'Handbook', 'Contacts', 'Finance', 'Links', 'Meeting notes')),
  url text,
  pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id) default auth.uid()
);
alter table public.internal_notes enable row level security;
create policy "team reads" on public.internal_notes for select using (private.is_staff());
create policy "managers write" on public.internal_notes for insert with check (private.has_role('manager'));
create policy "managers update" on public.internal_notes for update using (private.has_role('manager'));
create policy "managers delete" on public.internal_notes for delete using (private.has_role('manager'));
create trigger internal_notes_touch before update on public.internal_notes for each row execute function private.touch();
create trigger audit_internal_notes after insert or update or delete on public.internal_notes for each row execute function private.audit();

-- ------------------------------------------------------------ contact form and other site forms
-- Anyone can send; only staff can read. Replaces the old WordPress Contact Form 7 endpoint.
create table public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  form text not null check (form ~ '^[a-z0-9-]{2,60}$'),
  name text check (char_length(name) <= 200),
  email text check (char_length(email) <= 320),
  subject text check (char_length(subject) <= 300),
  data jsonb not null default '{}' check (jsonb_typeof(data) = 'object' and pg_column_size(data) <= 20000),
  page text check (char_length(page) <= 300),
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  staff_notes text,
  created_at timestamptz not null default now()
);
create index form_submissions_at on public.form_submissions (created_at desc);
alter table public.form_submissions enable row level security;
create policy "anyone sends" on public.form_submissions for insert to anon, authenticated with check (status = 'new' and staff_notes is null);
create policy "staff read" on public.form_submissions for select using (private.has_role('manager'));
create policy "staff update" on public.form_submissions for update using (private.has_role('manager'));
create policy "admins delete" on public.form_submissions for delete using (private.has_role('admin'));

-- A simple brake on spam: 5 messages per address per 10 minutes, 300 in total per hour.
create or replace function private.form_brake()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from form_submissions where created_at > now() - interval '1 hour') >= 300 then
    raise exception 'The form is busy. Please try again later or email info@cedar-initiative.org.';
  end if;
  if new.email is not null and (select count(*) from form_submissions where lower(email) = lower(new.email) and created_at > now() - interval '10 minutes') >= 5 then
    raise exception 'You have sent several messages in a few minutes. Please wait a little before sending another.';
  end if;
  new.created_at := now();
  return new;
end;
$$;
revoke all on function private.form_brake() from public, anon, authenticated;
create trigger form_submissions_brake before insert on public.form_submissions for each row execute function private.form_brake();

-- ------------------------------------------------------------ media library for the website
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-media', 'site-media', true, 8388608, array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'application/pdf'])
on conflict (id) do nothing;
create policy "site media read" on storage.objects for select using (bucket_id = 'site-media');
create policy "site media upload" on storage.objects for insert with check (bucket_id = 'site-media' and private.has_role('editor'));
create policy "site media update" on storage.objects for update using (bucket_id = 'site-media' and private.has_role('editor'));
create policy "site media delete" on storage.objects for delete using (bucket_id = 'site-media' and private.has_role('editor'));

-- Avatars: limit size and type, and let people replace or remove their own.
update storage.buckets set file_size_limit = 3145728, allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'] where id = 'avatars';
create policy "avatar delete own" on storage.objects for delete using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
