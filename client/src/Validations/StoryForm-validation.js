// Story Form Validation - Based on Backend Joi Schema
export const StoryFormValidation = (form) => {
  const errors = {};

  // Title Validation
  if (!form.title?.trim()) {
    errors.title = "Story title is required";
  } else if (form.title.trim().length < 3) {
    errors.title = "Title must be at least 3 characters";
  } else if (form.title.trim().length > 100) {
    errors.title = "Title must not exceed 100 characters";
  }

  // Description Validation
  if (!form.description?.trim()) {
    errors.description = "Story description is required";
  } else if (form.description.trim().length < 10) {
    errors.description = "Description must be at least 10 characters";
  } else if (form.description.trim().length > 1000) {
    errors.description = "Description must not exceed 1000 characters";
  }

  return errors;
};
