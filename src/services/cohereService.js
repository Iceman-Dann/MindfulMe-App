import axios from 'axios';

const COHERE_API_URL = 'https://api.cohere.ai/v1/generate';
const COHERE_CHAT_URL = 'https://api.cohere.ai/v1/chat';

const coereAPIKey = process.env.REACT_APP_COHERE_API_KEY;

if (!coereAPIKey) {
  console.error('Cohere API key is missing. Please set REACT_APP_COHERE_API_KEY in your .env file');
}

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${coereAPIKey}`,
  'User-Agent': 'MindfulMe/1.0'
};

export const cohereService = {
  // Generate wellness advice based on user input
  async generateWellnessAdvice(userInput, mood = 'neutral') {
    try {
      const prompt = `You are a compassionate and professional AI wellness companion for MindfulMe. 
      The user is feeling ${mood} and shares: "${userInput}"
      
      Provide a thoughtful, empathetic response that:
      1. Acknowledges their feelings
      2. Offers practical wellness advice
      3. Suggests mindfulness techniques
      4. Is supportive and encouraging
      5. Keeps the response under 150 words
      
      Response:`;

      const response = await axios.post(COHERE_API_URL, {
        model: 'command-light',
        prompt: prompt,
        max_tokens: 200,
        temperature: 0.7,
        k: 0,
        p: 0.75,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop_sequences: [],
        return_likelihoods: 'NONE'
      }, { headers });

      return response.data.generations[0].text.trim();
    } catch (error) {
      console.error('Error generating wellness advice:', error);
      throw new Error('Failed to generate wellness advice. Please try again.');
    }
  },

  // Chat with AI wellness companion
  async chatWithWellnessAI(message, conversationHistory = []) {
    try {
      const response = await axios.post(COHERE_CHAT_URL, {
        model: 'command-light',
        message: message,
        chat_history: conversationHistory,
        temperature: 0.7,
        max_tokens: 300,
        preamble: `You are MindfulMe, an AI wellness companion focused on mental health and wellbeing. 
        You are empathetic, supportive, and provide evidence-based wellness advice. 
        You never give medical advice but always encourage users to seek professional help when needed.
        You focus on mindfulness, stress reduction, and positive psychology techniques.`,
        stream: false
      }, { headers });

      return response.data;
    } catch (error) {
      console.error('Error in wellness chat:', error);
      throw new Error('Failed to connect with wellness AI. Please try again.');
    }
  },

  // Generate personalized meditation script
  async generateMeditationScript(duration = 5, focus = 'stress-relief') {
    try {
      const prompt = `Create a ${duration}-minute guided meditation script focused on ${focus}.
      Include:
      - Gentle breathing instructions
      - Body scan or visualization
      - Positive affirmations
      - Natural closing
      Keep it calming and accessible for beginners.
      
      Script:`;

      const response = await axios.post(COHERE_API_URL, {
        model: 'command-light',
        prompt: prompt,
        max_tokens: 400,
        temperature: 0.6,
        k: 0,
        p: 0.75,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop_sequences: [],
        return_likelihoods: 'NONE'
      }, { headers });

      return response.data.generations[0].text.trim();
    } catch (error) {
      console.error('Error generating meditation script:', error);
      throw new Error('Failed to generate meditation script. Please try again.');
    }
  },

  // Analyze mood patterns and provide insights
  async analyzeMoodPatterns(moodData) {
    try {
      const prompt = `Analyze these mood patterns over the past week: ${JSON.stringify(moodData)}
      Provide insights about:
      1. Overall mood trends
      2. Potential triggers
      3. Positive patterns to maintain
      4. Areas for improvement
      5. Personalized recommendations
      
      Analysis:`;

      const response = await axios.post(COHERE_API_URL, {
        model: 'command-light',
        prompt: prompt,
        max_tokens: 350,
        temperature: 0.5,
        k: 0,
        p: 0.75,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop_sequences: [],
        return_likelihoods: 'NONE'
      }, { headers });

      return response.data.generations[0].text.trim();
    } catch (error) {
      console.error('Error analyzing mood patterns:', error);
      throw new Error('Failed to analyze mood patterns. Please try again.');
    }
  }
};

export default cohereService;
