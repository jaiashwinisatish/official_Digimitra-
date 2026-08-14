export interface Lesson {
  _id: string;
  id: string;
  unitId: string;
  unitNumber: number;
  lessonNumber: number;
  title: { en: string; mr: string };
  videoUrl: string;
  driveUrl: string;
  duration: string;
  durationSeconds: number;
  order: number;
  summary?: string;
}

export interface Unit {
  _id: string;
  id: string;
  unitNumber: number;
  title: { en: string; mr: string };
  description: { en: string; mr: string };
  lessons: Lesson[];
}

export interface Assignment {
  _id: string;
  question: { en: string; mr: string };
  options: { en: string; mr: string }[];
  correctAnswer: number;
}

export interface PracticalTask {
  _id: string;
  unitNumber: number;
  title: { en: string; mr: string };
  instructions: { en: string; mr: string };
  rubricHint: { en: string; mr: string };
}

export const DRIVE_FOLDER_URL = "https://drive.google.com/drive/folders/1gW1nRh89OrrSm6OCVRZnwoI3PnZPW7lA";

// ==========================================
// COURSE 1: MS Word Masterclass (Existing)
// ==========================================

const lessonsCourse1: Lesson[] = [
  {
    _id: "course-1-l-1-1",
    id: "course-1-l-1-1",
    unitId: "course-1-unit-1",
    unitNumber: 1,
    lessonNumber: 1,
    title: { en: "Introduction to Microsoft Word & Interface", mr: "मायक्रोसॉफ्ट वर्ड आणि इंटरफेसची ओळख" },
    videoUrl: "https://youtu.be/H6JzgCLObm0",
    driveUrl: DRIVE_FOLDER_URL,
    duration: "10:00",
    durationSeconds: 600,
    order: 1,
    summary: "Microsoft Word visual interface overview, Quick Access Toolbar, Ribbon tabs, Title Bar, Status Bar, and creating a basic document."
  },
  {
    _id: "course-1-l-2-1",
    id: "course-1-l-2-1",
    unitId: "course-1-unit-2",
    unitNumber: 2,
    lessonNumber: 1,
    title: { en: "Home Tab – Font Group & Formatting (Part 1)", mr: "होम टॅब - फॉन्ट ग्रुप आणि फॉरमॅटिंग (भाग १)" },
    videoUrl: "https://youtu.be/NQU5qpx1_WM",
    driveUrl: DRIVE_FOLDER_URL,
    duration: "12:00",
    durationSeconds: 720,
    order: 2,
    summary: "Font selection, changing font sizes, bold, italic, underline styles, font color, and text highlight effects."
  },
  {
    _id: "course-1-l-2-2",
    id: "course-1-l-2-2",
    unitId: "course-1-unit-2",
    unitNumber: 2,
    lessonNumber: 2,
    title: { en: "Home Tab – Font Group Tools (Part 2)", mr: "होम टॅब - फॉन्ट ग्रुप टूल्स (भाग २)" },
    videoUrl: "https://youtu.be/7GE5RdasmvA",
    driveUrl: DRIVE_FOLDER_URL,
    duration: "11:00",
    durationSeconds: 660,
    order: 3,
    summary: "Strikethrough, Subscript (H₂O), Superscript (X²), Change Case (Sentence, UPPERCASE, lowercase), and Clear All Formatting."
  },
  {
    _id: "course-1-l-2-3",
    id: "course-1-l-2-3",
    unitId: "course-1-unit-2",
    unitNumber: 2,
    lessonNumber: 3,
    title: { en: "Home Tab – Font Group Advanced Styling (Part 3)", mr: "होम टॅब - फॉन्ट ग्रुप प्रगत डिझाइन (भाग ३)" },
    videoUrl: "https://youtu.be/Y4ZwvVPyU1w",
    driveUrl: DRIVE_FOLDER_URL,
    duration: "09:00",
    durationSeconds: 540,
    order: 4,
    summary: "Text Effects and Typography, Drop Shadow, Glow effects, Character Spacing, and formatting professional titles."
  },
  {
    _id: "course-1-l-2-4",
    id: "course-1-l-2-4",
    unitId: "course-1-unit-2",
    unitNumber: 2,
    lessonNumber: 4,
    title: { en: "File Tab Operations – Save, Save As & Export", mr: "फाईल टॅब क्रिया - सेव्ह, सेव्ह एज आणि एक्सपोर्ट" },
    videoUrl: "https://youtu.be/aU1T_CKE6bM",
    driveUrl: DRIVE_FOLDER_URL,
    duration: "08:00",
    durationSeconds: 480,
    order: 5,
    summary: "Creating New files, opening existing documents, saving with Ctrl+S, Save As format options, and exporting documents to PDF."
  },
  {
    _id: "course-1-l-3-1",
    id: "course-1-l-3-1",
    unitId: "course-1-unit-3",
    unitNumber: 3,
    lessonNumber: 1,
    title: { en: "Home Tab – Paragraph Formatting & Alignment (Part 1)", mr: "होम टॅब - परिच्छेद स्वरूपण आणि अलाइनमेंट (भाग १)" },
    videoUrl: "https://youtu.be/Q_4uEZ99xKA",
    driveUrl: DRIVE_FOLDER_URL,
    duration: "14:00",
    durationSeconds: 840,
    order: 6,
    summary: "Paragraph alignment (Left, Center, Right, Justify), Line Spacing, Paragraph Indentation, and Bullets & Numbering lists."
  },
  {
    _id: "course-1-l-3-2",
    id: "course-1-l-3-2",
    unitId: "course-1-unit-3",
    unitNumber: 3,
    lessonNumber: 2,
    title: { en: "Home Tab – Paragraph Group & Shading (Part 2)", mr: "होम टॅब - परिच्छेद ग्रुप आणि शेडिंग (भाग २)" },
    videoUrl: "https://youtu.be/5hlvsoC4euY",
    driveUrl: DRIVE_FOLDER_URL,
    duration: "13:00",
    durationSeconds: 780,
    order: 7,
    summary: "Shading background colors, Page Borders, Sorting lists alphabetically, and displaying Paragraph Marks (Show/Hide ¶)."
  }
];

