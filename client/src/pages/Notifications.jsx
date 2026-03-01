import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReceiverNotifications, confirmConnection, rejectConnection, deleteNotification, markAsRead } from '../Slice/Notification-Slice';
import { Bell, Check, X, Trash2, MessageCircle, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useContext } from 'react';
import UserContext from '../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import '../style/notifications.css';
export default function Notifications() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const { showNotifications, loading } = useSelector(state => state.notifications);
    const [selectedType, setSelectedType] = useState('all');
    const [actionLoading, setActionLoading] = useState({});

useEffect(() => {
  const receiver = localStorage.getItem("userId");
  if (receiver) {
    dispatch(fetchReceiverNotifications(receiver));
  }
}, [dispatch]); 


const handleConfirm = async (notificationId) => {
  setActionLoading(prev => ({ ...prev, [notificationId]: true }));
  await dispatch(confirmConnection(notificationId));
  await dispatch(fetchReceiverNotifications(localStorage.getItem("userId")));
  setActionLoading(prev => ({ ...prev, [notificationId]: false }));
};

const handleReject = async (notificationId) => {
  setActionLoading(prev => ({ ...prev, [notificationId]: true }));
  await dispatch(rejectConnection(notificationId));
  await dispatch(fetchReceiverNotifications(localStorage.getItem("userId")));
  setActionLoading(prev => ({ ...prev, [notificationId]: false }));
};

const handleDelete = async (notificationId) => {
  await dispatch(deleteNotification(notificationId));
  await dispatch(fetchReceiverNotifications(localStorage.getItem("userId")));
};


    const handleGoToMessage = (senderId,senderName) => {
        localStorage.setItem('receiverId', senderId);
        localStorage.setItem('receivername', senderName)
        navigate('/dashboard/notifications/message');
    };

    const filteredNotifications = selectedType === 'all' 
        ? showNotifications 
        : showNotifications?.filter(n => n.type === selectedType);
    const getNotificationIcon = (type) => {
        switch(type) {
            case 'connection_request':
                return <Bell size={20} className="text-blue-500" />;
            case 'connection_accepted':
                return <CheckCircle size={20} className="text-green-500" />;
            case 'connection_rejected':
                return <X size={20} className="text-red-500" />;
            case 'verified':
                return <CheckCircle size={20} className="text-green-600" />;
            case 'rejected':
                return <AlertCircle size={20} className="text-red-600" />;
            case 'message':
                return <MessageCircle size={20} className="text-indigo-500" />;
            default:
                return <Bell size={20} className="text-gray-500" />;
        }
    };



    const getStatusBadge = (type, status) => {
        if (status === 'confirmed') return { text: 'Confirmed', color: 'bg-green-100 text-green-800' };
        if (status === 'rejected') return { text: 'Rejected', color: 'bg-red-100 text-red-800' };
        if (type === 'verified') return { text: 'Verified', color: 'bg-emerald-100 text-emerald-800' };
        if (type === 'rejected') return { text: 'Rejected', color: 'bg-rose-100 text-rose-800' };
        if (status === 'pending') return { text: 'Pending', color: 'bg-amber-100 text-amber-800' };
        return { text: 'New', color: 'bg-blue-100 text-blue-800' };
    };

return (
  <div className="notifications-page">
    <div className="notifications-container">
      

      <div className="notifications-header">
        <div className="header-title">
          <Bell size={32} className="header-icon" />
          <h1>Notifications</h1>
        </div>
        <p>Stay updated with your connections and activities</p>
      </div>

 
      <div className="filter-tabs">
        <button
          onClick={() => setSelectedType("all")}
          className={selectedType === "all" ? "active" : ""}
        >
          All
        </button>

        <button
          onClick={() => setSelectedType("connection_request")}
          className={selectedType === "connection_request" ? "active" : ""}
        >
          Connection Requests
        </button>

        {user?.role === "admin" && (
          <button
            onClick={() => setSelectedType("verified")}
            className={selectedType === "verified" ? "active" : ""}
          >
            Verifications
          </button>
        )}
      </div>

  
      {loading ? (
        <div className="loader-wrapper">
          <Loader2 className="loader" size={48} />
        </div>
      ) : filteredNotifications?.length === 0 ? (
        <div className="empty-state">
          <Bell size={64} />
          <p className="empty-title">No notifications yet</p>
          <p className="empty-sub">
            Check back later for updates on your connections
          </p>
        </div>
      ) : (
        <div className="notifications-list">
          {filteredNotifications?.map((notification) => {
            const statusBadge = getStatusBadge(
              notification.type,
              notification.status
            );

            const isConnectionRequest =
              notification.type === "connection_request" &&
              notification.status === "pending";

            return (
              <div
                key={notification._id}
                className={`notification-card ${notification.status}`}
              >
                <div className="notification-content">
                  <div className="notification-left">
                    {getNotificationIcon(notification.type)}

                    <div className="notification-text">
                      <div className="notification-title">
                        <h3>{notification.title}</h3>
                        <span className={`badge ${statusBadge.text}`}>
                          {statusBadge.text}
                        </span>
                      </div>

                      <p>{notification.message}</p>
                      <small>
                        {new Date(notification.createdAt).toLocaleString()}
                      </small>
                    </div>
                  </div>

                  <div className="notification-actions">
                    {isConnectionRequest && (
                      <>
                        <button
                          onClick={() => handleConfirm(notification._id)}
                          disabled={actionLoading[notification._id]}
                          className="btn-success"
                        >
                          <Check size={18} />
                        </button>

                        <button
                          onClick={() => handleReject(notification._id)}
                          disabled={actionLoading[notification._id]}
                          className="btn-danger"
                        >
                          <X size={18} />
                        </button>
                      </>
                    )}

                    {(notification.type === "connection_accepted" ||
                      notification.status === "confirmed") && (
                      <button
                        onClick={() =>
                          handleGoToMessage(
                            notification.senderId._id,
                            notification.senderId.username
                          )
                        }
                        className="btn-primary"
                      >
                        <MessageCircle size={18} />
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(notification._id)}
                      className="btn-delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  </div>
);

}