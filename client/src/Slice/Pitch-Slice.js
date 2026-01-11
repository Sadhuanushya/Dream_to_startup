import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import axios from "axios";
export const fetchPitchList=createAsyncThunk("Pitch/fetchPitchList",async(undefined,{rejectWithValue})=>{
    try{
        const response=await axios.get("http://localhost:3080/api/Pitch",{headers:{Authorization:localStorage.getItem('token')}})
        console.log(response.data,"PitchList")
        return response.data
    }catch(err){
        console.log(err)
    }
})
export const fetchAiReview=createAsyncThunk("AiReview/AiReview",async(id,{rejectWithValue})=>{
    try{
        const response=await axios.get(`http://localhost:3080/api/Aireview/${id}`,{headers:{Authorization:localStorage.getItem('token')}})
        console.log(response.data,"AiReview")
        console.log("id",id)
        return response.data
    }catch(err){
        console.log(err)
    }
})
const PitchSlice=createSlice({
    name:"Pitch",
    initialState:{
        data:[],
        AiReview:null,
        serverErrors:null
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchPitchList.fulfilled,(state,action)=>{
            state.data=action.payload;
        })
        .addCase(fetchAiReview.fulfilled,(state,action)=>{
            state.AiReview=action.payload;
        })
    }
})
export default PitchSlice.reducer;