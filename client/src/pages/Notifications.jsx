import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReceiverNotifications, confirmConnection, rejectConnection, deleteNotification, markAsRead } from '../Slice/Notification-Slice';
import { Bell, Check, X, Trash2, MessageCircle, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useContext } from 'react';
import UserContext from '../Context/UserContext';
import { useNavigate } from 'react-router-dom';

export default function Notifications() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { showNotifications, loading } = useSelector(state => state.notifications);
    const [selectedType, setSelectedType] = useState('all');
    const [actionLoading, setActionLoading] = useState({});
console.log("notifications",showNotifications)
    // useEffect(() => {
    //     const receiver=localStorage.getItem("userId")
    //     if(receiver){
    //         console.log("notify receiver",receiver)
    //         dispatch(fetchReceiverNotifications(receiver));
    //     }
    // }, [dispatch]);
    useEffect(() => {
        const receiver = localStorage.getItem("userId");
        if (receiver) {
            console.log("receiver id form notification page", receiver);
            console.log("before dispatching fetch notifications");
            dispatch(fetchReceiverNotifications(receiver));
            console.log("after dispatching fetch notifications");
            console.log("notifications after fetch", showNotifications);
        }
    },[dispatch]);

    const handleConfirm = async (notificationId) => {
        setActionLoading(prev => ({ ...prev, [notificationId]: true }));
        await dispatch(confirmConnection(notificationId));
        setActionLoading(prev => ({ ...prev, [notificationId]: false }));
    };

    const handleReject = async (notificationId) => {
        setActionLoading(prev => ({ ...prev, [notificationId]: true }));
        await dispatch(rejectConnection(notificationId));
        setActionLoading(prev => ({ ...prev, [notificationId]: false }));
    };

    const handleDelete = async (notificationId) => {
        await dispatch(deleteNotification(notificationId));
    };

    const handleGoToMessage = (senderId) => {
        localStorage.setItem('receiverId', senderId);
        navigate('/dashboard/notifications/message');
    };

    const filteredNotifications = selectedType === 'all' 
        ? showNotifications 
        : showNotifications.filter(n => n.type === selectedType);
console.log("filteredNotifications",filteredNotifications)
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

    const getNotificationColor = (type, status) => {
        if (status === 'confirmed') return 'bg-green-50 border-l-green-500';
        if (status === 'rejected') return 'bg-red-50 border-l-red-500';
        if (type === 'verified') return 'bg-emerald-50 border-l-emerald-500';
        if (type === 'rejected') return 'bg-rose-50 border-l-rose-500';
        if (status === 'pending') return 'bg-amber-50 border-l-amber-500';
        return 'bg-blue-50 border-l-blue-500';
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
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Bell size={32} className="text-indigo-600" />
                        <h1 className="text-4xl font-black text-gray-800">Notifications</h1>
                    </div>
                    <p className="text-gray-600">Stay updated with your connections and activities</p>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 flex gap-2 overflow-x-auto">
                    <button
                        onClick={() => setSelectedType('all')}
                        className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                            selectedType === 'all'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setSelectedType('connection_request')}
                        className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                            selectedType === 'connection_request'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Connection Requests
                    </button>
                    <button
                        onClick={() => setSelectedType('verified')}
                        className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                            selectedType === 'verified'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Verifications
                    </button>
                </div>

                {/* Notifications List */}
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="animate-spin text-indigo-600" size={48} />
                    </div>
                ) : filteredNotifications?.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <Bell size={64} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-xl font-semibold text-gray-600">No notifications yet</p>
                        <p className="text-gray-500 mt-2">Check back later for updates on your connections</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredNotifications?.map((notification) => {
                            const statusBadge = getStatusBadge(notification.type, notification.status);
                            const isConnectionRequest = notification.type === 'connection_request' && notification.status === 'pending';

                            return (
                                <div
                                    key={notification._id}
                                    className={`bg-white rounded-2xl shadow-lg border-l-4 p-6 transition-all hover:shadow-xl ${getNotificationColor(notification.type, notification.status)}`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        {/* Icon and Content */}
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="flex-shrink-0">
                                                {getNotificationIcon(notification.type)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="text-lg font-bold text-gray-800">{notification.title}</h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusBadge.color}`}>
                                                        {statusBadge.text}
                                                    </span>
                                                </div>
                                                <p className="text-gray-700 mb-2">{notification.message}</p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(notification.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center gap-2">
                                                {/* Connection Request Actions */}
                                                {isConnectionRequest && (
                                                    <>
                                                        <button
                                                            onClick={() => handleConfirm(notification._id)}
                                                            disabled={actionLoading[notification._id]}
                                                            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 transition-all"
                                                            title="Confirm connection"
                                                        >
                                                            {actionLoading[notification._id] ? (
                                                                <Loader2 size={18} className="animate-spin" />
                                                            ) : (
                                                                <Check size={18} />
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(notification._id)}
                                                            disabled={actionLoading[notification._id]}
                                                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 transition-all"
                                                            title="Reject connection"
                                                        >
                                                            {actionLoading[notification._id] ? (
                                                                <Loader2 size={18} className="animate-spin" />
                                                            ) : (
                                                                <X size={18} />
                                                            )}
                                                        </button>
                                                    </>
                                                )}

                                                {/* Go to Message Button */}
                                                {(notification.type === 'connection_accepted' || notification.status === 'confirmed') && (
                                                    <button
                                                        onClick={() => handleGoToMessage(notification.senderId._id)}
                                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-semibold transition-all"
                                                        title="Go to message"
                                                    >
                                                        <MessageCircle size={18} />
                                                    </button>
                                                )}

                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => handleDelete(notification._id)}
                                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-all"
                                                    title="Delete notification"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded content for connection requests */}
                                    {isConnectionRequest && notification.senderId && (
                                        <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                                            <p className="text-sm text-gray-600 mb-2">
                                                <span className="font-semibold">From:</span> {notification.senderId.username || 'Unknown User'}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-semibold">Email:</span> {notification.senderId.email}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}