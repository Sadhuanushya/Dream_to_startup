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
        case "Account":{
            return{...state,user:action.payload}
        }
        case "userId":{
            
            return {...state,senderId:action.payload}
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
        serverError:'',
        senderId:null
    });
    console.log("user",userState)
const handleAccount=async()=>{
        if(localStorage.getItem('token')){
                try{
                    console.log("fetching account details")
                    const response=await axios.get('http://localhost:3080/api/account',{headers:{Authorization:localStorage.getItem('token')}})
                    console.log("response",response.data)
                    userDispatch({type:"Account",payload:response.data})

                }catch(err){
                    console.log(err);

             }
        } 
    }
useEffect(() => {
  handleAccount();

}, []);
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
    localStorage.clear();
    localStorage.setItem('token',response.data.token);
    localStorage.setItem('userId',response.data.userId);
    localStorage.setItem('role',response.data.role);
    if(response.data){
        userDispatch({type:"userId",payload:response.data.userId})
        console.log("user id from login",response.data.userId)
        if(response.data.role == "entrepreneur"){
            navigate("/dashboard")
        }else if(response.data.role == "investor"){
            navigate("/dashboard")
        }else if(response.data.role == "admin"){
            navigate("/dashboard/admin")
        }else{
            navigate("/")
        }
        resetForm()
    }
    
    // console.log("response for login",response.data);

}catch(err){
    console.log(err)
    
}
console.log("user",userState);
    }
    return(
        <>
     
        <UserContext.Provider value={{...userState,handleRegister,handleLogin,handleAccount}}>
            {props.children}
        </UserContext.Provider>
        </>
    )
}