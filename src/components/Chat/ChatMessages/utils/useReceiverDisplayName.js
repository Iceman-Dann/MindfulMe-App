import { useEffect, useState } from "react";

/**
 * Custom hook to retrieve the display name of a receiver user
 * @param {string} receiverUid - the user ID of the receiver
 * @returns {string} - the display name of the receiver
 */
const useReceiverDisplayName = (receiverUid) => {
  const [receiverDisplayName, setReceiverDisplayName] = useState("");

  useEffect(() => {
    /**
     * Fetches of display name of receiver user from backend
     */
    const fetchReceiverDisplayName = async () => {
      // TODO: Implement receiver display name fetching without Firebase
      console.log("Receiver display name fetching disabled for:", receiverUid);
      setReceiverDisplayName("Unknown User");
    };

    fetchReceiverDisplayName();
  }, [receiverUid]);

  return receiverDisplayName;
};

export default useReceiverDisplayName;
