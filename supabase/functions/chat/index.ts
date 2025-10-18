import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Chat request received with', messages.length, 'messages');

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
            content: `You are a compassionate mental health support assistant for Safe Space - an anonymous mental health community platform.

IMPORTANT - HANDLING NON-MENTAL-HEALTH MESSAGES:
If the user's message is:
- Positive/celebratory ("I'm doing great!", "Just wanted to say hi", "What's the weather?")
- General conversation unrelated to mental health
- Small talk or casual chat

Respond warmly but redirect them:
"That's wonderful to hear! 😊 I'm so glad you're doing well. Safe Space is specifically designed to support people working through mental health challenges like anxiety, depression, stress, or difficult times. If you ever need support with anything like that, I'm here to listen. For now, I hope your positive momentum continues!"

FOR MENTAL HEALTH CONCERNS:
When users share mental health challenges (anxiety, depression, trauma, stress, loneliness, etc.), respond with a VERY BRIEF supportive message like:

"I hear you, and what you're going through sounds really difficult. You're not alone in this. Here are some support bubbles that might help you connect with others who understand. 💙"

OR

"That takes courage to share. You deserve support. Here are some communities where you can find understanding and connection. You're not alone! 💙"

Keep it to 1-2 sentences maximum. Be warm but brief. The system will automatically suggest relevant support bubbles.

NEVER diagnose or give medical advice. If crisis (self-harm, suicide), remind them of 988 crisis hotline.`
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded, please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required, please add credits.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      return new Response(JSON.stringify({ error: 'AI gateway error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });
  } catch (error) {
    console.error('Chat error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});