import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { ArrowLeft, Info, Users, Smile, Send, Shield, CheckCheck, AlertTriangle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const BubbleChat = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [moderationWarning, setModerationWarning] = useState(false);

  const handleMessageChange = (value: string) => {
    setMessage(value);
    const badWords = ["hate", "kill", "hurt"];
    const violation = badWords.some(word => value.toLowerCase().includes(word));
    setModerationWarning(violation);
  };

  const messages = [
    {
      id: 1,
      author: "HopefulSoul",
      content: "Having a tough morning but trying to stay positive 💙",
      timeAgo: "10:45 AM",
      isMe: false,
      reactions: { "❤️": 3, "🤗": 2 }
    },
    {
      id: 2,
      author: "You",
      content: "You've got this! We're all here for you 💪",
      timeAgo: "10:47 AM",
      isMe: true,
      reactions: {}
    }
  ];

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
          
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex items-start gap-3 mb-6 ${msg.isMe ? 'justify-end' : ''}`}
            >
              {!msg.isMe && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="gradient-card text-white text-sm">
                    {msg.author[0]}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={msg.isMe ? 'text-right' : ''}>
                <div className={`flex items-center gap-2 mb-1 ${msg.isMe ? 'justify-end' : ''}`}>
                  {!msg.isMe && <span className="text-sm font-semibold">{msg.author}</span>}
                  <span className="text-xs text-muted-foreground">{msg.timeAgo}</span>
                  {msg.isMe && <span className="text-sm font-semibold">You</span>}
                </div>
                <div 
                  className={`rounded-2xl px-4 py-2 max-w-md inline-block ${
                    msg.isMe 
                      ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                      : 'bg-card shadow-sm rounded-tl-sm'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
                {Object.keys(msg.reactions).length > 0 && (
                  <div className={`flex gap-2 mt-1 ${msg.isMe ? 'justify-end' : ''}`}>
                    {Object.entries(msg.reactions).map(([emoji, count]) => (
                      <span key={emoji} className="text-xs cursor-pointer">
                        {emoji} {count}
                      </span>
                    ))}
                  </div>
                )}
                {msg.isMe && (
                  <div className={`flex justify-end mt-1`}>
                    <CheckCheck className="w-4 h-4 text-primary" />
                  </div>
                )}
              </div>
              
              {msg.isMe && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="gradient-card text-white text-sm">
                    A
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {/* Typing indicator */}
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarFallback className="bg-muted text-xs">
                S
              </AvatarFallback>
            </Avatar>
            <div className="bg-card rounded-full px-4 py-2 shadow-sm">
              <span className="animate-pulse">...</span>
            </div>
          </div>
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
                  if (message && !moderationWarning) {
                    setMessage("");
                  }
                }
              }}
            />
            <Button variant="ghost" size="icon">
              <Smile className="w-5 h-5" />
            </Button>
            <Button 
              size="icon" 
              className="bg-primary" 
              disabled={moderationWarning || !message}
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
