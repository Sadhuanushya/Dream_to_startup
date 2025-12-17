import { useEffect, useReducer } from "react"
import UserContext from "../Context/UserContext"
import axios from 'axios';
import {useNavigate} from "react-router-dom"


const userReducer=(state,action)=>{
    console.log(state);
    switch(action.type){
        case "SET_SERVER_ERRORS":{
            return{...state,serverError:action.payload}
        }
        default:{
            return {...state}
        }
    }
}
export default function AuthProvider(props){
    const navigate=useNavigate();
    const[userState,userDispatch]=useReducer(userReducer,{
        user:null,
        serverError:''
    })
    useEffect(()=>{
        if(localStorage.getItem('token')){
            const fetchUserData=async()=>{
                try{
                    const response=await axios.get('http://localhost:3080/api/account')
                    console.log(response.data)
                    userDispatch({type:"Account",payload:response.data})

                }catch(err){
                    console.log(err);

                }
            }
            fetchUserData();
        }
    },[]);
    const handleRegister=async(RegisterData,resetForm)=>{
         try {
      const response = await axios.post('http://localhost:3080/api/register', RegisterData);
      console.log(response.data.user.username)
      
     alert('Successfully Registerd');
     resetForm();
     navigate("/login");
   
      }
     catch (err) {
      console.error("Registration Error:", err);
        userDispatch({type:"SET_SERVER_ERRORS",payload:err.response?.data?.error?.details?.[0]?.message})
     }
    }
const handleLogin=async(loginData,resetForm)=>{   
try{
    const response=await axios.post('http://localhost:3080/api/login',loginData);
    localStorage.setItem('token',response.data.token);
    if(response.data){
        navigate('/dashboard')
        resetForm()
    }

}catch(err){
    console.log(err)
    
}
    }
    return(
        <>
        <UserContext.Provider value={{...userState,handleRegister,handleLogin}}>
            {props.children}
        </UserContext.Provider>
        </>
    )
}