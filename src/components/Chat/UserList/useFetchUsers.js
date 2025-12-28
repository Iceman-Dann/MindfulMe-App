import { useEffect, useState } from "react";

const useFetchUsers = (currentUserUid, setLoading) => {
  // State for list of users, conversations, and filtered chats
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [filterChat, setfilterChat] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      // TODO: Implement user fetching without Firebase
      console.log("User fetching disabled for:", currentUserUid);
      setUsers([]);
      setConversations([]);
      setfilterChat([]);
      setLoading(false);
    };

    fetchUsers();
  }, [currentUserUid, setLoading]);

  return { users, conversations, filterChat };
};

// Function to fetch all users from Firebase, except for the current user
const getUsersFromFirebase = async (currentUserUid) => {
  // TODO: Implement user fetching without Firebase
  console.log("User fetching disabled for:", currentUserUid);
  return [];
};

// Function to create an array of conversations based on current user's UID and other users' UID
const createConversationsArray = (usersData, currentUserUid) => {
  return usersData.map((user) => {
    const otherUid = user.uid;
    const smallerUid = currentUserUid > otherUid ? currentUserUid : otherUid;
    const biggerUid = currentUserUid > otherUid ? otherUid : currentUserUid;
    // Concatenate UIDs in a specific order to create a unique conversation ID
    return `${smallerUid}-${biggerUid}`;
  });
};

// Function to fetch chats/messages for each conversation and filter out empty ones
const getFilteredChats = async (conversations) => {
  // TODO: Implement chat fetching without Firebase
  console.log("Chat filtering disabled for conversations:", conversations);
  return [];
};

export default useFetchUsers;
