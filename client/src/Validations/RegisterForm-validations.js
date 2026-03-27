export const RegisterValidation = (form) => {
  const errors = {};

  // Username
  if (!form.username.trim()) {
    errors.username = "Username is required";
  } else if (form.username.length < 3) {
    errors.username = "Username must be at least 3 characters";
  }

  // Email
  if (!form.email.trim()) {
    errors.email = "Email is required";
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)
  ) {
    errors.email = "Invalid email address";
  }

  // Password
  if (!form.password) {
    errors.password = "Password is required";
  } else if (form.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  // Role
  if (!form.role) {
    errors.role = "Role is required";
  }

  return errors;
};
