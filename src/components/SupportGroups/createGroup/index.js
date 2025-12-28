import { useState } from "react";
import { useDispatch } from "react-redux";
import { createGroup } from "../../../store/features/supportGroups/supportGroupsSlice";
import {
    Box,
    Button,
    Container,
    FormControl,
    InputAdornment,
    TextField,
    Typography,
    Select,
    MenuItem,
    InputLabel,
    Paper,
    Alert
} from "@mui/material";

const CreateGroup = () => {
    // Define state variables for group creation
    const [groupName, setGroupName] = useState("");
    const [groupDescription, setGroupDescription] = useState("");
    const [groupCategory, setGroupCategory] = useState("General");
    const [isPrivate, setIsPrivate] = useState(false);
    const [created, setCreated] = useState(false);
    const [error, setError] = useState("");

    // Get the Redux dispatch function
    const dispatch = useDispatch();

    // Handle creation of a new group
    const handleCreateGroup = async () => {
        // Validate inputs
        if (!groupName.trim()) {
            setError("Group name is required");
            return;
        }
        
        if (!groupDescription.trim()) {
            setError("Group description is required");
            return;
        }

        try {
            // Dispatch the createGroup action with all group data
            const result = await dispatch(createGroup({
                name: groupName.trim(),
                description: groupDescription.trim(),
                category: groupCategory,
                isPrivate: isPrivate,
                createdBy: 'User' // Would get from auth in real app
            }));

            if (result) {
                setCreated(true);
                setError("");
                // Clear form
                setGroupName("");
                setGroupDescription("");
                setGroupCategory("General");
                setIsPrivate(false);
            }
        } catch (err) {
            setError("Failed to create group. Please try again.");
        }
    };

    // Render the form for creating a new group
    return (
        <Container sx={{ paddingTop: 2, paddingBottom: 2 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                    Create a Support Group
                </Typography>
                
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                
                {created && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Group created successfully!
                    </Alert>
                )}
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Group Name"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        fullWidth
                        required
                    />
                    
                    <TextField
                        label="Group Description"
                        value={groupDescription}
                        onChange={(e) => setGroupDescription(e.target.value)}
                        multiline
                        rows={3}
                        fullWidth
                        required
                    />
                    
                    <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={groupCategory}
                            onChange={(e) => setGroupCategory(e.target.value)}
                            label="Category"
                        >
                            <MenuItem value="General">General</MenuItem>
                            <MenuItem value="Anxiety">Anxiety</MenuItem>
                            <MenuItem value="Depression">Depression</MenuItem>
                            <MenuItem value="Mindfulness">Mindfulness</MenuItem>
                            <MenuItem value="Trauma">Trauma</MenuItem>
                            <MenuItem value="Addiction">Addiction</MenuItem>
                            <MenuItem value="Relationships">Relationships</MenuItem>
                        </Select>
                    </FormControl>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">
                            Private Group (only visible to members)
                        </Typography>
                        <Button
                            variant={isPrivate ? "contained" : "outlined"}
                            onClick={() => setIsPrivate(!isPrivate)}
                        >
                            {isPrivate ? "Private" : "Public"}
                        </Button>
                    </Box>
                    
                    <Button
                        variant="contained"
                        onClick={handleCreateGroup}
                        fullWidth
                        size="large"
                        sx={{ mt: 2 }}
                    >
                        Create Group
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default CreateGroup;
