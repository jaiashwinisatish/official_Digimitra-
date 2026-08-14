import { useParams, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, ChevronLeft, ChevronRight, ArrowLeft, BookOpen, FileText, Award, Download, Check, Loader2, ChevronDown, ChevronUp, PlayCircle, Folder, Sparkles, Send, Lock, HelpCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { LmsVideoPlayer } from "@/components/LmsVideoPlayer";
import { VideoSummaryModal } from "@/components/VideoSummaryModal";

export const VideoPlayer = () => {
  const { id, lessonId } = useParams();
  const nav = useNavigate();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [assignmentSubmitted, setAssignmentSubmitted] = useState<Record<string, boolean>>({});
  const [practicalInputs, setPracticalInputs] = useState<Record<string, string>>({});
  const [submittingPractical, setSubmittingPractical] = useState<string | null>(null);

  const [autoPlayNext, setAutoPlayNext] = useState(true);
  const [summaryLesson, setSummaryLesson] = useState<any>(null);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [openUnits, setOpenUnits] = useState<Record<string, boolean>>({
    "unit-1": true,
    "unit-2": true,
    "unit-3": true,
  });

  const { data: course, isLoading: loadingCourse } = useQuery({
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

  const progressMutation = useMutation({
    mutationFn: async (lId: string) => {
      return await API.post("/progress/update", { courseId: id, lessonId: lId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress"] });
      queryClient.invalidateQueries({ queryKey: ["course", id] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success(language === "en" ? "Lesson status updated!" : "धड्याची स्थिती अद्ययावत झाली!");
    },
  });

  if (loadingCourse && !course) return <div className="container py-20 text-center">Loading...</div>;
  if (!course) return <div className="container py-20 text-center">Course not found.</div>;

  const currentProgress = (progressData || []).find((p: any) => p?.courseId?._id === id || p?.courseId?.id === id || p?.courseId === id);
  const completedIds = new Set<string>(currentProgress?.completedLessons || []);
  const completedPracticals = new Set<string>(currentProgress?.completedPracticals || []);
  const practicalSubmissions: Record<string, any> = currentProgress?.practicalSubmissions || {};
  const watchPositions: Record<string, number> = currentProgress?.watchPositions || {};
  const watchPercentages: Record<string, number> = currentProgress?.watchPercentages || {};

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

  const idx = lessons.findIndex((l: any) => l._id === lessonId || l.id === lessonId);
  const lesson = lessons[idx >= 0 ? idx : 0] || lessons[0];
  const prev = lessons[idx - 1];
  const next = lessons[idx + 1];
  const targetLessonId = lesson._id || lesson.id;
  const isComplete = targetLessonId ? completedIds.has(targetLessonId) : false;
  const progress = currentProgress?.progressPercentage || 0;
  const initialPos = watchPositions[targetLessonId] || 0;

  const toggleComplete = () => {
    if (targetLessonId) {
      progressMutation.mutate(targetLessonId);
    }
  };

  const handleWatchProgressUpdate = (currentSec: number, totalSec: number) => {
    API.post("/progress/watch-time", {
      courseId: id,
      lessonId: targetLessonId,
      currentSeconds: currentSec,
      totalSeconds: totalSec
    }).then(() => {
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    }).catch(() => {});
  };

  const toggleUnitAccordion = (key: string) => {
    setOpenUnits(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAssignmentSubmit = (assignmentId: string, correctIdx: number) => {
    if (selectedAnswers[assignmentId] === correctIdx) {
      setAssignmentSubmitted(prev => ({ ...prev, [assignmentId]: true }));
      toast.success(language === "en" ? "Correct answer!" : "बरोबर उत्तर!");
    } else {
      toast.error(language === "en" ? "Incorrect answer. Try again." : "चूक उत्तर. पुन्हा प्रयत्न करा.");
    }
  };

  const handlePracticalSubmit = async (practicalId: string) => {
    const text = practicalInputs[practicalId] || "";
    if (!text.trim()) {
      toast.error(language === "en" ? "Please enter your practical task steps or response." : "कृपया तुमचे प्रात्यक्षिक कार्य चरण प्रविष्ट करा.");
      return;
    }

    setSubmittingPractical(practicalId);
    try {
      const { data } = await API.post("/progress/practical-submit", {
        courseId: id,
        practicalId,
        submissionText: text
      });
      queryClient.invalidateQueries({ queryKey: ["progress"] });
      toast.success(language === "en" ? `Practical Checked by AI/Teacher! Grade: ${data?.result?.grade}%` : `AI द्वारे प्रात्यक्षिक तपासले गेले! गुण: ${data?.result?.grade}%`);
    } catch (e) {
      toast.error("Failed to submit practical task.");
    } finally {
      setSubmittingPractical(null);
    }
  };

  const handleCertificateDownload = async () => {
    if (!isCertificateUnlocked) {
      toast.error(language === "en" ? "Certificate is locked! Complete 100% of video lessons and practical tasks first." : "प्रमाणपत्र लॉक केलेले आहे! प्रथम धडे आणि प्रात्यक्षिक कार्ये १००% पूर्ण करा.");
      return;
    }
    try {
      toast.info(language === "en" ? "Generating certificate..." : "प्रमाणपत्र तयार होत आहे...");
      const response = await API.get(`/certificate/${id}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${user?.name || 'student'}.html`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(language === "en" ? "Certificate downloaded!" : "प्रमाणपत्र डाउनलोड झाले!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || (language === "en" ? "Certificate is locked!" : "प्रमाणपत्र लॉक आहे!"));
    }
  };

  const totalPracticalCount = course.practicalTasks?.length || 0;
  const isAllVideosDone = progress >= 90 || completedIds.size >= lessons.length;
  const isPracticalsDone = completedPracticals.size >= totalPracticalCount;
  const isCertificateUnlocked = isAllVideosDone && isPracticalsDone;

  return (
    <div className="container py-8 md:py-12 max-w-7xl">
      <Link to={`/courses/${course._id || course.id}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 group transition-smooth">
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> {course.title?.[language] || course.title?.en}
      </Link>

      <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">
        <div className="space-y-6">
          {/* Custom LMS Video Player */}
          <LmsVideoPlayer
            key={targetLessonId}
            lessonId={targetLessonId}
            title={lesson.title?.[language] || lesson.title?.en || "Lesson Video"}
            videoUrl={lesson.videoUrl || lesson.driveUrl}
            durationSeconds={lesson.durationSeconds || 600}
            initialPosition={initialPos}
            autoPlayNext={autoPlayNext}
            onAutoPlayNextToggle={setAutoPlayNext}
            onProgressUpdate={handleWatchProgressUpdate}
            onComplete={() => {
              if (!isComplete && targetLessonId) {
                progressMutation.mutate(targetLessonId);
              }
            }}
            onNextLesson={() => {
              if (next) nav(`/courses/${course._id || course.id}/lesson/${next._id || next.id}`);
            }}
          />

          {/* Navigation Controls Bar */}
          <div className="flex flex-wrap items-center gap-4 justify-between p-6 rounded-3xl bg-card border border-border shadow-elegant">
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                size="lg"
                className="rounded-xl"
                disabled={!prev} 
                onClick={() => prev && nav(`/courses/${course._id || course.id}/lesson/${prev._id || prev.id}`)}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> {t("previous")}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="rounded-xl"
                disabled={!next} 
                onClick={() => next && nav(`/courses/${course._id || course.id}/lesson/${next._id || next.id}`)}
              >
                {t("next")} <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <Button 
              variant={isComplete ? "soft" : "hero"} 
              size="lg"
              className="rounded-xl px-8"
              onClick={toggleComplete}
              disabled={progressMutation.isPending}
            >
              {progressMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isComplete ? (
                <><CheckCircle2 className="h-5 w-5 mr-2 text-success" />{t("completed")}</>
              ) : (
                <>{t("mark_complete")}</>
              )}
            </Button>
          </div>

          {/* Tabs for Overview, Assignments & Practical Tasks, and Certificate */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-muted/50 p-1 rounded-2xl w-full justify-start gap-2 h-14 overflow-x-auto">
              <TabsTrigger value="overview" className="rounded-xl px-6 h-12 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <BookOpen className="h-4 w-4 mr-2" /> {language === "en" ? "Overview" : "विहंगावलोकन"}
              </TabsTrigger>
              <TabsTrigger value="practicals" className="rounded-xl px-6 h-12 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <FileText className="h-4 w-4 mr-2" /> {language === "en" ? "Practical Tasks & Assignments" : "प्रात्यक्षिक कार्य आणि स्वाध्याय"}
              </TabsTrigger>
              <TabsTrigger value="certificate" className="rounded-xl px-6 h-12 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Award className="h-4 w-4 mr-2" /> {language === "en" ? "Certificate" : "प्रमाणपत्र"}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <div className="p-8 rounded-3xl bg-card border border-border shadow-elegant">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <h2 className="text-2xl font-bold">{lesson.title?.[language] || lesson.title?.en}</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-primary/30 hover:border-primary text-primary hover:bg-primary/5 gap-1.5 font-semibold"
                    onClick={() => {
                      setSummaryLesson(lesson);
                      setIsSummaryOpen(true);
                    }}
                  >
                    <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                    {language === "en" ? "AI Video Summary" : "AI व्हिडिओ सारांश"}
                  </Button>
                </div>
                <p className={`text-muted-foreground leading-relaxed ${language === "mr" ? "font-marathi text-lg" : ""}`}>
                  {course.description?.[language] || course.description?.en}
                </p>
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-muted/30">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Duration</div>
                    <div className="font-semibold">{lesson.duration || "10:00"}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-muted/30">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Category</div>
                    <div className="font-semibold">{course.category?.[language] || course.category?.en}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-muted/30 col-span-2">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Unit</div>
                    <div className="font-semibold text-primary">Unit {lesson.unitNumber || 1}</div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="practicals" className="mt-6 space-y-8">
              {/* Practical Hands-On Tasks (Student Submits + AI/Teacher Evaluates) */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" /> Practical Hands-On Tasks (AI / Teacher Checker)
                </h3>

                {course.practicalTasks && course.practicalTasks.length > 0 ? (
                  course.practicalTasks.map((pt: any, pIdx: number) => {
                    const isSubmitted = completedPracticals.has(pt._id);
                    const subInfo = practicalSubmissions[pt._id];

                    return (
                      <div key={pt._id || pIdx} className="p-8 rounded-3xl bg-card border border-border shadow-elegant space-y-6">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-xs uppercase font-bold text-primary tracking-wider mb-1">Unit {pt.unitNumber} Practical Task</div>
                            <h4 className="text-xl font-bold">{pt.title?.[language] || pt.title?.en}</h4>
                          </div>
                          {isSubmitted ? (
                            <span className="px-3 py-1.5 rounded-xl bg-success/15 text-success font-semibold text-xs flex items-center gap-1.5">
                              <CheckCircle2 className="h-4 w-4" /> Passed ({subInfo?.grade || 95}%)
                            </span>
                          ) : (
                            <span className="px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-600 font-semibold text-xs flex items-center gap-1.5">
                              Pending Submission
                            </span>
                          )}
                        </div>

                        <div className="p-4 rounded-2xl bg-muted/30 text-sm leading-relaxed border border-border/50">
                          <span className="font-semibold text-foreground">Instructions: </span>
                          <span>{pt.instructions?.[language] || pt.instructions?.en}</span>
                        </div>

                        {/* Submission Form / Results */}
                        {isSubmitted ? (
                          <div className="p-5 rounded-2xl bg-success/10 border border-success/30 space-y-2">
                            <div className="font-bold text-success text-sm flex items-center justify-between">
                              <span>AI Teacher Feedback & Verification</span>
                              <span>Grade: {subInfo?.grade}%</span>
                            </div>
                            <p className="text-xs text-foreground/80">{subInfo?.feedback}</p>
                            <div className="text-[11px] text-muted-foreground italic pt-1">Submitted Answer: "{subInfo?.submissionText}"</div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div>
                              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
                                Enter your practical task steps or formatted text output:
                              </Label>
                              <Textarea
                                rows={3}
                                value={practicalInputs[pt._id] || ""}
                                onChange={(e) => setPracticalInputs(prev => ({ ...prev, [pt._id]: e.target.value }))}
                                placeholder="Describe the steps you performed in MS Word (e.g. Created title Digimitra Project in Arial 16pt Bold Center aligned)..."
                                className="rounded-2xl bg-muted/20"
                              />
                            </div>
                            <Button
                              onClick={() => handlePracticalSubmit(pt._id)}
                              disabled={submittingPractical === pt._id}
                              variant="hero"
                              className="rounded-xl px-8"
                            >
                              {submittingPractical === pt._id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <Send className="h-4 w-4 mr-2" /> Submit for AI / Teacher Grading
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : null}
              </div>

              {/* Multiple Choice Quiz Assignments */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" /> Quiz Assignments
                </h3>

                {course.assignments && course.assignments.length > 0 ? (
                  course.assignments.map((assignment: any, aIdx: number) => (
                    <div key={assignment._id || aIdx} className="p-8 rounded-3xl bg-card border border-border shadow-elegant">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                          {aIdx + 1}
                        </div>
                        <div className="flex-1 space-y-6">
                          <h3 className={`text-xl font-semibold ${language === "mr" ? "font-marathi" : ""}`}>
                            {assignment.question?.[language] || assignment.question?.en}
                          </h3>
                          <RadioGroup 
                            value={selectedAnswers[assignment._id || aIdx]?.toString()} 
                            onValueChange={(val) => setSelectedAnswers(prev => ({ ...prev, [assignment._id || aIdx]: parseInt(val) }))}
                            disabled={assignmentSubmitted[assignment._id || aIdx]}
                            className="grid sm:grid-cols-2 gap-4"
                          >
                            {assignment.options?.map((opt: any, oIdx: number) => (
                              <div key={oIdx}>
                                <RadioGroupItem value={oIdx.toString()} id={`opt-${assignment._id || aIdx}-${oIdx}`} className="peer sr-only" />
                                <Label
                                  htmlFor={`opt-${assignment._id || aIdx}-${oIdx}`}
                                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-smooth cursor-pointer hover:bg-muted/50 ${
                                    selectedAnswers[assignment._id || aIdx] === oIdx 
                                      ? "border-primary bg-primary/5" 
                                      : "border-transparent bg-muted/30"
                                  } ${assignmentSubmitted[assignment._id || aIdx] && oIdx === assignment.correctAnswer ? "border-success bg-success/5" : ""}`}
                                >
                                  <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                    selectedAnswers[assignment._id || aIdx] === oIdx ? "border-primary" : "border-muted-foreground/30"
                                  }`}>
                                    {selectedAnswers[assignment._id || aIdx] === oIdx && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                                  </div>
                                  <span className={language === "mr" ? "font-marathi" : ""}>{opt[language] || opt.en}</span>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                          {!assignmentSubmitted[assignment._id || aIdx] ? (
                            <Button 
                              onClick={() => handleAssignmentSubmit(assignment._id || aIdx, assignment.correctAnswer)}
                              className="w-full sm:w-auto px-10 rounded-xl"
                            >
                              Check Answer
                            </Button>
                          ) : (
                            <div className="flex items-center gap-2 text-success font-semibold py-2">
                              <CheckCircle2 className="h-5 w-5" /> Quiz Completed
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : null}
              </div>
            </TabsContent>

            <TabsContent value="certificate" className="mt-6">
              <div className="p-12 rounded-3xl bg-card border border-border shadow-elegant text-center">
                <div className="h-24 w-24 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
                  <Award className="h-12 w-12" />
                </div>
                <h2 className="text-3xl font-bold mb-3">{language === "en" ? "Course Certificate" : "अभ्यासक्रम प्रमाणपत्र"}</h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-8 text-sm">
                  {isCertificateUnlocked 
                    ? (language === "en" ? "Congratulations! You have successfully completed all lessons and practical tasks. You can now download your official certificate." : "अभिनंदन! तुम्ही सर्व धडे आणि प्रात्यक्षिक कार्ये यशस्वीपणे पूर्ण केली आहेत. तुम्ही आता तुमचे प्रमाणपत्र डाउनलोड करू शकता.")
                    : (language === "en" ? "Complete 100% of video lessons AND all practical tasks to unlock your certificate." : "तुमचे प्रमाणपत्र मिळवण्यासाठी सर्व धडे आणि प्रात्यक्षिक कार्ये पूर्ण करा.")
                  }
                </p>

                {/* Progress Requirements Checklist */}
                <div className="max-w-md mx-auto mb-10 p-5 rounded-2xl bg-muted/20 border border-border text-left space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Unlock Requirements</div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      {isAllVideosDone ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Lock className="h-4 w-4 text-amber-500" />}
                      Video Lessons Progress ({completedIds.size}/{lessons.length})
                    </span>
                    <span className="font-bold">{isAllVideosDone ? "100%" : `${progress}%`}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      {isPracticalsDone ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Lock className="h-4 w-4 text-amber-500" />}
                      Practical Tasks Completed ({completedPracticals.size}/{totalPracticalCount})
                    </span>
                    <span className="font-bold">{isPracticalsDone ? "Done" : "Pending"}</span>
                  </div>
                </div>
                
                <div className="relative max-w-lg mx-auto p-8 rounded-2xl border-2 border-primary/20 bg-primary/5 mb-10 group overflow-hidden">
                   <div className="relative space-y-4">
                     <div className="text-xs uppercase tracking-[0.2em] text-primary font-bold">Certificate of Completion</div>
                     <div className="text-2xl font-serif">{user?.name || "Student"}</div>
                     <div className="text-xs text-primary font-semibold">{user?.studentClass || "Class 9th"}</div>
                     <div className="text-sm text-muted-foreground italic">for successfully completing</div>
                     <div className="text-xl font-bold">{course.title?.[language] || course.title?.en}</div>
                     <div className="pt-6 flex justify-between items-end border-t border-primary/10">
                       <div className="text-[10px] text-muted-foreground text-left">Date: {new Date().toLocaleDateString()}</div>
                       <div className="text-[10px] text-muted-foreground text-right">ID: CERT-DIGI-{user?._id?.slice(-6).toUpperCase() || '101'}</div>
                     </div>
                   </div>
                </div>

                <Button 
                  size="lg" 
                  variant={isCertificateUnlocked ? "hero" : "outline"} 
                  disabled={!isCertificateUnlocked}
                  className="rounded-2xl px-12 h-14"
                  onClick={handleCertificateDownload}
                >
                  <Download className="h-5 w-5 mr-2" /> {language === "en" ? "Download Certificate" : "प्रमाणपत्र डाउनलोड करा"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* LMS Accordion Sidebar */}
        <aside className="lg:sticky lg:top-24 self-start space-y-6">
          <div className="p-6 rounded-3xl bg-card border border-border shadow-elegant">
            <div className="flex justify-between text-sm mb-3">
              <span className="text-muted-foreground font-medium">{t("your_progress")}</span>
              <span className="font-bold text-primary">{progress}%</span>
            </div>
            <Progress value={progress} className="h-3 rounded-full bg-muted shadow-inner" />
            <div className="text-xs text-muted-foreground mt-3 flex justify-between">
              <span>{completedIds.size} of {lessons.length} lessons done</span>
              <span>{Math.round(((lessons.length - completedIds.size) * 11) / 60)}h remaining</span>
            </div>
          </div>

          {/* Unit Accordions */}
          <div className="rounded-3xl bg-card border border-border shadow-elegant overflow-hidden space-y-2 p-2">
            <div className="p-4 border-b border-border font-bold text-lg flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" /> Course Hierarchy
              </span>
              <span className="text-xs font-normal text-muted-foreground">{units.length} Units • {lessons.length} Lessons</span>
            </div>

            {units.map((u: any, uIdx: number) => {
              const unitKey = `unit-${u.unitNumber || uIdx + 1}`;
              const isOpen = openUnits[unitKey] !== false;
              const unitLessons = u.lessons || lessons.filter((l: any) => l.unitNumber === (u.unitNumber || uIdx + 1));
              const unitCompleted = unitLessons.filter((l: any) => completedIds.has(l._id || l.id)).length;
              const unitPct = unitLessons.length > 0 ? Math.round((unitCompleted / unitLessons.length) * 100) : 0;

              return (
                <div key={unitKey} className="rounded-2xl border border-border/60 overflow-hidden bg-muted/20">
                  <button
                    onClick={() => toggleUnitAccordion(unitKey)}
                    className="w-full p-4 flex items-center justify-between bg-card/80 hover:bg-card transition-smooth text-left"
                  >
                    <div>
                      <div className="font-bold text-sm flex items-center gap-2">
                        <span>Unit {u.unitNumber || uIdx + 1}: {u.title?.[language] || u.title?.en}</span>
                        {unitPct === 100 && <CheckCircle2 className="h-4 w-4 text-success" />}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {unitCompleted}/{unitLessons.length} Completed ({unitPct}%)
                      </div>
                    </div>
                    {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden p-2 space-y-1 bg-background/50"
                      >
                        {unitLessons.map((l: any, lIdx: number) => {
                          const lId = l._id || l.id;
                          const active = lId === targetLessonId;
                          const done = completedIds.has(lId);
                          const watchPct = watchPercentages[lId] || 0;

                          return (
                            <Link
                              key={lId || lIdx}
                              to={`/courses/${course._id || course.id}/lesson/${lId}`}
                              className={`flex flex-col gap-1.5 p-3 rounded-xl text-xs transition-all duration-200 ${
                                active 
                                  ? "bg-primary/10 text-primary font-semibold ring-1 ring-primary/30" 
                                  : "hover:bg-muted/60 text-foreground/80"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                                  done ? "bg-success/20 text-success" : active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                }`}>
                                  {done ? <Check className="h-3.5 w-3.5" /> : active ? <PlayCircle className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="truncate">{l.title?.[language] || l.title?.en}</div>
                                  <div className="text-[10px] text-muted-foreground flex items-center justify-between mt-0.5">
                                    <span>{l.duration}</span>
                                    <span>{watchPct}% watched</span>
                                  </div>
                                </div>
                                
                                <button
                                  title={language === "en" ? "AI Video Summary" : "AI व्हिडिओ सारांश"}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setSummaryLesson(l);
                                    setIsSummaryOpen(true);
                                  }}
                                  className="p-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-200 shrink-0"
                                >
                                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                                </button>
                              </div>
                              <Progress value={done ? 100 : watchPct} className="h-1 bg-muted/80 rounded-full" />
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </aside>
      </div>

      <VideoSummaryModal
        isOpen={isSummaryOpen}
        onClose={() => {
          setIsSummaryOpen(false);
          setSummaryLesson(null);
        }}
        courseId={id || ""}
        lesson={summaryLesson}
      />
    </div>
  );
};

export default VideoPlayer;
