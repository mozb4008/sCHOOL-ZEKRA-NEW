// Isolated browser acceptance test. No real Supabase requests or production data.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { mkdir } from 'node:fs/promises';
import { createServer } from 'vite';
import { preTestQuestions, postTestQuestions } from '../src/data/prePostTestData.js';
import { errorChallengeBank } from '../src/data/errorChallengeData.js';
const require = createRequire(import.meta.url);
let playwright;
try { playwright = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright'); }
catch { playwright = require(join(homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')); }
const { chromium } = playwright;
const originalFetch = globalThis.fetch;
process.env.SUPABASE_URL = 'https://atqin-browser-test.invalid';
process.env.SUPABASE_ANON_KEY = 'isolated-test-anon';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'isolated-test-service';
const teacherId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const users = [{ id: teacherId, email: 'teacher@example.test', password: 'Teacher-test-123' }];
const db = { profiles: [{ id: teacherId, code: 'teacher-001', name: 'معلمة الاختبار', role: 'teacher', must_change_password: false, created_at: new Date().toISOString() }], assessment_attempts: [], challenge_attempts: [] };
const sessions = new Map();
const emails = [];
const emailLink = (account, type) => {
  account.email_confirmed_at ||= new Date().toISOString();
  const token = crypto.randomUUID(), refresh = crypto.randomUUID();
  sessions.set(token, account); sessions.set(refresh, account);
  return `http://127.0.0.1:5175/?auth=callback#access_token=${token}&refresh_token=${refresh}&type=${type}`;
};
const response = (data, status = 200) => new Response(JSON.stringify(data), { status });
globalThis.fetch = async (url, options = {}) => {
  if (!String(url).startsWith(process.env.SUPABASE_URL)) return originalFetch(url, options);
  const parsed = new URL(url), path = parsed.pathname, body = options.body ? JSON.parse(options.body) : {};
  const user = sessions.get(options.headers?.Authorization?.replace('Bearer ', ''));
  if (path === '/auth/v1/settings') return response({ mailer_autoconfirm: false });
  if (path === '/auth/v1/signup') {
    const account = { id: crypto.randomUUID(), email: body.email, password: body.password, user_metadata: body.data };
    users.push(account); emails.push({ type: 'signup', account }); return response({ id: account.id });
  }
  if (path === '/auth/v1/recover') { emails.push({ type: 'recovery', account: users.find(u => u.email === body.email) }); return response({}); }
  if (path === '/auth/v1/resend') return response({});
  if (path === '/auth/v1/token') {
    const account = body.refresh_token ? sessions.get(body.refresh_token) : users.find(u => u.email === body.email && u.password === body.password);
    if (!account) return response({ error: 'invalid credentials' }, 400);
    const token = crypto.randomUUID(), refresh = crypto.randomUUID(); sessions.set(token, account); sessions.set(refresh, account);
    return response({ access_token: token, refresh_token: refresh, expires_in: 3600 });
  }
  if (path === '/auth/v1/logout') { sessions.delete(options.headers.Authorization.replace('Bearer ', '')); return response({}); }
  if (path === '/auth/v1/user') {
    if (!user) return response({}, 401);
    if (options.method === 'PUT') user.password = body.password;
    return response({ id: user.id, email: user.email, email_confirmed_at: user.email_confirmed_at, user_metadata: user.user_metadata });
  }
  if (path === '/auth/v1/admin/users') {
    const account = { id: crypto.randomUUID(), ...body }; users.push(account); return response({ id: account.id });
  }
  if (path.startsWith('/auth/v1/admin/users/')) {
    const account = users.find(u => u.id === path.split('/').at(-1));
    if (options.method === 'PUT') Object.assign(account, body);
    return response({ id: account.id });
  }
  if (path.startsWith('/rest/v1/')) {
    const table = path.split('/').at(-1), rows = db[table];
    if (!rows) return response({}, 404);
    const matches = row => [...parsed.searchParams].every(([key, value]) => !value.startsWith('eq.') || String(row[key]) === value.slice(3));
    if (options.method === 'POST') {
      if (!rows.some(row => row.id === body.id)) rows.push({ ...body, created_at: new Date().toISOString() });
      return response(null);
    }
    if (options.method === 'PATCH') { rows.filter(matches).forEach(row => Object.assign(row, body)); return response(null); }
    const offset = Number(parsed.searchParams.get('offset') || 0), limit = Number(parsed.searchParams.get('limit') || 1000);
    return response(rows.filter(matches).slice(offset, offset + limit));
  }
  throw new Error(`Unexpected test API path: ${path}`);
};
let server, browser;
const errors = [];
try {
  server = await createServer({ server: { port: 5175, strictPort: true, host: '127.0.0.1' } });
  await server.listen();
  browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  page.on('pageerror', e => errors.push(e.message));
  const navigate = async label => page.locator('nav').getByRole('button', { name: label, exact: true }).click();
  const logout = async () => { await page.getByRole('button', { name: 'تسجيل الخروج', exact: true }).click(); await page.locator('header').getByRole('button', { name: 'بوابة المعلمة', exact: true }).click(); await page.getByRole('heading', { name: 'دخول الطالبات والمعلمة' }).waitFor(); };
  const login = async (username, password) => {
    await page.getByLabel('البريد الإلكتروني أو رمز الطالبة').fill(username);
    await page.getByLabel('كلمة المرور', { exact: true }).fill(password);
    await page.locator('main').getByRole('button', { name: 'تسجيل الدخول', exact: true }).click();
  };
  await page.goto('http://127.0.0.1:5175');
  await page.locator('header').getByRole('button', { name: 'بوابة المعلمة', exact: true }).click();
  await login('teacher@example.test', 'Teacher-test-123');
  await page.getByRole('heading', { name: 'لوحة المعلمة', exact: true }).waitFor();
  for (const [code, name] of [['s001', 'طالبة اختبار أولى'], ['s002', 'طالبة اختبار ثانية']]) {
    await page.getByRole('button', { name: 'إضافة طالبة', exact: true }).click();
    await page.getByLabel('اسم الطالبة', { exact: true }).fill(name);
    await page.getByLabel('رمز الدخول (بالإنجليزية)').fill(code);
    await page.getByLabel('كلمة المرور المؤقتة', { exact: true }).fill('Temporary-test-123');
    await page.getByRole('button', { name: 'إنشاء الحساب', exact: true }).click();
    await page.getByText('بيانات دخول الحساب — تظهر هنا حتى تغلقيها:').waitFor();
  }
  assert.equal(db.profiles.filter(p => p.role === 'student').length, 2);
  await logout(); await login('s001', 'Temporary-test-123');
  await page.getByRole('heading', { name: 'اختاري كلمة مرور خاصة بكِ' }).waitFor();
  await page.getByLabel('كلمة المرور الجديدة', { exact: true }).fill('Personal-test-123');
  await page.getByLabel('تأكيد كلمة المرور', { exact: true }).fill('Personal-test-123');
  await page.getByRole('button', { name: 'حفظ كلمة المرور', exact: true }).click();
  await page.getByRole('heading', { name: 'أهلًا طالبة اختبار أولى' }).waitFor();
  await navigate('قياس الأثر (قبلي/بعدي)');
  await page.getByRole('button', { name: 'ابدئي الاختبار القبلي (10 أسئلة)', exact: true }).click();
  const runTest = async questions => {
    for (let i = 0; i < questions.length; i++) {
      await page.getByRole('button', { name: questions[i].options[questions[i].correctAnswer], exact: true }).click();
      await page.getByRole('button', { name: i === questions.length - 1 ? 'إنهاء الاختبار ورصد النتيجة' : 'التالي', exact: true }).click();
    }
  };
  await runTest(preTestQuestions);
  await page.getByRole('button', { name: 'الاختبار القبلي محفوظ', exact: true }).waitFor();
  await navigate('خطأ نودّعه');
  const q = errorChallengeBank[0];
  await page.getByRole('button', { name: `${q.options.findIndex(o => o.isCorrect) + 1} ${q.options.find(o => o.isCorrect).text}`, exact: true }).click();
  await page.getByRole('button', { name: 'تصحيح الخطأ وتأكيد الإجابة', exact: true }).click();
  await page.getByText('جارٍ حفظ المحاولة…').waitFor({ state: 'hidden' });
  assert.equal(db.challenge_attempts.filter(a => a.correct).length, 1);
  await navigate('قياس الأثر (قبلي/بعدي)');
  await page.getByRole('button', { name: 'ابدئي الاختبار البعدي (10 أسئلة)', exact: true }).click();
  await runTest(postTestQuestions);
  await page.getByRole('button', { name: 'إعادة الاختبار البعدي', exact: true }).waitFor();
  assert.equal(db.assessment_attempts.length, 2);
  await page.reload();
  await page.getByRole('heading', { name: 'أهلًا طالبة اختبار أولى' }).waitFor();
  await page.getByText('100%', { exact: true }).first().waitFor();
  await page.evaluate(() => window.scrollTo(0, 0));
  await mkdir('test-results', { recursive: true });
  await page.screenshot({ path: 'test-results/student-desktop.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: 'test-results/student-mobile.png', fullPage: true });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'mobile has horizontal overflow');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await logout(); await login('s002', 'Temporary-test-123');
  await page.getByRole('heading', { name: 'اختاري كلمة مرور خاصة بكِ' }).waitFor();
  await page.getByLabel('كلمة المرور الجديدة', { exact: true }).fill('Second-test-123');
  await page.getByLabel('تأكيد كلمة المرور', { exact: true }).fill('Second-test-123');
  await page.getByRole('button', { name: 'حفظ كلمة المرور', exact: true }).click();
  await page.getByRole('heading', { name: 'أهلًا طالبة اختبار ثانية' }).waitFor();
  await page.getByText('لم تُحفظ محاولات بعد.', { exact: true }).waitFor();
  assert.equal(await page.locator('nav').getByRole('button', { name: 'تقرير الإدارة', exact: true }).count(), 0);
  const forbidden = await page.evaluate(async () => (await fetch('/.netlify/functions/platform', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'dashboard' }) })).status);
  assert.equal(forbidden, 403);
  await logout(); await login('teacher@example.test', 'Teacher-test-123');
  await page.getByRole('heading', { name: 'لوحة المعلمة', exact: true }).waitFor();
  await page.getByRole('button', { name: 'تقرير قياس الأثر', exact: true }).click();
  await page.getByRole('heading', { name: 'تقرير قياس أثر مبادرة «أتقن مهارتي»' }).waitFor();
  await page.getByText('عدد الطالبات اللاتي أكملن القياسين:', { exact: false }).waitFor();
  await page.screenshot({ path: 'test-results/report.png', fullPage: true });
  await page.emulateMedia({ media: 'print' });
  assert.ok(await page.locator('.report-document header').isVisible());
  await page.pdf({ path: 'test-results/report.pdf', format: 'A4', printBackground: true });
  await page.emulateMedia({ media: 'screen' });
  await logout();
  await page.getByRole('button', { name: 'طالبة جديدة؟ أنشئي حسابكِ', exact: true }).click();
  await page.getByLabel('اسم الطالبة', { exact: true }).fill('طالبة البريد');
  await page.getByLabel('البريد الإلكتروني', { exact: true }).fill('student@example.test');
  await page.getByLabel('كلمة المرور', { exact: true }).fill('Email-password-123');
  await page.getByLabel('تأكيد كلمة المرور', { exact: true }).fill('Email-password-123');
  await page.screenshot({ path: 'test-results/signup.png', fullPage: true });
  await page.getByRole('button', { name: 'إنشاء الحساب وإرسال التأكيد', exact: true }).click();
  await page.getByRole('heading', { name: 'أكّدي بريدكِ الإلكتروني' }).waitFor();
  assert.equal(emails.length, 1);
  assert.ok(!db.profiles.some(p => p.id === emails[0].account.id), 'profile must wait for verified email');
  await page.goto(emailLink(emails[0].account, 'signup'));
  await page.getByRole('heading', { name: 'أهلًا طالبة البريد' }).waitFor();
  assert.ok(!page.url().includes('access_token'));
  const selfProfile = db.profiles.find(p => p.id === emails[0].account.id);
  assert.equal(selfProfile.role, 'student');
  await logout();
  await page.getByRole('button', { name: 'نسيتِ كلمة المرور؟', exact: true }).click();
  await page.getByLabel('البريد الإلكتروني', { exact: true }).fill('student@example.test');
  await page.getByRole('button', { name: 'إرسال رابط الاستعادة', exact: true }).click();
  await page.getByText('إذا كان البريد مرتبطًا بحساب،', { exact: false }).waitFor();
  assert.equal(emails[1].type, 'recovery');
  await page.goto(emailLink(emails[1].account, 'recovery'));
  await page.getByRole('heading', { name: 'تعيين كلمة مرور جديدة', exact: true }).waitFor();
  await page.getByLabel('كلمة المرور الجديدة', { exact: true }).fill('Recovered-password-123');
  await page.getByLabel('تأكيد كلمة المرور', { exact: true }).fill('Recovered-password-123');
  await page.getByRole('button', { name: 'حفظ كلمة المرور', exact: true }).click();
  await page.getByRole('heading', { name: 'أهلًا طالبة البريد' }).waitFor();
  await logout(); await login('student@example.test', 'Recovered-password-123');
  await page.getByRole('heading', { name: 'أهلًا طالبة البريد' }).waitFor();
  assert.deepEqual(errors, []);
  console.log('PASS: teacher and student flows; assessment persistence/isolation; desktop/mobile/print; email signup, confirmation, profile creation, password recovery, and login with the new password.');
} finally {
  globalThis.fetch = originalFetch;
  await browser?.close(); await server?.close();
}
