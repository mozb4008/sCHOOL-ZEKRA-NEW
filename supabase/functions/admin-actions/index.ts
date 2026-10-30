// Supabase Edge Function: admin-actions
// تنفيذ العمليات الإدارية لمنصة «أتقن مهارتي» بأمان داخل بيئة Supabase دون كشف المفتاح السري خارجها.

declare const Deno: {
  env: { get(name: string): string | undefined };
  serve?: (handler: (req: Request) => Response | Promise<Response>) => void;
};

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

interface AuthUser {
  id: string;
  email?: string;
  email_confirmed_at?: string | null;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
}

interface ProfileRow {
  id: string;
  name: string;
  code: string;
  role: 'student' | 'teacher';
  must_change_password: boolean;
}

const uuid = (value: unknown): value is string =>
  typeof value === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

const codePattern = /^[a-z][a-z0-9_-]{2,39}$/;
const loginEmail = (code: string) => `${code}@students.atqin.invalid`;
const defaultOwnerEmail = 'futureoflife025@gmail.com';

const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff'
};

const jsonReply = (status: number, payload: Record<string, unknown>) =>
  new Response(JSON.stringify(payload), { status, headers: jsonHeaders });

const cleanEnv = (value?: string) =>
  typeof value === 'string' ? value.trim().replace(/^['"]+|['"]+$/g, '').trim() : '';

export async function handleAdminRequest(req: Request, envGetter: (name: string) => string | undefined = name => Deno?.env?.get(name)): Promise<Response> {
  try {
    if (req.method !== 'POST') {
      return jsonReply(405, { error: 'استخدمي طلب POST.' });
    }

    const contentType = req.headers.get('content-type') || '';
    if (!contentType.startsWith('application/json')) {
      throw new ApiError(415, 'صيغة الطلب غير مدعومة.');
    }

    const authHeader = req.headers.get('authorization') || '';
    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    const userToken = match?.[1]?.trim() || '';
    if (!userToken || /^sb_(publishable|secret)_/.test(userToken)) {
      throw new ApiError(401, 'سجّلي الدخول أولًا.');
    }

    const rawBody = await req.text();
    if (rawBody.length > 20000) {
      throw new ApiError(413, 'حجم الطلب أكبر من المسموح.');
    }

    let body: Record<string, unknown>;
    try {
      body = JSON.parse(rawBody || '{}');
    } catch {
      throw new ApiError(400, 'الطلب غير صالح.');
    }
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      throw new ApiError(400, 'الطلب غير صالح.');
    }

    const url = cleanEnv(envGetter('SUPABASE_URL')).replace(/\/+$/, '');
    const anon = cleanEnv(envGetter('SUPABASE_ANON_KEY')) || cleanEnv(envGetter('SUPABASE_PUBLISHABLE_KEY'));
    const service = cleanEnv(envGetter('SUPABASE_SERVICE_ROLE_KEY')) || cleanEnv(envGetter('SUPABASE_SECRET_KEY'));
    const ownerEmail = (cleanEnv(envGetter('PRIMARY_TEACHER_EMAIL')) || defaultOwnerEmail).toLowerCase();

    if (!url || !service) {
      throw new ApiError(503, 'إعدادات الخادم الإداري في Supabase غير مكتملة.');
    }
    if (/^sb_publishable_/.test(service) || (anon && service === anon)) {
      throw new ApiError(503, 'إعداد الربط غير صحيح: المفتاح السري في Edge Function غير صالح.');
    }
    if (userToken === service || (anon && userToken === anon)) {
      throw new ApiError(401, 'سجّلي الدخول أولًا.');
    }

    const ownsPlatform = (user: AuthUser) =>
      Boolean(user.email_confirmed_at && user.email?.toLowerCase() === ownerEmail);

    const supabaseRequest = async <T = unknown>(
      path: string,
      options: { method?: string; data?: unknown; token?: string; admin?: boolean } = {}
    ): Promise<T> => {
      const { method = 'GET', data, token = userToken, admin = false } = options;
      const effectiveToken = admin ? service : token;
      const authorization = /^sb_(publishable|secret)_/.test(effectiveToken)
        ? {}
        : { Authorization: `Bearer ${effectiveToken}` };
      const apiKeyHeader = admin ? service : (anon || service);

      const res = await fetch(`${url}${path}`, {
        method,
        signal: AbortSignal.timeout(12000),
        headers: {
          apikey: apiKeyHeader,
          ...authorization,
          'Content-Type': 'application/json'
        },
        ...(data === undefined ? {} : { body: JSON.stringify(data) })
      });

      const result = await res.json().catch(() => null);
      if (!res.ok) {
        if (res.status === 429) {
          throw new ApiError(429, 'محاولات كثيرة. انتظري قليلًا ثم أعيدي المحاولة.');
        }
        const code = result?.error_code || result?.code;
        if (!admin && (res.status === 401 || res.status === 403)) {
          throw new ApiError(401, 'انتهت الجلسة أو بيانات الدخول غير صحيحة.');
        }
        if (code === '23505' || code === 'email_exists') {
          throw new ApiError(409, 'السجل موجود مسبقًا.');
        }
        if (res.status === 422) {
          throw new ApiError(400, 'تعذّر حفظ الحساب. تحققي من البيانات وقوة كلمة المرور.');
        }
        throw new ApiError(502, 'تعذّر الاتصال بقاعدة البيانات. تحققي من الإعداد ثم حاولي مجددًا.');
      }
      return result as T;
    };

    // 1. التحقق من هوية المستخدم عبر Supabase Auth باستخدام JWT المرسل
    const actor = await supabaseRequest<AuthUser>('/auth/v1/user', { admin: false, token: userToken });
    if (!actor || !uuid(actor.id)) {
      throw new ApiError(401, 'سجّلي الدخول أولًا.');
    }

    // 2. التحقق الصارم من صلاحية المعلمة داخل جدول public.profiles وعدم الاعتماد على البريد وحده
    const actorProfiles = await supabaseRequest<ProfileRow[]>(
      `/rest/v1/profiles?id=eq.${actor.id}&select=*`,
      { admin: true }
    );
    const actorProfile = actorProfiles?.[0];
    if (!actorProfile) {
      throw new ApiError(403, 'الحساب غير مفعّل. تواصلي مع المعلمة.');
    }
    if (actorProfile.must_change_password) {
      throw new ApiError(403, 'غيّري كلمة المرور المؤقتة أولًا.');
    }
    if (actorProfile.role !== 'teacher') {
      throw new ApiError(403, 'هذه الصفحة متاحة للمعلمة فقط.');
    }

    // المسؤول الأساسي يجب أن يجمع بين role === 'teacher' في قاعدة البيانات وبريد المالك المؤكد
    const isOwner = actorProfile.role === 'teacher' && ownsPlatform(actor);
    const canManageTeachers =
      actorProfile.role === 'teacher' && (isOwner || actor.app_metadata?.manage_teachers === true);

    const action = String(body.action || '');

    // العملية 1: إضافة طالبة برمز دخول
    if (action === 'create-student') {
      const name = String(body.name || '').trim();
      const code = String(body.code || '').trim().toLowerCase();
      const password = body.password;

      if (name.length < 2 || name.length > 120 || !codePattern.test(code)) {
        throw new ApiError(400, 'أدخلي اسمًا ورمزًا بالإنجليزية من 3 إلى 40 حرفًا يبدأ بحرف.');
      }
      if (typeof password !== 'string' || password.length < 10 || password.length > 128) {
        throw new ApiError(400, 'كلمة المرور المؤقتة يجب أن تكون 10 أحرف على الأقل.');
      }

      const duplicate = await supabaseRequest<Array<{ id: string }>>(
        `/rest/v1/profiles?code=eq.${encodeURIComponent(code)}&select=id`,
        { admin: true }
      );
      if (duplicate.length) {
        throw new ApiError(409, 'رمز الطالبة مستخدم مسبقًا.');
      }

      const created = await supabaseRequest<{ id: string }>('/auth/v1/admin/users', {
        method: 'POST',
        admin: true,
        data: { email: loginEmail(code), password, email_confirm: true }
      });

      try {
        await supabaseRequest('/rest/v1/profiles', {
          method: 'POST',
          admin: true,
          data: {
            id: created.id,
            name,
            code,
            role: 'student',
            must_change_password: true
          }
        });
      } catch (err) {
        await supabaseRequest(`/auth/v1/admin/users/${created.id}`, {
          method: 'DELETE',
          admin: true
        }).catch(() => {});
        throw err;
      }

      return jsonReply(201, { ok: true });
    }

    // العملية 2: إعادة تعيين كلمة مرور الطالبة
    if (action === 'reset-password') {
      const studentId = body.studentId;
      const password = body.password;

      if (!uuid(studentId) || typeof password !== 'string' || password.length < 10 || password.length > 128) {
        throw new ApiError(400, 'بيانات استعادة الحساب غير صحيحة.');
      }

      // يشترط أن يكون الحساب المستهدف طالبة حصراً (role=eq.student) لمنع المساس بحسابات المعلمات
      const students = await supabaseRequest<Array<{ id: string }>>(
        `/rest/v1/profiles?id=eq.${studentId}&role=eq.student&select=id`,
        { admin: true }
      );
      const student = students?.[0];
      if (!student) {
        throw new ApiError(404, 'لم يتم العثور على الطالبة.');
      }

      await supabaseRequest(`/auth/v1/admin/users/${student.id}`, {
        method: 'PUT',
        admin: true,
        data: { password }
      });
      await supabaseRequest(`/rest/v1/profiles?id=eq.${student.id}&role=eq.student`, {
        method: 'PATCH',
        admin: true,
        data: { must_change_password: true }
      });

      return jsonReply(200, { ok: true });
    }

    // العمليات 3 و 4: عرض المعلمات وإدارة صلاحياتهن
    if (action === 'list-teachers' || action === 'manage-teacher') {
      if (!canManageTeachers) {
        throw new ApiError(403, 'لا تملكين صلاحية إدارة المعلمات.');
      }

      const users: AuthUser[] = [];
      for (let page = 1; ; page++) {
        const result = await supabaseRequest<{ users?: AuthUser[] }>(
          `/auth/v1/admin/users?page=${page}&per_page=100`,
          { admin: true }
        );
        const batch = result?.users || [];
        users.push(...batch);
        if (batch.length < 100) break;
      }

      if (action === 'list-teachers') {
        const teacherProfiles = await supabaseRequest<ProfileRow[]>(
          '/rest/v1/profiles?select=*&order=created_at.asc,id.asc&limit=500&offset=0&role=eq.teacher',
          { admin: true }
        );
        const teachers = teacherProfiles.map(p => {
          const auth = users.find(u => u.id === p.id);
          return {
            id: p.id,
            name: p.name,
            email: auth?.email || '',
            isOwner: Boolean(auth && p.role === 'teacher' && ownsPlatform(auth)),
            canManageTeachers: auth?.app_metadata?.manage_teachers === true
          };
        });
        return jsonReply(200, { teachers });
      }

      const email = String(body.email || '').trim().toLowerCase();
      const operation = body.operation;
      const grantManage = body.canManageTeachers;

      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        (operation !== 'grant' && operation !== 'revoke') ||
        typeof grantManage !== 'boolean'
      ) {
        throw new ApiError(400, 'تحققي من البريد والصلاحية المطلوبة.');
      }

      const target = users.find(u => u.email?.toLowerCase() === email);
      if (!target || !target.email_confirmed_at) {
        throw new ApiError(400, 'يجب أن تسجّل المعلمة بهذا البريد وتؤكده أولًا، ثم تسجّل الدخول مرة واحدة.');
      }
      if (target.id === actor.id || target.email?.toLowerCase() === ownerEmail) {
        throw new ApiError(403, 'لا يمكن تعديل صلاحية المسؤول الأساسي أو حسابكِ من هنا.');
      }
      if (!isOwner && (operation === 'revoke' || grantManage || target.app_metadata?.manage_teachers === true)) {
        throw new ApiError(403, 'هذه الصلاحية متاحة للمسؤول الأساسي فقط. يمكنكِ إضافة معلمات لمتابعة النتائج.');
      }

      const targetProfiles = await supabaseRequest<ProfileRow[]>(
        `/rest/v1/profiles?id=eq.${target.id}&select=*`,
        { admin: true }
      );
      const targetProfile = targetProfiles?.[0];
      if (!targetProfile) {
        throw new ApiError(400, 'اطلبي من المعلمة تسجيل الدخول مرة واحدة لإكمال حسابها.');
      }

      const grant = operation === 'grant';
      await supabaseRequest(`/auth/v1/admin/users/${target.id}`, {
        method: 'PUT',
        admin: true,
        data: {
          app_metadata: {
            ...(target.app_metadata || {}),
            manage_teachers: Boolean(grant && isOwner && grantManage)
          }
        }
      });

      try {
        await supabaseRequest(`/rest/v1/profiles?id=eq.${target.id}`, {
          method: 'PATCH',
          admin: true,
          data: { role: grant ? 'teacher' : 'student' }
        });
      } catch (err) {
        await supabaseRequest(`/auth/v1/admin/users/${target.id}`, {
          method: 'PUT',
          admin: true,
          data: {
            app_metadata: {
              ...(target.app_metadata || {}),
              manage_teachers: target.app_metadata?.manage_teachers === true
            }
          }
        }).catch(() => {});
        throw err;
      }

      return jsonReply(200, { ok: true });
    }

    throw new ApiError(400, 'العملية غير معروفة.');
  } catch (err) {
    const status = err instanceof ApiError ? err.status : 500;
    const message = err instanceof ApiError ? err.message : 'تعذّر إكمال العملية. حاولي مجددًا.';
    return jsonReply(status, { error: message });
  }
}

if (typeof Deno !== 'undefined' && typeof Deno.serve === 'function') {
  Deno.serve(req => handleAdminRequest(req));
}
