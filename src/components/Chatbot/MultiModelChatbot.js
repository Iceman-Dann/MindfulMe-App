import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";
import {
  SmartToy,
  Psychology,
  AutoAwesome,
  Speed,
  Settings,
  Send,
  Refresh,
  Star,
  Schedule as TimelineIcon
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@mui/material";

const MultiModelChatbot = () => {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState("openai");
  const [modelStats, setModelStats] = useState({
    openai: { responses: 0, avgTime: 0, rating: 4.5 },
    google: { responses: 0, avgTime: 0, rating: 4.3 },
    cohere: { responses: 0, avgTime: 0, rating: 4.1 }
  });

  const theme = useTheme();

  const aiModels = [
    {
      id: "openai",
      name: "OpenAI GPT-4",
      description: "Most advanced reasoning and creativity",
      icon: <SmartToy />,
      color: "#10a37f",
      specialties: ["Complex reasoning", "Creative writing", "Deep analysis"]
    },
    {
      id: "google",
      name: "Google Gemini",
      description: "Multimodal understanding and speed",
      icon: <AutoAwesome />,
      color: "#4285f4",
      specialties: ["Fast responses", "Multimodal", "Real-time processing"]
    },
    {
      id: "cohere",
      name: "Cohere Command",
      description: "Specialized for mental health conversations",
      icon: <Psychology />,
      color: "#ff6b35",
      specialties: ["Empathy", "Mental health", "Therapeutic conversations"]
    }
  ];

  useEffect(() => {
    // Initialize with welcome message
    setConversation([{
      role: "assistant",
      content: "🧠 Welcome to MindfulMe's Multi-Model AI Chatbot! I'm powered by three advanced AI models working together to provide you with the best mental health support. Choose your preferred AI model or let me select the best one for your needs.",
      model: "system",
      timestamp: new Date()
    }]);
  }, []);

  const selectBestModel = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Simple heuristic for model selection
    if (lowerMessage.includes("creative") || lowerMessage.includes("imagine") || lowerMessage.includes("story")) {
      return "openai";
    } else if (lowerMessage.includes("quick") || lowerMessage.includes("fast") || lowerMessage.includes("urgent")) {
      return "google";
    } else if (lowerMessage.includes("feel") || lowerMessage.includes("anxious") || lowerMessage.includes("sad")) {
      return "cohere";
    }
    
    return selectedModel;
  };

  const sendMessage = async () => {
    if (message.trim() !== "") {
      const userMessage = {
        role: "user",
        content: message,
        timestamp: new Date()
      };
      
      setConversation(prev => [...prev, userMessage]);
      setMessage("");
      setIsTyping(true);

      const startTime = Date.now();
      const modelToUse = selectBestModel(message);
      
      try {
        const response = await fetch('http://localhost:4001/multi-model-chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message,
            conversation: conversation.filter(msg => msg.role !== 'system'),
            model: modelToUse
          })
        });

        const data = await response.json();
        const responseTime = Date.now() - startTime;
        
        // Update model stats
        setModelStats(prev => ({
          ...prev,
          [modelToUse]: {
            ...prev[modelToUse],
            responses: prev[modelToUse].responses + 1,
            avgTime: Math.round((prev[modelToUse].avgTime + responseTime) / 2)
          }
        }));

        setIsTyping(false);

        if (data.success) {
          const assistantMessage = {
            role: "assistant",
            content: data.message,
            model: modelToUse,
            responseTime: responseTime,
            timestamp: new Date()
          };
          
          setConversation(prev => [...prev, assistantMessage]);
        } else {
          setConversation(prev => [...prev, {
            role: "error",
            content: data.message || 'Unknown error',
            timestamp: new Date()
          }]);
        }
      } catch (error) {
        console.error("Error sending message:", error);
        setIsTyping(false);
        
        // Fallback response
        const fallbackMessage = {
          role: "assistant",
          content: `I'm having connectivity issues, but I want to help. As your ${aiModels.find(m => m.id === selectedModel)?.name} assistant, I'm here to support you. Could you try rephrasing your message or check your connection?`,
          model: selectedModel,
          fallback: true,
          timestamp: new Date()
        };
        
        setConversation(prev => [...prev, fallbackMessage]);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearConversation = () => {
    setConversation([{
      role: "assistant",
      content: "Conversation cleared. How can I help you today?",
      model: "system",
      timestamp: new Date()
    }]);
  };

  const getModelInfo = (modelId) => {
    return aiModels.find(model => model.id === modelId) || aiModels[0];
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Header */}
      <Paper elevation={3} sx={{ borderRadius: 0, p: 2, background: 'rgba(255,255,255,0.95)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Avatar sx={{ mr: 2, background: 'linear-gradient(45deg, #667eea, #764ba2)' }}>
                <Psychology />
              </Avatar>
            </motion.div>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                🤖 Multi-Model AI Chatbot
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Powered by OpenAI, Google AI, and Cohere
              </Typography>
            </Box>
          </Box>
          
          <IconButton onClick={clearConversation} color="primary">
            <Refresh />
          </IconButton>
        </Box>

        {/* Model Selection */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            Choose AI Model:
          </Typography>
          
          {aiModels.map((model) => (
            <motion.div
              key={model.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={selectedModel === model.id ? "contained" : "outlined"}
                onClick={() => setSelectedModel(model.id)}
                startIcon={model.icon}
                sx={{
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  borderColor: model.color,
                  backgroundColor: selectedModel === model.id ? model.color : 'transparent',
                  color: selectedModel === model.id ? 'white' : model.color
                }}
              >
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {model.name}
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                    {modelStats[model.id].responses} responses
                  </Typography>
                </Box>
              </Button>
            </motion.div>
          ))}
        </Box>

        {/* Model Stats */}
        <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
          {aiModels.map((model) => (
            <Chip
              key={model.id}
              icon={<Star sx={{ fontSize: 16 }} />}
              label={`${model.name}: ${modelStats[model.id].rating}⭐`}
              size="small"
              sx={{
                backgroundColor: model.color + '20',
                color: model.color,
                fontWeight: 'bold'
              }}
            />
          ))}
        </Box>
      </Paper>

      {/* Conversation Area */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <AnimatePresence>
          {conversation.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  mb: 2
                }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    maxWidth: '70%',
                    borderRadius: 3,
                    background: msg.role === 'user' 
                      ? 'linear-gradient(135deg, #667eea, #764ba2)'
                      : msg.role === 'error'
                      ? '#ffebee'
                      : 'white',
                    color: msg.role === 'user' ? 'white' : 'text.primary',
                    position: 'relative'
                  }}
                >
                  {msg.model && msg.role === 'assistant' && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {getModelInfo(msg.model).icon}
                      <Typography variant="caption" sx={{ ml: 1, fontWeight: 'bold', color: getModelInfo(msg.model).color }}>
                        {getModelInfo(msg.model).name}
                      </Typography>
                      {msg.responseTime && (
                        <Chip
                          icon={<Speed sx={{ fontSize: 12 }} />}
                          label={`${msg.responseTime}ms`}
                          size="small"
                          variant="outlined"
                          sx={{ ml: 1, height: 20 }}
                        />
                      )}
                    </Box>
                  )}
                  
                  <Typography variant="body1">
                    {msg.content}
                  </Typography>
                  
                  {msg.fallback && (
                    <Alert severity="warning" sx={{ mt: 1 }}>
                      Using fallback mode - some features may be limited
                    </Alert>
                  )}
                </Paper>
              </Box>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ mr: 2, background: getModelInfo(selectedModel).color }}>
                {getModelInfo(selectedModel).icon}
              </Avatar>
              <Paper elevation={2} sx={{ p: 2, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CircularProgress size={20} sx={{ mr: 2 }} />
                  <Typography variant="body2">
                    {getModelInfo(selectedModel).name} is thinking...
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </motion.div>
        )}
      </Box>

      {/* Input Area */}
      <Paper elevation={3} sx={{ borderRadius: 0, p: 2, background: 'rgba(255,255,255,0.95)' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
          <Box sx={{ flex: 1 }}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message... (AI will select the best model automatically)"
              style={{
                width: '100%',
                minHeight: '60px',
                maxHeight: '120px',
                padding: '12px',
                borderRadius: '12px',
                border: `2px solid ${theme.palette.primary.main}`,
                fontSize: '16px',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </Box>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <IconButton
              onClick={sendMessage}
              disabled={!message.trim() || isTyping}
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                width: 56,
                height: 56,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark
                }
              }}
            >
              <Send />
            </IconButton>
          </motion.div>
        </Box>
        
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          💡 Tip: The AI automatically selects the best model based on your message content
        </Typography>
      </Paper>
    </Box>
  );
};

export default MultiModelChatbot;