const unitsCourse1: Unit[] = [
  {
    _id: "course-1-unit-1",
    id: "course-1-unit-1",
    unitNumber: 1,
    title: { en: "Unit 1: Getting Started with Word", mr: "युनिट १: वर्डसह सुरवात" },
    description: { en: "Introduction to Microsoft Word interface, tabs, and workspace setup.", mr: "मायक्रोसॉफ्ट वर्ड इंटरफेस, टॅब्स आणि वर्कस्पेसची माहिती." },
    lessons: lessonsCourse1.filter(l => l.unitNumber === 1)
  },
  {
    _id: "course-1-unit-2",
    id: "course-1-unit-2",
    unitNumber: 2,
    title: { en: "Unit 2: Font Group & File Management", mr: "युनिट २: फॉन्ट ग्रुप आणि फाईल व्यवस्थापन" },
    description: { en: "Master font formatting options, typography styles, and file operations.", mr: "फॉन्ट स्वरूपण पर्याय, टायपोग्राफी आणि फाईल क्रिया पूर्णपणे शिका." },
    lessons: lessonsCourse1.filter(l => l.unitNumber === 2)
  },
  {
    _id: "course-1-unit-3",
    id: "course-1-unit-3",
    unitNumber: 3,
    title: { en: "Unit 3: Paragraph Formatting & Layout", mr: "युनिट ३: परिच्छेद स्वरूपण आणि लेआउट" },
    description: { en: "Formatting paragraphs, text alignments, bulleted lists, shading, and borders.", mr: "परिच्छेद स्वरूपण, अलाइनमेंट, याद्या आणि बॉर्डर्स शिका." },
    lessons: lessonsCourse1.filter(l => l.unitNumber === 3)
  }
];

const assignmentsCourse1: Assignment[] = [
  {
    _id: "assign-1-1",
    question: { 
      en: "Which keyboard shortcut is used to copy text in Microsoft Word?", 
      mr: "MS Word मध्ये मजकूर कॉपी करण्यासाठी कोणती शॉर्टकट की वापरली जाते?" 
    },
    options: [
      { en: "Ctrl + V", mr: "Ctrl + V" },
      { en: "Ctrl + C", mr: "Ctrl + C" },
      { en: "Ctrl + X", mr: "Ctrl + X" },
      { en: "Ctrl + Z", mr: "Ctrl + Z" }
    ],
    correctAnswer: 1
  },
  {
    _id: "assign-1-2",
    question: { 
      en: "What is the standard document file extension for MS Word 2019/2021?", 
      mr: "MS Word 2019/2021 साठी मानक फाइल एक्सटेंशन काय आहे?" 
    },
    options: [
      { en: ".txt", mr: ".txt" },
      { en: ".pdf", mr: ".pdf" },
      { en: ".docx", mr: ".docx" },
      { en: ".xlsx", mr: ".xlsx" }
    ],
    correctAnswer: 2
  },
  {
    _id: "assign-1-3",
    question: {
      en: "Which paragraph alignment distributes text evenly between both left and right margins?",
      mr: "कोणते परिच्छेद अलाइनमेंट डाव्या आणि उजव्या दोन्ही मार्जिनमध्ये मजकूर समान रीतीने वितरित करते?"
    },
    options: [
      { en: "Align Left", mr: "Align Left (डावे)" },
      { en: "Center", mr: "Center (मध्य)" },
      { en: "Align Right", mr: "Align Right (उजवे)" },
      { en: "Justify", mr: "Justify (जस्टिफाय)" }
    ],
    correctAnswer: 3
  }
];

