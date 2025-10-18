import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, Handshake, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PostCardProps {
  post: {
    id: string;
    content: string;
    created_at: string;
    is_anonymous: boolean;
    author_id: string;
  };
}

const PostCard = ({ post }: PostCardProps) => {
  const [supportCount, setSupportCount] = useState(0);
  const [relateCount, setRelateCount] = useState(0);
  const [hasSupported, setHasSupported] = useState(false);
  const [hasRelated, setHasRelated] = useState(false);

  const authorName = post.is_anonymous 
    ? "Anonymous User" 
    : "Community Member";

  const timeAgo = new Date(post.created_at).toLocaleString();

  const handleSupport = async () => {
    if (hasSupported) {
      setSupportCount(prev => prev - 1);
      setHasSupported(false);
      toast.info("Support removed");
    } else {
      setSupportCount(prev => prev + 1);
      setHasSupported(true);
      toast.success("Support sent! 💙");
    }
  };

  const handleRelate = async () => {
    if (hasRelated) {
      setRelateCount(prev => prev - 1);
      setHasRelated(false);
      toast.info("Relate removed");
    } else {
      setRelateCount(prev => prev + 1);
      setHasRelated(true);
      toast.success("I relate! 🤝");
    }
  };

  return (
    <Card className="p-6 hover:shadow-soft transition">
      <div className="flex items-start gap-3 mb-4">
        <Avatar>
          <AvatarFallback className="gradient-card text-white">
            {authorName[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold">{authorName}</span>
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>
        </div>
      </div>
      <p className="text-foreground mb-4">{post.content}</p>
      <div className="flex items-center gap-6 pt-4 border-t">
        <Button 
          variant="ghost" 
          size="sm" 
          className={`gap-2 ${hasSupported ? 'text-red-500' : ''}`}
          onClick={handleSupport}
        >
          <Heart className={`w-4 h-4 ${hasSupported ? 'fill-current' : ''}`} />
          <span>{supportCount} Support</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`gap-2 ${hasRelated ? 'text-primary' : ''}`}
          onClick={handleRelate}
        >
          <Handshake className="w-4 h-4" />
          <span>{relateCount} Relate</span>
        </Button>
        <Button variant="ghost" size="sm" className="gap-2">
          <MessageCircle className="w-4 h-4" />
          <span>Comment</span>
        </Button>
      </div>
    </Card>
  );
};

export default PostCard;
