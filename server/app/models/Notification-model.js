const mongoose=require('mongoose');
const NotificationSchema=new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId
    },
    ReceiverId:{
        type:mongoose.Schema.Types.ObjectId
    },
    message:String,
    createdAt:{
        type:Date,
        default:Date.now
    }
    
})
const Notifications=mongoose.model('Notifications',NotificationSchema);
module.exports=Notifications;