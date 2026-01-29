import{useEffect, useState} from 'react';
import { useNavigate} from 'react-router-dom';
import { useDispatch ,useSelector} from 'react-redux';
import {fetchPitchList,fetchAiReview} from "../Slice/Pitch-Slice"
import { createNotification } from "../Slice/Notification-Slice";
import { useContext } from 'react';
import UserContext from '../Context/UserContext';
export default function Pitch() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data } = useSelector((state) => state.Pitch);
const {user}=useContext(UserContext);
  const [selectedPitch, setSelectedPitch] = useState(null);

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

  const handleInterestToInvest = (pitch) => {
    if (!pitch.entrepreneurId) {
      console.error("Entrepreneur ID not found");
      return;
    }

    const notifyData = {
      senderId: localStorage.getItem("senderId"),
      receiverId: pitch.entrepreneurId,
      type: "investment_interest",
      title: "Investment Interest",
      message: `Investor is interested in your pitch: ${pitch.statup}`,
      senderRole: "investor",
      pitchId: pitch._id,
      status: "pending"
    };

    console.log("Sending notification:", notifyData);
    dispatch(createNotification(notifyData));
  };

  const handleUploadPitch = () => {
    navigate("/dashboard/upload-pitch");
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter">Startup Pitches</h1>
          <p className="text-slate-500 font-medium">Browse and analyze high-potential startup ideas.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start md:items-center gap-4">
          <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600"></span>
            </span>
            {data?.length || 0} Pitches Available
          </div>
          {user?.role === "entrepreneur" && (<button 
            onClick={handleUploadPitch}
            className="bg-indigo-600 text-blue px-6 py-2 rounded-xl font-black hover:bg-indigo-700 shadow-lg shadow-indigo-100 active:scale-95 transition-all uppercase tracking-widest text-xs flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Upload Pitch
          </button>)}
        </div>
      </div>

      {/* Selected Pitch Modal/Expanded View */}
      {selectedPitch && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-8 space-y-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-4xl font-black text-slate-800">{selectedPitch.statup}</h2>
            <button
              onClick={() => setSelectedPitch(null)}
              className="text-slate-400 hover:text-slate-600 text-2xl"
            >
              ✕
            </button>
          </div>

          {/* Centered Video */}
          <div className="flex justify-center">
            <div className="w-full max-w-2xl aspect-video bg-slate-900 rounded-2xl overflow-hidden">
              {selectedPitch.pitchUrl ? (
                <video 
                  controls 
                  className="w-full h-full object-cover"
                  autoPlay
                >
                  <source src={selectedPitch.pitchUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
                  </svg>
                  <span className="font-bold text-sm">No Pitch Preview Available</span>
                </div>
              )}
            </div>
          </div>

          {/* Pitch Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                {selectedPitch.requireCapital}
              </div>
            </div>
            <p className="text-slate-600 font-medium leading-relaxed text-lg">
              "{selectedPitch.summary}"
            </p>
          </div>

          Action Buttons
          <div className="flex gap-4 flex-wrap">
            <button 
              onClick={() => handleAiReview(selectedPitch._id)}
              className="flex-1 min-w-[200px] bg-indigo-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 active:scale-95 transition-all uppercase tracking-widest text-xs"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="15" x2="23" y2="15"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="15" x2="4" y2="15"/>
              </svg>
              Get AI Insights
            </button>

            <button 
              onClick={() => handleInterestToInvest(selectedPitch)}
              className="flex-1 min-w-[200px] bg-green-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-green-700 shadow-lg shadow-green-100 active:scale-95 transition-all uppercase tracking-widest text-xs"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Interest to Invest
            </button>
          </div>
        </div>
      )}

      {/* Pitches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data && data.map((ele) => (
          <div 
            key={ele._id} 
            className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-200 transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedPitch(ele)}
          >
            <div className="aspect-video bg-slate-900 relative overflow-hidden">
              {ele.pitchUrl ? (
                <video 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                >
                  <source src={ele.pitchUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
                  </svg>
                  <span className="font-bold text-sm">No Preview</span>
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
                  {ele.statup}
                </h3>
                <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                  {ele.requireCapital}
                </div>
              </div>

              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-4 line-clamp-2 italic">
                "{ele.summary}"
              </p>

              <div className="flex gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAiReview(ele._id);
                  }}
                  className="flex-1 bg-indigo-600 text-black py-2 rounded-lg font-bold hover:bg-indigo-700 transition-all uppercase text-xs flex items-center justify-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="15" x2="23" y2="15"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="15" x2="4" y2="15"/>
                  </svg>
                  AI Review
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInterestToInvest(ele);
                  }}
                  className="flex-1 bg-green-600 text-black py-2 rounded-lg font-bold hover:bg-green-700 transition-all uppercase text-xs flex items-center justify-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  Interest
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

