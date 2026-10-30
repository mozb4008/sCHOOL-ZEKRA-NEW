import React, { useState } from 'react';
import { api, Notice, buttonClass, fieldClass, downloadJson } from '../lib/platform';
import { useTeacherData } from '../lib/useTeacherData';
import { buildReport, formatPercent, studentStatus, studentsCsv } from '../lib/report';
import { PasswordPanel } from './AccountPanel';
import TeacherAccess from './TeacherAccess';

function exportCsv(students) {
  const url = URL.createObjectURL(new Blob([studentsCsv(students, false)], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a'); a.href = url; a.download = 'atqin-students.csv'; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export default function TeacherDashboard({ onGoToReport }) {
  const { data, error, loading, reload } = useTeacherData();
  const [search, setSearch] = useState('');

  const [showAdd, setShowAdd] = useState(false);
  const [resetStudent, setResetStudent] = useState(null);
  const [message, setMessage] = useState('');
  const [actionError, setActionError] = useState('');
  const [busy, setBusy] = useState(false);
  const [credentials, setCredentials] = useState(null);
  const report = data ? buildReport(data) : null;
  const saveStudent = async e => {
    e.preventDefault(); const values = Object.fromEntries(new FormData(e.currentTarget));
    setBusy(true); setActionError(''); setMessage(''); setCredentials(null);
    try {
      await api('create-student', values);
      setCredentials({ code: values.code.trim().toLowerCase(), password: values.password });
      setShowAdd(false); setMessage('تم إنشاء الحساب. سلّمي بيانات الدخول للطالبة بشكل خاص.'); await reload();
    } catch (e) { setActionError(e.message); } finally { setBusy(false); }
  };
  const resetPassword = async e => {
    e.preventDefault(); const password = new FormData(e.currentTarget).get('password');
    setBusy(true); setActionError(''); setCredentials(null);
    try {
      await api('reset-password', { studentId: resetStudent.id, password });
      setCredentials({ code: resetStudent.code, password }); setResetStudent(null);
      setMessage('تم إصدار كلمة مرور مؤقتة. يجب على الطالبة تغييرها عند الدخول.');
    } catch (e) { setActionError(e.message); } finally { setBusy(false); }
  };
  const students = report?.students.filter(s => `${s.name} ${s.code}`.toLowerCase().includes(search.toLowerCase())) || [];
  return <section className="max-w-7xl mx-auto px-4 py-8 space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm text-moe-green font-bold">متوسطة وثانوية جميما • أ. ذكرى آل صديق</p><h1 className="text-2xl font-black text-moe-navy mt-2">لوحة المعلمة</h1><p className="text-sm text-slate-500 mt-2">حسابات الطالبات ونتائجهن الفعلية، دون بيانات تجريبية.</p></div><div className="flex gap-2"><button className={buttonClass} onClick={reload} disabled={loading}>{loading ? 'جارٍ التحديث…' : 'تحديث النتائج'}</button><button className={buttonClass} onClick={onGoToReport}>تقرير قياس الأثر</button></div></div>
    {error && <Notice error>{error}</Notice>}{loading && !data && <Notice>جارٍ تحميل سجل الطالبات…</Notice>}
    {report && <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{[['الطالبات المسجلات', report.students.length], ['متوسط القبلي', formatPercent(report.preAverage)], ['متوسط البعدي', formatPercent(report.postAverage)], ['إتقان من أكملن البعدي', formatPercent(report.masteryRate)]].map(([label, value]) => <div key={label} className="bg-white rounded-2xl p-5 border border-slate-200"><p className="text-sm text-slate-500">{label}</p><p className="text-3xl text-moe-navy font-black mt-3">{value}</p></div>)}</div>
      <p className="text-xs text-slate-500">أكملن القبلي: {report.preCount} — أكملن البعدي: {report.postCount}. معيار الإتقان: 85%. التحديث عند الضغط على «تحديث النتائج».</p>
      <div className="bg-white rounded-2xl border p-5 space-y-4">
        <div className="flex flex-wrap gap-3 justify-between items-center"><h2 className="text-lg font-black text-moe-navy">سجل الطالبات</h2><div className="flex flex-wrap gap-2"><button className={buttonClass} onClick={() => { setShowAdd(!showAdd); setActionError(''); setCredentials(null); }}>إضافة طالبة</button><button className={buttonClass} onClick={() => exportCsv(report.students)}>تصدير CSV</button><button className={buttonClass} onClick={() => downloadJson('atqin-backup.json', { exportedAt: new Date().toISOString(), ...data })}>نسخة بيانات JSON</button></div></div>
        <div className="flex flex-wrap items-center gap-4"><label className="flex-1 text-sm">البحث عن طالبة<input className={`${fieldClass} mt-2`} value={search} onChange={e => setSearch(e.target.value)} placeholder="الاسم أو الرمز" /></label></div>
        {message && <Notice>{message}</Notice>}
        {credentials && <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 space-y-2 text-sm"><p>بيانات دخول الحساب — تظهر هنا حتى تغلقيها:</p><p>الرمز: <b dir="ltr">{credentials.code}</b></p><p>كلمة المرور المؤقتة: <b dir="ltr">{credentials.password}</b></p><button className="underline" onClick={() => setCredentials(null)}>إخفاء بيانات الدخول</button></div>}
        {actionError && <Notice error>{actionError}</Notice>}
        {showAdd && <form onSubmit={saveStudent} className="grid sm:grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4">
          <label className="text-sm">اسم الطالبة<input name="name" className={`${fieldClass} mt-2`} required minLength={2} maxLength={120} /></label>
          <label className="text-sm">رمز الدخول (بالإنجليزية)<input name="code" dir="ltr" className={`${fieldClass} mt-2`} required pattern="[A-Za-z][A-Za-z0-9_-]{2,39}" placeholder="s001" /></label>
          <label className="text-sm">كلمة المرور المؤقتة<input name="password" type="password" dir="ltr" autoComplete="new-password" className={`${fieldClass} mt-2`} required minLength={10} maxLength={128} /></label>
          <div className="flex gap-2 items-end"><button className={buttonClass} disabled={busy}>{busy ? 'جارٍ الإنشاء…' : 'إنشاء الحساب'}</button><button type="button" className="p-3 text-sm" onClick={() => setShowAdd(false)}>إلغاء</button></div>
          <p className="text-xs text-slate-500 sm:col-span-2">لا تحتاج الطالبة إلى بريد إلكتروني. احتفظي برمزها وسلّمي كلمة المرور لها بشكل خاص.</p>
        </form>}
        {resetStudent && <form onSubmit={resetPassword} className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3"><h3 className="font-bold">كلمة مرور مؤقتة جديدة للطالبة {resetStudent.name}</h3><label className="block text-sm">كلمة المرور المؤقتة<input name="password" type="password" autoComplete="new-password" dir="ltr" minLength={10} maxLength={128} required className={`${fieldClass} mt-2`} /></label><div className="flex gap-3"><button className={buttonClass} disabled={busy}>حفظ</button><button type="button" onClick={() => setResetStudent(null)}>إلغاء</button></div></form>}
        <div className="overflow-x-auto"><table className="w-full text-sm text-right"><caption className="sr-only">درجات الطالبات وتقدمهن</caption><thead><tr className="border-b bg-slate-50">{['الرمز', 'الطالبة', 'القبلي', 'آخر بعدي', 'التحديات', 'الحالة', 'الحساب'].map(t => <th key={t} scope="col" className="p-3 whitespace-nowrap">{t}</th>)}</tr></thead><tbody>{students.map(s => <tr key={s.id} className="border-b"><td className="p-3" dir="ltr">{s.code}</td><td className="p-3 whitespace-nowrap">{s.name}</td><td className="p-3">{formatPercent(s.history.pre?.score)}</td><td className="p-3">{formatPercent(s.history.post?.score)}</td><td className="p-3">{s.completedChallenges}</td><td className="p-3 whitespace-nowrap">{studentStatus(s.history)}</td><td className="p-3"><button className="underline text-moe-navy whitespace-nowrap" onClick={() => { setResetStudent(s); setCredentials(null); setActionError(''); }}>إعادة كلمة المرور</button></td></tr>)}</tbody></table></div>
        {!students.length && <p className="text-center text-sm text-slate-500 p-6">{report.students.length ? 'لا توجد نتائج مطابقة للبحث.' : 'لم تُضف طالبات بعد. ابدئي بإنشاء الحسابات.'}</p>}
      </div>
    </>}
    <TeacherAccess />
    <PasswordPanel />
  </section>;
}
