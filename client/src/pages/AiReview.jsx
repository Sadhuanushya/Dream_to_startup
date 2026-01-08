import { useSelector } from "react-redux";
export default function AiReview(){
        const {AiReview}=useSelector((state)=>{
            return state.Pitch;
        })
        console.log("review",AiReview)
    return(
        <>
        <h2>Ai Review page</h2>
        {AiReview && <p>{AiReview?.response?.review}</p>}
        
        </>
    )
}