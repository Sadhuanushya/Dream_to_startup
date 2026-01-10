import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCpu, FiShield, FiTrendingUp, FiFileText } from "react-icons/fi";

export default function AiReview() {
  const navigate = useNavigate();
  const { AiReview } = useSelector((state) => state.Pitch);
  
  const reviewContent = AiReview?.response?.review;

  return (
    // Main background container centered
    <div className="w-screen min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 p-6 md:p-12 animate-in fade-in duration-700">
      
      <div className="w-full max-w-4xl flex flex-col items-center">
        
        {/* Header - Centered */}
        <div className="flex flex-col items-center text-center space-y-6 mb-12">
          <button 
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-sm transition-all"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Dashboard
          </button>
          
          <div className="bg-indigo-600 p-5 rounded-3xl shadow-2xl shadow-indigo-200">
            <FiCpu className="text-white text-4xl" />
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tighter">
            AI <span className="text-indigo-600">Review</span> Result
          </h1>
        </div>

        {/* Main Review Card */}
        <div className="w-full bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-indigo-100/30 overflow-hidden">
          
          {/* Status Bar */}
          <div className="bg-slate-900 px-10 py-5 flex items-center justify-center gap-3">
             <div className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></div>
             <span className="text-indigo-400 font-mono text-xs uppercase tracking-[0.3em] font-bold">
                Analysis Report Generated
             </span>
          </div>
          
          {/* Content Body - Forced Center with Flex */}
          <div className="p-10 md:p-20 flex flex-col items-center justify-center text-center">
            {reviewContent ? (
              <div className="w-full flex flex-col items-center justify-center">
                {/* The 'text-center' and 'mx-auto' ensure the text block stays middle */}
                <div className="text-slate-700 text-lg md:text-2xl leading-relaxed font-medium whitespace-pre-wrap italic text-center mx-auto max-w-3xl">
                  {reviewContent}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center py-20">
                <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mb-6"></div>
                <p className="text-slate-400 font-black uppercase tracking-widest">Processing Data...</p>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="bg-slate-50 p-8 border-t border-slate-100 flex justify-center gap-8">
             <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                <FiShield className="text-indigo-500" /> Secure
             </div>
             <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                <FiTrendingUp className="text-green-500" /> High Accuracy
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}