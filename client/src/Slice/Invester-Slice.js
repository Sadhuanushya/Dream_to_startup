import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import axios from "axios";

export const fetchInvestersList=createAsyncThunk("invester/fetchinvesterList",async(undefined,{rejectWithValue})=>{
    try{
        const response=await axios.get("http://localhost:3080/api/Investers",{headers:{Authorization:localStorage.getItem('token')}})
        console.log(response.data,"investerList")
        return response.data
    }catch(err){
        console.log(err)
    }
})
const InvesterSlice=createSlice({
    name:"Invester",
    initialState:{
        data:[],
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
export default InvesterSlice.reducer;