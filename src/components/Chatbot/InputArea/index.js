import { Box, TextField, IconButton, Paper } from "@mui/material";
import { Send } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useState } from "react";

const InputContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 16px',
  borderRadius: '24px',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.2s ease-out',
  margin: '0 24px 24px 24px',
  '&:hover': {
    boxShadow: '0 8px 30px rgba(20, 184, 166, 0.15)',
    borderColor: 'rgba(20, 184, 166, 0.3)',
  },
  '&:focus-within': {
    boxShadow: '0 8px 30px rgba(20, 184, 166, 0.2)',
    borderColor: '#14b8a6',
  },
}));

const StyledInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    border: 'none',
    '& fieldset': {
      border: 'none',
    },
    '&:hover fieldset': {
      border: 'none',
    },
    '&.Mui-focused fieldset': {
      border: 'none',
    },
  },
  '& .MuiInputBase-input': {
    fontSize: '14px',
    padding: '8px 0',
    lineHeight: 1.5,
    color: '#1e293b',
    '&::placeholder': {
      color: '#94a3b8',
      opacity: 1,
    },
  },
  '& .MuiInputBase-inputMultiline': {
    padding: '8px 0',
  },
  flex: 1,
}));

const SendButton = styled(IconButton)(({ theme, disabled }) => ({
  backgroundColor: disabled ? 'rgba(20, 184, 166, 0.2)' : '#14b8a6',
  color: disabled ? '#94a3b8' : '#ffffff',
  width: '40px',
  height: '40px',
  borderRadius: '12px',
  boxShadow: disabled ? 'none' : '0 2px 8px rgba(20, 184, 166, 0.3)',
  '&:hover': {
    backgroundColor: disabled ? 'rgba(20, 184, 166, 0.2)' : '#0d9488',
    boxShadow: disabled ? 'none' : '0 4px 12px rgba(20, 184, 166, 0.4)',
  },
  '&:active': {
    transform: disabled ? 'none' : 'scale(0.95)',
  },
  transition: 'all 0.15s ease-out',
}));

function InputArea({ message, setMessage, sendMessage, disabled }) {
  const [isFocused, setIsFocused] = useState(false);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      sendMessage();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <InputContainer>
      <StyledInput
        fullWidth
        variant="outlined"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        multiline
        maxRows={3}
      />
      <SendButton 
        onClick={handleSend} 
        disabled={disabled || !message.trim()}
      >
        <Send sx={{ fontSize: '18px' }} />
      </SendButton>
    </InputContainer>
  );
}

export default InputArea;
