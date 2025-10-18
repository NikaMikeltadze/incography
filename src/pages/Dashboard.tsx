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
  Handshake, Plus, User
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import CreatePostModal from "@/components/CreatePostModal";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const posts = [
    {
      id: 1,
      author: "AnonymousPhoenix",
      mood: "😌 Peaceful",
      timeAgo: "2h ago",
      tags: ["#anxiety", "#progress"],
      content: "Today was a good day. I managed to go outside without feeling overwhelmed. Small steps matter! 🌱",
      supportCount: 24,
      relateCount: 18,
      commentCount: 7
    },
    {
      id: 2,
      author: "HopefulStar",
      mood: "🌱 Hopeful",
      timeAgo: "4h ago",
      tags: ["#depression", "#victory"],
      content: "First therapy session done. It was scary but I'm proud of myself for showing up.",
      supportCount: 42,
      relateCount: 31,
      commentCount: 12
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full bg-card border-b z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-2xl font-bold text-primary cursor-pointer" onClick={() => navigate("/")}>
            🛡️ <span>Safe Space</span>
          </div>
          <div className="hidden md:flex gap-6 items-center">
            <Button variant="ghost" className="gap-2">
              <Home className="w-5 h-5" />
              Home
            </Button>
            <Button variant="ghost" className="gap-2">
              <Users className="w-5 h-5" />
              Bubbles
            </Button>
            <Button variant="ghost" className="gap-2">
              <Newspaper className="w-5 h-5" />
              Feed
            </Button>
            <Button variant="ghost" className="gap-2">
              <MessageCircle className="w-5 h-5" />
              Messages
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full">
              <Flame className="w-5 h-5 text-warning" />
              <span className="font-semibold">850</span>
            </div>
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
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
                <Button variant="link" className="w-full p-0 h-auto">
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
                <Button variant="outline" className="w-full justify-start gap-2">
                  <UserCheck className="w-4 h-4" />
                  Request Help
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
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
                <TabsTrigger value="explore" className="flex-1">Explore</TabsTrigger>
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
                
                {posts.map((post) => (
                  <Card key={post.id} className="p-6 hover:shadow-soft transition">
                    <div className="flex items-start gap-3 mb-4">
                      <Avatar>
                        <AvatarFallback className="gradient-card text-white">
                          {post.author[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{post.author}</span>
                          <Badge variant="secondary" className="text-xs">
                            {post.mood}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{post.timeAgo}</span>
                        </div>
                        <div className="flex gap-1">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-foreground mb-4">{post.content}</p>
                    <div className="flex items-center gap-6 pt-4 border-t">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Heart className="w-4 h-4 text-red-400" />
                        <span>{post.supportCount} Support</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Handshake className="w-4 h-4 text-primary" />
                        <span>{post.relateCount} Relate</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.commentCount} Comments</span>
                      </Button>
                    </div>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
          
          {/* RIGHT SIDEBAR */}
          <div className="col-span-12 md:col-span-3 space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Your Bubbles</h3>
                <Badge>2</Badge>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full gradient-card flex items-center justify-center">
                      <Users className="text-white text-sm" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">Anxiety Warriors</h4>
                      <p className="text-xs text-muted-foreground">6 members • 3 new</p>
                    </div>
                  </div>
                  <Button size="sm" className="w-full" onClick={() => navigate("/bubble/1")}>
                    Join Chat
                  </Button>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Suggested Bubbles</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-warning" />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">Daily Mindfulness</h4>
                      <p className="text-xs text-muted-foreground mb-2">6 members</p>
                      <div className="flex gap-1">
                        <Badge variant="outline" className="text-xs">#meditation</Badge>
                        <Badge variant="outline" className="text-xs">#peace</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-success font-medium">95% match</span>
                    <Button size="sm" variant="outline">Join</Button>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 gradient-card text-white">
              <UserCheck className="w-8 h-8 mb-3" />
              <h3 className="font-semibold mb-2">Professional Support</h3>
              <p className="text-sm mb-4 opacity-90">Connect with licensed therapists</p>
              <Button variant="secondary" className="w-full">
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
      />
    </div>
  );
};

export default Dashboard;
