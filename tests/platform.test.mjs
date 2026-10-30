import test, { beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { handler } from '../netlify/functions/platform.mjs';
import { gradeAssessment, gradeChallenge, assessmentHistory, publicQuestions } from '../netlify/functions/lib/grading.mjs';
import { preTestQuestions, postTestQuestions } from '../src/data/prePostTestData.js';
import { errorChallengeBank } from '../src/data/errorChallengeData.js';
import { buildReport, formatPercent, studentsCsv } from '../src/lib/report.js';
import { parseEmailCallback } from '../src/lib/emailCallback.js';
import { handleAdminRequest } from '../supabase/functions/admin-actions/index.ts';

const originalFetch = globalThis.fetch;
const studentId = '11111111-1111-4111-8111-111111111111';
const otherId = '22222222-2222-4222-8222-222222222222';
const attemptId = '33333333-3333-4333-8333-333333333333';
const profile = { id: studentId, code: 's001', name: 'طالبة اختبار', role: 'student', must_change_password: false };
const answers = questions => Object.fromEntries(questions.map((q, i) => [i, q.correctAnswer]));
let calls;
let upstream;
beforeEach(() => {
  process.env.SUPABASE_URL = 'https://test.supabase.co';
  process.env.SUPABASE_ANON_KEY = 'test-anon';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service';
  delete process.env.VITE_SUPABASE_URL;
  delete process.env.SUPABASE_PUBLISHABLE_KEY;
  delete process.env.VITE_SUPABASE_ANON_KEY;
  delete process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  delete process.env.SUPABASE_SECRET_KEY;
  calls = [];
  upstream = path => {
    if (path === '/auth/v1/user') return { id: studentId };
    if (path.startsWith('/rest/v1/profiles?')) return [profile];
    if (path.startsWith('/rest/v1/assessment_attempts?')) return [];
    if (path.startsWith('/rest/v1/challenge_attempts?')) return [];
    throw new Error(`Unexpected request ${path}`);
  };
  globalThis.fetch = async (url, options) => {
    const path = url.replace(process.env.SUPABASE_URL, '');
    calls.push({ path, ...options, data: options.body ? JSON.parse(options.body) : undefined });
    const data = await upstream(path, options);
    return data instanceof Response ? data : new Response(JSON.stringify(data), { status: 200 });
  };
});
afterEach(() => { globalThis.fetch = originalFetch; });
const event = (body, headers = {}) => ({ httpMethod: 'POST', body: JSON.stringify(body), headers: {
  host: 'school.netlify.app', origin: 'https://school.netlify.app', 'content-type': 'application/json', cookie: 'atqin_access=token', ...headers } });
const parse = response => JSON.parse(response.body);

test('Al3+ has 10 electrons and full correct server assessment scores 100', () => {
  const ion = postTestQuestions.find(q => q.question.includes('Al³⁺'));
  assert.ok(ion); assert.match(ion.explanation, /10/);
  assert.equal(gradeAssessment('pre', answers(preTestQuestions), 0).score, 100);
  assert.equal(gradeAssessment('post', answers(postTestQuestions), 24).score, 100);
});
test('grading rejects incomplete, invalid and oversized answers', () => {
  assert.throws(() => gradeAssessment('pre', {}, 1));
  assert.throws(() => gradeAssessment('other', answers(preTestQuestions), 1));
  assert.throws(() => gradeAssessment('pre', { ...answers(preTestQuestions), 0: -1 }, 1));
  assert.throws(() => gradeAssessment('pre', { ...answers(preTestQuestions), 10: 0 }, 1));
  assert.throws(() => gradeAssessment('pre', answers(preTestQuestions), -1));
});
test('challenge correctness comes from server bank', () => {
  const q = errorChallengeBank[0];
  assert.equal(gradeChallenge(q.id, q.options.findIndex(o => o.isCorrect)), true);
  assert.equal(gradeChallenge(q.id, q.options.findIndex(o => !o.isCorrect)), false);
  assert.throws(() => gradeChallenge('unknown', 0));
});
test('public questions do not reveal keys or explanations', () => {
  const serialized = JSON.stringify(publicQuestions());
  assert.ok(!serialized.includes('correctAnswer'));
  assert.ok(!serialized.includes('explanation'));
  assert.equal(publicQuestions().pre.length, 10);
});
test('missing configuration is explicit and blocks login while SERVICE_ROLE_KEY is optional', async () => {
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  assert.deepEqual(parse(await handler(event({ action: 'status' }))), { configured: true, missing: [] });
  delete process.env.SUPABASE_ANON_KEY;
  assert.equal(parse(await handler(event({ action: 'status' }))).configured, false);
  assert.deepEqual(parse(await handler(event({ action: 'status' }))).missing, ['SUPABASE_ANON_KEY']);
  assert.equal((await handler(event({ action: 'login' }))).statusCode, 503);
  assert.equal(calls.length, 0);
});
test('configuration diagnostics expose missing names, never credentials', async () => {
  const ready = parse(await handler(event({ action: 'status' })));
  assert.deepEqual(ready, { configured: true, missing: [] });
  process.env.SUPABASE_URL = '  ';
  const missing = await handler(event({ action: 'status' }));
  assert.deepEqual(parse(missing).missing, ['SUPABASE_URL']);
  assert.ok(!missing.body.includes('test-anon'));
  assert.ok(!missing.body.includes('test-service'));
});
test('modern publishable and secret API keys are never sent as Bearer JWTs', async () => {
  process.env.SUPABASE_ANON_KEY = 'sb_publishable_test';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'sb_secret_test';
  upstream = () => ({});
  const result = await handler(event({ action: 'check-connection' }, { cookie: '' }));
  assert.equal(result.statusCode, 200);
  assert.deepEqual(parse(result), { auth: true, database: true });
  assert.equal(calls[0].headers.apikey, 'sb_publishable_test');
  assert.equal(calls[1].headers.apikey, 'sb_secret_test');
  assert.ok(calls.every(c => !('Authorization' in c.headers)));
  assert.ok(!result.body.includes('sb_'));
});
test('user sessions still send their JWT with a modern publishable key', async () => {
  process.env.SUPABASE_ANON_KEY = 'sb_publishable_test';
  const result = await handler(event({ action: 'me' }));
  assert.equal(result.statusCode, 200);
  assert.equal(calls[0].headers.Authorization, 'Bearer token');
});
test('invalid API configuration is distinguished from an incorrect password', async () => {
  upstream = () => new Response(JSON.stringify({ message: 'Invalid API key' }), { status: 401 });
  const config = await handler(event({ action: 'login', username: 's001', password: 'password' }));
  assert.equal(config.statusCode, 503); assert.match(parse(config).error, /SUPABASE_ANON_KEY/);
  upstream = () => new Response(JSON.stringify({ error_code: 'invalid_credentials' }), { status: 400 });
  const credentials = await handler(event({ action: 'login', username: 's001', password: 'password' }));
  assert.equal(credentials.statusCode, 401); assert.ok(!parse(credentials).error.includes('SUPABASE_ANON_KEY'));
});
test('confirmation errors and unapplied RLS policies have distinct messages', async () => {
  upstream = () => new Response(JSON.stringify({ error_code: 'email_not_confirmed' }), { status: 400 });
  const confirmation = parse(await handler(event({ action: 'login', username: 's001', password: 'password' }))).error;
  assert.match(confirmation, /غير مؤكد/); assert.match(confirmation, /رابط التأكيد/); assert.doesNotMatch(confirmation, /Supabase|Authentication|Users/);
  upstream = path => path === '/auth/v1/user' ? { id: studentId } : new Response('{}', { status: 401 });
  const res = await handler(event({ action: 'me' }));
  assert.equal(res.statusCode, 503); assert.match(parse(res).error, /rls-policies\.sql/);
});
test('anonymous user cannot read records', async () => {
  const res = await handler(event({ action: 'me' }, { cookie: '' }));
  assert.equal(res.statusCode, 401); assert.equal(calls.length, 0);
});
test('cross-origin and non-JSON requests are blocked before DB access', async () => {
  assert.equal((await handler(event({ action: 'dashboard' }, { origin: 'https://attacker.test' }))).statusCode, 403);
  assert.equal((await handler(event({ action: 'dashboard' }, { 'sec-fetch-site': 'cross-site' }))).statusCode, 403);
  assert.equal((await handler(event({ action: 'dashboard' }, { 'content-type': 'text/plain' }))).statusCode, 415);
  assert.equal(calls.length, 0);
});
test('student cannot request teacher data or create/reset accounts even with forged role', async () => {
  for (const action of ['dashboard', 'create-student', 'reset-password']) {
    assert.equal((await handler(event({ action, role: 'teacher' }))).statusCode, 403);
  }
  assert.ok(calls.every(c => c.path === '/auth/v1/user' || c.path.startsWith('/rest/v1/profiles?id=eq.')));
});
test('student data filters always use authenticated user id, ignoring supplied ids', async () => {
  const res = await handler(event({ action: 'me', studentId: otherId }));
  assert.equal(res.statusCode, 200);
  const reads = calls.filter(c => /assessment_attempts|challenge_attempts/.test(c.path));
  assert.equal(reads.length, 2);
  assert.ok(reads.every(c => c.path.includes(`student_id=eq.${studentId}`) && !c.path.includes(otherId)));
});
test('temporary passwords must be changed before submission', async () => {
  upstream = path => path === '/auth/v1/user' ? { id: studentId } : [{ ...profile, must_change_password: true }];
  assert.equal((await handler(event({ action: 'questions' }))).statusCode, 403);
});
test('post-test requires saved baseline', async () => {
  const res = await handler(event({ action: 'submit-assessment', type: 'post', requestId: attemptId, answers: answers(postTestQuestions), seconds: 20 }));
  assert.equal(res.statusCode, 400); assert.ok(!calls.some(c => c.method === 'POST'));
});
test('server ignores fabricated score and owner on assessment write and delegates grading to RPC', async () => {
  upstream = (path, options) => {
    if (path === '/auth/v1/user') return { id: studentId };
    if (path.startsWith('/rest/v1/profiles?')) return [profile];
    if (path === '/rest/v1/rpc/submit_assessment_attempt') return { score: 0 };
    if (options.method === 'POST') throw new Error(`Direct table POST is forbidden: ${path}`);
    return [];
  };
  const wrong = Object.fromEntries(preTestQuestions.map((q, i) => [i, (q.correctAnswer + 1) % q.options.length]));
  const res = await handler(event({ action: 'submit-assessment', type: 'pre', requestId: attemptId, answers: wrong, seconds: 10, score: 100, result: { score: 100 }, student_id: otherId }));
  assert.equal(res.statusCode, 200);
  const write = calls.find(c => c.method === 'POST');
  assert.equal(write.path, '/rest/v1/rpc/submit_assessment_attempt');
  assert.deepEqual(write.data, { p_request_id: attemptId, p_type: 'pre', p_answers: wrong, p_seconds: 10 });
  assert.ok(!('score' in write.data) && !('result' in write.data) && !('student_id' in write.data));
});
test('retry of the same assessment does not insert twice', async () => {
  const normal = upstream;
  upstream = path => path.includes(`id=eq.${attemptId}`) ? [{ id: attemptId }] : normal(path);
  const res = await handler(event({ action: 'submit-assessment', type: 'pre', requestId: attemptId, answers: answers(preTestQuestions), seconds: 10 }));
  assert.equal(res.statusCode, 200); assert.ok(!calls.some(c => c.method === 'POST'));
});
test('baseline cannot be overwritten by a second attempt', async () => {
  const normal = upstream;
  upstream = path => path.includes('type=eq.pre') ? [{ id: attemptId }] : normal(path);
  const res = await handler(event({ action: 'submit-assessment', type: 'pre', requestId: attemptId, answers: answers(preTestQuestions), seconds: 10 }));
  assert.equal(res.statusCode, 409); assert.ok(!calls.some(c => c.method === 'POST'));
});
test('login creates HttpOnly secure cookies without exposing tokens in response', async () => {
  upstream = () => ({ access_token: 'secret-access', refresh_token: 'secret-refresh', expires_in: 3600 });
  const res = await handler(event({ action: 'login', username: 'S001', password: 'test-password' }));
  assert.equal(res.statusCode, 200);
  assert.equal(calls[0].data.email, 's001@students.atqin.invalid');
  assert.ok(res.multiValueHeaders['Set-Cookie'].every(c => c.includes('HttpOnly') && c.includes('SameSite=Strict') && c.includes('Secure')));
  assert.ok(!res.body.includes('secret-')); assert.equal(res.headers['Cache-Control'], 'no-store');
});
test('invalid JSON and oversized request bodies fail without requests upstream', async () => {
  assert.equal((await handler({ ...event({}), body: '{' })).statusCode, 400);
  assert.equal((await handler({ ...event({}), body: 'x'.repeat(20001) })).statusCode, 413);
  assert.equal(calls.length, 0);
});
test('refresh session and logout use cookies and clear both credentials', async () => {
  upstream = () => ({ access_token: 'new-token', refresh_token: 'new-refresh' });
  const renewed = await handler(event({ action: 'refresh' }, { cookie: 'atqin_refresh=old-refresh' }));
  assert.equal(renewed.statusCode, 200); assert.equal(calls[0].data.refresh_token, 'old-refresh');
  const loggedOut = await handler(event({ action: 'logout' }));
  assert.ok(loggedOut.multiValueHeaders['Set-Cookie'].every(c => c.includes('Max-Age=0')));
});
test('zero baseline, missing scores and empty classes produce honest metrics', () => {
  const empty = buildReport({ students: [], attempts: [], challenges: [] });
  assert.equal(empty.preAverage, null); assert.equal(empty.improvement, null); assert.equal(empty.masteryRate, null);
  const attempts = [
    { student_id: studentId, type: 'pre', result: { score: 0, details: [] }, created_at: '2026-01-01' },
    { student_id: studentId, type: 'post', result: { score: 90, details: [] }, created_at: '2026-01-02' },
    { student_id: otherId, type: 'pre', result: { score: 100, details: [] }, created_at: '2026-01-01' }
  ];
  const report = buildReport({ students: [profile, { ...profile, id: otherId }], attempts, challenges: [] });
  assert.equal(report.preAverage, 50); assert.equal(report.pairedCount, 1); assert.equal(report.improvement, 90);
  assert.equal(report.postCount, 1); assert.equal(report.masteryRate, 100); assert.equal(formatPercent(0), '0%');
});
test('first baseline and latest post-test selected; CSV prevents spreadsheet formulas', () => {
  const rows = [
    { type: 'post', created_at: '2026-01-03', result: { score: 90 } },
    { type: 'pre', created_at: '2026-01-01', result: { score: 0 } },
    { type: 'post', created_at: '2026-01-02', result: { score: 50 } }
  ];
  assert.equal(assessmentHistory(rows).post.score, 90);
  const csv = studentsCsv([{ name: '=HYPERLINK("x")', code: 's001', history: { pre: null, post: null }, completedChallenges: 0 }]);
  assert.ok(csv.includes("'=HYPERLINK")); assert.ok(!studentsCsv([{ name: 'private name', code: 's001', history: {}, completedChallenges: 0 }], true).includes('private name'));
});
test('teacher creates student role only and cleans orphan auth user if profile save fails', async () => {
  upstream = (path, options) => {
    if (path === '/auth/v1/user') return { id: studentId };
    if (path.includes('profiles?id=')) return [{ ...profile, role: 'teacher' }];
    if (path.includes('profiles?code=')) return [];
    if (path === '/auth/v1/admin/users') return { id: otherId };
    if (path === '/rest/v1/profiles') return new Response('{"message":"db unavailable"}', { status: 500 });
    if (options.method === 'DELETE') return null;
    throw new Error(path);
  };
  const res = await handler(event({ action: 'create-student', name: 'اختبار', code: 's002', password: 'temporary-pass', role: 'teacher' }));
  assert.equal(res.statusCode, 502);
  const write = calls.find(c => c.path === '/rest/v1/profiles');
  assert.equal(write.data.role, 'student');
  assert.ok(calls.some(c => c.method === 'DELETE' && c.path.endsWith(otherId)));
});
test('public signup uses confirmation flow and cannot supply roles or confirm itself', async () => {
  upstream = path => path === '/auth/v1/settings' ? { mailer_autoconfirm: false } : { id: studentId };
  const res = await handler(event({ action: 'signup', name: 'طالبة جديدة', email: 'STUDENT@example.com', password: 'New-password-123', role: 'teacher', email_confirm: true }));
  assert.equal(res.statusCode, 200);
  const signup = calls.find(c => c.path.startsWith('/auth/v1/signup?'));
  assert.deepEqual(signup.data, { email: 'student@example.com', password: 'New-password-123', data: { name: 'طالبة جديدة' } });
  assert.ok(signup.path.includes(encodeURIComponent('https://school.netlify.app/?auth=callback')));
  assert.ok(!res.multiValueHeaders); assert.ok(!calls.some(c => c.path.includes('/admin/')));
});
test('public registration requires real email, name and long password', async () => {
  for (const data of [
    { name: 'طالبة', email: 's001@students.atqin.invalid', password: 'password-123' },
    { name: '', email: 'real@example.com', password: 'password-123' },
    { name: 'طالبة', email: 'real@example.com', password: 'short' }
  ]) assert.equal((await handler(event({ action: 'signup', ...data }))).statusCode, 400);
  assert.equal(calls.length, 0);
});
test('signup refuses disabled email confirmation and reports SMTP setup errors clearly', async () => {
  upstream = () => ({ mailer_autoconfirm: true });
  const signup = { action: 'signup', name: 'طالبة', email: 'real@example.com', password: 'password-123' };
  assert.equal((await handler(event(signup))).statusCode, 503);
  assert.equal(calls.length, 1);
  upstream = () => new Response(JSON.stringify({ error_code: 'email_address_not_authorized' }), { status: 403 });
  const res = await handler(event({ action: 'recover-password', email: 'real@example.com' }));
  assert.equal(res.statusCode, 503); assert.match(parse(res).error, /SMTP/);
});
test('recovery and resend requests contain no role or user enumeration in responses', async () => {
  upstream = () => ({});
  for (const action of ['recover-password', 'resend-confirmation']) {
    const res = await handler(event({ action, email: 'real@example.com' }, { cookie: '' }));
    assert.deepEqual(parse(res), { ok: true });
  }
  assert.equal(calls[0].data.email, 'real@example.com');
  assert.equal(calls[1].data.type, 'signup');
});
test('confirmed users receive a student profile automatically via RPC, ignoring metadata role', async () => {
  let rpcPayload;
  const provisionedProfile = { id: studentId, name: 'طالبة مسجلة', code: `s-${studentId.replaceAll('-', '')}`, role: 'student', must_change_password: false };
  upstream = (path, options) => {
    if (path === '/auth/v1/user') return { id: studentId, email: 'real@example.com', email_confirmed_at: '2026-10-21', user_metadata: { name: 'طالبة مسجلة', role: 'teacher' } };
    if (path === '/rest/v1/rpc/ensure_student_profile') { rpcPayload = JSON.parse(options.body); return provisionedProfile; }
    if (path.startsWith('/rest/v1/profiles?')) return rpcPayload ? [provisionedProfile] : [];
    return [];
  };
  const res = await handler(event({ action: 'me', role: 'teacher' }));
  assert.equal(res.statusCode, 200); assert.equal(parse(res).profile.role, 'student');
  assert.deepEqual(rpcPayload, { p_name: 'طالبة مسجلة' });
  assert.ok(!('role' in rpcPayload) && !('id' in rpcPayload));
});
test('unconfirmed users cannot create a profile by claiming a name or role', async () => {
  upstream = path => path === '/auth/v1/user' ? { id: studentId, email: 'real@example.com', user_metadata: { name: 'طالبة', role: 'teacher' } } : [];
  assert.equal((await handler(event({ action: 'me' }))).statusCode, 403);
  assert.ok(!calls.some(c => c.method === 'POST'));
});
test('existing teacher profiles are never replaced by public student provisioning', async () => {
  const normal = upstream;
  upstream = path => path.startsWith('/rest/v1/profiles?') ? [{ ...profile, role: 'teacher' }] : normal(path);
  assert.equal(parse(await handler(event({ action: 'me' }))).profile.role, 'teacher');
  assert.ok(!calls.some(c => c.method === 'POST'));
});
test('email recovery validates matching token owners and sets secure session cookies', async () => {
  upstream = path => path.includes('/token?') ? { access_token: 'refreshed', refresh_token: 'new-refresh' } : { id: studentId, email_confirmed_at: '2026-10-21' };
  const res = await handler(event({ action: 'email-session', accessToken: 'confirmed', refreshToken: 'refresh', type: 'recovery' }));
  assert.equal(res.statusCode, 200); assert.ok(!res.body.includes('refreshed'));
  assert.ok(res.multiValueHeaders['Set-Cookie'].some(c => c.startsWith('atqin_recovery=1;') && c.includes('HttpOnly')));
  let reads = 0;
  upstream = path => path.includes('/token?') ? { access_token: 'refreshed', refresh_token: 'new-refresh' } : { id: ++reads === 1 ? studentId : otherId, email_confirmed_at: '2026-10-21' };
  const mismatch = await handler(event({ action: 'email-session', accessToken: 'confirmed', refreshToken: 'refresh', type: 'recovery' }));
  assert.equal(mismatch.statusCode, 403); assert.ok(!mismatch.multiValueHeaders);
});
test('recovery mode blocks activity until a new password is saved', async () => {
  const res = await handler(event({ action: 'questions' }, { cookie: 'atqin_access=token; atqin_recovery=1' }));
  assert.equal(res.statusCode, 403);
});
test('email callbacks parse confirmation/recovery and never reflect untrusted errors', () => {
  assert.equal(parseEmailCallback('', '').kind, 'none');
  assert.equal(parseEmailCallback('', '?auth=callback').kind, 'error');
  assert.deepEqual(parseEmailCallback('#access_token=a&refresh_token=r&type=recovery'), { kind: 'session', accessToken: 'a', refreshToken: 'r', type: 'recovery' });
  assert.equal(parseEmailCallback('#access_token=a&type=signup').kind, 'error');
  assert.equal(parseEmailCallback('#access_token=a&refresh_token=r&type=admin').kind, 'error');
  assert.ok(!parseEmailCallback('#error=bad&error_description=untrusted-text').message.includes('untrusted-text'));
});

test('only confirmed primary teacher owns platform; user metadata cannot delegate', async () => {
  upstream = path => {
    if (path === '/auth/v1/user') return { id: studentId, email: 'futureoflife025@gmail.com', email_confirmed_at: '2026-10-22', user_metadata: { manage_teachers: true } };
    if (path.startsWith('/rest/v1/profiles?')) return [{ ...profile, role: 'teacher' }];
    return [];
  };
  assert.deepEqual(parse(await handler(event({ action: 'me' }))).permissions, { isOwner: true, canManageTeachers: true });
  upstream = path => path === '/auth/v1/user' ? { id: studentId, email: 'other@example.com', user_metadata: { manage_teachers: true, platform_owner: true } } : [{ ...profile, role: 'teacher' }];
  assert.equal((await handler(event({ action: 'list-teachers' }))).statusCode, 403);
});

function teacherAccessMock({ owner = true, manager = false, targetOwner = false, confirmed = true } = {}) {
  const actor = { id: studentId, email: owner ? 'futureoflife025@gmail.com' : 'manager@example.com', email_confirmed_at: '2026-10-22', app_metadata: { manage_teachers: manager } };
  const target = { id: otherId, email: targetOwner ? 'futureoflife025@gmail.com' : 'teacher@example.com', email_confirmed_at: confirmed ? '2026-10-22' : null, app_metadata: { provider: 'email' } };
  upstream = (path, options) => {
    if (path === '/auth/v1/user') return actor;
    if (path.startsWith('/auth/v1/admin/users?')) return { users: [actor, target] };
    if (path.startsWith('/auth/v1/admin/users/')) return target;
    if (path.startsWith(`/rest/v1/profiles?id=eq.${studentId}`)) return [{ ...profile, role: 'teacher' }];
    if (path.startsWith(`/rest/v1/profiles?id=eq.${otherId}`)) return options.method === 'PATCH' ? null : [{ ...profile, id: otherId }];
    return [];
  };
}

test('owner grants teacher and delegation preserving other app metadata', async () => {
  teacherAccessMock();
  const res = await handler(event({ action: 'manage-teacher', email: 'TEACHER@example.com', operation: 'grant', canManageTeachers: true }));
  assert.equal(res.statusCode, 200);
  assert.deepEqual(calls.find(c => c.path.endsWith(otherId) && c.method === 'PUT').data.app_metadata, { provider: 'email', manage_teachers: true });
  assert.equal(calls.find(c => c.method === 'PATCH').data.role, 'teacher');
});

test('delegated teacher may add ordinary teachers but cannot delegate, revoke or alter owner', async () => {
  teacherAccessMock({ owner: false, manager: true });
  assert.equal((await handler(event({ action: 'manage-teacher', email: 'teacher@example.com', operation: 'grant', canManageTeachers: false }))).statusCode, 200);
  for (const body of [{ operation: 'grant', canManageTeachers: true }, { operation: 'revoke', canManageTeachers: false }]) {
    calls.length = 0;
    assert.equal((await handler(event({ action: 'manage-teacher', email: 'teacher@example.com', ...body }))).statusCode, 403);
    assert.ok(!calls.some(c => c.method === 'PUT' || c.method === 'PATCH'));
  }
  teacherAccessMock({ owner: false, manager: true, targetOwner: true });
  assert.equal((await handler(event({ action: 'manage-teacher', email: 'futureoflife025@gmail.com', operation: 'grant', canManageTeachers: false }))).statusCode, 403);
});

test('teacher access requires confirmed existing account and protects owner self-change', async () => {
  teacherAccessMock({ confirmed: false });
  assert.equal((await handler(event({ action: 'manage-teacher', email: 'teacher@example.com', operation: 'grant', canManageTeachers: false }))).statusCode, 400);
  teacherAccessMock();
  assert.equal((await handler(event({ action: 'manage-teacher', email: 'unknown@example.com', operation: 'grant', canManageTeachers: false }))).statusCode, 400);
  assert.equal((await handler(event({ action: 'manage-teacher', email: 'futureoflife025@gmail.com', operation: 'revoke', canManageTeachers: false }))).statusCode, 403);
});

test('owner revocation clears delegated authority and changes role to student', async () => {
  teacherAccessMock();
  assert.equal((await handler(event({ action: 'manage-teacher', email: 'teacher@example.com', operation: 'revoke', canManageTeachers: false }))).statusCode, 200);
  assert.equal(calls.find(c => c.method === 'PUT').data.app_metadata.manage_teachers, false);
  assert.equal(calls.find(c => c.method === 'PATCH').data.role, 'student');
});

test('fallback environment variables and quoted values are supported safely without SERVICE_ROLE_KEY', async () => {
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_ANON_KEY;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  process.env.VITE_SUPABASE_URL = ' "https://test.supabase.co///" ';
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY = "'sb_publishable_fallback'";
  const status = parse(await handler(event({ action: 'status' })));
  assert.deepEqual(status, { configured: true, missing: [] });
});

test('core student and teacher operations work via RLS without SUPABASE_SERVICE_ROLE_KEY', async () => {
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  const meRes = await handler(event({ action: 'me' }));
  assert.equal(meRes.statusCode, 200);
  assert.ok(calls.every(c => c.headers.apikey === 'test-anon' && c.headers.Authorization === 'Bearer token'));

  calls.length = 0;
  upstream = path => {
    if (path === '/auth/v1/user') return { id: studentId, email: 'futureoflife025@gmail.com', email_confirmed_at: '2026-10-22' };
    if (path.startsWith('/rest/v1/profiles?')) return [{ ...profile, role: 'teacher' }];
    return [];
  };
  const dashRes = await handler(event({ action: 'dashboard' }));
  assert.equal(dashRes.statusCode, 200);
  assert.ok(calls.every(c => c.headers.apikey === 'test-anon' && c.headers.Authorization === 'Bearer token'));
});

test('admin operations without SERVICE_ROLE_KEY in Netlify are securely routed to Supabase Edge Function', async () => {
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  upstream = (path, options) => {
    if (path === '/auth/v1/user') return { id: studentId, email: 'futureoflife025@gmail.com', email_confirmed_at: '2026-10-22' };
    if (path.startsWith('/rest/v1/profiles?')) return [{ ...profile, role: 'teacher' }];
    if (path === '/functions/v1/admin-actions') {
      const payload = JSON.parse(options.body);
      if (payload.action === 'list-teachers') {
        return { teachers: [{ id: studentId, name: 'أ. ذكرى آل صديق', email: 'futureoflife025@gmail.com', isOwner: true, canManageTeachers: true }] };
      }
      if (payload.action === 'create-student') {
        return new Response(JSON.stringify({ ok: true }), { status: 201 });
      }
      return { ok: true };
    }
    return [];
  };

  const createRes = await handler(event({ action: 'create-student', name: 'طالبة جديدة', code: 's099', password: 'temporary-pass' }));
  assert.equal(createRes.statusCode, 201);
  const edgeCreate = calls.find(c => c.path === '/functions/v1/admin-actions');
  assert.equal(edgeCreate.headers.apikey, 'test-anon');
  assert.equal(edgeCreate.headers.Authorization, 'Bearer token');
  assert.deepEqual(edgeCreate.data, { action: 'create-student', name: 'طالبة جديدة', code: 's099', password: 'temporary-pass' });

  calls.length = 0;
  const resetRes = await handler(event({ action: 'reset-password', studentId: otherId, password: 'temporary-pass' }));
  assert.equal(resetRes.statusCode, 200);
  assert.deepEqual(calls.find(c => c.path === '/functions/v1/admin-actions').data, {
    action: 'reset-password',
    studentId: otherId,
    password: 'temporary-pass'
  });

  calls.length = 0;
  const listRes = await handler(event({ action: 'list-teachers' }));
  assert.equal(listRes.statusCode, 200);
  assert.equal(parse(listRes).teachers.length, 1);

  calls.length = 0;
  const manageRes = await handler(event({ action: 'manage-teacher', email: 't@example.com', operation: 'grant', canManageTeachers: false }));
  assert.equal(manageRes.statusCode, 200);
  assert.deepEqual(calls.find(c => c.path === '/functions/v1/admin-actions').data, {
    action: 'manage-teacher',
    email: 't@example.com',
    operation: 'grant',
    canManageTeachers: false
  });
});

test('Supabase Edge Function admin-actions verifies JWT and teacher role and blocks students or unauthenticated callers', async () => {
  const edgeEnv = name => ({
    SUPABASE_URL: 'https://test.supabase.co',
    SUPABASE_ANON_KEY: 'edge-anon',
    SUPABASE_SERVICE_ROLE_KEY: 'edge-service-secret',
    PRIMARY_TEACHER_EMAIL: 'futureoflife025@gmail.com'
  }[name]);

  // 1. Missing or invalid Authorization header is rejected with 401
  const noAuth = await handleAdminRequest(
    new Request('https://test.supabase.co/functions/v1/admin-actions', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'create-student' })
    }),
    edgeEnv
  );
  assert.equal(noAuth.status, 401);

  // 2. Student calling Edge Function directly is rejected with 403
  upstream = path => {
    if (path === '/auth/v1/user') return { id: studentId, email: 'student@example.com', email_confirmed_at: '2026-10-22' };
    if (path.startsWith('/rest/v1/profiles?')) return [{ ...profile, role: 'student' }];
    throw new Error(`Unexpected path: ${path}`);
  };
  const studentAttempt = await handleAdminRequest(
    new Request('https://test.supabase.co/functions/v1/admin-actions', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: 'Bearer student-jwt' },
      body: JSON.stringify({ action: 'create-student', name: 'محاولة', code: 's100', password: 'temporary-pass' })
    }),
    edgeEnv
  );
  assert.equal(studentAttempt.status, 403);

  // 3. Even if email matches primary owner, if database profile role is student, Edge Function rejects with 403
  upstream = path => {
    if (path === '/auth/v1/user') return { id: studentId, email: 'futureoflife025@gmail.com', email_confirmed_at: '2026-10-22' };
    if (path.startsWith('/rest/v1/profiles?')) return [{ ...profile, role: 'student' }];
    throw new Error(`Unexpected path: ${path}`);
  };
  const emailOnlyAttempt = await handleAdminRequest(
    new Request('https://test.supabase.co/functions/v1/admin-actions', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: 'Bearer owner-jwt' },
      body: JSON.stringify({ action: 'list-teachers' })
    }),
    edgeEnv
  );
  assert.equal(emailOnlyAttempt.status, 403);

  // 4. Verified teacher can create-student, reset-password, list-teachers, and manage-teacher; orphan user is cleaned on DB failure
  let failProfileInsert = false;
  upstream = (path, options) => {
    if (path === '/auth/v1/user') return { id: studentId, email: 'futureoflife025@gmail.com', email_confirmed_at: '2026-10-22' };
    if (path === `/rest/v1/profiles?id=eq.${studentId}&select=*`) return [{ ...profile, role: 'teacher' }];
    if (path.startsWith('/rest/v1/profiles?code=eq.')) return [];
    if (path === '/auth/v1/admin/users' && options.method === 'POST') return { id: otherId };
    if (path === '/rest/v1/profiles' && options.method === 'POST') {
      if (failProfileInsert) return new Response('{"message":"db fail"}', { status: 500 });
      return {};
    }
    if (path === `/auth/v1/admin/users/${otherId}` && options.method === 'DELETE') return {};
    if (path === `/rest/v1/profiles?id=eq.${otherId}&role=eq.student&select=id`) return [{ id: otherId }];
    if (path === `/auth/v1/admin/users/${otherId}` && options.method === 'PUT') return {};
    if (path.startsWith(`/rest/v1/profiles?id=eq.${otherId}`) && options.method === 'PATCH') return {};
    if (path.startsWith('/auth/v1/admin/users?')) {
      return {
        users: [
          { id: studentId, email: 'futureoflife025@gmail.com', email_confirmed_at: '2026-10-22', app_metadata: {} },
          { id: otherId, email: 'teacher2@example.com', email_confirmed_at: '2026-10-22', app_metadata: {} }
        ]
      };
    }
    if (path.includes('role=eq.teacher')) return [{ ...profile, role: 'teacher' }];
    if (path === `/rest/v1/profiles?id=eq.${otherId}&select=*`) return [{ ...profile, id: otherId, role: 'student' }];
    throw new Error(`Unexpected path: ${path}`);
  };

  const okCreate = await handleAdminRequest(
    new Request('https://test.supabase.co/functions/v1/admin-actions', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: 'Bearer teacher-jwt' },
      body: JSON.stringify({ action: 'create-student', name: 'طالبة ممتازة', code: 's101', password: 'temporary-pass' })
    }),
    edgeEnv
  );
  assert.equal(okCreate.status, 201);
  assert.ok(!(await okCreate.text()).includes('edge-service-secret'));

  // Test orphan user rollback on profile insert failure
  failProfileInsert = true;
  calls.length = 0;
  const failedCreate = await handleAdminRequest(
    new Request('https://test.supabase.co/functions/v1/admin-actions', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: 'Bearer teacher-jwt' },
      body: JSON.stringify({ action: 'create-student', name: 'طالبة ممتازة', code: 's102', password: 'temporary-pass' })
    }),
    edgeEnv
  );
  assert.equal(failedCreate.status, 502);
  assert.ok(calls.some(c => c.path === `/auth/v1/admin/users/${otherId}` && c.method === 'DELETE'));
  failProfileInsert = false;

  const okReset = await handleAdminRequest(
    new Request('https://test.supabase.co/functions/v1/admin-actions', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: 'Bearer teacher-jwt' },
      body: JSON.stringify({ action: 'reset-password', studentId: otherId, password: 'temporary-pass' })
    }),
    edgeEnv
  );
  assert.equal(okReset.status, 200);

  const okList = await handleAdminRequest(
    new Request('https://test.supabase.co/functions/v1/admin-actions', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: 'Bearer teacher-jwt' },
      body: JSON.stringify({ action: 'list-teachers' })
    }),
    edgeEnv
  );
  assert.equal(okList.status, 200);

  const okManage = await handleAdminRequest(
    new Request('https://test.supabase.co/functions/v1/admin-actions', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: 'Bearer teacher-jwt' },
      body: JSON.stringify({ action: 'manage-teacher', email: 'teacher2@example.com', operation: 'grant', canManageTeachers: true })
    }),
    edgeEnv
  );
  assert.equal(okManage.status, 200);
});

