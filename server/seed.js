const mongoose = require('mongoose');
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
  }
];

const seedDB = async () => {
  try {
    await connectDB();
    await Course.deleteMany({});
    await Course.insertMany(courses);
    console.log("Database Seeded with Assignments!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDB();
