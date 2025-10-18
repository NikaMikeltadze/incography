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
      <nav className="fixed top-0 w-full bg-background/90 backdrop-blur-md border-b z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-2xl font-bold text-primary">
            <Shield className="w-8 h-8" />
            <span>Safe Space</span>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <a href="#features" className="text-foreground hover:text-primary transition-colors duration-200">Features</a>
            <a href="#how-it-works" className="text-foreground hover:text-primary transition-colors duration-200">How It Works</a>
            <a href="#professionals" className="text-foreground hover:text-primary transition-colors duration-200">Professionals</a>
            <a href="#pricing" className="text-foreground hover:text-primary transition-colors duration-200">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button onClick={() => navigate("/onboarding")} className="bg-accent hover:bg-accent/90">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Chat Only */}
      <section 
        className="pt-24 pb-6 relative overflow-hidden flex items-start justify-center"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
        }}
      >
        <div className="absolute inset-0 gradient-hero opacity-80"></div>
        
        {/* Floating Bubbles Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute top-20 left-20 w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm animate-float"></div>
          <div className="absolute top-40 right-32 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm animate-float-delayed"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <LandingChat />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-6 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="text-center p-4">
              <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="text-sm font-semibold mb-1">Complete Anonymity</h3>
              <p className="text-xs text-muted-foreground">Express freely without judgment</p>
            </div>
            <div className="text-center p-4">
              <Users className="w-8 h-8 text-secondary mx-auto mb-2" />
              <h3 className="text-sm font-semibold mb-1">Find Your Bubble</h3>
              <p className="text-xs text-muted-foreground">AI matches you with understanding peers</p>
            </div>
            <div className="text-center p-4">
              <Award className="w-8 h-8 text-success mx-auto mb-2" />
              <h3 className="text-sm font-semibold mb-1">Professional Support</h3>
              <p className="text-xs text-muted-foreground">Access certified therapists</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-6 bg-muted">
        <div className="container mx-auto px-6">
          <div className="flex flex-row justify-between items-center gap-4 max-w-3xl mx-auto">
            <div className="text-center flex-1">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center mx-auto mb-2">
                1
              </div>
              <h4 className="font-semibold text-xs mb-1">Share Anonymously</h4>
            </div>
            <div className="text-xl text-muted-foreground">→</div>
            <div className="text-center flex-1">
              <div className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground text-sm font-bold flex items-center justify-center mx-auto mb-2">
                2
              </div>
              <h4 className="font-semibold text-xs mb-1">AI Matches You</h4>
            </div>
            <div className="text-xl text-muted-foreground">→</div>
            <div className="text-center flex-1">
              <div className="w-10 h-10 rounded-full bg-success text-success-foreground text-sm font-bold flex items-center justify-center mx-auto mb-2">
                3
              </div>
              <h4 className="font-semibold text-xs mb-1">Join Your Bubble</h4>
            </div>
            <div className="text-xl text-muted-foreground">→</div>
            <div className="text-center flex-1">
              <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground text-sm font-bold flex items-center justify-center mx-auto mb-2">
                4
              </div>
              <h4 className="font-semibold text-xs mb-1">Grow Together</h4>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 gradient-hero">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Ready to Find Your Safe Space?
          </h2>
          <Button 
            size="lg"
            onClick={() => navigate("/onboarding")}
            className="bg-accent hover:bg-accent/90"
          >
            Start Your Journey →
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-foreground text-background">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4" />
                Safe Space
              </h4>
              <p className="text-xs opacity-80">Anonymous mental health community</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-sm">Platform</h4>
              <ul className="space-y-1 text-xs opacity-80">
                <li><a href="#features" className="hover:opacity-100 transition-opacity">Features</a></li>
                <li><a href="#how-it-works" className="hover:opacity-100 transition-opacity">How It Works</a></li>
                <li>
                  <button 
                    onClick={() => navigate("/onboarding")} 
                    className="hover:opacity-100 transition-opacity text-left"
                  >
                    Get Started
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-sm">Support</h4>
              <ul className="space-y-1 text-xs opacity-80">
                <li>
                  <button 
                    onClick={() => window.open('https://988lifeline.org/', '_blank')}
                    className="hover:opacity-100 transition-opacity text-left"
                  >
                    Crisis Resources (988)
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate("/onboarding")}
                    className="hover:opacity-100 transition-opacity text-left"
                  >
                    Join Community
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-sm">About</h4>
              <ul className="space-y-1 text-xs opacity-80">
                <li><a href="#features" className="hover:opacity-100 transition-opacity">Our Mission</a></li>
                <li>
                  <button 
                    onClick={() => navigate("/onboarding")}
                    className="hover:opacity-100 transition-opacity text-left"
                  >
                    Get Started
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
