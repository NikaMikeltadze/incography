-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create user_roles table for role-based access
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create bubbles (support groups) table
CREATE TABLE public.bubbles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  topic TEXT,
  max_members INTEGER DEFAULT 6,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.bubbles ENABLE ROW LEVEL SECURITY;

-- Create bubble_members table
CREATE TABLE public.bubble_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bubble_id UUID REFERENCES public.bubbles(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE (bubble_id, user_id)
);

ALTER TABLE public.bubble_members ENABLE ROW LEVEL SECURITY;

-- Create posts table
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bubble_id UUID REFERENCES public.bubbles(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Create chat_messages table
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bubble_id UUID REFERENCES public.bubbles(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'display_name'
  );
  
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bubbles_updated_at
  BEFORE UPDATE ON public.bubbles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for bubbles
CREATE POLICY "Users can view active bubbles"
  ON public.bubbles FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can create bubbles"
  ON public.bubbles FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators and admins can update bubbles"
  ON public.bubbles FOR UPDATE
  USING (
    auth.uid() = created_by OR 
    public.has_role(auth.uid(), 'admin')
  );

-- RLS Policies for bubble_members
CREATE POLICY "Users can view bubble members"
  ON public.bubble_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bubble_members bm
      WHERE bm.bubble_id = bubble_members.bubble_id
        AND bm.user_id = auth.uid()
        AND bm.is_active = true
    )
  );

CREATE POLICY "Users can join bubbles"
  ON public.bubble_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave bubbles"
  ON public.bubble_members FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for posts
CREATE POLICY "Bubble members can view posts"
  ON public.posts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bubble_members bm
      WHERE bm.bubble_id = posts.bubble_id
        AND bm.user_id = auth.uid()
        AND bm.is_active = true
    )
  );

CREATE POLICY "Bubble members can create posts"
  ON public.posts FOR INSERT
  WITH CHECK (
    auth.uid() = author_id AND
    EXISTS (
      SELECT 1 FROM public.bubble_members bm
      WHERE bm.bubble_id = posts.bubble_id
        AND bm.user_id = auth.uid()
        AND bm.is_active = true
    )
  );

CREATE POLICY "Authors can update own posts"
  ON public.posts FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Authors and admins can delete posts"
  ON public.posts FOR DELETE
  USING (
    auth.uid() = author_id OR
    public.has_role(auth.uid(), 'admin')
  );

-- RLS Policies for chat_messages
CREATE POLICY "Bubble members can view messages"
  ON public.chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bubble_members bm
      WHERE bm.bubble_id = chat_messages.bubble_id
        AND bm.user_id = auth.uid()
        AND bm.is_active = true
    )
  );

CREATE POLICY "Bubble members can send messages"
  ON public.chat_messages FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.bubble_members bm
      WHERE bm.bubble_id = chat_messages.bubble_id
        AND bm.user_id = auth.uid()
        AND bm.is_active = true
    )
  );

-- Enable realtime for chat_messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;