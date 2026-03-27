import {  Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import DashBoard from './pages/DashBoard';
import Home from "../src/pages/Home";
import Notifications from './pages/Notifications';

import Investors from "./pages/Investors"
import Entrepreneurs from "./pages/Entrepreneurs"
import Pitch from "./pages/Pitch"
import UploadPitch from "./pages/UploadPitch"

import Message from './pages/Message';
import Subscription from './pages/Subscription';
import Admin from "./pages/Admin"
import AiReview from "./pages/AiReview"
import Story from './pages/Story';
import StoryForm from "./pages/StoryForm"
import Account from "./pages/Account"
import EntrepreneurAccount from "./pages/Accounts/EntrepreneurAccount"
import InvestorAccount from "./pages/Accounts/InvestorAccount"
export default function App() {
  return (
  
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/storyform" element={<StoryForm/>}/>
        <Route path="/aireview" element={<AiReview/>}/>
        <Route path="/dashboard" element={<DashBoard/>}>

 
        
        <Route path="investors" element={<Investors/>}/>
        <Route path ="entrepreneurs" element={<Entrepreneurs/>}/>
        <Route path="Pitch" element={<Pitch/>}/>
        <Route path="upload-pitch" element={<UploadPitch/>}/>
        <Route path="message" element={<Message/>}/>
        <Route path="notifications" element={<Notifications/>}/>
        <Route path="account" element={<Account/>}/>
        <Route path="story" element={<Story/>}/>
        <Route path="storyform" element={<StoryForm/>}/>
        
        <Route path="/dashboard/investors/message" element={<Message/>}/>  
        
        <Route path="/dashboard/notifications/message" element={<Message/>}/>
        <Route path="/dashboard/entrepreneur/message" element={<Message/>}/>
        <Route path="Subscription" element={<Subscription/>}/>
        <Route path="admin" element={<Admin/>}/>
        <Route path="/dashboard/admin" element={<Admin/>}/>
        <Route path="/dashboard/account/EntrepreneurAccount" element={<EntrepreneurAccount/>}/>
        <Route path="/dashboard/account/InvestorAccount" element={<InvestorAccount/>}/>
       <Route path="/dashboard/Pitch/Subscription" element={<Subscription/>}/>

     </Route>
      </Routes>
  );
}
