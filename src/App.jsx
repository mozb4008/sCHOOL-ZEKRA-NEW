import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import IonsSection from './components/IonsSection';
import SpotTheErrorChallenge from './components/SpotTheErrorChallenge';
import LearnSection from './components/LearnSection';
import InteractiveLab from './components/InteractiveLab';
import AssessmentSection from './components/AssessmentSection';
import TeacherDashboard from './components/TeacherDashboard';
import ImpactReport from './components/ImpactReport';
import { usePlatform, Notice, buttonClass } from './lib/platform';
import { LoginPanel, PasswordPanel, StudentProgress } from './components/AccountPanel';
import { errorChallengeBank } from './data/errorChallengeData';

export default function App() {
  const [activeTab, setTab] = useState('home');
  const setActiveTab = tab => {
    if (tab === activeTab) return;
    if (!window.dispatchEvent(new Event('atqin-before-navigation', { cancelable: true })) &&
        !window.confirm('الاختبار لم يُسلّم بعد. هل تريدين مغادرته وفقد الإجابات غير المحفوظة؟')) return;
    setTab(tab);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  const { account, logout, authCallback } = usePlatform();
  const [logoutError, setLogoutError] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);
  const isTeacher = account?.profile.role === 'teacher';
  useEffect(() => {
    setTab(account ? (account.profile.role === 'teacher' ? 'teacher' : 'progress') : authCallback ? 'login' : 'home');
  }, [account?.profile.id, authCallback]);
  const signOut = async () => {
    setLoggingOut(true); setLogoutError('');
    try { await logout(); } catch (e) { setLogoutError(e.message); } finally { setLoggingOut(false); }
  };
  const privateTab = ['challenge', 'assessment', 'teacher', 'report', 'progress', 'login'].includes(activeTab);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-moe-green selection:text-white">
      
      {/* Official MoE Header & Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        role={account?.profile.role}
        progressSummary={account?.profile.role === 'student' ? { completedChallenges: account.completedIds.length, total: errorChallengeBank.length } : null}
      />

      {/* Main Dynamic View Content */}
      <main className="flex-1" id="main-content">
        {account && <div className="no-print max-w-7xl mx-auto px-4 pt-4 flex flex-wrap justify-between gap-3 items-center text-sm"><span>{account.profile.name} • {isTeacher ? 'حساب المعلمة' : 'حساب الطالبة'}</span><button className={buttonClass} disabled={loggingOut} onClick={signOut}>{loggingOut ? 'جارٍ الخروج…' : 'تسجيل الخروج'}</button>{logoutError && <Notice error>{logoutError}</Notice>}</div>}
        {account?.profile.must_change_password || account?.recoveryRequired ? <PasswordPanel required recovery={account.recoveryRequired} /> : privateTab && !account ? <LoginPanel /> : ['teacher', 'report'].includes(activeTab) && !isTeacher ? <div className="max-w-3xl mx-auto p-6"><Notice error>هذه الصفحة متاحة للمعلمة فقط.</Notice></div> : <>
        {activeTab === 'login' && (isTeacher ? <TeacherDashboard onGoToReport={() => setActiveTab('report')} /> : <StudentProgress onNavigate={setActiveTab} />)}
        {activeTab === 'progress' && account?.profile.role === 'student' && <StudentProgress onNavigate={setActiveTab} />}
        {activeTab === 'home' && (
          <HeroSection 
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
          />
        )}

        {activeTab === 'ions' && (
          <IonsSection 
            onNavigateToChallenge={() => {
              setActiveTab('challenge');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'challenge' && (
          account?.profile.role === 'student' ? <SpotTheErrorChallenge /> : <div className="max-w-3xl mx-auto p-6"><Notice>التحديات المسجلة مخصصة لحسابات الطالبات.</Notice></div>
        )}

        {activeTab === 'learn' && (
          <LearnSection 
            onStartChallenge={() => {
              setActiveTab('challenge');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
          />
        )}

        {activeTab === 'lab' && (
          <InteractiveLab />
        )}

        {activeTab === 'assessment' && (
          account?.profile.role === 'student' ? <AssessmentSection /> : <div className="max-w-3xl mx-auto p-6"><Notice>الاختبارات المسجلة مخصصة لحسابات الطالبات.</Notice></div>
        )}

        {activeTab === 'teacher' && (
          <TeacherDashboard 
            onGoToReport={() => {
              setActiveTab('report');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
          />
        )}

        {activeTab === 'report' && (
          <ImpactReport />
        )}
        </>}
      </main>

      {/* Official Footer with Teacher Attribution as requested */}
      <footer className="no-print bg-moe-navy text-white mt-16 border-t border-moe-navy-light/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Logo and About */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="bg-white p-1 rounded-lg">
                  <img 
                    src="/moe_logo.svg" 
                    alt="وزارة التعليم" 
                    className="h-10 w-auto object-contain"
                  />
                </div>
                <div>
                  <h4 className="font-black text-lg text-white">أتقن مهارتي – التوزيع الإلكتروني</h4>
                  <p className="text-xs text-emerald-300">مبادرة تعليمية نوعية للذرات والأيونات • كيمياء 2</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                مبادرة مدرسية نوعية تهدف إلى تمكين طالبات المرحلة الثانوية من إتقان مهارات التوزيع الإلكتروني للذرة المتعادلة والأيونات الموجبة والسالبة، ومعالجة الفاقد المهاري بأسلوب تفاعلي ناقد عبر «خطأ نودّعه».
              </p>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3 grid grid-cols-2 gap-2 text-xs">
              <div className="space-y-2">
                <div className="font-bold text-moe-teal">أقسام المنصة:</div>
                <button onClick={() => { setActiveTab('ions'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="block text-slate-300 hover:text-white transition-colors">
                  ⚡ تدريب الأيونات
                </button>
                <button onClick={() => { setActiveTab('challenge'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="block text-slate-300 hover:text-white transition-colors">
                  🎯 خطأ نودّعه
                </button>
                <button onClick={() => { setActiveTab('learn'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="block text-slate-300 hover:text-white transition-colors">
                  📖 تعلّم التوزيع
                </button>
                <button onClick={() => { setActiveTab('lab'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="block text-slate-300 hover:text-white transition-colors">
                  🔬 مختبر التدريب
                </button>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-moe-teal">المتابعة والتقارير:</div>
                <button onClick={() => { setActiveTab('assessment'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="block text-slate-300 hover:text-white transition-colors">
                  📊 قياس الأثر
                </button>
                <button onClick={() => { setActiveTab('teacher'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="block text-slate-300 hover:text-white transition-colors">
                  👩‍🏫 لوحة المعلمة
                </button>
                <button onClick={() => { setActiveTab('report'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="block text-slate-300 hover:text-white transition-colors">
                  📑 التقرير الختامي
                </button>
              </div>
            </div>

            {/* Official Designer & Execution Attribution (Bespoke requirement) */}
            <div className="md:col-span-4 text-center md:text-right space-y-3">
              <div className="bg-white/10 p-4 rounded-2xl border border-white/15 space-y-1 text-center shadow-inner">
                <span className="text-[11px] text-emerald-300 font-bold block">
                  تصميم وتنفيذ
                </span>
                <h5 className="text-sm font-black text-white">
                  المعلمة/ أ. ذكرى آل صديق
                </h5>
                <p className="text-xs text-slate-200 font-medium">
                  متوسطة وثانوية جميما
                </p>
              </div>

              <p className="text-[10px] text-slate-400 font-mono text-center">
                العام الدراسي 1448هـ • جميع الحقوق محفوظة
              </p>
            </div>

          </div>
        </div>
      </footer>

    </div>
  );
}
