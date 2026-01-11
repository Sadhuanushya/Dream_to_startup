import { useSelector } from "react-redux"
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchEntrepreneursList } from "../Slice/Entreprenuer-Slice";
export default function Entrepreneurs(){
    const dispatch=useDispatch()
    const {data}=useSelector((state)=>{
        return state.Entrepreneur;
    })
    console.log(data.fullname)
 useEffect(() => {
  dispatch(fetchEntrepreneursList());
}, [dispatch]);
    console.log(data,"Entrepreneur data from useSelector")
    return(
        <>
        <h1>Entrepreneurs page</h1>
        <h2>Entreprenuer list</h2>
        <div>{data.map(ele=>{
            return<><div key={ele._id}>{ele.fullname}</div>
            <div>{ele.profilePicture?.DocumentUrl}</div>
            <h3>{ele.skills}</h3>
            <h3>{ele.verified ? <p>true</p>:<p>false</p>}</h3>
            <p>{ele.bio}</p></>
        })}</div>
        </>

    )
}