import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";

const StyledFormControl = styled(FormControl)`
  margin: 8px 0;
  width: 100%;
`;

function EditGoalModal({ open, handleClose, goalId }) {
  const [goalTitle, setGoalTitle] = useState("");
  const [description, setDescription] = useState("");
  const [smartGoal, setSmartGoal] = useState({
    specific: false,
    measurable: false,
    achievable: false,
    relevant: false,
    timeBound: false,
  });

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
        setGoalTitle("");
        setDescription("");
        setSmartGoal({
          specific: false,
          measurable: false,
          achievable: false,
          relevant: false,
          timeBound: false,
        });
      } catch (error) {
        console.error("Error fetching goal:", error);
      }
    };

    fetchGoalData();
  }, [goalId, uid]);

  const handleSave = async () => {
    const updatedGoal = {
      title: goalTitle,
      description,
      smartGoal,
    };

    await updateGoal(goalId, updatedGoal);
    handleClose();
  };

  const updateGoal = async (goalId, goal) => {
    // TODO: Implement goal update without Firebase
    console.log("Goal update disabled:", goalId, goal);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Goal</DialogTitle>
      <DialogContent>
        <Box>
          <StyledFormControl>
            <TextField label="Goal Title" value={goalTitle} onChange={(e) => setGoalTitle(e.target.value)} />
          </StyledFormControl>
          <StyledFormControl>
            <TextField label="Description" multiline rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
          </StyledFormControl>
          <StyledFormControl>
            <FormLabel component="legend">SMART Goal Checklist</FormLabel>
            <FormGroup>
              {Object.keys(smartGoal).map((key) => (
                <FormControlLabel
                  key={key}
                  control={<Checkbox checked={smartGoal[key]} onChange={(e) => setSmartGoal({ ...smartGoal, [key]: e.target.checked })} name={key} />}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                />
              ))}
            </FormGroup>
          </StyledFormControl>
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

export default EditGoalModal;
