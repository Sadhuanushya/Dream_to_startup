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

export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:3080/api/messages/conversations/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch conversations');
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
    conversations: [],
    setReceiver:localStorage.getItem("receiverId")||null,
    loading: false,
    conversationLoading: false,
    typingStatus: false,
    onlineStatus: 'connecting'
  },
  reducers: {

    setTyping: (state, action) => {
      state.typingStatus = action.payload;
    },
    setReceiver: (state, action) => {
      state.setReceiver= action.payload;
      console.log("receiverId",state.setReceiver,action.payload)
      localStorage.setItem("receiverId",action.payload);
    },

    setOnlineStatus: (state, action) => {
      state.onlineStatus = action.payload;
    },

    addMessage: (state, action) => {
      state.messages.push(action.payload);
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
      .addCase(fetchConversations.pending, (state) => { state.conversationLoading = true; })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.conversationLoading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state) => { state.conversationLoading = false; })
      .addCase(sendMessages.fulfilled,(state, action) => {
         state.messages.push(action.payload);
    });
  }
});
export const { setReceiver, addMessage, setTyping, setOnlineStatus ,setSenderId} = MessageSlice.actions;
export default MessageSlice.reducer;
