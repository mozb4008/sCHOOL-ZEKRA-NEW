import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, CheckCircle2, XCircle, ArrowLeft, ArrowRight, 
  HelpCircle, Lightbulb, Zap, ShieldCheck, Plus, Minus,
  Layers, Atom, BookOpen, AlertTriangle, ChevronRight, Award
} from 'lucide-react';
import { ionsConcepts, ionsExamples, ionsPracticeQuiz } from '../data/ionsData';
import OrbitalBoxVisualizer from './OrbitalBoxVisualizer';

export default function IonsSection({ onNavigateToChallenge }) {
  const [activeTab, setActiveTab] = useState('concept'); // 'concept' | 'simulator' | 'quiz'
  const [selectedExampleIndex, setSelectedExampleIndex] = useState(0);
  const [showIonState, setShowIonState] = useState(true); // true = ion view, false = neutral atom view

  // Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState({});

  const currentExample = ionsExamples[selectedExampleIndex] || ionsExamples[0];
  const currentQuizQ = ionsPracticeQuiz[quizIndex];

  const handleQuizAnswer = (optionIndex) => {
    if (quizSubmitted) return;
    setSelectedQuizOption(optionIndex);
  };

  const handleVerifyQuiz = () => {
    if (selectedQuizOption === null) return;
    setQuizSubmitted(true);
    const isCorrect = currentQuizQ.options[selectedQuizOption].isCorrect;
    if (isCorrect && !answeredQuestions[quizIndex]) {
      setQuizScore(prev => prev + 1);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#07a869', '#0da9a6', '#3d7eb9']
        });
      } catch (e) {}
    }
    setAnsweredQuestions(prev => ({ ...prev, [quizIndex]: true }));
  };

  const handleNextQuiz = () => {
    if (quizIndex < ionsPracticeQuiz.length - 1) {
      setQuizIndex(prev => prev + 1);
      setSelectedQuizOption(null);
      setQuizSubmitted(false);
    }
  };

  const handlePrevQuiz = () => {
    if (quizIndex > 0) {
      setQuizIndex(prev => prev - 1);
      setSelectedQuizOption(null);
      setQuizSubmitted(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-moe-green-tint text-moe-green-dark text-xs font-bold border border-moe-green/30">
          <Zap className="w-3.5 h-3.5 text-moe-green" />
          <span>المحتوى التخصصي الجديد للمبادرة</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-moe-navy tracking-tight">
          التوزيع الإلكتروني للأيونات الموجبة والسالبة
        </h1>
        <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
          تعلمي القواعد العلمية الدقيقة للفرق بين الذرة المتعادلة والأيونات، وقاعدة فقد الإلكترونات من أعلى مستوى رئيسي أولاً.
        </p>
      </div>

      {/* Main Mode Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-200 pb-4">
        <button
          onClick={() => setActiveTab('concept')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'concept'
              ? 'bg-moe-navy text-white shadow-md shadow-moe-navy/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4 text-moe-teal" />
          <span>١. المفاهيم والقواعد العلمية الثلاث</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'simulator'
              ? 'bg-moe-green text-white shadow-md shadow-moe-green/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-300" />
          <span>٢. معمل مقارنة الذرة بالأيون (المحاكاة)</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'quiz'
              ? 'bg-moe-blue text-white shadow-md shadow-moe-blue/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Award className="w-4 h-4 text-amber-300" />
          <span>٣. اختبار إتقان مهارة الأيونات</span>
        </button>
      </div>

      {/* ==================== TAB 1: CONCEPTS ==================== */}
      {activeTab === 'concept' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Comparison Cards: Neutral vs Cation vs Anion */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Neutral Atom */}
            <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                    شحنة متعادلة = 0
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                    <Atom className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-xl font-black text-moe-navy">
                  {ionsConcepts.neutralAtom.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed text-justify">
                  {ionsConcepts.neutralAtom.definition}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs text-slate-700 font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-500" />
                  <span>{ionsConcepts.neutralAtom.rule}</span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  مثال: ذرة الألمنيوم Al (العدد الذري 13) تحتوي على 13 إلكتروناً.
                </div>
              </div>
            </div>

            {/* Card 2: Positive Ion (Cation) */}
            <div className="bg-white rounded-3xl p-6 border-2 border-emerald-400 shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-moe-green text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                فقد إلكترونات (فلزات)
              </div>
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    شحنة موجبة (+n)
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-moe-green flex items-center justify-center">
                    <Plus className="w-6 h-6 stroke-[3]" />
                  </div>
                </div>
                <h3 className="text-xl font-black text-emerald-900">
                  {ionsConcepts.positiveIon.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed text-justify">
                  {ionsConcepts.positiveIon.definition}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-emerald-100 space-y-2">
                <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 text-xs text-emerald-900 font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-moe-green" />
                  <span>{ionsConcepts.positiveIon.rule}</span>
                </div>
                <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-[11px] text-amber-900 font-semibold leading-relaxed">
                  ⚠️ <strong>القاعدة الذهبية:</strong> {ionsConcepts.positiveIon.lossRule}
                </div>
              </div>
            </div>

            {/* Card 3: Negative Ion (Anion) */}
            <div className="bg-white rounded-3xl p-6 border-2 border-blue-400 shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-moe-blue text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                اكتساب إلكترونات (لافلزات)
              </div>
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-800 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                    شحنة سالبة (−n)
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-moe-blue flex items-center justify-center">
                    <Minus className="w-6 h-6 stroke-[3]" />
                  </div>
                </div>
                <h3 className="text-xl font-black text-blue-900">
                  {ionsConcepts.negativeIon.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed text-justify">
                  {ionsConcepts.negativeIon.definition}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-blue-100 space-y-2">
                <div className="bg-blue-50 p-3 rounded-2xl border border-blue-200 text-xs text-blue-900 font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-moe-blue" />
                  <span>{ionsConcepts.negativeIon.rule}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-700 font-semibold leading-relaxed">
                  💡 <strong>آلية الاكتساب:</strong> {ionsConcepts.negativeIon.gainRule}
                </div>
              </div>
            </div>

          </div>

          {/* Golden Rules Summary Callout */}
          <div className="bg-gradient-to-r from-moe-navy to-moe-navy-light text-white rounded-3xl p-6 sm:p-8 shadow-elevated">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-7 h-7 text-emerald-300" />
              </div>
              <div className="space-y-3">
                <h4 className="text-lg font-black text-white">
                  قواعد لا تُنسى في اختبارات الكيمياء والتحصيلي:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-200">
                  <div className="bg-white/10 p-3.5 rounded-xl border border-white/10">
                    <strong className="text-emerald-300 block mb-1">١. أيونات الفلزات الرئيسية (المجموعات 1، 2، 13):</strong>
                    تفقد جميع إلكترونات التكافؤ لتصبح مشابهة للغاز النبيل السابق:
                    <br />
                    Na⁺ (10e⁻) و Mg²⁺ (10e⁻) و Al³⁺ (10e⁻) جميعها تماثل غاز النيون [Ne].
                  </div>
                  <div className="bg-white/10 p-3.5 rounded-xl border border-white/10">
                    <strong className="text-cyan-300 block mb-1">٢. أيونات اللافلزات (المجموعات 15، 16، 17):</strong>
                    تكتسب إلكترونات لتكمل مستواها الخارجي إلى 8 إلكترونات:
                    <br />
                    Cl⁻ (18e⁻) يماثل غاز الآرجون [Ar]، و O²⁻ (10e⁻) يماثل غاز النيون [Ne].
                  </div>
                  <div className="bg-white/10 p-3.5 rounded-xl border border-white/10 md:col-span-2">
                    <strong className="text-amber-300 block mb-1">٣. الفلزات الانتقالية (مثل الحديد Fe):</strong>
                    القاعدة الذهبية: يُفقد إلكترونا المستوى 4s أولاً قبل 3d، لأن n=4 هو المستوى الرئيس الخارجي الأعلى طاقة مكانياً والأبعد عن النواة.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: INTERACTIVE SIMULATOR ==================== */}
      {activeTab === 'simulator' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Element Selector Pills */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-soft">
            <label className="block text-xs font-bold text-slate-500 mb-3 text-right">
              اختاري العنصر لدراسة تحوله إلى أيون:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
              {ionsExamples.map((item, idx) => {
                const isSelected = selectedExampleIndex === idx;
                const isPos = item.type === 'positive';
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedExampleIndex(idx);
                      setShowIonState(true);
                    }}
                    className={`p-3 rounded-2xl text-center border-2 transition-all flex flex-col items-center gap-1 ${
                      isSelected
                        ? isPos
                          ? 'border-moe-green bg-emerald-50 text-moe-green-dark shadow-sm scale-105'
                          : 'border-moe-blue bg-blue-50 text-moe-blue-dark shadow-sm scale-105'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className="text-base font-black font-mono">
                      {item.ionSymbol}
                    </span>
                    <span className="text-xs font-bold">{item.nameAr}</span>
                    <span className="text-[10px] text-slate-500 font-mono">Z = {item.z}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive State Toggle: Neutral vs Ion */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setShowIonState(false)}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border transition-all ${
                !showIonState
                  ? 'bg-slate-800 text-white border-slate-800 shadow-md'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              الذرة المتعادلة ({currentExample.elementSymbol})
            </button>
            <span className="text-slate-400 font-black">⟷</span>
            <button
              onClick={() => setShowIonState(true)}
              className={`px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border transition-all ${
                showIonState
                  ? currentExample.type === 'positive'
                    ? 'bg-moe-green text-white border-moe-green shadow-md shadow-moe-green/25'
                    : 'bg-moe-blue text-white border-moe-blue shadow-md shadow-moe-blue/25'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              الأيون ({currentExample.ionSymbol})
            </button>
          </div>

          {/* Display Card for Active State */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-elevated space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    showIonState
                      ? currentExample.type === 'positive'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'bg-slate-100 text-slate-800 border border-slate-300'
                  }`}>
                    {showIonState ? currentExample.ionNameAr : `الذرة المتعادلة (${currentExample.nameAr})`}
                  </span>
                  <span className="text-xs text-slate-500 font-bold">
                    العدد الذري: Z = {currentExample.z}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-moe-navy mt-1">
                  {showIonState ? currentExample.ionSymbol : currentExample.elementSymbol}
                </h3>
              </div>

              {/* Electron Count Metric */}
              <div className="flex items-center gap-4 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-200">
                <div className="text-center">
                  <span className="text-[10px] text-slate-500 font-bold block">البروتونات الموجبة</span>
                  <span className="text-lg font-black text-moe-navy font-mono">+{currentExample.z}</span>
                </div>
                <div className="w-px h-8 bg-slate-300" />
                <div className="text-center">
                  <span className="text-[10px] text-slate-500 font-bold block">الإلكترونات السالبة</span>
                  <span className="text-lg font-black text-moe-green font-mono">
                    {showIonState ? currentExample.ionElectrons : currentExample.neutralElectrons}
                  </span>
                </div>
                <div className="w-px h-8 bg-slate-300" />
                <div className="text-center">
                  <span className="text-[10px] text-slate-500 font-bold block">الشحنة الكلية</span>
                  <span className={`text-lg font-black font-mono ${
                    showIonState
                      ? currentExample.type === 'positive' ? 'text-emerald-600' : 'text-blue-600'
                      : 'text-slate-600'
                  }`}>
                    {showIonState ? (currentExample.type === 'positive' ? `+${currentExample.chargeNumber}` : `−${currentExample.chargeNumber}`) : '0'}
                  </span>
                </div>
              </div>
            </div>

            {/* Electron Configuration Comparison Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Neutral View */}
              <div className={`p-5 rounded-2xl border-2 transition-all ${
                !showIonState ? 'bg-slate-50 border-moe-navy' : 'bg-slate-50/50 border-slate-200 opacity-60'
              }`}>
                <div className="text-xs font-bold text-slate-500 mb-1">
                  توزيع الذرة المتعادلة ({currentExample.elementSymbol}):
                </div>
                <div className="font-mono text-base sm:text-lg font-black text-slate-800 tracking-wide dir-ltr text-left">
                  {currentExample.neutralConfig}
                </div>
                <div className="text-xs font-bold text-slate-400 mt-2 font-mono">
                  ترميز الغاز النبيل: {currentExample.neutralNoble}
                </div>
              </div>

              {/* Ion View */}
              <div className={`p-5 rounded-2xl border-2 transition-all ${
                showIonState 
                  ? currentExample.type === 'positive'
                    ? 'bg-emerald-50 border-moe-green'
                    : 'bg-blue-50 border-moe-blue'
                  : 'bg-slate-50/50 border-slate-200 opacity-60'
              }`}>
                <div className="text-xs font-bold text-slate-500 mb-1">
                  توزيع الأيون ({currentExample.ionSymbol}):
                </div>
                <div className="font-mono text-base sm:text-lg font-black text-moe-navy tracking-wide dir-ltr text-left">
                  {currentExample.ionConfig}
                </div>
                <div className="text-xs font-bold text-emerald-700 mt-2 font-mono flex items-center justify-between">
                  <span>ترميز الغاز النبيل: {currentExample.ionNoble}</span>
                  <span className="text-[11px] bg-white px-2 py-0.5 rounded border border-emerald-200">
                    مماثل لـ {currentExample.similarNobleGas}
                  </span>
                </div>
              </div>

            </div>

            {/* Scientific Explanation Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs sm:text-sm text-amber-950 space-y-2 leading-relaxed">
              <div className="flex items-center gap-2 font-black text-amber-900">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>التعليل العلمي لعملية التأين:</span>
              </div>
              <p className="text-justify font-medium">
                {currentExample.explanation}
              </p>
              {currentExample.type === 'positive' && (
                <div className="text-xs text-emerald-800 font-bold pt-1">
                  💡 موقع الفقد: {currentExample.lostFrom}
                </div>
              )}
              {currentExample.type === 'negative' && (
                <div className="text-xs text-blue-800 font-bold pt-1">
                  💡 موقع الاكتساب: {currentExample.gainedInto}
                </div>
              )}
              {currentExample.textbookRef && (
                <div className="text-[11px] font-mono text-slate-600 font-bold border-t border-amber-200/60 pt-2 flex items-center justify-between">
                  <span>مرجع كتاب كيمياء 1 (نظام المسارات):</span>
                  <span className="text-moe-navy font-bold bg-white px-2 py-0.5 rounded border border-amber-300">{currentExample.textbookRef}</span>
                </div>
              )}
            </div>

            {/* Orbital Visualization If Available */}
            {currentExample.orbitalsNeutral && (
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-slate-500 flex items-center justify-between">
                  <span>تمثيل المربعات المدارية لحالة {showIonState ? 'الأيون' : 'الذرة المتعادلة'}:</span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    {showIonState ? 'تأملي خلو أو امتلاء المدارات الخارجية' : 'تأملي إلكترونات التكافؤ قبل التأين'}
                  </span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 overflow-x-auto">
                  <OrbitalBoxVisualizer 
                    orbitalsData={showIonState ? currentExample.orbitalsIon : currentExample.orbitalsNeutral}
                  />
                </div>
              </div>
            )}

            {/* Action to Challenge */}
            <div className="pt-4 flex justify-end">
              <button
                onClick={onNavigateToChallenge}
                className="px-5 py-2.5 rounded-xl bg-moe-green hover:bg-moe-green-dark text-white font-bold text-xs shadow-md shadow-moe-green/20 flex items-center gap-2 transition-transform hover:scale-105"
              >
                <span>الانتقال لتحدي «خطأ نودّعه» لتصحيح أخطاء الأيونات</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ==================== TAB 3: QUIZ & PRACTICE ==================== */}
      {activeTab === 'quiz' && (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
          
          {/* Quiz Header with Score */}
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
            <div>
              <span className="text-xs font-bold text-slate-400">سؤال تدريبي:</span>
              <div className="text-sm font-black text-moe-navy">
                السؤال {quizIndex + 1} من {ionsPracticeQuiz.length}
              </div>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 px-4 py-1.5 rounded-xl border border-emerald-200">
              <Award className="w-4 h-4 text-moe-green" />
              <span className="text-xs font-black text-emerald-800">
                درجة الإتقان: {quizScore} / {ionsPracticeQuiz.length}
              </span>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-elevated space-y-6">
            
            <h3 className="text-lg sm:text-xl font-black text-moe-navy leading-relaxed text-right">
              {currentQuizQ.question}
            </h3>

            {/* Hint Callout */}
            <div className="bg-blue-50/60 p-3.5 rounded-2xl border border-blue-200/80 text-xs text-blue-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-moe-blue flex-shrink-0" />
              <span><strong>تلميح علمي:</strong> {currentQuizQ.hint}</span>
            </div>

            {/* Options List */}
            <div className="space-y-3">
              {currentQuizQ.options.map((opt, idx) => {
                const isSelected = selectedQuizOption === idx;
                let optionStyle = 'border-slate-200 hover:border-slate-300 bg-white text-slate-700';

                if (quizSubmitted) {
                  if (opt.isCorrect) {
                    optionStyle = 'border-moe-green bg-emerald-50 text-emerald-900 font-bold';
                  } else if (isSelected && !opt.isCorrect) {
                    optionStyle = 'border-rose-400 bg-rose-50 text-rose-900';
                  } else {
                    optionStyle = 'border-slate-200 bg-slate-50/50 text-slate-400';
                  }
                } else if (isSelected) {
                  optionStyle = 'border-moe-blue bg-blue-50 text-moe-blue font-bold shadow-xs';
                }

                return (
                  <button
                    key={idx}
                    disabled={quizSubmitted}
                    onClick={() => handleQuizAnswer(idx)}
                    className={`w-full p-4 rounded-2xl border-2 text-right transition-all flex items-center justify-between gap-4 ${optionStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold font-mono">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-sm font-mono dir-ltr text-left">
                        {opt.text}
                      </span>
                    </div>

                    {quizSubmitted && opt.isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-moe-green flex-shrink-0" />
                    )}
                    {quizSubmitted && isSelected && !opt.isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback on Submit */}
            {quizSubmitted && (
              <div className={`p-4 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed ${
                currentQuizQ.options[selectedQuizOption]?.isCorrect
                  ? 'bg-emerald-50 border border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border border-rose-300 text-rose-950'
              }`}>
                {currentQuizQ.options[selectedQuizOption]?.feedback}
              </div>
            )}

            {/* Navigation & Verify Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={handlePrevQuiz}
                disabled={quizIndex === 0}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:pointer-events-none"
              >
                السابق
              </button>

              {!quizSubmitted ? (
                <button
                  onClick={handleVerifyQuiz}
                  disabled={selectedQuizOption === null}
                  className="px-6 py-2.5 rounded-xl bg-moe-green hover:bg-moe-green-dark text-white font-bold text-xs shadow-md shadow-moe-green/20 disabled:opacity-40 disabled:pointer-events-none"
                >
                  تأكيد الإجابة
                </button>
              ) : (
                <button
                  onClick={handleNextQuiz}
                  className="px-6 py-2.5 rounded-xl bg-moe-navy hover:bg-moe-navy-light text-white font-bold text-xs shadow-md"
                >
                  {quizIndex < ionsPracticeQuiz.length - 1 ? 'السؤال التالي' : 'إعادة التدريب'}
                </button>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
