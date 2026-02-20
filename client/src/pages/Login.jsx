import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/login.css";
import UserContext from "../Context/UserContext";
import { LoginValidation } from "../Validations/loginForm-validation";

export default function Login() {
  const { handleLogin,serverError: contextServerError } = useContext(UserContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  console.log("server error",contextServerError)
  console.log("form server error",serverError)
  useEffect(() => { 
    if(contextServerError){
        setServerError(contextServerError)
    }
  }, [contextServerError])
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.id]: "",
    });

    setServerError("");
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  setServerError("");

  const validationErrors = LoginValidation(form);

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  setLoading(true);

  await handleLogin(form);


  setLoading(false);
};


  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p className="login-subtitle">
          Login to your startup portal
        </p>

        {serverError && (
          <div className="server-error">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
    
          <div className="form-group">
            <label>Email Address</label>
            <input
              id="email"
              type="text"
              placeholder="name@company.com"
              value={form.email}
              onChange={handleChange}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && (
              <p className="form-error">{errors.email}</p>
            )}
          </div>

   
          <div className="form-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className={errors.password ? "input-error" : ""}
              />
              <span
                className="toggle-password"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
            {errors.password && (
              <p className="form-error">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="login-footer">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="login-footer-link"
          >
            Register now
          </button>
        </p>
      </div>
    </div>
  );
}
