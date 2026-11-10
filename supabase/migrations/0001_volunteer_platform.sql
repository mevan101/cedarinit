-- Cedar Initiative volunteer platform: profiles, applications, hours, credentials and letters, messages.
-- Apply with the Supabase CLI (`supabase db push`) or paste into the SQL editor.
-- Security model: every table has row-level security. Volunteers see only their own rows.
-- Staff rights come from profiles.role; only admins can change roles.

create extension if not exists pgcrypto with schema extensions;

create type public.app_role as enum ('volunteer', 'manager', 'issuer', 'admin');

-- ---------------------------------------------------------------- profiles
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null default '',
  handle text unique check (handle ~ '^[a-z0-9-]{3,40}$'),
  photo_url text,
  phone text,
  institution text,
  city text,
  bio text check (char_length(bio) <= 1200),
  linkedin text,
  areas text[] not null default '{}',
  public_profile boolean not null default false,
  role public.app_role not null default 'volunteer',
  created_at timestamptz not null default now()
);

-- Staff check used by the policies below. "manager" covers applications, hours and messages;
-- "issuer" also issues and revokes documents; "admin" can do everything, including roles.
create or replace function public.has_role(min_role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from profiles p where p.id = auth.uid() and (
      p.role = 'admin'
      or (min_role = 'manager' and p.role in ('manager', 'issuer'))
      or (min_role = 'issuer' and p.role = 'issuer')
      or (min_role = 'volunteer')
    )
  );
$$;

-- New sign-ups get a profile automatically.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, email, full_name) values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- Volunteers can't promote themselves.
create or replace function public.protect_role()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  -- auth.uid() is null for the service role and the SQL editor, which is how the first admin is set up.
  if new.role is distinct from old.role and auth.uid() is not null and not has_role('admin') then
    raise exception 'Only an admin can change roles';
  end if;
  return new;
end;
$$;
create trigger profiles_protect_role before update on public.profiles for each row execute function public.protect_role();

alter table public.profiles enable row level security;
create policy "read own or staff" on public.profiles for select using (id = auth.uid() or has_role('manager'));
create policy "update own" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "admin updates anyone" on public.profiles for update using (has_role('admin'));

-- ---------------------------------------------------------------- applications
create table public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  opportunity text not null,            -- slug of content/opportunities/<slug>.md
  opportunity_title text not null,
  answers jsonb not null default '{}',
  status text not null default 'new' check (status in ('new', 'reviewing', 'accepted', 'declined', 'withdrawn')),
  staff_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, opportunity)
);
alter table public.applications enable row level security;
create policy "apply as yourself" on public.applications for insert with check (user_id = auth.uid() and status = 'new' and staff_notes is null);
create policy "read own or staff" on public.applications for select using (user_id = auth.uid() or has_role('manager'));
create policy "staff update" on public.applications for update using (has_role('manager'));
create policy "withdraw own" on public.applications for update using (user_id = auth.uid()) with check (user_id = auth.uid() and status = 'withdrawn');

-- ---------------------------------------------------------------- hours
create table public.hours (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  program text not null,
  area text not null,
  date date not null,
  hours numeric(5, 2) not null check (hours > 0 and hours <= 24),
  note text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  logged_by uuid references public.profiles (id),
  approved_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);
alter table public.hours enable row level security;
create policy "log own (pending)" on public.hours for insert with check (user_id = auth.uid() and status = 'pending');
create policy "staff log" on public.hours for insert with check (has_role('manager'));
create policy "read own or staff" on public.hours for select using (user_id = auth.uid() or has_role('manager'));
create policy "staff approve" on public.hours for update using (has_role('manager'));
create policy "delete own pending" on public.hours for delete using (user_id = auth.uid() and status = 'pending');

