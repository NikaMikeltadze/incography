import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, User, Bell, Shield, Moon, Sun, Database, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";
import { toast } from "sonner";
import logo from "@/assets/incography-logo.png";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Settings = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { session } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [anonymous, setAnonymous] = useState(true);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  const handleClearDatabase = async () => {
    if (!session) {
      toast.error("You must be logged in to perform this action");
      return;
    }

    setIsClearing(true);
    try {
      const { data, error } = await supabase.functions.invoke('clear-database');
      
      if (error) throw error;

      toast.success("Database cleared successfully!");
      setShowClearDialog(false);
      
      // Optionally reload the page after a delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error clearing database:', error);
      toast.error(error instanceof Error ? error.message : "Failed to clear database");
    } finally {
      setIsClearing(false);
    }
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

          {/* Developer Tools */}
          <Card className="p-6 border-destructive/50">
            <div className="flex items-center gap-3 mb-6">
              <Database className="w-5 h-5 text-destructive" />
              <div>
                <h3 className="font-semibold text-lg text-destructive">Developer Tools</h3>
                <p className="text-sm text-muted-foreground">Dangerous operations - use with caution</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-destructive mb-1">Warning: Irreversible Action</p>
                    <p className="text-muted-foreground">
                      This will permanently delete all users (except you), posts, chat messages, bubbles, and related data. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              <Button 
                variant="destructive" 
                className="w-full justify-start"
                onClick={() => setShowClearDialog(true)}
                disabled={isClearing}
              >
                {isClearing ? "Clearing..." : "Clear All Database Data"}
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

      {/* Clear Database Confirmation Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Clear Database?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>All users (except your admin account)</li>
                <li>All posts and comments</li>
                <li>All chat messages</li>
                <li>All bubbles</li>
                <li>All user data and profiles</li>
              </ul>
              <p className="mt-3 font-semibold text-destructive">
                This action cannot be undone. Are you absolutely sure?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isClearing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearDatabase}
              disabled={isClearing}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isClearing ? "Clearing..." : "Yes, Clear Everything"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Settings;
