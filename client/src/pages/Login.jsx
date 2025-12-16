import  {useState} from 'react';
import {useNavigate} from 'react-router-dom'
import axios from "axios";
export default function Login(){
    const navigate=useNavigate();
    const[form,SetForm]=useState({
    email:"",
    password:""
    })
    const[error,SetError]=useState({
        email:'',
        password:''
    })
const handleLogin=async()=>{
    SetError({email:'',password:''});
    let newErrors={}
    if(!form.email){
        newErrors.email='email required'
    }
    if(!form.password){
        newErrors.password='password required'
    }
    SetError(newErrors);
try{
    const login={
        email:form.email,
        password:form.password
    }
    const response=await axios.post('http://localhost:3080/api/login',login);
    localStorage.setItem('token',response.data.token);
    if(response.data){
        navigate('/dashboard')
    }

}catch(err){
    console.log(err)
    
}
}
    return(
        <>
        <div className="bg-gray-900 w-screen min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
          Login To Start
        </h2>
        <div className="mb-6">
        <label  htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1" >email</label>
        <input 
            id="email"
            type="text" 
            value={form.email} 
            placeholder="Enter email" 
            onChange={(e) => {
              SetForm({
      ...form, // Spread existing form values (e.g., keep the email)
      [e.target.id]: e.target.value // Update the specific field (password)
    });
            }} 
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"/>
        </div>
        <div className="mb-6">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">password</label>
         <input 
            id="password"
            type="text" 
            value={form.password} 
            placeholder="Enter password" 
            onChange={(e) => {
              SetForm({
      ...form, // Spread existing form values (e.g., keep the email)
      [e.target.id]: e.target.value // Update the specific field (password)
    });
            }} 
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"/>
         </div>
         
            <button
            type="submit"
            className="w-full bg-indigo-600 text-black p-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 shadow-md"
        onClick={handleLogin}>
            Login
        </button>
         
        </div>
        </div>
        </>
    )
}