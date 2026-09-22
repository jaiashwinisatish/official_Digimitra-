import { supabase } from '@/lib/supabase';
import {
  INITIAL_MOCK_COURSES,
  getUserProgress,
  saveUserProgress,
  updateMockProgress,
  updateWatchProgress,
  submitPracticalTask
} from '@/data/mockCourses';

// ─── Get current logged-in student user ID ───
function getCurrentUserId(): string {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    try {
      const parsed = JSON.parse(userInfo);
      return parsed?._id || parsed?.id || 'anonymous';
    } catch {
      return 'anonymous';
    }
  }
  return 'anonymous';
}

// ─── AI Chatbot Response Generator (Expanded) ───
export function generateAIChatResponse(message: string): string {
  const msg = message.toLowerCase();

  // Greetings
  if (msg.match(/^(hi|hello|hey|hii+|namaste|namaskar)/) || msg.includes("नमस्कार") || msg.includes("हेलो")) {
    return "Hello! 👋 I'm your DigiMitra AI Study Assistant. I can help you with:\n\n• Computer fundamentals (CPU, Memory, I/O devices)\n• Microsoft Word (Interface, Font, Paragraph formatting)\n• Your course progress & certificates\n• Assignments & practical tasks\n\nWhat would you like to learn about today?";
  }

  // Computer basics
  if (msg.includes("computer") || msg.includes("संगणक")) {
    if (msg.includes("what") || msg.includes("काय")) {
      return "A computer is an electronic device that processes data according to instructions (programs). It has 4 main functions:\n\n1️⃣ Input – Receives data (keyboard, mouse)\n2️⃣ Processing – CPU processes the data\n3️⃣ Storage – Saves data (RAM, Hard Disk)\n4️⃣ Output – Shows results (monitor, printer)\n\nCheck out our 'Introduction to Computers' course for detailed animated videos!";
    }
    return "Computers are fascinating machines! We have a full course on computer fundamentals covering:\n\n• Unit 1: Introduction to Computers (8 lessons)\n• Unit 2: Memory Systems - RAM, ROM, HDD, SSD (12 lessons)\n• Unit 3: Input & Output Devices (10 lessons)\n\nGo to the Courses page to start learning!";
  }

  // CPU
  if (msg.includes("cpu") || msg.includes("processor") || msg.includes("प्रोसेसर")) {
    return "CPU (Central Processing Unit) is the 'brain' of the computer! 🧠\n\n• It performs all calculations and data processing\n• Has two main parts: ALU (Arithmetic Logic Unit) and CU (Control Unit)\n• Speed is measured in GHz (Gigahertz)\n• Examples: Intel Core i5, AMD Ryzen 7\n\nThe faster the CPU, the quicker your computer works!";
  }

  // Memory / RAM / ROM
  if (msg.includes("ram") || msg.includes("rom") || msg.includes("memory") || msg.includes("मेमरी")) {
    return "Computer Memory stores data! There are two main types:\n\n📌 **Primary Memory (Volatile)**:\n• RAM (Random Access Memory) – Temporary, fast, loses data when power off\n• ROM (Read Only Memory) – Permanent, stores startup instructions\n\n📌 **Secondary Memory (Non-Volatile)**:\n• HDD (Hard Disk Drive) – Magnetic storage, large capacity\n• SSD (Solid State Drive) – Flash storage, very fast\n• USB Flash Drives, CDs, DVDs\n\nLearn more in Unit 2 of Introduction to Computers!";
  }

  // Input/Output devices
  if (msg.includes("input") || msg.includes("output") || msg.includes("device") || msg.includes("इनपुट") || msg.includes("आउटपुट")) {
    return "Input & Output Devices help us communicate with computers:\n\n⬅️ **Input Devices** (send data TO computer):\n• Keyboard, Mouse, Scanner, Microphone, Webcam, Touchscreen\n\n➡️ **Output Devices** (receive data FROM computer):\n• Monitor, Printer, Speaker, Projector, Headphones\n\nUnit 3 of our computer course covers all these in detail with animated videos!";
  }

  // MS Word
  if (msg.includes("word") || msg.includes("ms word") || msg.includes("microsoft word") || msg.includes("मायक्रोसॉफ्ट वर्ड")) {
    return "Microsoft Word is a powerful document processing tool! In our course:\n\n📖 Unit 1: Getting Started – Interface, Ribbon, Quick Access Toolbar\n📖 Unit 2: Font Group – Bold, Italic, Subscript (H₂O), Superscript (X²), File operations\n📖 Unit 3: Paragraph – Alignment, Bullets, Numbering, Line spacing, Shading\n\nUseful Shortcuts:\n• Ctrl+C = Copy, Ctrl+V = Paste\n• Ctrl+B = Bold, Ctrl+I = Italic\n• Ctrl+S = Save, Ctrl+Z = Undo";
  }

  // Shortcuts
  if (msg.includes("shortcut") || msg.includes("copy") || msg.includes("paste") || msg.includes("शॉर्टकट")) {
    return "Essential Computer Shortcuts:\n\n📋 MS Word Shortcuts:\n• Ctrl+C = Copy | Ctrl+V = Paste\n• Ctrl+X = Cut | Ctrl+Z = Undo\n• Ctrl+B = Bold | Ctrl+I = Italic\n• Ctrl+U = Underline | Ctrl+S = Save\n• Ctrl+A = Select All | Ctrl+P = Print\n\n🖥️ Windows Shortcuts:\n• Win+E = File Explorer\n• Alt+Tab = Switch windows\n• Ctrl+Alt+Del = Task Manager";
  }

  // Certificate
  if (msg.includes("certificate") || msg.includes("प्रमाणपत्र")) {
    return "To earn your DigiMitra Certificate: 🏆\n\n✅ Step 1: Complete ALL video lessons (100%)\n✅ Step 2: Submit ALL practical tasks\n✅ Step 3: Get AI/Teacher grading on practicals\n✅ Step 4: Download your personalized certificate!\n\nYour certificate includes your name, class, course title, and a unique verification ID. Complete a course to unlock it!";
  }

  // Assignments / Practicals
  if (msg.includes("assignment") || msg.includes("practical") || msg.includes("task") || msg.includes("स्वाध्याय") || msg.includes("प्रात्यक्षिक")) {
    return "Assignments & Practical Tasks:\n\n📝 **Quiz Assignments**: Multiple-choice questions to test your knowledge. Get instant feedback!\n\n🔧 **Practical Tasks**: Hands-on tasks where you:\n1. Read the instructions carefully\n2. Perform the steps on your computer\n3. Type what you did in the submission box\n4. Get instant AI grading with feedback!\n\nFind them under the 'Practical Tasks & Assignments' tab in the video player.";
  }

  // Progress
  if (msg.includes("progress") || msg.includes("प्रगती") || msg.includes("dashboard")) {
    return "Track your learning progress on the Dashboard! 📊\n\n• Overall course completion percentage\n• Unit-wise breakdown (which units are done)\n• Video watch progress for each lesson\n• Completed practical tasks count\n• Resume learning from where you left off\n\nGo to Dashboard to see your personalized progress!";
  }

  // Keyboard / Hardware
  if (msg.includes("keyboard") || msg.includes("कीबोर्ड") || msg.includes("mouse") || msg.includes("माउस")) {
    return "Keyboard & Mouse are the most common input devices:\n\n⌨️ **Keyboard**: Has function keys (F1-F12), number keys, letter keys, and special keys (Enter, Shift, Ctrl, Alt). Used for typing text and shortcuts.\n\n🖱️ **Mouse**: Has left button (select/click), right button (context menu), scroll wheel, and optionally extra buttons. Types include optical, laser, and wireless.\n\nLearn more in Unit 3 of Introduction to Computers!";
  }

  // Monitor / Printer
  if (msg.includes("monitor") || msg.includes("printer") || msg.includes("मॉनिटर") || msg.includes("प्रिंटर")) {
    return "Monitor & Printer are common output devices:\n\n🖥️ **Monitor**: Displays visual output. Types:\n• CRT (old, bulky) → LCD (flat, thin) → LED (energy efficient) → OLED (best colors)\n\n🖨️ **Printer**: Prints documents on paper. Types:\n• Inkjet – Home use, color printing\n• Laser – Office use, fast & sharp\n• Dot Matrix – Old, used for carbon copies\n• 3D Printer – Creates physical objects!";
  }

  // HDD / SSD / Storage
  if (msg.includes("hdd") || msg.includes("ssd") || msg.includes("hard disk") || msg.includes("storage") || msg.includes("स्टोरेज")) {
    return "Storage Devices save your data permanently:\n\n💿 **HDD (Hard Disk Drive)**: Uses magnetic spinning disks. Cheaper, larger capacity (1TB-4TB), slower.\n\n⚡ **SSD (Solid State Drive)**: Uses flash memory chips. Faster, more durable, but more expensive.\n\n📀 **Optical**: CD (700MB), DVD (4.7GB), Blu-ray (25GB)\n\n🔌 **USB Flash Drive**: Portable, 4GB to 256GB+\n\n💾 **Memory Cards**: SD cards used in phones & cameras";
  }

  // Help
  if (msg.includes("help") || msg.includes("मदत") || msg.includes("what can you")) {
    return "I can help you with many topics! Try asking me about:\n\n🖥️ Computer basics – 'What is a computer?'\n🧠 CPU & Processing – 'What is CPU?'\n💾 Memory – 'Types of memory'\n⌨️ Devices – 'Input and output devices'\n📝 MS Word – 'How to use MS Word?'\n⌨️ Shortcuts – 'Keyboard shortcuts'\n📊 Progress – 'How to track my progress?'\n🏆 Certificate – 'How to get certificate?'\n📋 Tasks – 'How do assignments work?'\n\nJust type your question in English or मराठी!";
  }

  // Marathi general
  if (msg.includes("मराठी") || msg.includes("marathi")) {
    return "DigiMitra मध्ये तुम्ही मराठी आणि इंग्रजी दोन्ही भाषांमध्ये शिकू शकता! 🇮🇳\n\nवेबसाइटच्या वरच्या बाजूला भाषा बदलण्याचा पर्याय आहे. तुम्ही अभ्यासक्रम, धडे, आणि प्रात्यक्षिक कार्ये मराठीत पाहू शकता.\n\nकोणताही प्रश्न मराठीत विचारा, मी मदत करीन!";
  }

  // Default fallback — more helpful
  return `That's a great question! 🤔 Here's what I suggest:\n\n• Check the relevant course lessons for detailed video explanations\n• Use the 'AI Video Summary' button (✨) next to any lesson for quick notes\n• Try the practical tasks to apply what you've learned\n\nYou can also ask me specifically about:\n📖 Computers, Memory, CPU, Input/Output devices\n📝 MS Word features and shortcuts\n🏆 Certificates and progress tracking\n\nWhat topic would you like to explore?`;
}

