import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Globe2, Wifi, Award, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { CourseCard } from "@/components/CourseCard";
import heroImg from "@/assets/hero-illustration.png";
import { useQuery } from "@tanstack/react-query";
import API from "@/services/api";
import { INITIAL_MOCK_COURSES } from "@/data/mockCourses";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

const testimonials = [
  {
    name: "sharmistha khairmode",
    role: { en: "Class 10 Student, Satara", mr: "इयत्ता १० विद्यार्थिनी, सातारा" },
    quote: {
      en: "Digimitra helped me understand math like never before. The Marathi explanations made everything click!",
      mr: "डिजिमित्रने मला गणित आधी कधीच समजले नव्हते तसे समजले. मराठी स्पष्टीकरणांमुळे सर्व काही स्पष्ट झाले!",
    },
  },
  {
    name: "Sakshi Satish Jaiswal",
    role: { en: "Class 9 Student, Kolhapur", mr: "इयत्ता ९ विद्यार्थी, कोल्हापूर" },
    quote: {
      en: "I can study anytime on my phone. The lessons are short and easy to follow.",
      mr: "मी माझ्या फोनवर केव्हाही अभ्यास करू शकतो. धडे लहान आणि समजण्यास सोपे आहेत.",
    },
  },
  {
    name: "Om Jaiswal",
    role: { en: "Class 8 Student, Nashik", mr: "इयत्ता ८ विद्यार्थिनी, नाशिक" },
    quote: {
      en: "The certificates motivate me to finish every course. Best learning app for villages!",
      mr: "प्रमाणपत्रे मला प्रत्येक अभ्यासक्रम पूर्ण करण्यास प्रेरणा देतात. गावांसाठी सर्वोत्तम शिकण्याचे ॲप!",
    },
  },
];

const Home = () => {
  const { t, language } = useLanguage();

  const { data: rawCourses, isLoading } = useQuery({
    queryKey: ["featured-courses"],
    queryFn: async () => {
      const { data } = await API.get("/courses");
      return data.slice(0, 4);
    },
  });

  const courses = Array.isArray(rawCourses) && rawCourses.length > 0 ? rawCourses : INITIAL_MOCK_COURSES.slice(0, 4);

  const features = [
    { icon: Globe2, title: t("feature_1_title"), desc: t("feature_1_desc") },
    { icon: Wifi, title: t("feature_2_title"), desc: t("feature_2_desc") },
    { icon: Users, title: t("feature_3_title"), desc: t("feature_3_desc") },
    { icon: Award, title: t("feature_4_title"), desc: t("feature_4_desc") },
  ];

  const stats = [
    { value: "50K+", label: t("stat_students") },
    { value: "120+", label: t("stat_courses") },
    { value: "2.4K+", label: t("stat_lessons") },
    { value: "800+", label: t("stat_villages") },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-soft" aria-hidden />
        <div className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-primary/20 blur-3xl animate-blob" aria-hidden />
        <div className="absolute -bottom-32 -left-24 w-[500px] h-[500px] rounded-full bg-secondary/20 blur-3xl animate-blob" aria-hidden />

        <div className="container relative pt-12 pb-20 md:pt-20 md:pb-32 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card border border-border shadow-soft text-sm font-medium">
              <Sparkles className="h-4 w-4 text-primary" />
              {t("hero_badge")}
            </span>
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] ${language === "mr" ? "font-marathi" : ""}`}>
              {t("hero_title_1")}{" "}
              <span className="gradient-text">{t("hero_title_2")}</span>
            </h1>
            <p className={`text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 ${language === "mr" ? "font-marathi" : ""}`}>
              {t("hero_subtitle")}
            </p>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <Button variant="hero" size="xl" asChild>
                <Link to="/courses">{t("cta_start")} <ArrowRight className="h-5 w-5" /></Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/courses">{t("cta_view_courses")}</Link>
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-4 pt-6 max-w-lg mx-auto lg:mx-0">
              {stats.map((s) => (
                <div key={s.label} className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-extrabold gradient-text">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }} className="relative">
            <div className="absolute inset-0 glow-bg" aria-hidden />
            <img
              src={heroImg}
              alt="Students learning with Digimitra"
              width={1024}
              height={1024}
              className="relative w-full max-w-lg mx-auto animate-float drop-shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-28">
        <div className="container">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
            <h2 className={`text-3xl md:text-5xl font-bold tracking-tight ${language === "mr" ? "font-marathi" : ""}`}>{t("features_title")}</h2>
            <p className="text-muted-foreground mt-4 text-lg">{t("features_subtitle")}</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="group p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-elegant transition-smooth"
              >
                <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center mb-4 shadow-elegant group-hover:scale-110 transition-smooth">
                  <f.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container">
          <motion.div {...fadeUp} className="flex items-end justify-between flex-wrap gap-4 mb-12">
            <div>
              <h2 className={`text-3xl md:text-5xl font-bold tracking-tight ${language === "mr" ? "font-marathi" : ""}`}>{t("courses_title")}</h2>
              <p className="text-muted-foreground mt-3 text-lg">{t("courses_subtitle")}</p>
            </div>
            <Button variant="soft" asChild>
              <Link to="/courses">{t("view_all")} <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              <div className="col-span-full text-center py-10">Loading courses...</div>
            ) : (
              courses?.map((c: any, i: number) => <CourseCard key={c._id} course={c} index={i} />)
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28">
        <div className="container">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
            <h2 className={`text-3xl md:text-5xl font-bold tracking-tight ${language === "mr" ? "font-marathi" : ""}`}>{t("testimonials_title")}</h2>
            <p className="text-muted-foreground mt-4 text-lg">{t("testimonials_subtitle")}</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((tm, i) => (
              <motion.div
                key={tm.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-7 rounded-2xl bg-card border border-border shadow-card hover:shadow-elegant transition-smooth"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className={`text-foreground/90 leading-relaxed ${language === "mr" ? "font-marathi" : ""}`}>"{tm.quote[language]}"</p>
                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
                  <div className="h-11 w-11 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                    {tm.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{tm.name}</div>
                    <div className={`text-xs text-muted-foreground ${language === "mr" ? "font-marathi" : ""}`}>{tm.role[language]}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-20">
        <motion.div {...fadeUp} className="relative overflow-hidden rounded-3xl gradient-hero p-10 md:p-16 text-center text-primary-foreground shadow-elegant">
          <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[radial-gradient(circle_at_30%_30%,white,transparent_60%)]" />
          <h2 className="relative text-3xl md:text-5xl font-bold tracking-tight max-w-2xl mx-auto">
            {language === "en" ? "Start your learning journey today" : "तुमचा शिक्षण प्रवास आजच सुरू करा"}
          </h2>
          <p className="relative mt-4 text-primary-foreground/85 max-w-xl mx-auto">
            {language === "en" ? "Join thousands of students from across rural India." : "ग्रामीण भारतातील हजारो विद्यार्थ्यांमध्ये सामील व्हा."}
          </p>
          <Button variant="secondary" size="xl" className="relative mt-8 bg-background text-primary hover:bg-background/95" asChild>
            <Link to="/courses">{t("cta_start")} <ArrowRight className="h-5 w-5" /></Link>
          </Button>
        </motion.div>
      </section>
    </>
  );
};

export default Home;
