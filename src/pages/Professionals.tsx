import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Award, Users, BookOpen, CheckCircle, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

const Professionals = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: Users,
      title: "Extend Your Reach",
      description: "Help more people by facilitating peer support groups alongside your clinical practice.",
    },
    {
      icon: BookOpen,
      title: "Evidence-Based",
      description: "Our platform is built on proven peer support methodologies and clinical best practices.",
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Monitor group dynamics and member engagement to provide better support.",
    },
    {
      icon: Shield,
      title: "Professional Tools",
      description: "Access advanced moderation, analytics, and crisis intervention resources.",
    },
  ];

  const features = [
    "Create and moderate multiple support bubbles",
    "Access to professional dashboard with analytics",
    "Crisis detection and intervention tools",
    "Training resources and best practices",
    "Connect with other mental health professionals",
    "Continuing education credits (coming soon)",
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
            <button onClick={() => navigate("/how-it-works")} className="text-foreground hover:text-primary transition-colors">How It Works</button>
            <button onClick={() => navigate("/professionals")} className="text-primary font-medium">Professionals</button>
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
            <div className="flex justify-center mb-6">
              <Award className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              For Mental Health Professionals
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Empower your practice with tools to facilitate peer support groups and extend your impact beyond traditional therapy sessions.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-20">
            {benefits.map((benefit, index) => (
              <Card 
                key={index}
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-2">{benefit.title}</CardTitle>
                      <CardDescription className="text-base">
                        {benefit.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Features Section */}
          <Card className="max-w-4xl mx-auto mb-20">
            <CardHeader>
              <CardTitle className="text-3xl text-center mb-4">Professional Features</CardTitle>
              <CardDescription className="text-center text-lg">
                Everything you need to facilitate effective peer support groups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-base">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Requirements Section */}
          <Card className="max-w-3xl mx-auto mb-12 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="text-2xl text-center mb-2">Join Our Professional Network</CardTitle>
              <CardDescription className="text-center">
                We welcome licensed mental health professionals including therapists, counselors, psychologists, and social workers.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                Professional verification required. All applications are reviewed to ensure the highest quality of care for our community.
              </p>
              <Button 
                size="lg" 
                onClick={() => navigate("/auth")}
                className="text-lg px-8 py-6"
              >
                Apply as a Professional
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Professionals;
