-- Read-only security verification after running schema.sql and rls-policies.sql.
-- Public tables must report: rls_enabled=true, anonymous_can_read=false, authenticated_can_read=true,
-- and authenticated_can_insert=false, authenticated_can_update=false, authenticated_can_delete=false.
-- Private answer vault tables (atqin_private) must report false for all anon/authenticated privileges.
select n.nspname as schema_name,
  c.relname as table_name,
  c.relrowsecurity as rls_enabled,
  has_table_privilege('anon', c.oid, 'SELECT') as anonymous_can_read,
  has_table_privilege('anon', c.oid, 'INSERT') as anonymous_can_write,
  has_table_privilege('authenticated', c.oid, 'SELECT') as authenticated_can_read,
  has_table_privilege('authenticated', c.oid, 'INSERT') as authenticated_can_insert,
  has_table_privilege('authenticated', c.oid, 'UPDATE') as authenticated_can_update,
  has_table_privilege('authenticated', c.oid, 'DELETE') as authenticated_can_delete
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where (n.nspname = 'public' and c.relname in ('profiles', 'assessment_attempts', 'challenge_attempts'))
   or (n.nspname = 'atqin_private' and c.relname in ('assessment_keys', 'challenge_keys'))
order by n.nspname, c.relname;
