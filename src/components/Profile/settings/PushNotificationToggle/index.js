import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Switch,
  FormControlLabel,
  Button,
  CircularProgress,
} from "@mui/material";
import { useSelector } from "react-redux";

// TODO: Implement user data management without Firebase
const usersRef = null;

const PushNotificationToggle = () => {
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) {
      // TODO: Implement notification preference fetching without Firebase
      console.log("Notification preference fetching disabled for user:", user);
      setPushNotifications(true);
      setLoading(false);
    }
  }, [user]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleToggle = () => {
    const newPushNotifications = !pushNotifications;
    setPushNotifications(newPushNotifications);
    // TODO: Implement notification preference update without Firebase
    console.log("Notification toggle disabled:", newPushNotifications);

    if (!newPushNotifications) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <FormControlLabel control={<Switch checked={pushNotifications} onChange={handleToggle} color="primary" />} label="Push Notifications" />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Push Notifications</DialogTitle>
        <DialogContent>
          <DialogContentText>Push notifications have been turned off for this account.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PushNotificationToggle;
