import { useSelector } from "react-redux"
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPitchList,fetchAiReview} from "../Slice/Pitch-Slice";
export default function Pitch(){
      const dispatch = useDispatch();
    const navigate = useNavigate();
    const {data,}=useSelector((state)=>{
        return state.Pitch;
    })
    console.log(data,"Pitch")
 useEffect(() => {
  dispatch(fetchPitchList());
}, []);
const handleAiReview=async(id)=>{
    const resultAction = await dispatch(fetchAiReview(id));

    if (fetchAiReview.fulfilled.match(resultAction)) {
      // Navigate only if the thunk succeeded
      navigate("/aireview");
    } else {
      // handle errors
      console.error("AI Review failed:", resultAction.payload);
    }
  };
    console.log(data,"Pitch data from useSelector")
    return(
        <>
        <h1>Pitch pagess</h1>
        <h2>Pitch list</h2>
        <ul>{data.map(ele=>{
            return<>   
             <li key={ele._id}>
      <div>{ele.videoUrl}</div>
      <div><strong>Title:</strong> {ele.Title}</div>
      <div><strong>Summary:</strong> {ele.summary}</div>
      <div><strong>Require Capital:</strong> {ele.requireCapital}</div>
       <div><button onClick={()=>{
        handleAiReview(ele._id)}}>Ai Review</button></div>
    </li>
            </>
        })}</ul>
       
        </>

    )
}