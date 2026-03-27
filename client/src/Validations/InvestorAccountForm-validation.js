import Joi from "joi";

const officeLocationSchema = Joi.object({
  address: Joi.string().min(3).max(200).trim().required().label("Address"),
  city: Joi.string().min(3).max(40).trim().required().label("City"),
  state: Joi.string().min(3).max(40).trim().required().label("State"),
  country: Joi.string().min(2).max(40).trim().required().label("Country"),
  pincode: Joi.number().integer().min(100000).max(999999).required().label("Pincode"),
});

const sectorSchema = Joi.object({
  sector: Joi.string().trim().min(3).max(100).required().label("Sector"),
  description: Joi.string().trim().min(10).max(100).required().label("Description"),
  targetInvestment: Joi.number().min(1000).required().label("Target Investment"),
});

const investorValidationSchema = Joi.object({
  fullName: Joi.string().trim().min(3).max(100).required().label("Full Name"),
  email: Joi.string().email({ tlds: { allow: false } }).required().label("Email"),
  bio: Joi.string().trim().min(10).max(300).required().label("Bio"),
  linkedinUrl: Joi.string().uri().max(200).required().label("LinkedIn URL"),

  investorType: Joi.string()
    .valid("Angel Investor", "Accelerator Investor", "Seed Investor", "Other")
    .required()
    .label("Investor Type"),

  customInvestorType: Joi.when("investorType", {
    is: "Other",
    then: Joi.string().trim().min(3).max(50).required().label("Custom Investor Type"),
    otherwise: Joi.forbidden(),
  }),

  officeLocation: officeLocationSchema.required().label("Office Location"),

  prefferedSector: Joi.array()
    .items(sectorSchema)
    .min(1)
    .max(10)
    .required()
    .label("Preferred Sectors"),

  profilePicture: Joi.any().optional().label("Profile Picture"),

  verificationDocument: Joi.any().optional().label("Verification Document"),
});

export const validateInvestorForm = (formData) => {
  const validation = investorValidationSchema.validate(formData, {
    abortEarly: false,
  });

  if (!validation.error) return {};

  const errors = {};
  validation.error.details.forEach((item) => {
    errors[item.path.join(".")] = item.message;
  });

  return errors;
};
