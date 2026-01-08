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
        <ul>{data.map(ele=>{
            return<li key={ele._id}>{ele.fullname}</li>
        })}</ul>
        </>

    )
}