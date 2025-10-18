import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Cpu, CheckCircle, AlertCircle, AlertTriangle, Heart, Trophy, MessageCircle, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { usePosts } from "@/hooks/usePosts";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  bubbleId?: string | null;
}

const CreatePostModal = ({ isOpen, onClose, bubbleId }: CreatePostModalProps) => {
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("general");
  const [hasViolation, setHasViolation] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const { createPost, isCreating } = usePosts(bubbleId || "");

  const detectedTags = content.length > 50 ? ["#support", "#community"] : [];
  const isSafe = content.length > 20 && !hasViolation;

  const handleContentChange = (value: string) => {
    setContent(value);
    // Simple content moderation demo
    const badWords = ["hate", "kill", "hurt"];
    const violation = badWords.some(word => value.toLowerCase().includes(word));
    setHasViolation(violation);
  };

  const handlePost = () => {
    if (!content || hasViolation || !bubbleId) {
      if (!bubbleId) {
        toast.error("Please join a bubble first to create posts");
      }
      return;
    }
    
    createPost(
      { content, isAnonymous },
      {
        onSuccess: () => {
          toast.success("Post shared with your community!");
          setContent("");
          setPostType("general");
          onClose();
        }
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">What's on your mind?</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Alert className="bg-blue-50 border-primary">
            <Cpu className="text-primary" />
            <AlertDescription className="text-sm">
              AI is listening to match you with the right community
            </AlertDescription>
          </Alert>
          
          <Textarea
            placeholder="Share your thoughts, feelings, or achievements..."
            rows={8}
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            className="w-full resize-none"
          />
          
          <div className="flex justify-between text-sm items-center">
            <span className={content.length > 450 ? 'text-warning' : 'text-muted-foreground'}>
              {content.length} / 500
            </span>
            {isSafe && (
              <span className="text-success flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Content approved
              </span>
            )}
            {hasViolation && (
              <span className="text-destructive flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Violates guidelines
              </span>
            )}
          </div>
          
          {hasViolation && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <p className="font-semibold">Message violates community guidelines</p>
                <p className="text-sm">Please be respectful. Warnings: 1/3</p>
              </AlertDescription>
            </Alert>
          )}
          
          <div>
            <Label className="mb-3 block">Post Type</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={postType === "support" ? "default" : "outline"}
                className="justify-start gap-2 h-auto py-3"
                onClick={() => setPostType("support")}
              >
                <Heart className="w-4 h-4 text-red-400" />
                <span>Seeking Support</span>
              </Button>
              <Button
                variant={postType === "achievement" ? "default" : "outline"}
                className="justify-start gap-2 h-auto py-3"
                onClick={() => setPostType("achievement")}
              >
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span>Achievement</span>
              </Button>
              <Button
                variant={postType === "general" ? "default" : "outline"}
                className="justify-start gap-2 h-auto py-3"
                onClick={() => setPostType("general")}
              >
                <MessageCircle className="w-4 h-4" />
                <span>General</span>
              </Button>
              <Button
                variant={postType === "question" ? "default" : "outline"}
                className="justify-start gap-2 h-auto py-3"
                onClick={() => setPostType("question")}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Question</span>
              </Button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="visibility">Visibility</Label>
            <Select defaultValue="community">
              <SelectTrigger id="visibility">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="community">Share to Community</SelectItem>
                <SelectItem value="bubbles">My Bubbles Only</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 mt-3">
              <Checkbox 
                id="anonymous" 
                checked={isAnonymous}
                onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
              />
              <label htmlFor="anonymous" className="text-sm">Post anonymously</label>
            </div>
          </div>
          
          {detectedTags.length > 0 && (
            <div>
              <Label className="mb-2 block">AI detected topics:</Label>
              <div className="flex flex-wrap gap-2">
                {detectedTags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex justify-between sm:justify-between">
          <p className="text-xs text-muted-foreground">Posted to people who can relate</p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} disabled={isCreating}>Cancel</Button>
            <Button disabled={!content || hasViolation || isCreating || !bubbleId} onClick={handlePost}>
              {isCreating ? "Posting..." : "Post"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
