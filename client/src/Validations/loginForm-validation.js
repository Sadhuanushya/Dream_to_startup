// src/validation/loginValidation.js

export const LoginValidation = (form) => {
  const errors = {};

  // Email validation
  if (!form.email.trim()) {
    errors.email = "Email is required";
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)
  ) {
    errors.email = "Invalid email address";
  }

  // Password validation
  if (!form.password) {
    errors.password = "Password is required";
  } else if (form.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
};
