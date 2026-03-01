import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3080";


export const createOrder = createAsyncThunk(
    "payment/createOrder",
    async (paymentData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API_URL}/payment/create-order`,
                paymentData,
                {
                    headers: {
                        Authorization: token
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


export const verifyPayment = createAsyncThunk(
    "payment/verifyPayment",
    async (verificationData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API_URL}/payment/verify`,
                verificationData,
                {
                    headers: {
                        Authorization: token
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.log("error in verify payment slice",error)
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


export const getPaymentHistory = createAsyncThunk(
    "payment/getHistory",
    async (EntrepreneurId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${API_URL}/payment/history/${EntrepreneurId}`,
                {
                    headers: {
                        Authorization: token
                    }
                }
            );
            console.log("payment history response",response.data)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


export const getPayment = createAsyncThunk(
    "payment/getPayment",
    async (paymentId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${API_URL}/payment/${paymentId}`,
                {
                    headers: {
                        Authorization: token
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const PaymentSlice = createSlice({
    name: "payment",
    initialState: {
        orders: [],
        currentOrder: null,
        paymentHistory: [],
        loading: false,
        error: null,
        success: false,
        message: "",
        razorpayKey: null
    },
    reducers: {
        resetPaymentState: (state) => {
            state.success = false;
            state.error = null;
            state.message = "";
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
       
        builder
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.currentOrder = action.payload;
                state.razorpayKey = action.payload.key;
                state.message = "Order created successfully";
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to create order";
                state.success = false;
            });

      
        builder
            .addCase(verifyPayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.currentOrder = action.payload.payment;
                state.message = "Payment verified successfully";
            })
            .addCase(verifyPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Payment verification failed";
                state.success = false;
            });

      
        builder
            .addCase(getPaymentHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPaymentHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.paymentHistory = action.payload.payments;
                state.success = true;
            })
            .addCase(getPaymentHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to fetch payment history";
            });

  
        builder
            .addCase(getPayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOrder = action.payload.payment;
                state.success = true;
            })
            .addCase(getPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to fetch payment";
            });
    }
});

export const { resetPaymentState, clearError } = PaymentSlice.actions;
export default PaymentSlice.reducer;
