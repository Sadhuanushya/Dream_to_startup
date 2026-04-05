import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchInvestorsList } from "../Slice/Investor-Slice";
import { useNavigate } from "react-router-dom";
import { deleteInvestor } from "../Slice/Investor-Slice"
import { createNotification, fetchNotifications, setPending } from "../Slice/Notification-Slice";
import "../style/investors.css";

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

export default function Investors() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { data } = useSelector((state) => state.investor);
    const { notifications } = useSelector((state) => state.notifications);

    const [notificationStatus, setNotificationStatus] = useState([]);

    useEffect(() => {
        dispatch(fetchInvestorsList());
        dispatch(fetchNotifications());
    }, [dispatch]);
const currentUserId = localStorage.getItem("userId");
    useEffect(() => {
        if (notifications) {
            const currentUserId = localStorage.getItem("userId");
            const updatedList = notifications
                .filter(ele => ele.type === "connection_request" && ele.senderId?._id === currentUserId)
                .map(ele => ({
                    receiverId: ele.receiverId?._id,
                    status: ele.status
                }));
            
            
            setNotificationStatus(updatedList);
        }
    }, [notifications,dispatch]);

    const handleRequest = (id, name, email, profileID) => {
        const notifyData = {
            senderId: localStorage.getItem("userId"),
            receiverId: id,
            type: "connection_request",
            title: "Connection Request",
            message: `${localStorage.getItem("name")} wants to connect with you`,
            senderRole: localStorage.getItem("role"),
            profileId: profileID,
            status: "pending"
        }
        dispatch(createNotification(notifyData)).then(() => {
            dispatch(fetchNotifications());
        });
    }

    const handleMessage = (receiverId, name) => {
        localStorage.setItem("receiverId", receiverId);
        localStorage.setItem("receivername", name);
        navigate("/dashboard/message");
    };

    const handleViewProfile = (Iid) => {
        navigate('/dashboard/account/InvestorAccount', { state: { Iid } });
    }

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this investor?")) {
            dispatch(deleteInvestor(id));
        }
    }

return (
  <div className="investors-page">
    <div className="investors-container">

      <header className="investors-header">
        <h1>Investors</h1>
        <p>Discover potential capital partners for your venture.</p>
      </header>

      <div className="investors-grid">
        {data?.map((ele) => (
          <div key={ele._id} className="investor-card">
            <div className="investor-card-content">

              <div className="investor-image-wrapper">
                <img
                  src={ele.profilePicture?.DocumentUrl || "/api/placeholder/100/100"}
                  alt={ele.fullName}
                  className="investor-image"
                />
                {ele.isVerified && (
                  <div className="verified-badge">
                    <VerifiedIcon />
                  </div>
                )}
              </div>

              <div className="investor-info">
                <div className="investor-title-row">
                  <div>
                    <h2 className="investor-name">{ele.fullName}</h2>

                    <div className="investor-meta">
                      <span className="investor-type">
                        {ele.investorType}
                      </span>

                      <span className="investor-location">
                        <MapPin />
                        {ele.officeLocation?.city || "Remote"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* <p className="investor-bio">{ele.bio}</p> */}
              </div>

              <div className="investor-actions">

                {localStorage.getItem('role') !== "admin" && (
                  <>
                    {notificationStatus.some(
                      n => n.receiverId === ele.senderId?._id && n.status === "confirmed"
                    ) ? (
                      <button
                        className="btn-primary"
                        onClick={() => handleMessage(ele.senderId._id, ele.senderId.username)}
                      >
                        Message
                      </button>
                    ) : notificationStatus.some(
                      n => n.receiverId === ele.senderId?._id && n.status === "pending"
                    ) ? (
                      <button disabled className="btn-disabled">
                        Pending
                      </button>
                    ) : (
                      <button
                        className="btn-dark"
                        onClick={() =>
                          handleRequest(ele.senderId._id, ele.fullName, ele.email, ele._id)
                        }
                      >
                        Request
                      </button>
                    )}
                  </>
                )}

                <button
                  className="btn-outline"
                  onClick={() => handleViewProfile(ele.senderId._id)}
                >
                  View Profile
                </button>

                {localStorage.getItem('role') === "admin" && (
                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(ele._id)}
                  >
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