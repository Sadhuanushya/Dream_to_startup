import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createStory = createAsyncThunk(
  "story/createStory",
  async (storyData, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:3080/api/story", storyData); 
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to create story");
    }
  }
);


export const getAllStories = createAsyncThunk(
  "story/getAllStories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:3080/api/story");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch stories");
    }
  }
);


export const deleteStory = createAsyncThunk(
  "story/deleteStory",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:3080/api/story/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete story");
    }
  }
);


const StorySlice = createSlice({
  name: "Stories",
  initialState: {
    loading: false,
    success: false,
    stories: [],
    error: null,
  },
  reducers: {
    resetStory: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
    
      .addCase(createStory.pending, (state) => {
        state.loading = true;
      })
      .addCase(createStory.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createStory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

   
      .addCase(getAllStories.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllStories.fulfilled, (state, action) => {
        state.loading = false;
        state.stories = action.payload;
      })
      .addCase(getAllStories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

   
      .addCase(deleteStory.fulfilled, (state, action) => {
        state.stories = state.stories.filter(
          (story) => story._id !== action.payload
        );
      });
  },
});

export const { resetStory } = StorySlice.actions;
export default StorySlice.reducer;
