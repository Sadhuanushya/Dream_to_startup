const joi=require("joi")

const projectVideovalidation=joi.object({
    Title:joi.string().trim().min(3).max(50).required(),
    requireCapital:joi.number().required(),
    summary:joi.string().trim().min(3).max(200).required(),
    videoUrl:joi.string().uri().required().optional(),
    cloudinaryId:joi.string().optional(),
    investorInterests:joi.array().items(joi.string()).optional(),
    viewCount:joi.number(),
})
module.exports=projectVideovalidation;