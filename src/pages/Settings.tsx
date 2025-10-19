import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, User, Bell, Shield, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";
import { toast } from "sonner";
import logo from "@/assets/incography-logo.png";
import { useState } from "react";

const Settings = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [anonymous, setAnonymous] = useState(true);

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="fixed top-0 w-full bg-card border-b z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2 text-2xl font-bold text-primary">
              <img src={logo} alt="Incography" className="w-8 h-8" />
              <span>Settings</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 pt-24 pb-12 max-w-3xl">
        <div className="space-y-6">
          {/* Appearance */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              {theme === "dark" ? (
                <Moon className="w-5 h-5 text-primary" />
              ) : (
                <Sun className="w-5 h-5 text-primary" />
              )}
              <div>
                <h3 className="font-semibold text-lg">Appearance</h3>
                <p className="text-sm text-muted-foreground">Customize how Incography looks</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="theme">Dark Mode</Label>
                <Switch
                  id="theme"
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
              </div>
            </div>
          </Card>

          {/* Privacy */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-5 h-5 text-primary" />
              <div>
                <h3 className="font-semibold text-lg">Privacy & Safety</h3>
                <p className="text-sm text-muted-foreground">Control your privacy settings</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="anonymous">Post Anonymously by Default</Label>
                  <p className="text-xs text-muted-foreground">Hide your identity in posts</p>
                </div>
                <Switch
                  id="anonymous"
                  checked={anonymous}
                  onCheckedChange={setAnonymous}
                />
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-5 h-5 text-primary" />
              <div>
                <h3 className="font-semibold text-lg">Notifications</h3>
                <p className="text-sm text-muted-foreground">Manage notification preferences</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Push Notifications</Label>
                  <p className="text-xs text-muted-foreground">Get notified about new messages</p>
                </div>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
            </div>
          </Card>

          {/* Account */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-primary" />
              <div>
                <h3 className="font-semibold text-lg">Account</h3>
                <p className="text-sm text-muted-foreground">Manage your account settings</p>
              </div>
            </div>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => toast.info("Profile editing coming soon!")}
              >
                Edit Profile
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => toast.info("Password change coming soon!")}
              >
                Change Password
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => toast.info("Account deletion requires contacting support")}
              >
                Delete Account
              </Button>
            </div>
          </Card>

          <Button 
            className="w-full" 
            size="lg"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
