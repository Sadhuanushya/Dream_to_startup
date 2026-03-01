import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPitchList, fetchAiReview } from "../Slice/Pitch-Slice";
import UserContext from "../Context/UserContext";
import "../style/pitch.css";
import { fetchEntrepreneur } from "../Slice/Entreprenuer-Slice";
import { deletePitch } from "../Slice/Pitch-Slice";
import { getPaymentHistory } from "../Slice/Payment-Slice";
export default function Pitch() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data } = useSelector((state) => state.Pitch);
  const{paymentHistory}=useSelector((state)=>state.payment)
  const { user } = useContext(UserContext);

  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [expandedSummary, setExpandedSummary] = useState(null);
const userId=localStorage.getItem('userId')
  useEffect(() => {
    dispatch(fetchPitchList());
  }, [dispatch]);

  const handleAiReview = async (id) => {
    const resultAction = await dispatch(fetchAiReview(id));
    if (fetchAiReview.fulfilled.match(resultAction)) {
      navigate("/aireview");
    } else {
      console.error("AI Review failed:", resultAction.payload);
    }
  };
useEffect(()=>{
dispatch(getPaymentHistory(userId));
},[])
  const handleUploadPitch = () => {
    const subscription=paymentHistory?.filter(ele=>{
      return ele.EntrepreneurId===userId;
    })
    if(subscription.length>0){
    navigate("/dashboard/upload-pitch");
    }else{
      navigate("/dashboard/Pitch/Subscription")
    }
    
  };
    const handleProfile=(id)=>{  
       dispatch(fetchEntrepreneur(id));
      navigate("/dashboard/account/EntrepreneurAccount", { state: { Eid :id} })
    }
    const handleDeletePitch=(id)=>{
      const confirm=window.confirm("are you sure delete pitch"); 
      if(confirm) {
        dispatch(deletePitch(id))
      } 
    }
        const handleGoToMessage = (senderId,senderName) => {
        localStorage.setItem('receiverId', senderId);
        localStorage.setItem('receivername', senderName)
        navigate('/dashboard/notifications/message');
    };
  return (
    <div className="pitch-container">
 
      <div className="pitch-header">
        <div className="pitch-header-title">
          <h1>Startup Pitches</h1>
          <p>Browse and analyze high-potential startup ideas.</p>
        </div>
        <div className="pitch-header-actions">
          <div className="pitch-count-badge">
            <span className="pulse-container">
              <span className="pulse-ping"></span>
              <span className="pulse-dot"></span>
            </span>
            {data?.length || 0} Pitches Available
          </div>
          {user?.role === "entrepreneur" && (
            <button
              onClick={handleUploadPitch}
              className="pitch-upload-btn"
            >
              Upload Pitch
            </button>
          )}
        </div>
      </div>

  
      <div className="pitch-grid">
        {data && data.map((ele) => (
          <div key={ele._id} className="pitch-card">
     
            <div className="pitch-card-video">
              {ele.pitchUrl ? (
                <video
                  className={
                    playingVideoId === ele._id
                      ? "pitch-video-expanded"
                      : "pitch-video-small"
                  }
                  controls
                  onClick={(e) => {
                    e.stopPropagation();
                    setPlayingVideoId(
                      playingVideoId === ele._id ? null : ele._id
                    );
                  }}
                >
                  <source src={ele.pitchUrl} type="video/mp4" />
                </video>
              ) : (
                <div className="pitch-video-placeholder">
                  <span>No Preview</span>
                </div>
              )}
            </div>

      
            <div className="pitch-card-content">
              <h3 className="pitch-card-title" onClick={() => handleProfile(ele.EnterprenuerId?._id)}>
                {ele.EnterprenuerId?.username || "Unknown Entrepreneur"}
              </h3>
              <p className="pitch-card-startup">{ele.startup}</p>
              <p className="pitch-card-summary">
                {expandedSummary === ele._id
                  ? ele.summary
                  : `${ele.summary.slice(0, 100)}...`}
                {ele.summary.length > 100 && (
                  <span
                    className="summary-more"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedSummary(
                        expandedSummary === ele._id ? null : ele._id
                      );
                    }}
                  >
                    {expandedSummary === ele._id ? " Show Less" : " More"}
                  </span>
                )}
              </p>

              <div className="pitch-card-buttons">
              {ele.EnterprenuerId?._id === localStorage.getItem("userId") &&                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAiReview(ele._id);
                  }}
                  className="pitch-card-btn pitch-card-btn-ai"
                >
                  AI Review
                </button>} 

                 {(user?.role === "admin" || localStorage.getItem("userId") === ele.EnterprenuerId?._id) && (
                  <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePitch(ele._id);
                  }}
                  className=" pitch-card-btn-delete"
                >
                  delete
                </button>)}
       {user?.role === "investor"  && (
        <button className="message-btn" onClick={()=>{handleGoToMessage(ele.EnterprenuerId?._id,ele.EnterprenuerId?.username)}}>message</button>
       )}         
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
