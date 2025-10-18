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

    // Create a mapping of topics/keywords to bubble IDs for fallback
    const topicMap: Record<string, string[]> = {};
    bubbles?.forEach(b => {
      const keywords = [
        b.topic?.toLowerCase(),
        b.name.toLowerCase(),
        ...b.description.toLowerCase().split(' ')
      ].filter(Boolean);
      
      keywords.forEach(keyword => {
        if (!topicMap[keyword]) topicMap[keyword] = [];
        topicMap[keyword].push(b.id);
      });
    });

    // Use AI to categorize and suggest bubbles with strict tool calling
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
            content: `You are a mental health categorization assistant. Analyze the user's problem and suggest relevant support bubbles from the available list.

Available bubbles:
${bubbles?.map(b => `ID: ${b.id}, Name: ${b.name}, Topic: ${b.topic}, Description: ${b.description}`).join('\n')}

Be empathetic and understanding.`
          },
          { role: 'user', content: problem }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "suggest_bubbles",
              description: "Suggest relevant mental health support bubbles based on user's concerns",
              parameters: {
                type: "object",
                properties: {
                  categories: {
                    type: "array",
                    items: { type: "string" },
                    description: "Main mental health topics/concerns identified"
                  },
                  suggestedBubbles: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { 
                          type: "string",
                          description: "MUST be exact UUID from available bubbles list"
                        },
                        name: { type: "string" },
                        reason: { type: "string" }
                      },
                      required: ["id", "name", "reason"]
                    }
                  },
                  encouragement: {
                    type: "string",
                    description: "Brief warm message encouraging them to join"
                  }
                },
                required: ["categories", "suggestedBubbles", "encouragement"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "suggest_bubbles" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI categorization failed');
    }

    const data = await response.json();
    console.log('AI Response:', JSON.stringify(data, null, 2));
    
    // Parse the AI response - with tool calling, the response is in tool_calls
    let result;
    try {
      const message = data.choices[0].message;
      
      // Check if AI used tool calling
      if (message.tool_calls && message.tool_calls.length > 0) {
        const toolCall = message.tool_calls[0];
        result = JSON.parse(toolCall.function.arguments);
      } else if (message.content) {
        // Fallback to parsing content if tool calling not used
        result = JSON.parse(message.content);
      } else {
        throw new Error('No valid response from AI');
      }
      
      // CRITICAL: Validate that all suggested bubble IDs actually exist in our database
      const validBubbleIds = new Set(bubbles?.map(b => b.id) || []);
      
      if (result.suggestedBubbles) {
        // Filter out any bubbles with invalid IDs
        result.suggestedBubbles = result.suggestedBubbles.filter((bubble: any) => {
          const isValid = validBubbleIds.has(bubble.id);
          if (!isValid) {
            console.error(`AI returned invalid bubble ID: ${bubble.id}`);
          }
          return isValid;
        });
        
        // If no valid bubbles remain, use keyword-based fallback
        if (result.suggestedBubbles.length === 0) {
          console.warn('No valid bubble IDs from AI, using keyword-based fallback');
          
          // Try to match problem keywords to bubbles
          const problemWords = problem.toLowerCase().split(/\s+/);
          const matchedBubbles = new Set<string>();
          
          problemWords.forEach((word: string) => {
            if (topicMap[word]) {
              topicMap[word].forEach((id: string) => matchedBubbles.add(id));
            }
          });
          
          const fallbackBubbles = Array.from(matchedBubbles)
            .slice(0, 3)
            .map(id => {
              const bubble = bubbles?.find(b => b.id === id);
              return bubble ? {
                id: bubble.id,
                name: bubble.name,
                reason: 'This bubble might be helpful for you'
              } : null;
            })
            .filter(Boolean);
          
          result.suggestedBubbles = fallbackBubbles.length > 0 
            ? fallbackBubbles 
            : bubbles?.slice(0, 3).map(b => ({
                id: b.id,
                name: b.name,
                reason: 'This bubble might be helpful for you'
              })) || [];
        }
      }
    } catch (e) {
      console.error('Failed to parse AI response:', e);
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