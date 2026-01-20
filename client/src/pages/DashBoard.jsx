import { Link, NavLink, Outlet } from "react-router-dom";
import { FiBell, FiSearch, FiUser, FiSettings, FiBriefcase } from "react-icons/fi";
import { useContext } from "react";
import UserContext from "../Context/UserContext";
export default function Dashboard() {
const {user}=useContext(UserContext);
console.log("dashboard user",user)
  const sections = [
    { name: "Investors", to: "investors" },
    { name: "Entrepreneurs", to: "entrepreneurs" },
    { name: "Pitch", to: "Pitch" },
    { name: "Messages", to: "message" },
    { name: "Subscription", to: "subscription" }
  ];

  return (
    <div className="flex flex-col w-screen min-h-screen bg-slate-50 font-sans selection:bg-indigo-100">
      
      {/* Top Navbar */}
      <header className="bg-white px-8 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 z-50">
        
        {/* Logo/Brand Area */}
        <div className="flex items-center gap-3 mr-8">
           <div className="bg-indigo-600 p-1.5 rounded-lg shadow-md shadow-indigo-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 16.5c-1.5 1.26-2 3.4-2 3.4s2.14-.5 3.4-2c1.76 1.35 4.31 1.05 5.7-.7l9-11c.7-.85.75-2.1.15-3-.6-.9-1.85-1.1-2.7-.4l-11 9c-1.75 1.39-2.05 3.94-.7 5.7Z"/>
              </svg>
           </div>
           <span className="font-black text-slate-800 tracking-tighter text-lg hidden md:block ">DreamToStartup</span>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search startups, investors..."
            className="w-full bg-slate-100 border-none rounded-2xl py-2.5 px-12 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6 ml-8">
          <NavLink to='account' className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition flex items-center gap-2">
            <FiUser className="text-lg" />
            <span className="hidden sm:inline">Account</span>
          </NavLink>

          {/* 2. Wrapped the Notification Icon in a NavLink to the 'notifications' route */}
          <NavLink to="notifications" className={({ isActive }) => `relative cursor-pointer group p-2 rounded-full transition-all ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600'}`}>
            <FiBell className="text-xl group-hover:text-indigo-600 transition" />
            <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center border-2 border-white">
              5
            </span>
          </NavLink>
        </div>
      </header>

      {/* Horizontal Nav Bar (Pill style) */}
      <section className="bg-white border-b border-slate-100 px-8 py-3 overflow-x-auto no-scrollbar">
        <div className="flex gap-3 max-w-7xl mx-auto">
          {sections.map((section) => (
            <NavLink
              key={section.name}
              to={section.to}
              className={({ isActive }) => 
                `flex-none px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                  isActive 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-indigo-600"
                }`
              }
            >
              {section.name}
            </NavLink>
          ))}
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 px-8 py-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-wrap gap-4 mb-8">
           <Link to="admin" className="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl border border-slate-200 text-xs font-black text-slate-700 uppercase tracking-widest hover:border-indigo-300 hover:shadow-sm transition-all shadow-sm">
             <FiSettings className="text-indigo-600" /> Admin Panel
           </Link>
           {user?.role == "entrepreneur" && <Link to="entrepreneurProfile" className="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl border border-slate-200 text-xs font-black text-slate-700 uppercase tracking-widest hover:border-indigo-300 hover:shadow-sm transition-all shadow-sm">
             <FiBriefcase className="text-indigo-600" /> Entreprenuer Profile
           </Link>}
          {user?.role == "investor" && <Link to="InvestorProfile" className="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl border border-slate-200 text-xs font-black text-slate-700 uppercase tracking-widest hover:border-indigo-300 hover:shadow-sm transition-all shadow-sm">
             <FiUser className="text-indigo-600" /> Investor Profile
           </Link>} 

           <Link to="subscription" className="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl border border-slate-200 text-xs font-black text-slate-700 uppercase tracking-widest hover:border-indigo-300 hover:shadow-sm transition-all shadow-sm">
             <FiUser className="text-indigo-600" /> Subscription
           </Link>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 min-h-[60vh]">
           <Outlet />
        </div>
      </main>
    </div>
  );
}