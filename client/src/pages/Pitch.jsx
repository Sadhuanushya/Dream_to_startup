import{useEffect} from 'react';
import { useNavigate} from 'react-router-dom';
import { useDispatch ,useSelector} from 'react-redux';
import {fetchPitchList,fetchAiReview} from "../Slice/Pitch-Slice"

export default function Pitch() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data } = useSelector((state) => state.Pitch);

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

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-slate-50">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
  //     </div>
  //   );
  // }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter">Startup Pitches</h1>
          <p className="text-slate-500 font-medium">Browse and analyze high-potential startup ideas.</p>
        </div>
        <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 self-start md:self-center">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600"></span>
          </span>
          {data?.length || 0} Pitches Available
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {data && data.map((ele) => (
          <div 
            key={ele._id} 
            className="group bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-200 transition-all duration-300"
          >
            <div className="aspect-video bg-slate-900 relative overflow-hidden">
              {ele.pitchUrl ? (
                <video 
                  controls 
                  className="w-full h-full object-cover"
                >
                  <source src={ele.pitchUrl} type="video/mp4" />
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

            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">
                  {ele.statup}
                </h3>
                <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                  {ele.requireCapital}
                </div>
              </div>

              <p className="text-slate-500 font-medium leading-relaxed mb-8 line-clamp-3 italic">
                "{ele.summary}"
              </p>

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleAiReview(ele._id)}
                  className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 active:scale-95 transition-all uppercase tracking-widest text-xs"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="15" x2="23" y2="15"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="15" x2="4" y2="15"/>
                  </svg>
                  Get AI Insights
                </button>
                
                <button className="px-6 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-xs">
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

