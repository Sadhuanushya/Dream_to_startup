import {configureStore} from "@reduxjs/toolkit";
import investerReducer from "../Slice/Invester-Slice";
const createStore=()=>{
    return configureStore({
        reducer:{
            invester:investerReducer
        }
    })
}
export default createStore;