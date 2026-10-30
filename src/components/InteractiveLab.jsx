import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, CheckCircle2, RotateCcw, AlertCircle, Lightbulb, 
  HelpCircle, ChevronLeft, ChevronRight, Plus, Minus, Atom, Zap 
} from 'lucide-react';
import { elementsData, aufbauOrder } from '../data/chemistryData';
import OrbitalBoxVisualizer from './OrbitalBoxVisualizer';

// Known common ions for elements in the lab
const commonIonsMap = {
  7: { symbol: "N³⁻", charge: "-3", eDiff: +3, name: "أيون النيتريد", rule: "اكتساب 3 إلكترونات في 2p (كتاب كيمياء 1 ص 86)" },
  8: { symbol: "O²⁻", charge: "-2", eDiff: +2, name: "أيون الأكسيد", rule: "اكتساب إلكترونين في 2p (كتاب كيمياء 1 ص 87)" },
  9: { symbol: "F⁻", charge: "-1", eDiff: +1, name: "أيون الفلوريد", rule: "اكتساب إلكترون في 2p" },
  11: { symbol: "Na⁺", charge: "+1", eDiff: -1, name: "أيون الصوديوم", rule: "فقد إلكترون 3s¹ (كتاب كيمياء 1 ص 84-85)" },
  12: { symbol: "Mg²⁺", charge: "+2", eDiff: -2, name: "أيون الماغنسيوم", rule: "فقد إلكتروني 3s² (كتاب كيمياء 1 ص 85)" },
  13: { symbol: "Al³⁺", charge: "+3", eDiff: -3, name: "أيون الألومنيوم", rule: "فقد إلكترون 3p¹ ثم إلكتروني 3s² (كتاب كيمياء 1 ص 85)" },
  15: { symbol: "P³⁻", charge: "-3", eDiff: +3, name: "أيون الفوسفيد", rule: "اكتساب 3 إلكترونات في 3p (كتاب كيمياء 1 ص 87)" },
  16: { symbol: "S²⁻", charge: "-2", eDiff: +2, name: "أيون الكبريتيد", rule: "اكتساب إلكترونين في 3p (كتاب كيمياء 1 ص 87)" },
  17: { symbol: "Cl⁻", charge: "-1", eDiff: +1, name: "أيون الكلوريد", rule: "اكتساب إلكترون في 3p (كتاب كيمياء 1 ص 86)" },
  19: { symbol: "K⁺", charge: "+1", eDiff: -1, name: "أيون البوتاسيوم", rule: "فقد إلكترون 4s¹ (كتاب كيمياء 1 ص 85)" },
  20: { symbol: "Ca²⁺", charge: "+2", eDiff: -2, name: "أيون الكالسيوم", rule: "فقد إلكتروني 4s² (كتاب كيمياء 1 ص 87)" },
  26: { symbol: "Fe²⁺", charge: "+2", eDiff: -2, name: "أيون الحديدوز", rule: "فقد إلكتروني 4s² أولاً قبل 3d (كتاب كيمياء 1 ص 85)" },
  30: { symbol: "Zn²⁺", charge: "+2", eDiff: -2, name: "أيون الخارصين", rule: "فقد إلكتروني 4s² ليبقى [Ar] 3d¹⁰ شبيه الغاز النبيل (كتاب كيمياء 1 ص 86)" }
};
const ionConfigurationHints = {
  7: '1s² 2s² 2p⁶', 8: '1s² 2s² 2p⁶', 9: '1s² 2s² 2p⁶', 11: '1s² 2s² 2p⁶',
  12: '1s² 2s² 2p⁶', 13: '1s² 2s² 2p⁶', 15: '[Ne] 3s² 3p⁶', 16: '[Ne] 3s² 3p⁶',
  17: '[Ne] 3s² 3p⁶', 19: '[Ar]', 20: '[Ar]', 26: '[Ar] 3d⁶', 30: '[Ar] 3d¹⁰'
};

