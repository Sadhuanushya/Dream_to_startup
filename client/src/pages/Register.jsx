import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "../style/register.css";
import UserContext from "../Context/UserContext";
import { fetchUsersList } from "../Slice/Users-Slice";
import { RegisterValidation } from "../Validations/RegisterForm-validations";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { handleRegister ,serverError,clearServerError} = useContext(UserContext);
console.log("server error from register component",serverError)
  const { data } = useSelector((state) => state.Users);
console.log("data from register component",data,data.length)
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });


  const [errors, setErrors] = useState({});
  const [serverErrors, setServerErrors] = useState('');
  const [loading, setLoading] = useState(false);
console.log(serverError,"from component")


useEffect(() => {
    if(serverError){
        setServerErrors(serverError)
    }
}, [serverError])
  useEffect(() => {
    dispatch(fetchUsersList());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });

    setServerErrors("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = RegisterValidation(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      setServerErrors("");

    const result=  await handleRegister(form);
      if (result?.success) {
    setForm({
      username: "",
      email: "",
      password: "",
      role: "",
    });
  }
    setErrors({});
      setLoading(false);
    } catch (err) {
      setLoading(false);

    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2>Create Account</h2>
        <p className="subheading">
          Join the Dream to Startup community
        </p>


  

        <form onSubmit={handleSubmit}>
      
          <div className="form-group">
            <label>Username</label>
            <input
              name="username"
              type="text"
              value={form.username}
              placeholder="johndoe123"
              onChange={handleChange}
              className={errors.username ? "input-error" : ""}
            />
            {errors.username && (
              <p className="error">{errors.username}</p>
            )}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              placeholder="name@company.com"
              onChange={handleChange}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && (
              <p className="error">{errors.email}</p>
            )}
          </div>

  
          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              placeholder="••••••••"
              onChange={handleChange}
              className={errors.password ? "input-error" : ""}
            />
            {errors.password && (
              <p className="error">{errors.password}</p>
            )}
          </div>

     
          <div className="role-group">
            <label>I am a...</label>
            <div className="role-options">
              {data?.length===0 && (
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={form.role === "admin"}
                    onChange={handleChange}
                  />
                  Admin
                </label>
              )}

 {data?.length>0 && (
  <>

              <label>
                <input
                  type="radio"
                  name="role"
                  value="investor"
                  checked={form.role === "investor"}
                  onChange={handleChange}
                />
                Investor
              </label>

              <label>
                <input
                  type="radio"
                  name="role"
                  value="entrepreneur"
                  checked={form.role === "entrepreneur"}
                  onChange={handleChange}
                />
                Entrepreneur
              </label>
                </>)}
            </div>

            {errors.role && (
              <p className="error">{errors.role}</p>
            )}
          </div>
{serverErrors && (
  <div className="server-error">
    {serverErrors}
  </div>
)}
          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="login-text">
          Already have an account?{" "}
          <span
            className="link"
            onClick={() =>{
              clearServerError();
              navigate("/login")}
            } 
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}
