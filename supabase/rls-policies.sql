-- =============================================================================
-- ملف الحماية الشامل: PostgreSQL RPC + RLS + Private Answer Vault
-- منصة أتقن مهارتي (School Zekra)
-- آمن للتشغيل على قاعدة البيانات الحالية: يحافظ على جميع الجداول والسجلات القائمة
-- =============================================================================

begin;

-- 1. تفعيل RLS على جميع الجداول العامة
alter table public.profiles enable row level security;
alter table public.assessment_attempts enable row level security;
alter table public.challenge_attempts enable row level security;

-- 2. إزالة أي سياسات أو مشغلات (Triggers) قديمة لمنع أي تعارض أو صلاحيات زائدة
drop trigger if exists enforce_profile_security on public.profiles;
drop trigger if exists check_assessment_attempt on public.assessment_attempts;
drop function if exists public.prevent_profile_privilege_escalation();
drop function if exists public.validate_assessment_attempt();

-- حذف جميع سياسات RLS السابقة على الجداول الثلاثة ديناميكيًا بغض النظر عن أسمائها
do $$
declare
  pol record;
begin
  for pol in
    select policyname, tablename
      from pg_policies
     where schemaname = 'public'
       and tablename in ('profiles', 'assessment_attempts', 'challenge_attempts')
  loop
    execute format('drop policy if exists %I on public.%I', pol.policyname, pol.tablename);
  end loop;
end
$$;

drop policy if exists profiles_select_own_or_teacher on public.profiles;
drop policy if exists profiles_insert_student_self on public.profiles;
drop policy if exists profiles_update_own_password_flag on public.profiles;
drop policy if exists assessments_select_own_or_teacher on public.assessment_attempts;
drop policy if exists assessments_insert_student_own on public.assessment_attempts;
drop policy if exists challenges_select_own_or_teacher on public.challenge_attempts;
drop policy if exists challenges_insert_student_own on public.challenge_attempts;

-- 3. سحب جميع صلاحيات الكتابة المباشرة (INSERT, UPDATE, DELETE) من anon و authenticated
-- لا يُسمح لدور authenticated إلا بالقراءة (SELECT) المشروطة بسياسات RLS
revoke all on public.profiles, public.assessment_attempts, public.challenge_attempts from public, anon, authenticated;
grant select on public.profiles, public.assessment_attempts, public.challenge_attempts to authenticated;
grant all on public.profiles, public.assessment_attempts, public.challenge_attempts to service_role;

-- 4. إنشاء مخطط داخلي معزول (atqin_private) لحفظ مفاتيح الإجابات بعيدًا عن المستخدمين وعن تعريفات pg_proc
create schema if not exists atqin_private;
revoke all on schema atqin_private from public, anon, authenticated;
grant usage on schema atqin_private to service_role;

create table if not exists atqin_private.assessment_keys (
  test_type text not null check (test_type in ('pre', 'post')),
  question_index integer not null check (question_index between 0 and 9),
  question_id text not null,
  skill text not null,
  options_count integer not null check (options_count > 1),
  correct_answer integer not null check (correct_answer >= 0 and correct_answer < options_count),
  explanation text not null,
  textbook_ref text not null,
  primary key (test_type, question_index)
);

create table if not exists atqin_private.challenge_keys (
  challenge_id text primary key,
  options_count integer not null check (options_count > 1),
  correct_choice integer not null check (correct_choice >= 0 and correct_choice < options_count)
);

alter table atqin_private.assessment_keys enable row level security;
alter table atqin_private.challenge_keys enable row level security;
revoke all on all tables in schema atqin_private from public, anon, authenticated;
grant all on all tables in schema atqin_private to service_role;

