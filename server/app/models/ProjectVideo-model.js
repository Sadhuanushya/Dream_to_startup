const mongoose=require('mongoose')
const ProjectVideoSchema=new mongoose.Schema({
    EnterprenuerId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
    },
    Title:String,
    requireCapital:Number,
    summary:String,
    videoUrl:String,
    investorInterests:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    viewCount:Number,
},{timestamps:true})
const VideoData=mongoose.model("ProjectVideo",ProjectVideoSchema)
module.exports=VideoData;