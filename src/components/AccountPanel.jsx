import React, { useState } from 'react';
import { usePlatform, api, Notice, fieldClass, buttonClass } from '../lib/platform';
import { errorChallengeBank } from '../data/errorChallengeData';

export function LoginPanel() {
  const { login, configured, missing, loading, error: connectionError, retry } = usePlatform();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [resendAt, setResendAt] = useState(0);
  const changeMode = mode => { setMode(mode); setError(''); setMessage(''); setPassword(''); setConfirm(''); };
  const submit = async e => {
    e.preventDefault(); setBusy(true); setError('');
    setMessage('');
    try {
      if (mode === 'login') await login(username, password);
      else if (mode === 'signup') {
        if (password !== confirm) throw new Error('كلمتا المرور غير متطابقتين.');
        await api('signup', { name, email: username, password });
        setMode('confirm'); setPassword(''); setConfirm(''); setResendAt(Date.now() + 60000);
        setMessage('راجعي بريدكِ وافتحي رابط تأكيد الحساب، ثم ستدخلين إلى المنصة. تحققي أيضًا من البريد غير الهام. إذا كان البريد مسجّلًا سابقًا يمكنكِ تسجيل الدخول أو استعادة كلمة المرور.');
      } else {
        await api('recover-password', { email: username });
        setMessage('إذا كان البريد مرتبطًا بحساب، ستصلكِ رسالة برابط تعيين كلمة مرور جديدة. راجعي أيضًا البريد غير الهام.');
      }
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  };
  const resend = async () => {
    if (Date.now() < resendAt) { setError('انتظري دقيقة بين رسائل التأكيد.'); return; }
    setBusy(true); setError('');
    try { await api('resend-confirmation', { email: username }); setResendAt(Date.now() + 60000); setMessage('تم طلب رسالة تأكيد جديدة. راجعي بريدكِ والبريد غير الهام.'); }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  };
  return <section className="max-w-lg mx-auto my-10 px-4 space-y-5">
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5">
      <div><p className="text-moe-green font-bold text-sm">أهلًا بكِ في أتقن مهارتي</p><h1 className="text-2xl font-black text-moe-navy mt-2">{mode === 'login' ? 'دخول الطالبات والمعلمة' : mode === 'signup' ? 'إنشاء حساب طالبة' : mode === 'confirm' ? 'أكّدي بريدكِ الإلكتروني' : 'استعادة كلمة المرور'}</h1><p className="text-sm text-slate-600 mt-3 leading-7">{mode === 'login' ? 'ادخلي ببريدكِ وكلمة المرور لتتابعي مستواكِ من أي جهاز. الحسابات السابقة يمكنها الدخول برمز الطالبة أيضًا.' : mode === 'signup' ? 'سجّلي باسمكِ وبريدكِ الخاص، ثم أكّدي البريد. يُضاف حسابكِ إلى المنصة تلقائيًا.' : mode === 'recover' ? 'أدخلي بريد الحساب لنرسل لكِ رابط اختيار كلمة مرور جديدة.' : 'افتحي رابط التأكيد في بريدكِ لإكمال التسجيل.'}</p></div>
      {loading ? <Notice>جارٍ الاتصال بالمنصة…</Notice> : connectionError ? <Notice error>{connectionError} <button className="underline" onClick={retry}>إعادة المحاولة</button></Notice> : !configured ? <Notice>المنصة بانتظار تفعيل قاعدة البيانات. يمكنكِ تصفح الشرح، وسيُتاح الدخول بعد إكمال الإعداد.{missing.length > 0 && <details className="mt-3"><summary className="cursor-pointer font-bold">تفاصيل الإعداد لمسؤول المنصة</summary><p>المتغيرات التالية مفقودة أو فارغة في خدمة الموقع المنشورة. أضيفيها في مشروع Netlify من (Site configuration → Environment variables) مع ترك النطاق على الخيار الافتراضي (All scopes) في الخطة المجانية، ثم أعيدي النشر من (Deploys → Trigger deploy → Deploy site):</p><ul className="list-disc pr-5">{missing.map(name => <li key={name}><code dir="ltr">{name}</code></li>)}</ul></details>}<button className="block underline mt-2" onClick={retry}>إعادة التحقق</button></Notice> : null}
      {message && <Notice>{message}</Notice>}
      {error && <Notice error>{error}{mode === 'login' && error.includes('غير مؤكد') && username.includes('@') && <button type="button" disabled={busy} className="block underline font-bold mt-3" onClick={resend}>إعادة إرسال رابط التأكيد</button>}</Notice>}
      {mode !== 'confirm' && <form onSubmit={submit} className="space-y-4">
        {mode === 'signup' && <label className="block text-sm font-bold">اسم الطالبة<input autoComplete="name" className={`${fieldClass} mt-2`} value={name} onChange={e => setName(e.target.value)} required minLength={2} maxLength={120} /></label>}
        <label className="block text-sm font-bold">{mode === 'login' ? 'البريد الإلكتروني أو رمز الطالبة' : 'البريد الإلكتروني'}<input type={mode === 'login' ? 'text' : 'email'} autoComplete="username" dir="ltr" className={`${fieldClass} mt-2`} value={username} onChange={e => setUsername(e.target.value)} required maxLength={254} placeholder={mode === 'login' ? 'name@example.com أو s001' : 'name@example.com'} /></label>
        {mode !== 'recover' && <label className="block text-sm font-bold">كلمة المرور<input type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} dir="ltr" className={`${fieldClass} mt-2`} value={password} onChange={e => setPassword(e.target.value)} required minLength={mode === 'signup' ? 10 : undefined} maxLength={128} /></label>}
        {mode === 'signup' && <label className="block text-sm font-bold">تأكيد كلمة المرور<input type="password" autoComplete="new-password" dir="ltr" className={`${fieldClass} mt-2`} value={confirm} onChange={e => setConfirm(e.target.value)} required minLength={10} maxLength={128} /></label>}
        <button className={`${buttonClass} w-full`} disabled={busy || loading || !configured}>{busy ? 'جارٍ الإرسال…' : mode === 'login' ? 'تسجيل الدخول' : mode === 'signup' ? 'إنشاء الحساب وإرسال التأكيد' : 'إرسال رابط الاستعادة'}</button>
      </form>}
      <div className="flex flex-wrap gap-4 text-sm text-moe-navy font-bold">
        {mode !== 'login' && <button disabled={busy} className="underline" onClick={() => changeMode('login')}>العودة لتسجيل الدخول</button>}
        {mode === 'login' && <><button disabled={busy} className="underline" onClick={() => changeMode('signup')}>طالبة جديدة؟ أنشئي حسابكِ</button><button disabled={busy} className="underline" onClick={() => changeMode('recover')}>نسيتِ كلمة المرور؟</button></>}
        {mode === 'confirm' && <button disabled={busy} className="underline" onClick={resend}>إعادة إرسال رابط التأكيد</button>}
      </div>
      <p className="text-xs leading-6 text-slate-500">لا تحتاجين إلى موافقة المعلمة لإنشاء حساب طالبة. الحسابات القديمة التي تستخدم رمزًا فقط يمكن للمعلمة إعادة كلمة مرورها.</p>
    </div>
  </section>;
}

