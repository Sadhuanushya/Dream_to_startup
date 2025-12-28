import {configureStore} from "@reduxjs/toolkit";
import investerReducer from "../Slice/Invester-Slice";
import UserReducer from "../Slice/Users-Slice";
const createStore=()=>{
    return configureStore({
        reducer:{
            invester:investerReducer,
            Users:UserReducer
        }
    })
}
export default createStore;