import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/LanguageContext";
import API from "@/services/api";
import { cn } from "@/lib/utils";

interface Message {
  text: string;
  isBot: boolean;
  time: string;
}

export const Chatbot = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      text: language === "en" ? "Hello! I'm your DigiMitra assistant. How can I help you today?" : "नमस्कार! मी तुमचा DigiMitra सहाय्यक आहे. मी तुम्हाला कशी मदत करू शकतो?",
      isBot: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, {
      text: userMsg,
      isBot: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);

    setIsLoading(true);
    try {
      const { data } = await API.post("/chat", { message: userMsg });
      setMessages(prev => [...prev, {
        text: data.answer,
        isBot: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        text: language === "en" ? "Sorry, I'm having trouble connecting right now." : "क्षमस्व, मला आता कनेक्ट करण्यात अडचण येत आहे.",
        isBot: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-card border border-border shadow-2xl rounded-3xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 gradient-primary text-primary-foreground flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-bold">DigiMitra AI</div>
                  <div className="text-[10px] opacity-80 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" /> Online
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1.5 rounded-lg transition-colors">
                <Minimize2 className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-muted/20"
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.isBot ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "flex flex-col max-w-[80%]",
                    msg.isBot ? "self-start" : "self-end items-end"
                  )}
                >
                  <div className={cn(
                    "p-3 rounded-2xl text-sm shadow-sm",
                    msg.isBot 
                      ? "bg-card border border-border rounded-tl-none" 
                      : "gradient-primary text-primary-foreground rounded-tr-none"
                  )}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1 px-1">{msg.time}</span>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex gap-2 p-3 bg-muted/40 rounded-2xl rounded-tl-none w-fit">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce" />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:0.4s]" />
                </div>
              )}
            </div>

            {/* Quick Reply Suggestions */}
            {messages.length <= 2 && (
              <div className="px-4 py-2 border-t border-border/50 bg-muted/10 flex flex-wrap gap-1.5">
                {(language === "en"
                  ? ["What is a computer?", "MS Word shortcuts", "How to get certificate?", "Help"]
                  : ["संगणक म्हणजे काय?", "शॉर्टकट", "प्रमाणपत्र", "मदत"]
                ).map((q) => (
                  <button
                    key={q}
                    onClick={() => { setInput(q); }}
                    className="px-3 py-1.5 rounded-full text-[11px] font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-border bg-card">
              <div className="relative flex items-center">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={language === "en" ? "Ask a question..." : "प्रश्न विचारा..."}
                  className="pr-12 rounded-xl h-11 bg-muted/30 focus-visible:ring-primary/20"
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={isLoading}
                  className="absolute right-1 h-9 w-9 rounded-lg gradient-primary shadow-glow-sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className={cn(
          "h-14 w-14 rounded-full shadow-glow-primary transition-all duration-300 hover:scale-110",
          isOpen ? "bg-card text-foreground rotate-90" : "gradient-primary text-primary-foreground"
        )}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-7 w-7" />}
      </Button>
    </div>
  );
};
