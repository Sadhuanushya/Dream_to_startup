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
    },[])
    const Entrepreneurs=data.filter(ele=>{
        return ele.role=="entreprenuer"
    })
    const Investors=data.filter(ele=>{
        return ele.role=="investor"
    })
    return(
        <>
        <h1>Admin page</h1>
        <h2>Entrepreneurs-{Entrepreneurs.length}</h2>
        <h2>Investors-{Investors.length}</h2>
        <ul>{data.map((ele,i)=>{
            return <li key={i}>{ele.username}</li>
        })}</ul>
        </>
    )
}