export default function InteractiveLab() {
  const [selectedZ, setSelectedZ] = useState(13); // Default to Aluminium (Al, Z=13)
  const [isIonMode, setIsIonMode] = useState(true);
  const [currentConfig, setCurrentConfig] = useState({
    "1s": 0, "2s": 0, "2p": 0, "3s": 0, "3p": 0, "4s": 0, "3d": 0, "4p": 0
  });
  const [validationResult, setValidationResult] = useState(null); // { valid: bool, message: string, hint: string }
  const [hintRequested, setHintRequested] = useState(false);

  const element = elementsData.find(e => e.z === selectedZ) || elementsData[12];
  const ionInfo = commonIonsMap[selectedZ];

  const targetElectrons = isIonMode && ionInfo 
    ? element.z + ionInfo.eDiff 
    : element.z;

  // Reset student configuration when element or mode changes
  useEffect(() => {
    handleReset();
  }, [selectedZ, isIonMode]);

  const handleReset = () => {
    setCurrentConfig({
      "1s": 0, "2s": 0, "2p": 0, "3s": 0, "3p": 0, "4s": 0, "3d": 0, "4p": 0
    });
    setValidationResult(null);
    setHintRequested(false);
  };

  const handleAddElectron = (sublevel, max) => {
    if (currentConfig[sublevel] < max) {
      setCurrentConfig(prev => ({ ...prev, [sublevel]: prev[sublevel] + 1 }));
      setValidationResult(null);
    }
  };

  const handleRemoveElectron = (sublevel) => {
    if (currentConfig[sublevel] > 0) {
      setCurrentConfig(prev => ({ ...prev, [sublevel]: prev[sublevel] - 1 }));
      setValidationResult(null);
    }
  };

  // Calculate current total electrons placed by student
  const totalPlaced = Object.values(currentConfig).reduce((a, b) => a + b, 0);

  // Validate the configuration scientifically
  const handleVerify = () => {
    // 1. Check total electrons
    if (totalPlaced !== targetElectrons) {
      setValidationResult({
        valid: false,
        message: `عدد الإلكترونات الموضوعة (${totalPlaced}) لا يساوي العدد المطلوب (${targetElectrons}).`,
        hint: isIonMode
          ? `في ${ionInfo.name} (${ionInfo.symbol}) تغير عدد الإلكترونات بسبب الشحنة (${ionInfo.charge}) ليصبح ${targetElectrons} إلكتروناً.`
          : `تحتاجين إلى وضع ${element.z} إلكتروناً بالضبط في الذرة المتعادلة.`
      });
      return;
    }

    // 2. Ion Mode Specific Verifications
    if (isIonMode && ionInfo) {
      if (selectedZ === 13) { // Al3+
        if (currentConfig["1s"] === 2 && currentConfig["2s"] === 2 && currentConfig["2p"] === 6 && currentConfig["3s"] === 0 && currentConfig["3p"] === 0) {
          setValidationResult({
            valid: true,
            message: `إتقان ممتاز! توزيع أيون الألمنيوم Al³⁺ صحيح تماماً (1s² 2s² 2p⁶) بفقد 3 إلكترونات من المستوى الثالث بالكامل ليماثل غاز النيون [Ne]! 🎉`,
            hint: null
          });
          triggerCelebration();
          return;
        } else {
          setValidationResult({
            valid: false,
            message: "تأكدي من فقد الإلكترونات من المستوى الثالث الخارجي n=3 (3p ثم 3s) كاملاً لتصل الذرة للتركيب الثماني المستقر 1s² 2s² 2p⁶.",
            hint: "يجب أن تفرغ مدارات 3p و 3s بالكامل."
          });
          return;
        }
      }

      if (selectedZ === 11) { // Na+
        if (currentConfig["1s"] === 2 && currentConfig["2s"] === 2 && currentConfig["2p"] === 6 && currentConfig["3s"] === 0) {
          setValidationResult({
            valid: true,
            message: `صحيح تماماً! أيون الصوديوم Na⁺ فقد إلكترون 3s¹ ليصبح 1s² 2s² 2p⁶ شبيهاً بالغاز النبيل النيون! 🎉`,
            hint: null
          });
          triggerCelebration();
          return;
        }
      }

      if (selectedZ === 12) { // Mg2+
        if (currentConfig["1s"] === 2 && currentConfig["2s"] === 2 && currentConfig["2p"] === 6 && currentConfig["3s"] === 0) {
          setValidationResult({
            valid: true,
            message: `رائع جداً! أيون المغنيسيوم Mg²⁺ فقد إلكتروني 3s² ليصبح 1s² 2s² 2p⁶ ومستقراً ثمانياً! 🎉`,
            hint: null
          });
          triggerCelebration();
          return;
        }
      }

      if (selectedZ === 17) { // Cl-
        if (currentConfig["1s"] === 2 && currentConfig["2s"] === 2 && currentConfig["2p"] === 6 && currentConfig["3s"] === 2 && currentConfig["3p"] === 6) {
          setValidationResult({
            valid: true,
            message: `إتقان مبهر! أيون الكلوريد Cl⁻ اكتسب إلكتروناً في 3p ليكتمل بـ 6 إلكترونات (3p⁶) محققاً توزيع غاز الآرجون [Ar]! 🎉`,
            hint: null
          });
          triggerCelebration();
          return;
        }
      }

      if (selectedZ === 8) { // O2-
        if (currentConfig["1s"] === 2 && currentConfig["2s"] === 2 && currentConfig["2p"] === 6) {
          setValidationResult({
            valid: true,
            message: `ممتاز جداً! أيون الأكسيد O²⁻ اكتسب إلكترونين في 2p ليكتمل بـ 6 إلكترونات 1s² 2s² 2p⁶! 🎉`,
            hint: null
          });
          triggerCelebration();
          return;
        }
      }

      if (selectedZ === 26) { // Fe2+
        if (currentConfig["4s"] === 0 && currentConfig["3d"] === 6 && currentConfig["1s"] === 2 && currentConfig["2s"] === 2 && currentConfig["2p"] === 6 && currentConfig["3s"] === 2 && currentConfig["3p"] === 6) {
          setValidationResult({
            valid: true,
            message: `بصيرة علمية استثنائية! راعيتِ قاعدة فقد الإلكترونات من المستوى الخارجي 4s أولاً قبل 3d في أيون الحديدوز Fe²⁺ [Ar] 3d⁶! 🌟`,
            hint: null
          });
          triggerCelebration();
          return;
        } else {
          setValidationResult({
            valid: false,
            message: "تذكري في أيونات الفلزات الانتقالية (كتاب كيمياء 1 ص 85): يُفقد إلكترونا 4s أولاً قبل 3d!",
            hint: "المستوى 4s يجب أن يكون فارغاً (0)، وتبقى إلكترونات 3d الستة."
          });
          return;
        }
      }

      if (selectedZ === 30) { // Zn2+ (Pseudo-noble gas)
        if (currentConfig["4s"] === 0 && currentConfig["3d"] === 10 && currentConfig["1s"] === 2 && currentConfig["2s"] === 2 && currentConfig["2p"] === 6 && currentConfig["3s"] === 2 && currentConfig["3p"] === 6) {
          setValidationResult({
            valid: true,
            message: `إتقان باهر! توزيع أيون الخارصين Zn²⁺ صحيح تماماً: [Ar] 3d¹⁰، وهو التوزيع الشبيه بالغاز النبيل الوارد في كتاب كيمياء 1 ص 86 الشكل 3-2! 🌟`,
            hint: null
          });
          triggerCelebration();
          return;
        } else {
          setValidationResult({
            valid: false,
            message: "في أيون الخارصين Zn²⁺، تفقد الذرة إلكتروني 4s ويبقى 3d ممتلئاً تماماً بعشرة إلكترونات (3d¹⁰).",
            hint: "المستوى 4s يكون 0 و 3d يكون 10."
          });
          return;
        }
      }

      if (selectedZ === 7) { // N3-
        if (currentConfig["1s"] === 2 && currentConfig["2s"] === 2 && currentConfig["2p"] === 6) {
          setValidationResult({
            valid: true,
            message: `رائع جداً! أيون النيتريد N³⁻ اكتسب 3 إلكترونات في 2p ليكتمل بـ 6 إلكترونات (1s² 2s² 2p⁶) مطابقاً لغاز النيون (كتاب كيمياء 1 ص 86)! 🎉`,
            hint: null
          });
          triggerCelebration();
          return;
        }
      }

      if (selectedZ === 16) { // S2-
        if (currentConfig["1s"] === 2 && currentConfig["2s"] === 2 && currentConfig["2p"] === 6 && currentConfig["3s"] === 2 && currentConfig["3p"] === 6) {
          setValidationResult({
            valid: true,
            message: `ممتاز! أيون الكبريتيد S²⁻ اكتسب إلكترونين في 3p ليكتمل بثمانية إلكترونات تكافؤ (3s² 3p⁶) مطابقة لغاز الأرجون (كتاب كيمياء 1 ص 87)! 🎉`,
            hint: null
          });
          triggerCelebration();
          return;
        }
      }
    }

    // 3. Check for Chromium Exception (Cr, Z=24) in neutral
    if (element.z === 24 && !isIonMode) {
      if (currentConfig["4s"] === 2 && currentConfig["3d"] === 4) {
        setValidationResult({
          valid: false,
          message: "اقتربتِ جداً! لكن الكروم يمتلك استثناءً كيميائياً شهيراً في الاستقرار.",
          hint: "تذكري: ذرة الكروم تفضل أن يكون كلا المجالين 4s و 3d نصف ممتلئين (4s¹ 3d⁵) لتكون أقل طاقة وأكثر استقراراً."
        });
        return;
      }
      if (currentConfig["4s"] === 1 && currentConfig["3d"] === 5 && currentConfig["1s"] === 2 && currentConfig["2s"] === 2 && currentConfig["2p"] === 6 && currentConfig["3s"] === 2 && currentConfig["3p"] === 6) {
        setValidationResult({
          valid: true,
          message: "ممتاز رائع! راعيتِ استثناء استقرار نصف الامتلاء للكروم بدقة فائقة!",
          hint: null
        });
        triggerCelebration();
        return;
      }
    }

    // 4. Check for Copper Exception (Cu, Z=29) in neutral
    if (element.z === 29 && !isIonMode) {
      if (currentConfig["4s"] === 2 && currentConfig["3d"] === 9) {
        setValidationResult({
          valid: false,
          message: "توزيع قريب جداً، لكن النحاس له استثناء في اكتمال المجال d.",
          hint: "تذكري: الامتلاء التام للمجال 3d بعشرة إلكترونات (3d¹⁰) يمنح النحاس ثباتاً فائقاً، فيصبح 4s¹ 3d¹⁰."
        });
        return;
      }
      if (currentConfig["4s"] === 1 && currentConfig["3d"] === 10 && currentConfig["1s"] === 2 && currentConfig["2s"] === 2 && currentConfig["2p"] === 6 && currentConfig["3s"] === 2 && currentConfig["3p"] === 6) {
        setValidationResult({
          valid: true,
          message: "إتقان مبهر! راعيتِ استثناء الامتلاء التام لذرة النحاس [Ar] 4s¹ 3d¹⁰!",
          hint: null
        });
        triggerCelebration();
        return;
      }
    }

    // 5. Check Aufbau Principle order for normal elements
    const slots = [
      { key: "1s", max: 2 },
      { key: "2s", max: 2 },
      { key: "2p", max: 6 },
      { key: "3s", max: 2 },
      { key: "3p", max: 6 },
      { key: "4s", max: 2 },
      { key: "3d", max: 10 },
      { key: "4p", max: 6 },
    ];

    let remaining = targetElectrons;
    let isPerfectAufbau = true;
    let failedSlot = "";

    for (let slot of slots) {
      const expected = Math.min(remaining, slot.max);
      if (currentConfig[slot.key] !== expected) {
        isPerfectAufbau = false;
        failedSlot = slot.key;
        break;
      }
      remaining -= expected;
      if (remaining <= 0) break;
    }

    if (isPerfectAufbau) {
      setValidationResult({
        valid: true,
        message: `توزيع إلكتروني سليم وصحيح تماماً لعنصر ${element.nameAr} (${isIonMode ? ionInfo.symbol : element.symbol})! 🎉`,
        hint: null
      });
      triggerCelebration();
    } else {
      setValidationResult({
        valid: false,
        message: `يوجد خطأ في ترتيب ملء المجالات وفق مبدأ أوفباو. تأكدي من ملء المجالات الأقل طاقة أولاً قبل فتح مجالات جديدة.`,
        hint: `راجعي سعة المجال ومسار الطاقة التصاعدي (1s ← 2s ← 2p ← 3s ← 3p...).`
      });
    }
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  const sublevelSlots = [
    { key: "1s", name: "1s", max: 2, level: "n=1" },
    { key: "2s", name: "2s", max: 2, level: "n=2" },
    { key: "2p", name: "2p", max: 6, level: "n=2" },
    { key: "3s", name: "3s", max: 2, level: "n=3" },
    { key: "3p", name: "3p", max: 6, level: "n=3" },
    { key: "4s", name: "4s", max: 2, level: "n=4" },
    { key: "3d", name: "3d", max: 10, level: "n=3" },
    { key: "4p", name: "4p", max: 6, level: "n=4" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-moe-teal bg-moe-teal-tint px-3 py-1 rounded-full border border-moe-teal/20">
            مختبر التوزيع العملي
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-moe-navy mt-1">
            مختبر التدريب وبناء التوزيع الإلكتروني
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            اختاري عنصراً أو أيونه الشائع، ووزعي إلكتروناته في المجالات الفرعية خطوة بخطوة وتأكدي من النتيجة
          </p>
        </div>

        {/* Reset lab */}
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-600 hover:text-moe-navy border border-slate-200 text-xs font-bold transition-colors shadow-xs"
        >
          <RotateCcw className="w-4 h-4" />
          <span>تفريغ المدارات والبدء من جديد</span>
        </button>
      </div>

      {/* Element Selector Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-soft space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-500 block">
            اختاري العنصر للتدريب عليه:
          </label>
          {ionInfo && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500">حالة المادة:</span>
              <button
                onClick={() => setIsIonMode(false)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  !isIonMode ? 'bg-moe-navy text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                الذرة المتعادلة ({element.symbol})
              </button>
              <button
                onClick={() => setIsIonMode(true)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  isIonMode ? 'bg-moe-green text-white shadow-xs' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                <Zap className="w-3 h-3" />
                <span>الأيون ({ionInfo.symbol})</span>
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {elementsData.map(el => {
            const hasIon = !!commonIonsMap[el.z];
            return (
              <button
                key={el.z}
                onClick={() => { setSelectedZ(el.z); if (!commonIonsMap[el.z]) setIsIonMode(false); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  selectedZ === el.z
                    ? 'bg-moe-navy text-white shadow-sm scale-105'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span className="font-mono text-moe-teal font-extrabold">{el.symbol}</span>
                <span>{el.nameAr}</span>
                <span className="text-[10px] opacity-70">({el.z})</span>
                {hasIon && <span className="text-[10px] text-emerald-500 font-bold">⚡</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Element Info Card */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-mono font-black text-2xl shadow-xs border ${
            isIonMode ? 'bg-emerald-50 text-moe-green border-emerald-300' : 'bg-slate-100 text-moe-navy border-slate-300'
          }`}>
            <span>{isIonMode && ionInfo ? ionInfo.symbol : element.symbol}</span>
            <span className="text-[10px] font-normal text-slate-400">Z = {element.z}</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-moe-navy">
                {isIonMode && ionInfo ? `${ionInfo.name} (${ionInfo.symbol})` : element.nameAr}
              </h3>
              {isIonMode && ionInfo ? (
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md border border-emerald-300">
                  شحنة: {ionInfo.charge}
                </span>
              ) : (
                <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md">
                  ذرة متعادلة
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isIonMode && ionInfo ? ionInfo.rule : element.funFact}
            </p>
          </div>
        </div>

        {/* Counter of placed electrons */}
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <div className="text-center">
            <span className="text-[10px] text-slate-500 block font-bold">الإلكترونات الموضوعة</span>
            <span className={`text-xl font-black font-mono ${
              totalPlaced === targetElectrons ? 'text-moe-green' : 'text-slate-800'
            }`}>
              {totalPlaced} / {targetElectrons}
            </span>
          </div>
          <button
            onClick={() => setHintRequested(!hintRequested)}
            className="p-2 text-slate-400 hover:text-amber-500 rounded-xl hover:bg-white"
            title="طلب تلميح"
          >
            <Lightbulb className="w-5 h-5" />
          </button>
        </div>
      </div>

      {hintRequested && (
        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 animate-in fade-in duration-200">
          💡 <strong>تلميح المبادرة:</strong> التوزيع المعتمد هو: <span dir="ltr" className="font-mono font-bold inline-block">{isIonMode && ionInfo ? ionConfigurationHints[selectedZ] : element.config}</span>
        </div>
      )}

      {/* Sublevels Interactive Placement Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {sublevelSlots.map(slot => {
          const placed = currentConfig[slot.key];
          const isFull = placed === slot.max;
          return (
            <div 
              key={slot.key}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between space-y-3 ${
                placed > 0 
                  ? 'bg-white border-moe-navy shadow-xs' 
                  : 'bg-slate-50/70 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-base font-black text-moe-navy">
                  {slot.name}
                </span>
                <span className="text-[10px] text-slate-400 font-bold font-mono">
                  السعة: {slot.max}
                </span>
              </div>

              {/* Progress bar of electrons in this sublevel */}
              <div className="space-y-1">
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${isFull ? 'bg-moe-green' : 'bg-moe-teal'}`}
                    style={{ width: `${(placed / slot.max) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono font-bold text-slate-500">
                  <span>{placed} e⁻</span>
                  {isFull && <span className="text-emerald-600">مكتمل</span>}
                </div>
              </div>

              {/* Buttons to Add / Remove */}
              <div className="flex items-center gap-1.5 pt-1">
                <button
                  onClick={() => handleRemoveElectron(slot.key)}
                  disabled={placed === 0}
                  className="flex-1 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleAddElectron(slot.key, slot.max)}
                  disabled={isFull}
                  className="flex-1 py-1.5 rounded-lg bg-moe-navy hover:bg-moe-navy-light text-white font-bold text-xs disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Configuration Text Preview */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
        <div>
          <span className="text-xs text-slate-400 block mb-1">صيغتكِ الإلكترونية الحالية:</span>
          <div className="text-lg font-bold text-emerald-400 dir-ltr text-left">
            {Object.entries(currentConfig)
              .filter(([_, count]) => count > 0)
              .map(([sub, count]) => `${sub}${count > 1 ? `^${count}` : '^1'}`)
              .join(' ') || "(لم تضعي أي إلكترونات بعد)"}
          </div>
        </div>

        <button
          onClick={handleVerify}
          className="px-6 py-3 rounded-xl bg-moe-green hover:bg-moe-green-dark text-white font-bold text-xs shadow-md shadow-moe-green/20 transition-all hover:scale-105"
        >
          فحص التوزيع والتأكد من الصحة
        </button>
      </div>

      {/* Validation Message Display */}
      {validationResult && (
        <div className={`p-5 rounded-2xl border space-y-2 animate-in fade-in duration-200 ${
          validationResult.valid 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
            : 'bg-rose-50 border-rose-300 text-rose-950'
        }`}>
          <div className="flex items-center gap-2 font-black text-sm">
            {validationResult.valid ? <CheckCircle2 className="w-5 h-5 text-moe-green" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
            <span>{validationResult.valid ? 'إتقان تام وصحيح!' : 'توزيع يحتاج لتعديل:'}</span>
          </div>
          <p className="text-xs sm:text-sm font-medium leading-relaxed">
            {validationResult.message}
          </p>
          {validationResult.hint && (
            <p className="text-xs text-slate-600 pt-1">
              💡 {validationResult.hint}
            </p>
          )}
        </div>
      )}

    </div>
  );
}
