import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useLeaveBubble = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const leaveBubble = useMutation({
    mutationFn: async (bubbleId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('bubble_members')
        .update({ is_active: false })
        .eq('bubble_id', bubbleId)
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bubbles'] });
      queryClient.invalidateQueries({ queryKey: ['bubbles'] });
      toast({
        title: "Success",
        description: "Left bubble successfully",
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
    leaveBubble: leaveBubble.mutate,
    isLeaving: leaveBubble.isPending,
  };
};
