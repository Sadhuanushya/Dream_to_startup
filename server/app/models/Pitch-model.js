const mongoose=require('mongoose')
const PitchSchema=new mongoose.Schema({
    EnterprenuerId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
    },
    startup:String,
    requireCapital:Number,
    summary:String,
    pitchUrl:String,
    cloudinaryId:String,
    investorInterests:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'User',
        default:[]
    },
    viewCount:Number,
},{timestamps:true})
const PitchData=mongoose.model("PitchData",PitchSchema)
module.exports=PitchData;