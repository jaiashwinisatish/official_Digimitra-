import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Menu, X, GraduationCap, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

import { useAuth } from "@/context/AuthContext";

export const Navbar = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/", label: t("nav_home") },
    { to: "/courses", label: t("nav_courses") },
    { to: "/dashboard", label: t("nav_dashboard") },
    { to: "/certificate", label: t("nav_certificate") },
  ];

  if (user?.role === "admin") {
    links.push({ to: "/admin", label: "Admin" });
  }

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-background/80 border-b border-border/60">
      <nav className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shadow-elegant group-hover:scale-110 transition-smooth">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Digi<span className="gradient-text">mitra</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-smooth",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleLanguage}
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card hover:border-primary/40 transition-smooth text-sm font-medium"
            aria-label="Toggle language"
          >
            <Languages className="h-4 w-4 text-primary" />
            <span className={cn(language === "en" && "text-primary font-semibold")}>EN</span>
            <span className="text-muted-foreground">/</span>
            <span className={cn(language === "mr" && "text-primary font-semibold font-marathi")}>मराठी</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium hidden sm:inline-block">Hello, {user.name.split(' ')[0]}</span>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Button variant="ghost" className="hidden md:inline-flex" asChild>
                <Link to="/login">{t("nav_login")}</Link>
              </Button>
              <Button variant="hero" size="sm" className="hidden md:inline-flex" asChild>
                <Link to="/register">{t("nav_signup")}</Link>
              </Button>
            </>
          )}

          <button className="md:hidden p-2" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border overflow-hidden bg-background"
          >
            <div className="container py-4 flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-lg text-sm font-medium",
                    location.pathname === l.to ? "text-primary bg-primary/10" : "hover:bg-muted"
                  )}
                >
                  {l.label}
                </Link>
              ))}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-4 py-3 rounded-lg border border-border mt-2"
              >
                <Languages className="h-4 w-4 text-primary" />
                <span>{language === "en" ? "Switch to मराठी" : "Switch to English"}</span>
              </button>
              <Button variant="hero" className="mt-2" asChild>
                <Link to="/dashboard" onClick={() => setOpen(false)}>{t("nav_signup")}</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
