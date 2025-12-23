import {useContext,useEffect} from "react";
import UserContext from "../Context/UserContext"
export default function Account(){
const {handleAccount,user}=useContext(UserContext)
 useEffect(()=>{
    handleAccount();
 },[])
return(
        <div>
            <h1>Account</h1>
            <p>{`hello ${user.username} welcome to d2s`}</p>
        </div>
    )
}