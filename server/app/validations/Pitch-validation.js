const joi=require("joi")

const PitchDataValidation=joi.object({
    startup:joi.string().trim().min(3).max(50).required(),
    requireCapital:joi.number().required(),
    summary:joi.string().trim().min(3).max(200).required(),
    pitchUrl:joi.string().uri().required().optional(),
    cloudinaryId:joi.string().optional(),
    investorInterests:joi.array().items(joi.string()).optional(),
    viewCount:joi.number(),
})
module.exports=PitchDataValidation;