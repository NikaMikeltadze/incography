import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const useMyBubbles = () => {
  const { user } = useAuth();

  const { data: myBubbles, isLoading } = useQuery({
    queryKey: ['my-bubbles', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('bubble_members')
        .select(`
          bubble_id,
          bubbles (
            id,
            name,
            description,
            topic
          )
        `)
        .eq('user_id', user.id)
        .eq('is_active', true);
      
      if (error) throw error;
      return data?.map(item => item.bubbles).filter(Boolean) || [];
    },
    enabled: !!user,
  });

  return {
    myBubbles,
    isLoading,
  };
};
