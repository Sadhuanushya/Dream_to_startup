const joi = require("joi");

  const StoryDataValidation = joi.object({
    title: joi.string().trim().min(3).max(100).required(),
    description: joi.string().trim().min(10).max(1000).required(),
  });   
  module.exports = StoryDataValidation;    


