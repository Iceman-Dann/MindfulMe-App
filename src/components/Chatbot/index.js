import React, { useState, useEffect } from "react";
import axios from "axios";
import ConversationArea from "./ConversationArea";
import InputArea from "./InputArea";
import { Box, Paper, Avatar, Snackbar, Alert } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import { Psychology, EmojiEmotions, MoodBad, SentimentSatisfied, SentimentNeutral, SentimentVeryDissatisfied } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { analyzeEmotion, generateWellnessTip, analyzeMoodTrend } from "../../services/aiService";

const emotionIcons = {
  happy: <EmojiEmotions sx={{ color: '#f59e0b' }} />,
  sad: <SentimentVeryDissatisfied sx={{ color: '#3b82f6' }} />,
  angry: <MoodBad sx={{ color: '#ef4444' }} />,
  neutral: <SentimentNeutral sx={{ color: '#9ca3af' }} />,
  excited: <EmojiEmotions sx={{ color: '#ec4899' }} />,
  anxious: <SentimentSatisfied sx={{ color: '#8b5cf6' }} />,
  stressed: <SentimentVeryDissatisfied sx={{ color: '#f97316' }} />,
  grateful: <EmojiEmotions sx={{ color: '#10b981' }} />,
};

const emotionColors = {
  happy: 'bg-yellow-100',
  sad: 'bg-blue-100',
  angry: 'bg-red-100',
  neutral: 'bg-gray-100',
  excited: 'bg-pink-100',
  anxious: 'bg-purple-100',
  stressed: 'bg-orange-100',
  grateful: 'bg-green-100',
};

function Chatbot() {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  const [moodHistory, setMoodHistory] = useState([]);
  const [showEmotionFeedback, setShowEmotionFeedback] = useState(false);
  const [wellnessTip, setWellnessTip] = useState('');
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    document.title = "AI Counselor";
  }, []);

  // Analyze message emotion and update state
  const analyzeMessageEmotion = async (text) => {
    try {
      const emotion = await analyzeEmotion(text);
      setCurrentEmotion(emotion);
      
      // Add to mood history
      const newMoodEntry = {
        emotion,
        timestamp: new Date().toISOString(),
        message: text
      };
      
      setMoodHistory(prev => [...prev, newMoodEntry].slice(-50)); // Keep last 50 entries
      
      // Generate wellness tip based on emotion
      const tip = await generateWellnessTip(emotion, { 
        timeOfDay: new Date().getHours(),
        previousEmotions: moodHistory.slice(-3).map(m => m.emotion)
      });
      
      setWellnessTip(tip);
      setShowEmotionFeedback(true);
      
      return emotion;
    } catch (error) {
      console.error('Error analyzing emotion:', error);
      return 'neutral';
    }
  };

  const sendMessage = async () => {
    if (message.trim() !== "") {
      const userMessage = message;
      
      // Add user message with emotion analysis
      const emotion = await analyzeMessageEmotion(userMessage);
      setConversation(prev => [
        ...prev, 
        { 
          role: "user", 
          content: userMessage,
          emotion,
          timestamp: new Date().toISOString()
        }
      ]);
      
      setMessage("");
      setIsThinking(true);

      try {
        const apiKey = "A443dmaow1J4IZSxVAsjjJFw8OQv4WwZDOispMeA";
        
        // Get mood trend for context
        const recentMessages = conversation
          .filter(msg => msg.role === 'user')
          .slice(-5)
          .map(msg => msg.content);
          
        const moodTrend = await analyzeMoodTrend(recentMessages.join(' '));
        
        const response = await axios.post(
          "https://api.cohere.ai/v1/chat",
          {
            message: userMessage,
            model: "command-r-08-2024",
            max_tokens: 1000,
            temperature: 0.7,
            preamble: `You are a compassionate and supportive mental wellness companion. 
            The user's current emotional state appears to be: ${emotion}.
            Recent mood trend: ${moodTrend}.
            
            Your role is to provide empathetic guidance and emotional support. 
            Always:
            1. Acknowledge and validate the user's feelings with warmth and understanding
            2. Use emojis and formatting to make responses more engaging and supportive
            3. Structure advice with clear headings and bullet points
            4. Include practical, actionable steps
            5. End with encouraging and supportive messages
            6. Be warm, caring, and conversational.
            
            If the user seems to be in distress, offer appropriate support and suggest professional help.`
          },
          {
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json",
              "Accept": "application/json"
            }
          }
        );

        // Simulate thinking delay for better UX
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000));

        if (response.data?.text) {
          setConversation(prev => [
            ...prev, 
            { 
              role: "assistant", 
              content: response.data.text,
              timestamp: new Date().toISOString()
            }
          ]);
        } else {
          console.error("Unexpected API response format:", response.data);
          setConversation(prev => [...prev, { 
            role: "error", 
            content: "I'm having trouble processing that. Could you try rephrasing?",
            timestamp: new Date().toISOString()
          }]);
        }
      } catch (error) {
        console.error("Error sending message:", error);
        console.error("Error details:", error.response?.data || error.message);
        
        let errorMessage = "Connection error. Please try again.";
        if (error.response?.status === 401) {
          errorMessage = "Authentication failed. Please check API key.";
        } else if (error.response?.status === 429) {
          errorMessage = "Rate limit exceeded. Please try again later.";
        } else if (error.response?.data?.message) {
          errorMessage = `API Error: ${error.response.data.message}`;
        }
        
        setConversation(prev => [...prev, { 
          role: "error", 
          content: errorMessage,
          timestamp: new Date().toISOString()
        }]);
      } finally {
        setIsThinking(false);
      }
    }
  };

  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      overflow="hidden"
      sx={{ 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
        position: 'relative',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 10% 20%, ${emotionColors[currentEmotion] || '#f8fafc'} 0%, transparent 30%)`,
          opacity: 0.3,
          zIndex: 0,
          transition: 'all 0.5s ease-in-out'
        }
      }}
    >
      <Box position="relative" zIndex={1} height="100%" display="flex" flexDirection="column">
        <ConversationArea 
          conversation={conversation} 
          isThinking={isThinking} 
          emotionIcons={emotionIcons}
        />
        <InputArea 
          message={message} 
          setMessage={setMessage} 
          sendMessage={sendMessage} 
          disabled={isThinking} 
          currentEmotion={currentEmotion}
        />
      </Box>
      
      <Snackbar
        open={showEmotionFeedback}
        autoHideDuration={5000}
        onClose={() => setShowEmotionFeedback(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowEmotionFeedback(false)} 
          severity="info"
          icon={emotionIcons[currentEmotion] || <EmojiEmotions />}
          sx={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            '& .MuiAlert-message': {
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }
          }}
        >
          <Box fontWeight="bold" display="flex" alignItems="center" gap={1}>
            {emotionIcons[currentEmotion]}
            Detected Mood: {currentEmotion.charAt(0).toUpperCase() + currentEmotion.slice(1)}
          </Box>
          {wellnessTip && (
            <Box fontSize="0.9em" color="text.secondary">
              {wellnessTip}
            </Box>
          )}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Chatbot;
