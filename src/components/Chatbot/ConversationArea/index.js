import { Box, Typography, CircularProgress, Avatar, Chip } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRef, useEffect, forwardRef } from "react";
import { Psychology, Person, AutoAwesome } from "@mui/icons-material";
import { motion } from "framer-motion";

const Container = styled(Box)(({ theme }) => ({
  height: 'calc(100vh - 80px)',
  display: 'flex',
  flexDirection: 'column',
  background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
  position: 'relative',
  overflow: 'hidden'
}));

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 24px',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
  flexShrink: 0
}));

const LogoSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
}));

const MessageContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: '16px 24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  '&::-webkit-scrollbar': {
    width: '6px'
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent'
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(20, 184, 166, 0.3)',
    borderRadius: '3px'
  }
}));

const MessageWrapper = styled(Box)(({ theme, isUser }) => ({
  display: 'flex',
  justifyContent: isUser ? 'flex-end' : 'flex-start',
  width: '100%'
}));

const MessageBubble = styled(Box)(({ theme, isUser }) => ({
  maxWidth: '70%',
  padding: '12px 16px',
  borderRadius: '16px',
  background: isUser 
    ? 'linear-gradient(135deg, #14b8a6 0%, #10b981 100%)'
    : 'rgba(255, 255, 255, 0.95)',
  color: isUser ? '#ffffff' : '#1e293b',
  boxShadow: isUser
    ? '0 4px 12px rgba(20, 184, 166, 0.3)'
    : '0 4px 12px rgba(0, 0, 0, 0.15)',
  backdropFilter: 'blur(10px)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: isUser 
      ? 'linear-gradient(45deg, rgba(255,255,255,0.1), transparent)' 
      : 'linear-gradient(45deg, rgba(255,255,255,0.1), transparent)',
    pointerEvents: 'none'
  }
}));

const AvatarWrapper = styled(Avatar)(({ theme, isUser }) => ({
  width: '32px',
  height: '32px',
  marginBottom: '8px',
  background: isUser
    ? 'linear-gradient(45deg, #6366f1, #8b5cf6)'
    : 'linear-gradient(45deg, #14b8a6, #10b981)',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
}));

const Message = forwardRef(({ msg, index }, ref) => {
  const isUser = msg.role === "user";

  const formatText = (text) => {
    return text.split('\n').map((line, i) => {
      // Skip empty lines
      if (!line.trim()) return null;
      
      // Handle headings (lines with ** or ending with :)
      if (line.includes('**') || line.endsWith(':')) {
        const cleanText = line.replace(/\*\*/g, '').replace(':', '');
        return (
          <Typography key={i} sx={{ 
            fontSize: '16px', 
            lineHeight: 1.5, 
            mb: 2, 
            fontWeight: 700, 
            color: isUser ? '#ffffff' : '#0f172a',
            borderBottom: isUser ? 'none' : '2px solid #14b8a6',
            pb: 0.5
          }}>
            {cleanText}
          </Typography>
        );
      }
      
      // Handle bullet points (•, -, *)
      if (line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*')) {
        const cleanText = line.replace(/^[•\-\*]\s*/, '');
        return (
          <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5, ml: 1 }}>
            <Typography sx={{ 
              fontSize: '16px', 
              color: isUser ? '#ffffff' : '#14b8a6', 
              mr: 1.5, 
              lineHeight: 1.5,
              fontWeight: 'bold',
              mt: 0.5
            }}>
              •
            </Typography>
            <Typography sx={{ 
              fontSize: '14px', 
              lineHeight: 1.6, 
              flex: 1,
              color: isUser ? '#ffffff' : '#334155'
            }}>
              {cleanText}
            </Typography>
          </Box>
        );
      }
      
      // Handle numbered lists
      if (/^\d+\./.test(line.trim())) {
        const match = line.match(/^\d+\./);
        const cleanText = line.replace(/^\d+\.\s*/, '');
        return (
          <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5, ml: 1 }}>
            <Typography sx={{ 
              fontSize: '14px', 
              color: isUser ? '#ffffff' : '#6366f1', 
              mr: 1.5, 
              lineHeight: 1.5,
              fontWeight: 600,
              minWidth: '25px'
            }}>
              {match[0]}
            </Typography>
            <Typography sx={{ 
              fontSize: '14px', 
              lineHeight: 1.6, 
              flex: 1,
              color: isUser ? '#ffffff' : '#334155'
            }}>
              {cleanText}
            </Typography>
          </Box>
        );
      }
      
      // Handle bold text (wrapped in **)
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <Typography key={i} sx={{ 
            fontSize: '14px', 
            lineHeight: 1.6, 
            mb: 1,
            color: isUser ? '#ffffff' : '#334155'
          }}>
            {parts.map((part, index) => (
              index % 2 === 1 ? 
                <span key={index} style={{ 
                  fontWeight: 700, 
                  color: isUser ? '#ffffff' : '#0f172a',
                  fontSize: '15px'
                }}>{part}</span> : 
                <span key={index}>{part}</span>
            ))}
          </Typography>
        );
      }
      
      // Regular text with emoji support
      return (
        <Typography key={i} sx={{ 
          fontSize: '14px', 
          lineHeight: 1.6, 
          mb: 1.2,
          color: isUser ? '#ffffff' : '#334155'
        }}>
          {line}
        </Typography>
      );
    }).filter(Boolean); // Remove null entries
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <MessageWrapper isUser={isUser}>
        {!isUser && (
          <AvatarWrapper isUser={isUser}>
            <Psychology sx={{ fontSize: '18px', color: '#ffffff' }} />
          </AvatarWrapper>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '70%' }}>
          <MessageBubble isUser={isUser}>
            {formatText(msg.content)}
          </MessageBubble>
        </Box>
        {isUser && (
          <AvatarWrapper isUser={isUser}>
            <Person sx={{ fontSize: '18px', color: '#ffffff' }} />
          </AvatarWrapper>
        )}
      </MessageWrapper>
    </motion.div>
  );
});

