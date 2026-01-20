import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

export const fetchEntrepreneursList = createAsyncThunk(
    "entrepreneurs/fetchList",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get("http://localhost:3080/api/Entrepreneurs", {
                headers: {
                    Authorization: token
                }
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.response?.data || 'Failed to fetch entrepreneurs');
        }
    }
);

export const submitEntrepreneurProfile = createAsyncThunk(
    "entrepreneurs/submitProfile",
    async (formData, { rejectWithValue }) => {
        try {
            console.log("its came to entreprenuer slice")
            const token = localStorage.getItem('token');
             console.log("token got")
            // If formData is already FormData object, use it directly
            // Otherwise, create a new FormData
            let multipartFormData = formData;
            if (!(formData instanceof FormData)) {
                multipartFormData = new FormData();
                 console.log("its came to multiformdtata")
                multipartFormData.append('fullname', formData.fullname);
                multipartFormData.append('email', formData.email);
                multipartFormData.append('phone', formData.phone);
                multipartFormData.append('bio', formData.bio);
                multipartFormData.append('linkedinUrl', formData.linkedinUrl);
                multipartFormData.append('skills', JSON.stringify(Array.isArray(formData.skills) ? formData.skills : formData.skills.split(',')));
                multipartFormData.append('address', JSON.stringify(formData.address));
                multipartFormData.append('education', JSON.stringify(formData.education));
                multipartFormData.append('workExperience', JSON.stringify(formData.workExperience));
                multipartFormData.append('pastProject', JSON.stringify(formData.pastProject));
                 console.log("its came to after append")
                if (formData.profilePicture) multipartFormData.append('profilePicture', formData.profilePicture);
                if (formData.identityDocument) multipartFormData.append('identityDocument', formData.identityDocument);
                if (formData.BusinessRegistrationDocument) multipartFormData.append('BusinessRegistrationDocument', formData.BusinessRegistrationDocument);
            }
             console.log("its came to before api call")
            const response = await axios.post("http://localhost:3080/api/Entrepreneur", multipartFormData, {
                headers: {
                    Authorization: token
                }
            });
             console.log("its came to after api call")
            console.log(response.data);
            return response.data;
        } catch (err) {
            console.log(err)
            return rejectWithValue(err.response?.data?.message || err.response?.data || 'Submission failed');
        }
    }
);

const EntrepreneurSlice = createSlice({
    name: 'Entrepreneur',
    initialState: {
        data: [],
        profiledata: null,
        listLoading: false,
        listError: null,
        submitLoading: false,
        submitError: null,
        submitSuccess: false
    },
    reducers: {
        resetEntrepreneurError: (state) => {
            state.submitError = null;
        },
        resetEntrepreneurSuccess: (state) => {
            state.submitSuccess = false;
        },
        resetListError: (state) => {
            state.listError = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch Entrepreneurs List
        builder
            .addCase(fetchEntrepreneursList.pending, (state) => {
                state.listLoading = true;
                state.listError = null;
            })
            .addCase(fetchEntrepreneursList.fulfilled, (state, action) => {
                state.listLoading = false;
                state.data = Array.isArray(action.payload) ? action.payload : action.payload?.data || [];
            })
            .addCase(fetchEntrepreneursList.rejected, (state, action) => {
                state.listLoading = false;
                state.listError = action.payload;
                state.data = [];
            });

        // Submit Profile
        builder
            .addCase(submitEntrepreneurProfile.pending, (state) => {
                state.submitLoading = true;
                state.submitError = null;
                state.submitSuccess = false;
            })
            .addCase(submitEntrepreneurProfile.fulfilled, (state, action) => {
                state.submitLoading = false;
                state.profiledata = action.payload;
                state.submitSuccess = true;
            })
            .addCase(submitEntrepreneurProfile.rejected, (state, action) => {
                state.submitLoading = false;
                state.submitError = action.payload;
                state.submitSuccess = false;
            });
    }
});

export const { resetEntrepreneurError, resetEntrepreneurSuccess, resetListError } = EntrepreneurSlice.actions;

export default EntrepreneurSlice.reducer;