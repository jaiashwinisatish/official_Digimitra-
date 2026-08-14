<div align="center">

# 🎓 DigiMitra

### *Empowering Rural Students with Digital Education*

<br/>

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

<br/>

> **DigiMitra** is a full-stack bilingual e-learning platform built for Class 8–10 rural school students.  
> Students learn Computer Science through video lessons, AI-graded practicals, and earn verified certificates —  
> all in **English and Marathi** 🇮🇳

<br/>

</div>

---

## 📸 Platform Highlights

| Feature | Description |
|---------|-------------|
| 🎥 **Video Learning** | Custom YouTube & Google Drive embed player with watch-time tracking |
| 📊 **Live Progress** | Real-time lesson completion % saved to Supabase database |
| 🤖 **AI Chatbot** | Bilingual AI tutor answering computer science questions (EN + MR) |
| ✨ **AI Summaries** | Per-lesson AI-generated study notes in English and Marathi |
| 📝 **Practical Tasks** | Student submissions with instant AI grading and feedback |
| 🏆 **Certificates** | Verified certificates with unique IDs after 100% course completion |
| 🌐 **Bilingual** | Complete English + Marathi support across every screen |
| 🔐 **Supabase Auth** | Secure signup/login with per-student isolated data |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **npm** or **bun**
- A **Supabase** project (free tier works)

### 1. Clone the Repository
```bash
git clone https://github.com/lohith459/digimitra.git
cd digimitra
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Set Up Supabase Database
Run the SQL below in your **Supabase SQL Editor** (see full setup in the [Database Setup](#-database-setup) section).

### 5. Run Locally
```bash
npm run dev
```
Open **`http://localhost:8080`** in your browser. 🎉

---

## ✨ Features

### 🔐 Authentication & Student Profiles
- Secure **Sign Up / Login** via Supabase Auth
- Student profile stores: Name, Email, Mobile, Class (8th/9th/10th), Language Preference
- Data automatically saved to `profiles` table in Supabase
- Offline fallback using `localStorage`

### 📚 Courses Available
| Course | Lessons | Units | Practicals |
|--------|---------|-------|------------|
| **Microsoft Word Masterclass** | 7 screen-recorded lessons | 3 Units | 3 Tasks |
| **Introduction to Computers** | 30 animated video lessons | 3 Units | 3 Tasks |

### 📈 Real-Time Progress Tracking
Every student action is saved instantly to Supabase:
- ⏱️ **Watch time** per lesson (seconds + percentage)
- ✅ **Lesson completion** (auto-marked at 90% watched)
- 📋 **Practical submissions** with AI grade & feedback
- 📊 **Course-level summary** with overall % completion

### 🤖 AI Features
- **AI Chatbot** — covers CPU, RAM, ROM, I/O devices, MS Word, shortcuts, and more
- **AI Video Summarizer** — instant bilingual lesson notes with one click (`✨` button)
- **AI Practical Grader** — evaluates student submissions using keyword analysis

### 🏆 Certificate System
- **Locked** until student completes 100% videos + all practical tasks
- Auto-generates PDF-ready certificate with student name, class, course, and unique cert ID
- Unique verification code: `CERT-DIGI-XXXXXX-XX`

---

## 🗄️ Database Setup

Run this SQL in **Supabase → SQL Editor**:

