import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock, BookOpen, BarChart3, Languages, PlayCircle, ArrowLeft, Layers, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "@/services/api";
import { VideoSummaryModal } from "@/components/VideoSummaryModal";

const CourseDetail = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [summaryLesson, setSummaryLesson] = useState<any>(null);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  const { data: course, isLoading, error } = useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      const { data } = await API.get(`/courses/${id}`);
      return data;
    },
    enabled: !!id,
  });

  const { data: progressData } = useQuery({
    queryKey: ["progress", user?._id],
    queryFn: async () => {
      const { data } = await API.get(`/progress/${user?._id}`);
      return data;
    },
    enabled: !!user?._id,
  });

  const enrollMutation = useMutation({
    mutationFn: async () => {
      return await API.post(`/courses/${id}/enroll`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", id] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success(language === "en" ? "Successfully enrolled!" : "यशस्वीरित्या नोंदणी झाली!");
    },
  });

  if (isLoading) return <div className="container py-20 text-center">Loading course...</div>;
  if (error || !course) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">Course not found.</p>
        <Button variant="hero" className="mt-4" onClick={() => nav("/courses")}>Back to Courses</Button>
      </div>
    );
  }

  const courseId = course._id || course.id;
  const isEnrolled = user?.enrolledCourses?.includes(courseId);

  const currentProgress = (progressData || []).find((p: any) => p?.courseId?._id === courseId || p?.courseId?.id === courseId || p?.courseId === courseId);
  const completedIds = new Set<string>(currentProgress?.completedLessons || []);
  const overallProgress = currentProgress?.progressPercentage || course.progress || 0;

  const lessons = course.lessons || [];
  const hasUnitNumbers = lessons.some((l: any) => l.unitNumber !== undefined);
  const units = course.units || [
    { 
      unitNumber: 1, 
      title: { en: "Unit 1: Getting Started with Word", mr: "वर्डसह सुरवात" }, 
      lessons: hasUnitNumbers ? lessons.filter((l: any) => l.unitNumber === 1) : lessons.slice(0, 3) 
    },
    { 
      unitNumber: 2, 
      title: { en: "Unit 2: Font Group & File Options", mr: "फॉन्ट ग्रुप आणि फाईल पर्याय" }, 
      lessons: hasUnitNumbers ? lessons.filter((l: any) => l.unitNumber === 2) : lessons.slice(3, 6) 
    },
    { 
      unitNumber: 3, 
      title: { en: "Unit 3: Paragraph formatting", mr: "परिच्छेद स्वरूपण" }, 
      lessons: hasUnitNumbers ? lessons.filter((l: any) => l.unitNumber === 3) : lessons.slice(6, 9) 
    }
  ];

  return (
    <div>
      <div className="relative overflow-hidden gradient-soft border-b border-border">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="container relative py-12 md:py-16 grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link to="/courses" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4">
              <ArrowLeft className="h-4 w-4" /> {t("nav_courses")}
            </Link>
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              {course.category?.[language] || course.category?.en || course.category}
            </span>
            <h1 className={`text-3xl md:text-5xl font-bold tracking-tight mt-3 ${language === "mr" ? "font-marathi" : ""}`}>
              {course.title?.[language] || course.title?.en || course.title}
            </h1>
            <p className={`text-muted-foreground mt-4 text-lg max-w-2xl ${language === "mr" ? "font-marathi" : ""}`}>
              {course.description?.[language] || course.description?.en || course.description}
            </p>
            <div className="flex flex-wrap gap-6 mt-6 text-sm">
              <span className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" />{lessons.length} {t("lessons")} ({units.length} Units)</span>
              <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" />{course.hours || 5} {t("hours")}</span>
              <span className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" />{course.level?.[language] || course.level?.en || "Beginner"}</span>
              <span className="flex items-center gap-2"><Languages className="h-4 w-4 text-primary" />EN / मराठी</span>
            </div>
            {isEnrolled ? (
              <Button variant="hero" size="lg" className="mt-7" asChild>
                <Link to={`/courses/${courseId}/lesson/${lessons[0]?._id || lessons[0]?.id}`}>
                  <PlayCircle className="h-5 w-5" /> {overallProgress > 0 ? t("continue") : t("start")}
                </Link>
              </Button>
            ) : (
              <Button variant="hero" size="lg" className="mt-7" onClick={() => enrollMutation.mutate()} disabled={enrollMutation.isPending}>
                {enrollMutation.isPending ? "Enrolling..." : t("enroll_now")}
              </Button>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="relative">
            <img src={course.thumbnail} alt="" className="w-full rounded-3xl shadow-elegant object-cover max-h-[350px]" />
          </motion.div>
        </div>
      </div>

      <div className="container py-12 grid lg:grid-cols-[1fr_320px] gap-10">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Layers className="h-6 w-6 text-primary" /> Course Curriculum (Units & Lessons)
            </h2>
            <span className="text-xs text-muted-foreground font-medium">{units.length} Units • {lessons.length} Lessons</span>
          </div>

          {/* Unit Sections Hierarchy */}
          <div className="space-y-6">
            {units.map((u: any, uIdx: number) => {
              const uNumber = u.unitNumber || uIdx + 1;
              const unitLessons = u.lessons || lessons.filter((l: any) => l.unitNumber === uNumber);
              const completedInUnit = unitLessons.filter((l: any) => completedIds.has(l._id || l.id)).length;
              const uPct = unitLessons.length > 0 ? Math.round((completedInUnit / unitLessons.length) * 100) : 0;

              return (
                <div key={uNumber} className="rounded-3xl bg-card border border-border overflow-hidden shadow-card p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
                    <div>
                      <div className="text-xs uppercase font-bold text-primary tracking-wider">Unit {uNumber}</div>
                      <h3 className="text-lg font-bold mt-0.5">{u.title?.[language] || u.title?.en}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold text-primary">{uPct}% Completed</div>
                      <div className="text-[11px] text-muted-foreground">{completedInUnit} of {unitLessons.length} lessons</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {unitLessons.map((l: any, lIdx: number) => {
                      const lId = l._id || l.id;
                      const done = completedIds.has(lId);

                      return (
                        <Link
                          key={lId || lIdx}
                          to={`/courses/${courseId}/lesson/${lId}`}
                          className="flex items-center gap-4 p-4 rounded-2xl bg-muted/20 border border-border/60 hover:border-primary/40 hover:bg-card transition-smooth group"
                        >
                          <div className={`h-9 w-9 rounded-xl flex items-center justify-center text-xs font-bold transition-smooth ${
                            done ? "bg-success/20 text-success" : "bg-muted text-muted-foreground group-hover:gradient-primary group-hover:text-primary-foreground"
                          }`}>
                            {done ? <CheckCircle2 className="h-5 w-5 text-success" /> : String(l.lessonNumber || lIdx + 1).padStart(2, "0")}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`font-medium truncate ${language === "mr" ? "font-marathi" : ""}`}>{l.title?.[language] || l.title?.en || l.title}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{l.duration || "10:00"}</div>
                          </div>
                          
                          {/* AI Video Summary Button */}
                          <button
                            title={language === "en" ? "AI Video Summary" : "AI व्हिडिओ सारांश"}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSummaryLesson(l);
                              setIsSummaryOpen(true);
                            }}
                            className="p-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-200"
                          >
                            <Sparkles className="h-4 w-4 text-primary" />
                          </button>

                          {done ? (
                            <span className="text-xs font-semibold text-success flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Done</span>
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 self-start">
          <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
            <div className="text-sm text-muted-foreground">{t("your_progress")}</div>
            <div className="text-3xl font-bold gradient-text mt-1">{overallProgress}%</div>
            <Progress value={overallProgress} className="mt-3 h-2" />
            <Button variant="hero" className="w-full mt-5" asChild>
              <Link to={`/courses/${courseId}/lesson/${lessons[0]?._id || lessons[0]?.id}`}>
                {overallProgress > 0 ? t("continue") : t("start")}
              </Link>
            </Button>
          </div>
          <div className="p-6 rounded-2xl bg-card border border-border shadow-card space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">{t("duration")}</span><span className="font-medium">{course.hours || 5}h</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">{t("level")}</span><span className="font-medium">{course.level?.[language] || course.level?.en || "Beginner"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">{t("language_label")}</span><span className="font-medium">EN / मराठी</span></div>
          </div>
        </aside>
      </div>

      {/* AI Video Summary Modal */}
      <VideoSummaryModal
        isOpen={isSummaryOpen}
        onClose={() => {
          setIsSummaryOpen(false);
          setSummaryLesson(null);
        }}
        courseId={courseId}
        lesson={summaryLesson}
      />
    </div>
  );
};

export default CourseDetail;
