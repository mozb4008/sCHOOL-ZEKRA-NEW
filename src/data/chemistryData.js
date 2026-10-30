// Chemistry Elements & Scientific Dataset (Z = 1 to 36)
// Aligned strictly with the Saudi Ministry of Education Chemistry 1 Textbook (كتاب كيمياء 1 - نظام المسارات)
// Reference: Kimia.pdf (الفصل 1: الإلكترونات في الذرات ص 32-38، والفصل 3: المركبات الأيونية والفلزات ص 84-87)

export const textbookReference = {
  bookTitle: "كيمياء 1 (نظام المسارات) - المرحلة الثانوية",
  publisher: "وزارة التعليم - المملكة العربية السعودية",
  sourceFile: "Kimia.pdf",
  chapters: [
    {
      number: 1,
      title: "الإلكترونات في الذرات (Electrons in Atoms)",
      pages: "10 - 47",
      lessons: [
        { code: "1-1", title: "الضوء وطاقة الكم", pages: "12 - 21" },
        { code: "1-2", title: "نظرية الكم والذرة", pages: "22 - 31" },
        { code: "1-3", title: "التوزيع الإلكتروني", pages: "32 - 38" }
      ],
      reviewPages: "40 - 45",
      standardizedTestPages: "46 - 47"
    },
    {
      number: 3,
      title: "المركبات الأيونية والفلزات (Ionic Compounds and Metals)",
      pages: "82 - 115",
      lessons: [
        { code: "3-1", title: "تكوّن الأيون (Ion Formation)", pages: "84 - 87" },
        { code: "3-2", title: "الروابط الأيونية والمركبات الأيونية", pages: "88 - 95" },
        { code: "3-3", title: "صيغ المركبات الأيونية وأسماؤها", pages: "96 - 102" },
        { code: "3-4", title: "الروابط الفلزية وخواص الفلزات", pages: "103 - 107" }
      ],
      reviewPages: "108 - 114",
      standardizedTestPages: "115"
    }
  ]
};

