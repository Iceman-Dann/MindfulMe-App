import { createSlice } from "@reduxjs/toolkit";

export const moodSlice = createSlice({
  name: "mood",
  initialState: {
    loading: false,
    moods: [],
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setMoods: (state, action) => {
      state.moods = action.payload;
    },
  },
});

export const { setLoading, setMoods } = moodSlice.actions;

export const createMood = (moodData) => {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      // TODO: Implement mood creation without Firebase
      console.log("Mood creation disabled:", moodData);
      dispatch(setLoading(false));
    } catch (error) {
      console.error(error);
      dispatch(setLoading(false));
    }
  };
};

export const getMoods = (userId) => {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      // TODO: Implement mood fetching without Firebase
      dispatch(setMoods([]));
      dispatch(setLoading(false));
    } catch (error) {
      console.error(error);
      dispatch(setLoading(false));
    }
  };
};

export default moodSlice.reducer;
