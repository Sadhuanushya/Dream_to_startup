
const mongoose =require("mongoose")
const messageSchema=new mongoose.Schema({
    message:{
        text:{
        type:String
        }
    },
    users:[],
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
}, { timestamps: true })
const message=mongoose.model("Message",messageSchema)
module.exports=message