// Official Textbook Rules & Definitions (النصوص النظامية من كتاب الطالب ودليل المصطلحات)
export const textbookRules = {
  electronConfiguration: {
    title: "التوزيع الإلكتروني (Electron Configuration)",
    bookDefinition: "ترتيب الإلكترونات في الذرة. ولأن الأنظمة ذات الطاقة المنخفضة أكثر استقراراً من الأنظمة ذات الطاقة العالية فإن الإلكترونات تميل إلى اتخاذ ترتيب يُعطي الذرة أقل طاقة ممكنة، ويُسمى التوزيع الإلكتروني في الحالة المستقرة.",
    glossaryDefinition: "ترتيب الإلكترونات في الذرة وفقاً لثلاث قواعد، هي: مبدأ أوفباو، ومبدأ باولي، وقاعدة هوند.",
    bookPage: 32,
    glossaryPage: 318
  },
  aufbau: {
    title: "مبدأ أوفباو - البناء التصاعدي (Aufbau Principle)",
    bookDefinition: "ينص على أن كل إلكترون يشغل المستوى الأقل طاقة.",
    etymology: "اشتقت كلمة Aufbau من الكلمة الألمانية aufbauen والتي تعني (يهيئ أو يرتب).",
    glossaryDefinition: "ينص على أن كل إلكترون يسعى لأن يكون في المستوى الأقل طاقة.",
    bookPage: 32,
    glossaryPage: 322,
    tableProperties: [
      { id: 1, text: "طاقة المستويات الفرعية في المستوى الثانوي جميعها متساوية", example: "المستويات الفرعية الثلاثة في المستوى الثانوي 2p جميعها متساوية الطاقة." },
      { id: 2, text: "في الذرة المتعددة الإلكترونات تكون طاقة المستويات الثانوية المختلفة ضمن مستوى الطاقة الرئيس الواحد مختلفة", example: "طاقة المستويات الفرعية الثلاثة في 2p أعلى من طاقة المستوى الفرعي 2s." },
      { id: 3, text: "تسلسل زيادة طاقة المستويات الثانوية ضمن مستوى الطاقة الرئيس الواحد هو s, p, d, f", example: "إذا كان n=4 فسيكون التسلسل لمستويات الطاقة الثانوية: 4s, 4p, 4d, 4f." },
      { id: 4, text: "تستطيع مستويات الطاقة الثانوية لمستوى رئيس أن تتداخل مع مستويات الطاقة الثانوية لمستوى رئيس آخر", example: "تكون طاقة المستوى الفرعي 4s أقل من طاقة المستويات الفرعية الخمسة في 3d، لذلك يملأ 4s أولاً." }
    ]
  },
  pauli: {
    title: "مبدأ باولي للاستبعاد (Pauli Exclusion Principle)",
    bookDefinition: "ينص على أن عدد إلكترونات المستوى الفرعي الواحد لا يزيد عن إلكترونين، ويدور كل منهما حول نفسه باتجاه معاكس للآخر (غزل متعاكس ↑↓).",
    glossaryDefinition: "ينص على أن المستوى لا يمكن أن يتسع لأكثر من إلكترونين، على ألا يكون لهما نفس اتجاه الحركة.",
    maxCapacityFormula: "الحد الأعلى للإلكترونات في مستوى الطاقة الرئيس يساوي 2n².",
    bookPage: 33,
    glossaryPage: 322
  },
  hund: {
    title: "قاعدة هوند (Hund's Rule)",
    bookDefinition: "تنص على أن الإلكترونات تتوزع في المستويات الفرعية المتساوية الطاقة بحيث تحافظ على أن يكون لها الاتجاه نفسه من حيث الدوران، قبل أن تشغل الإلكترونات الإضافية ذات اتجاه الدوران المعاكس المستويات نفسها.",
    glossaryDefinition: "تنص على أن تعبئة الإلكترونات في المجالات المتساوية الطاقة يتم بشكل فردي قبل البدء بإضافة الإلكترون الثاني للمجال نفسه؛ إذ لا يمكن لإلكترونين لهما نفس اتجاه الحركة أن يشغلا المجال نفسه.",
    reason: "إن حقيقة تنافر الإلكترونات المشحونة بشحنة سالبة تجعلها تفضل الانفراد في المدارات أولاً لتقليل قوى التنافر الكهربائي إلى أدنى حد ممكن.",
    bookPage: 33,
    glossaryPage: 321
  },
  valenceElectrons: {
    title: "إلكترونات التكافؤ (Valence Electrons)",
    bookDefinition: "إلكترونات المستوى الخارجي للذرة (مستوى الطاقة الرئيس الأخير)، وهي التي تحدد الخواص الكيميائية للعنصر.",
    glossaryDefinition: "الإلكترونات في مجال الطاقة الأخير في الذرة، والتي تحدد الخواص الكيميائية لهذه الذرة.",
    bookPage: 37,
    glossaryPage: 317
  },
  lewisStructure: {
    title: "التمثيل النقطي للإلكترونات - تمثيل لويس (Electron-Dot Structure)",
    bookDefinition: "طريقة مختصرة يمثل فيها رمز العنصر نواة الذرة ومستويات الطاقة الداخلية محاطاً بنقاط تمثل إلكترونات المستوى الخارجي (إلكترونات التكافؤ) جميعها. اقترحها الكيميائي الأمريكي لويس (G. N. Lewis) عام 1902م.",
    glossaryDefinition: "طريقة تمثيل إلكترونات التكافؤ حول رمز العنصر باستعمال النقط.",
    rule: "توضع نقطة واحدة في كل مرة على الجوانب الأربعة للرمز (دون مراعاة التسلسل)، ثم تكرر العملية لتصبح النقاط في صورة أزواج حتى تُستخدم إلكترونات التكافؤ جميعها.",
    bookPage: 37,
    glossaryPage: 318
  },
  octetRule: {
    title: "قاعدة الثمانيات (Octet Rule)",
    bookDefinition: "تميل الذرات إلى اكتساب الإلكترونات أو فقدانها أو مشاركتها لتحصل على ثمانية إلكترونات تكافؤ مستقرة في مستوى طاقتها الأخير، شبيهة بالتوزيع الإلكتروني للغاز النبيل.",
    glossaryDefinition: "تنص على أن الذرات تسعى إلى اكتساب الإلكترونات أو خسارتها أو المشاركة بها؛ لكي تصل للتركيب الإلكتروني للغاز النبيل.",
    bookPage: 84,
    glossaryPage: 321
  },
  exceptions: {
    title: "استثناءات التوزيع الإلكتروني (Cr & Cu)",
    bookDefinition: "توضح التوزيعات الإلكترونية لعنصري الكروم والنحاس حالة الاستقرار الفائق للمستويات نصف الممتلئة والممتلئة تماماً في المجال الفرعي d.",
    chromium: {
      symbol: "Cr",
      z: 24,
      expected: "[Ar] 4s² 3d⁴",
      actual: "[Ar] 4s¹ 3d⁵",
      reason: "ينتقل إلكترون من 4s إلى 3d ليكون كلا المستويين نصف ممتلئين (4s¹ 3d⁵)، مما يعطي الذرة أقصى درجات التماثل الفراغي وأقل طاقة ممكنة (أكثر ثباتاً)."
    },
    copper: {
      symbol: "Cu",
      z: 29,
      expected: "[Ar] 4s² 3d⁹",
      actual: "[Ar] 4s¹ 3d¹⁰",
      reason: "الامتلاء التام للمستوى 3d بعشرة إلكترونات (3d¹⁰) يمنح الذرة استقراراً هائلاً يفوق بقاء 4s ممتلئاً، فينتقل إلكترون من 4s ليصبح التوزيع [Ar] 4s¹ 3d¹⁰."
    },
    bookPage: 36
  }
};