const practicalTasksCourse1: PracticalTask[] = [
  {
    _id: "prac-1-1",
    unitNumber: 1,
    title: { 
      en: "Practical Task 1: Document Creation & Title Setup", 
      mr: "प्रात्यक्षिक कार्य १: दस्तऐवज निर्मिती आणि शीर्षक सेटअप" 
    },
    instructions: { 
      en: "Open Microsoft Word. Type a heading 'Digimitra Digital School Project'. Change font style to Arial, font size to 16pt, make it Bold, and align it to the Center of the page. Write 2 sentences describing your school subject.", 
      mr: "मायक्रोसॉफ्ट वर्ड उघडा. 'Digimitra Digital School Project' हे शीर्षक टाइप करा. फॉन्ट शैली Arial, आकार 16pt करा, ते बोल्ड करा आणि पानाची अलाइनमेंट सेंटर ठेवा." 
    },
    rubricHint: {
      en: "Required elements: Heading text, Arial font, 16pt size, Bold formatting, Center alignment.",
      mr: "आवश्यक घटक: शीर्षक मजकूर, Arial फॉन्ट, 16pt आकार, बोल्ड फॉरमॅटिंग, सेंटर अलाइनमेंट."
    }
  },
  {
    _id: "prac-1-2",
    unitNumber: 2,
    title: { 
      en: "Practical Task 2: Chemical Formula & Exponents Formatting", 
      mr: "प्रात्यक्षिक कार्य २: रासायनिक सूत्र आणि घटक स्वरूपाचे काम" 
    },
    instructions: { 
      en: "In a new paragraph, use Subscript to type the water chemical formula 'H2O' so that the 2 appears lower. Then use Superscript to type 'E = mc2' so that the 2 appears higher as an exponent. Highlight H2O with yellow color.", 
      mr: "नवीन परिच्छेदात, सबस्क्रिप्ट वापरून पाण्याचे सूत्र 'H2O' लिहा जेणेकरून २ खाली येईल. नंतर सुपरस्क्रिप्ट वापरून 'E = mc2' लिहा जेणेकरून २ वर येईल." 
    },
    rubricHint: {
      en: "Required elements: Subscript for H2O, Superscript for mc2, Text Highlight color.",
      mr: "आवश्यक घटक: H2O साठी सबस्क्रिप्ट, mc2 साठी सुपरस्क्रिप्ट, टेक्स्ट हायलाइट रंग."
    }
  },
  {
    _id: "prac-1-3",
    unitNumber: 3,
    title: { 
      en: "Practical Task 3: Bulleted List & Border Formatting", 
      mr: "प्रात्यक्षिक कार्य ३: बुलेटेड यादी आणि बॉर्डर फॉरमॅटिंग" 
    },
    instructions: { 
      en: "Create a bulleted list of 3 computer hardware parts (CPU, RAM, Hard Disk). Apply 1.5 line spacing to the list and add a Light Blue background shading around the entire paragraph box.", 
      mr: "संगणक भागांची (CPU, RAM, Hard Disk) ३ घटकांची बुलेटेड यादी तयार करा. १.५ लाईन स्पेसिंग वापरा आणि हलका निळा पार्श्वभूमी शेडिंग द्या." 
    },
    rubricHint: {
      en: "Required elements: 3 bullet points, 1.5 line spacing, background shading.",
      mr: "आवश्यक घटक: ३ बुलेट पॉईंट्स, १.५ लाईन स्पेसिंग, बॅकग्राउंड शेडिंग."
    }
  }
];


// ==========================================
// COURSE 2: Introduction to Computers (New)
// ==========================================