```sql
-- 1. Profiles Table (Student Details)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Student',
  email TEXT,
  mobile TEXT DEFAULT '',
  student_class TEXT DEFAULT 'Class 9th',
  role TEXT DEFAULT 'student',
  language_preference TEXT DEFAULT 'en',
  enrolled_courses TEXT[] DEFAULT ARRAY['course-1', 'course-2'],
  total_lessons_completed INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own profile" ON public.profiles FOR ALL USING (auth.uid() = id);

-- 2. Lesson Progress Table
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL, course_title TEXT DEFAULT '',
  lesson_id TEXT NOT NULL, lesson_title TEXT DEFAULT '',
  unit_number INT DEFAULT 1, watch_seconds INT DEFAULT 0,
  total_seconds INT DEFAULT 600, watch_percentage INT DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE, completed_at TIMESTAMPTZ,
  last_watched_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own lesson progress" ON public.lesson_progress FOR ALL USING (true) WITH CHECK (true);

-- 3. Practical Submissions Table
CREATE TABLE IF NOT EXISTS public.practical_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL, course_title TEXT DEFAULT '',
  practical_id TEXT NOT NULL, practical_title TEXT DEFAULT '',
  unit_number INT DEFAULT 1, submission_text TEXT DEFAULT '',
  grade INT DEFAULT 0, feedback TEXT DEFAULT '',
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, practical_id)
);
ALTER TABLE public.practical_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own submissions" ON public.practical_submissions FOR ALL USING (true) WITH CHECK (true);

-- 4. Course Summary Table
CREATE TABLE IF NOT EXISTS public.course_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL, course_title TEXT DEFAULT '',
  total_lessons INT DEFAULT 0, completed_lessons INT DEFAULT 0,
  total_practicals INT DEFAULT 0, completed_practicals INT DEFAULT 0,
  completion_percentage INT DEFAULT 0, certificate_unlocked BOOLEAN DEFAULT FALSE,
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);
ALTER TABLE public.course_summary ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own course summary" ON public.course_summary FOR ALL USING (true) WITH CHECK (true);

-- 5. Legacy Progress Blob (fallback)
CREATE TABLE IF NOT EXISTS public.student_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  progress_data TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own progress" ON public.student_progress FOR ALL USING (true) WITH CHECK (true);

-- 6. Auto-create profile on signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, mobile, student_class, role, language_preference)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'mobile', ''),
    COALESCE(NEW.raw_user_meta_data->>'studentClass', 'Class 9th'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'languagePreference', 'en')
  ) ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Admin Overview (see all students + progress in one view)
CREATE OR REPLACE VIEW public.admin_student_overview AS
SELECT p.id AS student_id, p.name AS student_name, p.email, p.mobile,
  p.student_class, p.language_preference, p.created_at AS registered_at,
  cs.course_title, cs.completed_lessons, cs.total_lessons,
  cs.completed_practicals, cs.total_practicals,
  cs.completion_percentage, cs.certificate_unlocked, cs.last_activity
FROM public.profiles p
LEFT JOIN public.course_summary cs ON p.id = cs.user_id
ORDER BY p.created_at DESC;
```

> **Tip:** Disable "Confirm email" in **Supabase → Authentication → Sign In / Providers** for instant sign-up without email verification.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | React 18 + TypeScript |
| **Build Tool** | Vite 5 |
| **Styling** | Tailwind CSS 3 + Shadcn UI |
| **Icons** | Lucide React |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth |
| **Routing** | React Router DOM v6 |
| **State** | TanStack React Query |
| **Deployment** | Vercel |

---

## 📁 Project Structure

```
digimitra/
├── src/
│   ├── components/        # Reusable UI (Navbar, ChatBot, CourseCard…)
│   ├── context/
│   │   ├── AuthContext.tsx      # Global auth state + Supabase session
│   │   └── LanguageContext.tsx  # EN/MR bilingual toggle
│   ├── data/
│   │   ├── mockCourses.ts       # Course data, lessons, practicals
│   │   └── translations.ts      # EN + MR text strings
│   ├── lib/
│   │   └── supabase.ts          # Supabase client initialization
│   ├── pages/
│   │   ├── Home.tsx             # Landing page
│   │   ├── Register.tsx         # Student sign-up (Supabase Auth)
│   │   ├── Login.tsx            # Student login
│   │   ├── Dashboard.tsx        # Personal progress dashboard
│   │   ├── Courses.tsx          # Course listing
│   │   ├── CourseDetail.tsx     # Course overview + enroll
│   │   ├── VideoPlayer.tsx      # Video lessons + chatbot + practicals
│   │   └── Certificate.tsx      # Certificate generation & download
│   └── services/
│       └── api.ts               # API layer (auth, progress, AI chat/summary)
├── server/                # Express backend (optional)
├── public/                # Static assets
├── .env                   # Environment variables (not committed)
├── vercel.json            # Vercel deployment config
└── vite.config.ts         # Vite configuration
```

---

## 🌐 Deployment

This project is **Vercel-ready** out of the box.

1. Fork/clone this repo to your GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import from GitHub
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Click **Deploy** 🚀

---

## 👥 Target Users

- 🏫 **Students** (Class 8–10) in rural Maharashtra
- 👨‍🏫 **Teachers** monitoring student progress via Supabase admin view
- 🏛️ **Schools** deploying DigiMitra as a digital learning platform

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

Made with ❤️ for rural students of India 🇮🇳

**DigiMitra** — *Bridging the digital divide, one lesson at a time.*

</div>
