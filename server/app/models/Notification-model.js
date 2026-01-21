const mongoose=require('mongoose');
const NotificationSchema=new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    type:{
        type:String,
        enum:['connection_request','connection_accepted','connection_rejected','verified','rejected','message'],
        default:'message'
    },
    title:String,
    message:String,
    status:{
        type:String,
        enum:['pending','confirmed','rejected','read'],
        default:'pending'
    },
    senderRole:{
        type:String,
        enum:['entrepreneur','investor','admin']
    },
    profileId:{
        type:mongoose.Schema.Types.ObjectId
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }
    
})
const Notifications=mongoose.model('Notifications',NotificationSchema);
module.exports=Notifications;