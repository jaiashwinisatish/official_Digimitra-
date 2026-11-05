const dotenv = require('dotenv');
const Course = require('./models/Course');
const connectDB = require('./config/db');

dotenv.config();

const courses = [
  {
    title: { en: "Microsoft Word", mr: "मायक्रोसॉफ्ट वर्ड" },
    description: {
      en: "Learn word processing from basics to advanced document creation.",
      mr: "मूलभूत गोष्टींपासून प्रगत दस्तऐवज निर्मितीपर्यंत वर्ड प्रोसेसिंग शिका."
    },
    category: { en: "MS Office", mr: "MS ऑफिस" },
    thumbnail: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800",
    lessons: [
      {
        title: { en: "Introduction to Microsoft Word", mr: "मायक्रोसॉफ्ट वर्डची ओळख" },
        videoUrl: "https://youtu.be/H6JzgCLObm0?si=woRryjJ_gLGBMrWY",
        duration: "10:00",
        durationSeconds: 600,
        driveUrl: "https://drive.google.com/drive/folders/1gW1nRh89OrrSm6OCVRZnwoI3PnZPW7lA",
        unitNumber: 1,
        lessonNumber: 1,
        order: 1
      },
      {
        title: { en: "Home Tab – Font Group (Part 1)", mr: "होम टॅब - फॉन्ट ग्रुप (भाग १)" },
        videoUrl: "https://youtu.be/NQU5qpx1_WM?si=g0Dqno11I7JtQzbZ",
        duration: "12:00",
        durationSeconds: 720,
        driveUrl: "https://drive.google.com/drive/folders/1gW1nRh89OrrSm6OCVRZnwoI3PnZPW7lA",
        unitNumber: 2,
        lessonNumber: 1,
        order: 2
      },
      {
        title: { en: "Home Tab – Font Group (Part 2)", mr: "होम टॅब - फॉन्ट ग्रुप (भाग २)" },
        videoUrl: "https://youtu.be/7GE5RdasmvA?si=fHPlKQ60OUfFUzS_",
        duration: "11:00",
        durationSeconds: 660,
        driveUrl: "https://drive.google.com/drive/folders/1gW1nRh89OrrSm6OCVRZnwoI3PnZPW7lA",
        unitNumber: 2,
        lessonNumber: 2,
        order: 3
      },
      {
        title: { en: "Home Tab – Font Group (Part 3)", mr: "होम टॅब - फॉन्ट ग्रुप (भाग ३)" },
        videoUrl: "https://youtu.be/Y4ZwvVPyU1w?si=kqlyKMdbqPOzDnw5",
        duration: "09:00",
        durationSeconds: 540,
        driveUrl: "https://drive.google.com/drive/folders/1gW1nRh89OrrSm6OCVRZnwoI3PnZPW7lA",
        unitNumber: 2,
        lessonNumber: 3,
        order: 4
      },
      {
        title: { en: "File Tab Explanation", mr: "फाईल टॅबचे स्पष्टीकरण" },
        videoUrl: "https://youtu.be/aU1T_CKE6bM?si=XuyRVF2qdnNP0cgO",
        duration: "08:00",
        durationSeconds: 480,
        driveUrl: "https://drive.google.com/drive/folders/1gW1nRh89OrrSm6OCVRZnwoI3PnZPW7lA",
        unitNumber: 2,
        lessonNumber: 4,
        order: 5
      },
      {
        title: { en: "Home Tab – Paragraph Group (Part 1)", mr: "होम टॅब - परिच्छेद ग्रुप (भाग १)" },
        videoUrl: "https://youtu.be/Q_4uEZ99xKA?si=hVkbFp4KBBZg5o5d",
        duration: "14:00",
        durationSeconds: 840,
        driveUrl: "https://drive.google.com/drive/folders/1gW1nRh89OrrSm6OCVRZnwoI3PnZPW7lA",
        unitNumber: 3,
        lessonNumber: 1,
        order: 6
      },
      {
        title: { en: "Home Tab – Paragraph Group (Part 2)", mr: "होम टॅब - परिच्छेद ग्रुप (भाग २)" },
        videoUrl: "https://youtu.be/5hlvsoC4euY?si=ZkUiDcjDlwzZdqbJ",
        duration: "13:00",
        durationSeconds: 780,
        driveUrl: "https://drive.google.com/drive/folders/1gW1nRh89OrrSm6OCVRZnwoI3PnZPW7lA",
        unitNumber: 3,
        lessonNumber: 2,
        order: 7
      }
    ],
    assignments: [
      {
        question: { en: "Which shortcut is used to copy text in MS Word?", mr: "MS Word मध्ये मजकूर कॉपी करण्यासाठी कोणती शॉर्टकट की वापरली जाते?" },
        options: [
          { en: "Ctrl + V", mr: "Ctrl + V" },
          { en: "Ctrl + C", mr: "Ctrl + C" },
          { en: "Ctrl + X", mr: "Ctrl + X" },
          { en: "Ctrl + Z", mr: "Ctrl + Z" }
        ],
        correctAnswer: 1
      },
      {
        question: { en: "What is the default file extension for MS Word 2019?", mr: "MS Word 2019 साठी डीफॉल्ट फाइल एक्सटेंशन काय आहे?" },
        options: [
          { en: ".txt", mr: ".txt" },
          { en: ".pdf", mr: ".pdf" },
          { en: ".docx", mr: ".docx" },
          { en: ".xlsx", mr: ".xlsx" }
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    title: { en: "Introduction to Computers", mr: "संगणकाची ओळख" },
    description: {
      en: "Learn the fundamentals of computers including hardware components, memory systems, and input/output devices through engaging animated videos.",
      mr: "हार्डवेअर घटक, मेमरी सिस्टम आणि इनपुट/आउटपुट डिव्हाइसेससह संगणकाची मूलभूत माहिती शिका."
    },
    category: { en: "Computer Fundamentals", mr: "संगणक मूलभूत" },
    level: { en: "Beginner", mr: "नवशिक्या" },
    hours: 8,
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
    units: [
      {
        unitNumber: 1,
        title: { en: "Unit 1: Introduction to Computers", mr: "युनिट १: संगणकाची ओळख" },
        description: { en: "Learn what a computer is, its basic components, and how it works.", mr: "संगणक म्हणजे काय, त्याचे मूलभूत घटक आणि तो कसा काम करतो ते शिका." }
      },
      {
        unitNumber: 2,
        title: { en: "Unit 2: Computer Memory", mr: "युनिट २: संगणक मेमरी" },
        description: { en: "Understand primary and secondary memory types, RAM, ROM, and storage devices.", mr: "प्राथमिक आणि दुय्यम मेमरीचे प्रकार, RAM, ROM आणि स्टोरेज डिव्हाइसेस समजून घ्या." }
      },
      {
        unitNumber: 3,
        title: { en: "Unit 3: Input & Output Devices", mr: "युनिट ३: इनपुट आणि आउटपुट डिव्हाइसेस" },
        description: { en: "Learn about keyboards, mice, monitors, printers, and other I/O devices.", mr: "कीबोर्ड, माउस, मॉनिटर, प्रिंटर आणि इतर I/O डिव्हाइसेस बद्दल शिका." }
      }
    ],
    lessons: [
      ["What is a Computer?", "संगणक म्हणजे काय?", "rEL15on1EJc", 1, 1, "08:00"],
      ["Parts of a Computer System", "संगणक प्रणालीचे भाग", "plHi5yLvMdI", 1, 2, "07:00"],
      ["How Computers Work", "संगणक कसा काम करतो", "7tlDnQmw178", 1, 3, "09:00"],
      ["Generations of Computers", "संगणकांच्या पिढ्या", "BiUHfDwhdVk", 1, 4, "10:00"],
      ["Types of Computers", "संगणकांचे प्रकार", "aP21iARGHB0", 1, 5, "08:00"],
      ["Computer Software Overview", "संगणक सॉफ्टवेअर विहंगावलोकन", "RWROleuDiKQ", 1, 6, "07:00"],
      ["Operating Systems Basics", "ऑपरेटिंग सिस्टम मूलभूत", "hOdMWnWtMlY", 1, 7, "09:00"],
      ["Computer Languages & Programming", "संगणक भाषा आणि प्रोग्रामिंग", "sqSa9BHIGc0", 1, 8, "08:00"],
      ["Introduction to Computer Memory", "संगणक मेमरीची ओळख", "TjLpoBS5jm4", 2, 1, "08:00"],
      ["RAM – Random Access Memory", "RAM – रँडम ॲक्सेस मेमरी", "Mch8b8Rwx9U", 2, 2, "07:00"],
      ["Types of RAM – SRAM & DRAM", "RAM चे प्रकार – SRAM आणि DRAM", "8A10lBVQLbQ", 2, 3, "09:00"],
      ["ROM – Read Only Memory", "ROM – रीड ओन्ली मेमरी", "LH17EmFFx_k", 2, 4, "08:00"],
      ["Cache Memory", "कॅशे मेमरी", "rh_VKePho9E", 2, 5, "07:00"],
      ["Registers and Memory Hierarchy", "रजिस्टर्स आणि मेमरी श्रेणी", "_8-_Ek-iYDk", 2, 6, "08:00"],
      ["Memory Summary & Revision", "मेमरी सारांश आणि उजळणी", "N30h8TXCXzY", 2, 7, "06:00"],
      ["Introduction to Secondary Memory", "दुय्यम मेमरीची ओळख", "AJzAmmGVX40", 2, 8, "08:00"],
      ["Hard Disk Drive (HDD)", "हार्ड डिस्क ड्राइव्ह (HDD)", "eaDbEjdfM4o", 2, 9, "09:00"],
      ["Solid State Drive (SSD)", "सॉलिड स्टेट ड्राइव्ह (SSD)", "-qBEHdv9rlo", 2, 10, "07:00"],
      ["Optical Storage – CD, DVD, Blu-ray", "ऑप्टिकल स्टोरेज – CD, DVD, ब्लू-रे", "BGzr6JbVKOM", 2, 11, "08:00"],
      ["USB Flash Drives & Memory Cards", "USB फ्लॅश ड्राइव्ह आणि मेमरी कार्ड", "C7uzYfDMNEQ", 2, 12, "07:00"],
      ["Introduction to Input Devices", "इनपुट डिव्हाइसेसची ओळख", "U3UwS7N66_8", 3, 1, "08:00"],
      ["Keyboard – Types & Functions", "कीबोर्ड – प्रकार आणि कार्ये", "pJFf3byfdTA", 3, 2, "07:00"],
      ["Mouse & Pointing Devices", "माउस आणि पॉइंटिंग डिव्हाइसेस", "j4NkCvEPfKg", 3, 3, "08:00"],
      ["Scanner & Image Input Devices", "स्कॅनर आणि इमेज इनपुट डिव्हाइसेस", "mJgMGV1cGsA", 3, 4, "07:00"],
      ["Microphone & Audio Input", "मायक्रोफोन आणि ऑडिओ इनपुट", "AtvRVLOIgz4", 3, 5, "06:00"],
      ["Introduction to Output Devices", "आउटपुट डिव्हाइसेसची ओळख", "AP-RwebvkaY", 3, 6, "08:00"],
      ["Monitor – Types & Display Technology", "मॉनिटर – प्रकार आणि डिस्प्ले तंत्रज्ञान", "41GDzdvmXzg", 3, 7, "09:00"],
      ["Printer – Types & Working", "प्रिंटर – प्रकार आणि कार्यपद्धती", "8fmnihGzIgM", 3, 8, "08:00"],
      ["Speaker & Audio Output", "स्पीकर आणि ऑडिओ आउटपुट", "nk2qix32TTA", 3, 9, "07:00"],
      ["Projector & Other Output Devices", "प्रोजेक्टर आणि इतर आउटपुट डिव्हाइसेस", "H8zAjv7S_yE", 3, 10, "08:00"]
    ].map(([titleEn, titleMr, videoId, unitNumber, lessonNumber, duration], index) => ({
      title: { en: titleEn, mr: titleMr },
      videoUrl: `https://youtu.be/${videoId}`,
      duration,
      durationSeconds: Number(duration.split(':')[0]) * 60 + Number(duration.split(':')[1]),
      unitNumber,
      lessonNumber,
      order: index + 1,
      driveUrl: "https://drive.google.com/drive/folders/1gW1nRh89OrrSm6OCVRZnwoI3PnZPW7lA"
    }))
  }
];

const seedDB = async () => {
  try {
    await connectDB();
    for (const course of courses) {
      await Course.findOneAndUpdate(
        { "title.en": course.title.en },
        { $set: course },
        { upsert: true, new: true, runValidators: true }
      );
    }
    console.log("Courses seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDB();
