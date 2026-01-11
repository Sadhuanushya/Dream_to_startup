const mongoose=require("mongoose");
const AiReviewSchema=new mongoose.Schema({
    pitchId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'PitchData'
    },
    review:{
        type:String,
    }
})
const AiReview=mongoose.model('AiReview',AiReviewSchema);
module.exports=AiReview;