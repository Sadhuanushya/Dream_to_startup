import { useSelector } from "react-redux"
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchEntrepreneursList } from "../Slice/Entreprenuer-Slice";
import { setReceiver } from "../Slice/Message-Slice"


//     return(
//         <>
//         <h1>Entrepreneurs page</h1>
//         <h2>Entreprenuer list</h2>
//         <div>{data.map(ele=>{
//             return<><div key={ele._id}>{ele.fullname}</div>
//             <div>{ele.profilePicture?.DocumentUrl}</div>
//             <h3>{ele.startup}</h3>
//             <h3>{ele.verified}</h3>
//             <p>{ele.bio}</p></>
//         })}</div>
//         </>

//     )
// }
// //
// import React, { useState, useEffect } from "react";

// --- Custom UI Components ---
const MapPin = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const VerifiedBadge = () => (
  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.24.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const RocketIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464L19.071 4.93M9.172 14.828l-3.535 3.536m3.535-3.536a2 2 0 11-2.828-2.828 2 2 0 012.828 2.828zM21 3L11 13M3 21l3-3m0 0l-3-3m3 3l3 3" />
  </svg>
);

export default function Entrepreneurs() {
    const dispatch = useDispatch()
    const { data, listLoading, listError } = useSelector((state) => state.Entrepreneur)

    useEffect(() => {
        dispatch(fetchEntrepreneursList());
    }, [dispatch]);

    const handleReceiver = (id) => {
        dispatch(setReceiver(id));
    }

    const placeholderImg = "https://images.unsplash.com/photo-1551434678-e076c223a692?w=300&h=300&fit=crop";
  return (
    <div className="min-h-screen bg-white p-6 md:p-12 font-sans antialiased text-slate-900">
      <div className="max-w-4xl mx-auto">
        
        <header className="mb-12">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Founders Network</h1>
          <p className="text-slate-500 mt-2 text-lg">Direct access to innovative minds and their ventures.</p>
        </header>

        {listError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {typeof listError === 'string' ? listError : 'Failed to load entrepreneurs'}
          </div>
        )}

        {listLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-slate-500">Loading entrepreneurs...</div>
          </div>
        ) : !data || data.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No entrepreneurs found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {data.map((ele) => (
              <div 
                key={ele._id} 
                className="bg-white rounded-3xl p-6 border border-slate-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 group"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Profile Section */}
                  <div className="flex-shrink-0 relative mx-auto md:mx-0">
                    <img 
                      src={ele.profilePicture?.DocumentUrl || placeholderImg} 
                      alt={ele.fullname}
                      className="w-20 h-20 md:w-28 md:h-28 rounded-2xl object-cover ring-2 ring-slate-50 group-hover:ring-indigo-50 transition-all"
                    />
                    {ele.isVerified && (
                      <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md border border-slate-50">
                        <VerifiedBadge />
                      </div>
                    )}
                  </div>
                  
                  {/* Details Section */}
                  <div className="flex-grow text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                      <h2 className="text-xl font-bold text-slate-900">{ele.fullname}</h2>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-500 mb-4">
                      {ele.skills && ele.skills.length > 0 && (
                        <span className="flex items-center gap-1.5 text-indigo-600 font-bold bg-indigo-50 px-3 py-1.5 rounded-xl">
                          <RocketIcon /> {ele.skills[0]}
                        </span>
                      )}
                      {ele.address?.city && (
                        <span className="flex items-center gap-1.5 font-medium">
                          <MapPin /> {ele.address.city}
                        </span>
                      )}
                    </div>

                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      {ele.bio || "Entrepreneur building disruptive solutions."}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-row md:flex-col justify-end gap-3 min-w-[140px]">
                    <button 
                      className="flex-1 md:flex-none bg-slate-900 text-white px-5 py-3 rounded-2xl text-sm font-bold hover:bg-indigo-600 active:scale-95 transition-all" 
                      onClick={() => handleReceiver(ele._id)}
                    >
                      Connect
                    </button>
                    <button className="flex-1 md:flex-none border border-slate-200 text-slate-600 px-5 py-3 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all">
                      Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}