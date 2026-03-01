import { Link, NavLink, Outlet } from "react-router-dom";
import { FiBell, FiUser,} from "react-icons/fi";
import { useContext, useEffect } from "react";
import "../style/dashboard.css";
import UserContext from "../Context/UserContext";
import {fetchUsersList} from "../Slice/Users-Slice"
import { useDispatch } from "react-redux";
export default function Dashboard() {
const {user}=useContext(UserContext);
console.log("dashboard user",user)
const dispatch=useDispatch();
  const sections = [
    { name: "Investors", to: "investors" ,allowedRoles: ["admin","entrepreneur"]},
    { name: "Entrepreneurs", to: "entrepreneurs" ,allowedRoles: ["admin","investor"]},
    { name: "Pitch", to: "Pitch" ,allowedRoles: ["admin","investor","entrepreneur"]},
    { name: "Messages", to: "message" ,allowedRoles: ["investor","entrepreneur"]},
    { name: "Subscription", to: "subscription",allowedRoles: ["entrepreneur"] },
    {name:"Story", to:"story", allowedRoles:["entrepreneur","admin","investor"]},
  ];
useEffect(()=>{
  dispatch(fetchUsersList());
},[dispatch])
  return (
    <div className="dashboard-wrapper">
      
   
      <header className="dashboard-header">
        
    
        <div className="dashboard-logo-area">
           <div className="dashboard-logo-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 16.5c-1.5 1.26-2 3.4-2 3.4s2.14-.5 3.4-2c1.76 1.35 4.31 1.05 5.7-.7l9-11c.7-.85.75-2.1.15-3-.6-.9-1.85-1.1-2.7-.4l-11 9c-1.75 1.39-2.05 3.94-.7 5.7Z"/>
              </svg>
           </div>
           <span className="dashboard-logo-text">DreamToStartup</span>
        </div>



        <div className="dashboard-actions">
          {user?.role !== "admin" && (
          <NavLink to='account' className="dashboard-nav-link">
            <FiUser className="text-lg" />
            <span className="hidden sm:inline">Account</span>
          </NavLink>
          )}
            {user?.role === "admin" && (
          <Link to="admin"  className="dashboard-nav-link">
            <FiUser className="text-lg" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
          )}
{user?.role !== "admin" && user?.role !== "entrepreneur" && (
          
          <NavLink to="notifications" className={({ isActive }) => `dashboard-notification-btn ${isActive ? 'active' : ''}`}>
            <FiBell className="text-xl" />
            <span className="dashboard-notification-badge">2</span>
          </NavLink>
)}
        </div>
      </header>

      <section className="dashboard-nav-bar">
        <div className="dashboard-nav-container">
          {sections
          .filter(section => section.allowedRoles.includes(user?.role))
          .map((section) => (
            <NavLink
              key={section.name} 
              to={section.to}
              className={({ isActive }) => 
                `dashboard-nav-button ${isActive ? 'active' : ''}`
              }
            >
              {section.name}
            </NavLink>
          ))}
        </div>
      </section>

  
      <main className="dashboard-main">

        <div className="dashboard-content-card">
           <Outlet />
        </div>
      </main>
    </div>
  );
}