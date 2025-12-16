import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import DashBoard from './pages/DashBoard';
import Home from "../src/pages/Home";
import Notifications from './pages/Notifications';
import Account from "./pages/Account"
import Investers from "./pages/Investers"
import Entrepreneurs from "./pages/Entrepreneurs"
import Pinch from "./pages/Pinch"
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashBoard/>}/>
        <Route path="/account" element={<Account/>}/>

        <Route path="/investers" element={<Investers/>}/>

        <Route path ="/entrepreneurs" element={<Entrepreneurs/>}/>
    
        <Route path="/pinch" element={<Pinch/>}/>
        <Route path="/notifications" element={<Notifications/>}/>
      </Routes>
    </BrowserRouter>
  );
}
