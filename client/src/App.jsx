import React, { useState } from "react";

export default function App() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleRoleChange = (e) => {

    setRole(e.target.value);
  };
  console.log("username",username);
  console.log("email",email);
  console.log("password",password);
  console.log("role",role)
  
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
        </div>


        <button
            type="submit"
            className="w-full bg-indigo-600 text-black p-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 shadow-md"
        >
            Register
        </button>

      </div>
    </div>
  );
}