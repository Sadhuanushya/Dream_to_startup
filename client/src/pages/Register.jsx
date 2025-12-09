import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
  });
  const navigate = useNavigate();

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
  };
    
  const handleRegister = async () => {
    setErrors({ username: '', email: '', password: '', role: '' });
 

    let newErrors = {};
    if (!username) {
      newErrors.username = 'Username is required.';
    }
    if (!email) {
      newErrors.email = 'Email is required.';
    }
    if (!password) {
      newErrors.password = 'Password is required.';
    }
    if (!role) {
      newErrors.role = 'Role is required.';
    }
    
    setErrors(newErrors);

    try {
      const RegisterPayload = {
        username,
        email,
        password,
        role
      };
      
      const response = await axios.post('http://localhost:3080/api/register', RegisterPayload);
      
      alert(response.data)
        
        // Clear form fields on success
        setUsername("");
        setEmail("");
        setPassword("");
        setRole("");
        
        // Navigate after a slight delay to allow message to show
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
     catch (err) {
      console.error("Registration Error:", err);
      
      // 3. FIXED: Properly extract and set the API error string to the general error state
      const apiErrorMessage = 
        err.response?.data?.message || 
        err.response?.data?.error?.details?.[0]?.message || 
        "An unknown error occurred during registration. Check server status.";
      
    }
  };

  return (
    <div className="bg-gray-900 w-screen min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
          Register and Join With Us
        </h2>
        

        <div className="mb-6">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input 
            id="username"
            type="text" 
            value={username} 
            placeholder="Enter Username" 
            onChange={(e) => {
              setUsername(e.target.value);
            }} 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
          />
         
          {errors.username && <p className="text-sm text-red-500 mt-1">{errors.username}</p>}
        </div>
        

        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input 
            id="email"
            type="email" 
            value={email} 
            placeholder="Enter Email" 
            onChange={(e) => {
              setEmail(e.target.value);
            }} 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
        </div>
        

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input 
            id="password"
            type="password" 
            value={password} 
            placeholder="Enter Password" 
            onChange={(e) => {
              setPassword(e.target.value);
            }} 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
          />
          {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
        </div>
        
        <div className="mb-8 space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Role (Current: {role || 'None'})
            </label>
            <div className="flex space-x-6">
                <label className="inline-flex items-center text-gray-700">
                    <input 
                        type="radio" 
                        name="role" 
                        value="Investor" 
                        checked={role === "Investor"}
                        onChange={handleRoleChange} 
                        className="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <span className="ml-2">Investor</span>
                </label>
                <label className="inline-flex items-center text-gray-700">
                    <input 
                        type="radio" 
                        name="role" 
                        value="Entrepreneur" 
                        checked={role === "Entrepreneur"}
                        onChange={handleRoleChange} 
                        className="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <span className="ml-2">Entrepreneur</span>
                </label>
            </div>
            {errors.role && <p className="text-sm text-red-500 mt-1">{errors.role}</p>}
        </div>


        <button
            type="button" // Use type="button" to prevent default form submission
            className="w-full bg-indigo-600 text-indigo-600 p-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 shadow-md"
            onClick={handleRegister}>
            Register
        </button>

      </div>
    
    </div>
    
  );
}
