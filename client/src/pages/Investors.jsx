import { useSelector, useDispatch } from "react-redux";
import { useEffect ,useState} from "react";
import { fetchInvestorsList } from "../Slice/Investor-Slice";
import {useNavigate} from "react-router-dom";

import {deleteInvestor,fetchInvestor} from "../Slice/Investor-Slice"
import { createNotification, fetchNotifications,setPending } from "../Slice/Notification-Slice";
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


export default function Investors(){
  const dispatch = useDispatch();
  const { data} = useSelector((state) => state.investor);
  const { notifications,pending} = useSelector((state) => state.notifications);
const AllUsers=useSelector(state=>state.Users?.data);
const [localPending, setLocalPending] = useState({});

  const navigate=useNavigate();
console.log(data,"profiledata")

  ;
  useEffect(() => {
  dispatch(fetchInvestorsList());
  dispatch(fetchNotifications(localStorage.getItem("userId")));
}, [dispatch]);



const handleRequest = (id, name, email, profileID) => {
  console.log("ele._id", id);
  
  console.log("message receiver", id, name, email, profileID, "userID", id)
  console.log("passing id from front end", id)
  const notifyData = {
    senderId: localStorage.getItem("userId"),
    receiverId: id,
    type: "connection_request",
    title: "connection Request",
    message: ` ${localStorage.getItem("name")} want to connect with u`,
    senderRole: localStorage.getItem("role"),
    profileId: profileID,
    status: "pending"
  }
  console.log("notifyData", notifyData)
  
  // Set local state for immediate UI feedback
  setLocalPending(prev => ({...prev, [id]: true}));
  
  dispatch(createNotification(notifyData)).then(() => {
    console.log("notification created successfully");
    dispatch(fetchNotifications(localStorage.getItem("userId")));
    console.log("notifications fetched", notifications);
  }).catch((error) => {
    console.error("Error creating notification:", error);
    setLocalPending(prev => ({...prev, [id]: false}));
  });
};
const handleDelete=(id)=>{
  console.log("delete investor with id:",id);
  const confirm=window.confirm("are you sure delete investor");
  if(confirm){
     dispatch(deleteInvestor(id));
  }

};
const handleViewProfile=(id)=>{  
   dispatch(fetchInvestor(id));
   navigate('/dashboard/InvestorProfile');

}

const handleMessage=(receiverId,name)=>{
  localStorage.setItem("receiverId",receiverId);
  localStorage.setItem("receivername",name);
  navigate("/dashboard/message");
}

const isConnectionConfirmed = (investorId) => {
  return notifications?.some(
    notif =>
      notif.type === "connection_request" &&
      notif.status === "confirmed" &&
      notif.senderId?._id === localStorage.getItem("userId") &&
      notif.receiverId?._id === investorId
  );
}

const isPendingRequest = (investorId) => {
  return notifications?.some(
    notif =>
      notif.type === "connection_request" &&
      notif.status === "pending" &&
      notif.senderId?._id === localStorage.getItem("userId") &&
      notif.receiverId?._id === investorId
  ) || localPending[investorId];
}
useEffect(() => {
  // Clear local pending state when notifications update
  // This keeps local state in sync with server state
  if (notifications && notifications.length > 0) {
    const confirmedIds = new Set();
    const pendingIds = new Set();
    
    notifications.forEach(notif => {
      if (notif.type === "connection_request" && notif.senderId?._id === localStorage.getItem("userId")) {
        if (notif.status === "confirmed") {
          confirmedIds.add(notif.receiverId?._id);
        } else if (notif.status === "pending") {
          pendingIds.add(notif.receiverId?._id);
        }
      }
    });
    
    // Update local state based on server notifications
    setLocalPending(prev => {
      const updated = {...prev};
      confirmedIds.forEach(id => delete updated[id]);
      return updated;
    });
  }
}, [notifications]);

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
{isConnectionConfirmed(ele.userId._id) ? (
  <button
    className="flex-1 md:flex-none bg-green-600 text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
    onClick={() => handleMessage(ele.userId._id, ele.fullName)}
  >
    Message
  </button>
) : isPendingRequest(ele.userId._id) ? (
  <button
    disabled={true}
    className="flex-1 md:flex-none bg-gray-400 text-gray-200 px-4 py-2 rounded-lg text-sm font-semibold cursor-not-allowed"
  >
    Pending
  </button>
) : (
  <button
    className="flex-1 md:flex-none bg-black text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
    onClick={() => handleRequest(ele.userId._id, ele.fullName, ele.email, ele._id)}
  >
    Request
  </button>
)}

                  <button className="flex-1 md:flex-none border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors" onClick={()=>{handleViewProfile(ele.userId._id)}}>
                    View Profile
                  </button>
           {localStorage.getItem('role')==="admin" && (
            <button className="flex-1 md:flex-none border border-gray-200 text-red-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"onClick={()=>{handleDelete(ele._id)}}>
                    Delete
                  </button>
           )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}