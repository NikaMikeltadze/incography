import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Heart, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("AnonymousPhoenix42");
  const navigate = useNavigate();

  const generateUsername = () => {
    const adjectives = ["Anonymous", "Peaceful", "Hopeful", "Brave", "Gentle", "Strong"];
    const nouns = ["Phoenix", "Star", "Soul", "Spirit", "Heart", "Warrior"];
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNum = Math.floor(Math.random() * 100);
    setUsername(`${randomAdj}${randomNoun}${randomNum}`);
  };

  const completeOnboarding = () => {
    navigate("/dashboard");
  };

  const progress = (step / 3) * 100;

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full p-8 shadow-elevated">
        <Progress value={progress} className="mb-8" />
        
        {step === 1 && (
          <div className="text-center animate-fade-in">
            <Heart className="w-20 h-20 text-accent mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-3">Welcome to Incography</h1>
            <p className="text-muted-foreground mb-8">All information is optional for complete anonymity</p>
            <Button onClick={() => setStep(2)} className="w-full" size="lg">
              Continue
            </Button>
          </div>
        )}
        
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-4">Background Info (Optional)</h2>
            <p className="text-sm text-muted-foreground mb-6">Helps us match you better, but you can skip</p>
            <form className="space-y-6">
              <div>
                <Label htmlFor="age">Age Range</Label>
                <Select>
                  <SelectTrigger id="age">
                    <SelectValue placeholder="Prefer not to say" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Prefer not to say</SelectItem>
                    <SelectItem value="13-17">13-17</SelectItem>
                    <SelectItem value="18-24">18-24</SelectItem>
                    <SelectItem value="25-34">25-34</SelectItem>
                    <SelectItem value="35-44">35-44</SelectItem>
                    <SelectItem value="45-54">45-54</SelectItem>
                    <SelectItem value="55+">55+</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2 mt-2">
                  <Checkbox id="age-private" />
                  <label htmlFor="age-private" className="text-sm text-muted-foreground">Keep this private</label>
                </div>
              </div>
              
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Prefer not to say" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Prefer not to say</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2 mt-2">
                  <Checkbox id="gender-private" />
                  <label htmlFor="gender-private" className="text-sm text-muted-foreground">Keep this private</label>
                </div>
              </div>
              
              <div>
                <Label htmlFor="country">Country/Region</Label>
                <Select>
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Prefer not to say" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Prefer not to say</SelectItem>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2 mt-2">
                  <Checkbox id="country-private" />
                  <label htmlFor="country-private" className="text-sm text-muted-foreground">Keep this private</label>
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email (for recovery only)</Label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="your@email.com" 
                />
                <p className="text-xs text-muted-foreground mt-1">🔒 Never shared</p>
              </div>
            </form>
            <div className="flex gap-4 mt-8">
              <Button variant="outline" onClick={() => setStep(3)}>Skip All</Button>
              <Button onClick={() => setStep(3)} className="flex-1">Continue</Button>
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Create Anonymous Profile</h2>
            <div className="text-center mb-6">
              <div className="w-24 h-24 rounded-full gradient-card mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold">
                {username[0]}
              </div>
              <p className="text-sm text-muted-foreground mb-3">Choose your avatar color</p>
              <div className="grid grid-cols-6 gap-3 mb-6 max-w-md mx-auto">
                {[
                  "from-primary to-secondary",
                  "from-accent to-warning",
                  "from-success to-primary",
                  "from-secondary to-accent",
                  "from-warning to-success",
                  "from-primary to-accent"
                ].map((gradient, i) => (
                  <div 
                    key={i} 
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${gradient} cursor-pointer hover:scale-110 transition`}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="username">Anonymous Username</Label>
                <div className="flex gap-2">
                  <Input 
                    id="username"
                    value={username} 
                    readOnly 
                    className="flex-1" 
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={generateUsername}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="mood">Mood Badge (Optional)</Label>
                <Select>
                  <SelectTrigger id="mood">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="hopeful">🌱 Hopeful</SelectItem>
                    <SelectItem value="struggling">😔 Struggling</SelectItem>
                    <SelectItem value="grateful">🙏 Grateful</SelectItem>
                    <SelectItem value="anxious">😰 Anxious</SelectItem>
                    <SelectItem value="peaceful">😌 Peaceful</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={completeOnboarding} className="w-full mt-8" size="lg">
              Enter Your Space →
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Onboarding;
