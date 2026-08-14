import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import API from "@/services/api";
import { CourseCard } from "@/components/CourseCard";
import { useLanguage } from "@/context/LanguageContext";
import { Input } from "@/components/ui/input";
import { INITIAL_MOCK_COURSES } from "@/data/mockCourses";

const Courses = () => {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const { data: rawCourses, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data } = await API.get("/courses");
      return data;
    },
  });

  const coursesList = Array.isArray(rawCourses) && rawCourses.length > 0 ? rawCourses : INITIAL_MOCK_COURSES;

  if (isLoading && (!rawCourses || rawCourses.length === 0)) {
    return (
      <div className="container py-20 text-center flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">{language === "en" ? "Loading courses..." : "अभ्यासक्रम लोड होत आहेत..."}</p>
      </div>
    );
  }

  const categories = [
    "all",
    ...Array.from(
      new Set(
        coursesList.map((c: any) =>
          typeof c.category === "object" ? c.category?.en || c.category?.mr : c.category
        )
      )
    ),
  ];

  const filtered = coursesList.filter((c: any) => {
    const title = typeof c.title === "object" ? c.title?.[language] || c.title?.en || "" : c.title || "";
    const matches = title.toLowerCase().includes(query.toLowerCase());
    const catEn = typeof c.category === "object" ? c.category?.en || c.category?.mr : c.category;
    const cat = filter === "all" || catEn === filter;
    return matches && cat;
  });

  return (
    <div className="container py-12 md:py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-2xl">
        <h1 className={`text-4xl md:text-5xl font-bold tracking-tight ${language === "mr" ? "font-marathi" : ""}`}>
          {t("nav_courses")}
        </h1>
        <p className="text-muted-foreground mt-3 text-lg">{t("courses_subtitle")}</p>
      </motion.div>

      <div className="mt-8 flex flex-col md:flex-row gap-4 md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={language === "en" ? "Search courses..." : "अभ्यासक्रम शोधा..."}
            className="pl-10 h-11 rounded-xl"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-smooth border ${
                filter === c ? "gradient-primary text-primary-foreground border-transparent shadow-elegant" : "bg-card border-border hover:border-primary/40"
              }`}
            >
              {c === "all" ? (language === "en" ? "All" : "सर्व") : c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((c: any, i: number) => (
          <CourseCard key={c._id || c.id || i} course={c} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          {language === "en" ? "No courses found." : "कोणतेही अभ्यासक्रम सापडले नाहीत."}
        </div>
      )}
    </div>
  );
};

export default Courses;
