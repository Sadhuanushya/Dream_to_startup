import {createSlice,createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUsersList=createAsyncThunk('Users/list',async(undefined,{rejectWithValue})=>{
    try{
        const response=await axios.get('http://localhost:3080/api/Entrepreneurs',{headers:{Authorization:localStorage.getItem('token')}})
        console.log("response",response.data)
        return response.data;

    }catch(err){
        console.log(err);
    }
})
const UsersSlice=createSlice({
    name:'Users',
    initialState:{
        data:[],
        errors:"",
        loading:false,
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchUsersList.fulfilled,(state,action)=>{
            state.data.push(action.payload)
        })
    }
})

export default UsersSlice.reducer;