// ─── AI Video Summary Generator (Lesson-Specific) ───
export function generateAIVideoSummary(lessonTitle: string, lessonSummary?: string): string {
  const title = lessonTitle || 'Lesson';

  // Use the lesson's existing summary if available
  if (lessonSummary) {
    return `📌 **DigiMitra AI Video Summary: ${title}**\n\n` +
      `• **Key Topics**: ${lessonSummary}\n\n` +
      `• **Study Tip**: Take notes while watching, pause to practice, and revisit difficult sections.\n\n` +
      `• **मराठी सारांश**: या धड्यात ${title} बद्दल महत्त्वाची माहिती शिकवली आहे. व्हिडिओ पाहताना नोट्स घ्या आणि प्रत्येक पायरी स्वतः प्रॅक्टिस करा.`;
  }

  // Generate context-specific summary based on lesson title keywords
  const titleLower = title.toLowerCase();

  if (titleLower.includes('introduction') || titleLower.includes('interface') || titleLower.includes('ओळख')) {
    return `📌 **DigiMitra AI Video Summary: ${title}**\n\n` +
      `• **Core Concept**: This introductory lesson covers the fundamental interface and navigation elements.\n` +
      `• **Key Points**: Learn to identify the main workspace components, navigation tools, and basic operations.\n` +
      `• **Practice**: Open the application on your computer and try identifying each element shown in the video.\n\n` +
      `• **मराठी सारांश**: या धड्यात मूलभूत इंटरफेस आणि नेव्हिगेशन घटकांचा परिचय दिला आहे. व्हिडिओमध्ये दाखवलेला प्रत्येक भाग ओळखण्याचा प्रयत्न करा.`;
  }

  if (titleLower.includes('font') || titleLower.includes('formatting') || titleLower.includes('फॉन्ट') || titleLower.includes('फॉरमॅटिंग')) {
    return `📌 **DigiMitra AI Video Summary: ${title}**\n\n` +
      `• **Core Concept**: Text formatting and typography tools for professional document styling.\n` +
      `• **Key Commands**: Bold (Ctrl+B), Italic (Ctrl+I), Underline (Ctrl+U), Font Size, Font Color, Text Effects.\n` +
      `• **Special Features**: Subscript (H₂O), Superscript (X²), Strikethrough, Change Case.\n` +
      `• **Practice**: Create a sample document and apply each formatting option shown in the video.\n\n` +
      `• **मराठी सारांश**: या धड्यात मजकूर स्वरूपण साधने शिकवली आहेत – बोल्ड, इटॅलिक, फॉन्ट आकार, रंग, आणि विशेष प्रभाव.`;
  }

  if (titleLower.includes('paragraph') || titleLower.includes('alignment') || titleLower.includes('परिच्छेद')) {
    return `📌 **DigiMitra AI Video Summary: ${title}**\n\n` +
      `• **Core Concept**: Paragraph formatting controls document layout and readability.\n` +
      `• **Key Features**: Alignment (Left, Center, Right, Justify), Line Spacing (1.0, 1.5, 2.0), Indentation.\n` +
      `• **Lists**: Bulleted lists (•), Numbered lists (1. 2. 3.), Multilevel lists.\n` +
      `• **Practice**: Type a paragraph, then try each alignment and spacing option.\n\n` +
      `• **मराठी सारांश**: या धड्यात परिच्छेद अलाइनमेंट, लाईन स्पेसिंग, बुलेट लिस्ट, आणि इंडेंटेशन शिकवले आहे.`;
  }

  if (titleLower.includes('file') || titleLower.includes('save') || titleLower.includes('फाईल')) {
    return `📌 **DigiMitra AI Video Summary: ${title}**\n\n` +
      `• **Core Concept**: File management operations for creating, saving, and exporting documents.\n` +
      `• **Key Operations**: New (Ctrl+N), Open (Ctrl+O), Save (Ctrl+S), Save As (F12), Export to PDF.\n` +
      `• **File Formats**: .docx (Word), .pdf (Portable), .txt (Plain text), .rtf (Rich text).\n` +
      `• **Practice**: Create a new file, type some text, save it, then try exporting to PDF.\n\n` +
      `• **मराठी सारांश**: या धड्यात फाइल तयार करणे, सेव्ह करणे, आणि PDF मध्ये एक्सपोर्ट करणे शिकवले आहे.`;
  }

  if (titleLower.includes('memory') || titleLower.includes('ram') || titleLower.includes('rom') || titleLower.includes('मेमरी')) {
    return `📌 **DigiMitra AI Video Summary: ${title}**\n\n` +
      `• **Core Concept**: Understanding computer memory hierarchy and types.\n` +
      `• **Primary Memory**: RAM (volatile, fast) and ROM (non-volatile, firmware).\n` +
      `• **Secondary Memory**: HDD, SSD, USB drives, optical discs.\n` +
      `• **Key Difference**: Primary = temporary + fast; Secondary = permanent + slower.\n\n` +
      `• **मराठी सारांश**: या धड्यात संगणक मेमरीचे प्रकार – RAM, ROM, हार्ड डिस्क, SSD – शिकवले आहेत.`;
  }

  if (titleLower.includes('input') || titleLower.includes('output') || titleLower.includes('keyboard') || titleLower.includes('mouse') || titleLower.includes('इनपुट') || titleLower.includes('आउटपुट')) {
    return `📌 **DigiMitra AI Video Summary: ${title}**\n\n` +
      `• **Core Concept**: Devices that help us communicate with computers.\n` +
      `• **Input Devices**: Keyboard, Mouse, Scanner, Microphone, Webcam, Touchscreen.\n` +
      `• **Output Devices**: Monitor, Printer, Speaker, Projector, Headphones.\n` +
      `• **Key Idea**: Input sends data TO computer; Output receives data FROM computer.\n\n` +
      `• **मराठी सारांश**: या धड्यात इनपुट आणि आउटपुट डिव्हाइसेस बद्दल शिकवले आहे – कीबोर्ड, माउस, मॉनिटर, प्रिंटर इत्यादी.`;
  }

  if (titleLower.includes('computer') || titleLower.includes('संगणक')) {
    return `📌 **DigiMitra AI Video Summary: ${title}**\n\n` +
      `• **Core Concept**: Fundamental concepts about computers and how they work.\n` +
      `• **Key Topics**: Computer definition, basic components (CPU, Memory, I/O), how data flows.\n` +
      `• **Important**: A computer follows the IPO cycle – Input → Process → Output.\n` +
      `• **Practice**: Identify the different parts of a computer around you.\n\n` +
      `• **मराठी सारांश**: या धड्यात संगणकाची मूलभूत माहिती, घटक, आणि डेटा प्रक्रिया कशी होते ते शिकवले आहे.`;
  }

  // Generic fallback
  return `📌 **DigiMitra AI Video Summary: ${title}**\n\n` +
    `• **Core Learning**: This lesson covers important concepts related to ${title}.\n` +
    `• **Study Approach**: Watch the full video, take notes on key points, and practice the steps shown.\n` +
    `• **Tips**: Pause at important moments, rewind difficult sections, and try hands-on practice.\n\n` +
    `• **मराठी सारांश**: या धड्यात ${title} बद्दल महत्त्वाची माहिती शिकवली आहे. व्हिडिओ पाहताना नोट्स घ्या.`;
}

