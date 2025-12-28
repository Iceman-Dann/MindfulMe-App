// Cohere AI Service for Real AI Functionality
const COHERE_API_KEY = process.env.REACT_APP_COHERE_API_KEY;

const cohereAPI = {
  // Generate personalized wellness advice
  async generateWellnessAdvice(userInput, userContext = {}) {
    try {
      const response = await fetch('https://api.cohere.ai/v1/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'command',
          prompt: `You are a compassionate mental health and wellness AI assistant. Provide evidence-based, personalized advice based on the user's input.

User Context: ${JSON.stringify(userContext)}
User Input: ${userInput}

Provide thoughtful, supportive, and actionable wellness advice. Focus on:
1. Evidence-based strategies
2. Personalized recommendations
3. Practical steps the user can take
4. Supportive and encouraging tone

Response:`,
          max_tokens: 300,
          temperature: 0.7,
          k: 0,
          stop_sequences: [],
          return_likelihoods: 'NONE'
        })
      });

      const data = await response.json();
      return data.generations[0].text.trim();
    } catch (error) {
      console.error('Cohere API Error:', error);
      return "I'm having trouble connecting right now. Please try again in a moment.";
    }
  },

  // Generate mood analysis
  async analyzeMood(userInput, moodHistory = []) {
    try {
      const response = await fetch('https://api.cohere.ai/v1/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'command',
          prompt: `As a mental health AI, analyze the user's emotional state and provide insights.

Recent Mood History: ${JSON.stringify(moodHistory.slice(-5))}
Current User Input: ${userInput}

Provide a brief analysis of:
1. Current emotional state
2. Key patterns or concerns
3. One specific recommendation

Keep it concise and supportive:

Analysis:`,
          max_tokens: 200,
          temperature: 0.6,
          k: 0,
          stop_sequences: [],
          return_likelihoods: 'NONE'
        })
      });

      const data = await response.json();
      return data.generations[0].text.trim();
    } catch (error) {
      console.error('Cohere API Error:', error);
      return "I'm having trouble analyzing your mood right now. Please try again.";
    }
  },

  // Generate CBT exercise recommendations
  async generateCBTExercise(concern, exerciseType = 'general') {
    try {
      const response = await fetch('https://api.cohere.ai/v1/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'command',
          prompt: `You are a CBT (Cognitive Behavioral Therapy) practitioner. Generate a specific, practical CBT exercise.

User Concern: ${concern}
Exercise Type: ${exerciseType}

Provide:
1. Exercise title
2. Brief explanation
3. Step-by-step instructions
4. Estimated time to complete
5. Expected benefit

Keep it actionable and easy to follow:

CBT Exercise:`,
          max_tokens: 400,
          temperature: 0.5,
          k: 0,
          stop_sequences: [],
          return_likelihoods: 'NONE'
        })
      });

      const data = await response.json();
      return data.generations[0].text.trim();
    } catch (error) {
      console.error('Cohere API Error:', error);
      return "I'm here to help you with wellness exercises. Let me provide you with a helpful activity.";
    }
  },

  // Generate mindfulness meditation script
  async generateMeditationScript(duration = 5, focus = 'general') {
    try {
      const response = await fetch('https://api.cohere.ai/v1/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'command',
          prompt: `Create a guided meditation script for ${duration} minutes focusing on ${focus}.

Include:
1. Gentle introduction
2. Breathing instructions
3. Body awareness
4. Mindfulness techniques
5. Gentle conclusion

Make it calming and accessible:

Meditation Script:`,
          max_tokens: 350,
          temperature: 0.4,
          k: 0,
          stop_sequences: [],
          return_likelihoods: 'NONE'
        })
      });

      const data = await response.json();
      return data.generations[0].text.trim();
    } catch (error) {
      console.error('Cohere API Error:', error);
      return "I'm having trouble creating a meditation script right now. Please try again.";
    }
  },

  // Generate crisis support response
  async generateCrisisSupport(userInput) {
    try {
      const response = await fetch('https://api.cohere.ai/v1/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'command',
          prompt: `This is a critical mental health situation. Provide immediate support and resources.

User Input: ${userInput}

Respond with:
1. Immediate validation and support
2. Crisis hotline numbers
3. Grounding techniques
4. Encouragement to seek professional help

Be compassionate but direct:

Crisis Support:`,
          max_tokens: 250,
          temperature: 0.3,
          k: 0,
          stop_sequences: [],
          return_likelihoods: 'NONE'
        })
      });

      const data = await response.json();
      return data.generations[0].text.trim();
    } catch (error) {
      console.error('Cohere API Error:', error);
      return "If you're in crisis, please call 988 or go to your nearest emergency room.";
    }
  }
};

export default cohereAPI;
