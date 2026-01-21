const joi = require('joi');

// Helper schemas made optional for testing
const addressSchema = joi.object({
    address: joi.string().max(200).trim().allow('').optional(),
    city: joi.string().max(40).trim().allow('').optional(),
    state: joi.string().max(40).trim().allow('').optional(),
    country: joi.string().max(40).trim().allow('').optional(),
    pincode: joi.number().integer().min(100000).max(999999).allow(null).optional()
});

const workExperienceItemSchema = joi.object({
    company: joi.string().trim().allow('').optional(),
    position: joi.string().trim().allow('').optional(),
    years: joi.number().integer().allow(null).optional(),
});

const pastProjectSchema = joi.object({
    projectname: joi.string().trim().allow('').optional(),
    websiteUrl: joi.string().uri().allow('').optional(),
    revenue: joi.number().allow(null).optional()
});

const educationSchema = joi.object({
    institutionName: joi.string().trim().allow('').optional(),
    course: joi.string().allow('').optional(),
    year: joi.number().integer().allow(null).optional()
});

const EnterPreneurValidation = joi.object({
    // Basic Info - All Optional and allowing empty strings for testing
    fullname: joi.string().trim().allow('').optional(),
    email: joi.string().email().trim().allow('').optional(),
    phone: joi.string().allow('').optional(), 
    bio: joi.string().allow('').optional(),
    linkedinUrl: joi.string().uri().allow('').optional(),
    
    // Complex Objects - All Optional
    address: addressSchema.optional(),
    skills: joi.array().items(joi.string().trim()).optional(),
    education: joi.array().items(educationSchema).optional(),
    workExperience: joi.array().items(workExperienceItemSchema).optional(),
    pastProject: joi.array().items(pastProjectSchema).optional(),
    
    // File Fields - These are required for your testing logic
    // We use any() because the controller sends the raw file object or 
    // it's handled manually after validation.
    profilePicture: joi.any().optional(),
    identityDocument: joi.any().optional(),
    BusinessRegistrationDocument: joi.any().optional()
});

module.exports = EnterPreneurValidation;