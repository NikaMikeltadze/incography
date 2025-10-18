import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Users, MessageCircle, Brain, Heart, Eye, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import logo from "@/assets/incotheraphy-logo.png";

const Features = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Lock,
      title: "Complete Anonymity",
      description: "Share your thoughts and feelings without revealing your identity. Your privacy is our top priority.",
    },
    {
      icon: Users,
      title: "Support Bubbles",
      description: "Join intimate groups of 6 people facing similar challenges. Find understanding and connection in safe spaces.",
    },
    {
      icon: MessageCircle,
      title: "Real-time Chat",
      description: "Connect with others instantly. Share experiences, offer support, and receive encouragement in real-time.",
    },
    {
      icon: Brain,
      title: "AI-Powered Matching",
      description: "Our intelligent system matches you with the most relevant support bubbles based on your needs.",
    },
    {
      icon: Heart,
      title: "Crisis Resources",
      description: "Immediate access to emergency contacts and professional help when you need it most.",
    },
    {
      icon: Eye,
      title: "Moderated Environment",
      description: "Safe, supportive spaces monitored to ensure respectful and helpful interactions.",
    },
    {
      icon: Zap,
      title: "Instant Support",
      description: "Get help when you need it. Someone is always there to listen, 24/7.",
    },
    {
      icon: Lock,
      title: "Secure Platform",
      description: "End-to-end encryption and secure data storage protect your information at all times.",
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
            <img src={logo} alt="Incotheraphy" className="w-8 h-8" />
            <span>Incotheraphy</span>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <button onClick={() => navigate("/features")} className="text-primary font-medium">Features</button>
            <button onClick={() => navigate("/how-it-works")} className="text-foreground hover:text-primary transition-colors">How It Works</button>
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
              Features That Empower
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to find support, connect with others, and take steps toward better mental health.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center">
            <Card className="max-w-3xl mx-auto bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardHeader>
                <CardTitle className="text-3xl mb-4">Ready to Get Started?</CardTitle>
                <CardDescription className="text-lg">
                  Join thousands of people finding support and connection in Incotheraphy.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  size="lg" 
                  onClick={() => navigate("/auth")}
                  className="text-lg px-8 py-6"
                >
                  Create Your Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
