// Error Challenge Dataset - "خطأ نودّعه"
// Aligned strictly with Saudi High School Chemistry Curriculum (كتاب كيمياء 1 - نظام المسارات)
// Sources: Kimia.pdf (الفصل 1: ص 32-47، والفصل 3: ص 84-115)
// Focuses on: الأيونات الموجبة والسالبة، مبدأ أوفباو، مبدأ باولي، قاعدة هوند، واستثناءات كتاب الطالب

export const errorChallengeBank = [
  // ==========================================
  // --- قسم الأيونات الموجبة والسالبة (الفصل 3) ---
  // ==========================================
  {
    id: "err-ion-1",
    category: "ions",
    level: "medium",
    levelAr: "تحدي الأيونات الموجبة (فلزات رئيسية)",
    badgeColor: "emerald",
    element: {
      symbol: "Al³⁺",
      atomSymbol: "Al",
      nameAr: "أيون الألومنيوم (Al³⁺)",
      nameEn: "Aluminium Ion",
      z: 13,
      isIon: true,
      charge: "+3"
    },
    wrongConfig: "1s² 2s² 2p⁶ 3s²",
    displayNotation: "صيغة إلكترونية خاطئة لأيون Al³⁺",
    errorType: "incomplete_ion_loss",
    errorTypeNameAr: "فقد غير مكتمل لإلكترونات التكافؤ في الأيون الموجب",
    errorLocation: "المستوى الخارجي 3s²",
    questionPrompt: "تأملي التوزيع المعروض لأيون الألومنيوم Al³⁺ (العدد الذري للألومنيوم Z = 13 كما في كتاب كيمياء 1 ص 85). ما الخطأ العلمي في هذا التوزيع؟",
    identifiedErrorText: "تم فقد إلكترون واحد فقط من 3p وبقي إلكترونا 3s²، بينما أيون Al³⁺ يجب أن يفقد إلكترونات المستوى الرئيس الثالث n=3 كاملة (13 - 3 = 10 إلكترونات).",
    hint: "شحنة الأيون هي +3، مما يعني أن الذرة فقدت 3 إلكترونات كاملة من أعلى مستوى رئيسي (n=3) لتصل إلى التوزيع المستقر الشبيه بالغاز النبيل النيون [Ne].",
    correctConfig: "1s² 2s² 2p⁶",
    options: [
      { text: "1s² 2s² 2p⁶", isCorrect: true },
      { text: "1s² 2s² 2p⁶ 3s²", isCorrect: false },
      { text: "1s² 2s² 2p³ 3s² 3p¹", isCorrect: false },
      { text: "1s² 2s² 2p⁶ 3s² 3p⁴", isCorrect: false }
    ],
    scientificExplanation: "وفق كتاب كيمياء 1 ص 85 والاختبار المقنن ص 115: ذرة الألومنيوم Al (Z=13) توزيعها 1s² 2s² 2p⁶ 3s² 3p¹. عند تكوين أيون Al³⁺ تفقد إلكترونات المستوى الخارجي n=3 كاملة (إلكترون 3p¹ وإلكتروني 3s²)، فيصبح عدد الإلكترونات 10 وتوزيعها الصحيح 1s² 2s² 2p⁶ مطابقاً لغاز النيون المستقر ثمانياً.",
    ruleBreached: "قاعدة فقد إلكترونات التكافؤ في فلزات المجموعة 13 وصولاً لقاعدة الثمانيات (كتاب كيمياء 1 ص 85)",
    textbookRef: "كتاب كيمياء 1، ص 85 الجدول 3-1، وص 115 سؤال 2"
  },
  {
    id: "err-ion-2",
    category: "ions",
    level: "easy",
    levelAr: "تحدي الأيونات الموجبة (فلزات قلوية)",
    badgeColor: "emerald",
    element: {
      symbol: "Na⁺",
      atomSymbol: "Na",
      nameAr: "أيون الصوديوم (Na⁺)",
      nameEn: "Sodium Ion",
      z: 11,
      isIon: true,
      charge: "+1"
    },
    wrongConfig: "1s² 2s² 2p⁶ 3s¹",
    displayNotation: "صيغة إلكترونية خاطئة لأيون Na⁺",
    errorType: "forgot_positive_charge",
    errorTypeNameAr: "توزيع الذرة المتعادلة بدلاً من الأيون الموجب",
    errorLocation: "المستوى الخارجي 3s¹",
    questionPrompt: "كُتب التوزيع الإلكتروني لأيون الصوديوم Na⁺ على أنه 1s² 2s² 2p⁶ 3s¹ (العدد الذري للصوديوم Z=11). أين يكمن الخلل العلمي؟",
    identifiedErrorText: "كُتب التوزيع لذرة الصوديوم المتعادلة (11 إلكتروناً)، ولم يؤخذ في الحسبان فقد إلكترون التكافؤ لتكوين الأيون الموجب Na⁺ (10 إلكترونات).",
    hint: "وفق الشكل 3-1 ص 85 بكتاب الطالب: تفقد ذرة الصوديوم إلكترون التكافؤ 3s¹ لتتحول إلى كاتيون Na⁺ بتوزيع [Ne].",
    correctConfig: "1s² 2s² 2p⁶",
    options: [
      { text: "1s² 2s² 2p⁶", isCorrect: true },
      { text: "1s² 2s² 2p⁶ 3s¹", isCorrect: false },
      { text: "1s² 2s² 2p⁵ 3s²", isCorrect: false },
      { text: "1s² 2s² 2p⁴ 3s²", isCorrect: false }
    ],
    scientificExplanation: "ينص كتاب كيمياء 1 ص 84-85 على أن ذرة الصوديوم تفقد إلكترون التكافؤ الوحيد الموجود في 3s¹ لتكوّن Na⁺ بعدد 10 إلكترونات وتوزيع 1s² 2s² 2p⁶ مساوٍ لغاز النيون المستقر، مع بقاء عدد البروتونات (+11p) ثابتاً في النواة.",
    ruleBreached: "مفهوم شحنة الأيون الموجب وفقد إلكترون التكافؤ (الشكل 3-1 ص 85)",
    textbookRef: "كتاب كيمياء 1، ص 84-85"
  },
  {
    id: "err-ion-3",
    category: "ions",
    level: "medium",
    levelAr: "تحدي الأيونات السالبة (هالوجينات)",
    badgeColor: "blue",
    element: {
      symbol: "Cl⁻",
      atomSymbol: "Cl",
      nameAr: "أيون الكلوريد (Cl⁻)",
      nameEn: "Chloride Ion",
      z: 17,
      isIon: true,
      charge: "-1"
    },
    wrongConfig: "1s² 2s² 2p⁶ 3s² 3p⁵",
    displayNotation: "صيغة إلكترونية خاطئة لأيون الكلوريد Cl⁻",
    errorType: "forgot_negative_charge",
    errorTypeNameAr: "إغفال إلكترون الاكتساب في الأيون السالب",
    errorLocation: "المستوى الفرعي 3p⁵",
    questionPrompt: "تأملي توزيع أيون الكلوريد Cl⁻ (العدد الذري Z=17 كما في كتاب كيمياء 1 ص 86). ما الخلل العلمي الذي وقعت فيه الطالبة؟",
    identifiedErrorText: "تجاهلت الطالبة اكتساب الإلكترون الإضافي الذي يمنح الأيون شحنته السالبة، فكتبت 3p⁵ (17 إلكتروناً للذرة المتعادلة) بدلاً من 3p⁶ (18 إلكتروناً للأيون).",
    hint: "وفق الشكل 3-3 ص 86 بكتاب الطالب: تكتسب ذرة الكلور إلكتروناً في 3p ليكتمل بـ 6 إلكترونات (18 إلكتروناً مثل الأرجون).",
    correctConfig: "1s² 2s² 2p⁶ 3s² 3p⁶",
    options: [
      { text: "1s² 2s² 2p⁶ 3s² 3p⁶", isCorrect: true },
      { text: "1s² 2s² 2p⁶ 3s² 3p⁵", isCorrect: false },
      { text: "1s² 2s² 2p⁶ 3s² 3p⁴ 4s¹", isCorrect: false },
      { text: "1s² 2s² 2p⁶ 3s¹ 3p⁶", isCorrect: false }
    ],
    scientificExplanation: "يوضح كتاب كيمياء 1 ص 86 (الشكل 3-3) أن ذرة الكلور Cl لديها 17 إلكتروناً بتوزيع 1s² 2s² 2p⁶ 3s² 3p⁵. عند تكوين أيون الكلوريد Cl⁻ تكتسب إلكتروناً في المستوى الفرعي 3p ليكتمل بـ 6 إلكترونات، ويصبح التوزيع 1s² 2s² 2p⁶ 3s² 3p⁶ محققاً التركيب الثماني لغاز الأرجون [Ar].",
    ruleBreached: "اكتساب الإلكترونات في الأيونات السالبة (الأنيونات) وقاعدة الثمانيات (ص 86)",
    textbookRef: "كتاب كيمياء 1، الشكل 3-3 ص 86"
  },
  {
    id: "err-ion-4",
    category: "ions",
    level: "medium",
    levelAr: "تحدي الأيونات السالبة (المجموعة 16)",
    badgeColor: "blue",
    element: {
      symbol: "O²⁻",
      atomSymbol: "O",
      nameAr: "أيون الأكسيد (O²⁻)",
      nameEn: "Oxide Ion",
      z: 8,
      isIon: true,
      charge: "-2"
    },
    wrongConfig: "1s² 2s² 2p⁴ 3s²",
    displayNotation: "صيغة إلكترونية خاطئة لأيون الأكسيد O²⁻",
    errorType: "aufbau_in_anion",
    errorTypeNameAr: "وضع إلكترونات الاكتساب في مستوى أعلى قبل ملء المستوى الحالي",
    errorLocation: "المستويين 2p⁴ و 3s²",
    questionPrompt: "في توزيع أيون الأكسيد O²⁻ (العدد الذري Z=8)، تم وضع إلكتروني الاكتساب في 3s² بدلاً من 2p. ما الخطأ العلمي هنا؟",
    identifiedErrorText: "المستوى الفرعي 2p يتسع لـ 6 إلكترونات ويحتوي 4 فقط، لذا يجب وضع إلكتروني الاكتساب في 2p ليكتمل بـ 6 إلكترونات قبل الانتقال إلى 3s.",
    hint: "وفق مبدأ أوفباو بكتاب الطالب ص 32 وص 87: تملأ المستويات الأقل طاقة أولاً، و 2p أقل طاقة من 3s.",
    correctConfig: "1s² 2s² 2p⁶",
    options: [
      { text: "1s² 2s² 2p⁶", isCorrect: true },
      { text: "1s² 2s² 2p⁴ 3s²", isCorrect: false },
      { text: "1s² 2s² 2p⁵ 3s¹", isCorrect: false },
      { text: "1s² 2s⁴ 2p⁴", isCorrect: false }
    ],
    scientificExplanation: "يذكر كتاب كيمياء 1 ص 87 أن ذرة الأكسجين تكتسب إلكترونين لتكوّن أيون الأكسيد O²⁻ (10 إلكترونات). بما أن المستوى 2p يحتوي على مكانين شاغرين، فإن الإلكترونين يدخلان في 2p ليكتمل بـ 6 إلكترونات (2s² 2p⁶)، محققاً التوزيع المستقر لغاز النيون [Ne].",
    ruleBreached: "مبدأ أوفباو في إضافة إلكترونات الأيون السالب (كتاب كيمياء 1 ص 32، 87)",
    textbookRef: "كتاب كيمياء 1، ص 87"
  },
  {
    id: "err-ion-5",
    category: "ions",
    level: "hard",
    levelAr: "تحدي الأيونات المتقدم (الفلزات الانتقالية)",
    badgeColor: "purple",
    element: {
      symbol: "Fe²⁺",
      atomSymbol: "Fe",
      nameAr: "أيون الحديدوز (Fe²⁺)",
      nameEn: "Iron(II) Ion",
      z: 26,
      isIon: true,
      charge: "+2"
    },
    wrongConfig: "[Ar] 4s² 3d⁴",
    displayNotation: "صيغة إلكترونية خاطئة لأيون الحديد Fe²⁺",
    errorType: "wrong_sublevel_loss",
    errorTypeNameAr: "فقد الإلكترونات من المستوى الخطأ (3d بدلاً من 4s)",
    errorLocation: "المستويين 4s² و 3d⁴",
    questionPrompt: "وزعت طالبة أيون الحديدوز Fe²⁺ (العدد الذري للحديد Z=26) بحذف إلكترونين من 3d فكتبت [Ar] 4s² 3d⁴. ما هو التفسير العلمي لخطئها؟",
    identifiedErrorText: "قاعدة فقد الإلكترونات في الفلزات الانتقالية تنص على الفقد من المستوى الخارجي ذي رقم الكم الرئيس الأكبر (n الأكبر وهو 4s) أولاً، وليس من 3d.",
    hint: "راجعي كتاب كيمياء 1 ص 85 وص 109 سؤال 56: تفقد الفلزات الانتقالية إلكتروني المستوى الخارجي 4s أولاً لتكوّن أيونات +2.",
    correctConfig: "[Ar] 3d⁶",
    options: [
      { text: "[Ar] 3d⁶", isCorrect: true },
      { text: "[Ar] 4s² 3d⁴", isCorrect: false },
      { text: "[Ar] 4s¹ 3d⁵", isCorrect: false },
      { text: "[Ar] 4s² 3d⁶", isCorrect: false }
    ],
    scientificExplanation: "ينص كتاب كيمياء 1 ص 85 وص 109 سؤال 56 على أن مستوى الطاقة الخارجي للفلزات الانتقالية هو 4s (ns²). عند تكوين الأيون الموجب تفقد الذرة إلكترونات المستوى الخارجي الأبعد عن النواة (4s أولاً)، لذا عند تكوين Fe²⁺ يُحذف إلكترونا 4s ليصبح التوزيع الصحيح [Ar] 3d⁶.",
    ruleBreached: "قاعدة الفقد من المستوى الخارجي الأكبر n في الفلزات الانتقالية (ص 85)",
    textbookRef: "كتاب كيمياء 1، ص 85، وتقويم الفصل ص 109 سؤال 56"
  },
  {
    id: "err-ion-6",
    category: "ions",
    level: "easy",
    levelAr: "تحدي الأيونات الموجبة (فلزات قلوية أرضية)",
    badgeColor: "emerald",
    element: {
      symbol: "Mg²⁺",
      atomSymbol: "Mg",
      nameAr: "أيون الماغنسيوم (Mg²⁺)",
      nameEn: "Magnesium Ion",
      z: 12,
      isIon: true,
      charge: "+2"
    },
    wrongConfig: "1s² 2s² 2p⁶ 3s¹",
    displayNotation: "صيغة إلكترونية خاطئة لأيون Mg²⁺",
    errorType: "partial_loss_mg",
    errorTypeNameAr: "فقد إلكترون واحد فقط بدلاً من إلكتروني التكافؤ",
    errorLocation: "المستوى الفرعي 3s¹",
    questionPrompt: "تأملي توزيع أيون الماغنسيوم Mg²⁺ (العدد الذري 12 كما في كتاب كيمياء 1 ص 85). ما سبب الخطأ في بقاء إلكترون في 3s؟",
    identifiedErrorText: "الماغنسيوم في المجموعة 2 ويفقد إلكتروني تكافؤ كاملين لتكوين كاتيون Mg²⁺ (12 - 2 = 10 إلكترونات)، وبقاء إلكترون في 3s خطأ.",
    hint: "احسبي عدد إلكترونات الأيون: 12 - 2 = 10 إلكترونات مطابقة لغاز النيون.",
    correctConfig: "1s² 2s² 2p⁶",
    options: [
      { text: "1s² 2s² 2p⁶", isCorrect: true },
      { text: "1s² 2s² 2p⁶ 3s¹", isCorrect: false },
      { text: "1s² 2s² 2p⁵ 3s²", isCorrect: false },
      { text: "1s² 2s² 2p⁴", isCorrect: false }
    ],
    scientificExplanation: "ينص كتاب كيمياء 1 ص 85 (الجدول 3-1) على أن فلزات المجموعة 2 تفقد إلكتروني المستوى ns² بالكامل لتكوّن أيونات ثنائية موجبة (+2). لذلك يفقد الماغنسيوم إلكتروني 3s بالكامل ليصبح 1s² 2s² 2p⁶ مطابقاً لغاز النيون المستقر.",
    ruleBreached: "فقد إلكترونات التكافؤ كاملة في فلزات المجموعة 2 (كتاب كيمياء 1 ص 85)",
    textbookRef: "كتاب كيمياء 1، ص 85 الجدول 3-1"
  },
  {
    id: "err-ion-7",
    category: "ions",
    level: "hard",
    levelAr: "تحدي التوزيع الشبيه بالغاز النبيل (الخارصين)",
    badgeColor: "purple",
    element: {
      symbol: "Zn²⁺",
      atomSymbol: "Zn",
      nameAr: "أيون الخارصين (Zn²⁺)",
      nameEn: "Zinc Ion",
      z: 30,
      isIon: true,
      charge: "+2"
    },
    wrongConfig: "[Ar] 4s² 3d⁸",
    displayNotation: "صيغة إلكترونية خاطئة لأيون Zn²⁺",
    errorType: "pseudo_noble_error",
    errorTypeNameAr: "فقد الإلكترونات من 3d بدلاً من 4s في الخارصين",
    errorLocation: "المستويين 4s² و 3d⁸",
    questionPrompt: "في كتاب كيمياء 1 ص 86 (الشكل 3-2)، وضّح الكتاب تكوين أيون الخارصين Zn²⁺ (Z=30). إذا كُتب التوزيع [Ar] 4s² 3d⁸، فأين الخلل؟",
    identifiedErrorText: "فقدت الطالبة إلكترونين من 3d بدلاً من 4s، بينما الخارصين يفقد إلكتروني 4s ليبقى 3d ممتلئاً تماماً [Ar] 3d¹⁰ (التوزيع الشبيه بالغاز النبيل).",
    hint: "تذكري: الفقد يكون من المستوى الخارجي 4s، وامتلاء 3d بـ 10 إلكترونات يمنحه استقراراً فائقاً.",
    correctConfig: "[Ar] 3d¹⁰",
    options: [
      { text: "[Ar] 3d¹⁰", isCorrect: true },
      { text: "[Ar] 4s² 3d⁸", isCorrect: false },
      { text: "[Ar] 4s¹ 3d⁹", isCorrect: false },
      { text: "[Ar] 4s² 3d¹⁰", isCorrect: false }
    ],
    scientificExplanation: "ينص كتاب كيمياء 1 ص 86 (الشكل 3-2) على أن ذرة الخارصين Zn: [Ar] 4s² 3d¹⁰ تفقد إلكتروني المستوى 4s لتكوّن Zn²⁺ بتوزيع [Ar] 3d¹⁰ ذي المستويات s, p, d الممتلئة تماماً بالإلكترونات، وهو ما يُعرف بـ (التوزيع الإلكتروني الشبيه بالغاز النبيل).",
    ruleBreached: "قاعدة الفقد من المستوى 4s وتكوين التوزيع الشبيه بالغاز النبيل (كتاب كيمياء 1 ص 86)",
    textbookRef: "كتاب كيمياء 1، ص 86 الشكل 3-2"
  },
  {
    id: "err-ion-8",
    category: "ions",
    level: "medium",
    levelAr: "تحدي الأيونات السالبة (أيون النيتريد)",
    badgeColor: "blue",
    element: {
      symbol: "N³⁻",
      atomSymbol: "N",
      nameAr: "أيون النيتريد (N³⁻)",
      nameEn: "Nitride Ion",
      z: 7,
      isIon: true,
      charge: "-3"
    },
    wrongConfig: "1s² 2s² 2p⁴",
    displayNotation: "صيغة إلكترونية خاطئة لأيون النيتريد N³⁻",
    errorType: "partial_gain_nitrogen",
    errorTypeNameAr: "اكتساب إلكترون واحد فقط بدلاً من ثلاثة إلكترونات",
    errorLocation: "المستوى الفرعي 2p⁴",
    questionPrompt: "كُتب توزيع أيون النيتريد N³⁻ (العدد الذري للنيتروجين Z=7) على أنه 1s² 2s² 2p⁴ (كتاب كيمياء 1 ص 86، ص 109 سؤال 54). ما الخطأ العلمي؟",
    identifiedErrorText: "ذرة النيتروجين في المجموعة 15 ولديها 5 إلكترونات تكافؤ، ولكي تصل للتوزيع الثماني المستقر تكتسب 3 إلكترونات كاملة (7 + 3 = 10) ليصبح 2p⁶ وليس 2p⁴.",
    hint: "الشحنة السالبة (-3) تعني اكتساب 3 إلكترونات كاملة لتحقيق التركيب الثماني المشابه للنيون.",
    correctConfig: "1s² 2s² 2p⁶",
    options: [
      { text: "1s² 2s² 2p⁶", isCorrect: true },
      { text: "1s² 2s² 2p⁴", isCorrect: false },
      { text: "1s² 2s² 2p⁵", isCorrect: false },
      { text: "1s² 2s² 2p³", isCorrect: false }
    ],
    scientificExplanation: "يوضح كتاب كيمياء 1 ص 86 وص 109 سؤال 54 أن ذرة النيتروجين تكتسب 3 إلكترونات لتكمل مستواها الخارجي n=2 بثمانية إلكترونات (2s² 2p⁶)، مكوّنةً أنيون النيتريد N³⁻ بتوزيع مطابق لغاز النيون الخامل المستقر.",
    ruleBreached: "اكتساب إلكترونات التكافؤ للوصول لقاعدة الثمانيات في المجموعة 15 (كتاب كيمياء 1 ص 86)",
    textbookRef: "كتاب كيمياء 1، ص 86، وص 109 سؤال 54"
  },

  // ==========================================
  // --- قسم الذرات المتعادلة وقواعد التوزيع (الفصل 1) ---
  // ==========================================
  {
    id: "err-neutral-1",
    category: "neutral",
    level: "easy",
    levelAr: "مبدأ أوفباو (البناء التصاعدي)",
    badgeColor: "emerald",
    element: {
      symbol: "Na",
      atomSymbol: "Na",
      nameAr: "ذرة الصوديوم المتعادلة",
      nameEn: "Sodium",
      z: 11,
      isIon: false,
      charge: "0"
    },
    wrongConfig: "1s² 2s² 2p⁵ 3s²",
    displayNotation: "صيغة إلكترونية خاطئة للصوديوم",
    errorType: "aufbau_sublevel",
    errorTypeNameAr: "خرق مبدأ أوفباو وسعة المستوى 2p",
    errorLocation: "المستويين 2p⁵ و 3s²",
    questionPrompt: "تأملي التوزيع الإلكتروني لذرة الصوديوم المتعادلة (العدد الذري 11 كما في كتاب كيمياء 1 ص 35). ما الخطأ العلمي في هذا التوزيع؟",
    identifiedErrorText: "انتقل إلكترون إلى المستوى 3s قبل اكتمال المستوى 2p الذي يتسع لـ 6 إلكترونات، وهذا مخالف لمبدأ أوفباو.",
    hint: "المستوى الفرعي p يتسع لـ 6 إلكترونات، ومبدأ أوفباو (ص 32) يوجب ملء المستويات الأقل طاقة أولاً.",
    correctConfig: "1s² 2s² 2p⁶ 3s¹",
    options: [
      { text: "1s² 2s² 2p⁶ 3s¹", isCorrect: true },
      { text: "1s² 2s² 2p⁵ 3s²", isCorrect: false },
      { text: "1s² 2s³ 2p⁶", isCorrect: false },
      { text: "1s² 2s² 2p⁶ 3p¹", isCorrect: false }
    ],
    scientificExplanation: "وفق مبدأ أوفباو (البناء التصاعدي) الوارد في كتاب كيمياء 1 ص 32، يشغل كل إلكترون المستوى الأقل طاقة أولاً. المستوى 2p أدنى طاقة من 3s ويتسع لـ 6 إلكترونات، لذا يجب ملء 2p كاملاً بـ 6 إلكترونات (2p⁶) أولاً، ثم يوضع الإلكترون الحادي عشر في المستوى 3s لتصبح 3s¹.",
    ruleBreached: "مبدأ أوفباو - البناء التصاعدي (كتاب كيمياء 1 ص 32)",
    textbookRef: "كتاب كيمياء 1، ص 32، والجدول 1-7 ص 35"
  },
  {
    id: "err-neutral-2",
    category: "neutral",
    level: "easy",
    levelAr: "مبدأ باولي للاستبعاد",
    badgeColor: "emerald",
    element: {
      symbol: "B",
      atomSymbol: "B",
      nameAr: "ذرة البورون المتعادلة",
      nameEn: "Boron",
      z: 5,
      isIon: false,
      charge: "0"
    },
    wrongConfig: "1s² 2s³",
    displayNotation: "صيغة إلكترونية خاطئة للبورون",
    errorType: "capacity_exceeded",
    errorTypeNameAr: "تجاوز السعة القصوى للمستوى الفرعي s",
    errorLocation: "المستوى 2s³",
    questionPrompt: "تأملي توزيع ذرة البورون (العدد الذري 5 كما في كتاب كيمياء 1 الجدول 1-6 ص 34). أين يكمن الخلل العلمي؟",
    identifiedErrorText: "المستوى الفرعي s يتسع لإلكترونين فقط كحد أقصى، ولا يمكن أن يحتوي على 3 إلكترونات وفق مبدأ باولي.",
    hint: "المستوى الفرعي من نوع s يتكون من مدار كروي واحد، ومبدأ باولي يحدد سعته بـ 2 إلكترون كحد أقصى.",
    correctConfig: "1s² 2s² 2p¹",
    options: [
      { text: "1s² 2s² 2p¹", isCorrect: true },
      { text: "1s² 2s² 2p¹", isCorrect: false },
      { text: "1s² 2s³", isCorrect: false },
      { text: "1s¹ 2s² 2p²", isCorrect: false }
    ],
    scientificExplanation: "ينص مبدأ باولي للاستبعاد في كتاب كيمياء 1 ص 33 على أن عدد إلكترونات المستوى الفرعي الواحد لا يزيد عن إلكترونين ويدور كل منهما باتجاه معاكس للآخر. بما أن المستوى الثانوي s يحتوي على مستوى فرعي واحد فقط، فإن أقصى سعة له هي إلكترونان، والإلكترون الخامس يدخل في 2p¹.",
    ruleBreached: "مبدأ باولي للاستبعاد وسعة المستويات (كتاب كيمياء 1 ص 33)",
    textbookRef: "كتاب كيمياء 1، ص 33، والجدول 1-6 ص 34"
  },
  {
    id: "err-neutral-3",
    category: "neutral",
    level: "hard",
    levelAr: "استثناءات الاستقرارية (الكروم)",
    badgeColor: "purple",
    element: {
      symbol: "Cr",
      atomSymbol: "Cr",
      nameAr: "ذرة الكروم (استثناء نصف الامتلاء)",
      nameEn: "Chromium",
      z: 24,
      isIon: false,
      charge: "0"
    },
    wrongConfig: "[Ar] 4s² 3d⁴",
    displayNotation: "صيغة غير مستقرة للكروم",
    errorType: "half_filled_exception",
    errorTypeNameAr: "إغفال حالة الاستقرار الفائق لنصف الامتلاء (d⁵)",
    errorLocation: "المستويين 4s² و 3d⁴",
    questionPrompt: "كُتب توزيع الكروم Cr (العدد الذري 24) وفق الترتيب الحسابي البحت [Ar] 4s² 3d⁴. ما الخطأ الكيميائي في هذا التوزيع وفق كتاب كيمياء 1 ص 36؟",
    identifiedErrorText: "ذرة الكروم تكون أكثر استقراراً عندما ينتقل إلكترون من 4s إلى 3d ليكون كلا المستويين نصف ممتلئين (4s¹ 3d⁵).",
    hint: "المستوى d ذو المستويات الفرعية الخمسة يكون في قمة التماثل والاستقرار عندما يحتوي 5 إلكترونات منفردة متوازية الغزل.",
    correctConfig: "[Ar] 4s¹ 3d⁵",
    options: [
      { text: "[Ar] 4s¹ 3d⁵", isCorrect: true },
      { text: "[Ar] 4s² 3d⁴", isCorrect: false },
      { text: "[Ar] 4s⁰ 3d⁶", isCorrect: false },
      { text: "[Ar] 3d⁶", isCorrect: false }
    ],
    scientificExplanation: "ينص كتاب كيمياء 1 ص 36 نصاً على: 'التوزيع الإلكتروني الصحيح للكروم هو [Ar] 4s¹ 3d⁵. وتوضح التوزيعات الإلكترونية حالة الاستقرار للمستويات نصف الممتلئة والممتلئة s و d'. انتقال إلكترون من 4s إلى 3d يمنح الذرة تماثلاً فراغياً وطاقة دنيا تجعلها أكثر ثباتاً من 4s² 3d⁴.",
    ruleBreached: "استثناء استقرار نصف الامتلاء في المستوى الفرعي d (كتاب كيمياء 1 ص 36)",
    textbookRef: "كتاب كيمياء 1، ص 36"
  },
  {
    id: "err-neutral-4",
    category: "neutral",
    level: "hard",
    levelAr: "استثناءات الاستقرارية (النحاس)",
    badgeColor: "purple",
    element: {
      symbol: "Cu",
      atomSymbol: "Cu",
      nameAr: "ذرة النحاس (استثناء الامتلاء التام)",
      nameEn: "Copper",
      z: 29,
      isIon: false,
      charge: "0"
    },
    wrongConfig: "[Ar] 4s² 3d⁹",
    displayNotation: "صيغة غير مستقرة للنحاس",
    errorType: "full_filled_exception",
    errorTypeNameAr: "إغفال استقرار الامتلاء التام للمستوى d (3d¹⁰)",
    errorLocation: "المستويين 4s² و 3d⁹",
    questionPrompt: "في ذرة النحاس Cu (العدد الذري 29)، كُتب التوزيع [Ar] 4s² 3d⁹. ما التصحيح العلمي الواجب تطبيقه وفق كتاب كيمياء 1 ص 36؟",
    identifiedErrorText: "الامتلاء التام للمستوى 3d بعشرة إلكترونات (3d¹⁰) أكثر ثباتاً واستقراراً من بقاء 4s² ممتلئاً و3d ناقصاً.",
    hint: "ينتقل إلكترون من 4s إلى 3d ليكتمل المستوى d تماماً بـ 10 إلكترونات (3d¹⁰).",
    correctConfig: "[Ar] 4s¹ 3d¹⁰",
    options: [
      { text: "[Ar] 4s¹ 3d¹⁰", isCorrect: true },
      { text: "[Ar] 4s² 3d⁹", isCorrect: false },
      { text: "[Ar] 3d¹⁰ 4p¹", isCorrect: false },
      { text: "[Ar] 4s² 3d¹⁰", isCorrect: false }
    ],
    scientificExplanation: "ينص كتاب كيمياء 1 ص 36 نصاً على: 'التوزيع الإلكتروني الصحيح للنحاس هو [Ar] 4s¹ 3d¹⁰'. الامتلاء التام للمستوى الفرعي 3d بعشرة إلكترونات يمنح الذرة استقراراً هائلاً يفوق بقاء 4s ممتلئاً، فينتقل إلكترون من 4s ليعطي الحالة الأكثر استقراراً في الطبيعة.",
    ruleBreached: "استثناء استقرار الامتلاء التام في المستوى الفرعي d (كتاب كيمياء 1 ص 36)",
    textbookRef: "كتاب كيمياء 1، ص 36"
  },
  {
    id: "err-neutral-5",
    category: "neutral",
    level: "hard",
    levelAr: "مسائل الاختبار المقنن (الجرمانيوم)",
    badgeColor: "purple",
    element: {
      symbol: "Ge",
      atomSymbol: "Ge",
      nameAr: "ذرة الجرمانيوم (سؤال 17 ص 47)",
      nameEn: "Germanium",
      z: 32,
      isIon: false,
      charge: "0"
    },
    wrongConfig: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 4d¹⁰ 4p²",
    displayNotation: "صيغة خاطئة للجرمانيوم من الاختبار المقنن",
    errorType: "wrong_energy_order",
    errorTypeNameAr: "وضع 4d بدلاً من 3d مخالفاً تسلسل أوفباو",
    errorLocation: "المستوى الفرعي 4d¹⁰",
    questionPrompt: "من أسئلة الاختبار المقنن لكتاب كيمياء 1 ص 47 (سؤال 17 نصاً): وضّحي لماذا لا يمثل التوزيع 1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 4d¹⁰ 4p² التوزيع الإلكتروني الصحيح للجرمانيوم Ge؟ وما هو التوزيع الصحيح؟",
    identifiedErrorText: "كُتب 4d¹⁰ بدلاً من 3d¹⁰! وفق مبدأ أوفباو، يملأ المستوى 3d بعد 4s وقبل 4p، بينما المستوى 4d يأتي بعد 5s.",
    hint: "راجعي تسلسل أوفباو لمستويات الطاقة بكتاب الطالب ص 32-33: بعد 4s يأتي 3d ثم 4p.",
    correctConfig: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹⁰ 4p²",
    options: [
      { text: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹⁰ 4p²", isCorrect: true },
      { text: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 4d¹⁰ 4p²", isCorrect: false },
      { text: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹² 4s²", isCorrect: false },
      { text: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s¹ 4d¹⁰ 4p³", isCorrect: false }
    ],
    scientificExplanation: "هذا السؤال مأخوذ نصاً من الاختبار المقنن للفصل الأول بكتاب كيمياء 1 ص 47 سؤال 17: المستوى الفرعي ذو الطاقة الأدنى بعد 4s هو 3d وليس 4d. لذلك يجب ملء 3d أولاً بعشرة إلكترونات (3d¹⁰) ثم يدخل الإلكترونان الأخيران في 4p²، ويكون التوزيع الصحيح هو 1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹⁰ 4p².",
    ruleBreached: "تسلسل أوفباو ومستويات الطاقة (كتاب كيمياء 1 ص 32، والاختبار المقنن ص 47 سؤال 17)",
    textbookRef: "كتاب كيمياء 1، ص 47 سؤال 17"
  },
  {
    id: "err-neutral-6",
    category: "neutral",
    level: "medium",
    levelAr: "مسائل الاختبار المقنن (مخالفة أوفباو)",
    badgeColor: "emerald",
    element: {
      symbol: "F*",
      atomSymbol: "F",
      nameAr: "حالة إثارة مخالفة لأوفباو (سؤال 9 ص 47)",
      nameEn: "Excited State Atom",
      z: 9,
      isIon: false,
      charge: "0"
    },
    wrongConfig: "1s² 2s¹ 2p⁶",
    displayNotation: "توزيع مخالف لمبدأ أوفباو",
    errorType: "skipping_aufbau",
    errorTypeNameAr: "تجاوز ملء المستوى 2s والانتقال إلى 2p",
    errorLocation: "المستويين 2s¹ و 2p⁶",
    questionPrompt: "من الاختبار المقنن لكتاب كيمياء 1 ص 47 (سؤال 9 نصاً): أيّ التوزيعات يخالف مبدأ أوفباو؟ عُرض التوزيع 1s² 2s¹ 2p⁶. أين تكمن المخالفة الصريحة؟",
    identifiedErrorText: "تم ملء المستوى 2p بستة إلكترونات قبل اكتمال المستوى 2s الأقل طاقة بإلكترونين، مما يخالف مبدأ أوفباو في الحالة المستقرة.",
    hint: "وفق مبدأ أوفباو (ص 32): لا يجوز الانتقال إلى 2p إلا بعد امتلاء 2s بإلكترونين تماماً (2s²).",
    correctConfig: "1s² 2s² 2p⁵",
    options: [
      { text: "1s² 2s² 2p⁵ (الحالة المستقرة لذرة الفلور)", isCorrect: true },
      { text: "1s² 2s¹ 2p⁶", isCorrect: false },
      { text: "1s³ 2s² 2p⁴", isCorrect: false },
      { text: "1s² 2s² 2p⁶", isCorrect: false }
    ],
    scientificExplanation: "سؤال نصي من الاختبار المقنن ص 47 سؤال 9: مبدأ أوفباو يوجب ملء المستويات الأقل طاقة أولاً. المستوى 2s أقل طاقة من 2p، لذا فإن ملء 2p بـ 6 إلكترونات وترك 2s يحتوي على إلكترون وحيد هو مخالفة صريحة لمبدأ أوفباو في الحالة المستقرة.",
    ruleBreached: "مبدأ أوفباو في ترتيب الطاقة (كتاب كيمياء 1 ص 32، ص 47 سؤال 9)",
    textbookRef: "كتاب كيمياء 1، ص 47 سؤال 9"
  },
  {
    id: "err-neutral-7",
    category: "neutral",
    level: "medium",
    levelAr: "قاعدة هوند وتنافر الإلكترونات",
    badgeColor: "emerald",
    element: {
      symbol: "N",
      atomSymbol: "N",
      nameAr: "ذرة النيتروجين (قاعدة هوند ص 33)",
      nameEn: "Nitrogen",
      z: 7,
      isIon: false,
      charge: "0"
    },
    wrongConfig: "1s² 2s² 2px² 2py¹ 2pz⁰",
    displayNotation: "ازدواج خاطئ في مربعات المستويات",
    errorType: "hund_violation",
    errorTypeNameAr: "ازدواج الإلكترونات قبل إفرادها في المستويات متساوية الطاقة",
    errorLocation: "مربعات المستويات 2p (2px² 2py¹ 2pz⁰)",
    questionPrompt: "في ذرة النيتروجين N (العدد الذري 7 كما في كتاب كيمياء 1 ص 33-34)، تم رسم مربعات المستويات بوضع إلكترونين مزدوجين في 2px وإلكترون في 2py وبقاء 2pz فارغاً. ما القاعدة الكيميائية المنتهكة؟",
    identifiedErrorText: "انتهاك صريح لقاعدة هوند! الإلكترونات تتوزع فرادى أولاً في المستويات المتساوية الطاقة بنفس اتجاه الغزل (2px¹ 2py¹ 2pz¹) لتقليل التنافر.",
    hint: "تنص قاعدة هوند (ص 33) على توزيع الإلكترونات فرادى أولاً في المستويات المتساوية الطاقة قبل أن تبدأ بالازدواج.",
    correctConfig: "1s² 2s² 2px¹ 2py¹ 2pz¹ (توزيع فرادى متوازي الغزل)",
    options: [
      { text: "1s² 2s² 2px¹ 2py¹ 2pz¹ (توزيع فرادى متوازي الغزل)", isCorrect: true },
      { text: "1s² 2s² 2px² 2py¹ 2pz⁰", isCorrect: false },
      { text: "1s² 2s¹ 2px² 2py²", isCorrect: false },
      { text: "1s¹ 2s² 2px² 2py²", isCorrect: false }
    ],
    scientificExplanation: "تنص قاعدة هوند في كتاب كيمياء 1 ص 33 على أن الإلكترونات تتوزع في المستويات الفرعية المتساوية الطاقة بحيث تحافظ على أن يكون لها الاتجاه نفسه من حيث الدوران، قبل أن تشغل الإلكترونات الإضافية ذات الدوران المعاكس المستويات نفسها. ازدواج إلكترونين في 2px وترك 2pz فارغاً يزيد من قوى التنافر الكهربائي ويخالف قاعدة هوند.",
    ruleBreached: "قاعدة هوند وتوزيع الإلكترونات في المستويات المتساوية الطاقة (كتاب كيمياء 1 ص 33)",
    textbookRef: "كتاب كيمياء 1، ص 33"
  }
];
