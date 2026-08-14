import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import API from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast({
        variant: "destructive",
        title: language === "en" ? "Missing fields" : "माहिती अपूर्ण",
        description: language === "en" ? "Please enter both email and password." : "कृपया ईमेल आणि पासवर्ड दोन्ही प्रविष्ट करा.",
      });
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.post("/auth/login", { email, password });
      login(data);
      toast({
        title: language === "en" ? "Welcome back!" : "पुन्हा स्वागत!",
        description: language === "en" ? `Logged in as ${data.name}` : `${data.name} म्हणून लॉग इन केले`,
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: language === "en" ? "Login Failed" : "लॉगिन अयशस्वी",
        description: error?.response?.data?.message || (language === "en" ? "Invalid email or password. Please try again." : "चुकीचा ईमेल किंवा पासवर्ड. कृपया पुन्हा प्रयत्न करा."),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-card p-8 rounded-2xl border border-border shadow-elegant">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 group mb-4">
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-elegant group-hover:scale-110 transition-smooth">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">{t("nav_login")}</h2>
          <p className="mt-2 text-muted-foreground">
            {language === "en" ? "Welcome back to Digimitra" : "Digimitra मध्ये पुन्हा स्वागत"}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">{language === "en" ? "Email address" : "ईमेल पत्ता"}</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 rounded-xl h-11"
                autoComplete="email"
              />
            </div>
            <div>
              <Label htmlFor="password">{language === "en" ? "Password" : "पासवर्ड"}</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pr-10 rounded-xl h-11"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full h-11 rounded-xl" variant="hero" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                {language === "en" ? "Sign in" : "साइन इन करा"} <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          {language === "en" ? "Don't have an account? " : "खाते नाही? "}
          <Link to="/register" className="text-primary hover:underline font-medium">
            {language === "en" ? "Create an account" : "खाते तयार करा"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
