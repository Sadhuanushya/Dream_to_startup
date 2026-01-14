import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios from "axios"

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async ({ userId, otherUserId }, { rejectWithValue }) => {
    try {
      // Axios handles the JSON parsing automatically
      const response = await axios.get(`http://localhost:3080/api/messages/get/${userId}/${otherUserId}`);
      
      // Axios stores the actual data in the .data property
      return response.data;
    } catch (error) {
      // If the server returns a 404, 500, etc., it lands here
      return rejectWithValue(error.response?.data || 'Failed to fetch messages');
    }
  }
);
export const sendMessages = createAsyncThunk(
  'chat/sendMessages',
  async (msgData, { rejectWithValue }) => {
    try {
        console.log("api call working")
      // Axios handles the JSON parsing automatically
      const response = await axios.post('http://localhost:3080/api/messages/send',msgData);
      
      // Axios stores the actual data in the .data property
      console.log('response message',response.data)
      return response.data;
    } catch (error) {
      // If the server returns a 404, 500, etc., it lands here
      return rejectWithValue(error.response?.data || 'Failed to fetch messages');
    }
  }
);

const MessageSlice = createSlice({
  name: 'Message',
  initialState: {
    messages: [],
    setReceiver:null,
    loading: false,
    typingStatus: false,
    onlineStatus: 'connecting'
  },
  reducers: {

    setTyping: (state, action) => {
      state.typingStatus = action.payload;
    },
    setReceiver: (state, action) => {
      state.setReceiver= action.payload;
    },
    setOnlineStatus: (state, action) => {
      state.onlineStatus = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => { state.loading = true; })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state) => { state.loading = false; })
      .addCase(sendMessages.fulfilled,(state, action) => {
    //   // Check for duplicates to prevent double-rendering
    //   const exists = state.messages.find(m => m._id === action.payload._id);
         state.messages.push(action.payload);
    
});
  }
});
export const { setReceiver,addMessage, setTyping, setOnlineStatus } = MessageSlice.actions;
export default MessageSlice.reducer;
