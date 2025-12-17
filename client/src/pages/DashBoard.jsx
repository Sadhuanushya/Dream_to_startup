import { NavLink,Outlet } from "react-router-dom"

export default function DashBoard(){
    return(
        <>
        <h1>Dashboard</h1>
        <nav>
        <ul>
       <li> <NavLink  to='account'>Account</NavLink ></li>
       <li><NavLink  to='investors'>Investers</NavLink ></li>
        <li><NavLink  to='entrepreneurs'>Entrepreneurs</NavLink ></li>
       <li><NavLink  to='pinch'>Pinch</NavLink ></li>
        <li><NavLink  to='notifications'>Notifications</NavLink ></li>
        <li><NavLink  to='entrepreneurProfile'>EntrepreneurProfile</NavLink ></li>
        <li><NavLink  to='investerProfile'>InvesterProfile</NavLink ></li>
        <li><NavLink  to='subscription'>Subscription</NavLink ></li>
        <li><NavLink  to='message'>Message</NavLink ></li>
         <li><NavLink  to='admin'>admin</NavLink ></li>
        </ul>
        </nav>
<Outlet/>
        </>

    )
}