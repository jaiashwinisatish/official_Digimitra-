import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, BookOpen, ArrowRight } from "lucide-react";

export const CourseCard = ({ course, index = 0 }: { course: any; index?: number }) => {
  const { language, t } = useLanguage();
  const isStarted = (course?.progress ?? 0) > 0;
  const courseId = course?._id || course?.id || "course-1";
  const lessonId = course?.lessons?.[0]?._id || course?.lessons?.[0]?.id || "lesson-1-1";

  const title = typeof course?.title === "object" ? course?.title?.[language] || course?.title?.en : course?.title || "Course";
  const category = typeof course?.category === "object" ? course?.category?.[language] || course?.category?.en : course?.category || "General";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      className="group rounded-2xl bg-card border border-border overflow-hidden shadow-card hover:shadow-elegant transition-smooth flex flex-col justify-between"
    >
      <div>
        <Link to={`/courses/${courseId}/lesson/${lessonId}`} className="block">
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src={course?.thumbnail}
              alt={title}
              loading="lazy"
              className="h-full w-full object-cover group-hover:scale-105 transition-smooth"
            />
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-background/90 backdrop-blur text-xs font-semibold">
              {category}
            </div>
          </div>
        </Link>
        <div className="p-5 space-y-4">
          <div>
            <h3 className={`font-semibold text-lg leading-tight line-clamp-2 ${language === "mr" ? "font-marathi" : ""}`}>
              {title}
            </h3>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" />{course?.lessonsCount || course?.lessons?.length || 0} {t("lessons")}</span>
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{course?.hours || '5'} {t("hours")}</span>
            </div>
          </div>

          {course?.progress > 0 && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{t("your_progress")}</span>
                <span className="font-semibold text-primary">{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-1.5" />
            </div>
          )}
        </div>
      </div>

      <div className="p-5 pt-0">
        <Button variant={isStarted ? "default" : "hero"} className="w-full group/btn" asChild>
          <Link to={`/courses/${courseId}/lesson/${lessonId}`}>
            {isStarted ? t("continue") : t("start")}
            <ArrowRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </motion.div>
  );
};