-- تعبئة مفاتيح التصحيح داخل كتلة تنفيذ فورية (DO block) بحيث لا تُخزن الإجابات في تعريفات دوال pg_proc
do $$
begin
  insert into atqin_private.assessment_keys (
    test_type, question_index, question_id, skill, options_count, correct_answer, explanation, textbook_ref
  ) values
    ('pre', 0, 'pre-1', 'مفهوم التوزيع وعلاقته بالعدد الذري (الذرة المتعادلة)', 4, 0, 'ينص كتاب كيمياء 1 ص 32 وص 84 على أنه في الذرة المتعادلة كهربائياً، يتساوى عدد الإلكترونات السالبة المحيطة بالنواة تماماً مع عدد البروتونات الموجبة داخل النواة، وهو العدد الذري (Z).', 'كتاب كيمياء 1، الفصل 1 ص 32، والفصل 3 ص 84'),
    ('pre', 1, 'pre-2', 'سعة المستويات الثانوية والفرعية', 4, 0, 'المستوى الثانوي d يتكون من 5 مستويات فرعية (مدارات)، وبما أن كل مستوى فرعي يتسع لإلكترونين كحد أقصى وفق مبدأ باولي، فإن سعته القصوى هي 5 × 2 = 10 إلكترونات (كتاب كيمياء 1 ص 33، ص 42 سؤال 66).', 'كتاب كيمياء 1، ص 33، ص 42 سؤال 66'),
    ('pre', 2, 'pre-3', 'مبدأ أوفباو (البناء التصاعدي)', 4, 0, 'يوضح الجدول 1-5 في كتاب كيمياء 1 ص 33 أن طاقة المستوى الفرعي 4s أقل من طاقة المستويات الفرعية في 3d، ولذلك يمتلئ المستوى 4s بإلكترونين قبل البدء بملء مستويات 3d.', 'كتاب كيمياء 1، ص 33 الجدول 1-5، وص 43 سؤال 75'),
    ('pre', 3, 'pre-4', 'مبدأ باولي للاستبعاد', 4, 0, 'ينص مبدأ باولي للاستبعاد في كتاب كيمياء 1 ص 33 على أن عدد إلكترونات المستوى الفرعي الواحد لا يزيد عن إلكترونين، ويدور كل منهما حول نفسه باتجاه معاكس للآخر (غزل متعاكس ↑↓).', 'كتاب كيمياء 1، ص 33'),
    ('pre', 4, 'pre-5', 'قاعدة هوند وتنافر الإلكترونات', 4, 0, 'تنص قاعدة هوند في كتاب كيمياء 1 ص 33 على أن الإلكترونات تتوزع في المستويات الفرعية المتساوية الطاقة بحيث تحافظ على أن يكون لها الاتجاه نفسه من حيث الدوران، قبل أن تشغل الإلكترونات الإضافية ذات اتجاه الدوران المعاكس المستويات نفسها.', 'كتاب كيمياء 1، ص 33'),
    ('pre', 5, 'pre-6', 'التوزيع الإلكتروني للمستوى الثاني (الجدول 1-6)', 4, 0, '8 إلكترونات توزع وفق الجدول 1-6 في كتاب كيمياء 1 ص 34: المستوى 1s يأخذ 2، ثم 2s يأخذ 2، وتوضع الـ 4 المتبقية في 2p ليصبح 1s² 2s² 2p⁴.', 'كتاب كيمياء 1، الجدول 1-6 ص 34'),
    ('pre', 6, 'pre-7', 'استثناء الكروم Cr لنصف الامتلاء', 4, 0, 'ينص كتاب كيمياء 1 ص 36 على أن التوزيع الإلكتروني الصحيح للكروم هو [Ar] 4s¹ 3d⁵؛ حيث ينتقل إلكترون من 4s إلى 3d ليكون كلا المستويين نصف ممتلئين، مما يحقق تماثلاً فراغياً واستقراراً فائقاً للذرة.', 'كتاب كيمياء 1، ص 36'),
    ('pre', 7, 'pre-8', 'استثناء النحاس Cu للامتلاء التام', 4, 0, 'يوضح كتاب كيمياء 1 ص 36 أن الامتلاء التام للمستوى الفرعي 3d بعشرة إلكترونات (3d¹⁰) يمنح ذرة النحاس استقراراً هائلاً يفوق بقاء 4s ممتلئاً، فيكون التوزيع [Ar] 4s¹ 3d¹⁰.', 'كتاب كيمياء 1، ص 36'),
    ('pre', 8, 'pre-9', 'التوزيع الإلكتروني للأيون الموجب Na⁺ (الكاتيون)', 4, 0, 'يوضح الشكل 3-1 في كتاب كيمياء 1 ص 85 أن ذرة الصوديوم تفقد إلكترون التكافؤ الوحيد في المستوى 3s¹ لتتحول إلى كاتيون Na⁺ بشحنة +1، فيصبح عدد الإلكترونات 10 وتوزيعها 1s² 2s² 2p⁶ مماثلاً للتوزيع المستقر لغاز النيون [Ne].', 'كتاب كيمياء 1، ص 84-85 الشكل 3-1'),
    ('pre', 9, 'pre-10', 'التوزيع الإلكتروني لأيون الألومنيوم Al³⁺', 4, 0, 'ينص كتاب كيمياء 1 ص 85 والجدول 3-1 على أن شحنة Al³⁺ تعني فقد 3 إلكترونات كاملة (إلكترون 3p¹ وإلكتروني 3s²)، فيصبح لديه 10 إلكترونات بتوزيع ثماني مستقر 1s² 2s² 2p⁶ يماثل غاز النيون [Ne].', 'كتاب كيمياء 1، ص 85 الجدول 3-1، وص 115'),
    ('post', 0, 'post-1', 'مفهوم التوزيع وعلاقته بالعدد الذري (الذرة المتعادلة)', 4, 0, 'في الذرة المتعادلة كهربائياً، يتساوى عدد الإلكترونات تماماً مع العدد الذري (Z)، أي 15 إلكتروناً كما ورد في كتاب كيمياء 1 ص 35 وص 43 سؤال 84.', 'كتاب كيمياء 1، ص 35، ص 43'),
    ('post', 1, 'post-2', 'سعة المستويات الثانوية والفرعية', 4, 0, 'المستوى الثانوي s يتكون من مستوى فرعي واحد يتسع لـ 2 إلكترون، والمستوى الثانوي p يتكون من 3 مستويات فرعية يتسع كل منها لـ 2 إلكترون بمجموع 6 إلكترونات كحد أقصى (كتاب كيمياء 1 ص 33).', 'كتاب كيمياء 1، ص 33، ص 46 سؤال 4'),
    ('post', 2, 'post-3', 'مبدأ أوفباو (البناء التصاعدي)', 4, 0, 'يوضح تسلسل أوفباو والجدول 1-5 في كتاب كيمياء 1 ص 33 أنه بعد المستوى 3p⁶ يأتي المستوى 4s مباشرة لأنه ذو طاقة أقل من 3d، لذلك يمتلئ 4s أولاً قبل 3d.', 'كتاب كيمياء 1، ص 33 الجدول 1-5'),
    ('post', 3, 'post-4', 'مبدأ باولي للاستبعاد', 4, 0, 'ينص مبدأ باولي للاستبعاد في كتاب كيمياء 1 ص 33 على أن المستوى الفرعي لا يتسع لأكثر من إلكترونين ويدور كل منهما باتجاه معاكس للآخر، ويمنع تماماً أن يدورا في نفس الاتجاه (↑↑).', 'كتاب كيمياء 1، ص 33، والجدول 1-6 ص 34'),
    ('post', 4, 'post-5', 'قاعدة هوند وتنافر الإلكترونات', 4, 0, 'وفق قاعدة هوند والشرح الوارد في كتاب كيمياء 1 ص 33-34: يدخل كل إلكترون مستوى فرعياً مستقلاً بنفس اتجاه الغزل أولاً لتقليل قوى التنافر الكهربائي إلى أدنى حد ممكن.', 'كتاب كيمياء 1، ص 33-34'),
    ('post', 5, 'post-6', 'إلكترونات التكافؤ والتمثيل النقطي (تمثيل لويس)', 4, 0, 'ينص كتاب كيمياء 1 ص 37 (الجدول 1-8) على أن التمثيل النقطي للإلكترونات يمثل إلكترونات المستوى الخارجي (إلكترونات التكافؤ) فقط. ذرة الفلور توزيعها 1s² 2s² 2p⁵ ومستواها الخارجي n=2 يحتوي 7 إلكترونات تكافؤ، فتُرسم حولها 7 نقاط.', 'كتاب كيمياء 1، ص 37 الجدول 1-8'),
    ('post', 6, 'post-7', 'استثناء الكروم Cr لنصف الامتلاء', 4, 0, 'يوضح كتاب كيمياء 1 ص 36 أن المستويات نصف الممتلئة (d⁵ و s¹) تحقق تماثلاً فراغياً أعلى وطاقة وضع دنيا تمنح ذرة الكروم حالة استقرار قصوى تجعل التوزيع [Ar] 4s¹ 3d⁵ هو التوزيع الحقيقي تجريبياً.', 'كتاب كيمياء 1، ص 36'),
    ('post', 7, 'post-8', 'استثناء النحاس Cu للامتلاء التام', 4, 0, 'ينص كتاب كيمياء 1 ص 36 على أن الامتلاء التام للمستوى الفرعي 3d بعشرة إلكترونات (3d¹⁰) يمنح ذرة النحاس استقراراً هائلاً يفوق بقاء 4s ممتلئاً، لذلك ينتقل إلكترون من 4s إلى 3d ليصبح [Ar] 4s¹ 3d¹⁰.', 'كتاب كيمياء 1، ص 36'),
    ('post', 8, 'post-9', 'التوزيع الإلكتروني للأيون السالب Cl⁻ (الأنيون)', 4, 0, 'يوضح الشكل 3-3 في كتاب كيمياء 1 ص 86 أن أيون الكلوريد Cl⁻ يحمل شحنة سالبة (-1) لاكتسابه إلكتروناً واحداً في المستوى 3p، فيصبح مجموع إلكتروناته 18 إلكتروناً بتوزيع مستقر 1s² 2s² 2p⁶ 3s² 3p⁶ مطابقاً لغاز الأرجون [Ar].', 'كتاب كيمياء 1، ص 86 الشكل 3-3'),
    ('post', 9, 'post-10', 'التوزيع الإلكتروني لأيون الألومنيوم Al³⁺', 4, 0, 'أيون Al³⁺ لديه 10 إلكترونات، لأن ذرة الألومنيوم (13 إلكتروناً) تفقد إلكترون 3p¹ وإلكتروني 3s² من المستوى الثالث كاملاً وفق كتاب كيمياء 1 ص 85 والجدول 3-1 والاختبار المقنن ص 115، فيصبح التوزيع 1s² 2s² 2p⁶ مماثلاً للنيون [Ne].', 'كتاب كيمياء 1، ص 85، ص 115 سؤال 2')
  on conflict (test_type, question_index) do update set
    question_id = excluded.question_id,
    skill = excluded.skill,
    options_count = excluded.options_count,
    correct_answer = excluded.correct_answer,
    explanation = excluded.explanation,
    textbook_ref = excluded.textbook_ref;

  insert into atqin_private.challenge_keys (challenge_id, options_count, correct_choice) values
    ('err-ion-1', 4, 0),
    ('err-ion-2', 4, 0),
    ('err-ion-3', 4, 0),
    ('err-ion-4', 4, 0),
    ('err-ion-5', 4, 0),
    ('err-ion-6', 4, 0),
    ('err-ion-7', 4, 0),
    ('err-ion-8', 4, 0),
    ('err-neutral-1', 4, 0),
    ('err-neutral-2', 4, 0),
    ('err-neutral-3', 4, 0),
    ('err-neutral-4', 4, 0),
    ('err-neutral-5', 4, 0),
    ('err-neutral-6', 4, 0),
    ('err-neutral-7', 4, 0)
  on conflict (challenge_id) do update set
    options_count = excluded.options_count,
    correct_choice = excluded.correct_choice;
