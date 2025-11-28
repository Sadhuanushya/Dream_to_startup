const mongoose=require("mongoose")
const PaymentSchema=mongoose.Schema({
    EntrepreneurId:{
        type:mongoose.Schema.Types.ObjectId
    },
    planName:String,
    Amount:Number,
    status:{
        type:Boolean,
        default:false
    },
    expiredDate:Date,
},{timestamps:true})
const Subscription=mongoose.model("Subscription",PaymentSchema)
module.exports=Subscription;