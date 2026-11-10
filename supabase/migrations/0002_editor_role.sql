-- Adds the website editor role. Kept on its own because Postgres can't use a new enum value
-- in the same transaction that adds it.
alter type public.app_role add value if not exists 'editor';
