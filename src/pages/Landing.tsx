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
            <Button onClick={() => navigate("/auth")} className="bg-accent hover:bg-accent/90">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Chat Only */}
      <section 
        className="min-h-screen relative overflow-hidden flex items-center justify-center transition-all duration-500"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Theme-reactive overlays */}
        <div className="absolute inset-0 bg-background/40 dark:bg-background/70 transition-all duration-500"></div>
        <div className="absolute inset-0 gradient-hero opacity-60 dark:opacity-80 transition-all duration-500"></div>
        
        {/* Floating Bubbles Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-white/10 dark:bg-foreground/5 backdrop-blur-sm animate-float transition-colors duration-500"></div>
          <div className="absolute top-40 right-32 w-24 h-24 rounded-full bg-white/10 dark:bg-foreground/5 backdrop-blur-sm animate-float-delayed transition-colors duration-500"></div>
          <div className="absolute bottom-40 left-40 w-40 h-40 rounded-full bg-white/10 dark:bg-foreground/5 backdrop-blur-sm animate-float transition-colors duration-500"></div>
          <div className="absolute bottom-32 right-20 w-28 h-28 rounded-full bg-white/10 dark:bg-foreground/5 backdrop-blur-sm animate-float-delayed transition-colors duration-500"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <LandingChat />
        </div>
      </section>

    </div>
  );
};

export default Landing;
