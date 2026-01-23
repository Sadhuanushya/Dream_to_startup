import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

/* ===================== THUNKS ===================== */

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async ({ userId, otherUserId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `http://localhost:3080/api/messages/get/${userId}/${otherUserId}`,
        { headers: { Authorization: token } }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch messages");
    }
  }
);

export const fetchConversations = createAsyncThunk(
  "chat/fetchConversations",
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `http://localhost:3080/api/messages/conversations/${userId}`,
        { headers: { Authorization: token } }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch conversations");
    }
  }
);

export const sendMessages = createAsyncThunk(
  "chat/sendMessages",
  async (msgData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        "http://localhost:3080/api/messages/send",
        msgData,
        { headers: { Authorization: token } }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to send message");
    }
  }
);

/* ===================== SLICE ===================== */

const MessageSlice = createSlice({
  name: "Message",
  initialState: {
    messages: [],
    conversations: [],
    loading: false,
    conversationLoading: false,
    typingStatus: false,
    onlineStatus: "connecting"
  },
  reducers: {
    setTyping(state, action) {
      state.typingStatus = action.payload;
    },

    setOnlineStatus(state, action) {
      state.onlineStatus = action.payload;
    },

    addMessage(state, action) {
      state.messages.push(action.payload);
    },


    clearMessages(state) {
      state.messages = [];
    }
  },
  extraReducers: (builder) => {
    builder
      /* Messages */
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state) => {
        state.loading = false;
      })

      /* Conversations */
      .addCase(fetchConversations.pending, (state) => {
        state.conversationLoading = true;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.conversationLoading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state) => {
        state.conversationLoading = false;
      })

      /* Send message */
      .addCase(sendMessages.fulfilled, () => {
        // ❗ Do nothing here
        // Message already added via socket event
      });
  }
});

export const {
  setTyping,
  setOnlineStatus,
  addMessage,
  clearMessages
} = MessageSlice.actions;

export default MessageSlice.reducer;
