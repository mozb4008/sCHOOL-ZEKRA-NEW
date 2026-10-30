-- Run once in the Supabase SQL Editor. No existing tables are removed.
begin;
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 120),
  code text not null unique check (code ~ '^[a-zA-Z][a-zA-Z0-9_-]{2,39}$'),
  role text not null default 'student' check (role in ('student', 'teacher')),
  must_change_password boolean not null default true,
  created_at timestamptz not null default now()
);
create table if not exists public.assessment_attempts (
  id uuid primary key,
  student_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('pre', 'post')),
  result jsonb not null,
  created_at timestamptz not null default now()
);
create unique index if not exists one_baseline_per_student on public.assessment_attempts(student_id) where type = 'pre';
create index if not exists assessments_student_date on public.assessment_attempts(student_id, created_at);
create table if not exists public.challenge_attempts (
  id uuid primary key,
  student_id uuid not null references public.profiles(id) on delete cascade,
  challenge_id text not null,
  correct boolean not null,
  created_at timestamptz not null default now()
);
create index if not exists challenges_student on public.challenge_attempts(student_id);
-- All access goes through the authenticated server function. No direct public API access.
alter table public.profiles enable row level security;
alter table public.assessment_attempts enable row level security;
alter table public.challenge_attempts enable row level security;
revoke all on public.profiles, public.assessment_attempts, public.challenge_attempts from anon, authenticated;
grant all on public.profiles, public.assessment_attempts, public.challenge_attempts to service_role;
commit;
