// Comprehensive Scientific Dataset for Ions (الأيونات الموجبة والسالبة)
// Aligned strictly with Saudi Ministry of Education Chemistry 1 Curriculum (مسارات - كيمياء 1)
// Source: Kimia.pdf - Chapter 3: Ionic Compounds and Metals (الفصل 3: المركبات الأيونية والفلزات - الدرس 3-1: تكوّن الأيون ص 84-87)

export const ionsConcepts = {
  neutralAtom: {
    title: "الذرة المتعادلة (Neutral Atom)",
    definition: "ذرة غير مشحونة كهربائياً؛ لأن عدد الإلكترونات السالبة المحيطة بالنواة مساوٍ تماماً لعدد البروتونات الموجبة داخل النواة (العدد الذري Z).",
    rule: "عدد الإلكترونات = العدد الذري (Z)",
    charge: 0,
    badgeColor: "slate",
    icon: "Atom",
    bookRef: "كتاب كيمياء 1، الفصل 3، ص 84"
  },
  positiveIon: {
    title: "الأيون الموجب (الكاتيون - Cation)",
    definition: "يتكون الأيون الموجب عندما تفقد الذرة إلكترون تكافؤ واحداً أو أكثر لتحصل على التوزيع الإلكتروني المشابه للتوزيع الإلكتروني لأقرب غاز نبيل مستقر.",
    rule: "عدد الإلكترونات = العدد الذري (Z) − قيمة الشحنة الموجبة",
    lossRule: "قاعدة ذهبية: يتم فقد الإلكترونات أولاً من أعلى مستوى طاقة رئيسي (رقم الكم الرئيس n الأكبر)، ثم المستوى الأقل.",
    exampleEquation: "Na (ذرة صوديوم متعادلة) + طاقة ⟶ Na⁺ (كاتيون صوديوم) + e⁻ (إلكترون مفقود)",
    constantProtons: "قاعدة أساسية: يبقى عدد البروتونات في النواة ثابتاً لا يتغير عند تكوين الأيون (مثلاً 11 بروتوناً في الصوديوم تظل 11p)، وتتغير الإلكترونات فقط.",
    charge: "+",
    badgeColor: "emerald",
    icon: "PlusCircle",
    bookRef: "كتاب كيمياء 1، الفصل 3، ص 84-85"
  },
  negativeIon: {
    title: "الأيون السالب (الأنيون - Anion)",
    definition: "يتكون الأيون السالب عندما تكتسب الذرة إلكتروناً أو أكثر في مستواها الخارجي لتحصل على توزيع إلكتروني خارجي مستقر مشابه لأقرب غاز نبيل. ويُسمى بإضافة المقطع (يد) إلى نهاية اسم العنصر.",
    rule: "عدد الإلكترونات = العدد الذري (Z) + قيمة الشحنة السالبة",
    gainRule: "تدخل الإلكترونات المكتسبة في المستويات الفرعية الشاغرة ذات الطاقة الأدنى المتاحة وفق مبدأ أوفباو.",
    exampleEquation: "Cl (ذرة كلور متعادلة) + e⁻ (إلكترون) ⟶ Cl⁻ (أنيون كلوريد) + طاقة (349 kJ/mol)",
    charge: "−",
    badgeColor: "blue",
    icon: "MinusCircle",
    bookRef: "كتاب كيمياء 1، الفصل 3، ص 86"
  },
  pseudoNobleGas: {
    title: "التوزيع الشبيه بالغاز النبيل (Pseudo-Noble Gas)",
    definition: "توزيع إلكتروني مستقر نسبياً ينتج عندما تفقد ذرات عناصر المجموعات 11-14 إلكترونات لتكوّن مستوى طاقة خارجياً ذا مستويات ثانوية s, p, d ممتلئة تماماً بالإلكترونات.",
    rule: "فقد إلكترونات المستوى الخارجي 4s مع بقاء المستوى الداخلي 3d ممتلئاً تماماً (3d¹⁰).",
    exampleEquation: "Zn [Ar] 4s² 3d¹⁰ ⟶ Zn²⁺ [Ar] 3d¹⁰ + 2e⁻",
    charge: "+2",
    badgeColor: "purple",
    icon: "ShieldCheck",
    bookRef: "كتاب كيمياء 1، الفصل 3، ص 86 (الشكل 3-2)"
  },
  transitionMetals: {
    title: "أيونات الفلزات الانتقالية (Transition Metal Ions)",
    definition: "مستوى الطاقة الخارجي للفلزات الانتقالية هو ns². تفقد عادة إلكتروني 4s أولاً لتكوّن أيونات +2، وقد تفقد أيضاً إلكترونات من المستوى الثانوي الداخلي 3d لتكوّن أيونات +3.",
    rule: "الفقد يحدث دائماً من 4s قبل 3d لأن n=4 أعلى مستوى رئيسي.",
    exampleEquation: "Fe: [Ar] 4s² 3d⁶ ⟶ Fe²⁺: [Ar] 3d⁶ (فقد إلكتروني 4s) ⟶ Fe³⁺: [Ar] 3d⁵ (فقد إلكترون إضافي من 3d)",
    charge: "+2 / +3",
    badgeColor: "amber",
    icon: "Layers",
    bookRef: "كتاب كيمياء 1، الفصل 3، ص 85، وص 109 سؤال 56"
  }
};