-- ---------------------------------------------------------------- documents (certificates and letters)
-- Short, unguessable IDs like CI-2026-7F3K9QXM, printed on the document and used by /verify/.
create or replace function public.new_document_id()
returns text language plpgsql as $$
declare alphabet text := '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; out text := ''; b bytea := extensions.gen_random_bytes(8);
begin
  for i in 0..7 loop out := out || substr(alphabet, (get_byte(b, i) % 32) + 1, 1); end loop;
  return 'CI-' || to_char(now(), 'YYYY') || '-' || out;
end;
$$;

create table public.documents (
  id text primary key default public.new_document_id(),
  user_id uuid not null references public.profiles (id) on delete restrict,
  recipient_name text not null,
  kind text not null check (kind in ('certificate', 'appointment', 'recommendation', 'offer', 'experience', 'termination')),
  title text not null,
  program text,
  hours numeric(7, 2),
  areas text[] not null default '{}',
  body text not null default '',
  issued_on date not null default current_date,
  expires_on date,
  signer_name text not null,
  signer_title text not null,
  status text not null default 'valid' check (status in ('valid', 'revoked')),
  revoked_reason text,
  issued_by uuid references public.profiles (id) default auth.uid(),
  created_at timestamptz not null default now()
);
alter table public.documents enable row level security;
create policy "read own or staff" on public.documents for select using (user_id = auth.uid() or has_role('manager'));
create policy "issuers issue" on public.documents for insert with check (has_role('issuer'));
create policy "issuers revoke" on public.documents for update using (has_role('issuer'));

-- Public verification: the minimum needed to confirm a document is genuine.
-- Termination letters are never verifiable publicly.
create or replace function public.verify_document(doc_id text)
returns table (id text, recipient_name text, kind text, title text, program text, hours numeric, areas text[], issued_on date, expires_on date, signer_name text, signer_title text, status text)
language sql stable security definer set search_path = public as $$
  select d.id, d.recipient_name, d.kind, d.title, d.program, d.hours, d.areas, d.issued_on, d.expires_on, d.signer_name, d.signer_title,
    case when d.status = 'revoked' then 'revoked' when d.expires_on is not null and d.expires_on < current_date then 'expired' else 'valid' end
  from documents d where d.id = upper(trim(doc_id)) and d.kind <> 'termination';
$$;
-- Public profile page: only what the volunteer chose to show.
create or replace function public.public_profile(p_handle text)
returns table (full_name text, handle text, photo_url text, institution text, city text, bio text, linkedin text, areas text[], approved_hours numeric, documents jsonb)
language sql stable security definer set search_path = public as $$
  select p.full_name, p.handle, p.photo_url, p.institution, p.city, p.bio, p.linkedin, p.areas,
    coalesce((select sum(h.hours) from hours h where h.user_id = p.id and h.status = 'approved'), 0),
    coalesce((select jsonb_agg(jsonb_build_object('id', d.id, 'title', d.title, 'kind', d.kind, 'issued_on', d.issued_on) order by d.issued_on desc)
              from documents d where d.user_id = p.id and d.status = 'valid' and d.kind in ('certificate', 'recommendation', 'experience')), '[]'::jsonb)
  from profiles p where p.handle = p_handle and p.public_profile;
$$;

grant execute on function public.verify_document(text) to anon, authenticated;
grant execute on function public.public_profile(text) to anon, authenticated;

-- ---------------------------------------------------------------- messages (log of emails sent from the staff area)
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  application_id uuid references public.applications (id) on delete set null,
  subject text not null,
  body text not null,
  sent_by uuid references public.profiles (id) default auth.uid(),
  delivered boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.messages enable row level security;
create policy "read own or staff" on public.messages for select using (user_id = auth.uid() or has_role('manager'));
create policy "staff write" on public.messages for insert with check (has_role('manager'));

-- ---------------------------------------------------------------- storage for profile photos
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true) on conflict do nothing;
create policy "avatar upload own" on storage.objects for insert with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatar update own" on storage.objects for update using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatar read" on storage.objects for select using (bucket_id = 'avatars');
