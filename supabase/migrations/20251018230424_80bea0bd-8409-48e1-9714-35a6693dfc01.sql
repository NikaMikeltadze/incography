-- Drop and recreate all policies with proper TO authenticated clause
-- This fixes the RLS policy violation issue

-- bubble_members policies
DROP POLICY IF EXISTS "Users can join bubbles" ON public.bubble_members;
DROP POLICY IF EXISTS "Users can view bubble members" ON public.bubble_members;
DROP POLICY IF EXISTS "Users can view own memberships" ON public.bubble_members;
DROP POLICY IF EXISTS "Users can leave bubbles" ON public.bubble_members;

CREATE POLICY "Users can join bubbles" 
ON public.bubble_members 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view bubble members" 
ON public.bubble_members 
FOR SELECT 
TO authenticated
USING (is_bubble_member(auth.uid(), bubble_id) OR auth.uid() = user_id);

CREATE POLICY "Users can leave bubbles" 
ON public.bubble_members 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

-- posts policies
DROP POLICY IF EXISTS "Bubble members can create posts" ON public.posts;
DROP POLICY IF EXISTS "Bubble members can view posts" ON public.posts;
DROP POLICY IF EXISTS "Authors can update own posts" ON public.posts;
DROP POLICY IF EXISTS "Authors and admins can delete posts" ON public.posts;

CREATE POLICY "Bubble members can create posts" 
ON public.posts 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = author_id AND is_bubble_member(auth.uid(), bubble_id));

CREATE POLICY "Bubble members can view posts" 
ON public.posts 
FOR SELECT 
TO authenticated
USING (is_bubble_member(auth.uid(), bubble_id));

CREATE POLICY "Authors can update own posts" 
ON public.posts 
FOR UPDATE 
TO authenticated
USING (auth.uid() = author_id);

CREATE POLICY "Authors and admins can delete posts" 
ON public.posts 
FOR DELETE 
TO authenticated
USING (auth.uid() = author_id OR has_role(auth.uid(), 'admin'));

-- chat_messages policies
DROP POLICY IF EXISTS "Bubble members can send messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Bubble members can view messages" ON public.chat_messages;

CREATE POLICY "Bubble members can send messages" 
ON public.chat_messages 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id AND is_bubble_member(auth.uid(), bubble_id));

CREATE POLICY "Bubble members can view messages" 
ON public.chat_messages 
FOR SELECT 
TO authenticated
USING (is_bubble_member(auth.uid(), bubble_id));

-- bubbles policies
DROP POLICY IF EXISTS "Users can view active bubbles" ON public.bubbles;
DROP POLICY IF EXISTS "Users can create bubbles" ON public.bubbles;
DROP POLICY IF EXISTS "Creators and admins can update bubbles" ON public.bubbles;

CREATE POLICY "Users can view active bubbles" 
ON public.bubbles 
FOR SELECT 
TO authenticated
USING (is_active = true);

CREATE POLICY "Users can create bubbles" 
ON public.bubbles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators and admins can update bubbles" 
ON public.bubbles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = created_by OR has_role(auth.uid(), 'admin'));