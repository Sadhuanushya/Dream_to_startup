import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from '../Context/UserContext';

export default function Login() {
  const { handleLogin } = useContext(UserContext);
  const navigate = useNavigate();
  const [form, SetForm] = useState({
    email: "",
    password: ""
  });
  const [error, SetError] = useState({
    email: '',
    password: ''
  });

  const loginData = {
    email: form.email,
    password: form.password
  };

  const resetForm = () => {
    SetError({ email: '', password: '' });
  };

  const handleSubmit = () => {
    let newErrors = {};
    if (!form.email) {
      newErrors.email = 'email required';
    }
    if (!form.password) {
      newErrors.password = 'password required';
    }
    SetError(newErrors);
    handleLogin(loginData, resetForm);
  };

  return (
    <>
      {/* Background changed to slate-50 with radial glow to match Home page */}
      <div className="relative bg-slate-50 w-screen min-h-screen flex items-center justify-center p-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent -z-0"></div>

        {/* Card Styling matches Home page bento-style */}
        <div className="relative z-10 bg-white p-10 rounded-[2.5rem] shadow-xl shadow-indigo-100/50 border border-slate-100 w-full max-w-md">
          <h2 className="text-4xl font-black text-slate-800 mb-2 text-center tracking-tighter">
            Welcome Back
          </h2>
          <p className="text-slate-500 text-center mb-8 font-medium">Login to your startup portal</p>

          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2 ml-1 uppercase tracking-wider">Email Address</label>
            <input
              id="email"
              type="text"
              value={form.email}
              placeholder="name@company.com"
              onChange={(e) => {
                SetForm({
                  ...form,
                  [e.target.id]: e.target.value
                });
              }}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" />
            {error.email && <p className="text-xs text-red-500 mt-2 font-bold ml-1">{error.email}</p>}
          </div>

          <div className="mb-8">
            <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-2 ml-1 uppercase tracking-wider">Password</label>
            <input
              id="password"
              type="password" 
              value={form.password}
              placeholder="••••••••"
              onChange={(e) => {
                SetForm({
                  ...form,
                  [e.target.id]: e.target.value
                });
              }}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" />
            {error.password && <p className="text-xs text-red-500 mt-2 font-bold ml-1">{error.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-black  p-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
            onClick={handleSubmit}>
            Login
          </button>

          {/* New Line: Register redirect */}
          <p className="text-center mt-8 text-slate-500 font-medium">
            Don't have an account?{" "}
            <button 
              onClick={() => navigate("/register")} 
              className="text-indigo-600 font-bold hover:underline underline-offset-4"
            >
              Register now
            </button>
          </p>
        </div>
      </div>
    </>
  );
}