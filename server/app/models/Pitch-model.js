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
},{timestamps:true})
const PitchData=mongoose.model("PitchData",PitchSchema)
module.exports=PitchData;