const lessonsCourse2: Lesson[] = [
  // Unit 1
  {
    _id: "course-2-l-1-1", id: "course-2-l-1-1", unitId: "course-2-unit-1", unitNumber: 1, lessonNumber: 1,
    title: { en: "What is a Computer?", mr: "संगणक म्हणजे काय?" }, videoUrl: "https://youtu.be/rEL15on1EJc", driveUrl: DRIVE_FOLDER_URL, duration: "08:00", durationSeconds: 480, order: 1
  },
  {
    _id: "course-2-l-1-2", id: "course-2-l-1-2", unitId: "course-2-unit-1", unitNumber: 1, lessonNumber: 2,
    title: { en: "Parts of a Computer System", mr: "संगणक प्रणालीचे भाग" }, videoUrl: "https://youtu.be/plHi5yLvMdI", driveUrl: DRIVE_FOLDER_URL, duration: "07:00", durationSeconds: 420, order: 2
  },
  {
    _id: "course-2-l-1-3", id: "course-2-l-1-3", unitId: "course-2-unit-1", unitNumber: 1, lessonNumber: 3,
    title: { en: "How Computers Work", mr: "संगणक कसा काम करतो" }, videoUrl: "https://youtu.be/7tlDnQmw178", driveUrl: DRIVE_FOLDER_URL, duration: "09:00", durationSeconds: 540, order: 3
  },
  {
    _id: "course-2-l-1-4", id: "course-2-l-1-4", unitId: "course-2-unit-1", unitNumber: 1, lessonNumber: 4,
    title: { en: "Generations of Computers", mr: "संगणकांच्या पिढ्या" }, videoUrl: "https://youtu.be/BiUHfDwhdVk", driveUrl: DRIVE_FOLDER_URL, duration: "10:00", durationSeconds: 600, order: 4
  },
  {
    _id: "course-2-l-1-5", id: "course-2-l-1-5", unitId: "course-2-unit-1", unitNumber: 1, lessonNumber: 5,
    title: { en: "Types of Computers", mr: "संगणकांचे प्रकार" }, videoUrl: "https://youtu.be/aP21iARGHB0", driveUrl: DRIVE_FOLDER_URL, duration: "08:00", durationSeconds: 480, order: 5
  },
  {
    _id: "course-2-l-1-6", id: "course-2-l-1-6", unitId: "course-2-unit-1", unitNumber: 1, lessonNumber: 6,
    title: { en: "Computer Software Overview", mr: "संगणक सॉफ्टवेअर विहंगावलोकन" }, videoUrl: "https://youtu.be/RWROleuDiKQ", driveUrl: DRIVE_FOLDER_URL, duration: "07:00", durationSeconds: 420, order: 6
  },
  {
    _id: "course-2-l-1-7", id: "course-2-l-1-7", unitId: "course-2-unit-1", unitNumber: 1, lessonNumber: 7,
    title: { en: "Operating Systems Basics", mr: "ऑपरेटिंग सिस्टम मूलभूत" }, videoUrl: "https://youtu.be/hOdMWnWtMlY", driveUrl: DRIVE_FOLDER_URL, duration: "09:00", durationSeconds: 540, order: 7
  },
  {
    _id: "course-2-l-1-8", id: "course-2-l-1-8", unitId: "course-2-unit-1", unitNumber: 1, lessonNumber: 8,
    title: { en: "Computer Languages & Programming", mr: "संगणक भाषा आणि प्रोग्रामिंग" }, videoUrl: "https://youtu.be/sqSa9BHIGc0", driveUrl: DRIVE_FOLDER_URL, duration: "08:00", durationSeconds: 480, order: 8
  },
  
  // Unit 2
  {
    _id: "course-2-l-2-1", id: "course-2-l-2-1", unitId: "course-2-unit-2", unitNumber: 2, lessonNumber: 1,
    title: { en: "Introduction to Computer Memory", mr: "संगणक मेमरीची ओळख" }, videoUrl: "https://youtu.be/TjLpoBS5jm4", driveUrl: DRIVE_FOLDER_URL, duration: "08:00", durationSeconds: 480, order: 9
  },
  {
    _id: "course-2-l-2-2", id: "course-2-l-2-2", unitId: "course-2-unit-2", unitNumber: 2, lessonNumber: 2,
    title: { en: "RAM – Random Access Memory", mr: "RAM – रँडम ॲक्सेस मेमरी" }, videoUrl: "https://youtu.be/Mch8b8Rwx9U", driveUrl: DRIVE_FOLDER_URL, duration: "07:00", durationSeconds: 420, order: 10
  },
  {
    _id: "course-2-l-2-3", id: "course-2-l-2-3", unitId: "course-2-unit-2", unitNumber: 2, lessonNumber: 3,
    title: { en: "Types of RAM – SRAM & DRAM", mr: "RAM चे प्रकार – SRAM आणि DRAM" }, videoUrl: "https://youtu.be/8A10lBVQLbQ", driveUrl: DRIVE_FOLDER_URL, duration: "09:00", durationSeconds: 540, order: 11
  },
  {
    _id: "course-2-l-2-4", id: "course-2-l-2-4", unitId: "course-2-unit-2", unitNumber: 2, lessonNumber: 4,
    title: { en: "ROM – Read Only Memory", mr: "ROM – रीड ओन्ली मेमरी" }, videoUrl: "https://youtu.be/LH17EmFFx_k", driveUrl: DRIVE_FOLDER_URL, duration: "08:00", durationSeconds: 480, order: 12
  },
  {
    _id: "course-2-l-2-5", id: "course-2-l-2-5", unitId: "course-2-unit-2", unitNumber: 2, lessonNumber: 5,
    title: { en: "Cache Memory", mr: "कॅशे मेमरी" }, videoUrl: "https://youtu.be/rh_VKePho9E", driveUrl: DRIVE_FOLDER_URL, duration: "07:00", durationSeconds: 420, order: 13
  },
  {
    _id: "course-2-l-2-6", id: "course-2-l-2-6", unitId: "course-2-unit-2", unitNumber: 2, lessonNumber: 6,
    title: { en: "Registers and Memory Hierarchy", mr: "रजिस्टर्स आणि मेमरी श्रेणी" }, videoUrl: "https://youtu.be/_8-_Ek-iYDk", driveUrl: DRIVE_FOLDER_URL, duration: "08:00", durationSeconds: 480, order: 14
  },
  {
    _id: "course-2-l-2-7", id: "course-2-l-2-7", unitId: "course-2-unit-2", unitNumber: 2, lessonNumber: 7,
    title: { en: "Memory Summary & Revision", mr: "मेमरी सारांश आणि उजळणी" }, videoUrl: "https://youtu.be/N30h8TXCXzY", driveUrl: DRIVE_FOLDER_URL, duration: "06:00", durationSeconds: 360, order: 15
  },
  {
    _id: "course-2-l-2-8", id: "course-2-l-2-8", unitId: "course-2-unit-2", unitNumber: 2, lessonNumber: 8,
    title: { en: "Introduction to Secondary Memory", mr: "दुय्यम मेमरीची ओळख" }, videoUrl: "https://youtu.be/AJzAmmGVX40", driveUrl: DRIVE_FOLDER_URL, duration: "08:00", durationSeconds: 480, order: 16
  },
  {
    _id: "course-2-l-2-9", id: "course-2-l-2-9", unitId: "course-2-unit-2", unitNumber: 2, lessonNumber: 9,
    title: { en: "Hard Disk Drive (HDD)", mr: "हार्ड डिस्क ड्राइव्ह (HDD)" }, videoUrl: "https://youtu.be/eaDbEjdfM4o", driveUrl: DRIVE_FOLDER_URL, duration: "09:00", durationSeconds: 540, order: 17
  },
  {
    _id: "course-2-l-2-10", id: "course-2-l-2-10", unitId: "course-2-unit-2", unitNumber: 2, lessonNumber: 10,
    title: { en: "Solid State Drive (SSD)", mr: "सॉलिड स्टेट ड्राइव्ह (SSD)" }, videoUrl: "https://youtu.be/-qBEHdv9rlo", driveUrl: DRIVE_FOLDER_URL, duration: "07:00", durationSeconds: 420, order: 18
  },
  {
    _id: "course-2-l-2-11", id: "course-2-l-2-11", unitId: "course-2-unit-2", unitNumber: 2, lessonNumber: 11,
    title: { en: "Optical Storage – CD, DVD, Blu-ray", mr: "ऑप्टिकल स्टोरेज – CD, DVD, ब्लू-रे" }, videoUrl: "https://youtu.be/BGzr6JbVKOM", driveUrl: DRIVE_FOLDER_URL, duration: "08:00", durationSeconds: 480, order: 19
  },
  {
    _id: "course-2-l-2-12", id: "course-2-l-2-12", unitId: "course-2-unit-2", unitNumber: 2, lessonNumber: 12,
    title: { en: "USB Flash Drives & Memory Cards", mr: "USB फ्लॅश ड्राइव्ह आणि मेमरी कार्ड" }, videoUrl: "https://youtu.be/C7uzYfDMNEQ", driveUrl: DRIVE_FOLDER_URL, duration: "07:00", durationSeconds: 420, order: 20
  },

  // Unit 3
  {
    _id: "course-2-l-3-1", id: "course-2-l-3-1", unitId: "course-2-unit-3", unitNumber: 3, lessonNumber: 1,
    title: { en: "Introduction to Input Devices", mr: "इनपुट डिव्हाइसेसची ओळख" }, videoUrl: "https://youtu.be/U3UwS7N66_8", driveUrl: DRIVE_FOLDER_URL, duration: "08:00", durationSeconds: 480, order: 21
  },
  {
    _id: "course-2-l-3-2", id: "course-2-l-3-2", unitId: "course-2-unit-3", unitNumber: 3, lessonNumber: 2,
    title: { en: "Keyboard – Types & Functions", mr: "कीबोर्ड – प्रकार आणि कार्ये" }, videoUrl: "https://youtu.be/pJFf3byfdTA", driveUrl: DRIVE_FOLDER_URL, duration: "07:00", durationSeconds: 420, order: 22
  },
  {
    _id: "course-2-l-3-3", id: "course-2-l-3-3", unitId: "course-2-unit-3", unitNumber: 3, lessonNumber: 3,
    title: { en: "Mouse & Pointing Devices", mr: "माउस आणि पॉइंटिंग डिव्हाइसेस" }, videoUrl: "https://youtu.be/j4NkCvEPfKg", driveUrl: DRIVE_FOLDER_URL, duration: "08:00", durationSeconds: 480, order: 23
  },
  {
    _id: "course-2-l-3-4", id: "course-2-l-3-4", unitId: "course-2-unit-3", unitNumber: 3, lessonNumber: 4,
    title: { en: "Scanner & Image Input Devices", mr: "स्कॅनर आणि इमेज इनपुट डिव्हाइसेस" }, videoUrl: "https://youtu.be/mJgMGV1cGsA", driveUrl: DRIVE_FOLDER_URL, duration: "07:00", durationSeconds: 420, order: 24
  },
  {
    _id: "course-2-l-3-5", id: "course-2-l-3-5", unitId: "course-2-unit-3", unitNumber: 3, lessonNumber: 5,
    title: { en: "Microphone & Audio Input", mr: "मायक्रोफोन आणि ऑडिओ इनपुट" }, videoUrl: "https://youtu.be/AtvRVLOIgz4", driveUrl: DRIVE_FOLDER_URL, duration: "06:00", durationSeconds: 360, order: 25
  },
  {
    _id: "course-2-l-3-6", id: "course-2-l-3-6", unitId: "course-2-unit-3", unitNumber: 3, lessonNumber: 6,
    title: { en: "Introduction to Output Devices", mr: "आउटपुट डिव्हाइसेसची ओळख" }, videoUrl: "https://youtu.be/AP-RwebvkaY", driveUrl: DRIVE_FOLDER_URL, duration: "08:00", durationSeconds: 480, order: 26
  },
  {
    _id: "course-2-l-3-7", id: "course-2-l-3-7", unitId: "course-2-unit-3", unitNumber: 3, lessonNumber: 7,
    title: { en: "Monitor – Types & Display Technology", mr: "मॉनिटर – प्रकार आणि डिस्प्ले तंत्रज्ञान" }, videoUrl: "https://youtu.be/41GDzdvmXzg", driveUrl: DRIVE_FOLDER_URL, duration: "09:00", durationSeconds: 540, order: 27
  },
  {
    _id: "course-2-l-3-8", id: "course-2-l-3-8", unitId: "course-2-unit-3", unitNumber: 3, lessonNumber: 8,
    title: { en: "Printer – Types & Working", mr: "प्रिंटर – प्रकार आणि कार्यपद्धती" }, videoUrl: "https://youtu.be/8fmnihGzIgM", driveUrl: DRIVE_FOLDER_URL, duration: "08:00", durationSeconds: 480, order: 28
  },
  {
    _id: "course-2-l-3-9", id: "course-2-l-3-9", unitId: "course-2-unit-3", unitNumber: 3, lessonNumber: 9,
    title: { en: "Speaker & Audio Output", mr: "स्पीकर आणि ऑडिओ आउटपुट" }, videoUrl: "https://youtu.be/nk2qix32TTA", driveUrl: DRIVE_FOLDER_URL, duration: "07:00", durationSeconds: 420, order: 29
  },
  {
    _id: "course-2-l-3-10", id: "course-2-l-3-10", unitId: "course-2-unit-3", unitNumber: 3, lessonNumber: 10,
    title: { en: "Projector & Other Output Devices", mr: "प्रोजेक्टर आणि इतर आउटपुट डिव्हाइसेस" }, videoUrl: "https://youtu.be/H8zAjv7S_yE", driveUrl: DRIVE_FOLDER_URL, duration: "08:00", durationSeconds: 480, order: 30
  }
];