end
$$;

-- 5. دالة التحقق من دور المعلمة للمستخدم الحالي (تُستخدم داخل سياسات SELECT فقط)
create or replace function public.is_teacher()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'teacher'
  );
$$;

revoke all on function public.is_teacher() from public, anon;
grant execute on function public.is_teacher() to authenticated, service_role;

-- 6. سياسات القراءة فقط (SELECT RLS Policies)
create policy profiles_select_own_or_teacher
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid() or public.is_teacher());

create policy assessments_select_own_or_teacher
  on public.assessment_attempts
  for select
  to authenticated
  using (student_id = auth.uid() or public.is_teacher());

create policy challenges_select_own_or_teacher
  on public.challenge_attempts
  for select
  to authenticated
  using (student_id = auth.uid() or public.is_teacher());

-- 7. دالة RPC محمية لإنشاء ملف طالبة تلقائيًا بعد تأكيد بريدها الإلكتروني (تمنع تعيين دور teacher مطلقًا)
create or replace function public.ensure_student_profile(p_name text default null)
returns public.profiles
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_email text;
  v_confirmed_at timestamptz;
  v_meta_name text;
  v_clean_name text;
  v_profile public.profiles;
begin
  if v_user_id is null then
    raise exception 'سجّلي الدخول أولًا.' using errcode = '42501';
  end if;

  select * into v_profile from public.profiles where id = v_user_id;
  if found then
    return v_profile;
  end if;

  select u.email, u.email_confirmed_at, u.raw_user_meta_data ->> 'name'
    into v_email, v_confirmed_at, v_meta_name
  from auth.users u
  where u.id = v_user_id;

  if v_email is null or v_confirmed_at is null or lower(v_email) like '%@students.atqin.invalid' then
    raise exception 'الحساب غير مفعّل. تواصلي مع المعلمة.' using errcode = '42501';
  end if;

  v_clean_name := left(btrim(coalesce(nullif(btrim(p_name), ''), nullif(btrim(v_meta_name), ''), split_part(v_email, '@', 1))), 120);
  if char_length(v_clean_name) < 2 then
    v_clean_name := 'طالبة جديدة';
  end if;

  insert into public.profiles (id, name, code, role, must_change_password)
  values (
    v_user_id,
    v_clean_name,
    's-' || replace(v_user_id::text, '-', ''),
    'student',
    false
  )
  on conflict (id) do nothing;

  select * into v_profile from public.profiles where id = v_user_id;
  return v_profile;