// Methods of electron configuration representation (طرائق تمثيل التوزيع ص 34-35)
export const methodsOfRepresentation = [
  {
    id: "orbital_box",
    nameAr: "رسم مربعات المستويات (Orbital Filling Diagram)",
    description: "يُعبر عن المستويات الفرعية بمربعات، وتُمثل الإلكترونات بأسهم ذات اتجاه دوران محدد (↑ لأعلى، ↓ لأسفل، أو ↑↓ لزوج إلكتروني ذي غزل متعاكس).",
    bookPage: 34
  },
  {
    id: "electron_notation",
    nameAr: "الترميز الإلكتروني (Electron Configuration Notation)",
    description: "يعبر عن مستوى الطاقة الرئيس والمستويات الثانوية المرتبطة به، ويتضمن أُساً يمثل عدد الإلكترونات في المستوى (مثال للكربون: 1s² 2s² 2p²).",
    bookPage: 34
  },
  {
    id: "noble_gas",
    nameAr: "ترميز الغاز النبيل - الطريقة المختصرة (Noble Gas Notation)",
    description: "طريقة مختصرة لتمثيل التوزيع بالاستعانة بالغاز النبيل الذي يسبق العنصر في الجدول الدوري، حيث توضع رموزه بين قوسين مربعين مثل [He]، [Ne]، [Ar].",
    bookPage: 35
  }
];

