# 🎓 DigiMitra – Dynamic E-Learning & Student Management Platform

> **Empowering rural school students (Class 8th–10th) with accessible, bilingual digital computer education.**

---

## 🌟 Overview

**DigiMitra** is a state-of-the-art e-learning and student management platform designed specifically for school students. It provides interactive computer courses, video learning tracking, assignment evaluations, AI-assisted Q&A tutoring, and verifiable certificates of completion upon 100% course completion.

Each student has a **personalized dashboard** where their individual course progress, watch history, assignment submissions, practical grades, and certificates are isolated and tracked securely.

---

## ✨ Key Features

### 🔐 1. Student Auth & Profile Management
* Personalized user registration & login (Name, Class 8th/9th/10th, Mobile, Email, Password).
* Supabase Authentication with offline `localStorage` fallback.
* Isolated student dashboards — progress data is stored per user ID and never shared across accounts.

### 📚 2. Multi-Course Curriculum
* **Microsoft Word Masterclass**: 7 Screen recording lessons across 3 Units, Quizzes & Practical Tasks.
* **Introduction to Computers**: 30 Animated video lessons across 3 Units (Unit 1: Fundamentals, Unit 2: Memory, Unit 3: Input/Output Devices), 5 MCQs & 3 Practical Tasks.

### 🎥 3. Video Player & Progress Tracking
* Custom YouTube & Google Drive embed player.
* Video Scrubber tracking watch time in seconds and percentage.
* Automatic course completion logic upon reaching 100% completion.

### 📝 4. Practical Tasks & AI Grader
* Students submit practical answers for computer tasks.
* **Instant AI Evaluation**: Evaluates answers using keyword criteria (RAM, ROM, CPU, I/O devices, formatting) and returns immediate percentage scores and constructive feedback.

### 🤖 5. AI Chatbot & Video Summarizer
* **Bilingual AI Chatbot**: Assists students in both English and Marathi with 15+ topic categories and quick-reply suggestion chips.
* **AI Video Summary Generator**: Produces instant, lesson-specific bilingual study notes (`✨`).

### 🔒 6. Verified Course Certificates
* **Strict Certificate Locking**: Certificates remain locked until a student completes **100% of video lessons and all practical tasks**.
* Generates verifiable certificate codes (e.g., `CERT-DIGI-XXXXXX-C1`) with print/download functionality.

### 🌐 7. Complete Multi-Language Support
* Full English and Marathi (`en` / `mr`) translations across all pages, navigation, dashboard, video player, chatbot, and certificate verification.

---

## 🛠️ Technology Stack

* **Frontend**: React 18, TypeScript, Vite, TailwindCSS, Shadcn UI, Lucide Icons, Framer Motion
* **Backend / Database**: Supabase (PostgreSQL, Row Level Security, Auth), Node.js / Express
* **State & Query**: TanStack React Query, React Router DOM v6
* **Deployment**: Vercel ready (`vercel.json` included)

---

## 📁 Folder Structure

```
New_Digimitra/
├── src/
│   ├── components/       # Reusable UI components (VideoPlayer, Chatbot, CourseCard, etc.)
│   ├── context/          # Global Contexts (AuthContext, LanguageContext)
│   ├── data/             # Mock Course Data, Translations, LocalStorage progress
│   ├── lib/              # Supabase Client setup & utility helpers
│   ├── pages/            # Page Views (Home, Dashboard, Courses, VideoPlayer, Certificate, Login, Register)
│   └── services/         # API Service Layer (Bilingual Chatbot, AI Summaries, Certificate logic)
├── server/               # Node.js / Express backend API service
├── public/               # Static assets & logos
└── vercel.json           # Vercel deployment configuration
```

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/jaiashwinisatish/New_Digimitra.git
cd New_Digimitra
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables (`.env`)
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://gvfugrbaincliadaxqcw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Run Locally
```bash
npm run dev
```
Open **`http://localhost:8080`** in your browser.

---

## 📊 Supabase Database Setup

Run the following SQL in your Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile TEXT,
  student_class TEXT DEFAULT 'Class 9th',
  role TEXT DEFAULT 'student',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  progress_data JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).
