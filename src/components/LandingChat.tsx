import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Send, Sparkles, RotateCcw } from "lucide-react";
import { streamChat } from "@/utils/aiChat";
import { categorizeProblem, isProblemDescription } from "@/utils/categorizeProblem";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export const LandingChat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  
  const initialMessage = {
    role: "assistant" as const,
    content: "Hi! I'm here to listen. Tell me what's on your mind, and I'll help connect you with a supportive community.",
    timestamp: new Date(),
  };
  
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isCategorizing, setIsCategorizing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleClearHistory = () => {
    setMessages([initialMessage]);
    setInput("");
    toast({
      title: "Chat cleared",
      description: "Your conversation history has been reset",
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || isTyping) return;

    // Check if user is authenticated
    if (!isAuthenticated) {
      toast({
        title: "Sign up required",
        description: "Please create an account to chat with Incography",
        variant: "default",
      });
      navigate("/auth");
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Check if this looks like a problem description
    const seemsLikeProblem = isProblemDescription(textToSend);

    let assistantContent = "";
    const upsertAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => 
            i === prev.length - 1 
              ? { ...m, content: assistantContent } 
              : m
          );
        }
        return [...prev, { 
          role: "assistant", 
          content: assistantContent, 
          timestamp: new Date() 
        }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, userMessage].map(m => ({
          role: m.role,
          content: m.content,
        })),
        onDelta: (chunk) => upsertAssistant(chunk),
        onDone: async () => {
          setIsTyping(false);
          
          // If it seems like a problem, offer to find bubbles
          if (seemsLikeProblem && messages.length >= 1) {
            setTimeout(() => {
              setIsCategorizing(true);
              setMessages(prev => [...prev, {
                role: "assistant",
                content: "I can help you find supportive communities that understand what you're going through. Would you like me to suggest some bubbles that might be helpful?",
                timestamp: new Date(),
              }]);
              setIsCategorizing(false);
            }, 1000);
          }
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
          setIsTyping(false);
        },
      });
    } catch (error) {
      console.error("Chat error:", error);
      setIsTyping(false);
    }
  };

  const handleFindBubbles = async () => {
    setIsCategorizing(true);
    
    try {
      // Get the user's messages to categorize
      const userMessages = messages
        .filter(m => m.role === "user")
        .map(m => m.content)
        .join(" ");

      const suggestions = await categorizeProblem(userMessages);
      
      // Navigate to suggestions page with the data
      navigate('/suggestions', { 
        state: { suggestions } 
      });
    } catch (error) {
      console.error("Categorization error:", error);
      toast({
        title: "Error",
        description: "Failed to find matching bubbles. Please try again.",
        variant: "destructive",
      });
      setIsCategorizing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePromptClick = async (prompt: string) => {
    await handleSend(prompt);
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in flex flex-col items-center justify-center">
      {/* Compact Title */}
      <div className="text-center mb-8">
        <h1 className="text-5xl md:text-6xl font-bold text-white dark:text-foreground mb-4 transition-colors duration-500">
          Your Incography Awaits
        </h1>
        <p className="text-xl text-white/90 dark:text-foreground/80 transition-colors duration-500">
          Anonymous support • Real connections • Professional help
        </p>
      </div>

      {/* Messages Area */}
      <div className="w-full max-w-3xl px-4 mb-4">
        {messages.length > 1 && (
          <div className="flex justify-end mb-2">
            <Button
              onClick={handleClearHistory}
              variant="ghost"
              size="sm"
              className="text-white/70 dark:text-foreground/70 hover:text-white dark:hover:text-foreground hover:bg-white/10 dark:hover:bg-foreground/10"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear history
            </Button>
          </div>
        )}
        <div className="max-h-[240px] overflow-y-auto space-y-3">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
          >
            <div
              className={`max-w-[85%] ${
                message.role === "user"
                  ? "bg-white dark:bg-card text-foreground rounded-2xl px-4 py-2"
                  : "text-white dark:text-foreground/90"
              } transition-colors duration-300`}
            >
              {message.role === "assistant" && (
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-white/20 dark:bg-foreground/20 flex items-center justify-center transition-colors duration-300">
                    <Sparkles className="w-3 h-3 text-white dark:text-foreground" />
                  </div>
                  <span className="text-sm font-medium text-white/90 dark:text-foreground/80 transition-colors duration-300">Incography</span>
                </div>
              )}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white/20 dark:bg-foreground/20 flex items-center justify-center transition-colors duration-300">
                <Sparkles className="w-3 h-3 text-white dark:text-foreground animate-pulse" />
              </div>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-white/60 dark:bg-foreground/60 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-white/60 dark:bg-foreground/60 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-white/60 dark:bg-foreground/60 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Find Bubbles Button - shows after conversation */}
      {messages.length > 2 && !isTyping && !isCategorizing && (
        <div className="w-full max-w-3xl px-4 mb-3 animate-fade-in">
          <Button 
            onClick={handleFindBubbles}
            variant="secondary"
            className="w-full"
          >
            Find My Support Bubbles 🎯
          </Button>
        </div>
      )}

      {isCategorizing && (
        <div className="w-full max-w-3xl px-4 mb-3 flex items-center justify-center gap-2 text-sm text-muted-foreground animate-fade-in">
          <Sparkles className="w-4 h-4 animate-pulse" />
          Finding the perfect bubbles for you...
        </div>
      )}

      {/* Input Area */}
      <div className="w-full max-w-3xl px-4">
        <div className="relative bg-card dark:bg-card backdrop-blur-sm border border-border rounded-3xl shadow-2xl overflow-hidden transition-all duration-200 hover:shadow-elevated">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Message Incography..."
            disabled={isTyping}
            className="min-h-[56px] max-h-[200px] resize-none border-0 bg-transparent px-6 py-4 pr-14 text-base leading-6 text-foreground focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50 overflow-y-auto"
            rows={1}
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            size="icon"
            className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-xs text-white/60 dark:text-foreground/50 mt-3 text-center transition-colors duration-300">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </div>
  );
};
