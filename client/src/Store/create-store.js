import {configureStore} from "@reduxjs/toolkit";
import investorReducer from "../Slice/Invester-Slice";
import UserReducer from "../Slice/Users-Slice";
import EntrepreneurReducer from "../Slice/Entreprenuer-Slice"
import PitchReducer from "../Slice/Pitch-Slice"
const createStore=()=>{
    return configureStore({
        reducer:{
            investor:investorReducer,
            Users:UserReducer,
            Entrepreneur:EntrepreneurReducer,
            Pitch:PitchReducer
        }
    })
}
export default createStore;