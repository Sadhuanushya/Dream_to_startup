import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const handleRegister = () => navigate("/register");
  const handleLogin = () => navigate("/login");

  // Modern Professional Logo
  const Logo = () => (
    <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate("/")}>
      <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 16.5c-1.5 1.26-2 3.4-2 3.4s2.14-.5 3.4-2c1.76 1.35 4.31 1.05 5.7-.7l9-11c.7-.85.75-2.1.15-3-.6-.9-1.85-1.1-2.7-.4l-11 9c-1.75 1.39-2.05 3.94-.7 5.7Z"/>
        </svg>
      </div>
      <span className="text-2xl font-black tracking-tighter text-slate-900 ">
        Dream<span className="text-indigo-600">To</span>Startup
      </span>
    </div>
  );

  return (
    <div className="w-screen min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100">
      
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-8 h-20 flex justify-between items-center">
        <Logo />
        <div className="flex items-center gap-6">
          <button onClick={handleLogin} className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition">
            Sign In
          </button>
          <button 
            onClick={handleRegister} 
            className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition"
          >
            Get Started Free
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-48 pb-32 px-6 flex flex-col items-center text-center bg-slate-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent -z-10"></div>

        <div className="max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-800 mb-8 leading-[0.9]">
            Dream to Startup
          </h1>

          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
            Join a community of innovators and visionaries. Create your profile, 
            find investors, and start turning your idea into real success.
          </p>

          <div className="flex flex-col items-center justify-center gap-6">
            {/* Main CTA Button - Restored Styling */}
            <button 
              onClick={handleRegister} 
              className="bg-indigo-600 hover:bg-indigo-700 text-grey font-black px-14 py-4 rounded-2xl shadow-xl shadow-indigo-200 transition-all transform hover:-translate-y-1 active:scale-95 text-lg"
            >
              Register Now
            </button>
            
            {/* Secondary Login Prompt */}
            <p className="text-slate-500 font-medium">
              Already have an account?{" "}
              <button 
                onClick={handleLogin} 
                className="text-indigo-600 font-bold hover:underline underline-offset-4"
              >
                Log in
              </button>
            </p>
          </div>
        </div>
      </section>

      {/* SUCCESS STORIES */}
      <section className="bg-slate-50 py-32 px-8 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-indigo-600 font-black text-sm uppercase tracking-[0.3em] mb-4">Milestones</h2>
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">Success Stories</h3>
            </div>
            <p className="text-slate-500 font-medium text-lg">Real founders. Real funding. Real growth.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              { title: "Tech Bridge", desc: "Transformed their idea into a global software platform with funding from our network." },
              { title: "Green Foods", desc: "Grew from a local startup to a national brand within 18 months, thanks to our investor community." },
              { title: "HealthBee", desc: "Secured seed funding and grew user base to 100k+ within one year." }
            ].map((story, i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 group">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl mb-8 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h4 className="text-2xl font-black text-slate-900 mb-4">{story.title}</h4>
                <p className="text-slate-500 leading-relaxed font-medium italic">"{story.desc}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white py-12 px-8 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <Logo />
          <p className="text-slate-400 font-bold text-sm">© 2026 Dream to Startup. Accelerating the future.</p>
        </div>
      </footer>
    </div>
  );
}