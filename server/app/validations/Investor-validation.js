const joi =require("joi")
const officeLocationSchema=joi.object({
        address: joi.string().min(3).max(200).trim().required(),
        city: joi.string().min(3).max(40).trim().required(),
        state: joi.string().min(3).max(40).trim().required(),
        country: joi.string().min(2).max(40).trim().required(),
        pincode: joi.number().integer().min(100000).max(999999).required()
})
const pastInvestmentSchema=joi.object({
    projectName:joi.string().trim().required(),
    investment:joi.number().required(),
    investmentDocument:joi.string().uri().trim().max(200).optional(),
    Cloudinary_Id:joi.string().min(3).max(80).trim().optional()
})
const SectorSchema=joi.object({
    sector:joi.string().trim().min(3).max(100).required(),
    description:joi.string().trim().min(10).max(100).required(),
    targetInvestment:joi.number().min(1000).required()
})
const DocumentSchema=joi.object({
    DocumentUrl:joi.string().uri().trim().max(200).required(),
    Cloudinary_Id:joi.string().min(3).max(80).trim().required()
})
const InvesterValidation=joi.object({
    username:joi.string().trim().min(3).max(50).required(),
    profilePicture:DocumentSchema.optional(),
    fullName:joi.string().trim().min(3).max(100).required(),
    email:joi.string().email().required(),
    bio:joi.string().trim().min(10).max(300).required(),
    linkedinUrl:joi.string().uri().max(200).required(),
    officeLocation:officeLocationSchema.required(),
    prefferedSector:joi.array().items(SectorSchema).min(1).max(10).required(),
    pastInvestment:pastInvestmentSchema.max(10).min(0).optional(),
    verificationDocument:DocumentSchema.optional()
    
})
module.exports=InvesterValidation;