export const ionsExamples = [
  {
    id: "ion-na",
    type: "positive",
    elementSymbol: "Na",
    ionSymbol: "Na⁺",
    nameAr: "الصوديوم",
    ionNameAr: "أيون الصوديوم الموجب (كاتيون)",
    z: 11,
    chargeNumber: 1,
    neutralElectrons: 11,
    ionElectrons: 10,
    neutralConfig: "1s² 2s² 2p⁶ 3s¹",
    neutralNoble: "[Ne] 3s¹",
    ionConfig: "1s² 2s² 2p⁶",
    ionNoble: "[Ne]",
    similarNobleGas: "النيون (Ne)",
    electronsLost: 1,
    lostFrom: "إلكترون التكافؤ الوحيد في المستوى الفرعي 3s",
    explanation: "تحتوي ذرة الصوديوم على إلكترون تكافؤ وحيد في 3s. عند التأين تفقد هذا الإلكترون لتصبح Na⁺ بشحنة +1، ويكون التوزيع الناتج 1s² 2s² 2p⁶ مطابقاً لغاز النيون الخامل والمستقر ثمانياً (كتاب كيمياء 1، ص 84-85).",
    category: "فلز قلوي - المجموعة 1 (كتاب كيمياء 1 ص 85)",
    textbookRef: "الشكل 3-1، ص 85",
    orbitalsNeutral: {
      "1s": [1, -1],
      "2s": [1, -1],
      "2px": [1, -1], "2py": [1, -1], "2pz": [1, -1],
      "3s": [1, 0]
    },
    orbitalsIon: {
      "1s": [1, -1],
      "2s": [1, -1],
      "2px": [1, -1], "2py": [1, -1], "2pz": [1, -1],
      "3s": [0, 0]
    }
  },
  {
    id: "ion-mg",
    type: "positive",
    elementSymbol: "Mg",
    ionSymbol: "Mg²⁺",
    nameAr: "الماغنسيوم",
    ionNameAr: "أيون الماغنسيوم الموجب (كاتيون)",
    z: 12,
    chargeNumber: 2,
    neutralElectrons: 12,
    ionElectrons: 10,
    neutralConfig: "1s² 2s² 2p⁶ 3s²",
    neutralNoble: "[Ne] 3s²",
    ionConfig: "1s² 2s² 2p⁶",
    ionNoble: "[Ne]",
    similarNobleGas: "النيون (Ne)",
    electronsLost: 2,
    lostFrom: "إلكترونا التكافؤ من المستوى الفرعي 3s",
    explanation: "تفقد ذرة الماغنسيوم إلكتروني 3s بالكامل لتكوين أيون Mg²⁺ (عدد الإلكترونات = 12 - 2 = 10)، ويصبح مستواها الخارجي n=2 ممتلئاً بثمانية إلكترونات ومستقراً كغاز النيون (كتاب كيمياء 1 ص 85).",
    category: "فلز قلوي أرضي - المجموعة 2 (كتاب كيمياء 1 ص 85)",
    textbookRef: "الجدول 3-1، ص 85",
    orbitalsNeutral: {
      "1s": [1, -1],
      "2s": [1, -1],
      "2px": [1, -1], "2py": [1, -1], "2pz": [1, -1],
      "3s": [1, -1]
    },
    orbitalsIon: {
      "1s": [1, -1],
      "2s": [1, -1],
      "2px": [1, -1], "2py": [1, -1], "2pz": [1, -1],
      "3s": [0, 0]
    }
  },
  {
    id: "ion-al",
    type: "positive",
    elementSymbol: "Al",
    ionSymbol: "Al³⁺",
    nameAr: "الألومنيوم",
    ionNameAr: "أيون الألومنيوم الموجب (كاتيون)",
    z: 13,
    chargeNumber: 3,
    neutralElectrons: 13,
    ionElectrons: 10,
    neutralConfig: "1s² 2s² 2p⁶ 3s² 3p¹",
    neutralNoble: "[Ne] 3s² 3p¹",
    ionConfig: "1s² 2s² 2p⁶",
    ionNoble: "[Ne]",
    similarNobleGas: "النيون (Ne)",
    electronsLost: 3,
    lostFrom: "إلكترون واحد من 3p¹ وإلكترونان من 3s² (المستوى الرئيس الثالث n=3 كاملاً)",
    explanation: "ذرة الألومنيوم تحتوي على 13 إلكتروناً. عند تكوين أيون Al³⁺، تفقد إلكترونات المستوى الخارجي (n=3) بأكملها: إلكترون 3p أولاً ثم إلكتروني 3s، فيتبقى 10 إلكترونات مطابقة للتوزيع المستقر لغاز النيون [Ne] (كتاب كيمياء 1 ص 85، وص 115).",
    category: "فلز رئيسي - المجموعة 13 (كتاب كيمياء 1 ص 85)",
    textbookRef: "الجدول 3-1 ص 85، والاختبار المقنن ص 115",
    orbitalsNeutral: {
      "1s": [1, -1],
      "2s": [1, -1],
      "2px": [1, -1], "2py": [1, -1], "2pz": [1, -1],
      "3s": [1, -1],
      "3px": [1, 0], "3py": [0, 0], "3pz": [0, 0]
    },
    orbitalsIon: {
      "1s": [1, -1],
      "2s": [1, -1],
      "2px": [1, -1], "2py": [1, -1], "2pz": [1, -1],
      "3s": [0, 0],
      "3px": [0, 0], "3py": [0, 0], "3pz": [0, 0]
    }
  },
  {
    id: "ion-k",
    type: "positive",
    elementSymbol: "K",
    ionSymbol: "K⁺",
    nameAr: "البوتاسيوم",
    ionNameAr: "أيون البوتاسيوم الموجب (كاتيون)",
    z: 19,
    chargeNumber: 1,
    neutralElectrons: 19,
    ionElectrons: 18,
    neutralConfig: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s¹",
    neutralNoble: "[Ar] 4s¹",
    ionConfig: "1s² 2s² 2p⁶ 3s² 3p⁶",
    ionNoble: "[Ar]",
    similarNobleGas: "الأرجون (Ar)",
    electronsLost: 1,
    lostFrom: "إلكترون التكافؤ الوحيد في 4s",
    explanation: "تفقد ذرة البوتاسيوم إلكترون التكافؤ في 4s لتكوّن K⁺ بعدد 18 إلكتروناً مطابقاً لغاز الأرجون النبيل المستقر (كتاب كيمياء 1 ص 85).",
    category: "فلز قلوي - المجموعة 1 (كتاب كيمياء 1 ص 85)",
    textbookRef: "كتاب كيمياء 1، ص 85",
    orbitalsNeutral: null,
    orbitalsIon: null
  },
  {
    id: "ion-ca",
    type: "positive",
    elementSymbol: "Ca",
    ionSymbol: "Ca²⁺",
    nameAr: "الكالسيوم",
    ionNameAr: "أيون الكالسيوم الموجب (كاتيون)",
    z: 20,
    chargeNumber: 2,
    neutralElectrons: 20,
    ionElectrons: 18,
    neutralConfig: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s²",
    neutralNoble: "[Ar] 4s²",
    ionConfig: "1s² 2s² 2p⁶ 3s² 3p⁶",
    ionNoble: "[Ar]",
    similarNobleGas: "الأرجون (Ar)",
    electronsLost: 2,
    lostFrom: "إلكترونا التكافؤ في 4s",
    explanation: "تفقد ذرة الكالسيوم إلكتروني المستوى 4s لتكوّن Ca²⁺ بشحنة +2 و18 إلكتروناً مماثلة لتوزيع الأرجون (كتاب كيمياء 1 ص 87 سؤال 5).",
    category: "فلز قلوي أرضي - المجموعة 2 (كتاب كيمياء 1 ص 87)",
    textbookRef: "تقويم 3-1، ص 87 سؤال 5",
    orbitalsNeutral: null,
    orbitalsIon: null
  },
  {
    id: "ion-fe",
    type: "positive",
    elementSymbol: "Fe",
    ionSymbol: "Fe²⁺ / Fe³⁺",
    nameAr: "الحديد",
    ionNameAr: "أيون الحديدوز Fe²⁺ وأيون الحديديك Fe³⁺",
    z: 26,
    chargeNumber: 2,
    neutralElectrons: 26,
    ionElectrons: 24,
    neutralConfig: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁶",
    neutralNoble: "[Ar] 4s² 3d⁶",
    ionConfig: "[Ar] 3d⁶ (في Fe²⁺) و [Ar] 3d⁵ (في Fe³⁺)",
    ionNoble: "[Ar] 3d⁶",
    similarNobleGas: "نواة الأرجون [Ar]",
    electronsLost: 2,
    lostFrom: "تُفقد إلكترونات 4s أولاً لأن n=4 أعلى مستوى رئيسي، ثم تُفقد من 3d",
    explanation: "قاعدة الفلزات الانتقالية المقررة في كيمياء 1 ص 85 وص 109 سؤال 56: الفقد يحدث دائماً من المستوى الخارجي ذي رقم الكم الرئيس الأكبر (n=4 وهو 4s أولاً). لذا يفقد إلكتروني 4s ليصبح Fe²⁺ بتوزيع [Ar] 3d⁶، ويفقد إلكتروناً إضافياً من 3d ليصبح Fe³⁺ بتوزيع [Ar] 3d⁵ المستقر بنصف الامتلاء.",
    category: "فلز انتقالي - قاعدة الفقد من n الأكبر (كتاب كيمياء 1 ص 85)",
    textbookRef: "كتاب كيمياء 1، ص 85، وتقويم الفصل ص 109 سؤال 56",
    orbitalsNeutral: null,
    orbitalsIon: null
  },
  {
    id: "ion-zn",
    type: "positive",
    elementSymbol: "Zn",
    ionSymbol: "Zn²⁺",
    nameAr: "الخارصين",
    ionNameAr: "أيون الخارصين (شبيه الغاز النبيل)",
    z: 30,
    chargeNumber: 2,
    neutralElectrons: 30,
    ionElectrons: 28,
    neutralConfig: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹⁰",
    neutralNoble: "[Ar] 4s² 3d¹⁰",
    ionConfig: "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰",
    ionNoble: "[Ar] 3d¹⁰",
    similarNobleGas: "توزيع شبيه بالغاز النبيل (Pseudo-noble gas)",
    electronsLost: 2,
    lostFrom: "إلكترونا المستوى الخارجي 4s",
    explanation: "مثال كتاب الطالب كيمياء 1 ص 86 (الشكل 3-2): تفقد ذرة الخارصين إلكتروني 4s وينتج التوزيع [Ar] 3d¹⁰ بمستويات s, p, d ممتلئة تماماً، ويُسمى التوزيع الإلكتروني الشبيه بالغاز النبيل.",
    category: "عنصر انتقالي - توزيع شبيه بالغاز النبيل (كتاب كيمياء 1 ص 86)",
    textbookRef: "الشكل 3-2، ص 86",
    orbitalsNeutral: null,
    orbitalsIon: null
  },
  {
    id: "ion-cl",
    type: "negative",
    elementSymbol: "Cl",
    ionSymbol: "Cl⁻",
    nameAr: "الكلور",
    ionNameAr: "أيون الكلوريد السالب (أنيون)",
    z: 17,
    chargeNumber: 1,
    neutralElectrons: 17,
    ionElectrons: 18,
    neutralConfig: "1s² 2s² 2p⁶ 3s² 3p⁵",
    neutralNoble: "[Ne] 3s² 3p⁵",
    ionConfig: "1s² 2s² 2p⁶ 3s² 3p⁶",
    ionNoble: "[Ar]",
    similarNobleGas: "الأرجون (Ar)",
    electronsGained: 1,
    gainedInto: "المستوى الفرعي 3p ليكتمل بـ 6 إلكترونات (3p⁶)",
    explanation: "تحتوي ذرة الكلور على 7 إلكترونات تكافؤ في المستوى الثالث (3s² 3p⁵). تكتسب إلكتروناً في مدار 3pz ليصبح 3p⁶، محققةً التركيب الثماني لغاز الأرجون [Ar]، مع انبعاث طاقة 349 kJ/mol (كتاب كيمياء 1 ص 86 الشكل 3-3).",
    category: "هالوجين - المجموعة 17 (كتاب كيمياء 1 ص 86)",
    textbookRef: "الشكل 3-3، ص 86",
    orbitalsNeutral: {
      "1s": [1, -1],
      "2s": [1, -1],
      "2px": [1, -1], "2py": [1, -1], "2pz": [1, -1],
      "3s": [1, -1],
      "3px": [1, -1], "3py": [1, -1], "3pz": [1, 0]
    },
    orbitalsIon: {
      "1s": [1, -1],
      "2s": [1, -1],
      "2px": [1, -1], "2py": [1, -1], "2pz": [1, -1],
      "3s": [1, -1],
      "3px": [1, -1], "3py": [1, -1], "3pz": [1, -1]
    }
  },
  {
    id: "ion-o",
    type: "negative",
    elementSymbol: "O",
    ionSymbol: "O²⁻",
    nameAr: "الأكسجين",
    ionNameAr: "أيون الأكسيد السالب (أنيون)",
    z: 8,
    chargeNumber: 2,
    neutralElectrons: 8,
    ionElectrons: 10,
    neutralConfig: "1s² 2s² 2p⁴",
    neutralNoble: "[He] 2s² 2p⁴",
    ionConfig: "1s² 2s² 2p⁶",
    ionNoble: "[Ne]",
    similarNobleGas: "النيون (Ne)",
    electronsGained: 2,
    gainedInto: "المستوى الفرعي 2p ليكتمل بـ 6 إلكترونات (2p⁶)",
    explanation: "تمتلك ذرة الأكسجين 6 إلكترونات تكافؤ (2s² 2p⁴). تكتسب إلكترونين في المدارين غير المزدوجين في 2p ليكتمل المستوى الثاني تماماً بثمانية إلكترونات (2s² 2p⁶)، محققةً توزيع غاز النيون الخامل المستقر (كتاب كيمياء 1 ص 87).",
    category: "لافلز - المجموعة 16 (كتاب كيمياء 1 ص 87)",
    textbookRef: "كتاب كيمياء 1، ص 87",
    orbitalsNeutral: {
      "1s": [1, -1],
      "2s": [1, -1],
      "2px": [1, -1], "2py": [1, 0], "2pz": [1, 0]
    },
    orbitalsIon: {
      "1s": [1, -1],
      "2s": [1, -1],
      "2px": [1, -1], "2py": [1, -1], "2pz": [1, -1]
    }
  },
  {
    id: "ion-n",
    type: "negative",
    elementSymbol: "N",
    ionSymbol: "N³⁻",
    nameAr: "النيتروجين",
    ionNameAr: "أيون النيتريد السالب (أنيون)",
    z: 7,
    chargeNumber: 3,
    neutralElectrons: 7,
    ionElectrons: 10,
    neutralConfig: "1s² 2s² 2p³",
    neutralNoble: "[He] 2s² 2p³",
    ionConfig: "1s² 2s² 2p⁶",
    ionNoble: "[Ne]",
    similarNobleGas: "النيون (Ne)",
    electronsGained: 3,
    gainedInto: "المستويات الفرعية الثلاثة في 2p ليكتمل بـ 6 إلكترونات",
    explanation: "تكتسب ذرة النيتروجين 3 إلكترونات لتكوين أيون النيتريد N³⁻ بإجمالي 10 إلكترونات مطابقة لغاز النيون المستقر (كتاب كيمياء 1 ص 86، وسؤال 54 ص 109).",
    category: "لافلز - المجموعة 15 (كتاب كيمياء 1 ص 86، ص 109)",
    textbookRef: "كتاب كيمياء 1، ص 86، وص 109 سؤال 54",
    orbitalsNeutral: null,
    orbitalsIon: null
  },
  {
    id: "ion-s",
    type: "negative",
    elementSymbol: "S",
    ionSymbol: "S²⁻",
    nameAr: "الكبريت",
    ionNameAr: "أيون الكبريتيد السالب (أنيون)",
    z: 16,
    chargeNumber: 2,
    neutralElectrons: 16,
    ionElectrons: 18,
    neutralConfig: "1s² 2s² 2p⁶ 3s² 3p⁴",
    neutralNoble: "[Ne] 3s² 3p⁴",
    ionConfig: "1s² 2s² 2p⁶ 3s² 3p⁶",
    ionNoble: "[Ar]",
    similarNobleGas: "الأرجون (Ar)",
    electronsGained: 2,
    gainedInto: "المستوى الفرعي 3p ليكتمل بـ 6 إلكترونات (3p⁶)",
    explanation: "تكتسب ذرة الكبريت إلكترونين في المستوى 3p ليكتمل بثمانية إلكترونات تكافؤ (3s² 3p⁶) مطابقة لغاز الأرجون (كتاب كيمياء 1 ص 87، وسؤال 50 الشكل 3-14 ص 109).",
    category: "لافلز - المجموعة 16 (كتاب كيمياء 1 ص 87)",
    textbookRef: "الشكل 3-14، ص 109 سؤال 50",
    orbitalsNeutral: null,
    orbitalsIon: null
  }
];

