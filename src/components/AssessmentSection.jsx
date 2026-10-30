import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Award, CheckCircle2, XCircle, Clock, ArrowLeft, ArrowRight, 
  RotateCcw, Sparkles, TrendingUp, BarChart2, ShieldCheck, AlertTriangle 
} from 'lucide-react';
import { api, usePlatform, Notice } from '../lib/platform';

export default function AssessmentSection() {
  const { account, setAccount } = usePlatform();
  const assessmentHistory = account.history;
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [requestId, setRequestId] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [questionsError, setQuestionsError] = useState('');
  const loadQuestions = () => {
    setQuestionsError('');
    api('questions').then(setQuestions).catch(e => setQuestionsError(e.message));
  };
  useEffect(() => { loadQuestions(); }, []);
  // Test mode: 'dashboard' | 'pre-running' | 'post-running' | 'comparison'
  const [testMode, setTestMode] = useState('dashboard');
  const [activeTestType, setActiveTestType] = useState('pre'); // 'pre' | 'post'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timerIntervalId, setTimerIntervalId] = useState(null);
  useEffect(() => {
    if (!['pre-running', 'post-running'].includes(testMode)) return;
    const guardNavigation = e => e.preventDefault();
    const guardUnload = e => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('atqin-before-navigation', guardNavigation);
    window.addEventListener('beforeunload', guardUnload);
    return () => { window.removeEventListener('atqin-before-navigation', guardNavigation); window.removeEventListener('beforeunload', guardUnload); };
  }, [testMode]);


  // Timer runner
  useEffect(() => {
    if (testMode === 'pre-running' || testMode === 'post-running') {
      const interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
      setTimerIntervalId(interval);
      return () => clearInterval(interval);
    } else {
      if (timerIntervalId) clearInterval(timerIntervalId);
    }
  }, [testMode]);

  // Start a test
  const startTest = (type) => {
    if ((type === 'pre' && assessmentHistory.pre) || (type === 'post' && !assessmentHistory.pre)) return;
    setRequestId(crypto.randomUUID());
    setSaveError('');
    setActiveTestType(type);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setElapsedSeconds(0);
    setStartTime(Date.now());
    setTestMode(type === 'pre' ? 'pre-running' : 'post-running');
  };

  const currentQuestions = questions?.[activeTestType] || [];
  const currentQ = currentQuestions[currentQuestionIndex];

  const handleSelectOption = (index) => {
    if (saving) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: index
    });
  };

  // Submit and grade the test
  const handleSubmitTest = async () => {
    if (saving) return;
    setSaving(true); setSaveError('');
    try {
      const result = await api('submit-assessment', { requestId, type: activeTestType, answers: selectedAnswers, seconds: Math.min(86400, Math.floor((Date.now() - startTime) / 1000)) });
      setAccount(result);
      setTestMode('dashboard');
      if (result.history[activeTestType].score >= 85) confetti({ particleCount: 70, spread: 75, origin: { y: 0.6 } });
    } catch (e) { setSaveError(e.message); } finally { setSaving(false); }
  };

  // Compute Comparison Metrics
  const hasPre = !!assessmentHistory.pre;
  const hasPost = !!assessmentHistory.post;
  const improvementPoints = hasPre && hasPost 
    ? (assessmentHistory.post.score - assessmentHistory.pre.score).toFixed(1) 
    : 0;
  const isImproved = parseFloat(improvementPoints) > 0;

  // Identify strengths & reinforcement skills from post-test
  const strengths = hasPost 
    ? assessmentHistory.post.details.filter(d => d.isCorrect).map(d => d.skill) 
    : [];
  const needsWork = hasPost 
    ? assessmentHistory.post.details.filter(d => !d.isCorrect).map(d => d.skill) 
    : [];

  if (!questions) return <div className="max-w-3xl mx-auto p-6"><Notice error={!!questionsError}>{questionsError || 'جارٍ تحميل الاختبار…'}{questionsError && <button className="underline mr-3" onClick={loadQuestions}>إعادة المحاولة</button>}</Notice></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {saveError && <Notice error>{saveError} إجاباتكِ ما زالت في هذه الصفحة؛ أعيدي التسليم بعد عودة الاتصال.</Notice>}
      {saving && <Notice>جارٍ تصحيح الاختبار وحفظ النتيجة…</Notice>}
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold text-moe-navy bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
          منظومة قياس الأثر العلمي
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-moe-navy mt-2">
          الاختبار القبلي والبعدي لقياس نمو المهارة
        </h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          قياس قبلي وبعدي لمتابعة التقدم في مهارات التوزيع الإلكتروني
        </p>
      </div>

      {/* DASHBOARD VIEW */}
      {testMode === 'dashboard' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Test Action Cards (Pre vs Post) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. الاختبار القبلي */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-soft flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded-full">
                    المرحلة الأولى
                  </span>
                  {hasPre && (
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>مكتمل</span>
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-black text-moe-navy mb-2">
                  الاختبار القبلي (التشخيصي)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  10 أسئلة لقياس المعرفة السابقة وتشخيص نقاط الفاقد التعليمي قبل التدريب التفاعلي.
                </p>

                {hasPre ? (
                  <div className="mt-5 p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                      <span>الدرجة القبلية المحققة:</span>
                      <span className="text-lg font-black text-moe-navy font-mono">
                        {assessmentHistory.pre.score}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>الأخطاء: {assessmentHistory.pre.mistakesCount}</span>
                      <span>الزمن: {assessmentHistory.pre.timeSpentFormatted}</span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80 text-xs text-amber-900 font-medium">
                    ⚡ ابدئي بالاختبار القبلي أولاً لتحديد مستواكِ الأولي قبل التمارين!
                  </div>
                )}
              </div>

              <button
                onClick={() => startTest('pre')}
                disabled={hasPre}
                className="w-full py-3 rounded-2xl bg-moe-navy hover:bg-moe-navy-light text-white font-extrabold text-xs transition-all shadow-md text-center hover:scale-[1.02]"
              >
                {hasPre ? 'الاختبار القبلي محفوظ' : 'ابدئي الاختبار القبلي (10 أسئلة)'}
              </button>
            </div>

            {/* 2. الاختبار البعدي */}
            <div className={`rounded-3xl p-6 sm:p-8 border-2 shadow-soft flex flex-col justify-between space-y-6 ${
              hasPre ? 'bg-white border-moe-green' : 'bg-slate-50/50 border-slate-200 opacity-90'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs bg-moe-green-tint text-moe-green-dark font-bold px-3 py-1 rounded-full">
                    المرحلة الختامية
                  </span>
                  {hasPost && (
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>مكتمل</span>
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-black text-moe-navy mb-2">
                  الاختبار البعدي (قياس الأثر)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  10 أسئلة لمتابعة المهارات المكتسبة بعد التدريب، مع سؤال مخصص لتوزيع Al³⁺.
                </p>

                {hasPost ? (
                  <div className="mt-5 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                      <span>الدرجة البعدية المحققة:</span>
                      <span className="text-lg font-black text-moe-green font-mono">
                        {assessmentHistory.post.score}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-emerald-700">
                      <span>الأخطاء: {assessmentHistory.post.mistakesCount}</span>
                      <span>الزمن: {assessmentHistory.post.timeSpentFormatted}</span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 p-4 bg-slate-100 rounded-2xl border border-slate-200 text-xs text-slate-600 font-medium">
                    {hasPre 
                      ? '✓ أكملتِ القبلي! ينصح بإكمال تحدي «خطأ نودّعه» وتدريب الأيونات ثم خوض البعدي.'
                      : '🔒 أكملي الاختبار القبلي أولًا لفتح الاختبار البعدي.'}
                  </div>
                )}
              </div>

              <button
                onClick={() => startTest('post')}
                disabled={!hasPre}
                className={`w-full py-3 rounded-2xl font-extrabold text-xs transition-all shadow-md text-center hover:scale-[1.02] ${
                  hasPre 
                    ? 'bg-moe-green hover:bg-moe-green-dark text-white shadow-moe-green/20' 
                    : 'bg-slate-300 text-slate-600'
                }`}
              >
                {hasPost ? 'إعادة الاختبار البعدي' : 'ابدئي الاختبار البعدي (10 أسئلة)'}
              </button>
            </div>

          </div>

          {/* Comparison & Impact Analytics Card */}
          {hasPre && hasPost && (
            <div className="bg-gradient-to-br from-white to-slate-50 border-2 border-moe-teal rounded-3xl p-6 sm:p-8 shadow-elevated space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <span className="text-xs bg-moe-teal-tint text-moe-teal font-bold px-3 py-1 rounded-full">
                    مؤشر التحسن الفعلي
                  </span>
                  <h3 className="text-xl font-black text-moe-navy mt-1">
                    تقرير المقارنة والأثر التعليمي
                  </h3>
                </div>

                <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200">
                  <TrendingUp className="w-5 h-5 text-moe-green" />
                  <div className="text-right">
                    <span className="text-[10px] text-emerald-800 font-bold block">التغير بالنقاط المئوية</span>
                    <span className="text-xl font-black text-moe-green font-mono">
                      {isImproved ? `+${improvementPoints}` : improvementPoints} نقطة مئوية
                    </span>
                  </div>
                </div>
              </div>

              {/* Score Visual Gauge Bars */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span>الاختبار القبلي</span>
                    <span>{assessmentHistory.pre.score}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden">
                    <div 
                      className="bg-slate-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${assessmentHistory.pre.score}%` }} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-moe-green">
                    <span>الاختبار البعدي</span>
                    <span>{assessmentHistory.post.score}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden">
                    <div 
                      className="bg-moe-green h-full rounded-full transition-all duration-500" 
                      style={{ width: `${assessmentHistory.post.score}%` }} 
                    />
                  </div>
                </div>
              </div>

              {/* Strengths & Reinforcements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2">
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>نقاط القوة المتقنة ({strengths.length}):</span>
                  </span>
                  <ul className="text-xs text-slate-700 space-y-1 pr-4 list-disc">
                    {strengths.slice(0, 4).map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                    {strengths.length === 0 && <li>لم تتقن بعد كامل المهارات.</li>}
                  </ul>
                </div>

                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-2">
                  <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>المهارات التي تحتاج إلى تعزيز ({needsWork.length}):</span>
                  </span>
                  <ul className="text-xs text-slate-700 space-y-1 pr-4 list-disc">
                    {needsWork.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                    {needsWork.length === 0 && <li className="text-emerald-700 font-bold">مبارك! أتقنتِ جميع مهارات الاختبار البعدي بنسبة 100%!</li>}
                  </ul>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* TEST RUNNER VIEW (Pre or Post) */}
      {(testMode === 'pre-running' || testMode === 'post-running') && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden animate-in fade-in duration-200">
          
          {/* Test Runner Header */}
          <div className="bg-slate-50 border-b border-slate-200 p-4 sm:px-6 flex items-center justify-between">
            <div>
              <span className="text-xs bg-moe-navy text-white px-2.5 py-0.5 rounded-full font-bold">
                {activeTestType === 'pre' ? 'الاختبار القبلي' : 'الاختبار البعدي'}
              </span>
              <span className="mr-2 text-xs text-slate-500 font-semibold">
                السؤال {currentQuestionIndex + 1} من {currentQuestions.length}
              </span>
            </div>

            {/* Timer gauge */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1 rounded-xl text-xs font-mono font-bold text-slate-700 shadow-xs">
              <Clock className="w-3.5 h-3.5 text-moe-teal" />
              <span>{Math.floor(elapsedSeconds / 60)}:{String(elapsedSeconds % 60).padStart(2, '0')}</span>
            </div>
          </div>

          {/* Question Body */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <span className="text-xs text-moe-teal font-bold block">
                  المهارة المستهدفة: {currentQ.skill}
                </span>
                {currentQ.textbookRef && (
                  <span className="text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                    📖 <span>{currentQ.textbookRef}</span>
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-800 leading-relaxed">
                {currentQ.question}
              </h3>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-2xl text-right transition-all border-2 flex items-center justify-between group ${
                      isSelected
                        ? 'border-moe-green bg-moe-green-tint text-slate-900 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-bold leading-normal">
                      {opt}
                    </span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mr-3 transition-colors ${
                      isSelected
                        ? 'border-moe-green bg-moe-green text-white'
                        : 'border-slate-300 group-hover:border-slate-400'
                    }`}>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Bar */}
          <div className="bg-slate-50 border-t border-slate-200 p-4 sm:px-6 flex items-center justify-between">
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold ${
                currentQuestionIndex === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <ArrowRight className="w-4 h-4" />
              <span>السابق</span>
            </button>

            {/* Progress indicators dots */}
            <div className="flex items-center gap-1">
              {currentQuestions.map((_, i) => (
                <div 
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    currentQuestionIndex === i 
                      ? 'bg-moe-navy scale-125' 
                      : selectedAnswers[i] !== undefined 
                      ? 'bg-moe-green' 
                      : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>

            {currentQuestionIndex < currentQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors"
              >
                <span>التالي</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmitTest}
                disabled={saving || Object.keys(selectedAnswers).length !== currentQuestions.length}
                className="px-6 py-2 rounded-xl bg-moe-green hover:bg-moe-green-dark text-white text-xs font-extrabold shadow-md shadow-moe-green/20 transition-all hover:scale-105"
              >
                إنهاء الاختبار ورصد النتيجة
              </button>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
