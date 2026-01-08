import { useSelector,useDispatch } from "react-redux";
import { useEffect } from "react";
import {fetchInvestersList} from "../Slice/Invester-Slice"
export default function Investers(){
    const dispatch=useDispatch()
    const {data}=useSelector((state)=>{
        return state.investor;
    })
 useEffect(() => {
  dispatch(fetchInvestersList()); // ← this triggers the API call
}, []);
    console.log(data,"investerss")
    return(
        <>
        <h1>Investers page</h1>
        <h3>List Investers</h3>
        <ul>{data.map((ele,i)=>{
            return<li key={i}>{ele.fullName}</li>
        })}</ul>
        </>
    )
}