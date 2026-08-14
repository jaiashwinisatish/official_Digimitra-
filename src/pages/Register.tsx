import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, ArrowRight, Loader2, Smartphone, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import API from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [studentClass, setStudentClass] = useState("Class 9th");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, login } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast({
        variant: "destructive",
        title: language === "en" ? "Missing Information" : "माहिती अपूर्ण",
        description: language === "en" ? "Please fill in all required fields." : "कृपया सर्व आवश्यक माहिती प्रविष्ट करा.",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: language === "en" ? "Short Password" : "कमकुवत पासवर्ड",
        description: language === "en" ? "Password must be at least 6 characters." : "पासवर्ड किमान ६ अक्षरांचा असणे आवश्यक आहे.",
      });
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.post("/auth/register", {
        name,
        email,
        mobile,
        studentClass,
        password,
        languagePreference: language,
      });

      login(data);
      toast({
        title: language === "en" ? "Account Created!" : "खाते तयार झाले!",
        description: language === "en" ? `Welcome to Digimitra, ${name}!` : `Digimitra मध्ये तुमचे स्वागत आहे, ${name}!`,
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: language === "en" ? "Registration Failed" : "नोंदणी अयशस्वी",
        description: error?.response?.data?.message || (language === "en" ? "Could not create account. Please try again." : "खाते तयार करता आले नाही. कृपया पुन्हा प्रयत्न करा."),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-card p-8 rounded-3xl border border-border shadow-elegant">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 group mb-4">
            <div className="h-12 w-12 rounded-2xl gradient-primary flex items-center justify-center shadow-elegant group-hover:scale-110 transition-smooth">
              <GraduationCap className="h-7 w-7 text-primary-foreground" />
            </div>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">{t("nav_signup")}</h2>
          <p className="mt-2 text-muted-foreground text-sm">
            {language === "en" ? "Join Digimitra Student Portal" : "Digimitra विद्यार्थी पोर्टलमध्ये सामील व्हा"}
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleRegisterSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">{language === "en" ? "Full Name" : "पूर्ण नाव"}</Label>
              <Input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sneha Patil"
                className="mt-1 rounded-xl h-11"
              />
            </div>

            <div>
              <Label htmlFor="studentClass">{language === "en" ? "Class / Grade" : "इयत्ता"}</Label>
              <Select value={studentClass} onValueChange={setStudentClass}>
                <SelectTrigger className="mt-1 rounded-xl h-11">
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Class 8th">Class 8th (इयत्ता ८ वी)</SelectItem>
                  <SelectItem value="Class 9th">Class 9th (इयत्ता ९ वी)</SelectItem>
                  <SelectItem value="Class 10th">Class 10th (इयत्ता १० वी)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="mobile">{language === "en" ? "Mobile Number" : "मोबाईल नंबर"}</Label>
              <div className="relative mt-1">
                <Input
                  id="mobile"
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="9876543210"
                  className="pl-10 rounded-xl h-11"
                />
                <Smartphone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <div>
              <Label htmlFor="email">{language === "en" ? "Email Address" : "ईमेल पत्ता"}</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@digimitra.edu"
                className="mt-1 rounded-xl h-11"
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

          <Button type="submit" className="w-full h-12 rounded-xl font-semibold text-base" variant="hero" disabled={loading}>
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                {language === "en" ? "Register & Create Account" : "नोंदणी करा आणि खाते तयार करा"} <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {language === "en" ? "Already have an account? " : "आधीच खाते आहे? "}
          <Link to="/login" className="text-primary hover:underline font-semibold">
            {language === "en" ? "Sign in instead" : "साइन इन करा"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
