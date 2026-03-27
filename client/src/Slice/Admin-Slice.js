import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAdminStats = createAsyncThunk(
    "admin/fetchStats",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get("http://localhost:3080/api/admin/statistics", {
                headers: { Authorization: token }
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || 'Failed to fetch statistics');
        }
    }
);


export const fetchAllUsers = createAsyncThunk(
    "admin/fetchAllUsers",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get("http://localhost:3080/api/users/all", {
                headers: { Authorization: token }
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || 'Failed to fetch users');
        }
    }
);
export const deleteUser=createAsyncThunk('Users/deleteUser',async(id,{rejectWithValue})=>{
    try{
        const response=await axios.delete(`http://localhost:3080/api/user/${id}`,{headers:{Authorization:localStorage.getItem('token')}})
        console.log("updated account from user slice",response.data)
        return id;
    }catch(err){
        return rejectWithValue(err.response?.data?.error || 'Failed to update account');
    }
})
export const fetchAllEntrepreneurs = createAsyncThunk(
    "admin/fetchAllEntrepreneurs",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get("http://localhost:3080/api/Entrepreneurs", {
                headers: { Authorization: token }
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || 'Failed to fetch entrepreneurs');
        }
    }
);

export const fetchAllInvestors = createAsyncThunk(
    "admin/fetchAllInvestors",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get("http://localhost:3080/api/Investors", {
                headers: { Authorization: token }
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || 'Failed to fetch investors');
        }
    }
);

export const fetchAllPitches = createAsyncThunk(
    "admin/fetchAllPitches",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get("http://localhost:3080/api/Pitch", {
                headers: { Authorization: token }
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || 'Failed to fetch pitches');
        }
    }
);

export const fetchPendingVerifications = createAsyncThunk(
    "admin/fetchPendingVerifications",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get("http://localhost:3080/api/admin/pending-verifications", {
                headers: { Authorization: token }
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || 'Failed to fetch pending verifications');
        }
    }
);
export const ApproveInvestor = createAsyncThunk(
    "admin/approveInvestor",
    async (investorId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `http://localhost:3080/api/admin/${investorId}`,
                {},
                { headers: { Authorization: token } }
            );
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || 'Failed to approve investor');
        }
    }
);

export const RejectInvestor = createAsyncThunk(
    "admin/rejectInvestor",
    async (investorId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `http://localhost:3080/api/admin/reject-investor/${investorId}`,                    
                {},
                { headers: { Authorization: token } }
            );
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || 'Failed to reject investor');
        }           
})
const AdminSlice = createSlice({
    name: "admin",
    initialState: {
        stats: {
            totalUsers: 0,
            totalEntrepreneurs: 0,
            totalInvestors: 0,
            totalPitches: 0,
            pendingVerifications: 0
        },
        users: [],
        entrepreneurs: [],
        investors: [],
        pitches: [],
        pendingVerifications: [],
        statsLoading: false,
        usersLoading: false,
        entrepreneursLoading: false,
        investorsLoading: false,
        pitchesLoading: false,
        pendingVerificationsLoading: false,
        statsError: null,
        usersError: null,
        entrepreneursError: null,
        investorsError: null,
        pitchesError: null,
        pendingVerificationsError: null
    },
    reducers: {},
    extraReducers: (builder) => {
      
        builder
            .addCase(fetchAdminStats.pending, (state) => {
                state.statsLoading = true;
                state.statsError = null;
            })
            .addCase(fetchAdminStats.fulfilled, (state, action) => {
                state.statsLoading = false;
                state.stats = action.payload;
            })
            .addCase(fetchAdminStats.rejected, (state, action) => {
                state.statsLoading = false;
                state.statsError = action.payload;
            })
            .addCase(deleteUser.fulfilled,(state,action)=>{
            state.users=state.users.filter(ele=>{
                return ele._id!=action.payload
            })
        })

       
        builder
            .addCase(fetchAllUsers.pending, (state) => {
                state.usersLoading = true;
                state.usersError = null;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.usersLoading = false;
                state.users = action.payload;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.usersLoading = false;
                state.usersError = action.payload;
            });


        builder
            .addCase(fetchAllEntrepreneurs.pending, (state) => {
                state.entrepreneursLoading = true;
                state.entrepreneursError = null;
            })
            .addCase(fetchAllEntrepreneurs.fulfilled, (state, action) => {
                state.entrepreneursLoading = false;
                state.entrepreneurs = action.payload;
            })
            .addCase(fetchAllEntrepreneurs.rejected, (state, action) => {
                state.entrepreneursLoading = false;
                state.entrepreneursError = action.payload;
            });

     
        builder
            .addCase(fetchAllInvestors.pending, (state) => {
                state.investorsLoading = true;
                state.investorsError = null;
            })
            .addCase(fetchAllInvestors.fulfilled, (state, action) => {
                state.investorsLoading = false;
                state.investors = action.payload;
            })
            .addCase(fetchAllInvestors.rejected, (state, action) => {
                state.investorsLoading = false;
                state.investorsError = action.payload;
            })
            .addCase(ApproveInvestor.fulfilled, (state, action) => {
                const index = state.investors.findIndex(inv => inv._id === action.payload._id);
                if (index !== -1) {
                    state.investors[index] = action.payload;
                }
            })
            .addCase(RejectInvestor.fulfilled, (state, action) => {
                const index = state.investors.findIndex(inv => inv._id === action.payload._id);
                if (index !== -1) {
                    state.investors[index] = action.payload;
                }
            });

      
        builder
            .addCase(fetchAllPitches.pending, (state) => {
                state.pitchesLoading = true;
                state.pitchesError = null;
            })
            .addCase(fetchAllPitches.fulfilled, (state, action) => {
                state.pitchesLoading = false;
                state.pitches = action.payload;
            })
            .addCase(fetchAllPitches.rejected, (state, action) => {
                state.pitchesLoading = false;
                state.pitchesError = action.payload;
            });

      
        builder
            .addCase(fetchPendingVerifications.pending, (state) => {
                state.pendingVerificationsLoading = true;
                state.pendingVerificationsError = null;
            })
            .addCase(fetchPendingVerifications.fulfilled, (state, action) => {
                state.pendingVerificationsLoading = false;
                state.pendingVerifications = action.payload;
            })
            .addCase(fetchPendingVerifications.rejected, (state, action) => {
                state.pendingVerificationsLoading = false;
                state.pendingVerificationsError = action.payload;
            });
    }
});

export default AdminSlice.reducer;

