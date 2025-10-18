-- Fix RLS policies for bubble_members to ensure users can properly join bubbles
DROP POLICY IF EXISTS "Users can join bubbles" ON public.bubble_members;
CREATE POLICY "Users can join bubbles" 
ON public.bubble_members 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Ensure users can view their own memberships
DROP POLICY IF EXISTS "Users can view bubble members" ON public.bubble_members;
CREATE POLICY "Users can view bubble members" 
ON public.bubble_members 
FOR SELECT 
TO authenticated
USING (is_bubble_member(auth.uid(), bubble_id));

-- Add policy to allow users to view their own memberships
CREATE POLICY "Users can view own memberships" 
ON public.bubble_members 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Ensure leave policy is correct
DROP POLICY IF EXISTS "Users can leave bubbles" ON public.bubble_members;
CREATE POLICY "Users can leave bubbles" 
ON public.bubble_members 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

-- Fix posts table policies to ensure proper access
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

-- Fix chat_messages table policies
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

-- Ensure bubbles table policies are correct
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