end;
$$;

revoke all on function public.ensure_student_profile(text) from public, anon;
grant execute on function public.ensure_student_profile(text) to authenticated, service_role;

-- 8. دالة RPC محمية لإلغاء علامة كلمة المرور المؤقتة بعد تغييرها (لا تقبل أي معاملات ولا تسمح بتغيير الدور)
create or replace function public.complete_password_change()
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'سجّلي الدخول أولًا.' using errcode = '42501';
  end if;

  update public.profiles
     set must_change_password = false
   where id = v_user_id;
end;
$$;

revoke all on function public.complete_password_change() from public, anon;
grant execute on function public.complete_password_change() to authenticated, service_role;

-- 9. دالة RPC محمية لتصحيح وحفظ الاختبار القبلي/البعدي داخل قاعدة البيانات (لا تقبل درجة جاهزة من المستخدم)
create or replace function public.submit_assessment_attempt(
  p_request_id uuid,
  p_type text,
  p_answers jsonb,
  p_seconds integer
)
returns jsonb
language plpgsql
security definer
set search_path = public, atqin_private, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_profile public.profiles;
  v_existing jsonb;
  v_key record;
  v_choice integer;
  v_is_correct boolean;
  v_correct_count integer := 0;
  v_total_questions integer := 0;
  v_details jsonb := '[]'::jsonb;
  v_result jsonb;