export const ionsPracticeQuiz = [
  {
    id: "q-ion-1",
    question: "ما هو التوزيع الإلكتروني الصحيح لأيون الألومنيوم Al³⁺ علماً بأن العدد الذري للألومنيوم Z = 13؟",
    options: [
      { text: "1s² 2s² 2p⁶", isCorrect: true, feedback: "إجابة صحيحة ومتقنة! ذرة Al تفقد 3 إلكترونات (إلكترون 3p¹ وإلكتروني 3s²) لتصبح 10 إلكترونات مطابقة لغاز النيون [Ne] (كتاب كيمياء 1 ص 85، ص 115)." },
      { text: "1s² 2s² 2p⁶ 3s² 3p¹", isCorrect: false, feedback: "هذا توزيع الذرة المتعادلة (13 إلكتروناً)، بينما الأيون Al³⁺ فقد 3 إلكترونات كاملة." },
      { text: "1s² 2s² 2p³ 3s² 3p¹", isCorrect: false, feedback: "خطأ علمي، الفقد يحدث من المستوى الخارجي الأعلى طاقة (المستوى الثالث n=3) أولاً وليس من المستوى الداخلي 2p." },
      { text: "1s² 2s² 2p⁶ 3s² 3p⁴", isCorrect: false, feedback: "هذا اكتساب لـ 3 إلكترونات، بينما إشارة +3 تعني فقد 3 إلكترونات." }
    ],
    hint: "شحنة +3 تعني فقد 3 إلكترونات كاملة من أعلى مستوى رئيسي n=3 (13 - 3 = 10 إلكترونات).",
    textbookRef: "كتاب كيمياء 1، ص 85، ص 115"
  },
  {
    id: "q-ion-2",
    question: "عند تكوين أيون الصوديوم الموجب Na⁺ من ذرة الصوديوم Na (Z = 11)، من أي مستوى فرعي يتم فقد الإلكترون أولاً؟",
    options: [
      { text: "من المستوى الفرعي 3s", isCorrect: true, feedback: "صحيح تماماً وفق كتاب الطالب ص 84-85! 3s هو أعلى مستوى طاقة رئيسي ويحتوي على إلكترون التكافؤ." },
      { text: "من المستوى الفرعي 2p", isCorrect: false, feedback: "خطأ، المستوى 2p داخلي وأقل طاقة، الفقد يبدأ دائماً من المستوى الخارجي الأبعد (n=3)." },
      { text: "من المستوى الفرعي 1s", isCorrect: false, feedback: "خطأ، 1s هو الأقرب للنواة والأشد ارتباطاً." },
      { text: "من المستوى الفرعي 2s", isCorrect: false, feedback: "خطأ، الفقد يكون من الغلاف الخارجي أولاً." }
    ],
    hint: "تذكري أن الفقد يتم دائماً من المستوى الرئيسي الأبعد عن النواة (n الأكبر وهو n=3).",
    textbookRef: "كتاب كيمياء 1، ص 84-85 الشكل 3-1"
  },
  {
    id: "q-ion-3",
    question: "ما هو عدد الإلكترونات في أيون الكلوريد Cl⁻ علماً بأن العدد الذري للكلور Z = 17؟",
    options: [
      { text: "18 إلكتروناً", isCorrect: true, feedback: "ممتاز! الشحنة السالبة (-1) تعني اكتساب إلكترون إضافي (17 + 1 = 18) ليماثل توزيع غاز الأرجون [Ar] (كتاب كيمياء 1 ص 86 الشكل 3-3)." },
      { text: "17 إلكتروناً", isCorrect: false, feedback: "17 هو عدد إلكترونات الذرة المتعادلة فقط." },
      { text: "16 إلكتروناً", isCorrect: false, feedback: "16 تعني فقد إلكترون وهذا غير صحيح للأيون السالب." },
      { text: "10 إلكترونات", isCorrect: false, feedback: "10 إلكترونات تمثل أيون فقد 7 إلكترونات، بينما الكلور لافلز يكتسب إلكتروناً." }
    ],
    hint: "الأيون السالب شحنته سالبة لأنه اكتسب إلكتروناً سالباً إضافياً (Z + الشحنة).",
    textbookRef: "كتاب كيمياء 1، ص 86 الشكل 3-3"
  },
  {
    id: "q-ion-4",
    question: "أي من الأيونات التالية يمتلك التوزيع الإلكتروني المستقر 1s² 2s² 2p⁶ (مشابه للنيون)؟",
    options: [
      { text: "جميع ما ذكر (Al³⁺ و Mg²⁺ و Na⁺ و O²⁻)", isCorrect: true, feedback: "رائع جداً! جميع هذه الأيونات متساوية في عدد الإلكترونات (Isoelectronic) وتحتوي على 10 إلكترونات مماثلة للغاز النبيل النيون [Ne] (كتاب كيمياء 1 ص 85-87)." },
      { text: "Na⁺ فقط", isCorrect: false, feedback: "Na⁺ يمتلك هذا التوزيع بالفعل، ولكن هناك أيونات أخرى تماثله أيضاً." },
      { text: "O²⁻ فقط", isCorrect: false, feedback: "O²⁻ يمتلك هذا التوزيع بعد اكتساب إلكترونين، ولكن الأيونات الموجبة المذكورة تمتلكه أيضاً بعد الفقد." },
      { text: "Al³⁺ فقط", isCorrect: false, feedback: "Al³⁺ يمتلكه بعد فقد 3 إلكترونات، لكن الخيارات الأخرى أيضاً تشترك معه في ذلك." }
    ],
    hint: "احسبي عدد إلكترونات كل أيون: Al³⁺ (13-3=10), Na⁺ (11-1=10), Mg²⁺ (12-2=10), O²⁻ (8+2=10).",
    textbookRef: "كتاب كيمياء 1، ص 85-87"
  },
  {
    id: "q-ion-5",
    question: "عند تحول ذرة الحديد Fe: [Ar] 4s² 3d⁶ إلى أيون الحديدوز Fe²⁺، ما هو التوزيع الإلكتروني الصحيح للأيون الناتج؟",
    options: [
      { text: "[Ar] 3d⁶", isCorrect: true, feedback: "إتقان فائق! فقد الإلكترونات يحدث من المستوى 4s أولاً لأنه ذو رقم الكم الرئيس الأكبر (n=4)، على الرغم من أن 4s ملئ قبل 3d في أوفباو (كتاب كيمياء 1 ص 85، وسؤال 56 ص 109)." },
      { text: "[Ar] 4s² 3d⁴", isCorrect: false, feedback: "خطأ شائع! تعتقد بعض الطالبات أن الفقد يكون من آخر مستوى كُتب (3d)، ولكن القاعدة العلمية تنص على الفقد من n الأكبر أولاً (4s)." },
      { text: "[Ar] 4s¹ 3d⁵", isCorrect: false, feedback: "هذا توزيع ذرة الكروم المتعادلة، وليس أيون الحديدوز." },
      { text: "[Ar] 4s² 3d⁶", isCorrect: false, feedback: "هذا توزيع الذرة المتعادلة دون أي فقد." }
    ],
    hint: "القاعدة الذهبية في الفلزات الانتقالية: الفقد يحدث دائماً من 4s قبل 3d لأن n=4 أعلى مستوى رئيسي.",
    textbookRef: "كتاب كيمياء 1، ص 85، وسؤال 56 ص 109"
  },
  {
    id: "q-ion-6",
    question: "ماذا يُسمى التوزيع الإلكتروني لأيون الخارصين Zn²⁺: [Ar] 3d¹⁰ وفق كتاب كيمياء 1؟",
    options: [
      { text: "التوزيع الإلكتروني الشبيه بالغاز النبيل (Pseudo-noble gas)", isCorrect: true, feedback: "ممتاز! ينص كتاب كيمياء 1 ص 86 على أن امتلاء مستويات s, p, d بالكامل في أيون الخارصين Zn²⁺ يُسمى التوزيع الإلكتروني الشبيه بالغاز النبيل." },
      { text: "التوزيع الإلكتروني غير المستقر", isCorrect: false, feedback: "بل هو توزيع مستقر جداً بسبب الامتلاء التام لمستويات s, p, d." },
      { text: "توزيع قاعدة هوند المنفردة", isCorrect: false, feedback: "غير صحيح، مستوياته ممتلئة تماماً وليست منفردة." },
      { text: "توزيع حالة الإثارة", isCorrect: false, feedback: "هو توزيع حالة مستقرة للأيون." }
    ],
    hint: "راجعي الشكل 3-2 ص 86 في كتاب الطالب تحت عنوان 'أيونات الفلزات الانتقالية'.",
    textbookRef: "كتاب كيمياء 1، ص 86 الشكل 3-2"
  }
];
