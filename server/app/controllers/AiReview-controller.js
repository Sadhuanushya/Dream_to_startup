const AiServices=require("./AiServices")
const mongoose=require('mongoose');
const PitchData=require("../models/Pitch-model")
const AiReview=require("../models/AiReview-model");


const AiReviewCtrl={}

AiReviewCtrl.getResponse = async (req, res)=>{
    const id=req.params.id;
    console.log("paramsid",id)
try{
    const reviewResponse=await AiReview.findOne({pitchId:new mongoose.Types.ObjectId(id)});
    console.log("reviewResponse",reviewResponse)
    if(reviewResponse){
        return res.status(200).json({response:reviewResponse});
    }

    const Pitch=await PitchData.findById(id)
    console.log('Pitch',Pitch)
   
    if(!Pitch.summary){
        return res.status(400).json({error: "summary is required"})
    }
    const response = await AiServices(Pitch.summary);
    const review=new AiReview({
    pitchId:id,
    review: response
});
    await review.save();

    res.status(201).json({response:review});
}catch(err){
    res.status(500).json({error:err})
}
}
AiReviewCtrl.remove=async(req,res)=>{
    const id=req.params.id;
    try{
        const reviewData=await AiReview.findById(id);  
       if(!reviewData){
            return res.json('record not found');
        }
        const deleteReview=await AiReview.findByIdAndUpdate(id);
        res.status(200).json({status:"successfully deleted",deleteReview})
    }catch(err){
        res.status(500).json(err);
    }
}
module.exports=AiReviewCtrl;
   