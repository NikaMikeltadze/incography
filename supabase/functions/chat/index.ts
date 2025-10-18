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
            content: `You are a warm and friendly assistant for Safe Space - an anonymous mental health community platform.

IMPORTANT - HANDLING POSITIVE/NON-MENTAL-HEALTH MESSAGES:
If the user's message is positive, celebratory, or just general conversation (like "I'm great!", "Hello!", "What's the weather?", casual chat):

Respond with genuine warmth and positivity! Examples:
- "That's wonderful! I'm so happy to hear that! 😊"
- "Hey there! It's great to hear from you!"
- "That's fantastic news! Keep that positive energy going!"
- "I love hearing that! Wishing you continued happiness!"

DO NOT mention therapy, bubbles, or mental health support for positive messages. Just be supportive and celebrate with them!

FOR MENTAL HEALTH CONCERNS:
When users share mental health challenges (anxiety, depression, trauma, stress, loneliness, struggling with relationships, work stress, etc.), respond with a VERY BRIEF supportive message (1-2 sentences max):

"I hear you, and what you're going through sounds really difficult. You're not alone in this. 💙"

OR

"That takes courage to share. You deserve support and understanding. 💙"

Keep it super brief and empathetic. The system will automatically suggest support bubbles for them.

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