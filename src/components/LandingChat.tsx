import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Send, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const starterPrompts = [
  "How does anonymous support work?",
  "Tell me about finding my bubble",
  "What kind of help can I get here?",
  "Is this really private?",
];

const responses: Record<string, string> = {
  anonymous:
    "We believe in complete anonymity. You never need to share your real identity, email, or any personal details. Connect authentically through shared experiences, not names or faces.",
  bubble:
    "Our AI matches you with 5-6 people facing similar challenges. It's like finding your tribe - people who truly understand what you're going through. Together, you grow stronger.",
  help: "We offer peer support through bubbles, access to licensed professionals, self-help resources, and a safe space to express yourself. Whether you need someone to listen or professional guidance, we're here.",
  private:
    "Absolutely. Your privacy is our top priority. All conversations are encrypted, no personal information is required, and you control what you share. Your safe space, your rules.",
  default:
    "I'm here to help you learn about Safe Space - a mental health community built on anonymity, empathy, and support. What would you like to know?",
};

const getResponse = (userMessage: string): string => {
  const msg = userMessage.toLowerCase();
  if (msg.includes("anonym") || msg.includes("identity")) return responses.anonymous;
  if (msg.includes("bubble") || msg.includes("match") || msg.includes("group"))
    return responses.bubble;
  if (msg.includes("help") || msg.includes("support") || msg.includes("professional"))
    return responses.help;
  if (msg.includes("private") || msg.includes("safe") || msg.includes("secure"))
    return responses.private;
  return responses.default;
};

export const LandingChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm here to answer any questions about Safe Space. What would you like to know?",
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

    // Simulate AI thinking delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const aiResponse: Message = {
      role: "assistant",
      content: getResponse(textToSend),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiResponse]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePromptClick = (prompt: string) => {
    handleSend(prompt);
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in flex flex-col items-center">
      {/* Messages Area */}
      <div className="w-full max-h-[280px] overflow-y-auto px-4 space-y-4 mb-6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
          >
            <div
              className={`max-w-[85%] ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground rounded-3xl px-5 py-3"
                  : "text-foreground"
              }`}
            >
              {message.role === "assistant" && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Safe Space</span>
                </div>
              )}
              <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              </div>
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Starter Prompts */}
      {messages.length === 1 && (
        <div className="w-full px-4 mb-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {starterPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handlePromptClick(prompt)}
                className="text-sm px-4 py-2.5 rounded-full bg-card hover:bg-muted/50 text-foreground transition-all border border-border/50 hover:border-border shadow-sm"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="w-full max-w-3xl px-4">
        <div className="relative bg-card border border-border rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Safe Space..."
            disabled={isTyping}
            className="min-h-[80px] max-h-[200px] resize-none border-0 bg-transparent px-8 py-6 pr-16 text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            size="icon"
            className="absolute right-4 bottom-4 h-12 w-12 rounded-full"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-3 text-center">
          Demo chat • Real conversations are private and anonymous
        </p>
      </div>
    </div>
  );
};
