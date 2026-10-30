import React, { useEffect, useState } from 'react';
import { api, Notice, buttonClass, fieldClass, usePlatform } from '../lib/platform';

export default function TeacherAccess() {
  const { account } = usePlatform();
  const permissions = account?.permissions;
  const [teachers, setTeachers] = useState([]);
  const [email, setEmail] = useState('');
  const [delegate, setDelegate] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [revoke, setRevoke] = useState(null);
  const reload = async () => { const data = await api('list-teachers'); setTeachers(data.teachers); };
  useEffect(() => {
    if (permissions?.canManageTeachers) reload().catch(e => setError(e.message));
  }, [permissions?.canManageTeachers]);
  if (!permissions?.canManageTeachers) return null;
  const save = async (targetEmail, operation, canManageTeachers) => {
    setBusy(true); setError(''); setMessage('');
    try {
      await api('manage-teacher', { email: targetEmail, operation, canManageTeachers });
      setMessage(operation === 'revoke' ? 'تم سحب صلاحية المعلمة. أصبح الحساب بصلاحية طالبة.' : 'تم حفظ صلاحية المعلمة. يمكنها الدخول من صفحة تسجيل الدخول الموحدة للاطلاع على النتائج.');
      setEmail(''); setDelegate(false); setRevoke(null); await reload();
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  };
  return <section className="bg-white border rounded-2xl p-5 space-y-4" aria-labelledby="teacher-access-heading">
    <h2 id="teacher-access-heading" className="text-lg font-black text-moe-navy">إدارة المعلمات</h2>
    <p className="text-sm text-slate-600 leading-7">{permissions.isOwner ? 'أنتِ المسؤول الأساسي. يمكنكِ منح صلاحية المعلمة، والسماح لها بإضافة معلمات أخريات، أو سحب صلاحياتها.' : 'يمكنكِ إضافة معلمات لمتابعة جميع الطالبات والنتائج والتقارير. تفويض إدارة المعلمات وسحب الصلاحيات متاحان للمسؤول الأساسي.'}</p>
    <p className="text-sm text-slate-600 leading-7">تسجّل المعلمة حسابًا جديدًا وتؤكد بريدها وتسجّل الدخول مرة واحدة، ثم أضيفي بريدها هنا. كل حساب جديد يبدأ بصلاحية طالبة.</p>
    <form onSubmit={e => { e.preventDefault(); save(email, 'grant', delegate); }} className="space-y-4 rounded-xl bg-slate-50 p-4">
      <label className="block text-sm font-bold">البريد الإلكتروني للمعلمة<input type="email" dir="ltr" autoComplete="off" required maxLength={254} value={email} onChange={e => setEmail(e.target.value)} className={`${fieldClass} mt-2`} placeholder="teacher@example.com" /></label>
      {permissions.isOwner && <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={delegate} onChange={e => setDelegate(e.target.checked)} />السماح لها بإضافة معلمات أخريات</label>}
      <p className="text-xs text-slate-500">صلاحية المعلمة تتيح الاطلاع على جميع نتائج الطالبات وإدارة حساباتهن.</p>
      <button className={buttonClass} disabled={busy}>{busy ? 'جارٍ الحفظ…' : 'حفظ صلاحية المعلمة'}</button>
    </form>
    {error && <Notice error>{error}</Notice>}{message && <Notice>{message}</Notice>}
    <ul className="divide-y">{teachers.map(teacher => <li key={teacher.id} className="py-4 flex flex-wrap items-center justify-between gap-3">
      <div><p className="font-bold text-sm">{teacher.name}</p><p dir="ltr" className="text-sm text-slate-500">{teacher.email}</p><p className="text-xs text-moe-green mt-1">{teacher.isOwner ? 'المسؤول الأساسي' : teacher.canManageTeachers ? 'معلمة مع صلاحية إضافة معلمات' : 'معلمة'}</p></div>
      {permissions.isOwner && !teacher.isOwner && <div className="flex flex-wrap gap-3 text-sm"><button disabled={busy} className="underline text-moe-navy" onClick={() => { setEmail(teacher.email); setDelegate(teacher.canManageTeachers); setError(''); setMessage(''); }}>تعديل الصلاحية</button><button disabled={busy} className="underline text-red-700" onClick={() => setRevoke(teacher)}>سحب صلاحية المعلمة</button></div>}
    </li>)}</ul>
    {revoke && <div role="alert" className="border border-red-200 rounded-xl p-4 space-y-3"><p className="text-sm">سحب صلاحية المعلمة من {revoke.name}؟ سيتوقف وصولها إلى نتائج الطالبات ويصبح حسابها بصلاحية طالبة.</p><div className="flex gap-4"><button disabled={busy} className={buttonClass} onClick={() => save(revoke.email, 'revoke', false)}>تأكيد سحب الصلاحية</button><button disabled={busy} onClick={() => setRevoke(null)}>إلغاء</button></div></div>}
  </section>;
}
