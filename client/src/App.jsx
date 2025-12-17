import {  Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import DashBoard from './pages/DashBoard';
import Home from "../src/pages/Home";
import Notifications from './pages/Notifications';
import Account from "./pages/Account"
import Investers from "./pages/Investers"
import Entrepreneurs from "./pages/Entrepreneurs"
import Pinch from "./pages/Pinch"
import EntrepreneurProfile from './pages/EntrepreneurProfile';
import InvesterProfile from './pages/InvesterProfile';
import Message from './pages/Message';
import Subscription from './pages/Subscription';
import Admin from "./pages/Admin"
export default function App() {
  return (
  
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashBoard/>}>
        <Route path="account" element={<Account/>}/>

        <Route path="investors" element={<Investers/>}/>

        <Route path ="entrepreneurs" element={<Entrepreneurs/>}/>
    
        <Route path="pinch" element={<Pinch/>}/>
        <Route path="notifications" element={<Notifications/>}/>
        <Route path="entrepreneurProfile" element={<EntrepreneurProfile/>}/>
        <Route path="investerProfile" element={<InvesterProfile/>}/>
        <Route path="message" element={<Message/>}/>
        <Route path="subscription" element={<Subscription/>}/>
        <Route path="admin" element={<Admin/>}/>

     </Route>
      </Routes>
  );
}
