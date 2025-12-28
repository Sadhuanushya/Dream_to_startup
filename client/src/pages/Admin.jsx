import {useEffect} from "react";
import {useSelector,useDispatch} from "react-redux"
import {fetchUsersList} from "../Slice/Users-Slice"
export default function Admin(){
    const dispatch=useDispatch();
    const {data}=useSelector(state=>{
        return state.Users;
    })
    console.log("state",data)
    useEffect(()=>{
        dispatch(fetchUsersList());
    },[dispatch])
    return(
        <>
        <h1>Admin page</h1>
        <h2>Entrepreneurs-{data.length}</h2>
        <ul>{data.map((ele,i)=>{
            return <li key={i}>{ele.username}</li>
        })}</ul>
        </>
    )
}