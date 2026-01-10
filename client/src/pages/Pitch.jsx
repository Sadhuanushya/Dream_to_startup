import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPitchList, fetchAiReview } from "../Slice/Pitch-Slice";
import { FiCpu, FiDollarSign, FiPlayCircle } from "react-icons/fi";

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

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter">Startup Pitches</h1>
          <p className="text-slate-500 font-medium">Browse and analyze high-potential startup ideas.</p>
        </div>
        <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600"></span>
          </span>
          {data?.length || 0} Pitches Available
        </div>
      </div>

      {/* Pitch Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {data && data.map((ele) => (
          <div 
            key={ele._id} 
            className="group bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-200 transition-all duration-300"
          >
            {/* Video Player Section */}
            <div className="aspect-video bg-slate-900 relative overflow-hidden">
              {ele.videoUrl ? (
                <video 
                  controls 
                  className="w-full h-full object-cover"
                  poster="/api/placeholder/400/225" // Optional: add a thumbnail logic here
                >
                  <source src={ele.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                  <FiPlayCircle className="text-4xl" />
                  <span className="font-bold text-sm">No Video Preview Available</span>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">
                  {ele.Title}
                </h3>
                <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                  <FiDollarSign /> {ele.requireCapital}
                </div>
              </div>

              <p className="text-slate-500 font-medium leading-relaxed mb-8 line-clamp-3 italic">
                "{ele.summary}"
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleAiReview(ele._id)}
                  className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 active:scale-95 transition-all uppercase tracking-widest text-xs"
                >
                  <FiCpu className="text-lg" /> Get AI Insights
                </button>
                
                <button className="px-6 py-4 bg-slate-50 text-slate-600 font-black rounded-2xl hover:bg-slate-100 transition-all uppercase tracking-widest text-xs">
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {(!data || data.length === 0) && (
        <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
           <p className="text-slate-400 font-bold uppercase tracking-widest">No pitches found in the database.</p>
        </div>
      )}
    </div>
  );
}