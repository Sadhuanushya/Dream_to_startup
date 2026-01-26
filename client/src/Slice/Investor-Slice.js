import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";

export const fetchInvestorsList = createAsyncThunk(
    "Investor/fetchInvestorList",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            console.log("fetching from investorSlice");
            const response = await axios.get("http://localhost:3080/api/Investors", {
                headers: { Authorization: token }
            });
            console.log("investorList",response.data);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.response?.data || 'Failed to fetch investors');
        }
    }
);
export const fetchInvestor = createAsyncThunk(
    "Investor/fetchInvestor",
    async (id, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3080/api/Investor/${id}`, {
                headers: { Authorization: token }
            });
            console.log("investor from investor slice showed particular invester", response.data);
            return response.data;
        } catch (err) {
            console.log("error in fetching particular investor",err);
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

export const deleteInvestor = createAsyncThunk(
    "Investor/deleteProfile",
    async (id, { rejectWithValue }) => {
        try {
            console.log("Investor profile submission started");
            const token = localStorage.getItem('token');
            
            // formData is already FormData object with proper field notation
            const response = await axios.delete(`http://localhost:3080/api/Investor/${id}`,{
                headers: {
                    Authorization: token
                }
            });
            
            console.log("Investor profile deleted successful", response.data);
            return response.data;
        } catch (err) {
            console.log("Investor profile submission error:", err);
            return rejectWithValue(err.response?.data?.message || err.response?.data || 'Submission failed');
        }
    }
);
export const updateInvestorProfile = createAsyncThunk(
  "Investor/updateProfile",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      console.log("Updating investor profile...");
      const token = localStorage.getItem("token");

      // `formData` should be a FormData instance with all fields
      const response = await axios.put(
        `http://localhost:3080/api/Investor/${id}`,
        formData,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      console.log("Investor profile update success:", response.data);
      return response.data;
    } catch (err) {
      console.log("Investor profile update error:", err);
      return rejectWithValue(
        err.response?.data?.message || err.response?.data || "Update failed"
      );
    }
  }
);


const InvestorSlice = createSlice({
    name: "Investor",
    initialState: {
        data: [],
        profiledata: null,
        InvestorProfile:null,
        listLoading: false,
        listError: null,
        pendingRequest:[],
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
        },
        setPendingRequest:(state,action)=>{
            state.pendingRequest=action.payload;
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
            })
            .addCase(deleteInvestor.fulfilled,(state,action)=>{
                state?.profiledata.filter(ele=>{
                    return ele._id !== action.payload._id;
                })
            })
             .addCase(fetchInvestor.fulfilled,(state,action)=>{
                state.InvestorProfile=action.payload;
                
            })  
            .addCase(updateInvestorProfile.fulfilled, (state, action) => {
    // Save updated profile in both places
    state.profiledata = action.payload;
    state.InvestorProfile = action.payload;
    state.submitSuccess = true;

    // Update in master list if exists
    state.data = state.data.map((investor) =>
      investor._id === action.payload._id ? action.payload : investor
    );
})         
    }
});

export const { resetInvestorError, resetInvestorSuccess, resetListError,setPendingRequest } = InvestorSlice.actions;

export default InvestorSlice.reducer;