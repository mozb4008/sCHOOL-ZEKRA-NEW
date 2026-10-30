export function parseEmailCallback(hash, search = '') {
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  if (params.has('error') || params.has('error_code')) return { kind: 'error', message: 'انتهت صلاحية رابط البريد أو استُخدم سابقًا. اطلبي رسالة جديدة من صفحة الدخول.' };
  if (!params.has('access_token')) return { kind: new URLSearchParams(search).has('auth') ? 'error' : 'none', message: 'رابط البريد غير مكتمل. اطلبي رسالة جديدة.' };
  const type = params.get('type');
  if (!params.get('refresh_token') || !['signup', 'recovery', 'email'].includes(type)) return { kind: 'error', message: 'رابط البريد غير صالح. اطلبي رسالة جديدة.' };
  return { kind: 'session', accessToken: params.get('access_token'), refreshToken: params.get('refresh_token'), type };
}
