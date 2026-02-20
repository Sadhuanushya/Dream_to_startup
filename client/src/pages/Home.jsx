import { useNavigate } from "react-router-dom";
import "../style/home.css";
import UserContext from "../Context/UserContext";
import { useContext } from "react";
export default function Home() {
  const navigate = useNavigate();
  const {clearServerError} = useContext(UserContext);
  const handleRegister = () =>{
      clearServerError();
      navigate("/register")
  } 
  const handleLogin = () => {
     clearServerError();
    navigate("/login");
  }
  const handleHome = () => navigate("/");


  const Logo = () => (
    <div className="logo-container" onClick={handleHome}>
      <div className="logo-icon-wrapper">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4.5 16.5c-1.5 1.26-2 3.4-2 3.4s2.14-.5 3.4-2c1.76 1.35 4.31 1.05 5.7-.7l9-11c.7-.85.75-2.1.15-3-.6-.9-1.85-1.1-2.7-.4l-11 9c-1.75 1.39-2.05 3.94-.7 5.7Z" />
        </svg>
      </div>
      <span className="logo-text">
        Dream<span className="text-highlight">To</span>Startup
      </span>
    </div>
  );

  return (
    <div className="home-wrapper">
      <header className="navbar">
        <Logo />
        <div className="nav-actions">
          <button className="btn-text" onClick={handleLogin}>
            Sign In
          </button>
          <button className="btn-outline" onClick={handleRegister}>
            Get Started Free
          </button>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Dream to Startup</h1>
            <p className="hero-subtitle">
              Join a community of innovators and visionaries. Create your profile,
              find investors, and start turning your idea into real success.
            </p>

            <div className="hero-cta-group">
              <button className="btn-primary" onClick={handleRegister}>
                Register Now
              </button>

              <p className="login-prompt">
                Already have an account?{" "}
                <button className="btn-inline-link" onClick={handleLogin}>
                  Log in
                </button>
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-container">
          <Logo />
          <p className="copyright">
            © 2026 Dream to Startup. Accelerating the future.
          </p>
        </div>
      </footer>
    </div>
  );
}
