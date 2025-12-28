const COHERE_API_KEY = "A443dmaow1J4IZSxVAsjjJFw8OQv4WwZDOispMeA";

export const analyzeSentiment = async (text) => {
  try {
    const response = await fetch('https://api.cohere.ai/v1/classify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COHERE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'embed-english-v3.0',
        inputs: [text],
        examples: [
          {text: "I'm feeling great!", label: "positive"},
          {text: "This is terrible", label: "negative"},
          {text: "I'm okay", label: "neutral"},
        ]
      })
    });
    const data = await response.json();
    return data.classifications?.[0]?.prediction || 'neutral';
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return 'neutral';
  }
};

export const generateResponse = async (message) => {
  try {
    const response = await fetch('https://api.cohere.ai/v1/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COHERE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'command',
        message: message,
        temperature: 0.7,
        max_tokens: 300
      })
    });
    const data = await response.json();
    return data.text || "I'm here to help. Could you tell me more?";
  } catch (error) {
    console.error('Error generating response:', error);
    return "I'm having trouble connecting. Please try again.";
  }
};

export const generateSMARTGoal = async (goalIdea) => {
  try {
    const response = await fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COHERE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'command',
        prompt: `Transform this goal idea into a SMART goal: "${goalIdea}"\n\nSMART Goal:`,
        max_tokens: 200,
        temperature: 0.7,
      })
    });
    const data = await response.json();
    return data.generations?.[0]?.text?.trim() || "Let's set a specific, measurable goal!";
  } catch (error) {
    console.error('Error generating SMART goal:', error);
    return "I couldn't generate a SMART goal right now. Try being more specific!";
  }
};

export const analyzeGoals = async (goals) => {
  try {
    const response = await fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COHERE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'command',
        prompt: `Analyze these goals and provide insights: ${JSON.stringify(goals, null, 2)}\n\nKey insights:`,
        max_tokens: 300,
        temperature: 0.7,
      })
    });
    const data = await response.json();
    return data.generations?.[0]?.text?.trim() || "Here are your goals. Keep going!";
  } catch (error) {
    console.error('Error analyzing goals:', error);
    return "I couldn't analyze your goals right now.";
  }
};
