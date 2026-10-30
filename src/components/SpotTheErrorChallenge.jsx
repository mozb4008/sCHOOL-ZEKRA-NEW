import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  AlertTriangle, CheckCircle2, XCircle, Lightbulb, ArrowLeft, ArrowRight, 
  RotateCcw, Sparkles, BookOpen, Flame, HelpCircle, ShieldCheck, ChevronRight,
  Zap, Atom, Award
} from 'lucide-react';
import { errorChallengeBank } from '../data/errorChallengeData';
import OrbitalBoxVisualizer from './OrbitalBoxVisualizer';
import { api, usePlatform, Notice } from '../lib/platform';

export default function SpotTheErrorChallenge() {
  const { account, setAccount } = usePlatform();
  const completedIds = account.completedIds;
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [requestId, setRequestId] = useState(() => crypto.randomUUID());
  const [activeCategory, setActiveCategory] = useState('all'); // 'all' | 'ions' | 'neutral'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealedError, setRevealedError] = useState(false);
  const [selectedCorrection, setSelectedCorrection] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null); // 'correct' | 'incorrect' | null
  const [streak, setStreak] = useState(0);

  // Filter questions based on selected category
  const filteredQuestions = activeCategory === 'all' 
    ? errorChallengeBank 
    : errorChallengeBank.filter(q => q.category === activeCategory);

  const currentQuestion = filteredQuestions[currentIndex] || filteredQuestions[0];

  // Reset answer states when question changes
  useEffect(() => {
    setRevealedError(false);
    setSelectedCorrection(null);
    setShowHint(false);
    setSubmissionStatus(null);
    setSaveError('');
    setRequestId(crypto.randomUUID());
  }, [currentIndex, activeCategory]);

  const handleCategoryChange = (cat) => {
    if (saving) return;
    setActiveCategory(cat);
    setCurrentIndex(0);
  };

  // Submit Answer
  const handleVerifyAnswer = async () => {
    if (!selectedCorrection || saving) return;
    setSaving(true); setSaveError('');
    try {
      const result = await api('challenge', { requestId, challengeId: currentQuestion.id, choice: currentQuestion.options.indexOf(selectedCorrection) });
      setAccount(result);
    } catch (e) { setSaveError(e.message); setSaving(false); return; }
    setSaving(false);

    if (selectedCorrection.isCorrect) {
      setSubmissionStatus('correct');
      setStreak(prev => prev + 1);
      

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 70,
          spread: 75,
          origin: { y: 0.65 },
          colors: ['#07a869', '#0da9a6', '#3d7eb9', '#c1b489']
        });
      } catch (e) {}
    } else {
      setSubmissionStatus('incorrect');
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (saving) return;
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (saving) return;
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const isCompleted = completedIds.includes(currentQuestion.id);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {saveError && <Notice error>{saveError} أعيدي التحقق لحفظ المحاولة.</Notice>}
      {saving && <Notice>جارٍ حفظ المحاولة…</Notice>}
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-moe-green-tint text-moe-green-dark text-xs font-bold mb-2 border border-moe-green/30">
            <Sparkles className="w-3.5 h-3.5 text-moe-green" />
            <span>القسم المحوري لتقرير قياس الأثر</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-moe-navy">
            تحدي «خطأ نودّعه»
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            حللي التوزيع الإلكتروني الخاطئ، حددي موضع الخلل العلمي، وصححيه مع التفسير لتعزيز الفهم الناقد.
          </p>
        </div>

        {/* Gamification Stats */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl shadow-xs">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
            <div className="flex flex-col">
              <span className="text-[10px] text-amber-800 font-bold">الحماس المتتالي</span>
              <span className="text-sm font-black text-amber-900">{streak} إجابات</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-2xl shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-moe-green" />
            <div className="flex flex-col">
              <span className="text-[10px] text-emerald-800 font-bold">التحديات المنجزة</span>
              <span className="text-sm font-black text-emerald-900 font-mono">
                {completedIds.length} / {errorChallengeBank.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => handleCategoryChange('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeCategory === 'all'
              ? 'bg-moe-navy text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          جميع التحديات ({errorChallengeBank.length})
        </button>

        <button
          onClick={() => handleCategoryChange('ions')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeCategory === 'ions'
              ? 'bg-moe-green text-white shadow-sm'
              : 'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>تحديات الأيونات الموجبة والسالبة ({errorChallengeBank.filter(q => q.category === 'ions').length})</span>
        </button>

        <button
          onClick={() => handleCategoryChange('neutral')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeCategory === 'neutral'
              ? 'bg-moe-blue text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Atom className="w-3.5 h-3.5" />
          <span>تحديات الذرات المتعادلة والاستثناءات ({errorChallengeBank.filter(q => q.category === 'neutral').length})</span>
        </button>
      </div>

      {/* Main Challenge Card */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-elevated p-6 sm:p-8 space-y-6 relative overflow-hidden">
        
        {/* Top Challenge Navigation Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
              التحدي {currentIndex + 1} من {filteredQuestions.length}
            </span>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
              currentQuestion.category === 'ions' 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {currentQuestion.levelAr}
            </span>
            {isCompleted && (
              <span className="text-[11px] font-bold text-moe-green bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                ✓ تم الإتقان سابقاً
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none"
              title="السابق"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              title="التالي"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Question Prompt & Element Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-moe-navy">
              {currentQuestion.element.nameAr}
            </h2>
            <div className="font-mono text-sm bg-slate-100 text-slate-800 px-3 py-1 rounded-xl font-bold">
              الرمز: {currentQuestion.element.symbol} | Z = {currentQuestion.element.z}
            </div>
          </div>
          <p className="text-sm sm:text-base font-bold text-slate-700 leading-relaxed text-right">
            {currentQuestion.questionPrompt}
          </p>
        </div>

        {/* The Erroneous Configuration Box */}
        <div className="bg-rose-50/70 rounded-2xl border-2 border-rose-200 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-rose-800 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>التوزيع الإلكتروني الخاطئ المعروض للفحص:</span>
            </span>
            <span className="text-[11px] text-rose-600 font-bold bg-white px-2.5 py-0.5 rounded-full border border-rose-200">
              خطأ نودّعه ❌
            </span>
          </div>

          <div className="font-mono text-xl sm:text-2xl font-black text-rose-950 tracking-wider dir-ltr text-center py-2 bg-white/80 rounded-xl border border-rose-200">
            {currentQuestion.wrongConfig}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <button
              onClick={() => setRevealedError(!revealedError)}
              className="text-moe-navy font-bold hover:underline flex items-center gap-1"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>{revealedError ? 'إخفاء موقع الخطأ' : 'انقري هنا لمساعدتك في اكتشاف الخطأ وتحديده'}</span>
            </button>

            <button
              onClick={() => setShowHint(!showHint)}
              className="text-slate-500 hover:text-slate-700 flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showHint ? 'إخفاء التلميح' : 'عرض تلميح علمي'}</span>
            </button>
          </div>

          {/* Revealed Error Explanation */}
          {revealedError && (
            <div className="p-3.5 rounded-xl bg-white border border-rose-300 text-xs text-rose-900 space-y-1 animate-in fade-in duration-200">
              <div className="font-bold flex items-center gap-1">
                <span>🔍 التشخيص:</span>
                <span>{currentQuestion.errorTypeNameAr}</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                {currentQuestion.identifiedErrorText}
              </p>
            </div>
          )}

          {/* Hint */}
          {showHint && (
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 animate-in fade-in duration-200">
              💡 <strong>تلميح المبادرة:</strong> {currentQuestion.hint}
            </div>
          )}
        </div>

        {/* Options to Choose the Corrected Configuration */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700">
            اختاري التوزيع الإلكتروني الصحيح علمياً:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedCorrection?.text === opt.text;
              let style = "border-slate-200 hover:border-slate-300 bg-white text-slate-800";

              if (submissionStatus) {
                if (opt.isCorrect) {
                  style = "border-moe-green bg-emerald-50 text-emerald-950 font-bold";
                } else if (isSelected && !opt.isCorrect) {
                  style = "border-rose-400 bg-rose-50 text-rose-950";
                } else {
                  style = "border-slate-200 bg-slate-50/50 text-slate-400";
                }
              } else if (isSelected) {
                style = "border-moe-green bg-emerald-50/80 text-emerald-900 font-bold shadow-xs";
              }

              return (
                <button
                  key={idx}
                  disabled={submissionStatus !== null || saving}
                  onClick={() => { setSelectedCorrection(opt); setRequestId(crypto.randomUUID()); }}
                  className={`p-4 rounded-2xl border-2 text-right transition-all flex items-center justify-between gap-3 ${style}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center text-xs font-mono font-bold text-slate-600">
                      {idx + 1}
                    </span>
                    <span className="font-mono text-sm sm:text-base dir-ltr text-left">
                      {opt.text}
                    </span>
                  </div>

                  {submissionStatus && opt.isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-moe-green flex-shrink-0" />
                  )}
                  {submissionStatus && isSelected && !opt.isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scientific Explanation Card shown upon submission */}
        {submissionStatus && (
          <div className={`p-5 rounded-2xl border space-y-2 animate-in fade-in duration-300 ${
            submissionStatus === 'correct' 
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
              : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}>
            <div className="flex items-center gap-2 font-black text-sm">
              {submissionStatus === 'correct' ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-moe-green" />
                  <span>أحسنتِ وصححتِ الخطأ ببراعة! 🎉</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <span>إجابة تحتاج لمراجعة، تأملي التفسير العلمي أدناه:</span>
                </>
              )}
            </div>

            <div className="text-xs sm:text-sm leading-relaxed text-slate-700 text-justify pt-1">
              <strong>التفسير العلمي المعتمد:</strong> {currentQuestion.scientificExplanation}
            </div>

            <div className="text-[11px] text-slate-500 pt-1 font-semibold">
              القاعدة المطبقة: {currentQuestion.ruleBreached}
            </div>

            {currentQuestion.textbookRef && (
              <div className="text-[11px] text-moe-navy pt-2 font-bold flex items-center justify-between border-t border-slate-200/60 mt-1">
                <span>مرجع كتاب كيمياء 1:</span>
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-emerald-800">{currentQuestion.textbookRef}</span>
              </div>
            )}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            onClick={() => {
              setSelectedCorrection(null);
              setRequestId(crypto.randomUUID());
              setSubmissionStatus(null);
              setRevealedError(false);
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800"
          >
            <RotateCcw className="w-4 h-4" />
            <span>إعادة المحاولة</span>
          </button>

          {!submissionStatus ? (
            <button
              onClick={handleVerifyAnswer}
              disabled={!selectedCorrection || saving}
              className="px-6 py-3 rounded-2xl bg-moe-green hover:bg-moe-green-dark text-white font-extrabold text-xs sm:text-sm shadow-md shadow-moe-green/25 disabled:opacity-40 disabled:pointer-events-none transition-all"
            >
              تصحيح الخطأ وتأكيد الإجابة
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-2xl bg-moe-navy hover:bg-moe-navy-light text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
            >
              <span>الانتقال للتحدي التالي</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
