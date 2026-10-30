import React, { useState } from 'react';
import { 
  BookOpen, Sparkles, Layers, Zap, CheckCircle2, ArrowRight, ArrowLeft, 
  HelpCircle, AlertCircle, ArrowUp, ArrowDown, ChevronDown, ChevronUp, Plus, Minus, Atom,
  ShieldCheck, Award, FileText
} from 'lucide-react';
import { aufbauOrder, sublevelsInfo, textbookRules, textbookReference, methodsOfRepresentation } from '../data/chemistryData';
import OrbitalBoxVisualizer from './OrbitalBoxVisualizer';

export default function LearnSection({ onStartChallenge }) {
  const [activeTab, setActiveTab] = useState('ions_rule'); // 'ions_rule' | 'rules' | 'methods' | 'ladder' | 'sublevels' | 'exceptions' | 'examples'
  const [expandedExample, setExpandedExample] = useState(0);

  const solvedExamples = [
    {
      element: "الألومنيوم Al (Z=13) وأيونه Al³⁺",
      electrons: "13 للذرة، و 10 للأيون",
      config: "الذرة: 1s² 2s² 2p⁶ 3s² 3p¹ ⟵ الأيون Al³⁺: 1s² 2s² 2p⁶",
      noble: "Al: [Ne] 3s² 3p¹ ⟵ Al³⁺: [Ne]",
      textbookRef: "كتاب كيمياء 1، ص 85 الجدول 3-1، وص 115 سؤال 2",
      explanation: "عند تكوين الكاتيون Al³⁺، يفقد الألومنيوم إلكترونات غلاف التكافؤ الخارجي (المستوى الرئيس الثالث n=3 كاملاً: إلكترون 3p¹ أولاً ثم إلكتروني 3s²)، فيتبقى 10 إلكترونات ويكون مستواه الثاني مكتملاً بثمانية إلكترونات ومستقراً جداً مثل غاز النيون [Ne]."
    },
    {
      element: "الصوديوم Na (Z=11) وأيونه Na⁺",
      electrons: "11 للذرة، و 10 للأيون",
      config: "الذرة: 1s² 2s² 2p⁶ 3s¹ ⟵ الأيون Na⁺: 1s² 2s² 2p⁶",
      noble: "Na: [Ne] 3s¹ ⟵ Na⁺: [Ne]",
      textbookRef: "كتاب كيمياء 1، ص 84-85 الشكل 3-1",
      explanation: "تفقد ذرة الصوديوم إلكترون التكافؤ الوحيد الموجود في 3s¹ لتكوين أيون Na⁺ بشحنة +1، فيصبح التوزيع مماثلاً لغاز النيون الخامل المستقر، مع بقاء 11 بروتوناً موجباً داخل النواة دون تغيير."
    },
    {
      element: "الماغنسيوم Mg (Z=12) وأيونه Mg²⁺",
      electrons: "12 للذرة، و 10 للأيون",
      config: "الذرة: 1s² 2s² 2p⁶ 3s² ⟵ الأيون Mg²⁺: 1s² 2s² 2p⁶",
      noble: "Mg: [Ne] 3s² ⟵ Mg²⁺: [Ne]",
      textbookRef: "كتاب كيمياء 1، ص 85 الجدول 3-1",
      explanation: "تفقد ذرة الماغنسيوم إلكتروني المستوى الفرعي 3s لتصل إلى التوزيع الثماني المستقر 1s² 2s² 2p⁶ المشابه لغاز النيون، بشحنة ثنائية موجبة (+2)."
    },
    {
      element: "الكلور Cl (Z=17) وأيونه Cl⁻",
      electrons: "17 للذرة، و 18 للأيون",
      config: "الذرة: 1s² 2s² 2p⁶ 3s² 3p⁵ ⟵ الأيون Cl⁻: 1s² 2s² 2p⁶ 3s² 3p⁶",
      noble: "Cl: [Ne] 3s² 3p⁵ ⟵ Cl⁻: [Ar]",
      textbookRef: "كتاب كيمياء 1، ص 86 الشكل 3-3",
      explanation: "تكتسب ذرة الكلور إلكتروناً إضافياً في المستوى الفرعي الشاغر 3p ليكتمل من 5 إلى 6 إلكترونات (3p⁶)، محققةً التركيب الثماني لغاز الأرجون المستقر [Ar] مع انطلاق طاقة قدرها 349 kJ/mol."
    },
    {
      element: "الأكسجين O (Z=8) وأيونه O²⁻",
      electrons: "8 للذرة، و 10 للأيون",
      config: "الذرة: 1s² 2s² 2p⁴ ⟵ الأيون O²⁻: 1s² 2s² 2p⁶",
      noble: "O: [He] 2s² 2p⁴ ⟵ O²⁻: [Ne]",
      textbookRef: "كتاب كيمياء 1، ص 87",
      explanation: "تكتسب ذرة الأكسجين إلكترونين في المستوى الفرعي 2p ليكتمل بـ 6 إلكترونات، ويصبح التوزيع 1s² 2s² 2p⁶ مماثلاً لغاز النيون المستقر."
    },
    {
      element: "الحديد Fe (Z=26) وأيونه Fe²⁺ و Fe³⁺ (فلز انتقالي)",
      electrons: "26 للذرة، 24 لـ Fe²⁺، و 23 لـ Fe³⁺",
      config: "الذرة: [Ar] 4s² 3d⁶ ⟵ الأيون Fe²⁺: [Ar] 3d⁶ ⟵ Fe³⁺: [Ar] 3d⁵",
      noble: "Fe: [Ar] 4s² 3d⁶ ⟵ Fe²⁺: [Ar] 3d⁶",
      textbookRef: "كتاب كيمياء 1، ص 85، وص 109 سؤال 56",
      explanation: "القاعدة الحاسمة للفلزات الانتقالية في كتاب الطالب: الفقد يحدث أولاً من مستوى الطاقة الخارجي الأبعد عن النواة (n=4 وهو المستوى 4s) على الرغم من أن 4s ملئ قبل 3d في أوفباو. فيفقد إلكتروني 4s ليصبح [Ar] 3d⁶، ويفقد إلكتروناً إضافياً من 3d ليصبح Fe³⁺ بتوزيع [Ar] 3d⁵ المستقر بنصف الامتلاء."
    },
    {
      element: "الخارصين Zn (Z=30) وأيونه Zn²⁺ (توزيع شبيه بالغاز النبيل)",
      electrons: "30 للذرة، و 28 للأيون",
      config: "الذرة: [Ar] 4s² 3d¹⁰ ⟵ الأيون Zn²⁺: [Ar] 3d¹⁰",
      noble: "Zn²⁺: [Ar] 3d¹⁰ (Pseudo-Noble Gas)",
      textbookRef: "كتاب كيمياء 1، ص 86 الشكل 3-2",
      explanation: "تفقد ذرة الخارصين إلكتروني المستوى الخارجي 4s لتكوّن Zn²⁺ بتوزيع [Ar] 3d¹⁰ ذي مستويات s, p, d الممتلئة تماماً، ويُطلق عليه في كتاب الطالب 'التوزيع الإلكتروني الشبيه بالغاز النبيل'."
    },
    {
      element: "الكروم Cr (Z=24) - استثناء الاستقرارية",
      electrons: "24 إلكتروناً",
      config: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s¹ 3d⁵",
      noble: "[Ar] 4s¹ 3d⁵",
      textbookRef: "كتاب كيمياء 1، ص 36",
      explanation: "استثناء كيميائي مقرر في كتاب كيمياء 1 ص 36: ينتقل إلكترون من 4s إلى 3d ليكون كلاهما نصف ممتلئ (4s¹ 3d⁵)، مما يحقق تماثلاً فراغياً وطاقة وضع دنيا تعطي الذرة استقراراً فائقاً بدلاً من 4s² 3d⁴."
    },
    {
      element: "النحاس Cu (Z=29) - استثناء الامتلاء التام",
      electrons: "29 إلكتروناً",
      config: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s¹ 3d¹⁰",
      noble: "[Ar] 4s¹ 3d¹⁰",
      textbookRef: "كتاب كيمياء 1، ص 36",
      explanation: "استثناء كيميائي مقرر في كتاب كيمياء 1 ص 36: الامتلاء التام للمستوى الفرعي 3d بعشرة إلكترونات (3d¹⁰) يمنح الذرة استقراراً عظيماً يفوق بقاء 4s ممتلئاً، فينتقل إلكترون من 4s إلى 3d ليصبح [Ar] 4s¹ 3d¹⁰."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Title & Introduction */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <span className="text-xs font-bold text-moe-teal bg-moe-teal-tint px-3.5 py-1.5 rounded-full border border-moe-teal/20 inline-flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          <span>دليل التعلّم والشرح المنهجي المعتمد</span>
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-moe-navy">
          أساسيات وقواعد التوزيع الإلكتروني للذرات والأيونات
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
          مرجع علمي دقيق ومتوافق نصاً وتوثيقاً مع كتاب كيمياء 1 للتعليم الثانوي (نظام المسارات - وزارة التعليم)
        </p>
        <div className="inline-flex flex-wrap justify-center items-center gap-2 text-[11px] text-slate-500 font-semibold pt-1">
          <span className="bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">الفصل 1: الإلكترونات في الذرات (ص 32 - 47)</span>
          <span className="bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">الفصل 3: تكوّن الأيونات (ص 84 - 115)</span>
        </div>
      </div>

      {/* Learn Sub-navigation Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'ions_rule', label: 'توزيع الأيونات الموجبة والسالبة ⚡' },
          { id: 'rules', label: 'القواعد الكيميائية الثلاث (أوفباو، باولي، هوند)' },
          { id: 'methods', label: 'طرائق التمثيل ولويس ✏️' },
          { id: 'ladder', label: 'سلم أوفباو ومستويات الطاقة' },
          { id: 'sublevels', label: 'سعة وأشكال المستويات s, p, d, f' },
          { id: 'exceptions', label: 'استثناءات الاستقرارية (Cr & Cu)' },
          { id: 'examples', label: 'أمثلة محلولة متدرجة' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-moe-navy text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Ions Rules */}
      {activeTab === 'ions_rule' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Neutral */}
            <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2.5 py-0.5 rounded-full">
                  الذرة المتعادلة
                </span>
                <span className="text-[10px] text-slate-400 font-mono">كتاب كيمياء 1 ص 84</span>
              </div>
              <h4 className="text-base font-black text-moe-navy">عدد الإلكترونات = العدد الذري (Z)</h4>
              <p className="text-xs text-slate-600 leading-relaxed text-justify">
                عدد الإلكترونات السالبة المحيطة بالنواة يساوي تماماً عدد البروتونات الموجبة داخل النواة. الشحنة الكلية = 0.
              </p>
              <div className="text-[11px] font-mono text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                Al: e⁻ = 13 | 1s² 2s² 2p⁶ 3s² 3p¹
              </div>
            </div>

            {/* 2. Positive Ion */}
            <div className="bg-white p-5 rounded-3xl border-2 border-emerald-300 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                  الكاتيون (الأيون الموجب)
                </span>
                <span className="text-[10px] text-emerald-600 font-mono">كتاب كيمياء 1 ص 84-85</span>
              </div>
              <h4 className="text-base font-black text-emerald-900">فقد الإلكترونات (Z − الشحنة)</h4>
              <p className="text-xs text-slate-600 leading-relaxed text-justify">
                <strong>القاعدة الذهبية:</strong> تفقد الذرة إلكتروناتها من <strong>أعلى مستوى طاقة رئيسي (n الأكبر) أولاً</strong> للوصول إلى تركيب الغاز النبيل المستقر.
              </p>
              <div className="text-[11px] font-mono text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                Al³⁺: e⁻ = 10 | 1s² 2s² 2p⁶ [Ne]
              </div>
            </div>

            {/* 3. Negative Ion */}
            <div className="bg-white p-5 rounded-3xl border-2 border-blue-300 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full">
                  الأنيون (الأيون السالب)
                </span>
                <span className="text-[10px] text-blue-600 font-mono">كتاب كيمياء 1 ص 86</span>
              </div>
              <h4 className="text-base font-black text-blue-900">اكتساب الإلكترونات (Z + الشحنة)</h4>
              <p className="text-xs text-slate-600 leading-relaxed text-justify">
                تكتسب الذرة إلكترونات في المستويات الفرعية الشاغرة الأدنى طاقة وفق أوفباو لإكمال الغلاف الخارجي إلى 8 إلكترونات (قاعدة الثمانيات)، ويُضاف المقطع (يد) لاسم العنصر.
              </p>
              <div className="text-[11px] font-mono text-blue-800 bg-blue-50 p-2.5 rounded-xl border border-blue-200">
                Cl⁻: e⁻ = 18 | [Ne] 3s² 3p⁶ [Ar]
              </div>
            </div>
          </div>

          {/* Transition Metals & Pseudo-Noble Note */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-2 leading-relaxed">
              <div className="flex items-center gap-2 font-black text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>تنبيه منهجي فائق الأهمية (الفلزات الانتقالية ص 85):</span>
              </div>
              <p className="text-justify font-medium">
                في عناصر الفئة d مثل الحديد Fe: [Ar] 4s² 3d⁶، عند تكوين الأيون الموجب Fe²⁺ يُفقد إلكترونا المستوى 4s أولاً قبل 3d ليصبح [Ar] 3d⁶، لأن n=4 هو المستوى الرئيسي الأبعد عن النواة. وعند تكوين Fe³⁺ يُفقد إلكترون إضافي من 3d ليصبح [Ar] 3d⁵ المستقر بنصف الامتلاء.
              </p>
            </div>

            <div className="bg-purple-50 p-5 rounded-2xl border border-purple-200 text-xs text-purple-950 space-y-2 leading-relaxed">
              <div className="flex items-center gap-2 font-black text-purple-900">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>التوزيع الشبيه بالغاز النبيل (الخارصين ص 86):</span>
              </div>
              <p className="text-justify font-medium">
                ينص كتاب كيمياء 1 ص 86 (الشكل 3-2) على أن ذرة الخارصين Zn: [Ar] 4s² 3d¹⁰ تفقد إلكتروني 4s لينتج Zn²⁺: [Ar] 3d¹⁰ ذو المستويات s, p, d الممتلئة تماماً بالإلكترونات، وهو ما يُعرف في المنهج بـ (التوزيع الإلكتروني الشبيه بالغاز النبيل).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: The Three Core Principles */}
      {activeTab === 'rules' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Rule 1: Aufbau */}
            <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-moe-green shadow-soft flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-moe-green flex items-center justify-center font-black text-base">
                    1
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">كتاب كيمياء 1 ص 32</span>
                </div>
                <h3 className="text-lg font-black text-moe-navy">
                  مبدأ أوفباو (البناء التصاعدي)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed text-justify">
                  ينص على أن <strong>كل إلكترون يشغل المستوى الأقل طاقة المتوفر أولاً</strong>.
                </p>
                <p className="text-[11px] text-slate-500 italic">
                  أصل الكلمة: من الألمانية aufbauen وتعني "يهيئ أو يرتب".
                </p>
              </div>
              <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 font-bold">
                تطبيق: ملء 4s قبل 3d لأن طاقة 4s أقل من 3d
              </div>
            </div>

            {/* Rule 2: Pauli */}
            <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-moe-teal shadow-soft flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-moe-teal flex items-center justify-center font-black text-base">
                    2
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">كتاب كيمياء 1 ص 33</span>
                </div>
                <h3 className="text-lg font-black text-moe-navy">
                  مبدأ باولي للاستبعاد
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed text-justify">
                  ينص على أن <strong>عدد إلكترونات المستوى الفرعي الواحد لا يزيد عن إلكترونين فقط</strong>، ويدور كل منهما حول نفسه باتجاه معاكس للآخر (غزل متعاكس: ↑↓).
                </p>
                <p className="text-[11px] text-slate-500">
                  الحد الأقصى للإلكترونات في أي مستوى رئيسي يساوي 2n².
                </p>
              </div>
              <div className="mt-4 p-3 bg-teal-50 rounded-xl border border-teal-200 text-[11px] text-teal-800 font-bold">
                تطبيق: سعة أي مستوى فرعي هي 2 إلكترون كحد أقصى بغزل متعاكس
              </div>
            </div>

            {/* Rule 3: Hund */}
            <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-moe-blue shadow-soft flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-moe-blue flex items-center justify-center font-black text-base">
                    3
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">كتاب كيمياء 1 ص 33</span>
                </div>
                <h3 className="text-lg font-black text-moe-navy">
                  قاعدة هوند
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed text-justify">
                  تنص على أن <strong>الإلكترونات تتوزع في المستويات الفرعية المتساوية الطاقة بحيث تحافظ على أن يكون لها الاتجاه نفسه من حيث الدوران</strong> قبل أن تبدأ بالازدواج.
                </p>
                <p className="text-[11px] text-slate-500">
                  السبب: تقليل قوى التنافر الكهربائي بين الإلكترونات سالبة الشحنة.
                </p>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200 text-[11px] text-blue-800 font-bold">
                تطبيق: في مستويات 2p الثلاثة نضع (↑ ↑ ↑) أولاً قبل حدوث الازدواج
              </div>
            </div>

          </div>

          {/* Table 1-5 properties from textbook */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-black text-moe-navy flex items-center gap-2">
                <FileText className="w-4 h-4 text-moe-teal" />
                <span>الجدول 1-5: خواص رسم أوفباو (كتاب كيمياء 1، ص 33)</span>
              </h4>
              <span className="text-xs text-slate-400 font-mono">نص نظامي من الكتاب</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {textbookRules.aufbau.tableProperties.map(prop => (
                <div key={prop.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-moe-navy text-white flex items-center justify-center text-[10px]">{prop.id}</span>
                    <span>{prop.text}</span>
                  </div>
                  <div className="text-slate-600 text-[11px] pr-6">
                    <strong className="text-moe-teal font-semibold">مثال الكتاب:</strong> {prop.example}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Methods of Representation & Lewis Dot Structure */}
      {activeTab === 'methods' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {methodsOfRepresentation.map((method, idx) => (
              <div key={method.id} className="bg-white p-5 rounded-3xl border-2 border-slate-200 hover:border-moe-teal transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-teal-100 text-moe-teal flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">ص {method.bookPage}</span>
                </div>
                <h4 className="text-base font-black text-moe-navy">{method.nameAr}</h4>
                <p className="text-xs text-slate-600 leading-relaxed text-justify">
                  {method.description}
                </p>
              </div>
            ))}
          </div>

          {/* Lewis Dot Structure (ص 37) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base sm:text-lg font-black text-moe-navy flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>التمثيل النقطي للإلكترونات — تمثيل لويس (كتاب كيمياء 1، ص 37)</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">Lewis (1902م)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify">
              {textbookRules.lewisStructure.bookDefinition}
            </p>
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <strong>قاعدة كتاب الطالب في وضع النقط:</strong>
              <p>{textbookRules.lewisStructure.rule}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 pt-2 text-center text-xs">
              {[
                { s: "Li", n: "1s² 2s¹", d: "•Li" },
                { s: "Be", n: "1s² 2s²", d: "•Be•" },
                { s: "B", n: "1s² 2s² 2p¹", d: "•B:•" },
                { s: "C", n: "1s² 2s² 2p²", d: "•:C:•" },
                { s: "N", n: "1s² 2s² 2p³", d: "•:N:•" },
                { s: "O", n: "1s² 2s² 2p⁴", d: ":O:••" },
                { s: "F", n: "1s² 2s² 2p⁵", d: ":F:•••" },
                { s: "Ne", n: "1s² 2s² 2p⁶", d: "::Ne::" },
              ].map(item => (
                <div key={item.s} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="font-bold text-moe-navy">{item.s}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{item.n}</div>
                  <div className="text-xs font-mono font-black text-moe-teal mt-1">{item.d}</div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 text-center">الجدول 1-8: التوزيع الإلكتروني والتمثيل النقطي لعناصر الدورة الثانية (كتاب كيمياء 1 ص 37)</p>
          </div>
        </div>
      )}

      {/* Tab 2: Energy Ladder */}
      {activeTab === 'ladder' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6 animate-in fade-in duration-300">
          <div className="text-right space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-moe-navy">
                تسلسل سلم أوفباو لمستويات الطاقة
              </h3>
              <span className="text-xs text-slate-400 font-mono">الشكل 1-17 والشكل 1-23 بكتاب كيمياء 1</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              تتبع الإلكترونات مسار الأسهم القطرية في التعبئة وفق تزايد الطاقة من الأقل إلى الأعلى. لاحظي أن المستوى الفرعي 4s يسبق 3d دائماً في التعبئة لأن طاقته أقل:
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 justify-center py-4 bg-slate-50 rounded-2xl border border-slate-200 p-4">
            {aufbauOrder.slice(0, 10).map((subName, idx) => {
              const type = subName.replace(/[0-9]/g, '');
              const max = type === 's' ? 2 : type === 'p' ? 6 : type === 'd' ? 10 : 14;
              return (
                <React.Fragment key={subName}>
                  <div className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 shadow-xs ${
                    type === 's' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                    type === 'p' ? 'bg-blue-100 text-blue-900 border border-blue-300' :
                    type === 'd' ? 'bg-purple-100 text-purple-900 border border-purple-300' :
                    'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}>
                    <span className="font-black text-sm">{subName}</span>
                    <span className="text-[10px] opacity-75 font-normal">({max}e⁻)</span>
                  </div>
                  {idx < 9 && <span className="text-slate-400 font-black">←</span>}
                </React.Fragment>
              );
            })}
          </div>
          <div className="text-center text-xs text-slate-500 font-mono">
            التسلسل الكامل: 1s ← 2s ← 2p ← 3s ← 3p ← 4s ← 3d ← 4p ← 5s ← 4d ← 5p ← 6s ← 4f ← 5d ← 6p ← 7s ← 5f ← 6d ← 7p
          </div>
        </div>
      )}

      {/* Tab 3: Sublevels */}
      {activeTab === 'sublevels' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-300">
          {Object.entries(sublevelsInfo).map(([key, info]) => (
            <div key={key} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-soft space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black font-mono text-moe-navy uppercase">{key}</span>
                <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-bold">
                  {info.maxElectrons} إلكترونات
                </span>
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <div><strong>عدد المستويات الفرعية:</strong> {info.orbitals || info.orbitalsCount}</div>
                <div><strong>الشكل الفراغي في الكتاب:</strong> {info.shape}</div>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed border-t border-slate-100 pt-2">
                كتاب كيمياء 1: يتسع كل مستوى فرعي لإلكترونين كحد أقصى وفق مبدأ باولي.
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Exceptions */}
      {activeTab === 'exceptions' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Chromium */}
            <div className="bg-white rounded-3xl p-6 border-2 border-purple-200 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs bg-purple-100 text-purple-800 font-bold px-3 py-1 rounded-full">
                  استثناء نصف الامتلاء (d⁵)
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">كتاب كيمياء 1 ص 36</span>
              </div>
              <h3 className="text-xl font-black text-moe-navy">الكروم Cr (Z = 24)</h3>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-rose-50 text-rose-900 rounded-xl border border-rose-200 font-mono">
                  ❌ المتوقع نظرياً: [Ar] 4s² 3d⁴ (غير مستقر)
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200 font-mono font-bold">
                  ✓ التوزيع الفعلي: [Ar] 4s¹ 3d⁵ (مستقر جداً)
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed text-justify">
                ينص كتاب كيمياء 1 ص 36 على أن انتقال إلكترون من 4s إلى 3d يجعل كلا المستويين نصف ممتلئين، مما يمنح الذرة تماثلاً فراغياً أعلى ويقلل طاقة الوضع إلى حدها الأدنى.
              </p>
            </div>

            {/* Copper */}
            <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full">
                  استثناء الامتلاء التام (d¹⁰)
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">كتاب كيمياء 1 ص 36</span>
              </div>
              <h3 className="text-xl font-black text-moe-navy">النحاس Cu (Z = 29)</h3>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-rose-50 text-rose-900 rounded-xl border border-rose-200 font-mono">
                  ❌ المتوقع نظرياً: [Ar] 4s² 3d⁹ (غير مستقر)
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200 font-mono font-bold">
                  ✓ التوزيع الفعلي: [Ar] 4s¹ 3d¹⁰ (مستقر جداً)
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed text-justify">
                الامتلاء التام للمستوى الفرعي 3d بعشرة إلكترونات (3d¹⁰) يمنح الذرة ثباتاً فائقاً وتماثلاً كروياً يقلل التنافر الكهربائي، فينتقل إلكترون من 4s إلى 3d ليعطي التوزيع الأكثر استقراراً في الطبيعة.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* Tab 5: Solved Examples */}
      {activeTab === 'examples' && (
        <div className="space-y-3 animate-in fade-in duration-300">
          {solvedExamples.map((ex, idx) => {
            const isExpanded = expandedExample === idx;
            return (
              <div 
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all"
              >
                <div 
                  onClick={() => setExpandedExample(isExpanded ? null : idx)}
                  className="p-4 sm:px-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs font-mono">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-bold text-moe-navy">
                      مثال: {ex.element}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-moe-green hidden sm:inline">
                      {ex.noble}
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 space-y-4 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>مرجع المسألة:</span>
                      <span className="text-moe-teal font-bold">{ex.textbookRef}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <span className="text-slate-400 font-bold block mb-1">الصيغة الإلكترونية:</span>
                        <span className="font-mono text-sm font-bold text-slate-800">{ex.config}</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <span className="text-slate-400 font-bold block mb-1">صيغة الغاز النبيل:</span>
                        <span className="font-mono text-sm font-bold text-moe-teal">{ex.noble}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
                      <strong className="text-moe-navy block mb-1 font-bold">الشرح والتحليل العلمي:</strong>
                      {ex.explanation}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* CTA to start Error Challenge */}
      <div className="bg-moe-green-tint border border-moe-green/30 rounded-3xl p-6 text-center space-y-3">
        <h4 className="text-base font-extrabold text-moe-green-dark">
          هل استوعبتِ القواعد المنهجية جيداً؟ حان وقت التطبيق في «خطأ نودّعه»!
        </h4>
        <p className="text-xs text-slate-600 max-w-xl mx-auto">
          اختبري قدرتكِ على نقد التوزيعات واكتشاف الأخطاء التي تقع فيها الطالبات عادة في الاختبارات والمسائل المنهجية
        </p>
        <button
          onClick={onStartChallenge}
          className="px-6 py-2.5 rounded-xl bg-moe-green hover:bg-moe-green-dark text-white font-bold text-xs shadow-md shadow-moe-green/20 transition-all hover:scale-105"
        >
          الانتقال إلى تحدي «خطأ نودّعه»
        </button>
      </div>

    </div>
  );
}
