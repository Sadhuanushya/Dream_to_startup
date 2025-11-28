const joi=require('joi');
const AiReviewValidation=joi.object({
    review:joi.string().min(10).max(2000).required()
})
module.exports=AiReviewValidation;