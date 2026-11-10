-- Tests for 0003: editor role, website tables, internal notes, audit log.
-- Run after 01_rls_test.sql (reuses its users): psql -d cedar_test -f supabase/migrations/0002_editor_role.sql
--   -f supabase/migrations/0003_site_editor_internal.sql -f supabase/tests/02_site_editor_test.sql
\set ON_ERROR_STOP 0
reset role;
grant all on all tables in schema public to anon, authenticated;
insert into auth.users values ('44444444-4444-4444-4444-444444444444','editor@x.org','{"full_name":"Ed Itor"}'),
                              ('55555555-5555-5555-5555-555555555555','admin@x.org','{"full_name":"Ad Min"}');
update profiles set role='editor' where email='editor@x.org';
update profiles set role='admin' where email='admin@x.org';

\echo '--- anonymous visitor'
set role anon; select set_config('request.jwt.uid','',false);
\echo 'expect ERROR: has_role is no longer in the public API schema'
select public.has_role('admin');
\echo 'expect ERROR: anon cannot call trigger functions'
select public.handle_new_user();
\echo 'expect ERROR: anon cannot write settings'
insert into site_settings (key, value) values ('contact', '{"phone":"x"}');
\echo 'expect 0: no internal notes for the public'
select count(*) from internal_notes;
reset role;

\echo '--- editor'
set role authenticated; select set_config('request.jwt.uid','44444444-4444-4444-4444-444444444444',false);
insert into site_settings (key, value) values ('contact', '{"phone":"+8801612383345"}');
insert into site_posts (slug, title, body, status, published_at) values ('hello-world', 'Hello', 'Body text', 'published', now());
insert into site_posts (slug, title, body) values ('draft-post', 'Draft', 'Not yet');
insert into site_team (name, title, team) values ('New Person', 'Volunteer', 'Communications');
insert into site_sponsors (name, logo_url) values ('Test Sponsor', 'https://example.org/logo.png');
\echo 'expect ERROR: bad slug'
insert into site_posts (slug, title) values ('Bad Slug!', 'x');
\echo 'expect 1: editor sees only own profile, no volunteer data'
select count(*) from profiles;
\echo 'expect 0: editor cannot read applications'
select count(*) from applications;
\echo 'expect 0: editor cannot read hours'
select count(*) from hours;
\echo 'expect 0: editor cannot read the audit log'
select count(*) from audit_log;
\echo 'expect 0 rows changed: editor cannot write internal notes'
insert into internal_notes (title, body) values ('x', 'y');
\echo 'expect ERROR: editor cannot issue certificates'
insert into documents (user_id, recipient_name, kind, title, signer_name, signer_title) values (auth.uid(),'Ed','certificate','Fake','me','me');
\echo 'expect ERROR: editor cannot promote self'
update profiles set role='admin' where id=auth.uid();
\echo 'expect email unchanged: cannot change own email'
update profiles set email='spoof@x.org' where id=auth.uid();
select email from profiles where id=auth.uid();
reset role;

\echo '--- anonymous visitor reads public content'
set role anon; select set_config('request.jwt.uid','',false);
\echo 'expect 1: only the published post'
select count(*) from site_posts;
\echo 'expect 1 setting, 1 team member, 1 sponsor'
select (select count(*) from site_settings) s, (select count(*) from site_team) t, (select count(*) from site_sponsors) sp;
\echo 'expect ERROR or 0 rows: anon cannot edit posts'
update site_posts set title='hacked';
select title from site_posts;
reset role;

\echo '--- contact form'
set role anon; select set_config('request.jwt.uid','',false);
insert into form_submissions (form, name, email, subject, data) values ('contact','A','a@x.org','Hi','{"message":"hello there"}');
insert into form_submissions (form, email) values ('contact','a@x.org'),('contact','a@x.org'),('contact','a@x.org'),('contact','a@x.org');
\echo 'expect ERROR: sixth message in ten minutes'
insert into form_submissions (form, email) values ('contact','A@x.org');
\echo 'expect ERROR: cannot set status or notes'
insert into form_submissions (form, status) values ('contact','archived');
\echo 'expect 0: the public cannot read submissions'
select count(*) from form_submissions;
reset role;
set role authenticated; select set_config('request.jwt.uid','44444444-4444-4444-4444-444444444444',false);
\echo 'expect 0: editors cannot read submissions'
select count(*) from form_submissions;
reset role;
set role authenticated; select set_config('request.jwt.uid','33333333-3333-3333-3333-333333333333',false);
\echo 'expect 5: staff read submissions'
select count(*) from form_submissions;
reset role;

\echo '--- volunteer'
set role authenticated; select set_config('request.jwt.uid','11111111-1111-1111-1111-111111111111',false);
\echo 'expect 0: volunteers do not see internal notes'
select count(*) from internal_notes;
\echo 'expect ERROR: volunteer cannot add a team member'
insert into site_team (name) values ('Me');
reset role;

\echo '--- issuer (manager rights) writes internal notes'
set role authenticated; select set_config('request.jwt.uid','33333333-3333-3333-3333-333333333333',false);
insert into internal_notes (title, body, category) values ('Bank details for reimbursements', 'Ask the treasurer.', 'Finance');
\echo 'expect 1'
select count(*) from internal_notes;
\echo 'expect 0 rows changed: issuer cannot edit the website'
update site_posts set title='x';
reset role;

\echo '--- editor reads internal notes (team member)'
set role authenticated; select set_config('request.jwt.uid','44444444-4444-4444-4444-444444444444',false);
\echo 'expect 1'
select count(*) from internal_notes;
reset role;

\echo '--- admin reads the audit log'
set role authenticated; select set_config('request.jwt.uid','55555555-5555-5555-5555-555555555555',false);
\echo 'expect rows for site_settings, site_posts, site_team, site_sponsors, internal_notes, documents'
select table_name, action, actor_email from audit_log order by id;
\echo 'expect ERROR or 0 rows: nobody can delete history'
delete from audit_log;
select count(*) > 0 as history_kept from audit_log;
reset role;
