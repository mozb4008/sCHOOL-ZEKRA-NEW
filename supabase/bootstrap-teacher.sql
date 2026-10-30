-- First create the teacher in Supabase Authentication > Users > Add user.
-- Replace the email below with that teacher's real email. Do not put a password here.
do $$
declare
  teacher_email text := 'futureoflife025@gmail.com';
  teacher_id uuid;
begin
  select id into teacher_id from auth.users where lower(email) = lower(teacher_email);
  if teacher_id is null then
    raise exception 'Create the teacher in Authentication > Users, then replace teacher_email in this script.';
  end if;
  insert into public.profiles(id, name, code, role, must_change_password)
  values (teacher_id, 'أ. ذكرى آل صديق', 'teacher-001', 'teacher', false)
  on conflict(id) do update set role = 'teacher', name = excluded.name;
end $$;
