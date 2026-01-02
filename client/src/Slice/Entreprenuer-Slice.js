import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
const EntrepreneurSlice=createSlice({
    name:'Entrepreneur',
    initialState:{
        profileFormData:[],
        loading:false,
        serverErrors:null
    },
    reducers:{},
        extraReducers:(builder)=>{
            builder
            .addCase(fetchInvestersList.fulfilled,(state,action)=>{
                state.data.push(action.payload)
            })
        }
    })
    export default Entreprenuer.reducer;