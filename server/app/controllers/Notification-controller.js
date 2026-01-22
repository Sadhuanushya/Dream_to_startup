const Notification=require('../models/Notification-model');
const User = require('../models/Users-model');
const NotificationCtrl={};

// Create notification
NotificationCtrl.create = async (req, res) => {
    try {
        const { receiverId, type, title, message, senderRole, profileId } = req.body;
        
        const notification = new Notification({
            senderId: req.userId,
            receiverId,
            type,
            title,
            message,
            senderRole,
            profileId,
            status: 'pending'
        });
        
        await notification.save();
        await notification.populate('senderId', 'username email');
        await notification.populate('receiverId', 'username email');
        
        res.status(201).json(notification);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to create notification' });
    }
};

// Get all notifications for user
NotificationCtrl.getNotifications = async (req, res) => {
    try {
        const receiver = req.params.receiver;
        console.log("receiver in backend",receiver)
        const notifications = await Notification.find({ receiverId: receiver})
            .populate('receiverId', 'username email fullname fullName')
            .populate('senderId', 'username email')
            .sort({ createdAt: -1 });
        console.log("notifications fetched",notifications)
        res.status(200).json(notifications);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};
NotificationCtrl.getAllNotifications=async(req,res)=>{
    try{
        const notifications = await Notification.find();
        console.log(notifications);
        return res.status(200).json(notifications)

    }catch(err){
        console.log(err);
        return res.status(500).json({error:err})
    }
}
// Get unread notification count
NotificationCtrl.getUnreadCount = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const count = await Notification.countDocuments({
            receiverId: userId,
            status: { $in: ['pending', 'confirmed', 'verified', 'rejected'] }
        });
        
        res.status(200).json({ unreadCount: count });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to get unread count' });
    }
};

// Update notification status
NotificationCtrl.updateStatus = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const { status } = req.body;
        
        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            { status, updatedAt: new Date() },
            { new: true }
        ).populate('senderId', 'username email');
        
        res.status(200).json(notification);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to update notification' });
    }
};

// Confirm connection request
NotificationCtrl.confirmConnection = async (req, res) => {
    try {
        const { notificationId } = req.params;
        
        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            { status: 'confirmed', updatedAt: new Date() },
            { new: true }
        ).populate('senderId', 'username email');
        
        res.status(200).json(notification);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to confirm connection' });
    }
};

// Reject connection request
NotificationCtrl.rejectConnection = async (req, res) => {
    try {
        const { notificationId } = req.params;
        
        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            { status: 'rejected', updatedAt: new Date() },
            { new: true }
        ).populate('senderId', 'username email');
        
        res.status(200).json(notification);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to reject connection' });
    }
};

// Mark as read
NotificationCtrl.markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        
        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            { status: 'read', updatedAt: new Date() },
            { new: true }
        );
        
        res.status(200).json(notification);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to mark as read' });
    }
};

// Delete notification
NotificationCtrl.delete = async (req, res) => {
    try {
        const { notificationId } = req.params;
        
        await Notification.findByIdAndDelete(notificationId);
        
        res.status(200).json({ message: 'Notification deleted' });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to delete notification' });
    }
};

module.exports = NotificationCtrl;