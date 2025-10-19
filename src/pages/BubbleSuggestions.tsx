import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, ArrowLeft, Heart } from "lucide-react";
import { useBubbles } from "@/hooks/useBubbles";
import { useToast } from "@/hooks/use-toast";

interface SuggestedBubble {
  id: string;
  name: string;
  reason: string;
}

interface LocationState {
  suggestions?: {
    categories: string[];
    suggestedBubbles: SuggestedBubble[];
    encouragement: string;
  };
}

const BubbleSuggestions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { joinBubble, isJoining } = useBubbles();
  
  const state = location.state as LocationState;
  const suggestions = state?.suggestions;

  useEffect(() => {
    if (!suggestions) {
      navigate('/dashboard');
    }
  }, [suggestions, navigate]);

  if (!suggestions) {
    return null;
  }

  const handleJoinBubble = (bubbleId: string) => {
    joinBubble(bubbleId, {
      onSuccess: () => {
        toast({
          title: "Success!",
          description: "You've joined the bubble. Redirecting...",
        });
        setTimeout(() => navigate(`/bubble/${bubbleId}`), 1500);
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-12 h-12 text-primary" />
            <Heart className="w-8 h-8 text-secondary animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            We Found Your Tribe
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {suggestions.encouragement}
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {suggestions.categories.map((category) => (
            <Badge key={category} variant="secondary" className="text-sm py-1 px-3">
              {category}
            </Badge>
          ))}
        </div>

        {/* Suggested Bubbles */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Recommended Support Bubbles
          </h2>
          
          {suggestions.suggestedBubbles.map((bubble, index) => (
            <Card 
              key={bubble.id} 
              className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl mb-2">{bubble.name}</CardTitle>
                    <CardDescription className="text-base">
                      {bubble.reason}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="ml-4">
                    {index === 0 ? 'Best Match' : 'Great Fit'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => handleJoinBubble(bubble.id)}
                  disabled={isJoining}
                  className="w-full"
                >
                  {isJoining ? 'Joining...' : 'Join This Bubble'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            You can join multiple bubbles and find the ones that feel right for you
          </p>
          <Button 
            variant="outline"
            onClick={() => navigate('/dashboard')}
          >
            View All Bubbles
          </Button>
        </div>

        {/* Crisis Resources */}
        <div className="mt-12 p-6 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-center">
            <strong>In Crisis?</strong> Call 112 (Emergency) or 988 (Suicide & Crisis Lifeline)
          </p>
        </div>
      </div>
    </div>
  );
};

export default BubbleSuggestions;