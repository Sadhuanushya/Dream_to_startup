import { useSelector, useDispatch } from "react-redux";
import { useEffect ,useState} from "react";
import { fetchInvestorsList } from "../Slice/Investor-Slice";
import {useNavigate} from "react-router-dom";
// import { FiMapPin } from "react-icons/fi";

// export default function Investors() {
//   const dispatch = useDispatch();
//   const { data } = useSelector((state) => state.investor);

//   useEffect(() => {
//     dispatch(fetchInvestorsList());
//   }, [dispatch]);

//   return (
//     <div className="p-4 md:p-8">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-2xl font-black text-slate-800">Investors</h1>
//         <p className="text-slate-500 mt-1">Find investors relevant to your startup.</p>
//       </div>

//       {/* Investors Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//         {data?.map((ele) => (
//           <div
//             key={ele._id}
//             className="group bg-slate-50 border border-slate-100 rounded-[2rem] p-6 hover:bg-white hover:shadow-md transition-all duration-300 flex flex-col"
//           >
//             {/* Top Section */}
//             <div className="flex items-center gap-4 mb-4">
//               <img
//                 src={ele.profilePicture?.DocumentUrl || "https://via.placeholder.com/80"}
//                 alt={ele.fullName}
//                 className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
//               />
//               <div>
//                 <h3 className="font-black text-slate-800 text-lg">{ele.fullName}</h3>
//                 <span className="inline-block mt-1 text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
//                   {ele.investorType}
//                 </span>
//               </div>
//             </div>

//             {/* Bio */}
//             <p className="text-sm text-slate-600 leading-relaxed mb-3 line-clamp-3">{ele.bio}</p>

//             {/* Preferred Sectors (names only) */}
// <div className="flex flex-wrap gap-2 mb-4">
//   {ele.prefferedSector?.map((item, idx) => (
//     <span
//       key={idx}
//       className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full"
//     >
//       {item.sector} <span className="text-[10px] font-normal">(Preferred)</span>
//     </span>
//   ))}
// </div>

//             {/* Location */}
//             <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
//               <FiMapPin /> {ele.officeLocation?.city}, {ele.officeLocation?.state}
//             </div>
// <div>{ele.isVerified}</div>
//             {/* Request Button */}
//             <button className="mt-auto bg-indigo-600 text-white text-sm font-black px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition shadow shadow-indigo-100">
//               Request
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Empty State */}
//       {data?.length === 0 && (
//         <div className="text-center py-20 text-slate-500">No investors found.</div>
//       )}
//     </div>
//   );
// }
//
import React from "react";

// --- Custom SVG Icons ---
const MapPin = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const VerifiedIcon = () => (
  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.24.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);
import { setReceiver } from "../Slice/Message-Slice";
export default function Investors(){
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.investor);
  const navigate=useNavigate();
 
  useEffect(() => {
    dispatch(fetchInvestorsList());
  }, [dispatch]);


const handleMessage = (id) => {
  dispatch(setReceiver(id));
  navigate('message');
};
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans antialiased text-slate-900">
      <div className="max-w-5xl mx-auto">
        
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Investors</h1>
          <p className="text-slate-500 mt-2">Discover potential capital partners.</p>
        </header>

        <div className="space-y-4">
          {data && data.map((ele) => (
            <div 
              key={ele.id} 
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0 relative">
                  <img 
                    src={ele.profilePicture?.DocumentUrl} 
                    alt={ele.fullName}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover"
                  />
                  {ele.isVerified && (
                    <div className="absolute top-0 right-0">
                      <VerifiedIcon />
                    </div>
                  )}
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold text-slate-900">{ele.fullName}</h2>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                    <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {ele.investorType}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin /> {ele.officeLocation?.city} | {ele.officeLocation?.state}
                    </span>
                  </div>

                  <p className="text-slate-600 text-sm mb-4">
                    {ele.bio}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {ele.sectors?.map((ele, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                        {ele.sector}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-row md:flex-col justify-end gap-3 mt-4 md:mt-0 min-w-[140px]">
                  <button className="flex-1 md:flex-none bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors" onClick={()=>{handleMessage(ele._id)}}>
                    Connect
                  </button>
                  <button className="flex-1 md:flex-none border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}