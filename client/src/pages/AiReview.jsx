import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCpu, FiShield, FiTrendingUp, FiFileText } from "react-icons/fi";
import "../style/aireview.css";

export default function AiReview() {
  const navigate = useNavigate();
  const { AiReview } = useSelector((state) => state.Pitch);
  
  const reviewContent = AiReview?.response?.review;

  return (
 
    <div className="aireview-page">
      
      <div className="aireview-container">
        
 
        <div className="aireview-header">
          <button 
            onClick={() => navigate(-1)}
            className="aireview-back-button"
          >
            <FiArrowLeft className="aireview-back-icon" /> 
            Back to Dashboard
          </button>
          
          <div className="aireview-icon-wrapper">
            <FiCpu className="aireview-icon" />
          </div>

          <h1 className="aireview-title">
            AI <span className="aireview-title-highlight">Review</span> Result
          </h1>
        </div>

 
        <div className="aireview-card">
          
   
          <div className="aireview-card-header">
             <div className="aireview-header-pulse"></div>
             <span className="aireview-header-label">
                Analysis Report Generated
             </span>
          </div>
          
      
          <div className="aireview-card-content">
            {reviewContent ? (
              <div className="aireview-content-wrapper">
           
                <div className="aireview-content-text">
                  {reviewContent}
                </div>
              </div>
            ) : (
              <div className="aireview-loading-container">
                <div className="aireview-spinner"></div>
                <p className="aireview-loading-text">Processing Data...</p>
              </div>
            )}
          </div>

      
          <div className="aireview-card-footer">
             <div className="aireview-footer-item">
                <FiShield className="aireview-footer-icon shield" /> Secure
             </div>
             <div className="aireview-footer-item">
                <FiTrendingUp className="aireview-footer-icon trending" /> High Accuracy
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}