\set ON_ERROR_STOP 0
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant execute on all functions in schema public to anon, authenticated;
insert into auth.users values ('11111111-1111-1111-1111-111111111111','vol@x.org','{"full_name":"Vol One"}'),
                              ('22222222-2222-2222-2222-222222222222','vol2@x.org','{"full_name":"Vol Two"}'),
                              ('33333333-3333-3333-3333-333333333333','staff@x.org','{"full_name":"Staff"}');
update profiles set role='issuer' where email='staff@x.org';
\echo '--- volunteer 1'
set role authenticated; select set_config('request.jwt.uid','11111111-1111-1111-1111-111111111111',false);
\echo 'expect ERROR: promote self'
update profiles set role='admin' where id=auth.uid();
\echo 'expect 1 row: sees only own profile'
select count(*) from profiles;
insert into applications (user_id, opportunity, opportunity_title, answers) values (auth.uid(),'relief-volunteer','Relief volunteer','{"why":"help"}');
\echo 'expect ERROR: apply as someone else'
insert into applications (user_id, opportunity, opportunity_title) values ('22222222-2222-2222-2222-222222222222','x','x');
\echo 'expect ERROR: self-approved hours'
insert into hours (user_id, program, area, date, hours, status) values (auth.uid(),'Ushnota','Distribution','2025-11-20',4,'approved');
insert into hours (user_id, program, area, date, hours) values (auth.uid(),'Ushnota','Distribution','2025-11-20',4);
\echo 'expect ERROR: volunteer issues certificate'
insert into documents (user_id, recipient_name, kind, title, signer_name, signer_title) values (auth.uid(),'Vol One','certificate','Fake','me','me');
reset role;
\echo '--- staff (issuer)'
set role authenticated; select set_config('request.jwt.uid','33333333-3333-3333-3333-333333333333',false);
\echo 'expect 3: staff sees all profiles'
select count(*) from profiles;
update hours set status='approved', approved_by=auth.uid();
update applications set status='accepted';
insert into documents (id, user_id, recipient_name, kind, title, program, hours, areas, signer_name, signer_title) values ('CI-2026-TESTCERT','11111111-1111-1111-1111-111111111111','Vol One','certificate','Certificate of Volunteering','Ushnota Abhijan 2025',4,'{Distribution}','Sharafat Karim','Co-founder');
insert into documents (user_id, recipient_name, kind, title, signer_name, signer_title) values ('11111111-1111-1111-1111-111111111111','Vol One','termination','Letter of removal','S','C') returning id;
reset role;
\echo '--- anonymous visitor'
set role anon; select set_config('request.jwt.uid','',false);
\echo 'expect valid certificate'
select id, recipient_name, status, hours from verify_document('ci-2026-testcert');
\echo 'expect 0 rows: termination letters are not public'
select count(*) from verify_document((select id from documents where kind='termination' limit 1));
\echo 'expect 0 rows: anon cannot read documents table'
select count(*) from documents;
reset role;
update documents set status='revoked' where id='CI-2026-TESTCERT';
set role anon;
\echo 'expect revoked'
select status from verify_document('CI-2026-TESTCERT');
