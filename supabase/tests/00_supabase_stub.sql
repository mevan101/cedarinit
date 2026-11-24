-- Minimal stand-ins for Supabase's auth and storage schemas, so the migration and RLS tests run on plain Postgres.
-- Run: createdb cedar_test && psql -d cedar_test -f supabase/tests/00_supabase_stub.sql -f supabase/migrations/0001_volunteer_platform.sql -f supabase/tests/01_rls_test.sql
create role anon; create role authenticated;
create schema auth; create schema storage; create schema extensions;
grant usage on schema extensions to anon, authenticated;

create table auth.users (id uuid primary key, email text, raw_user_meta_data jsonb);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.uid', true), '')::uuid $$;
create table storage.buckets (id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
create table storage.objects (id serial primary key, bucket_id text, name text);
alter table storage.objects enable row level security;
create function storage.foldername(name text) returns text[] language sql as $$ select string_to_array(name, '/') $$;
grant usage on schema auth to anon, authenticated; grant execute on function auth.uid() to anon, authenticated;