test('UI subtitle displays كيمياء 2 while scientific textbook references remain كتاب كيمياء 1', () => {
  const appSource = fs.readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');
  assert.match(appSource, /للذرات والأيونات • كيمياء 2/);
  assert.doesNotMatch(appSource, /للذرات والأيونات • كيمياء 1/);
  const prePostSource = fs.readFileSync(new URL('../src/data/prePostTestData.js', import.meta.url), 'utf8');
  assert.match(prePostSource, /كتاب كيمياء 1/);
});

test('accidentally placing publishable or anon key in SUPABASE_SERVICE_ROLE_KEY is rejected on admin actions', async () => {
  teacherAccessMock();
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'sb_publishable_mistake';
  const res1 = await handler(event({ action: 'list-teachers' }));
  assert.equal(res1.statusCode, 503);
  assert.match(parse(res1).error, /SUPABASE_SERVICE_ROLE_KEY/);
  process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_ANON_KEY;
  const res2 = await handler(event({ action: 'list-teachers' }));
  assert.equal(res2.statusCode, 503);
  assert.match(parse(res2).error, /SUPABASE_SERVICE_ROLE_KEY/);
});

test('rls-policies.sql enforces non-destructive RLS, zero direct writes, private answer vault, and RPC security', () => {
  const sql = fs.readFileSync(new URL('../supabase/rls-policies.sql', import.meta.url), 'utf8');
  // 1. Non-destructive to existing data
  assert.doesNotMatch(sql, /\bdrop\s+table\b|\btruncate\b|\bdelete\s+from\b/i);
  // 2. Direct INSERT, UPDATE, DELETE are completely revoked from anon and authenticated on all public tables
  assert.match(sql, /revoke all on public\.profiles, public\.assessment_attempts, public\.challenge_attempts from public, anon, authenticated/i);
  assert.match(sql, /grant select on public\.profiles, public\.assessment_attempts, public\.challenge_attempts to authenticated/i);
  assert.doesNotMatch(sql, /grant\s+[^\n]*\b(insert|update|delete)\b[^\n]*on\s+public\.(profiles|assessment_attempts|challenge_attempts)\s+to\s+(authenticated|anon|public)/i);
  assert.doesNotMatch(sql, /create\s+policy\s+\S+\s+on\s+public\.(profiles|assessment_attempts|challenge_attempts)\s+for\s+(insert|update|delete)/i);
  // 3. Answer keys are isolated in atqin_private schema and never present inside CREATE FUNCTION bodies (pg_proc)
  assert.match(sql, /revoke all on schema atqin_private from public, anon, authenticated/i);
  assert.match(sql, /revoke all on all tables in schema atqin_private from public, anon, authenticated/i);
  const functionBodies = sql.slice(sql.indexOf('-- 5. دالة التحقق'));
  assert.ok(!functionBodies.includes(preTestQuestions[0].explanation));
  assert.ok(!functionBodies.includes(postTestQuestions[0].explanation));
  for (const q of [...preTestQuestions, ...postTestQuestions]) {
    assert.ok(sql.includes(q.id), `Missing question ${q.id} in SQL answer vault`);
  }
  for (const c of errorChallengeBank) {
    assert.ok(sql.includes(c.id), `Missing challenge ${c.id} in SQL answer vault`);
  }
  // 4. All SECURITY DEFINER functions lock search_path and revoke execution from public and anon
  for (const fn of ['is_teacher()', 'ensure_student_profile(text)', 'complete_password_change()', 'submit_assessment_attempt(uuid, text, jsonb, integer)', 'submit_challenge_attempt(uuid, text, integer)']) {
    assert.ok(sql.includes(`revoke all on function public.${fn} from public, anon;`), `Missing revoke on ${fn}`);
    assert.ok(sql.includes(`grant execute on function public.${fn} to authenticated, service_role;`), `Missing grant on ${fn}`);
  }
});

