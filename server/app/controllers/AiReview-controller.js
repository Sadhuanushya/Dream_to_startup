const AiServices=require("./AiServices")
const mongoose=require('mongoose');
const projectVideo=require("../models/ProjectVideo-model")
const AiReview=require("../models/AiReview-model");


const AiReviewCtrl={}

AiReviewCtrl.getResponse = async (req, res)=>{
    const id=req.body.id;
try{
    const Aireview=await AiReview.findOne({videoId:new mongoose.Types.ObjectId(id)});

    if(Aireview){
        return res.status(200).json({response:Aireview});
    }

    const Video=await projectVideo.findById(id)
    if(!Video.summary){
        return res.status(400).json({error: "summary is required"})
    }
    const response = await AiServices(Video.summary);
    const review=new AiReview({
    videoId:id,
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
   