function ConversationArea({ conversation, isThinking }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, isThinking]);

  const welcomeMessage = {
    content: "Welcome to MindfulMe AI - Your Mental Wellness Companion",
    role: "bot",
  };

  return (
    <Container>
      <Header>
        <LogoSection>
          <AvatarWrapper isUser={false}>
            <Psychology sx={{ fontSize: '18px', color: '#ffffff' }} />
          </AvatarWrapper>
          <Box>
            <Typography sx={{ 
              fontSize: '18px', 
              fontWeight: 700, 
              color: '#0f172a',
              lineHeight: 1.2
            }}>
              MindfulMe AI
            </Typography>
            <Typography sx={{ 
              fontSize: '12px', 
              color: '#64748b',
              fontWeight: 500
            }}>
              Mental Wellness Companion
            </Typography>
          </Box>
        </LogoSection>
        <Chip 
          icon={<AutoAwesome sx={{ fontSize: '14px !important' }} />}
          label="AI Powered"
          sx={{
            background: 'linear-gradient(45deg, #14b8a6, #10b981)',
            color: 'white',
            fontSize: '12px',
            height: '28px',
            '& .MuiChip-icon': {
              color: 'white'
            }
          }}
        />
      </Header>
      
      <MessageContainer>
        <Message msg={welcomeMessage} index={0} />
        {conversation.map((msg, index) => (
          <Message key={index} msg={msg} index={index + 1} />
        ))}
        {isThinking && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <MessageWrapper isUser={false}>
              <AvatarWrapper isUser={false}>
                <Psychology sx={{ fontSize: '18px', color: '#ffffff' }} />
              </AvatarWrapper>
              <MessageBubble isUser={false}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Psychology sx={{ fontSize: '18px', color: '#14b8a6' }} />
                    </motion.div>
                    <Typography sx={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>
                      Processing your message
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', pl: 3 }}>
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#14b8a6' }} />
                    </motion.div>
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    >
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981' }} />
                    </motion.div>
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    >
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#06b6d4' }} />
                    </motion.div>
                  </Box>
                  
                  <motion.div
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Typography sx={{ fontSize: '12px', color: '#94a3b8', pl: 3, fontStyle: 'italic' }}>
                      Analyzing emotions • Finding best response • Preparing support
                    </Typography>
                  </motion.div>
                </Box>
              </MessageBubble>
            </MessageWrapper>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </MessageContainer>
    </Container>
  );
}

export default ConversationArea;
