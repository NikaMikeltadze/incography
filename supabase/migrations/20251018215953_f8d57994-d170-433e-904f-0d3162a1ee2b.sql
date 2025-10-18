-- Drop the problematic SELECT policy
DROP POLICY IF EXISTS "Users can view bubble members" ON public.bubble_members;

-- Create a security definer function to check bubble membership
CREATE OR REPLACE FUNCTION public.is_bubble_member(_user_id uuid, _bubble_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.bubble_members
    WHERE user_id = _user_id
      AND bubble_id = _bubble_id
      AND is_active = true
  )
$$;

-- Recreate the SELECT policy using the security definer function
CREATE POLICY "Users can view bubble members"
ON public.bubble_members
FOR SELECT
USING (public.is_bubble_member(auth.uid(), bubble_id));