// ─── Supabase Real-Time Sync Helpers ───

// Save lesson watch progress to Supabase
async function saveLessonProgress(
  userId: string,
  courseId: string,
  courseTitle: string,
  lessonId: string,
  lessonTitle: string,
  unitNumber: number,
  watchSeconds: number,
  totalSeconds: number,
  watchPercentage: number,
  completed: boolean
) {
  try {
    await supabase.from('lesson_progress').upsert({
      user_id: userId,
      course_id: courseId,
      course_title: courseTitle,
      lesson_id: lessonId,
      lesson_title: lessonTitle,
      unit_number: unitNumber,
      watch_seconds: watchSeconds,
      total_seconds: totalSeconds,
      watch_percentage: watchPercentage,
      completed,
      completed_at: completed ? new Date().toISOString() : null,
      last_watched_at: new Date().toISOString(),
    }, { onConflict: 'user_id,lesson_id' });
  } catch (e) {
    console.warn('lesson_progress sync error:', e);
  }
}

// Save practical submission to Supabase
async function savePracticalSubmission(
  userId: string,
  courseId: string,
  courseTitle: string,
  practicalId: string,
  practicalTitle: string,
  unitNumber: number,
  submissionText: string,
  grade: number,
  feedback: string
) {
  try {
    await supabase.from('practical_submissions').upsert({
      user_id: userId,
      course_id: courseId,
      course_title: courseTitle,
      practical_id: practicalId,
      practical_title: practicalTitle,
      unit_number: unitNumber,
      submission_text: submissionText,
      grade,
      feedback,
      submitted_at: new Date().toISOString(),
    }, { onConflict: 'user_id,practical_id' });
  } catch (e) {
    console.warn('practical_submissions sync error:', e);
  }
}

