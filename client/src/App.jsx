import {  Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import DashBoard from './pages/DashBoard';
import Home from "../src/pages/Home";
import Notifications from './pages/Notifications';
import Account from "./pages/Account"
import Investors from "./pages/Investors"
import Entrepreneurs from "./pages/Entrepreneurs"
import Pitch from "./pages/Pitch"
import EntrepreneurProfile from './pages/EntrepreneurProfile';
import InvestorProfile from './pages/InvestorProfile';
import Message from './pages/Message';
import Subscription from './pages/Subscription';
import Admin from "./pages/Admin"
import AiReview from "./pages/AiReview"
export default function App() {
  return (
  
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/aireview" element={<AiReview/>}/>
        <Route path="/dashboard" element={<DashBoard/>}>

        <Route path="account" element={<Account/>}/>
        <Route path="investors" element={<Investors/>}/>
        <Route path ="entrepreneurs" element={<Entrepreneurs/>}/>
        <Route path="Pitch" element={<Pitch/>}/>
         <Route path="message" element={<Message/>}/>
        <Route path="notifications" element={<Notifications/>}/>
        <Route path="entrepreneurProfile" element={<EntrepreneurProfile/>}/>
        <Route path="InvestorProfile" element={<InvestorProfile/>}/>
        <Route path="/dashboard/investors/message" element={<Message/>}/>  
        <Route path="/dashboard/investors/profile" element={<Account/>}/>
        <Route path="/dashboard/notifications/message" element={<Message/>}/>
        <Route path="/dashboard/entrepreneur/profile" element={<Account/>}/>
        <Route path="/dashboard/entrepreneur/message" element={<Message/>}/>
        <Route path="Subscription" element={<Subscription/>}/>
        <Route path="admin" element={<Admin/>}/>
       

     </Route>
      </Routes>
  );
}
