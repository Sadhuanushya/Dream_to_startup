import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

export const fetchEntrepreneursList=createAsyncThunk("entrepreneurs/fetchentrepreneursList",async(undefined,{rejectWithValue})=>{
    try{
        const response=await axios.get("http://localhost:3080/api/entrepreneurs",{headers:{Authorization:localStorage.getItem('token')}})
        console.log(response.data,"entrepreneurs")
        return response.data
    }catch(err){
        console.log("server error",err)
    }
})

const EntrepreneurSlice=createSlice({
    name:'Entrepreneur',
    initialState:{
        data:[],
        loading:false,
        serverErrors:null
    },
    reducers:{},
        extraReducers:(builder)=>{
            builder
            .addCase(fetchEntrepreneursList.fulfilled,(state,action)=>{
                state.data=action.payload;
            })
        }
    })
    export default EntrepreneurSlice.reducer;