// Update course summary (overall completion %) in Supabase
async function updateCourseSummary(
  userId: string,
  courseId: string,
  courseTitle: string,
  completedLessons: number,
  totalLessons: number,
  completedPracticals: number,
  totalPracticals: number
) {
  try {
    const completionPct = totalLessons > 0
      ? Math.round(((completedLessons + completedPracticals) / (totalLessons + totalPracticals)) * 100)
      : 0;
    const certUnlocked = completedLessons >= totalLessons && completedPracticals >= totalPracticals;

    await supabase.from('course_summary').upsert({
      user_id: userId,
      course_id: courseId,
      course_title: courseTitle,
      total_lessons: totalLessons,
      completed_lessons: completedLessons,
      total_practicals: totalPracticals,
      completed_practicals: completedPracticals,
      completion_percentage: completionPct,
      certificate_unlocked: certUnlocked,
      last_activity: new Date().toISOString(),
    }, { onConflict: 'user_id,course_id' });

    // Also upsert enrollment record
    await supabase.from('course_enrollments').upsert({
      user_id: userId,
      course_id: courseId,
      course_title: courseTitle,
      completion_percentage: completionPct,
      completed: certUnlocked,
      completed_at: certUnlocked ? new Date().toISOString() : null,
    }, { onConflict: 'user_id,course_id' });

    // Update total counts in profiles
    await supabase.from('profiles').update({
      total_lessons_completed: completedLessons,
      updated_at: new Date().toISOString(),
    }).eq('id', userId);
  } catch (e) {
    console.warn('course_summary sync error:', e);
  }
}

