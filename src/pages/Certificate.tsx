import { motion } from "framer-motion";
import { Download, Share2, Award, GraduationCap, Printer, CheckCircle2, Lock, ArrowRight, BookOpen, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { INITIAL_MOCK_COURSES, getUserProgress } from "@/data/mockCourses";

const Certificate = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const certRef = useRef<HTMLDivElement>(null);
  const { courseId } = useParams<{ courseId?: string }>();

  // Find the specific course or default to first
  const targetCourseId = courseId || INITIAL_MOCK_COURSES[0]._id;
  const course = INITIAL_MOCK_COURSES.find(c => c._id === targetCourseId || c.id === targetCourseId) || INITIAL_MOCK_COURSES[0];

  const userProgressList = getUserProgress(user?._id || "anonymous");
  const courseProg = userProgressList.find((p: any) =>
    p?.courseId?._id === course._id || p?.courseId?.id === course._id || p?.courseId === course._id ||
    p?.courseId?._id === course.id || p?.courseId?.id === course.id || p?.courseId === course.id
  );

  const totalLessons = course.lessons?.length || 1;
  const totalPracticals = course.practicalTasks?.length || 0;
  const completedLessonsCount = courseProg?.completedLessons?.length || 0;
  const completedPracticalsCount = courseProg?.completedPracticals?.length || 0;

  const isAllVideosDone = completedLessonsCount >= totalLessons;
  const isAllPracticalsDone = completedPracticalsCount >= totalPracticals;
  const isUnlocked = isAllVideosDone && isAllPracticalsDone;
  const overallProgress = courseProg?.progressPercentage || 0;

  const courseTitle = course.title?.[language] || course.title?.en || "Course";
  const studentName = user?.name || "Student";
  const studentClass = user?.studentClass || "Class 9th";
  const certificateId = `CERT-DIGI-${(user?._id || "000000").slice(-6).toUpperCase()}-${(course._id || "c1").slice(-2).toUpperCase()}`;
  const currentDate = new Date().toLocaleDateString(language === "mr" ? "mr-IN" : "en-US", {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handlePrintDownload = () => {
    if (!isUnlocked) {
      toast.error(language === "en" ? "Certificate is locked until you complete 100% of the course!" : "अभ्यासक्रम १००% पूर्ण करेपर्यंत प्रमाणपत्र लॉक केलेले आहे!");
      return;
    }
    toast.success(language === "en" ? "Opening printable certificate..." : "प्रमाणपत्र उघडत आहे...");
    window.print();
  };

  const handleShare = () => {
    if (!isUnlocked) {
      toast.error(language === "en" ? "Complete the course to share your certificate!" : "प्रमाणपत्र शेअर करण्यासाठी अभ्यासक्रम पूर्ण करा!");
      return;
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success(language === "en" ? "Certificate link copied!" : "प्रमाणपत्र लिंक कॉपी झाली!");
    }
  };

  return (
    <div className="container py-10 md:py-16 max-w-5xl">
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
          <Award className="h-4 w-4" /> Official DigiMitra Certificate
        </div>
        <h1 className={`text-3xl md:text-5xl font-bold tracking-tight ${language === "mr" ? "font-marathi" : ""}`}>
          {t("nav_certificate")}
        </h1>
        <p className="text-muted-foreground mt-3 text-sm">
          {language === "en" ? "Recognizing academic excellence and practical computer skills." : "शैक्षणिक गुणवत्ता आणि संगणक कौशल्यांची दखल."}
        </p>
      </div>

      {!isUnlocked ? (
        /* LOCKED CERTIFICATE CARD */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 md:p-14 rounded-3xl bg-card border-2 border-border shadow-2xl text-center max-w-2xl mx-auto space-y-6"
        >
          <div className="h-20 w-20 rounded-full bg-amber-500/15 text-amber-500 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="h-10 w-10" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 font-bold text-xs uppercase tracking-wider">
              {language === "en" ? "Certificate Locked" : "प्रमाणपत्र लॉक केलेले आहे"}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold mt-2">{courseTitle}</h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              {language === "en"
                ? "You must complete 100% of video lessons and submit all practical tasks to earn this official certificate."
                : "हे अधिकृत प्रमाणपत्र मिळवण्यासाठी तुम्हाला १००% व्हिडिओ धडे पूर्ण करावे लागतील आणि सर्व प्रात्यक्षिक कार्ये सादर करावी लागतील."}
            </p>
          </div>

          {/* Progress Requirements */}
          <div className="p-6 rounded-2xl bg-muted/30 border border-border text-left space-y-4 max-w-md mx-auto">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {language === "en" ? "Completion Requirements" : "आवश्यकता प्रगती"}
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  {language === "en" ? "Video Lessons Progress" : "व्हिडिओ धडे प्रगती"}
                </span>
                <span className="font-bold">
                  {completedLessonsCount} / {totalLessons} {isAllVideosDone ? "✅" : ""}
                </span>
              </div>
              <Progress value={Math.round((completedLessonsCount / totalLessons) * 100)} className="h-2 rounded-full" />

              <div className="flex items-center justify-between pt-2">
                <span className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-primary" />
                  {language === "en" ? "Practical Tasks Submitted" : "प्रात्यक्षिक कार्ये जमा केली"}
                </span>
                <span className="font-bold">
                  {completedPracticalsCount} / {totalPracticals} {isAllPracticalsDone ? "✅" : ""}
                </span>
              </div>
              <Progress value={totalPracticals > 0 ? Math.round((completedPracticalsCount / totalPracticals) * 100) : 0} className="h-2 rounded-full" />
            </div>
          </div>

          <Button variant="hero" size="lg" className="rounded-xl px-10" asChild>
            <Link to={`/courses/${course._id || course.id}/lesson/${course.lessons?.[0]?._id || course.lessons?.[0]?.id}`}>
              {language === "en" ? "Continue Course Lessons" : "अभ्यासक्रम धडे पूर्ण करा"} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      ) : (
        /* UNLOCKED CERTIFICATE PREVIEW & PRINT */
        <>
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative max-w-4xl mx-auto print:max-w-none print:m-0"
            ref={certRef}
          >
            <div className="absolute -inset-4 gradient-hero rounded-3xl blur-2xl opacity-30 print:hidden" />
            <div className="relative rounded-3xl bg-card border-4 border-double border-primary/30 shadow-elegant overflow-hidden p-2">
              <div className="border-2 border-primary/20 rounded-2xl p-8 md:p-14 text-center space-y-6 bg-gradient-to-b from-background via-muted/10 to-background">
                
                <div className="flex justify-between items-start">
                  <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center shadow-elegant">
                    <GraduationCap className="h-9 w-9 text-primary-foreground" />
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <div className="font-mono font-bold text-foreground">{certificateId}</div>
                    <div>Issued: {currentDate}</div>
                  </div>
                </div>

                <div className="text-sm tracking-[0.3em] uppercase text-primary font-bold">DigiMitra E-Learning Platform</div>

                <h2 className={`text-3xl md:text-5xl font-extrabold gradient-text tracking-tight ${language === "mr" ? "font-marathi" : ""}`}>
                  {t("cert_title")}
                </h2>

                <p className={`text-muted-foreground text-sm ${language === "mr" ? "font-marathi" : ""}`}>{t("cert_presented")}</p>

                <div className="py-3">
                  <div className="text-3xl md:text-5xl font-bold tracking-tight text-foreground font-serif">
                    {studentName}
                  </div>
                  <div className="text-sm font-semibold text-primary mt-1.5">
                    Student • {studentClass}
                  </div>
                  <div className="h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent max-w-sm mx-auto mt-4" />
                </div>

                <p className={`text-muted-foreground text-sm ${language === "mr" ? "font-marathi" : ""}`}>{t("cert_for")}</p>

                <div className={`text-xl md:text-3xl font-bold text-foreground ${language === "mr" ? "font-marathi" : ""}`}>
                  {courseTitle}
                </div>

                <div className="grid grid-cols-3 pt-8 mt-6 border-t border-border/80 text-sm">
                  <div className="text-left">
                    <div className="font-semibold">{currentDate}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Date of Completion</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-10 w-10 rounded-full bg-success/15 text-success flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div className="text-xs font-bold text-success mt-1">Verified Certificate</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-foreground italic">DigiMitra Platform</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Director of Education</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-center gap-4 mt-10 print:hidden">
            <Button variant="hero" size="lg" className="rounded-xl px-8" onClick={handlePrintDownload}>
              <Printer className="h-4 w-4 mr-2" /> Download / Print Certificate
            </Button>
            <Button variant="outline" size="lg" className="rounded-xl px-6" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" /> {t("share")}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Certificate;
