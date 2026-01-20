import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";

export const fetchInvestorsList = createAsyncThunk(
    "Investor/fetchInvestorList",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get("http://localhost:3080/api/Investors", {
                headers: { Authorization: token }
            });
            console.log(response.data, "investorList");
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.response?.data || 'Failed to fetch investors');
        }
    }
);

export const submitInvestorProfile = createAsyncThunk(
    "Investor/submitProfile",
    async (formData, { rejectWithValue }) => {
        try {
            console.log("Investor profile submission started");
            const token = localStorage.getItem('token');
            
            // formData is already FormData object with proper field notation
            const response = await axios.post("http://localhost:3080/api/Investor", formData, {
                headers: {
                    Authorization: token
                }
            });
            
            console.log("Investor profile submission successful", response.data);
            return response.data;
        } catch (err) {
            console.log("Investor profile submission error:", err);
            return rejectWithValue(err.response?.data?.message || err.response?.data || 'Submission failed');
        }
    }
);

const InvestorSlice = createSlice({
    name: "Investor",
    initialState: {
        data: [],
        profiledata: null,
        listLoading: false,
        listError: null,
        submitLoading: false,
        submitError: null,
        submitSuccess: false,
        serverErrors: null
    },
    reducers: {
        resetInvestorError: (state) => {
            state.submitError = null;
        },
        resetInvestorSuccess: (state) => {
            state.submitSuccess = false;
        },
        resetListError: (state) => {
            state.listError = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch Investors List
        builder
            .addCase(fetchInvestorsList.pending, (state) => {
                state.listLoading = true;
                state.listError = null;
            })
            .addCase(fetchInvestorsList.fulfilled, (state, action) => {
                state.listLoading = false;
                state.data = Array.isArray(action.payload) ? action.payload : action.payload?.data || [];
            })
            .addCase(fetchInvestorsList.rejected, (state, action) => {
                state.listLoading = false;
                state.listError = action.payload;
                state.data = [];
            });

        // Submit Profile
        builder
            .addCase(submitInvestorProfile.pending, (state) => {
                state.submitLoading = true;
                state.submitError = null;
                state.submitSuccess = false;
            })
            .addCase(submitInvestorProfile.fulfilled, (state, action) => {
                state.submitLoading = false;
                state.profiledata = action.payload;
                state.submitSuccess = true;
            })
            .addCase(submitInvestorProfile.rejected, (state, action) => {
                state.submitLoading = false;
                state.submitError = action.payload;
                state.submitSuccess = false;
            });
    }
});

export const { resetInvestorError, resetInvestorSuccess, resetListError } = InvestorSlice.actions;

export default InvestorSlice.reducer;