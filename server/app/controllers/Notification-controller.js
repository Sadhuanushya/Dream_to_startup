const Notification=require('../models/Notification-model');
const NotificationCtrl={};
NotificationCtrl.create=(async(req,res)=>{
    
    try{
        const notifications = new Notifications({
            senderId: senderId,
            ReceiverId: receiverId,
            message: message
        });
        await notifications.save();

    }catch(err){
        res.status(500).json(err);
    }

})