const unitsCourse2: Unit[] = [
  {
    _id: "course-2-unit-1",
    id: "course-2-unit-1",
    unitNumber: 1,
    title: { en: "Unit 1: Introduction to Computers", mr: "युनिट १: संगणकाची ओळख" },
    description: { en: "Learn what a computer is, its basic components, and how it works.", mr: "संगणक म्हणजे काय, त्याचे मूलभूत घटक आणि तो कसा काम करतो ते शिका." },
    lessons: lessonsCourse2.filter(l => l.unitNumber === 1)
  },
  {
    _id: "course-2-unit-2",
    id: "course-2-unit-2",
    unitNumber: 2,
    title: { en: "Unit 2: Computer Memory", mr: "युनिट २: संगणक मेमरी" },
    description: { en: "Understand primary and secondary memory types, RAM, ROM, and storage devices.", mr: "प्राथमिक आणि दुय्यम मेमरीचे प्रकार, RAM, ROM आणि स्टोरेज डिव्हाइसेस समजून घ्या." },
    lessons: lessonsCourse2.filter(l => l.unitNumber === 2)
  },
  {
    _id: "course-2-unit-3",
    id: "course-2-unit-3",
    unitNumber: 3,
    title: { en: "Unit 3: Input & Output Devices", mr: "युनिट ३: इनपुट आणि आउटपुट डिव्हाइसेस" },
    description: { en: "Learn about keyboards, mice, monitors, printers, and other I/O devices.", mr: "कीबोर्ड, माउस, मॉनिटर, प्रिंटर आणि इतर I/O डिव्हाइसेस बद्दल शिका." },
    lessons: lessonsCourse2.filter(l => l.unitNumber === 3)
  }
];