test('challenge and password-change actions use dedicated RPCs and strip forged fields', async () => {
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  upstream = (path, options) => {
    if (path === '/auth/v1/user') return { id: studentId };
    if (path.startsWith('/rest/v1/profiles?')) return [profile];
    if (path === '/rest/v1/rpc/submit_challenge_attempt') return false;
    if (path === '/rest/v1/rpc/complete_password_change') return null;
    if (options.method === 'POST' || options.method === 'PATCH') throw new Error(`Direct table write is forbidden: ${path}`);
    return [];
  };
  const chRes = await handler(event({ action: 'challenge', requestId: attemptId, challengeId: 'err-ion-1', choice: 1, correct: true, student_id: otherId }));
  assert.equal(chRes.statusCode, 200);
  const rpcCall = calls.find(c => c.path === '/rest/v1/rpc/submit_challenge_attempt');
  assert.deepEqual(rpcCall.data, { p_request_id: attemptId, p_challenge_id: 'err-ion-1', p_choice: 1 });
  assert.ok(!('correct' in rpcCall.data) && !('student_id' in rpcCall.data));

  calls.length = 0;
  const pwRes = await handler(event({ action: 'change-password', password: 'new-strong-password-123', role: 'teacher' }));
  assert.equal(pwRes.statusCode, 200);
  const pwRpc = calls.find(c => c.path === '/rest/v1/rpc/complete_password_change');
  assert.deepEqual(pwRpc.data, {});
});
