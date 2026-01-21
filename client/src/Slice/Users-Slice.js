import {createSlice,createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUsersList=createAsyncThunk('Users/list',async(undefined,{rejectWithValue})=>{
    try{
        const response=await axios.get('http://localhost:3080/api/users/all',{headers:{Authorization:localStorage.getItem('token')}})
        console.log("fetch all users from user slice",response.data)
        console.log("response",response.data)
        return response.data;

    }catch(err){
        console.log(err);
    }
})

export const fetchUserAccount=createAsyncThunk('Users/fetchAccount',async(undefined,{rejectWithValue})=>{
    try{
        const response=await axios.get('http://localhost:3080/api/account',{headers:{Authorization:localStorage.getItem('token')}})
        console.log("fetch account from user slice",response.data)
        return response.data;
    }catch(err){
        return rejectWithValue(err.response?.data?.error || 'Failed to fetch account');
    }
})

export const updateUserAccount=createAsyncThunk('Users/updateAccount',async(userData,{rejectWithValue})=>{
    try{
        const response=await axios.put('http://localhost:3080/api/account',userData,{headers:{Authorization:localStorage.getItem('token')}})
        console.log("updated account from user slice",response.data)
        return response.data;
    }catch(err){
        return rejectWithValue(err.response?.data?.error || 'Failed to update account');
    }
})

const UsersSlice=createSlice({
    name:'Users',
    initialState:{
        data:null,
        account:{},
        errors:"",
        loading:false,
        accountLoading:false,
        accountError:"",
        updateSuccess:false,
    },
    reducers:{
        resetUpdateSuccess:(state)=>{
            state.updateSuccess=false;
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(fetchUsersList.fulfilled,(state,action)=>{
            state.data=action.payload;
            console.log("user list",state.data)
        })
        .addCase(fetchUserAccount.pending,(state)=>{
            state.accountLoading=true;
            state.accountError="";
        })
        .addCase(fetchUserAccount.fulfilled,(state,action)=>{
            state.accountLoading=false;
            state.account=action.payload;
        })
        .addCase(fetchUserAccount.rejected,(state,action)=>{
            state.accountLoading=false;
            state.accountError=action.payload;
        })
        .addCase(updateUserAccount.pending,(state)=>{
            state.accountLoading=true;
            state.accountError="";
            state.updateSuccess=false;
        })
        .addCase(updateUserAccount.fulfilled,(state,action)=>{
            state.accountLoading=false;
            state.account=action.payload;
            state.updateSuccess=true;
        })
        .addCase(updateUserAccount.rejected,(state,action)=>{
            state.accountLoading=false;
            state.accountError=action.payload;
            state.updateSuccess=false;
        })
    }
})

export const {resetUpdateSuccess}=UsersSlice.actions;
export default UsersSlice.reducer;