const assignmentsCourse2: Assignment[] = [
  {
    _id: "assign-2-1",
    question: { en: "What is the full form of CPU?", mr: "CPU चा फुल फॉर्म काय आहे?" },
    options: [
      { en: "Central Processing Unit", mr: "Central Processing Unit" },
      { en: "Central Program Unit", mr: "Central Program Unit" },
      { en: "Computer Processing Unit", mr: "Computer Processing Unit" },
      { en: "Central Personal Unit", mr: "Central Personal Unit" }
    ],
    correctAnswer: 0
  },
  {
    _id: "assign-2-2",
    question: { en: "Which of these is a primary memory?", mr: "यापैकी कोणती प्राथमिक मेमरी आहे?" },
    options: [
      { en: "Hard Disk", mr: "Hard Disk" },
      { en: "CD-ROM", mr: "CD-ROM" },
      { en: "RAM", mr: "RAM" },
      { en: "USB Drive", mr: "USB Drive" }
    ],
    correctAnswer: 2
  },
  {
    _id: "assign-2-3",
    question: { en: "Which device is an input device?", mr: "कोणते डिव्हाइस इनपुट डिव्हाइस आहे?" },
    options: [
      { en: "Monitor", mr: "Monitor" },
      { en: "Printer", mr: "Printer" },
      { en: "Keyboard", mr: "Keyboard" },
      { en: "Speaker", mr: "Speaker" }
    ],
    correctAnswer: 2
  },
  {
    _id: "assign-2-4",
    question: { en: "What does ROM stand for?", mr: "ROM चा अर्थ काय आहे?" },
    options: [
      { en: "Random Only Memory", mr: "Random Only Memory" },
      { en: "Read Only Memory", mr: "Read Only Memory" },
      { en: "Run Only Memory", mr: "Run Only Memory" },
      { en: "Real Output Memory", mr: "Real Output Memory" }
    ],
    correctAnswer: 1
  },
  {
    _id: "assign-2-5",
    question: { en: "Which is a secondary storage device?", mr: "कोणते दुय्यम स्टोरेज डिव्हाइस आहे?" },
    options: [
      { en: "RAM", mr: "RAM" },
      { en: "Cache", mr: "Cache" },
      { en: "Register", mr: "Register" },
      { en: "Hard Disk", mr: "Hard Disk" }
    ],
    correctAnswer: 3
  }
];

const practicalTasksCourse2: PracticalTask[] = [
  {
    _id: "prac-2-1",
    unitNumber: 1,
    title: { 
      en: "Practical Task 1: Identify Computer Parts", 
      mr: "प्रात्यक्षिक कार्य १: संगणकाचे भाग ओळखा" 
    },
    instructions: { 
      en: "Look at a computer near you (or a picture of one). Write the names of at least 5 parts you can see (e.g., Monitor, Keyboard, Mouse, CPU, Speakers). Describe what each part does in 1 sentence.", 
      mr: "तुमच्या जवळचा संगणक (किंवा त्याचे चित्र) पहा. तुम्हाला दिसणाऱ्या किमान ५ भागांची नावे लिहा (उदा. मॉनिटर, कीबोर्ड, माऊस, CPU, स्पीकर्स). प्रत्येक भाग काय करतो ते १ वाक्यात वर्णन करा." 
    },
    rubricHint: {
      en: "Required elements: 5 computer parts, 1 sentence description for each.",
      mr: "आवश्यक घटक: ५ संगणकाचे भाग, प्रत्येकाचे १ वाक्यात वर्णन."
    }
  },
  {
    _id: "prac-2-2",
    unitNumber: 2,
    title: { 
      en: "Practical Task 2: Memory Comparison Chart", 
      mr: "प्रात्यक्षिक कार्य २: मेमरी तुलना तक्ता" 
    },
    instructions: { 
      en: "Create a comparison between RAM and ROM. List at least 3 differences between them. Also mention one example of each type of memory.", 
      mr: "RAM आणि ROM मध्ये तुलना करा. त्यांच्यातील किमान ३ फरक सांगा. तसेच प्रत्येकाचे एक उदाहरण द्या." 
    },
    rubricHint: {
      en: "Required elements: 3 differences between RAM and ROM, 1 example of each.",
      mr: "आवश्यक घटक: RAM आणि ROM मधील ३ फरक, प्रत्येकाचे १ उदाहरण."
    }
  },
  {
    _id: "prac-2-3",
    unitNumber: 3,
    title: { 
      en: "Practical Task 3: Input/Output Classification", 
      mr: "प्रात्यक्षिक कार्य ३: इनपुट/आउटपुट वर्गीकरण" 
    },
    instructions: { 
      en: "List 5 input devices and 5 output devices. For each device, write one sentence about how it is used in daily life.", 
      mr: "५ इनपुट डिव्हाइसेस आणि ५ आउटपुट डिव्हाइसेसची यादी करा. प्रत्येक डिव्हाइससाठी, दैनंदिन जीवनात त्याचा वापर कसा होतो यावर एक वाक्य लिहा." 
    },
    rubricHint: {
      en: "Required elements: 5 input devices, 5 output devices, 1 sentence usage description for each.",
      mr: "आवश्यक घटक: ५ इनपुट डिव्हाइसेस, ५ आउटपुट डिव्हाइसेस, प्रत्येकाचा १ वाक्यात उपयोग."
    }
  }
];


