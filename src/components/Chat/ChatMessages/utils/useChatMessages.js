import { useEffect, useState } from "react";

// Custom hook for managing chat messages and sending new messages
const useChatMessages = (currentUserUid, receiverUid) => {
  // Set up local state for chat messages
  const [messages, setMessages] = useState([]);

  // Subscribe to messages collection for this chat and update state
  useEffect(() => {
    const fetchMessages = () => {
      // TODO: Implement message fetching without Firebase
      console.log("Message fetching disabled for:", currentUserUid, receiverUid);
      setMessages([]);
      return () => {}; // Return empty unsubscribe function
    };

    // Call fetchMessages function to subscribe to messages collection
    return fetchMessages();
  }, [currentUserUid, receiverUid]);

  // Function for sending a new message
  const sendMessage = async (messageText) => {
    // TODO: Implement message sending without Firebase
    console.log("Message sending disabled:", messageText, currentUserUid, receiverUid);
  };

  // Function for getting current user's display name from backend
  const getCurrentUser = async (currentUserUid) => {
    // TODO: Implement user data fetching without Firebase
    console.log("Current user fetching disabled for:", currentUserUid);
    return { username: "Unknown User" };
  };

  // Return chat messages and sendMessage function
  return { messages, sendMessage };
};

export default useChatMessages;