export function PasswordPanel({ required = false, recovery = false, onDone }) {
  const { refresh } = usePlatform();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const submit = async e => {
    e.preventDefault(); setError(''); setSuccess(false);
    if (password !== confirm) { setError('كلمتا المرور غير متطابقتين.'); return; }
    setBusy(true);
    try { await api('change-password', { password }); await refresh(); setPassword(''); setConfirm(''); setSuccess(true); onDone?.(); }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  };
  return <form onSubmit={submit} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 max-w-lg mx-auto my-6">
    <h2 className="font-black text-lg text-moe-navy">{recovery ? 'تعيين كلمة مرور جديدة' : required ? 'اختاري كلمة مرور خاصة بكِ' : 'تغيير كلمة المرور'}</h2>
    <p className="text-sm text-slate-600 leading-7">{recovery ? 'تم التحقق من رابط بريدكِ. اختاري كلمة مرور جديدة لحسابكِ.' : required ? 'هذه أول زيارة أو أعادت المعلمة تهيئة حسابكِ. غيّري كلمة المرور المؤقتة قبل المتابعة.' : 'استخدمي كلمة مرور طويلة يصعب تخمينها ولا تشاركيها مع الآخرين.'}</p>
    <label className="block text-sm">كلمة المرور الجديدة<input type="password" dir="ltr" autoComplete="new-password" required minLength={10} maxLength={128} value={password} onChange={e => setPassword(e.target.value)} className={`${fieldClass} mt-2`} /></label>
    <label className="block text-sm">تأكيد كلمة المرور<input type="password" dir="ltr" autoComplete="new-password" required minLength={10} maxLength={128} value={confirm} onChange={e => setConfirm(e.target.value)} className={`${fieldClass} mt-2`} /></label>
    {error && <Notice error>{error}</Notice>}{success && <Notice>تم تغيير كلمة المرور.</Notice>}
    <button className={buttonClass} disabled={busy}>{busy ? 'جارٍ الحفظ…' : 'حفظ كلمة المرور'}</button>
  </form>;
}

