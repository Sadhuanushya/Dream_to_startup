
import { useNavigate } from "react-router-dom"
export default function Home(){
    const navigate=useNavigate();
    const handleRegister=()=>{
        navigate('/register')
    }
    const handleLogin=()=>{
        navigate('/login')
    }
    return(
        // bg-gray-900  min-h-screen flex items-center justify-center p-4
        <div className="flex flex-col items-center justify-center w-screen min-h-screen bg-gray-50 px-4">
        <h1 className="text-4xl font-bold text-navy-600 text-center mb-4">Dream to Startup</h1>
        <p className="text-center text-gray-700 max-w-md mb-2">Join a community of innovators and visionaries.</p>
        <p className="text-center text-gray-600 max-w-md mb-6">Create your profile, find investors, and start turning your dream project into a successful startup today.</p>
        <div className="flex space-x-4">
        <button onClick={handleRegister}  className="bg-indigo-600 hover:bg-indigo-700 text-gray font-semibold px-6 py-2 rounded-lg shadow-md transition">Register</button>
        <button onClick={handleLogin} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-2 rounded-lg shadow-md transition">Login</button>
        </div>
        </div>

    )
}