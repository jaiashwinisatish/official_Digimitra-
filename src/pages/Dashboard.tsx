import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Award, BookOpen, Clock, TrendingUp, ArrowRight, Loader2, PlayCircle, CheckCircle2, Sparkles, Layers, GraduationCap, Smartphone, ShieldCheck, FileCheck, Lock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { CourseCard } from "@/components/CourseCard";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import API from "@/services/api";
import { INITIAL_MOCK_COURSES, getUserProgress } from "@/data/mockCourses";

const Dashboard = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const { data: rawProgress, isLoading } = useQuery({
    queryKey: ["progress", user?._id],
    queryFn: async () => {
      if (!user?._id) return getUserProgress("anonymous");
      const { data } = await API.get(`/progress/${user?._id}`);
      return data;
    },
    enabled: true,
  });

  const progress = Array.isArray(rawProgress) && rawProgress.length > 0 ? rawProgress : getUserProgress(user?._id || "anonymous");

  if (isLoading && (!rawProgress || rawProgress.length === 0)) {
    return (
      <div className="container py-20 text-center flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">{language === "en" ? "Loading personalized student dashboard..." : "डॅशबोर्ड लोड होत आहे..."}</p>
      </div>
    );
  }

  // Calculate stats across ALL courses
  const totalLessonsInApp = INITIAL_MOCK_COURSES.reduce((a: number, c: any) => a + (c.lessons?.length || 0), 0);
  const totalCompletedLessons = progress.reduce((acc: number, p: any) => acc + (p.completedLessons?.length || 0), 0);
  const totalCompletedPracticals = progress.reduce((acc: number, p: any) => acc + (p.completedPracticals?.length || 0), 0);
  const overallPct = totalLessonsInApp > 0 ? Math.round((totalCompletedLessons / totalLessonsInApp) * 100) : 0;
  const completedCourses = progress.filter((p: any) => p.progressPercentage === 100);

  // Find the most recently active course
  const lastActiveProgress = progress.length > 0
    ? progress.reduce((latest: any, p: any) => {
        if (!latest) return p;
        return (p.lastWatchedTime || 0) > (latest.lastWatchedTime || 0) ? p : latest;
      }, null) || progress[0]
    : null;

  const lastActiveCourse = lastActiveProgress?.courseId
    ? (typeof lastActiveProgress.courseId === 'object' ? lastActiveProgress.courseId : INITIAL_MOCK_COURSES.find(c => c._id === lastActiveProgress.courseId || c.id === lastActiveProgress.courseId))
    : null;

  const lastLessonId = lastActiveProgress?.lastWatchedLessonId;
  const lastLesson = lastActiveCourse?.lessons?.find((l: any) => (l._id || l.id) === lastLessonId) || lastActiveCourse?.lessons?.[0];
  const lastTime = lastActiveProgress?.lastWatchedTime || 0;

  const formatMin = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const stats = [
    { icon: TrendingUp, label: t("overall_progress"), value: `${overallPct}%` },
    { icon: BookOpen, label: language === "en" ? "Completed Lessons" : "पूर्ण धडे", value: `${totalCompletedLessons} / ${totalLessonsInApp}` },
    { icon: FileCheck, label: language === "en" ? "Practical Tasks" : "प्रात्यक्षिक", value: `${totalCompletedPracticals} Done` },
    { icon: Award, label: t("certificates_earned"), value: completedCourses.length },
  ];

  const handleCertificateDownload = async (courseId: string) => {
    try {
      toast.info(language === "en" ? "Generating certificate..." : "प्रमाणपत्र तयार होत आहे...");
      const response = await API.get(`/certificate/${courseId}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${user?.name || 'student'}.html`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(language === "en" ? "Certificate downloaded!" : "प्रमाणपत्र डाउनलोड झाले!");
    } catch {
      toast.error("Error downloading certificate");
    }
  };

  const userName = user?.name || "Student";
  const userClass = user?.studentClass || "Class 9th";
  const userMobile = user?.mobile || "";

  return (
    <div className="container py-10 md:py-14 space-y-12">
      {/* Hero Welcome Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl gradient-hero p-8 md:p-12 text-primary-foreground shadow-elegant">
        <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[radial-gradient(circle_at_70%_30%,white,transparent_60%)]" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5" /> {userClass}
              </span>
              {userMobile && (
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white flex items-center gap-1.5">
                  <Smartphone className="h-3.5 w-3.5" /> {userMobile}
                </span>
              )}
              <span className="px-3 py-1 rounded-full bg-emerald-400/30 text-emerald-100 text-xs font-semibold flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> {language === "en" ? "Verified Profile" : "सत्यापित प्रोफाइल"}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold">{userName} 👋</h1>
            <p className="mt-2 text-primary-foreground/85 max-w-md text-sm">{t("welcome_sub")}</p>
          </div>

          {lastLesson && lastActiveCourse && (
            <div className="bg-background/15 backdrop-blur-md p-5 rounded-2xl border border-white/20 max-w-sm w-full space-y-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-primary-foreground/90">
                <Sparkles className="h-4 w-4" /> {language === "en" ? "Last Watched Lesson" : "शेवटचा पाहिलेला धडा"}
              </div>
              <div>
                <div className="font-bold text-sm line-clamp-1">{lastLesson.title?.[language] || lastLesson.title?.en}</div>
                <div className="text-xs text-primary-foreground/80 mt-1">
                  {language === "en" ? `Paused at ${formatMin(lastTime)}` : `${formatMin(lastTime)} वर थांबले`}
                </div>
              </div>
              <Button size="sm" variant="secondary" className="w-full bg-background text-primary font-semibold hover:bg-background/90" asChild>
                <Link to={`/courses/${lastActiveCourse._id || lastActiveCourse.id}/lesson/${lastLesson._id || lastLesson.id}`}>
                  <PlayCircle className="h-4 w-4 mr-2" /> {language === "en" ? "Resume Learning" : "शिकणे सुरू ठेवा"}
                </Link>
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="p-5 rounded-2xl bg-card border border-border shadow-card"
          >
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
              <s.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Course-Wise Progress Breakdown */}
      {INITIAL_MOCK_COURSES.map((course: any) => {
        const courseProgress = progress.find((p: any) =>
          p?.courseId?._id === course._id || p?.courseId?.id === course._id || p?.courseId === course._id ||
          p?.courseId?._id === course.id || p?.courseId?.id === course.id || p?.courseId === course.id
        );
        const completedLessons = courseProgress?.completedLessons || [];
        const completedPracticals = courseProgress?.completedPracticals || [];
        const coursePct = courseProgress?.progressPercentage || 0;
        const units = course.units || [];

        return (
          <section key={course._id} className="p-8 rounded-3xl bg-card border border-border shadow-elegant space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Layers className="h-6 w-6 text-primary" />
                  {course.title?.[language] || course.title?.en}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {language === "en" ? "Track your progress across all units" : "सर्व युनिट्समधील तुमची प्रगती पहा"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
                  {coursePct}% {language === "en" ? "Complete" : "पूर्ण"}
                </span>
                {coursePct === 100 ? (
                  <Button variant="soft" size="sm" asChild>
                    <Link to={`/certificate/${course._id}`}>
                      <Award className="h-3.5 w-3.5 mr-1" /> {t("view_certificate")}
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="text-xs text-muted-foreground opacity-80" asChild>
                    <Link to={`/certificate/${course._id}`}>
                      <Lock className="h-3.5 w-3.5 mr-1 text-amber-500" /> {language === "en" ? "Certificate Locked" : "प्रमाणपत्र लॉक"}
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {units.map((u: any, uIdx: number) => {
                const uNum = u.unitNumber || uIdx + 1;
                const unitLessons = u.lessons || course.lessons?.filter((l: any) => l.unitNumber === uNum) || [];
                const completedLessonsInUnit = unitLessons.filter((l: any) => completedLessons.includes(l._id || l.id)).length;
                const pct = unitLessons.length > 0 ? Math.round((completedLessonsInUnit / unitLessons.length) * 100) : 0;

                return (
                  <div key={uNum} className="p-6 rounded-2xl bg-muted/20 border border-border space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs uppercase font-bold text-primary tracking-wider">
                          {language === "en" ? `Unit ${uNum}` : `युनिट ${uNum}`}
                        </div>
                        <div className="font-semibold text-base mt-1">
                          {u.title?.[language] || u.title?.en}
                        </div>
                      </div>
                      {pct === 100 && <CheckCircle2 className="h-5 w-5 text-success shrink-0" />}
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1.5 font-medium">
                        <span>{completedLessonsInUnit} of {unitLessons.length} {language === "en" ? "lessons" : "धडे"}</span>
                        <span className="font-bold text-foreground">{pct}%</span>
                      </div>
                      <Progress value={pct} className="h-2 rounded-full" />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* All Courses */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">{t("continue_learning")}</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {INITIAL_MOCK_COURSES.map((course: any, i: number) => {
            const courseProgress = progress.find((p: any) =>
              p?.courseId?._id === course._id || p?.courseId?.id === course._id || p?.courseId === course._id
            );
            const coursePct = courseProgress?.progressPercentage || 0;
            return (
              <CourseCard key={course._id} course={{ ...course, progress: coursePct }} index={i} />
            );
          })}
        </div>
      </section>

      {/* Completed Courses & Certificates */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">{t("completed_courses")}</h2>
        </div>
        {completedCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {completedCourses.map((prog: any) => {
              const crs = typeof prog.courseId === 'object' ? prog.courseId : INITIAL_MOCK_COURSES.find(c => c._id === prog.courseId || c.id === prog.courseId);
              if (!crs) return null;
              return (
                <div key={crs._id} className="p-5 rounded-2xl bg-card border border-border shadow-card flex items-center gap-4">
                  <img src={crs.thumbnail} alt="" className="h-20 w-20 rounded-xl object-cover" loading="lazy" />
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold truncate ${language === "mr" ? "font-marathi" : ""}`}>
                      {crs.title?.[language] || crs.title?.en}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={100} className="h-1.5 flex-1" />
                      <span className="text-xs font-semibold text-success">100%</span>
                    </div>
                  </div>
                  <Button variant="soft" size="sm" onClick={() => handleCertificateDownload(crs._id || crs.id)}>
                    {t("view_certificate")} <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-muted-foreground">
            {language === "en"
              ? "No completed courses yet. Complete 100% of lessons & practical tasks to earn your certificate."
              : "अद्याप कोणतेही अभ्यासक्रम पूर्ण झालेले नाहीत. प्रमाणपत्र मिळवण्यासाठी सर्व धडे आणि प्रात्यक्षिक कार्ये पूर्ण करा."}
          </p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
