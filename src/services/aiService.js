import axios from 'axios';

const COHERE_API_KEY = "A443dmaow1J4IZSxVAsjjJFw8OQv4WwZDOispMeA";

// Enhanced sentiment analysis with emotion detection
export const analyzeEmotion = async (text) => {
  try {
    const response = await axios.post(
      'https://api.cohere.ai/v1/classify',
      {
        model: 'embed-english-v3.0',
        inputs: [text],
        examples: [
          {text: "I'm feeling amazing today!", label: 'happy'},
          {text: "This is so frustrating", label: 'angry'},
          {text: "I feel so alone", label: 'sad'},
          {text: "I'm really anxious about tomorrow", label: 'anxious'},
          {text: "Everything is fine", label: 'neutral'},
          {text: "I'm so excited!", label: 'excited'},
          {text: "I feel so stressed out", label: 'stressed'},
          {text: "I'm feeling grateful", label: 'grateful'},
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );
    
    return response.data.classifications?.[0]?.prediction || 'neutral';
  } catch (error) {
    console.error('Error analyzing emotion:', error);
    return 'neutral';
  }
};

// Generate personalized wellness tips based on mood
export const generateWellnessTip = async (mood, context) => {
  try {
    const response = await axios.post(
      'https://api.cohere.ai/v1/generate',
      {
        model: 'command',
        prompt: `You are a mental wellness assistant. Provide a brief (1-2 sentence) personalized tip for someone feeling ${mood}.
        
Context: ${JSON.stringify(context)}

Tip:`,
        max_tokens: 100,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );
    
    return response.data.generations[0].text.trim();
  } catch (error) {
    console.error('Error generating wellness tip:', error);
    return "Take a deep breath. You're doing great!";
  }
};

// Analyze conversation for mood trends
export const analyzeMoodTrend = async (conversation) => {
  try {
    const response = await axios.post(
      'https://api.cohere.ai/v1/classify',
      {
        model: 'embed-english-v3.0',
        inputs: [conversation],
        examples: [
          {text: "I've been feeling down lately. But today was okay.", label: 'improving'},
          {text: "Each day feels worse than the last", label: 'declining'},
          {text: "I feel about the same as yesterday", label: 'stable'},
          {text: "I'm on a rollercoaster of emotions", label: 'fluctuating'}
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );
    
    return response.data.classifications?.[0]?.prediction || 'stable';
  } catch (error) {
    console.error('Error analyzing mood trend:', error);
    return 'stable';
  }
};
