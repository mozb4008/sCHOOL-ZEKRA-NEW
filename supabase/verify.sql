-- Read-only security verification after running schema.sql.
-- Each table must report rls_enabled=true and client_can_read/write=false.
select c.relname as table_name, c.relrowsecurity as rls_enabled,
  has_table_privilege('anon', c.oid, 'SELECT') as anonymous_can_read,
  has_table_privilege('authenticated', c.oid, 'SELECT') as client_can_read,
  has_table_privilege('authenticated', c.oid, 'INSERT') as client_can_write
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relname in ('profiles', 'assessment_attempts', 'challenge_attempts');
