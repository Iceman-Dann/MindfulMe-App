import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Key,
  Visibility,
  VisibilityOff,
  Help,
  CheckCircle,
  Error
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const APIKeySetup = ({ open, onClose, onKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState(null);
  const [savedKey, setSavedKey] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('cohere_api_key');
    if (saved) {
      setSavedKey(saved);
      setApiKey(saved);
    }
  }, []);

  const validateAPIKey = async (key) => {
    if (!key || key.length < 20) {
      setValidationStatus({ type: 'error', message: 'Please enter a valid Cohere API key' });
      return false;
    }

    setIsValidating(true);
    setValidationStatus(null);

    try {
      const response = await fetch('https://api.cohere.ai/v1/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'command',
          prompt: 'Hello',
          max_tokens: 10,
          temperature: 0.5,
        })
      });

      if (response.ok) {
        setValidationStatus({ type: 'success', message: 'API key is valid!' });
        return true;
      } else {
        setValidationStatus({ type: 'error', message: 'Invalid API key. Please check your key.' });
        return false;
      }
    } catch (error) {
      setValidationStatus({ type: 'error', message: 'Network error. Please try again.' });
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleSaveKey = async () => {
    const isValid = await validateAPIKey(apiKey);
    if (isValid) {
      localStorage.setItem('cohere_api_key', apiKey);
      setSavedKey(apiKey);
      onKeySet(apiKey);
      setTimeout(() => onClose(), 1500);
    }
  };

  const handleRemoveKey = () => {
    localStorage.removeItem('cohere_api_key');
    setSavedKey('');
    setApiKey('');
    setValidationStatus(null);
    onKeySet(null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Key color="primary" />
            <Typography variant="h6">Cohere API Key Setup</Typography>
            <Tooltip title="Get your API key from dashboard.cohere.com">
              <IconButton size="small">
                <Help />
              </IconButton>
            </Tooltip>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Enter your Cohere API key to enable real AI-powered mental health support. 
            Your key is stored locally and never shared.
          </Typography>

          {savedKey && (
            <Alert severity="info" sx={{ mb: 2 }}>
              API key is already configured. You can update or remove it.
            </Alert>
          )}

          <TextField
            fullWidth
            label="Cohere API Key"
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Cohere API key..."
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => setShowKey(!showKey)}>
                  {showKey ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
            sx={{ mb: 2 }}
          />

          {validationStatus && (
            <Alert 
              severity={validationStatus.type} 
              sx={{ mb: 2 }}
              icon={validationStatus.type === 'success' ? <CheckCircle /> : <Error />}
            >
              {validationStatus.message}
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <Chip label="Secure Storage" size="small" color="primary" variant="outlined" />
            <Chip label="Real AI Responses" size="small" color="primary" variant="outlined" />
            <Chip label="No Data Sharing" size="small" color="primary" variant="outlined" />
          </Box>

          <Typography variant="caption" color="text.secondary">
            Don't have an API key? Visit{' '}
            <a href="https://dashboard.cohere.com" target="_blank" rel="noopener noreferrer">
              dashboard.cohere.com
            </a>{' '}
            to get one for free.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1 }}>
          {savedKey && (
            <Button onClick={handleRemoveKey} color="error">
              Remove Key
            </Button>
          )}
          <Button onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveKey} 
            variant="contained"
            disabled={!apiKey || isValidating}
            startIcon={isValidating ? <div className="spinner" /> : null}
          >
            {isValidating ? 'Validating...' : 'Save Key'}
          </Button>
        </DialogActions>
      </motion.div>
    </Dialog>
  );
};

export default APIKeySetup;