export function StudentProgress({ onNavigate }) {
  const { account } = usePlatform();
  const { profile, history, completedIds, attempts } = account;
  const score = history.post?.score;
  const needsWork = history.post?.details.filter(d => !d.isCorrect) || [];
  return <section className="max-w-5xl mx-auto p-4 sm:p-8 space-y-6">
    <div><p className="text-sm text-moe-green font-bold">مساحتكِ الخاصة</p><h1 className="text-2xl font-black text-moe-navy mt-2">أهلًا {profile.name}</h1><p className="text-sm text-slate-500 mt-2">نتائجكِ محفوظة في حسابكِ، وتتابعها معلمتكِ لمساعدتكِ على الإتقان.</p></div>
    <div className="grid sm:grid-cols-3 gap-4">{[['الاختبار القبلي', history.pre?.score == null ? 'لم يُنجز' : `${history.pre.score}%`], ['الاختبار البعدي', score == null ? 'لم يُنجز' : `${score}%`], ['خطأ نودّعه', `${completedIds.length} / ${errorChallengeBank.length}`]].map(([label, value]) => <div key={label} className="bg-white rounded-2xl border border-slate-200 p-6"><p className="text-sm text-slate-600">{label}</p><p className="text-2xl font-black text-moe-navy mt-3"><bdi dir={label === 'خطأ نودّعه' ? 'ltr' : 'auto'}>{value}</bdi></p></div>)}</div>
    <Notice>{!history.pre ? 'ابدئي بالاختبار القبلي لتعرفي نقطة انطلاقكِ.' : score == null ? 'أكملي تدريب الأيونات وتحديات خطأ نودّعه، ثم طبّقي الاختبار البعدي.' : score >= 85 ? 'أحسنتِ، حققتِ معيار الإتقان 85% أو أكثر.' : 'أنتِ تتقدمين. راجعي المهارات التالية وجرّبي التدريب مجددًا.'}{history.pre && history.post && <p>التغير عن الاختبار القبلي: {history.post.score - history.pre.score} نقطة مئوية.</p>}</Notice>
    <div className="flex flex-wrap gap-3"><button className={buttonClass} onClick={() => onNavigate('assessment')}>الاختبار القبلي والبعدي</button><button className={buttonClass} onClick={() => onNavigate('ions')}>تدريب الأيونات</button><button className={buttonClass} onClick={() => onNavigate('challenge')}>خطأ نودّعه</button></div>
    {needsWork.length > 0 && <div className="bg-white rounded-2xl p-6 border border-slate-200"><h2 className="font-black mb-3">مهارات تحتاج إلى تعزيز</h2><ul className="list-disc pr-5 space-y-2 text-sm">{needsWork.map(d => <li key={d.questionId}>{d.skill}<p className="text-slate-500 leading-7">{d.explanation}</p></li>)}</ul></div>}
    <div className="bg-white rounded-2xl border p-6"><h2 className="font-black mb-4">سجل محاولاتي</h2>{attempts.length ? <ul className="space-y-3 text-sm">{[...attempts].reverse().map(a => <li key={a.id} className="flex flex-wrap justify-between gap-2 border-b pb-3"><span>{a.type === 'pre' ? 'اختبار قبلي' : 'اختبار بعدي'} — {new Date(a.created_at).toLocaleString('ar-SA', { timeZone: 'Asia/Riyadh' })}</span><strong>{a.result.score}%</strong></li>)}</ul> : <p className="text-sm text-slate-500">لم تُحفظ محاولات بعد.</p>}</div>
    <PasswordPanel />
  </section>;
}
