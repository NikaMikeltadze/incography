import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const usePosts = (bubbleId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts', bubbleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('bubble_id', bubbleId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const createPost = useMutation({
    mutationFn: async ({ content, isAnonymous }: { content: string; isAnonymous: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('posts')
        .insert({ 
          bubble_id: bubbleId, 
          author_id: user.id, 
          content,
          is_anonymous: isAnonymous 
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', bubbleId] });
      toast({
        title: "Success",
        description: "Post created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updatePost = useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      const { data, error } = await supabase
        .from('posts')
        .update({ content })
        .eq('id', postId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', bubbleId] });
      toast({
        title: "Success",
        description: "Post updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deletePost = useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', bubbleId] });
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    posts,
    isLoading,
    createPost: createPost.mutate,
    isCreating: createPost.isPending,
    updatePost: updatePost.mutate,
    isUpdating: updatePost.isPending,
    deletePost: deletePost.mutate,
    isDeleting: deletePost.isPending,
  };
};