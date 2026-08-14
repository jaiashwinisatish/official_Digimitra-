import { Link } from "react-router-dom";
import { GraduationCap, Github, Twitter, Instagram } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12 grid gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Digi<span className="gradient-text">mitra</span></span>
          </Link>
          <p className="mt-4 text-muted-foreground max-w-sm">{t("footer_tagline")}</p>
          <div className="flex gap-3 mt-6">
            {[Twitter, Instagram, Github].map((Icon, i) => (
              <a key={i} href="#" className="h-10 w-10 rounded-xl border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-smooth" aria-label="social">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-4">{t("footer_quick")}</h4>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li><Link to="/" className="hover:text-primary">{t("nav_home")}</Link></li>
            <li><Link to="/courses" className="hover:text-primary">{t("nav_courses")}</Link></li>
            <li><Link to="/dashboard" className="hover:text-primary">{t("nav_dashboard")}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">{t("footer_resources")}</h4>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li><a href="#" className="hover:text-primary">{t("footer_about")}</a></li>
            <li><a href="#" className="hover:text-primary">{t("footer_help")}</a></li>
            <li><a href="#" className="hover:text-primary">{t("footer_privacy")}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Digimitra. {t("footer_rights")}
        </div>
      </div>
    </footer>
  );
};
