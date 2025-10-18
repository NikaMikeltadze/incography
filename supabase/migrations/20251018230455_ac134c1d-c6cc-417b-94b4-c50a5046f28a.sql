-- Fix RLS policies by ensuring all policies explicitly target authenticated users
-- This prevents RLS violations when users try to join bubbles

-- Drop and recreate bubble_members INSERT policy with explicit TO authenticated
DROP POLICY IF EXISTS "Users can join bubbles" ON public.bubble_members;
CREATE POLICY "Users can join bubbles" 
ON public.bubble_members 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Drop and recreate bubble_members UPDATE policy  
DROP POLICY IF EXISTS "Users can leave bubbles" ON public.bubble_members;
CREATE POLICY "Users can leave bubbles" 
ON public.bubble_members 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

-- Keep existing SELECT policies for bubble_members
-- They should already be correct

-- Fix bubbles policies to explicitly target authenticated users
DROP POLICY IF EXISTS "Users can view active bubbles" ON public.bubbles;
CREATE POLICY "Users can view active bubbles" 
ON public.bubbles 
FOR SELECT 
TO authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "Users can create bubbles" ON public.bubbles;
CREATE POLICY "Users can create bubbles" 
ON public.bubbles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = created_by);

-- Fix posts policies to explicitly target authenticated users
DROP POLICY IF EXISTS "Bubble members can create posts" ON public.posts;
CREATE POLICY "Bubble members can create posts" 
ON public.posts 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() = author_id 
  AND is_bubble_member(auth.uid(), bubble_id)
);

DROP POLICY IF EXISTS "Bubble members can view posts" ON public.posts;
CREATE POLICY "Bubble members can view posts" 
ON public.posts 
FOR SELECT 
TO authenticated
USING (is_bubble_member(auth.uid(), bubble_id));

-- Fix chat_messages policies to explicitly target authenticated users
DROP POLICY IF EXISTS "Bubble members can send messages" ON public.chat_messages;
CREATE POLICY "Bubble members can send messages" 
ON public.chat_messages 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND is_bubble_member(auth.uid(), bubble_id)
);

DROP POLICY IF EXISTS "Bubble members can view messages" ON public.chat_messages;
CREATE POLICY "Bubble members can view messages" 
ON public.chat_messages 
FOR SELECT 
TO authenticated
USING (is_bubble_member(auth.uid(), bubble_id));