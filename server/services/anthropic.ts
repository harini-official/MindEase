import Anthropic from '@anthropic-ai/sdk';

// Initialize the Anthropic client with API key
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// System prompt to guide Claude's responses as an emotional support companion
const SYSTEM_PROMPT = `You are Claude, an AI emotional support companion for students on the MindEase platform.

Your role is to:
- Provide empathetic, supportive responses to students dealing with academic stress, anxiety, and other emotional challenges
- Offer practical advice for managing stress, improving study habits, and maintaining mental wellness
- Be encouraging, positive, and motivational without being dismissive of real concerns
- Help students find perspective and balance in their academic journey
- Provide mindfulness techniques and exercises when appropriate
- Be warm, friendly, and conversational in tone
- Suggest when a student might benefit from professional mental health support, while being careful not to diagnose or provide medical advice

Remember that you're speaking to students aged 15-25 who may be dealing with exam stress, burnout, academic pressure, social challenges, or general anxiety. Your goal is to make them feel heard, supported, and empowered.`;

/**
 * Get a response from Claude for emotional support
 * @param message The user's message
 * @param chatHistory Previous messages for context (optional)
 * @returns Claude's response
 */
export async function get_emotional_support_response(
  message: string,
  chatHistory: { role: 'user' | 'assistant', content: string }[] = []
): Promise<string> {
  try {
    // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      system: SYSTEM_PROMPT,
      max_tokens: 1000,
      messages: [
        ...chatHistory,
        { role: 'user', content: message }
      ],
    });

    // Extract the text from the response
    if (response.content && response.content.length > 0) {
      const content = response.content[0];
      if (content.type === 'text') {
        return content.text;
      }
    }
    
    return "I'm sorry, I'm having trouble processing your request right now. Please try again in a moment.";
  } catch (error) {
    console.error('Error getting response from Claude:', error);
    return "I'm sorry, I'm having trouble processing your request right now. Please try again in a moment.";
  }
}

/**
 * Get suggestions for coping with a specific emotion or situation
 * @param emotion The emotion or situation to address
 * @returns Claude's suggestions
 */
export async function get_coping_suggestions(emotion: string): Promise<string> {
  try {
    // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      system: SYSTEM_PROMPT,
      max_tokens: 800,
      messages: [
        { 
          role: 'user', 
          content: `I'm feeling ${emotion}. Can you suggest some practical ways to cope with this emotion and feel better?`
        }
      ],
    });

    // Extract the text from the response
    if (response.content && response.content.length > 0) {
      const content = response.content[0];
      if (content.type === 'text') {
        return content.text;
      }
    }
    
    return "I'm sorry, I'm having trouble generating suggestions right now. Please try again in a moment.";
  } catch (error) {
    console.error('Error getting coping suggestions from Claude:', error);
    return "I'm sorry, I'm having trouble generating suggestions right now. Please try again in a moment.";
  }
}

/**
 * Get a motivational message for students
 * @param situation The situation or context (optional)
 * @returns A motivational message from Claude
 */
export async function get_motivation(situation?: string): Promise<string> {
  try {
    let prompt = "Can you give me a short, motivational message to help me stay positive and focused on my studies?";
    
    if (situation) {
      prompt = `Can you give me a short, motivational message to help me with this situation: ${situation}?`;
    }

    // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      system: SYSTEM_PROMPT,
      max_tokens: 400,
      messages: [
        { role: 'user', content: prompt }
      ],
    });

    // Extract the text from the response
    if (response.content && response.content.length > 0) {
      const content = response.content[0];
      if (content.type === 'text') {
        return content.text;
      }
    }

    return "Stay persistent! Every small step you take brings you closer to your goals. You've got this!";
  } catch (error) {
    console.error('Error getting motivation from Claude:', error);
    return "Stay persistent! Every small step you take brings you closer to your goals. You've got this!";
  }
}

export default {
  get_emotional_support_response,
  get_coping_suggestions,
  get_motivation
};