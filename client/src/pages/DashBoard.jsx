import { Link } from "react-router-dom"

export default function DashBoard(){
    return(
        <>
        <h1>Dashboard</h1>
        <ul>
       <li> <Link to='/account'>Account</Link></li>
       <li><Link to='/investers'>Investers</Link></li>
        <li><Link to='/entrepreneurs'>Entrepreneurs</Link></li>
       <li><Link to='/pinch'>Pinch</Link></li>
        <li><Link to='/notifications'>Notifications</Link></li>
        </ul>

        </>

    )
}