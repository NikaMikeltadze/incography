import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, MessageSquare, Users, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

const HowItWorks = () => {
  const navigate = useNavigate();

  const steps = [
    {
      number: "1",
      icon: MessageSquare,
      title: "Share Your Story",
      description: "Tell our AI assistant what's on your mind. Be as open or private as you'd like - this is your safe space.",
      details: "Our empathetic AI listens without judgment and helps understand what you're going through.",
    },
    {
      number: "2",
      icon: Sparkles,
      title: "Get Matched",
      description: "Our intelligent system analyzes your needs and finds the perfect support bubbles for you.",
      details: "We consider your concerns, preferences, and what kind of support would help you most.",
    },
    {
      number: "3",
      icon: Users,
      title: "Join Your Bubble",
      description: "Connect with up to 5 others who understand what you're going through. Share, listen, and grow together.",
      details: "Small, intimate groups create meaningful connections and lasting support networks.",
    },
    {
      number: "4",
      icon: Shield,
      title: "Stay Anonymous",
      description: "Share as much or as little as you want. Your identity is always protected.",
      details: "Feel free to be authentic without fear of judgment or recognition.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/90 backdrop-blur-md border-b z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 text-2xl font-bold text-primary cursor-pointer"
            onClick={() => navigate("/")}
          >
            <Shield className="w-8 h-8" />
            <span>Incotheraphy</span>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <button onClick={() => navigate("/features")} className="text-foreground hover:text-primary transition-colors">Features</button>
            <button onClick={() => navigate("/how-it-works")} className="text-primary font-medium">How It Works</button>
            <button onClick={() => navigate("/professionals")} className="text-foreground hover:text-primary transition-colors">Professionals</button>
            <button onClick={() => navigate("/pricing")} className="text-foreground hover:text-primary transition-colors">Pricing</button>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button onClick={() => navigate("/auth")}>Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              How Incotheraphy Works
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Four simple steps to find support, connect with others, and start your journey to better mental health.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-12 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                          {step.number}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <step.icon className="w-8 h-8 text-primary" />
                          <CardTitle className="text-2xl">{step.title}</CardTitle>
                        </div>
                        <CardDescription className="text-lg mb-3">
                          {step.description}
                        </CardDescription>
                        <p className="text-muted-foreground">
                          {step.details}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
                
                {/* Arrow between steps */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center my-6">
                    <ArrowRight className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center">
            <Card className="max-w-3xl mx-auto bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardHeader>
                <CardTitle className="text-3xl mb-4">Ready to Begin?</CardTitle>
                <CardDescription className="text-lg">
                  Start your journey to better mental health today. It only takes a few minutes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  size="lg" 
                  onClick={() => navigate("/auth")}
                  className="text-lg px-8 py-6"
                >
                  Get Started Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
