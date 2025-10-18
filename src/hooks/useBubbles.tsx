import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useBubbles = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: bubbles, isLoading } = useQuery({
    queryKey: ['bubbles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bubbles')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const createBubble = useMutation({
    mutationFn: async (bubble: { name: string; description?: string; topic?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('bubbles')
        .insert({ ...bubble, created_by: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bubbles'] });
      toast({
        title: "Success",
        description: "Bubble created successfully",
      });
    },
    onError: (error) => {
      if (error.message === 'Not authenticated') {
        toast({
          title: "Login Required",
          description: "Please login or register to create bubbles",
        });
        setTimeout(() => {
          window.location.href = '/auth';
        }, 1500);
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

  const joinBubble = useMutation({
    mutationFn: async (bubbleId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('bubble_members')
        .insert({ bubble_id: bubbleId, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bubbles'] });
      queryClient.invalidateQueries({ queryKey: ['my-bubbles'] });
      toast({
        title: "Success",
        description: "Joined bubble successfully",
      });
    },
    onError: (error) => {
      if (error.message === 'Not authenticated') {
        toast({
          title: "Login Required",
          description: "Please login or register to join bubbles",
        });
        // Redirect to auth page after a short delay
        setTimeout(() => {
          window.location.href = '/auth';
        }, 1500);
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

  return {
    bubbles,
    isLoading,
    createBubble: createBubble.mutate,
    isCreating: createBubble.isPending,
    joinBubble: joinBubble.mutate,
    isJoining: joinBubble.isPending,
  };
};