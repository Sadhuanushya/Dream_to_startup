import { useSelector,useDispatch } from "react-redux";
import { useEffect } from "react";
import {fetchInvestersList} from "../Slice/Invester-Slice"
export default function Investers(){
    const dispatch=useDispatch()
    const {invester}=useSelector((state)=>{
        return state.invester;
    })
 useEffect(() => {
  dispatch(fetchInvestersList()); // ← this triggers the API call
}, [dispatch]);
    console.log(invester,"investerss")
    return(
        <>
        <h1>Investers page</h1>
        <h3>List Investers</h3>
        </>
    )
}