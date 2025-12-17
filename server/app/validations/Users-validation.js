const joi=require('joi');

const RegisterValidation=joi.object({
    username:joi.string().min(3).max(50).trim().required(),
    email:joi.string().email().trim().required(),
    password:joi.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).trim().required()
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters, include 1 uppercase, 1 lowercase, 1 number, and 1 special character (@$!%*?&)",
    }),
    role: joi.string().valid('entrepreneur','investor','admin')
})

const LoginValidation=joi.object({
    email:joi.string().email().trim().required(),
    password:joi.string().required().trim().required()
})

module.exports={
RegisterValidation,
LoginValidation
};