import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import axios from "axios";

export const fetchPitchList=createAsyncThunk("Pitch/fetchPitchList",async(undefined,{rejectWithValue})=>{
    try{
        const response=await axios.get("http://localhost:3080/api/Pitch",{headers:{Authorization:localStorage.getItem('token')}})
        console.log(response.data,"PitchList")
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch pitches')
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
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch AI review')
    }
})

export const submitPitch=createAsyncThunk("Pitch/submitPitch",async(formData,{rejectWithValue})=>{
    try{
        const token=localStorage.getItem('token')
        const response=await axios.post("http://localhost:3080/api/Pitch",formData,{
            headers:{
                Authorization:token,
                
            }
        })
        console.log(response.data,"Pitch submitted successfully")
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response?.data?.message || 'Failed to upload pitch')
    }
})
const PitchSlice=createSlice({
    name:"Pitch",
    initialState:{
        data:[],
        AiReview:null,
        submitLoading:false,
        submitError:null,
        submitSuccess:false,
        serverErrors:null
    },
    reducers:{
        resetPitchSuccess:(state)=>{
            state.submitSuccess=false
        },
        resetPitchError:(state)=>{
            state.submitError=null
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(fetchPitchList.fulfilled,(state,action)=>{
            state.data=action.payload;
        })
        .addCase(fetchAiReview.fulfilled,(state,action)=>{
            state.AiReview=action.payload;
        })
        .addCase(submitPitch.pending,(state)=>{
            state.submitLoading=true
            state.submitError=null
            state.submitSuccess=false
        })
        .addCase(submitPitch.fulfilled,(state,action)=>{
            state.submitLoading=false
            state.submitSuccess=true
            state.data.push(action.payload)
        })
        .addCase(submitPitch.rejected,(state,action)=>{
            state.submitLoading=false
            state.submitError=action.payload
            state.submitSuccess=false
        })
    }
})

export const {resetPitchSuccess,resetPitchError}=PitchSlice.actions
export default PitchSlice.reducer;