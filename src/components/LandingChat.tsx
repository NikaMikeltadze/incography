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
    <div className="w-full max-w-3xl mx-auto bg-card rounded-xl shadow-elevated border border-border overflow-hidden animate-fade-in">
      {/* Messages Area */}
      <div className="h-[400px] overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              {message.role === "assistant" && (
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-muted-foreground">Safe Space AI</span>
                </div>
              )}
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-muted rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Starter Prompts */}
      {messages.length === 1 && (
        <div className="px-6 pb-4">
          <div className="flex flex-wrap gap-2">
            {starterPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handlePromptClick(prompt)}
                className="text-xs px-3 py-2 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-colors border border-border"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-border bg-background/50 p-4">
        <div className="flex gap-2 items-end">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about Safe Space..."
            disabled={isTyping}
            className="min-h-[60px] max-h-[120px] resize-none"
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            size="icon"
            className="h-[60px] w-[60px] shrink-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          This is a demo chat. Real conversations are completely private and anonymous.
        </p>
      </div>
    </div>
  );
};
