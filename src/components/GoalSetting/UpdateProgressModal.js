import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useSelector } from "react-redux";

function UpdateProgressModal({ open, handleClose, goalId }) {
  const [progress, setProgress] = useState(0);
  const user = useSelector((state) => state.auth.user);
  const uid = user?.uid || "";
  // TODO: Implement goal data management without Firebase
  const goalRef = null;

  useEffect(() => {
    if (!goalId) {
      return;
    }

    const fetchGoalData = async () => {
      try {
        // TODO: Implement goal fetching without Firebase
        console.log("Goal fetching disabled for:", goalId);
        setProgress(0);
      } catch (error) {
        console.error("Error fetching goal:", error);
      }
    };

    fetchGoalData();
  }, [goalId, uid]);

  const handleSave = async () => {
    await updateGoalProgress(goalId, progress);
    handleClose();
  };

  const updateGoalProgress = async (goalId, progress) => {
    // TODO: Implement goal progress update without Firebase
    console.log("Goal progress update disabled:", goalId, progress);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Update Progress Percentage</DialogTitle>
      <DialogContent>
        <Box>
          <TextField
            label="Progress Percentage"
            type="number"
            InputProps={{ inputProps: { min: 0, max: 100 } }}
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UpdateProgressModal;
