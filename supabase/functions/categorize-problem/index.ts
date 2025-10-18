import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { problem } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables');
    }

    console.log('Categorizing problem:', problem);

    // Get all bubbles from database
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: bubbles, error: bubblesError } = await supabase
      .from('bubbles')
      .select('id, name, description, topic')
      .eq('is_active', true);

    if (bubblesError) throw bubblesError;

    // Use AI to categorize and suggest bubbles
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { 
            role: 'system', 
            content: `You are a mental health categorization assistant. Analyze the user's problem and suggest the most relevant support bubbles.

Available bubbles (you MUST use these exact IDs):
${bubbles?.map(b => `ID: ${b.id}, Name: ${b.name}, Topic: ${b.topic}, Description: ${b.description}`).join('\n')}

CRITICAL: You MUST ONLY use bubble IDs from the list above. DO NOT make up new IDs or use category names as IDs.

Your task:
1. Identify the main mental health topics/concerns in the user's message
2. Select up to 3 most relevant bubbles from the available bubbles above
3. Use the EXACT IDs from the available bubbles list
4. Respond ONLY with a JSON object in this exact format (no markdown, no code blocks):
{
  "categories": ["topic1", "topic2"],
  "suggestedBubbles": [
    {
      "id": "ACTUAL_UUID_FROM_AVAILABLE_BUBBLES",
      "name": "Exact Bubble Name",
      "reason": "Brief reason why this bubble is relevant"
    }
  ],
  "encouragement": "A brief, warm message encouraging them to join these bubbles"
}

IMPORTANT: The "id" field MUST be one of the UUIDs from the available bubbles list above. Never invent new IDs.

Be empathetic and understanding. If the message indicates crisis, include that in your response.`
          },
          { role: 'user', content: problem }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI categorization failed');
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('AI Response:', aiResponse);

    // Parse the AI response
    let result;
    try {
      result = JSON.parse(aiResponse);
    } catch (e) {
      console.error('Failed to parse AI response:', aiResponse);
      // Fallback response
      result = {
        categories: ['general'],
        suggestedBubbles: bubbles?.slice(0, 3).map(b => ({
          id: b.id,
          name: b.name,
          reason: 'This bubble might be helpful for you'
        })) || [],
        encouragement: 'We have several supportive communities that might help you.'
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Categorization error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});