import { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";
import { useAuth } from "@/context/AuthContext";

export const MainLayout = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      {user && <Chatbot />}
      <Footer />
    </div>
  );
};
