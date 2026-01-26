import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchNotifications = createAsyncThunk(
    "notifications/fetch",
    async (sender, { rejectWithValue }) => {
        console.log("fetchNotifications called with sender:", sender);
        try {
            console.log("receiver from fetch api",sender)
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3080/api/notifications/${sender}`, {
                headers: { Authorization: token }
            });
            console.log("fetch notifications",response.data)
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || 'Failed to fetch notifications');
        }
    }
);
export const fetchReceiverNotifications = createAsyncThunk(
    "notifications/receiverFetch",
    async (receiver, { rejectWithValue }) => {
        try {
            console.log("comes to fetch receiver notifications")
            console.log("1  receiver from fetch api",receiver)
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3080/api/notification/${receiver}`, {
                headers: { Authorization: token }
            });
            console.log("2  fetch notifications in slice",response.data)
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || 'Failed to fetch notifications');
        }
    }
);

export const getUnreadCount = createAsyncThunk(
    "notifications/getUnreadCount",
    async (userId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3080/api/notifications/unread/${userId}`, {
                headers: { Authorization: token }
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || 'Failed to get unread count');
        }
    }
);

export const createNotification = createAsyncThunk(
    "notifications/create",
    async (notificationData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post("http://localhost:3080/api/notifications", notificationData, {
                headers: { Authorization: token }
            });
            console.log("notify response",response.data)
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || 'Failed to create notification');
        }
    }
);

export const confirmConnection = createAsyncThunk(
    "notifications/confirmConnection",
    async (notificationId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `http://localhost:3080/api/notifications/${notificationId}/confirm`,
                {},
                { headers: { Authorization: token } }
            );
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || 'Failed to confirm connection');
        }
    }
);

export const rejectConnection = createAsyncThunk(
    "notifications/rejectConnection",
    async (notificationId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `http://localhost:3080/api/notifications/${notificationId}/reject`,
                {},
                { headers: { Authorization: token } }
            );
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || 'Failed to reject connection');
        }
    }
);

export const markAsRead = createAsyncThunk(
    "notifications/markAsRead",
    async (notificationId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `http://localhost:3080/api/notifications/${notificationId}/read`,
                {},
                { headers: { Authorization: token } }
            );
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || 'Failed to mark as read');
        }
    }
);

export const deleteNotification = createAsyncThunk(
    "notifications/delete",
    async (notificationId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3080/api/notifications/${notificationId}`, {
                headers: { Authorization: token }
            });
            return notificationId;
        } catch (err) {
            return rejectWithValue(err.response?.data || 'Failed to delete notification');
        }
    }
);

const NotificationSlice = createSlice({
    name: "notifications",
    initialState: {
        notifications: [],
        showNotifications:null,
        pending: [],
        unreadCount: 0,
        loading: false,
        error: null,
        success: false
    },
    reducers: {
        addNotificationOptimistic: (state, action) => {
            state.notifications.unshift(action.payload);
            state.unreadCount += 1;
        }
        ,
        setPending: (state, action) => {
            state.pending = action.payload;
        }   
    },
    extraReducers: (builder) => {
        // Fetch notifications
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Get unread count
        builder
            .addCase(getUnreadCount.fulfilled, (state, action) => {
                state.unreadCount = action.payload.unreadCount;
            });

        // Create notification
        builder
            .addCase(createNotification.fulfilled, (state, action) => {
                state.notifications.unshift(action.payload);
                state.unreadCount += 1;
                state.success = true;
            })
            .addCase(createNotification.rejected, (state, action) => {
                state.error = action.payload;
            });

        // Confirm connection
        builder
            .addCase(confirmConnection.fulfilled, (state, action) => {
                const index = state.notifications.findIndex(n => n._id === action.payload._id);
                if (index !== -1) {
                    state.notifications[index] = action.payload;
                }
                state.success = true;
            });

        // Reject connection
        builder
            .addCase(rejectConnection.fulfilled, (state, action) => {
                const index = state.notifications.findIndex(n => n._id === action.payload._id);
                if (index !== -1) {
                    state.notifications[index] = action.payload;
                }
                state.success = true;
            });

        // Mark as read
        builder
            .addCase(markAsRead.fulfilled, (state, action) => {
                const index = state.notifications.findIndex(n => n._id === action.payload._id);
                if (index !== -1) {
                    state.notifications[index] = action.payload;
                }
            });

        // Delete notification
        builder
            .addCase(deleteNotification.fulfilled, (state, action) => {
                state.notifications = state.notifications.filter(n => n._id !== action.payload);
            })
            .addCase(fetchReceiverNotifications.fulfilled, (state, action) => {
                state.showNotifications= action.payload;
            });
   } })
    ;
        export const { addNotificationOptimistic ,setPending} = NotificationSlice.actions;
export default NotificationSlice.reducer;
