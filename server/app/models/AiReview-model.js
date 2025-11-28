const mongoose=require("mongoose");
const AiReviewSchema=new mongoose.Schema({
    videoId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'ProjectVideo',
        unique:true
    },
    review:{
        type:String,
    }
})
const AiReview=mongoose.model('AiReview',AiReviewSchema);
module.exports=AiReview;