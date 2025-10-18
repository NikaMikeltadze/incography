import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Send, Sparkles } from "lucide-react";
import { streamChat } from "@/utils/aiChat";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export const LandingChat = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! Ask me anything about Safe Space.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || isTyping) return;

    const userMessage: Message = {
      role: "user",
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

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
        onDone: () => setIsTyping(false),
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
          Your Safe Space Awaits
        </h1>
        <p className="text-xl text-white/90 dark:text-foreground/80 transition-colors duration-500">
          Anonymous support • Real connections • Professional help
        </p>
      </div>

      {/* Messages Area */}
      <div className="w-full max-w-3xl max-h-[240px] overflow-y-auto px-4 space-y-3 mb-4">
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
                  <span className="text-sm font-medium text-white/90 dark:text-foreground/80 transition-colors duration-300">Safe Space</span>
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

      {/* Input Area */}
      <div className="w-full max-w-3xl px-4">
        <div className="relative bg-white backdrop-blur-sm border border-border/50 rounded-3xl shadow-2xl overflow-hidden transition-all duration-200 hover:shadow-elevated">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              // Auto-resize like ChatGPT
              if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
                textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder="Message Safe Space..."
            disabled={isTyping}
            className="min-h-[56px] max-h-[200px] resize-none border-0 bg-transparent px-6 py-4 pr-14 text-base leading-6 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50"
            rows={1}
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            size="icon"
            className="absolute right-3 bottom-3 h-10 w-10 rounded-full bg-primary hover:bg-primary/90 transition-colors"
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