// ==========================================
// EXPORTS
// ==========================================

export const INITIAL_MOCK_COURSES = [
  {
    _id: "course-1",
    id: "course-1",
    title: { en: "Microsoft Word Masterclass", mr: "मायक्रोसॉफ्ट वर्ड मास्टरक्लास" },
    description: {
      en: "Master Microsoft Word step-by-step across 3 comprehensive units with official Digimitra educational video lessons, assignments, and hands-on practical tasks.",
      mr: "अधिकृत DigiMitra शैक्षणिक व्हिडिऑद्वारे ३ प्रगत युनिट्समध्ये वर्ड प्रोसेसिंग शिका."
    },
    category: { en: "MS Office & Computer Literacy", mr: "MS ऑफिस आणि कॉम्प्युटर साक्षरता" },
    hours: 5,
    level: { en: "Beginner to Intermediate", mr: "नवशिक्या ते प्रगत" },
    thumbnail: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800",
    units: unitsCourse1,
    lessons: lessonsCourse1,
    assignments: assignmentsCourse1,
    practicalTasks: practicalTasksCourse1
  },
  {
    _id: "course-2",
    id: "course-2",
    title: { en: "Introduction to Computers", mr: "संगणकाची ओळख" },
    description: {
      en: "Learn the fundamentals of computers including hardware components, memory systems, and input/output devices through engaging animated videos.",
      mr: "हार्डवेअर घटक, मेमरी सिस्टम आणि इनपुट/आउटपुट डिव्हाइसेससह संगणकाची मूलभूत माहिती शिका."
    },
    category: { en: "Computer Fundamentals", mr: "संगणक मूलभूत" },
    hours: 8,
    level: { en: "Beginner", mr: "नवशिक्या" },
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
    units: unitsCourse2,
    lessons: lessonsCourse2,
    assignments: assignmentsCourse2,
    practicalTasks: practicalTasksCourse2
  }
];

export const INITIAL_MOCK_USER = {
  _id: "user-student-101",
  name: "Sneha Patil",
  email: "sneha@digimitra.edu",
  mobile: "9876543210",
  studentClass: "Class 9th",
  role: "student",
  languagePreference: "en",
  token: "mock-jwt-token-sneha-101",
  enrolledCourses: ["course-1"]
};

export const INITIAL_MOCK_PROGRESS = [
  {
    _id: "prog-1",
    user: "user-student-101",
    courseId: INITIAL_MOCK_COURSES[0],
    completedLessons: ["course-1-l-1-1", "course-1-l-2-1"],
    completedPracticals: ["prac-1-1"],
    practicalSubmissions: {
      "prac-1-1": {
        submissionText: "Digimitra Digital School Project - Arial Font, 16pt, Bold, Centered.",
        grade: 95,
        feedback: "Excellent work! Title formatted correctly with center alignment.",
        submittedAt: new Date().toISOString()
      }
    },
    watchPositions: {
      "course-1-l-1-1": 600,
      "course-1-l-2-1": 720
    },
    watchPercentages: {
      "course-1-l-1-1": 100,
      "course-1-l-2-1": 100
    },
    lastWatchedLessonId: "course-1-l-2-1",
    lastWatchedTime: 720,
    progressPercentage: 29
  }
];

// Helper to load user-specific progress from localStorage
export function getUserProgress(userId: string) {
  if (!userId) return [];
  
  const storageKey = `digimitra_progress_${userId}`;
  const saved = localStorage.getItem(storageKey);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      // JSON error
    }
  }

  if (userId === INITIAL_MOCK_USER._id) {
    return INITIAL_MOCK_PROGRESS;
  }
  
  return [];
}

// Helper to save user-specific progress to localStorage
export function saveUserProgress(userId: string, progressArray: any[]) {
  if (!userId) return;
  const storageKey = `digimitra_progress_${userId}`;
  localStorage.setItem(storageKey, JSON.stringify(progressArray));
}

export function updateMockProgress(courseId: string, lessonId: string, userId?: string) {
  const effectiveUserId = userId || INITIAL_MOCK_USER._id;
  const userProgressList = getUserProgress(effectiveUserId);

  let progressItem = userProgressList.find((p: any) =>
    p?.courseId?._id === courseId || p?.courseId?.id === courseId || p?.courseId === courseId
  );

  const targetCourse = INITIAL_MOCK_COURSES.find((c: any) => c._id === courseId || c.id === courseId) || INITIAL_MOCK_COURSES[0];
  const totalLessons = targetCourse?.lessons?.length || 7;

  if (!progressItem) {
    progressItem = {
      _id: `prog-${Date.now()}`,
      user: effectiveUserId,
      courseId: targetCourse,
      completedLessons: [lessonId],
      completedPracticals: [],
      practicalSubmissions: {},
      watchPositions: { [lessonId]: 0 },
      watchPercentages: { [lessonId]: 100 },
      lastWatchedLessonId: lessonId,
      lastWatchedTime: 0,
      progressPercentage: Math.round((1 / totalLessons) * 100)
    };
    userProgressList.push(progressItem);
  } else {
    progressItem.completedLessons = progressItem.completedLessons || [];
    if (progressItem.completedLessons.includes(lessonId)) {
      progressItem.completedLessons = progressItem.completedLessons.filter((id: string) => id !== lessonId);
    } else {
      progressItem.completedLessons.push(lessonId);
      progressItem.watchPercentages = progressItem.watchPercentages || {};
      progressItem.watchPercentages[lessonId] = 100;
    }
    progressItem.progressPercentage = Math.round((progressItem.completedLessons.length / totalLessons) * 100);
  }

  saveUserProgress(effectiveUserId, userProgressList);
  return progressItem;
}

