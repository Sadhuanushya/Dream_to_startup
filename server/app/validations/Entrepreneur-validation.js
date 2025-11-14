
const joi = require('joi');
const addressSchema = joi.object({
    address: joi.string().max(200).trim().required(),
    city: joi.string().max(40).trim().required(),
    state: joi.string().max(40).trim().required(),
    country: joi.string().max(40).trim().required(),
    pincode: joi.number().integer().min(100000).max(999999).required()
});


const workExperienceItemSchema = joi.object({
    company: joi.string().trim().min(3).max(100).trim().required(),
    position: joi.string().trim().min(3).max(60).trim().required(),
    years: joi.number().integer().min(0).max(50).required(),
});

const pastProjectSchema = joi.object({
    projectname: joi.string().min(3).max(50).trim().required(),
    websiteUrl: joi.string().uri().max(50).required(),
    revenue:joi.number().min(0).required()
});

const educationSchema=joi.object({
    institutionName:joi.string().min(3).max(80).trim().required(),
    course:joi.string().min(3).max(50).required(),
    year:joi.number().integer().min(1900).max(new Date().getFullYear()).required()

})
const DocumentSchema=joi.object({
    DocumentUrl:joi.string().uri().trim().max(200).required(),
    Cloudinary_Id:joi.string().min(3).max(80).trim().required()
})


const EnterPreneurValidation = joi.object({
    username:joi.string().trim().min(3).max(50).required(),
    profilePicture:DocumentSchema.optional(),
    fullname: joi.string().trim().min(3).max(50).required(),
    email: joi.string().email().trim().required(),
    phone: joi.string().length(10).pattern(/^[0-9]+$/).required(), 
    address: addressSchema.required(),
    bio: joi.string().min(10).max(500).required(),
    linkedinUrl: joi.string().uri().max(200).optional(),
    skills: joi.array().items(joi.string().trim().min(2).max(50)).min(1).optional(),
    education: joi.array().items(educationSchema).max(5).optional(), 
    workExperience: joi.array().items(workExperienceItemSchema).min(0).max(6).optional(), 
    pastProject: joi.array().items(pastProjectSchema).max(10).optional(),
    projectVideo:joi.string().optional(),
    identityDocument:DocumentSchema.optional(),
    BusinessRegistrationDocument:DocumentSchema.optional()
});

module.exports = EnterPreneurValidation;