begin
  if v_user_id is null then
    raise exception 'سجّلي الدخول أولًا.' using errcode = '42501';
  end if;

  select * into v_profile from public.profiles where id = v_user_id;
  if not found or v_profile.role <> 'student' then
    raise exception 'التسجيل مخصص لحسابات الطالبات.' using errcode = '42501';
  end if;

  if v_profile.must_change_password then
    raise exception 'غيّري كلمة المرور المؤقتة أولًا.' using errcode = '42501';
  end if;

  if p_request_id is null then
    raise exception 'معرّف المحاولة غير صحيح.' using errcode = '22023';
  end if;

  if p_type is null or p_type not in ('pre', 'post') then
    raise exception 'نوع الاختبار غير صحيح.' using errcode = '22023';
  end if;

  if p_seconds is null or p_seconds < 0 or p_seconds > 86400 then
    raise exception 'زمن الاختبار غير صحيح.' using errcode = '22023';
  end if;

  if p_answers is null or jsonb_typeof(p_answers) <> 'object' then
    raise exception 'أجيبي عن جميع الأسئلة قبل التسليم.' using errcode = '22023';
  end if;

  -- في حال إعادة إرسال نفس الطلب، تُعاد النتيجة المحفوظة دون تكرار الإدراج
  select a.result into v_existing
    from public.assessment_attempts a
   where a.id = p_request_id
     and a.student_id = v_user_id;
  if found then
    return v_existing;
  end if;

  if p_type = 'post' and not exists (
    select 1 from public.assessment_attempts a
     where a.student_id = v_user_id and a.type = 'pre'
  ) then
    raise exception 'أكملي الاختبار القبلي أولًا.' using errcode = '22023';
  end if;

  if p_type = 'pre' and exists (
    select 1 from public.assessment_attempts a
     where a.student_id = v_user_id and a.type = 'pre'
  ) then
    raise exception 'الاختبار القبلي محفوظ مسبقًا حفاظًا على دقة قياس الأثر.' using errcode = '23505';
  end if;

  if (select count(*) from jsonb_object_keys(p_answers)) <> 10 then
    raise exception 'أجيبي عن جميع الأسئلة قبل التسليم.' using errcode = '22023';
  end if;

  for v_key in
    select *
      from atqin_private.assessment_keys
     where test_type = p_type
     order by question_index asc
  loop
    v_total_questions := v_total_questions + 1;

    if not (p_answers ? (v_key.question_index::text))
       or jsonb_typeof(p_answers -> (v_key.question_index::text)) <> 'number' then
      raise exception 'أجيبي عن جميع الأسئلة قبل التسليم.' using errcode = '22023';
    end if;

    begin
      v_choice := (p_answers ->> (v_key.question_index::text))::integer;
    exception when others then
      raise exception 'أجيبي عن جميع الأسئلة قبل التسليم.' using errcode = '22023';
    end;

    if (p_answers ->> (v_key.question_index::text)) <> (v_choice::text)
       or v_choice < 0
       or v_choice >= v_key.options_count then
      raise exception 'أجيبي عن جميع الأسئلة قبل التسليم.' using errcode = '22023';
    end if;

    v_is_correct := (v_choice = v_key.correct_answer);
    if v_is_correct then
      v_correct_count := v_correct_count + 1;
    end if;

    v_details := v_details || jsonb_build_array(
      jsonb_build_object(
        'questionId', v_key.question_id,
        'skill', v_key.skill,
        'isCorrect', v_is_correct,
        'userChoice', v_choice,
        'correctAnswer', v_key.correct_answer,
        'explanation', v_key.explanation,
        'textbookRef', v_key.textbook_ref
      )
    );
  end loop;

  if v_total_questions <> 10 then
    raise exception 'مفتاح تصحيح الاختبار غير مكتمل.' using errcode = 'P0001';
  end if;

  v_result := jsonb_build_object(
    'score', (v_correct_count * 100) / v_total_questions,
    'correctCount', v_correct_count,
    'totalQuestions', v_total_questions,
    'mistakesCount', v_total_questions - v_correct_count,
    'timeSpentSeconds', p_seconds,
    'timeSpentFormatted', ((p_seconds / 60)::text || ' دقيقة و ' || (p_seconds % 60)::text || ' ثانية'),
    'details', v_details
  );

  insert into public.assessment_attempts (id, student_id, type, result)
  values (p_request_id, v_user_id, p_type, v_result);

  return v_result;