export function updateWatchProgress(courseId: string, lessonId: string, currentSeconds: number, totalSeconds: number, userId?: string) {
  const effectiveUserId = userId || INITIAL_MOCK_USER._id;
  const userProgressList = getUserProgress(effectiveUserId);

  let progressItem = userProgressList.find((p: any) =>
    p?.courseId?._id === courseId || p?.courseId?.id === courseId || p?.courseId === courseId
  );

  const targetCourse = INITIAL_MOCK_COURSES.find((c: any) => c._id === courseId || c.id === courseId) || INITIAL_MOCK_COURSES[0];
  const totalLessons = targetCourse?.lessons?.length || 7;
  const percentage = totalSeconds > 0 ? Math.min(100, Math.round((currentSeconds / totalSeconds) * 100)) : 0;

  if (!progressItem) {
    progressItem = {
      _id: `prog-${Date.now()}`,
      user: effectiveUserId,
      courseId: targetCourse,
      completedLessons: percentage >= 90 ? [lessonId] : [],
      completedPracticals: [],
      practicalSubmissions: {},
      watchPositions: { [lessonId]: currentSeconds },
      watchPercentages: { [lessonId]: percentage },
      lastWatchedLessonId: lessonId,
      lastWatchedTime: currentSeconds,
      progressPercentage: percentage >= 90 ? Math.round((1 / totalLessons) * 100) : 0
    };
    userProgressList.push(progressItem);
  } else {
    progressItem.watchPositions = progressItem.watchPositions || {};
    progressItem.watchPercentages = progressItem.watchPercentages || {};
    progressItem.completedLessons = progressItem.completedLessons || [];
    
    progressItem.watchPositions[lessonId] = Math.max(progressItem.watchPositions[lessonId] || 0, currentSeconds);
    progressItem.watchPercentages[lessonId] = Math.max(progressItem.watchPercentages[lessonId] || 0, percentage);
    progressItem.lastWatchedLessonId = lessonId;
    progressItem.lastWatchedTime = currentSeconds;

    if (percentage >= 90 && !progressItem.completedLessons.includes(lessonId)) {
      progressItem.completedLessons.push(lessonId);
    }
    progressItem.progressPercentage = Math.round((progressItem.completedLessons.length / totalLessons) * 100);
  }

  saveUserProgress(effectiveUserId, userProgressList);
  return progressItem;
}

export function submitPracticalTask(courseId: string, practicalId: string, submissionText: string, userId?: string) {
  const effectiveUserId = userId || INITIAL_MOCK_USER._id;
  const userProgressList = getUserProgress(effectiveUserId);

  let progressItem = userProgressList.find((p: any) =>
    p?.courseId?._id === courseId || p?.courseId?.id === courseId || p?.courseId === courseId
  );

  const targetCourse = INITIAL_MOCK_COURSES.find((c: any) => c._id === courseId || c.id === courseId) || INITIAL_MOCK_COURSES[0];

  // AI Evaluation logic for practical check
  let score = 90;
  let feedback = "Excellent practical execution! All key criteria were met successfully.";

  const textLower = submissionText.toLowerCase();

  if (courseId === "course-2") {
    const keywords = ['monitor', 'keyboard', 'ram', 'rom', 'hdd', 'ssd', 'input', 'output'];
    let keywordCount = 0;
    for (const kw of keywords) {
      if (textLower.includes(kw)) {
        keywordCount++;
      }
    }

    if (textLower.length < 15) {
      score = 70;
      feedback = "Good attempt! Make sure to include more details for maximum score.";
    } else if (keywordCount >= 2) {
      score = 98;
      feedback = "Outstanding! AI Evaluator confirmed all requested concepts were identified correctly.";
    } else if (keywordCount === 1) {
      score = 85;
      feedback = "Good work! You identified some key concepts, but try to include more details next time.";
    }
  } else {
    // Course 1 fallback
    if (textLower.length < 15) {
      score = 70;
      feedback = "Good attempt! Make sure to include full step details for maximum score.";
    } else if (textLower.includes("arial") || textLower.includes("bold") || textLower.includes("subscript") || textLower.includes("bullet")) {
      score = 98;
      feedback = "Outstanding! AI Evaluator confirmed all requested MS Word formatting options were applied correctly.";
    }
  }

  if (!progressItem) {
    progressItem = {
      _id: `prog-${Date.now()}`,
      user: effectiveUserId,
      courseId: targetCourse,
      completedLessons: [],
      completedPracticals: [practicalId],
      practicalSubmissions: {
        [practicalId]: { submissionText, grade: score, feedback, submittedAt: new Date().toISOString() }
      },
      watchPositions: {},
      watchPercentages: {},
      progressPercentage: 10
    };
    userProgressList.push(progressItem);
  } else {
    progressItem.completedPracticals = progressItem.completedPracticals || [];
    if (!progressItem.completedPracticals.includes(practicalId)) {
      progressItem.completedPracticals.push(practicalId);
    }
    progressItem.practicalSubmissions = progressItem.practicalSubmissions || {};
    progressItem.practicalSubmissions[practicalId] = {
      submissionText,
      grade: score,
      feedback,
      submittedAt: new Date().toISOString()
    };
  }

  saveUserProgress(effectiveUserId, userProgressList);
  return { progressItem, result: { grade: score, feedback } };
}
