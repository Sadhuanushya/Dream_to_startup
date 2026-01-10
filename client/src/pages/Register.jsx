import { useState } from "react";
import UserContext from "../Context/UserContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { handleRegister } = useContext(UserContext);
  const navigate = useNavigate();
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

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
  };

  const resetForm = () => {
    setErrors({ username: '', email: '', password: '', role: '' });
  };

  const handleSubmit = async () => {
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

    if (Object.keys(newErrors).length === 0) {
      const RegisterData = {
        username,
        email,
        password,
        role
      };
      handleRegister(RegisterData, resetForm);
    }
  };

  return (
    <div className="relative bg-slate-50 w-screen min-h-screen flex items-center justify-center p-6 overflow-hidden font-sans">
      {/* Background radial glow matching Home/Login */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent -z-0"></div>

      <div className="relative z-10 bg-white p-10 rounded-[2.5rem] shadow-xl shadow-indigo-100/50 border border-slate-100 w-full max-w-lg">
        <h2 className="text-4xl font-black text-slate-800 mb-2 text-center tracking-tighter">
          Create Account
        </h2>
        <p className="text-slate-500 text-center mb-8 font-medium">Join the Dream to Startup community</p>

        {/* Username Field */}
        <div className="mb-5">
          <label htmlFor="username" className="block text-sm font-bold text-slate-700 mb-2 ml-1 uppercase tracking-wider">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            placeholder="johndoe123"
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
          />
          {errors.username && <p className="text-xs text-red-500 mt-2 font-bold ml-1">{errors.username}</p>}
        </div>

        {/* Email Field */}
        <div className="mb-5">
          <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2 ml-1 uppercase tracking-wider">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            placeholder="name@company.com"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
          />
          {errors.email && <p className="text-xs text-red-500 mt-2 font-bold ml-1">{errors.email}</p>}
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-2 ml-1 uppercase tracking-wider">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
          />
          {errors.password && <p className="text-xs text-red-500 mt-2 font-bold ml-1">{errors.password}</p>}
        </div>

        {/* Role Selection */}
        <div className="mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">
            I am a...
          </label>
          <div className="flex space-x-8">
            <label className="inline-flex items-center cursor-pointer group">
              <input
                type="radio"
                name="role"
                value="investor"
                checked={role === "investor"}
                onChange={handleRoleChange}
                className="form-radio h-5 w-5 text-indigo-600 border-slate-300 focus:ring-indigo-500"
              />
              <span className="ml-2 font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">Investor</span>
            </label>
            <label className="inline-flex items-center cursor-pointer group">
              <input
                type="radio"
                name="role"
                value="entrepreneur"
                checked={role === "entrepreneur"}
                onChange={handleRoleChange}
                className="form-radio h-5 w-5 text-indigo-600 border-slate-300 focus:ring-indigo-500"
              />
              <span className="ml-2 font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">Entrepreneur</span>
            </label>
          </div>
          {errors.role && <p className="text-xs text-red-500 mt-2 font-bold">{errors.role}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="button"
          className="w-full bg-indigo-600 text-black p-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95 mb-6"
          onClick={handleSubmit}>
          Create Account
        </button>

        {/* Already have account redirect */}
        <p className="text-center text-slate-500 font-medium">
          Already have an account?{" "}
          <button 
            onClick={() => navigate("/login")} 
            className="text-indigo-600 font-bold hover:underline underline-offset-4"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}