end;
$$;

revoke all on function public.submit_assessment_attempt(uuid, text, jsonb, integer) from public, anon;
grant execute on function public.submit_assessment_attempt(uuid, text, jsonb, integer) to authenticated, service_role;

-- 10. دالة RPC محمية لتصحيح وحفظ تحدي «خطأ نودّعه» داخل قاعدة البيانات (لا تقبل نتيجة صح/خطأ من المستخدم)
create or replace function public.submit_challenge_attempt(
  p_request_id uuid,
  p_challenge_id text,
  p_choice integer
)
returns boolean
language plpgsql
security definer
set search_path = public, atqin_private, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_profile public.profiles;
  v_key atqin_private.challenge_keys;
  v_correct boolean;
begin
  if v_user_id is null then
    raise exception 'سجّلي الدخول أولًا.' using errcode = '42501';
  end if;

  select * into v_profile from public.profiles where id = v_user_id;
  if not found or v_profile.role <> 'student' then
    raise exception 'التسجيل مخصص لحسابات الطالبات.' using errcode = '42501';
  end if;

  if v_profile.must_change_password then
    raise exception 'غيّري كلمة المرور المؤقتة أولًا.' using errcode = '42501';
  end if;

  if p_request_id is null then
    raise exception 'معرّف المحاولة غير صحيح.' using errcode = '22023';
  end if;

  select * into v_key
    from atqin_private.challenge_keys
   where challenge_id = p_challenge_id;

  if not found or p_choice is null or p_choice < 0 or p_choice >= v_key.options_count then
    raise exception 'إجابة التحدي غير صحيحة.' using errcode = '22023';
  end if;

  v_correct := (p_choice = v_key.correct_choice);

  insert into public.challenge_attempts (id, student_id, challenge_id, correct)
  values (p_request_id, v_user_id, p_challenge_id, v_correct)
  on conflict (id) do nothing;

  return v_correct;
end;
$$;

revoke all on function public.submit_challenge_attempt(uuid, text, integer) from public, anon;
grant execute on function public.submit_challenge_attempt(uuid, text, integer) to authenticated, service_role;

commit;
