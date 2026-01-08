import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import axios from "axios";

export const fetchInvestersList=createAsyncThunk("invester/fetchinvesterList",async(undefined,{rejectWithValue})=>{
    try{
        const response=await axios.get("http://localhost:3080/api/Investors",{headers:{Authorization:localStorage.getItem('token')}})
        console.log(response.data,"investorList")
        return response.data
    }catch(err){
        console.log(err)
    }
})
const InvestorSlice=createSlice({
    name:"Investor",
    initialState:{
        data:[],
        serverErrors:null
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchInvestersList.fulfilled,(state,action)=>{
            state.data=action.payload;
        })
    }
})
export default InvestorSlice.reducer;