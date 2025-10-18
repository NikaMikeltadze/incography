import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useChatMessages = (bubbleId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['chat-messages', bubbleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('bubble_id', bubbleId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const sendMessage = useMutation({
    mutationFn: async ({ content, isAnonymous }: { content: string; isAnonymous: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('chat_messages')
        .insert({ 
          bubble_id: bubbleId, 
          user_id: user.id, 
          content,
          is_anonymous: isAnonymous 
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`chat-${bubbleId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `bubble_id=eq.${bubbleId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['chat-messages', bubbleId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [bubbleId, queryClient]);

  return {
    messages,
    isLoading,
    sendMessage: sendMessage.mutate,
    isSending: sendMessage.isPending,
  };
};