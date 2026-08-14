# 🎓 DigiMitra — Digital Learning Platform for Students

<div align="center">

![DigiMitra Banner](https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200&h=300)

**An AI-powered e-learning platform built for Maharashtra students (Class 8–10)**  
*Learn MS Word, Computer Fundamentals & more — in English and मराठी*

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?logo=supabase)](https://supabase.com)
[![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-cyan?logo=tailwindcss)](https://tailwindcss.com)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎥 **Video Lessons** | YouTube-integrated lessons with watch progress tracking |
| 🤖 **AI Chatbot** | Ask questions in English or मराठी — get instant answers |
| 📊 **Real-Time Progress** | Per-lesson watch %, completion status saved to Supabase |
| 📝 **Practical Tasks** | Submit assignments, get AI grading & feedback instantly |
| 🏆 **Certificates** | Auto-generated certificate on 100% course completion |
| 🌐 **Bilingual** | Full English + मराठी language support |
| 🔐 **Auth** | Supabase Auth — secure sign up & login |
| 📱 **Responsive** | Works on mobile, tablet, and desktop |

---

## 🛠️ Tech Stack

```
Frontend   → React 18 + TypeScript + Vite
Styling    → TailwindCSS + shadcn/ui components
Database   → Supabase (PostgreSQL) — real-time
Auth       → Supabase Auth (email/password)
AI         → Custom AI chatbot + video summary engine
State      → React Context API
Routing    → React Router v6
```

---

## 📂 Project Structure

```
src/
├── components/       # Reusable UI components (Chatbot, Navbar, etc.)
├── context/          # AuthContext, LanguageContext
├── data/             # Course data, lessons, practical tasks
├── hooks/            # Custom React hooks
├── layouts/          # Page layouts
├── lib/              # Supabase client config
├── pages/            # All pages (Home, Dashboard, Register, Login...)
├── services/         # API service (Supabase integration)
└── main.tsx          # App entry point
```

---

## 🗄️ Supabase Database Tables

| Table | Purpose |
|-------|---------|
| `profiles` | Student details (name, email, mobile, class) |
| `course_enrollments` | Which student enrolled in which course |
| `lesson_progress` | Per-lesson watch time & completion % |
| `practical_submissions` | Submission text + AI grade + feedback |
| `course_summary` | Overall course completion & certificate status |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) account

### 1. Clone the Repository
```bash
git clone https://github.com/lohith459/digimitra.git
cd digimitra
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set Up Supabase Database

Run the following SQL in your **Supabase SQL Editor**:

```sql
-- profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT DEFAULT 'Student',
  email TEXT,
  mobile TEXT DEFAULT '',
  student_class TEXT DEFAULT 'Class 9th',
  role TEXT DEFAULT 'student',
  language_preference TEXT DEFAULT 'en',
  enrolled_courses TEXT[] DEFAULT ARRAY['course-1', 'course-2'],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own profile" ON public.profiles FOR ALL USING (auth.uid() = id);
```

> See full SQL setup in [`supabase_setup.md`](./supabase_setup.md)

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 📸 Pages Overview

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Landing page with features & course preview |
| Register | `/register` | Student sign-up (saved to Supabase) |
| Login | `/login` | Supabase Auth login |
| Dashboard | `/dashboard` | Progress overview, enrolled courses |
| Courses | `/courses` | Browse all available courses |
| Video Player | `/course/:id` | Watch lessons, submit practicals, chat with AI |
| Certificate | `/certificate/:id` | Download completion certificate |
| Admin | `/admin` | View all student progress (admin only) |

---

## 🎯 Courses Available

### 📘 Course 1: Microsoft Word Masterclass
- Unit 1: Getting Started (Interface, Ribbon, Toolbar)
- Unit 2: Font Group & File Management
- Unit 3: Paragraph Formatting & Layout
- 7 video lessons + 3 practical tasks

### 💻 Course 2: Introduction to Computers
- Unit 1: Computer Basics & Generations
- Unit 2: Memory Systems (RAM, ROM, HDD, SSD)
- Unit 3: Input & Output Devices
- 30 video lessons + 3 practical tasks

---

## 🌐 Bilingual Support

DigiMitra supports **English** and **मराठी** across:
- All course titles and descriptions
- Lesson titles and content
- Practical task instructions
- UI navigation and buttons
- AI chatbot responses

---

## 🤖 AI Features

- **AI Chatbot** — Answers student questions about computer science topics
- **AI Video Summary** — Generates lesson summaries with key points
- **AI Grader** — Evaluates practical task submissions and gives feedback

---

## 🔐 Authentication Flow

1. Student registers with name, email, mobile, class, language
2. Supabase creates auth user + auto-saves to `profiles` table
3. Login fetches profile from Supabase for full user data
4. Session persisted with Supabase `persistSession: true`

---

## 📜 License

This project is built for educational purposes.  
© 2025 DigiMitra Education Platform

---

<div align="center">
  Made with ❤️ for Maharashtra students
  <br/>
  <strong>DigiMitra — शिक्षण, सर्वांसाठी</strong>
</div>