// Chemistry elements dataset (Z = 1 to 36)
// Aligned with Table 1-6 (p. 34), Table 1-7 (p. 35), Exceptions (p. 36), Periodic Table (p. 324)
export const elementsData = [
  {
    z: 1,
    symbol: "H",
    nameAr: "الهيدروجين",
    nameEn: "Hydrogen",
    config: "1s¹",
    nobleConfig: "1s¹",
    valenceElectrons: 1,
    period: 1,
    group: 1,
    block: "s",
    orbitals: {
      "1s": [1, 0]
    },
    funFact: "أبسط ذرة في الكون، وتحتوي على إلكترون وحيد يدور حول بروتون واحد في المستوى 1s (كتاب كيمياء 1، الجدول 1-6 ص 34)."
  },
  {
    z: 2,
    symbol: "He",
    nameAr: "الهيليوم",
    nameEn: "Helium",
    config: "1s²",
    nobleConfig: "[He]",
    valenceElectrons: 2,
    period: 1,
    group: 18,
    block: "s",
    orbitals: {
      "1s": [1, -1]
    },
    funFact: "غاز نبيل ذو مستوى طاقة أول مكتمل ومستقر بإلكترونين متعاكسي الغزل (كتاب كيمياء 1، الجدول 1-6 ص 34)."
  },
  {
    z: 3,
    symbol: "Li",
    nameAr: "الليثيوم",
    nameEn: "Lithium",
    config: "1s² 2s¹",
    nobleConfig: "[He] 2s¹",
    valenceElectrons: 1,
    period: 2,
    group: 1,
    block: "s",
    orbitals: {
      "1s": [1, -1],
      "2s": [1, 0]
    },
    funFact: "فلز قلوي خفيف، يبدأ بملء المستوى الرئيس الثاني n=2 بإلكترون تكافؤ وحيد (الجدول 1-6 ص 34)."
  },
  {
    z: 4,
    symbol: "Be",
    nameAr: "البيريليوم",
    nameEn: "Beryllium",
    config: "1s² 2s²",
    nobleConfig: "[He] 2s²",
    valenceElectrons: 2,
    period: 2,
    group: 2,
    block: "s",
    orbitals: {
      "1s": [1, -1],
      "2s": [1, -1]
    },
    funFact: "يمتلك مجال 2s ممتلئاً تماماً بإلكترونين متعاكسي الغزل وفق مبدأ باولي (الجدول 1-6 ص 34)."
  },
  {
    z: 5,
    symbol: "B",
    nameAr: "البورون",
    nameEn: "Boron",
    config: "1s² 2s² 2p¹",
    nobleConfig: "[He] 2s² 2p¹",
    valenceElectrons: 3,
    period: 2,
    group: 13,
    block: "p",
    orbitals: {
      "1s": [1, -1],
      "2s": [1, -1],
      "2px": [1, 0],
      "2py": [0, 0],
      "2pz": [0, 0]
    },
    funFact: "أول عنصر يبدأ بشغل المستوى الفرعي 2p ذي الشكل الفصي (الجدول 1-6 ص 34)."
  },
  {
    z: 6,
    symbol: "C",
    nameAr: "الكربون",
    nameEn: "Carbon",
    config: "1s² 2s² 2p²",
    nobleConfig: "[He] 2s² 2p²",
    valenceElectrons: 4,
    period: 2,
    group: 14,
    block: "p",
    orbitals: {
      "1s": [1, -1],
      "2s": [1, -1],
      "2px": [1, 0],
      "2py": [1, 0],
      "2pz": [0, 0]
    },
    funFact: "مثال كتاب الطالب على قاعدة هوند: يدخل الإلكترونان في مستويين فرعيين منفصلين (2px, 2py) بنفس اتجاه الغزل (ص 34)."
  },
  {
    z: 7,
    symbol: "N",
    nameAr: "النيتروجين",
    nameEn: "Nitrogen",
    config: "1s² 2s² 2p³",
    nobleConfig: "[He] 2s² 2p³",
    valenceElectrons: 5,
    period: 2,
    group: 15,
    block: "p",
    orbitals: {
      "1s": [1, -1],
      "2s": [1, -1],
      "2px": [1, 0],
      "2py": [1, 0],
      "2pz": [1, 0]
    },
    funFact: "المستوى الفرعي 2p نصف ممتلئ بـ 3 إلكترونات منفردة متوازية الغزل (↑ ↑ ↑) مما يمنحه ثباتاً كبيراً (ص 34)."
  },
  {
    z: 8,
    symbol: "O",
    nameAr: "الأكسجين",
    nameEn: "Oxygen",
    config: "1s² 2s² 2p⁴",
    nobleConfig: "[He] 2s² 2p⁴",
    valenceElectrons: 6,
    period: 2,
    group: 16,
    block: "p",
    orbitals: {
      "1s": [1, -1],
      "2s": [1, -1],
      "2px": [1, -1],
      "2py": [1, 0],
      "2pz": [1, 0]
    },
    funFact: "يبدأ الازدواج في المستوى 2p بإلكترون ذي دوران مغزلي معاكس في أول مدار وفق قاعدتي باولي وهوند (ص 34)."
  },
  {
    z: 9,
    symbol: "F",
    nameAr: "الفلور",
    nameEn: "Fluorine",
    config: "1s² 2s² 2p⁵",
    nobleConfig: "[He] 2s² 2p⁵",
    valenceElectrons: 7,
    period: 2,
    group: 17,
    block: "p",
    orbitals: {
      "1s": [1, -1],
      "2s": [1, -1],
      "2px": [1, -1],
      "2py": [1, -1],
      "2pz": [1, 0]
    },
    funFact: "هالوجين نشط، يمتلك 7 إلكترونات تكافؤ وينقصه إلكترون وحيد لتحقيق التركيب الثماني المستقر (ص 34)."
  },
  {
    z: 10,
    symbol: "Ne",
    nameAr: "النيون",
    nameEn: "Neon",
    config: "1s² 2s² 2p⁶",
    nobleConfig: "[Ne]",
    valenceElectrons: 8,
    period: 2,
    group: 18,
    block: "p",
    orbitals: {
      "1s": [1, -1],
      "2s": [1, -1],
      "2px": [1, -1],
      "2py": [1, -1],
      "2pz": [1, -1]
    },
    funFact: "غاز نبيل تنتهي به الدورة الثانية؛ مستواه الرئيس الثاني مكتمل تماماً بـ 8 إلكترونات (قاعدة الثمانيات المستقرة ص 34)."
  },
  {
    z: 11,
    symbol: "Na",
    nameAr: "الصوديوم",
    nameEn: "Sodium",
    config: "1s² 2s² 2p⁶ 3s¹",
    nobleConfig: "[Ne] 3s¹",
    valenceElectrons: 1,
    period: 3,
    group: 1,
    block: "s",
    orbitals: {
      "1s": [1, -1],
      "2s": [1, -1],
      "2px": [1, -1], "2py": [1, -1], "2pz": [1, -1],
      "3s": [1, 0]
    },
    funFact: "مثال كتاب الطالب على ترميز الغاز النبيل: يختصر توزيعه إلى [Ne] 3s¹ (الجدول 1-7 ص 35، وتكوّن الكاتيون ص 84)."
  },
  {
    z: 12,
    symbol: "Mg",
    nameAr: "الماغنسيوم",
    nameEn: "Magnesium",
    config: "1s² 2s² 2p⁶ 3s²",
    nobleConfig: "[Ne] 3s²",
    valenceElectrons: 2,
    period: 3,
    group: 2,
    block: "s",
    orbitals: {
      "1s": [1, -1],
      "2s": [1, -1],
      "2px": [1, -1], "2py": [1, -1], "2pz": [1, -1],
      "3s": [1, -1]
    },
    funFact: "فلز قلوي أرضي يحتوي على إلكتروني تكافؤ في 3s، ويفقدهما ليكوّن أيون Mg²⁺ المستقر (ص 35، ص 85)."
  },
  {
    z: 13,
    symbol: "Al",
    nameAr: "الألومنيوم",
    nameEn: "Aluminium",
    config: "1s² 2s² 2p⁶ 3s² 3p¹",
    nobleConfig: "[Ne] 3s² 3p¹",
    valenceElectrons: 3,
    period: 3,
    group: 13,
    block: "p",
    orbitals: {
      "1s": [1, -1],
      "2s": [1, -1],
      "2px": [1, -1], "2py": [1, -1], "2pz": [1, -1],
      "3s": [1, -1],
      "3px": [1, 0], "3py": [0, 0], "3pz": [0, 0]
    },
    funFact: "فلز من المجموعة 13، يفقد 3 إلكترونات (إلكترون 3p¹ ثم إلكتروني 3s²) ليكوّن كاتيون Al³⁺ بـ 10 إلكترونات (ص 35، ص 85)."
  },
  {
    z: 14,
    symbol: "Si",
    nameAr: "السليكون",
    nameEn: "Silicon",
    config: "1s² 2s² 2p⁶ 3s² 3p²",
    nobleConfig: "[Ne] 3s² 3p²",
    valenceElectrons: 4,
    period: 3,
    group: 14,
    block: "p",
    orbitals: {
      "1s": [1, -1],
      "2s": [1, -1],
      "2px": [1, -1], "2py": [1, -1], "2pz": [1, -1],
      "3s": [1, -1],
      "3px": [1, 0], "3py": [1, 0], "3pz": [0, 0]
    },
    funFact: "شبه فلز شهير في صناعة الرقائق الإلكترونية، يمتلك 4 إلكترونات تكافؤ [Ne] 3s² 3p² (ص 35)."
  },
  {
    z: 15,
    symbol: "P",
    nameAr: "الفوسفور",
    nameEn: "Phosphorus",
    config: "1s² 2s² 2p⁶ 3s² 3p³",
    nobleConfig: "[Ne] 3s² 3p³",
    valenceElectrons: 5,
    period: 3,
    group: 15,
    block: "p",
    orbitals: {
      "1s": [1, -1],
      "2s": [1, -1],
      "2px": [1, -1], "2py": [1, -1], "2pz": [1, -1],
      "3s": [1, -1],
      "3px": [1, 0], "3py": [1, 0], "3pz": [1, 0]
    },
    funFact: "يمتلك 5 إلكترونات تكافؤ، ومستواه 3p نصف ممتلئ بـ 3 إلكترونات مفردة (الجدول 1-7 ص 35، ص 87)."
  },
  {
    z: 16,
    symbol: "S",
    nameAr: "الكبريت",
    nameEn: "Sulfur",
    config: "1s² 2s² 2p⁶ 3s² 3p⁴",
    nobleConfig: "[Ne] 3s² 3p⁴",
    valenceElectrons: 6,
    period: 3,
    group: 16,
    block: "p",
    orbitals: {
      "1s": [1, -1],
      "2s": [1, -1],
      "2px": [1, -1], "2py": [1, -1], "2pz": [1, -1],
      "3s": [1, -1],
      "3px": [1, -1], "3py": [1, 0], "3pz": [1, 0]
    },
    funFact: "مثال كتاب الطالب على إلكترونات التكافؤ (ص 37): ستة إلكترونات في المستوى الخارجي تشارك في التفاعل."
  },
  {
    z: 17,
    symbol: "Cl",
    nameAr: "الكلور",
    nameEn: "Chlorine",
    config: "1s² 2s² 2p⁶ 3s² 3p⁵",
    nobleConfig: "[Ne] 3s² 3p⁵",
    valenceElectrons: 7,
    period: 3,
    group: 17,
    block: "p",
    orbitals: {
      "1s": [1, -1],
      "2s": [1, -1],
      "2px": [1, -1], "2py": [1, -1], "2pz": [1, -1],
      "3s": [1, -1],
      "3px": [1, -1], "3py": [1, -1], "3pz": [1, 0]
    },
    funFact: "مثال كتاب الطالب على تكوّن الأنيون Cl⁻ (ص 86 الشكل 3-3): يكتسب إلكتروناً في 3p ليكتمل بـ 18 إلكتروناً مثل غاز الأرجون."
  },
  {
    z: 18,
    symbol: "Ar",
    nameAr: "الأرجون",
    nameEn: "Argon",
    config: "1s² 2s² 2p⁶ 3s² 3p⁶",
    nobleConfig: "[Ar]",
    valenceElectrons: 8,
    period: 3,
    group: 18,
    block: "p",
    orbitals: {
      "1s": [1, -1],
      "2s": [1, -1],
      "2px": [1, -1], "2py": [1, -1], "2pz": [1, -1],
      "3s": [1, -1],
      "3px": [1, -1], "3py": [1, -1], "3pz": [1, -1]
    },
    funFact: "الغاز النبيل المستقر الذي تختتم به الدورة الثالثة بـ 8 إلكترونات تكافؤ [Ne] 3s² 3p⁶ (ص 35)."
  },
  {
    z: 19,
    symbol: "K",
    nameAr: "البوتاسيوم",
    nameEn: "Potassium",
    config: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s¹",
    nobleConfig: "[Ar] 4s¹",
    valenceElectrons: 1,
    period: 4,
    group: 1,
    block: "s",
    orbitals: {
      "4s": [1, 0]
    },
    funFact: "وفق مبدأ أوفباو، طاقة 4s أقل من 3d، لذلك يملأ المستوى 4s أولاً بالإلكترون التاسع عشر (ص 33 الجدول 1-5، وص 85)."
  },
  {
    z: 20,
    symbol: "Ca",
    nameAr: "الكالسيوم",
    nameEn: "Calcium",
    config: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s²",
    nobleConfig: "[Ar] 4s²",
    valenceElectrons: 2,
    period: 4,
    group: 2,
    block: "s",
    orbitals: {
      "4s": [1, -1]
    },
    funFact: "يكتمل المستوى 4s بإلكترونين قبل البدء بملء مستويات 3d (كتاب كيمياء 1 ص 38 سؤال 28، ص 87 سؤال 5)."
  },
  {
    z: 21,
    symbol: "Sc",
    nameAr: "الإسكانديوم",
    nameEn: "Scandium",
    config: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹",
    nobleConfig: "[Ar] 4s² 3d¹",
    valenceElectrons: 2,
    period: 4,
    group: 3,
    block: "d",
    orbitals: {
      "4s": [1, -1],
      "3d1": [1, 0], "3d2": [0, 0], "3d3": [0, 0], "3d4": [0, 0], "3d5": [0, 0]
    },
    funFact: "أول عنصر انتقالي رئيسي، يبدأ بإضافة الإلكترونات للمستوى الفرعي 3d (الاختبار المقنن ص 46-47 سؤال 8)."
  },
  {
    z: 22,
    symbol: "Ti",
    nameAr: "التيتانيوم",
    nameEn: "Titanium",
    config: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d²",
    nobleConfig: "[Ar] 4s² 3d²",
    valenceElectrons: 2,
    period: 4,
    group: 4,
    block: "d",
    funFact: "فلز انتقالي صلب وخفيف يُستخدم في هياكل الطائرات والمفاصل الصناعية (ص 36 سؤال 20)."
  },
  {
    z: 23,
    symbol: "V",
    nameAr: "الفاناديوم",
    nameEn: "Vanadium",
    config: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d³",
    nobleConfig: "[Ar] 4s² 3d³",
    valenceElectrons: 2,
    period: 4,
    group: 5,
    block: "d",
    funFact: "فلز انتقالي يملأ 3 مستويات فرعية في 3d بإلكترونات مفردة متوازية (ص 36، ص 46 الجدول)."
  },
  {
    z: 24,
    symbol: "Cr",
    nameAr: "الكروم",
    nameEn: "Chromium",
    config: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s¹ 3d⁵",
    nobleConfig: "[Ar] 4s¹ 3d⁵",
    valenceElectrons: 1,
    period: 4,
    group: 6,
    block: "d",
    isException: true,
    exceptionReason: "استثناء كيميائي مقرر في كتاب كيمياء 1 ص 36: ينتقل إلكترون من 4s إلى 3d ليصبح كلا المستويين نصف ممتلئين (4s¹ 3d⁵)، مما يوفر حالة استقرار طاقي أعلى وتماثلاً فراغياً.",
    orbitals: {
      "4s": [1, 0],
      "3d1": [1, 0], "3d2": [1, 0], "3d3": [1, 0], "3d4": [1, 0], "3d5": [1, 0]
    },
    funFact: "أشهر استثناء مقرر في كيمياء 1: حالة نصف الامتلاء 4s¹ 3d⁵ تجعل الذرة أكثر استقراراً من 4s² 3d⁴ (ص 36)."
  },
  {
    z: 25,
    symbol: "Mn",
    nameAr: "المنجنيز",
    nameEn: "Manganese",
    config: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁵",
    nobleConfig: "[Ar] 4s² 3d⁵",
    valenceElectrons: 2,
    period: 4,
    group: 7,
    block: "d",
    funFact: "عنصر انتقالي يمتلك مجال 3d نصف ممتلئ بـ 5 إلكترونات ومجال 4s ممتلئ بـ 2 (ص 44)."
  },
  {
    z: 26,
    symbol: "Fe",
    nameAr: "الحديد",
    nameEn: "Iron",
    config: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁶",
    nobleConfig: "[Ar] 4s² 3d⁶",
    valenceElectrons: 2,
    period: 4,
    group: 8,
    block: "d",
    orbitals: {
      "4s": [1, -1],
      "3d1": [1, -1], "3d2": [1, 0], "3d3": [1, 0], "3d4": [1, 0], "3d5": [1, 0]
    },
    funFact: "فلز انتقالي يكوّن Fe²⁺ بفقد إلكتروني 4s أولاً ليصبح [Ar] 3d⁶، و Fe³⁺ بفقد إلكترون إضافي من 3d ليصبح [Ar] 3d⁵ الأكثر استقراراً (كتاب كيمياء 1 ص 85، ص 109 سؤال 56)."
  },
  {
    z: 27,
    symbol: "Co",
    nameAr: "الكوبالت",
    nameEn: "Cobalt",
    config: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁷",
    nobleConfig: "[Ar] 4s² 3d⁷",
    valenceElectrons: 2,
    period: 4,
    group: 9,
    block: "d",
    funFact: "عنصر انتقالي مغناطيسي يُستخدم في السبائك المغناطيسية الفائقة (ص 44 سؤال 92)."
  },
  {
    z: 28,
    symbol: "Ni",
    nameAr: "النيكل",
    nameEn: "Nickel",
    config: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁸",
    nobleConfig: "[Ar] 4s² 3d⁸",
    valenceElectrons: 2,
    period: 4,
    group: 10,
    block: "d",
    funFact: "فلز انتقالي مقاوم للتآكل يُستخدم في طلاء المعادن والعملات والسبائك (ص 296 دليل العناصر)."
  },
  {
    z: 29,
    symbol: "Cu",
    nameAr: "النحاس",
    nameEn: "Copper",
    config: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s¹ 3d¹⁰",
    nobleConfig: "[Ar] 4s¹ 3d¹⁰",
    valenceElectrons: 1,
    period: 4,
    group: 11,
    block: "d",
    isException: true,
    exceptionReason: "استثناء كيميائي مقرر في كتاب كيمياء 1 ص 36: ينتقل إلكترون من 4s إلى 3d ليكتمل المستوى الفرعي 3d تماماً بـ 10 إلكترونات (3d¹⁰)، مما يحقق استقراراً هائلاً بسبب الامتلاء التام.",
    orbitals: {
      "4s": [1, 0],
      "3d1": [1, -1], "3d2": [1, -1], "3d3": [1, -1], "3d4": [1, -1], "3d5": [1, -1]
    },
    funFact: "استثناء الامتلاء التام: [Ar] 4s¹ 3d¹⁰ أكثر استقراراً بكثير في الطبيعة من [Ar] 4s² 3d⁹ (ص 36)."
  },
  {
    z: 30,
    symbol: "Zn",
    nameAr: "الخارصين",
    nameEn: "Zinc",
    config: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹⁰",
    nobleConfig: "[Ar] 4s² 3d¹⁰",
    valenceElectrons: 2,
    period: 4,
    group: 12,
    block: "d",
    orbitals: {
      "4s": [1, -1],
      "3d1": [1, -1], "3d2": [1, -1], "3d3": [1, -1], "3d4": [1, -1], "3d5": [1, -1]
    },
    funFact: "مثال كتاب الطالب على التوزيع الشبيه بالغاز النبيل: عند تكوين أيون الخارصين Zn²⁺ يفقد إلكتروني 4s ويتبقى [Ar] 3d¹⁰ بمستويات s, p, d ممتلئة تماماً (ص 86 الشكل 3-2)."
  },
  {
    z: 31,
    symbol: "Ga",
    nameAr: "الجاليوم",
    nameEn: "Gallium",
    config: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹⁰ 4p¹",
    nobleConfig: "[Ar] 4s² 3d¹⁰ 4p¹",
    valenceElectrons: 3,
    period: 4,
    group: 13,
    block: "p",
    funFact: "فلز يمتلك 3 إلكترونات تكافؤ (4s² 4p¹)، وينصهر عند درجة حرارة اليد (ص 43 سؤال 79)."
  },
  {
    z: 32,
    symbol: "Ge",
    nameAr: "الجرمانيوم",
    nameEn: "Germanium",
    config: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹⁰ 4p²",
    nobleConfig: "[Ar] 4s² 3d¹⁰ 4p²",
    valenceElectrons: 4,
    period: 4,
    group: 14,
    block: "p",
    funFact: "موضوع سؤال تفكير وتحدي في الاختبار المقنن للفصل الأول (ص 47 سؤال 17): ترتيب المستويات فيه يوجب ملء 3d قبل 4p."
  },
  {
    z: 33,
    symbol: "As",
    nameAr: "الزرنيخ",
    nameEn: "Arsenic",
    config: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹⁰ 4p³",
    nobleConfig: "[Ar] 4s² 3d¹⁰ 4p³",
    valenceElectrons: 5,
    period: 4,
    group: 15,
    block: "p",
    funFact: "شبه فلز يمتلك 5 إلكترونات تكافؤ، ومستواه 4p نصف ممتلئ بـ 3 إلكترونات (ص 44 سؤال 86، 87)."
  },
  {
    z: 34,
    symbol: "Se",
    nameAr: "السيلينيوم",
    nameEn: "Selenium",
    config: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹⁰ 4p⁴",
    nobleConfig: "[Ar] 4s² 3d¹⁰ 4p⁴",
    valenceElectrons: 6,
    period: 4,
    group: 16,
    block: "p",
    funFact: "لافلز موصل ضوئياً، يمتلك 6 إلكترونات تكافؤ ويمثل تمثيله النقطي بـ 6 نقاط (ص 38 سؤال 32)."
  },
  {
    z: 35,
    symbol: "Br",
    nameAr: "البروم",
    nameEn: "Bromine",
    config: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹⁰ 4p⁵",
    nobleConfig: "[Ar] 4s² 3d¹⁰ 4p⁵",
    valenceElectrons: 7,
    period: 4,
    group: 17,
    block: "p",
    funFact: "هالوجين سائل، يكتسب إلكتروناً واحداً ليكوّن أيون البروميد Br⁻ المستقر (ص 36 سؤال 20، ص 87 سؤال 5)."
  },
  {
    z: 36,
    symbol: "Kr",
    nameAr: "الكريبتون",
    nameEn: "Krypton",
    config: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹⁰ 4p⁶",
    nobleConfig: "[Kr]",
    valenceElectrons: 8,
    period: 4,
    group: 18,
    block: "p",
    funFact: "الغاز النبيل الذي تنتهي به الدورة الرابعة باكتمال المستوى 4p بـ 6 إلكترونات (ص 35، ص 38 سؤال 28)."
  }
];

// Sublevels capacity reference (كتاب كيمياء 1 ص 32-33)
export const sublevelsInfo = {
  s: { orbitals: 1, maxElectrons: 2, shape: "كروي متماثل حول النواة (ص 28، ص 32)" },
  p: { orbitals: 3, maxElectrons: 6, shape: "فصي يتكون من فصين متقابلين px, py, pz (ص 28، ص 32)" },
  d: { orbitals: 5, maxElectrons: 10, shape: "مزدوج الفصوص ومعقد فراغياً 5 مستويات فرعية (ص 28، ص 32)" },
  f: { orbitals: 7, maxElectrons: 14, shape: "شديد التعقيد وفائق الفصوص 7 مستويات فرعية (ص 28، ص 32)" }
};

// Aufbau energy order sequence (تسلسل أوفباو لمستويات الطاقة ص 32-33)
export const aufbauOrder = [
  "1s", "2s", "2p", "3s", "3p", "4s", "3d", "4p", "5s", "4d", "5p", "6s", "4f", "5d", "6p", "7s", "5f", "6d", "7p"
];
