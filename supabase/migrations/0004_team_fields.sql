-- Team cards also show a badge (e.g. "Co-founder"), a Facebook link and, for some people, a public email.
alter table public.site_team add column if not exists badge text check (char_length(badge) <= 60);
alter table public.site_team add column if not exists facebook text;
alter table public.site_team add column if not exists email text;
-- Keep the photo as uploaded instead of the green cut-out portrait.
alter table public.site_team add column if not exists keep_background boolean not null default false;
-- Teams (name, description, order) are a setting: site_settings.key = 'teams'.
