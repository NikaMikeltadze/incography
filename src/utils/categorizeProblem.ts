export async function categorizeProblem(problem: string) {
  try {
    const CATEGORIZE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/categorize-problem`;
    
    const response = await fetch(CATEGORIZE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ problem }),
    });

    if (!response.ok) {
      throw new Error("Failed to categorize problem");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Categorization error:", error);
    throw error;
  }
}

export function isProblemDescription(message: string): boolean {
  // Simple heuristics to detect if someone is describing a problem
  const problemIndicators = [
    'feel', 'feeling', 'depressed', 'anxious', 'anxiety', 'worried', 'stress',
    'scared', 'afraid', 'lonely', 'sad', 'overwhelm', 'panic', 'can\'t sleep',
    'struggling', 'hard time', 'difficult', 'help', 'support', 'need',
    'don\'t know what to do', 'lost', 'confused', 'hurt', 'pain', 'suffer',
    'relationship', 'breakup', 'anger', 'angry', 'frustrated', 'tired',
    'exhausted', 'burnout', 'work', 'school', 'family', 'friend', 'cope',
    'crying', 'upset', 'hopeless', 'worthless', 'numb', 'empty'
  ];

  // Positive indicators that suggest NOT a problem
  const positiveIndicators = [
    'great', 'amazing', 'wonderful', 'awesome', 'happy', 'excited',
    'good day', 'doing well', 'fine', 'okay', 'hi', 'hello', 'hey',
    'weather', 'joke', 'story', 'chat', 'talk about'
  ];

  const lowerMessage = message.toLowerCase();
  
  // Check if message is long enough (more than just a greeting)
  if (message.split(' ').length < 5) return false;
  
  // Check for positive indicators first - if found, it's not a problem
  const hasPositive = positiveIndicators.some(indicator => 
    lowerMessage.includes(indicator)
  );
  
  if (hasPositive) return false;
  
  // Check for problem indicators
  const hasIndicator = problemIndicators.some(indicator => 
    lowerMessage.includes(indicator)
  );
  
  // Check for first-person language (I, I'm, my, me)
  const hasFirstPerson = /\b(i'?m?|my|me)\b/i.test(message);
  
  return hasIndicator && hasFirstPerson;
}