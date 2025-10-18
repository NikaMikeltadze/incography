import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Home, Users, Newspaper, MessageCircle, Bell, Settings, 
  Flame, Activity, Edit, UserCheck, Compass, Heart, 
  Handshake, Plus, LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import CreatePostModal from "@/components/CreatePostModal";
import { useBubbles } from "@/hooks/useBubbles";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { usePosts } from "@/hooks/usePosts";
import PostCard from "@/components/PostCard";
import { toast } from "sonner";
import { useMyBubbles } from "@/hooks/useMyBubbles";

const Dashboard = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { bubbles, isLoading, joinBubble, isJoining } = useBubbles();
  const { myBubbles, isLoading: myBubblesLoading } = useMyBubbles();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedBubbleId, setSelectedBubbleId] = useState<string | null>(null);
  
  // Use selected bubble or first joined bubble
  const activeBubbleId = selectedBubbleId || myBubbles?.[0]?.id || null;
  const { posts, isLoading: postsLoading } = usePosts(activeBubbleId || "");

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleRequestHelp = () => {
    toast.info("This feature will connect you with crisis support resources");
  };

  const handleBrowsePosts = () => {
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleViewLeaderboard = () => {
    toast.info("Leaderboard feature coming soon!");
  };

  const handleBookSession = () => {
    toast.info("Professional support booking coming soon!");
  };

  const handleNotifications = () => {
    toast.info("No new notifications");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full bg-card border-b z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-2xl font-bold text-primary cursor-pointer" onClick={() => navigate("/")}>
            🛡️ <span>Incotheraphy</span>
          </div>
          <div className="hidden md:flex gap-6 items-center">
            <Button 
              variant="ghost" 
              className="gap-2"
              onClick={() => navigate("/dashboard")}
            >
              <Home className="w-5 h-5" />
              Home
            </Button>
            <Button 
              variant="ghost" 
              className="gap-2"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <Users className="w-5 h-5" />
              Bubbles
            </Button>
            <Button 
              variant="ghost" 
              className="gap-2"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <Newspaper className="w-5 h-5" />
              Feed
            </Button>
            <Button 
              variant="ghost" 
              className="gap-2"
              onClick={() => {
                if (bubbles && bubbles.length > 0) {
                  navigate(`/bubble/${bubbles[0].id}`);
                } else {
                  toast.info("Join a bubble first to access messages");
                }
              }}
            >
              <MessageCircle className="w-5 h-5" />
              Messages
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-950 rounded-full">
              <Flame className="w-5 h-5 text-warning" />
              <span className="font-semibold">850</span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleNotifications}>
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 pt-24 pb-12">
        <div className="grid grid-cols-12 gap-6">
          
          {/* LEFT SIDEBAR */}
          <div className="col-span-12 md:col-span-3 space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Your Activity
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Streak</span>
                  <span className="font-bold text-lg">🔥 12 days</span>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Points</span>
                    <span className="font-semibold">850</span>
                  </div>
                  <Progress value={85} className="mb-1" />
                  <p className="text-xs text-muted-foreground">150 to next reward</p>
                </div>
                <Button 
                  variant="link" 
                  className="w-full p-0 h-auto"
                  onClick={handleViewLeaderboard}
                >
                  View Leaderboard →
                </Button>
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <Edit className="w-4 h-4" />
                  Share Thoughts
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={handleRequestHelp}
                >
                  <UserCheck className="w-4 h-4" />
                  Request Help
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={handleBrowsePosts}
                >
                  <Compass className="w-4 h-4" />
                  Browse Posts
                </Button>
              </div>
            </Card>
          </div>
          
          {/* CENTER FEED */}
          <div className="col-span-12 md:col-span-6 space-y-6">
            <Tabs defaultValue="for-you">
              <TabsList className="w-full">
                <TabsTrigger value="for-you" className="flex-1">For You</TabsTrigger>
                <TabsTrigger value="bubbles" className="flex-1">My Bubbles</TabsTrigger>
              </TabsList>
              
              <TabsContent value="for-you" className="space-y-6 mt-6">
                <Card 
                  className="p-4 cursor-pointer hover:shadow-soft transition"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback className="gradient-card text-white">
                        A
                      </AvatarFallback>
                    </Avatar>
                    <span className="flex-1 text-muted-foreground">What's on your mind?</span>
                    <Edit className="w-5 h-5 text-primary" />
                  </div>
                </Card>
                
                {!activeBubbleId ? (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground mb-4">Join a bubble to see posts and start connecting!</p>
                    <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                      Browse Bubbles
                    </Button>
                  </Card>
                ) : postsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-48 w-full" />
                    ))}
                  </div>
                ) : posts && posts.length > 0 ? (
                  posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))
                ) : (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="bubbles" className="space-y-6 mt-6">
                {myBubblesLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : myBubbles && myBubbles.length > 0 ? (
                  <div className="space-y-3">
                    {myBubbles.map((bubble: any) => (
                      <Card 
                        key={bubble.id} 
                        className={`p-4 cursor-pointer transition ${
                          activeBubbleId === bubble.id ? 'border-primary bg-primary/5' : 'hover:shadow-soft'
                        }`}
                        onClick={() => setSelectedBubbleId(bubble.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{bubble.name}</h4>
                            <p className="text-sm text-muted-foreground">{bubble.description}</p>
                          </div>
                          <Badge variant="outline">#{bubble.topic}</Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground mb-4">You haven't joined any bubbles yet</p>
                    <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                      Browse Bubbles
                    </Button>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          {/* RIGHT SIDEBAR */}
          <div className="col-span-12 md:col-span-3 space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Discover Bubbles</h3>
                <Badge>{bubbles?.length || 0}</Badge>
              </div>
              
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {bubbles?.slice(0, 5).map((bubble) => (
                    <div key={bubble.id} className="border rounded-lg p-3">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full gradient-card flex items-center justify-center">
                          <Users className="text-white text-sm" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{bubble.name}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {bubble.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1 mb-2">
                        <Badge variant="outline" className="text-xs">
                          #{bubble.topic}
                        </Badge>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => joinBubble(bubble.id)}
                        disabled={isJoining}
                      >
                        {isJoining ? 'Joining...' : 'Join Bubble'}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              <Button 
                variant="link" 
                className="w-full mt-3"
                onClick={() => navigate("/suggestions")}
              >
                Find My Perfect Bubbles →
              </Button>
            </Card>
            
            <Card className="p-6 gradient-card text-white">
              <UserCheck className="w-8 h-8 mb-3" />
              <h3 className="font-semibold mb-2">Professional Support</h3>
              <p className="text-sm mb-4 opacity-90">Connect with licensed therapists</p>
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={handleBookSession}
              >
                Book Session
              </Button>
            </Card>
          </div>
        </div>
      </div>
      
      <Button 
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-accent shadow-elevated hover:bg-accent/90"
        size="icon"
        onClick={() => setIsCreateModalOpen(true)}
      >
        <Plus className="text-white" />
      </Button>

      <CreatePostModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        bubbleId={activeBubbleId}
        myBubbles={myBubbles || []}
      />
    </div>
  );
};

export default Dashboard;
