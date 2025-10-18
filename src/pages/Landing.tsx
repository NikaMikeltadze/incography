import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Award, MessageCircle, Cpu, TrendingUp, Lock, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroBackground from "@/assets/peaceful-clouds-bg.jpg";
import { LandingChat } from "@/components/LandingChat";
import { ThemeToggle } from "@/components/ThemeToggle";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-2xl font-bold text-primary">
            <Shield className="w-8 h-8" />
            <span>Safe Space</span>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <a href="#features" className="text-foreground hover:text-primary transition">Features</a>
            <a href="#how-it-works" className="text-foreground hover:text-primary transition">How It Works</a>
            <a href="#professionals" className="text-foreground hover:text-primary transition">Professionals</a>
            <a href="#pricing" className="text-foreground hover:text-primary transition">Pricing</a>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button onClick={() => navigate("/onboarding")} className="bg-accent hover:bg-accent/90">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Chat Only */}
      <section 
        className="min-h-screen pt-32 pb-20 relative overflow-hidden flex items-center justify-center"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
        }}
      >
        <div className="absolute inset-0 gradient-hero opacity-80"></div>
        
        {/* Floating Bubbles Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm animate-float"></div>
          <div className="absolute top-40 right-32 w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm animate-float-delayed"></div>
          <div className="absolute bottom-40 left-40 w-40 h-40 rounded-full bg-white/10 backdrop-blur-sm animate-float"></div>
          <div className="absolute bottom-32 right-20 w-28 h-28 rounded-full bg-white/10 backdrop-blur-sm animate-float-delayed"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <LandingChat />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">Why Safe Space?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:shadow-elevated transition-all duration-300 hover:-translate-y-2">
              <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-3">Complete Anonymity</h3>
              <p className="text-muted-foreground">Express yourself freely without judgment or fear</p>
            </Card>
            <Card className="p-8 text-center hover:shadow-elevated transition-all duration-300 hover:-translate-y-2">
              <Users className="w-16 h-16 text-secondary mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-3">Find Your Bubble</h3>
              <p className="text-muted-foreground">AI matches you with 5-6 people who truly understand</p>
            </Card>
            <Card className="p-8 text-center hover:shadow-elevated transition-all duration-300 hover:-translate-y-2">
              <Award className="w-16 h-16 text-success mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-3">Professional Support</h3>
              <p className="text-muted-foreground">Access certified therapists and counseling students</p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-muted">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 max-w-6xl mx-auto">
            <div className="text-center flex-1">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <MessageCircle className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h4 className="font-semibold text-lg mb-2">Share Anonymously</h4>
              <p className="text-sm text-muted-foreground">Express without fear</p>
            </div>
            <div className="hidden md:block text-4xl text-muted-foreground">→</div>
            <div className="text-center flex-1">
              <div className="w-16 h-16 rounded-full bg-secondary text-secondary-foreground text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <Cpu className="w-12 h-12 mx-auto mb-3 text-secondary" />
              <h4 className="font-semibold text-lg mb-2">AI Matches You</h4>
              <p className="text-sm text-muted-foreground">Smart algorithms find your tribe</p>
            </div>
            <div className="hidden md:block text-4xl text-muted-foreground">→</div>
            <div className="text-center flex-1">
              <div className="w-16 h-16 rounded-full bg-success text-success-foreground text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <Users className="w-12 h-12 mx-auto mb-3 text-success" />
              <h4 className="font-semibold text-lg mb-2">Join Your Bubble</h4>
              <p className="text-sm text-muted-foreground">Connect with peers</p>
            </div>
            <div className="hidden md:block text-4xl text-muted-foreground">→</div>
            <div className="text-center flex-1">
              <div className="w-16 h-16 rounded-full bg-accent text-accent-foreground text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                4
              </div>
              <TrendingUp className="w-12 h-12 mx-auto mb-3 text-accent" />
              <h4 className="font-semibold text-lg mb-2">Grow Together</h4>
              <p className="text-sm text-muted-foreground">Heal and support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Find Your Safe Space?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands finding support and healing
          </p>
          <Button 
            size="lg"
            onClick={() => navigate("/onboarding")}
            className="bg-accent hover:bg-accent/90 text-lg px-8 py-6"
          >
            Start Your Journey →
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-foreground text-background">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Safe Space
              </h4>
              <p className="text-sm opacity-80">Your anonymous mental health community</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#features" className="hover:opacity-100">Features</a></li>
                <li><a href="#how-it-works" className="hover:opacity-100">How It Works</a></li>
                <li><a href="#pricing" className="hover:opacity-100">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:opacity-100">Help Center</a></li>
                <li><a href="#" className="hover:opacity-100">Crisis Resources</a></li>
                <li><a href="#" className="hover:opacity-100">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:opacity-100">Privacy</a></li>
                <li><a href="#" className="hover:opacity-100">Terms</a></li>
                <li><a href="#" className="hover:opacity-100">Guidelines</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
