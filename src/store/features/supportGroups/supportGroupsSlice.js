import { createSlice } from "@reduxjs/toolkit";

export const supportGroupsSlice = createSlice({
  name: "supportGroups",
  initialState: {
    loading: false,
    groups: [],
    selectedGroup: null,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setGroups: (state, action) => {
      state.groups = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setLoading, setGroups, setError } = supportGroupsSlice.actions;

export const fetchGroups = () => {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      // Load groups from localStorage
      const storedGroups = JSON.parse(localStorage.getItem('supportGroups') || '[]');
      
      // If no groups exist, create some default ones
      if (storedGroups.length === 0) {
        const defaultGroups = [
          {
            id: 1,
            name: 'Anxiety Support',
            description: 'A safe space to share experiences and coping strategies for anxiety',
            members: 156,
            category: 'Anxiety',
            isPrivate: false,
            createdBy: 'System',
            createdAt: new Date().toISOString(),
            lastActivity: new Date().toISOString()
          },
          {
            id: 2,
            name: 'Depression Recovery',
            description: 'Support for those navigating depression and recovery',
            members: 203,
            category: 'Depression',
            isPrivate: false,
            createdBy: 'System',
            createdAt: new Date().toISOString(),
            lastActivity: new Date().toISOString()
          },
          {
            id: 3,
            name: 'Mindfulness Practice',
            description: 'Share mindfulness techniques and meditation experiences',
            members: 89,
            category: 'Mindfulness',
            isPrivate: false,
            createdBy: 'System',
            createdAt: new Date().toISOString(),
            lastActivity: new Date().toISOString()
          }
        ];
        localStorage.setItem('supportGroups', JSON.stringify(defaultGroups));
        dispatch(setGroups(defaultGroups));
      } else {
        dispatch(setGroups(storedGroups));
      }
      dispatch(setLoading(false));
    } catch (error) {
      console.error(error);
      dispatch(setError(error.message));
      dispatch(setLoading(false));
    }
  };
};

export const createGroup = (groupData) => {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      
      // Get existing groups
      const existingGroups = JSON.parse(localStorage.getItem('supportGroups') || '[]');
      
      // Create new group with ID and timestamps
      const newGroup = {
        id: Date.now(),
        ...groupData,
        members: 1, // Creator is first member
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      };
      
      // Add to groups array
      const updatedGroups = [...existingGroups, newGroup];
      
      // Save to localStorage
      localStorage.setItem('supportGroups', JSON.stringify(updatedGroups));
      
      // Update Redux state
      dispatch(setGroups(updatedGroups));
      dispatch(setLoading(false));
      
      return newGroup;
    } catch (error) {
      console.error(error);
      dispatch(setError(error.message));
      dispatch(setLoading(false));
      return null;
    }
  };
};

export const selectGroups = (state) => state.supportGroups.groups;

export default supportGroupsSlice.reducer;
