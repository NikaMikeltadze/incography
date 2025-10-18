import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { ArrowLeft, Info, Users, Smile, Send, Shield, CheckCheck, AlertTriangle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useChatMessages } from "@/hooks/useChatMessages";
import { Skeleton } from "@/components/ui/skeleton";

const BubbleChat = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [moderationWarning, setModerationWarning] = useState(false);
  const [isAnonymous] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, isLoading, sendMessage, isSending } = useChatMessages(id || "default");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleMessageChange = (value: string) => {
    setMessage(value);
    const badWords = ["hate", "kill", "hurt"];
    const violation = badWords.some(word => value.toLowerCase().includes(word));
    setModerationWarning(violation);
  };

  const handleSendMessage = () => {
    if (!message || moderationWarning) return;
    
    sendMessage({ content: message, isAnonymous });
    setMessage("");
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Chat Header */}
      <div className="bg-card border-b p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h2 className="font-semibold text-lg flex items-center gap-2">
                Anxiety Warriors 💪
                <Badge variant="default" className="bg-success">6 online</Badge>
              </h2>
              <div className="flex gap-1 mt-1">
                <Badge variant="outline" className="text-xs">#anxiety</Badge>
                <Badge variant="outline" className="text-xs">#support</Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Info className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Users className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-muted">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <div className="inline-block bg-card rounded-full px-4 py-2 text-sm text-muted-foreground shadow-sm">
              🛡️ Safe space. Encrypted and AI-moderated.
            </div>
          </div>
          
          <div className="text-center text-xs text-muted-foreground font-semibold mb-6">Today</div>
          
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : messages && messages.length > 0 ? (
            messages.map((msg: any) => {
              const isMe = false; // TODO: Add user ID check
              const authorName = msg.is_anonymous 
                ? "Anonymous" 
                : "User";
              
              return (
                <div 
                  key={msg.id} 
                  className={`flex items-start gap-3 mb-6 ${isMe ? 'justify-end' : ''}`}
                >
                  {!isMe && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="gradient-card text-white text-sm">
                        {authorName[0]}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={isMe ? 'text-right' : ''}>
                    <div className={`flex items-center gap-2 mb-1 ${isMe ? 'justify-end' : ''}`}>
                      {!isMe && <span className="text-sm font-semibold">{authorName}</span>}
                      <span className="text-xs text-muted-foreground">
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </span>
                      {isMe && <span className="text-sm font-semibold">You</span>}
                    </div>
                    <div 
                      className={`rounded-2xl px-4 py-2 max-w-md inline-block ${
                        isMe 
                          ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                          : 'bg-card shadow-sm rounded-tl-sm'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                    {isMe && (
                      <div className={`flex justify-end mt-1`}>
                        <CheckCheck className="w-4 h-4 text-primary" />
                      </div>
                    )}
                  </div>
                  
                  {isMe && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="gradient-card text-white text-sm">
                        A
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <p>No messages yet. Start the conversation!</p>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Chat Input */}
      <div className="bg-card border-t p-4">
        <div className="container mx-auto max-w-4xl">
          {moderationWarning && (
            <Alert variant="destructive" className="mb-3">
              <AlertTriangle className="h-4 w-4" />
              <p className="text-sm font-semibold">⚠️ Message violates guidelines. Warnings: 1/3</p>
            </Alert>
          )}
          
          <div className="flex items-end gap-3">
            <Textarea
              placeholder="Share with your bubble..."
              rows={1}
              value={message}
              onChange={(e) => handleMessageChange(e.target.value)}
              className="flex-1 resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button variant="ghost" size="icon">
              <Smile className="w-5 h-5" />
            </Button>
            <Button 
              size="icon" 
              className="bg-primary" 
              disabled={moderationWarning || !message || isSending}
              onClick={handleSendMessage}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <Shield className="w-3 h-3 text-success" />
            AI moderation active
          </p>
        </div>
      </div>
    </div>
  );
};

export default BubbleChat;
