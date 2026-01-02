// import { NavLink,Outlet } from "react-router-dom"

// export default function DashBoard(){
//     return(
//         <>
//         <h1>Dashboard</h1>
//         <nav>
//         <ul>
//        <li> <NavLink  to='account'>Account</NavLink ></li>
//        <li><NavLink  to='investors'>Investers</NavLink ></li>
//         <li><NavLink  to='entrepreneurs'>Entrepreneurs</NavLink ></li>
//        <li><NavLink  to='pinch'>Pinch</NavLink ></li>
//         <li><NavLink  to='notifications'>Notifications</NavLink ></li>
//         <li><NavLink  to='entrepreneurProfile'>EntrepreneurProfile</NavLink ></li>
//         <li><NavLink  to='investerProfile'>InvesterProfile</NavLink ></li>
//         <li><NavLink  to='subscription'>Subscription</NavLink ></li>
//         <li><NavLink  to='message'>Message</NavLink ></li>
//          <li><NavLink  to='admin'>admin</NavLink ></li>
//         </ul>
//         </nav>
// <Outlet/>
//         </>

//     )
// }
import { Link, NavLink, Outlet } from "react-router-dom";
import { FiBell, FiSearch } from "react-icons/fi";
import Admin from "./Admin";
export default function Dashboard() {
  const sections = [
    { name: "Investors", to: "investors" },
    { name: "Entrepreneurs", to: "entrepreneurs" },
    { name: "Pinch", to: "pinch" },
    { name: "Notifications", to: "notifications" },
    { name: "Messages", to: "message" },
  ];

  return (
    <div className="flex flex-col w-screen min-h-screen  bg-gray-100">

      {/* Top Navbar */}
      <header className="bg-white px-6 py-3 shadow flex items-center justify-between">
        
        {/* Search Bar */}
        <div className="relative w-1/3">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full border border-gray-300 rounded-lg py-2 px-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
<NavLink  to='account'>Account</NavLink >
        {/* Notification */}
        <div className="relative cursor-pointer">
          <FiBell className="text-2xl text-gray-600" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            5
          </span>
        </div>
      </header>

      {/* Top Section List — like Naukri job list UI */}
      <section className="flex overflow-x-auto  gap-4 py-4 px-6 bg-white shadow-sm">
        {sections.map((section) => (
          <NavLink
            key={section.name}
            to={section.to}
            className="flex-none text-gray-700 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap"
            activeclassname="bg-indigo-500 text-white"
          >
            {section.name}
          </NavLink>
        ))}
      </section>

      {/* Main Content */}
      <main className="flex-1 overflow-auto px-6 py-4">
        <Link to="admin">Admin</Link><br/>
        <Link to="entrepreneurProfile">entrepreneurprofile</Link><br/>
       <Link to="investerProfile">investerProfile</Link> 
        <Outlet />
      </main>
    </div>
  );
}
// import { NavLink, Outlet } from "react-router-dom";
// import { FiBell, FiSearch } from "react-icons/fi"; // bell + search icons

// export default function Dashboard() {
//   return (
//     <div className="flex w-screen h-screen bg-gray-100">
      
//       {/* Sidebar */}
//       <aside className="w-64 bg-gray-800 text-white p-5">
//         <h2 className="text-2xl font-bold mb-6">My Dashboard</h2>
//         <nav className="flex flex-col gap-3">
//           <NavLink className="hover:bg-gray-700 p-2 rounded" to="account">Account</NavLink>
//           {/* add more links here */}
//         </nav>
//       </aside>

//       {/* Main Area */}
//       <div className="flex-1 flex flex-col">
        
//         {/* 📌 Top Navigation */}
//         <header className="bg-white shadow p-4 flex items-center justify-between">
          
//           {/* Search Bar */}
//           <div className="relative w-1/3">
//             <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
//             <input 
//               type="text"
//               placeholder="Search..."
//               className="w-full border border-gray-300 rounded-lg py-2 px-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>

//           {/* Right Icons */}
//           <div className="flex items-center gap-4">
//             <div className="relative cursor-pointer">
//               <FiBell className="text-2xl text-gray-600" />
//               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">3</span>
//             </div>
//             {/* user avatar / profile can go here */}
//           </div>
//         </header>

//         {/* 📌 Quick Link/Cards Section */}
//         <section className="p-4 grid grid-cols-5 gap-4 bg-gray-100">
//           {["Investors","Entrepreneurs","Pinch","Notifications","Messages"].map((item) => (
//             <div key={item} className="bg-white p-4 rounded-lg shadow hover:shadow-lg cursor-pointer text-center">
//               {item}
//             </div>
//           ))}
//         </section>

//         {/* 🧩 Main Content Area */}
//         <main className="p-6 flex-1 overflow-auto">
//           <Outlet />
//         </main>

//       </div>
//     </div>
//   );
// }
