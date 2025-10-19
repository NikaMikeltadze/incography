import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Create admin client with service role key
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Get the authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Check if user is admin
    const { data: roles, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (roleError || !roles) {
      console.log('User is not admin:', user.id);
      return new Response(
        JSON.stringify({ error: 'Only admins can clear the database' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Starting database clear operation by admin:', user.id);

    // Delete in correct order to respect foreign key constraints
    
    // 1. Delete chat messages
    const { error: chatError } = await supabaseAdmin
      .from('chat_messages')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    
    if (chatError) {
      console.error('Error deleting chat messages:', chatError);
      throw chatError;
    }
    console.log('✓ Deleted all chat messages');

    // 2. Delete posts
    const { error: postsError } = await supabaseAdmin
      .from('posts')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    
    if (postsError) {
      console.error('Error deleting posts:', postsError);
      throw postsError;
    }
    console.log('✓ Deleted all posts');

    // 3. Delete bubble members
    const { error: membersError } = await supabaseAdmin
      .from('bubble_members')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    
    if (membersError) {
      console.error('Error deleting bubble members:', membersError);
      throw membersError;
    }
    console.log('✓ Deleted all bubble members');

    // 4. Delete bubbles
    const { error: bubblesError } = await supabaseAdmin
      .from('bubbles')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    
    if (bubblesError) {
      console.error('Error deleting bubbles:', bubblesError);
      throw bubblesError;
    }
    console.log('✓ Deleted all bubbles');

    // 5. Delete user roles (except the admin making the request)
    const { error: rolesError } = await supabaseAdmin
      .from('user_roles')
      .delete()
      .neq('user_id', user.id); // Keep admin's role
    
    if (rolesError) {
      console.error('Error deleting user roles:', rolesError);
      throw rolesError;
    }
    console.log('✓ Deleted all user roles (except current admin)');

    // 6. Delete all profiles (except the admin making the request)
    const { error: profilesError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .neq('id', user.id); // Keep admin's profile
    
    if (profilesError) {
      console.error('Error deleting profiles:', profilesError);
      throw profilesError;
    }
    console.log('✓ Deleted all profiles (except current admin)');

    // 7. Delete all auth users (except the admin making the request)
    // Get all users first
    const { data: allUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing users:', listError);
      throw listError;
    }

    // Delete each user except the current admin
    let deletedCount = 0;
    for (const u of allUsers.users) {
      if (u.id !== user.id) {
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(u.id);
        if (deleteError) {
          console.error(`Error deleting user ${u.id}:`, deleteError);
        } else {
          deletedCount++;
        }
      }
    }
    console.log(`✓ Deleted ${deletedCount} auth users (kept current admin)`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Database cleared successfully',
        details: {
          usersDeleted: deletedCount,
          note: 'Your admin account was preserved'
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error clearing database:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
