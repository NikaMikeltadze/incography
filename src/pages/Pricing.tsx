import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import logo from "@/assets/incography-logo.png";

const Pricing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with peer support",
      features: [
        "Join up to 3 support bubbles",
        "Anonymous participation",
        "Real-time chat",
        "AI-powered matching",
        "Crisis resources access",
        "Mobile & desktop access",
      ],
      cta: "Get Started Free",
      popular: false,
    },
    {
      name: "Plus",
      price: "$9.99",
      period: "per month",
      description: "Enhanced features for deeper engagement",
      features: [
        "Everything in Free",
        "Join unlimited bubbles",
        "Create your own bubbles",
        "Priority matching",
        "Advanced privacy controls",
        "Ad-free experience",
        "Priority support",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Professional",
      price: "$49.99",
      period: "per month",
      description: "For mental health professionals",
      features: [
        "Everything in Plus",
        "Moderate multiple bubbles",
        "Professional dashboard",
        "Analytics & insights",
        "Crisis intervention tools",
        "Continuing education",
        "Professional badge",
        "Dedicated support",
      ],
      cta: "Apply Now",
      popular: false,
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
            <img src={logo} alt="Incography" className="w-8 h-8" />
            <span>Incography</span>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <button onClick={() => navigate("/features")} className="text-foreground hover:text-primary transition-colors">Features</button>
            <button onClick={() => navigate("/how-it-works")} className="text-foreground hover:text-primary transition-colors">How It Works</button>
            <button onClick={() => navigate("/professionals")} className="text-foreground hover:text-primary transition-colors">Professionals</button>
            <button onClick={() => navigate("/pricing")} className="text-primary font-medium">Pricing</button>
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
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the plan that works best for you. All plans include our core features to help you find support.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index}
                className={`relative hover:shadow-xl transition-all duration-300 ${
                  plan.popular ? 'border-primary shadow-lg scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-2">/ {plan.period}</span>
                  </div>
                  <CardDescription className="text-base">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <Button 
                    className="w-full mb-6"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => navigate("/auth")}
                  >
                    {plan.cta}
                  </Button>
                  
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I try Plus before committing?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes! We offer a 14-day free trial for Plus. No credit card required. Cancel anytime.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We accept all major credit cards, PayPal, and Apple Pay for your convenience.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Is my data secure?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Absolutely. We use bank-level encryption and never share your personal information. Your anonymity and privacy are our top priorities.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I cancel anytime?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes, you can cancel your subscription at any time. No questions asked, no cancellation fees.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-20 text-center">
            <Card className="max-w-3xl mx-auto bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardHeader>
                <CardTitle className="text-3xl mb-4">Still Have Questions?</CardTitle>
                <CardDescription className="text-lg">
                  Our support team is here to help you find the right plan for your needs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  size="lg" 
                  onClick={() => navigate("/auth")}
                  className="text-lg px-8 py-6"
                >
                  Get Started Today
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