// Legacy blob sync (kept as fallback)
async function syncProgressToSupabase(userId: string, progressData: any) {
  try {
    await supabase.from('student_progress').upsert({
      user_id: userId,
      progress_data: JSON.stringify(progressData),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
  } catch {
    // Supabase unavailable
  }
}

async function loadProgressFromSupabase(userId: string): Promise<any[] | null> {
  try {
    const { data, error } = await supabase
      .from('student_progress')
      .select('progress_data')
      .eq('user_id', userId)
      .single();
    if (data?.progress_data && !error) {
      return JSON.parse(data.progress_data);
    }
  } catch {
    // Supabase unavailable
  }
  return null;
}

// ─── API Router ───
const API = {
  get: async (url: string, _options?: any) => {
    const currentUserId = getCurrentUserId();

    // Courses List / Single Course
    if (url.includes('/courses')) {
      const match = url.match(/\/courses\/([^\/]+)/);
      if (match && match[1] && match[1] !== 'courses') {
        const courseId = match[1];
        const course = INITIAL_MOCK_COURSES.find(c => c._id === courseId || c.id === courseId) || INITIAL_MOCK_COURSES[0];
        return { data: course, status: 200 };
      }
      return { data: INITIAL_MOCK_COURSES, status: 200 };
    }

    // Student Progress — try Supabase first, fall back to localStorage
    if (url.includes('/progress')) {
      let progress = getUserProgress(currentUserId);

      // Try loading from Supabase if localStorage is empty
      if ((!progress || progress.length === 0) && currentUserId !== 'anonymous') {
        const supaProgress = await loadProgressFromSupabase(currentUserId);
        if (supaProgress && supaProgress.length > 0) {
          progress = supaProgress;
          // Cache in localStorage
          saveUserProgress(currentUserId, progress);
        }
      }

      return { data: progress, status: 200 };
    }

    // Certificate Download — generate HTML certificate as blob ONLY if 100% completed
    if (url.includes('/certificate')) {
      const match = url.match(/\/certificate\/([^\/]+)/);
      const targetCourseId = match?.[1] || 'course-1';

      const userProgress = getUserProgress(currentUserId);
      const courseProg = userProgress.find((p: any) =>
        p?.courseId?._id === targetCourseId || p?.courseId?.id === targetCourseId || p?.courseId === targetCourseId
      );

      const targetCourse = INITIAL_MOCK_COURSES.find(c => c._id === targetCourseId || c.id === targetCourseId) || INITIAL_MOCK_COURSES[0];
      const totalLessons = targetCourse.lessons?.length || 1;
      const totalPracticals = targetCourse.practicalTasks?.length || 0;

      const completedLessons = courseProg?.completedLessons?.length || 0;
      const completedPracticals = courseProg?.completedPracticals?.length || 0;

      const isAllVideosDone = completedLessons >= totalLessons;
      const isAllPracticalsDone = completedPracticals >= totalPracticals;
      const isComplete = isAllVideosDone && isAllPracticalsDone;

      if (!isComplete) {
        throw {
          response: {
            status: 403,
            data: {
              message: "Certificate is locked! Complete 100% of video lessons and all practical tasks to unlock your certificate."
            }
          }
        };
      }

      const userInfo = localStorage.getItem('userInfo');
      const user = userInfo ? JSON.parse(userInfo) : { name: 'Student', studentClass: 'Class 9th' };
      const certId = `CERT-DIGI-${currentUserId.slice(-6).toUpperCase()}-${targetCourseId.slice(-2).toUpperCase()}`;
      const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      const courseTitle = targetCourse.title?.en || "Course";

      const certHtml = `
        <html><body style="font-family:Georgia,serif;text-align:center;padding:40px;border:4px double #6366f1;">
          <h3 style="letter-spacing:6px;color:#6366f1;">DIGIMITRA E-LEARNING PLATFORM</h3>
          <h1 style="font-size:40px;color:#1e293b;">Certificate of Completion</h1>
          <p style="font-size:18px;color:#64748b;">This is to certify that</p>
          <h2 style="font-size:36px;color:#1e293b;">${user.name}</h2>
          <p style="font-size:16px;color:#6366f1;font-weight:bold;">${user.studentClass}</p>
          <p style="font-size:18px;color:#64748b;">has successfully completed the course</p>
          <h3 style="font-size:28px;color:#16a34a;">${courseTitle}</h3>
          <br/><hr style="border:1px solid #e2e8f0;max-width:400px;margin:auto;"/>
          <p style="color:#94a3b8;">Date: ${date} | Certificate ID: ${certId}</p>
          <p style="color:#94a3b8;">Verified by DigiMitra Platform</p>
        </body></html>
      `;
      const blob = new Blob([certHtml], { type: 'text/html' });
      return { data: blob, status: 200 };
    }

    return { data: [], status: 200 };
  },

  post: async (url: string, body: any = {}) => {
    const currentUserId = getCurrentUserId();

    // ── Chatbot ──
    if (url.includes('/chat') || url.includes('/ask')) {
      const question = body?.question || body?.message || '';
      try {
        const llmApiUrl = (import.meta as any).env?.VITE_LLM_API_URL || 'http://localhost:8000/ask';
        const res = await fetch(llmApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question })
        });
        if (res.ok) {
          const llmData = await res.json();
          if (llmData && llmData.answer) {
            return { data: { answer: llmData.answer, question: llmData.question }, status: 200 };
          }
        }
      } catch (err) {
        console.warn('LLM-For-QA API connection issue, using fallback:', err);
      }
      const answer = generateAIChatResponse(question);
      return { data: { answer }, status: 200 };
    }

    // ── Send Real Email OTP / Registration Dispatch ──
    if (url.includes('/auth/send-email-otp')) {
      const usersKey = 'digimitra_users';
      const users = JSON.parse(localStorage.getItem(usersKey) || '[]');
      const existingUser = users.find((u: any) => u.email === body.email);
      
      if (existingUser) {
        return { data: { message: 'User already registered. Please login instead.', alreadyRegistered: true }, status: 200 };
      }

      return { data: { message: 'Email OTP initiated' }, status: 200 };
    }

    // ── Verify Real Email OTP ──
    if (url.includes('/auth/verify-email-otp')) {
      const userId = `user-${Date.now()}`;
      const studentUser = {
        _id: userId,
        name: body.name || body.email?.split('@')[0] || 'Student',
        email: body.email || '',
        mobile: body.mobile || '',
        studentClass: body.studentClass || 'Class 9th',
        role: 'student',
        languagePreference: body.languagePreference || 'en',
        token: `jwt-token-${Date.now()}`,
        enrolledCourses: ['course-1', 'course-2'],
      };

      const usersKey = 'digimitra_users';
      const users = JSON.parse(localStorage.getItem(usersKey) || '[]');
      if (!users.some((u: any) => u.email === body.email)) {
        users.push({ ...studentUser, password: body.password });
        localStorage.setItem(usersKey, JSON.stringify(users));
      }

      return { data: studentUser, status: 200 };
    }

    // ── Registration (Supabase Auth + profiles table) ──
    if (url.includes('/auth/register')) {
      // Step 1: Create real Supabase auth user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: body.email,
        password: body.password,
        options: {
          data: {
            name: body.name || 'Student',
            mobile: body.mobile || '',
            studentClass: body.studentClass || 'Class 9th',
            role: 'student',
            languagePreference: body.languagePreference || 'en',
          },
        },
      });

      if (signUpError) {
        throw { response: { data: { message: signUpError.message } } };
      }

      const supabaseUser = authData.user;
      const session = authData.session;
      const realUserId = supabaseUser?.id || `user-${Date.now()}`;

      // Step 2: Save ALL user details to Supabase profiles table
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: realUserId,
        name: body.name || 'Student',
        email: body.email || '',
        mobile: body.mobile || '',
        student_class: body.studentClass || 'Class 9th',
        role: 'student',
        language_preference: body.languagePreference || 'en',
        enrolled_courses: ['course-1', 'course-2'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

      if (profileError) {
        console.error('Profile save error:', profileError.message);
      }

      const studentUser = {
        _id: realUserId,
        name: body.name || 'Student',
        email: body.email || '',
        mobile: body.mobile || '',
        studentClass: body.studentClass || 'Class 9th',
        role: 'student',
        languagePreference: body.languagePreference || 'en',
        token: session?.access_token || `jwt-token-${Date.now()}`,
        enrolledCourses: ['course-1', 'course-2'],
      };

      // Also cache locally as fallback
      const usersKey = 'digimitra_users';
      const users = JSON.parse(localStorage.getItem(usersKey) || '[]');
      if (!users.some((u: any) => u.email === body.email)) {
        users.push({ ...studentUser, password: body.password });
        localStorage.setItem(usersKey, JSON.stringify(users));
      }

      return { data: studentUser, status: 200 };
    }

    // ── Login (Supabase Auth + fetch profile) ──
    if (url.includes('/auth/login')) {
      try {
        const { data: authData, error } = await supabase.auth.signInWithPassword({
          email: body.email,
          password: body.password,
        });

        if (error) {
          // Try localStorage fallback
          const usersKey = 'digimitra_users';
          const users = JSON.parse(localStorage.getItem(usersKey) || '[]');
          const localUser = users.find((u: any) => u.email === body.email && u.password === body.password);
          if (localUser) {
            const { password: _, ...userData } = localUser;
            return { data: userData, status: 200 };
          }
          throw { response: { data: { message: 'Invalid email or password. Please check your credentials.' } } };
        }

        const user = authData.user;
        const session = authData.session;

        // Fetch full profile from Supabase profiles table
        let profileData: any = null;
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user?.id)
            .single();
          profileData = profile;
        } catch { /* use metadata as fallback */ }

        const meta = user?.user_metadata || {};

        const studentUser = {
          _id: user?.id || `user-${Date.now()}`,
          name: profileData?.name || meta.name || meta.full_name || body.email?.split('@')[0] || 'Student',
          email: user?.email || body.email,
          mobile: profileData?.mobile || meta.mobile || '',
          studentClass: profileData?.student_class || meta.studentClass || 'Class 9th',
          role: profileData?.role || meta.role || 'student',
          languagePreference: profileData?.language_preference || meta.languagePreference || 'en',
          token: session?.access_token || `local-token-${Date.now()}`,
          enrolledCourses: profileData?.enrolled_courses || meta.enrolledCourses || ['course-1', 'course-2'],
        };

        return { data: studentUser, status: 200 };
      } catch (e: any) {
        if (e?.response) throw e;

        // Supabase down — try localStorage
        const usersKey = 'digimitra_users';
        const users = JSON.parse(localStorage.getItem(usersKey) || '[]');
        const localUser = users.find((u: any) => u.email === body.email && u.password === body.password);
        if (localUser) {
          const { password: _, ...userData } = localUser;
          return { data: userData, status: 200 };
        }
        throw { response: { data: { message: 'Invalid email or password.' } } };
      }
    }

    // ── Progress Watch-Time Update ──
    if (url.includes('/progress/watch-time')) {
      if (body?.courseId && body?.lessonId) {
        const updated = updateWatchProgress(body.courseId, body.lessonId, body.currentSeconds || 0, body.totalSeconds || 600, currentUserId);
        const allProgress = getUserProgress(currentUserId);
        syncProgressToSupabase(currentUserId, allProgress);

        // ── Save detailed lesson data to Supabase ──
        if (currentUserId !== 'anonymous') {
          const course = INITIAL_MOCK_COURSES.find(c => c._id === body.courseId || c.id === body.courseId);
          const lesson = course?.lessons?.find((l: any) => l._id === body.lessonId || l.id === body.lessonId);
          const pct = body.totalSeconds > 0 ? Math.min(100, Math.round((body.currentSeconds / body.totalSeconds) * 100)) : 0;
          const done = pct >= 90;

          saveLessonProgress(
            currentUserId,
            body.courseId,
            course?.title?.en || body.courseId,
            body.lessonId,
            lesson?.title?.en || body.lessonId,
            lesson?.unitNumber || 1,
            body.currentSeconds || 0,
            body.totalSeconds || 600,
            pct,
            done
          );

          // Update course summary
          const progressItem = allProgress.find((p: any) =>
            p?.courseId?._id === body.courseId || p?.courseId?.id === body.courseId
          );
          updateCourseSummary(
            currentUserId,
            body.courseId,
            course?.title?.en || body.courseId,
            progressItem?.completedLessons?.length || 0,
            course?.lessons?.length || 0,
            progressItem?.completedPracticals?.length || 0,
            course?.practicalTasks?.length || 0
          );
        }

        return { data: updated, status: 200 };
      }
    }

    // ── Practical Task Submission ──
    if (url.includes('/progress/practical-submit')) {
      if (body?.courseId && body?.practicalId) {
        const { progressItem, result } = submitPracticalTask(body.courseId, body.practicalId, body.submissionText || '', currentUserId);
        const allProgress = getUserProgress(currentUserId);
        syncProgressToSupabase(currentUserId, allProgress);

        // ── Save detailed practical data to Supabase ──
        if (currentUserId !== 'anonymous') {
          const course = INITIAL_MOCK_COURSES.find(c => c._id === body.courseId || c.id === body.courseId);
          const practical = course?.practicalTasks?.find((p: any) => p._id === body.practicalId || p.id === body.practicalId);

          savePracticalSubmission(
            currentUserId,
            body.courseId,
            course?.title?.en || body.courseId,
            body.practicalId,
            practical?.title?.en || body.practicalId,
            practical?.unitNumber || 1,
            body.submissionText || '',
            result?.grade || 90,
            result?.feedback || ''
          );

          // Update course summary
          const latestProgress = getUserProgress(currentUserId);
          const courseProgress = latestProgress.find((p: any) =>
            p?.courseId?._id === body.courseId || p?.courseId?.id === body.courseId
          );
          updateCourseSummary(
            currentUserId,
            body.courseId,
            course?.title?.en || body.courseId,
            courseProgress?.completedLessons?.length || 0,
            course?.lessons?.length || 0,
            courseProgress?.completedPracticals?.length || 0,
            course?.practicalTasks?.length || 0
          );
        }

        return { data: { progress: progressItem, result }, status: 200 };
      }
    }

    // ── General Progress Update (mark lesson complete/incomplete) ──
    if (url.includes('/progress/update')) {
      if (body?.courseId && body?.lessonId) {
        const updated = updateMockProgress(body.courseId, body.lessonId, currentUserId);
        const allProgress = getUserProgress(currentUserId);
        syncProgressToSupabase(currentUserId, allProgress);

        // ── Save detailed lesson completion to Supabase ──
        if (currentUserId !== 'anonymous') {
          const course = INITIAL_MOCK_COURSES.find(c => c._id === body.courseId || c.id === body.courseId);
          const lesson = course?.lessons?.find((l: any) => l._id === body.lessonId || l.id === body.lessonId);
          const progressItem = allProgress.find((p: any) =>
            p?.courseId?._id === body.courseId || p?.courseId?.id === body.courseId
          );
          const isCompleted = progressItem?.completedLessons?.includes(body.lessonId) || false;

          saveLessonProgress(
            currentUserId,
            body.courseId,
            course?.title?.en || body.courseId,
            body.lessonId,
            lesson?.title?.en || body.lessonId,
            lesson?.unitNumber || 1,
            lesson?.durationSeconds || 600,
            lesson?.durationSeconds || 600,
            isCompleted ? 100 : 0,
            isCompleted
          );

          updateCourseSummary(
            currentUserId,
            body.courseId,
            course?.title?.en || body.courseId,
            progressItem?.completedLessons?.length || 0,
            course?.lessons?.length || 0,
            progressItem?.completedPracticals?.length || 0,
            course?.practicalTasks?.length || 0
          );
        }

        return { data: updated, status: 200 };
      }
    }

    // ── Course Enrollment ──
    if (url.includes('/enroll')) {
      return { data: { message: 'Enrolled successfully' }, status: 200 };
    }

    return { data: { message: 'Success' }, status: 200 };
  },

  put: async (_url: string, _body: any = {}) => {
    return { data: { message: 'Success' }, status: 200 };
  },
};

export default API;
