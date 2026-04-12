import { Outlet, Link } from 'react-router-dom';
import { Rocket, Quote, Sparkles } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-white flex selection:bg-indigo-500/30">
      
      {/* LEFT SIDE: Cinematic Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0a0f1c] relative overflow-hidden flex-col justify-between p-12">
        {/* Abstract Glowing Orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay"></div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 w-fit group">
            <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-900/50 group-hover:scale-105 transition-transform">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <span className="text-3xl font-black tracking-tighter text-white">
              Learn<span className="text-indigo-500">Hub</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 mb-10">
          <Quote className="text-indigo-500/50 w-16 h-16 mb-6" />
          <h2 className="text-4xl font-black text-white leading-[1.15] tracking-tight mb-6">
            The platform that turns <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              ambition into expertise.
            </span>
          </h2>
          <p className="text-lg text-slate-400 font-medium max-w-md leading-relaxed">
            Join thousands of developers, designers, and creators who are building the future.
          </p>
          
          <div className="flex items-center gap-4 mt-12">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0a0f1c] bg-slate-800 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="user" className="w-full h-full object-cover"/>
                </div>
              ))}
            </div>
            <p className="text-sm font-bold text-slate-400">
              <span className="text-white font-black">10k+</span> active learners
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: The Form Container */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative">
        {/* Mobile Logo (Only shows when left panel is hidden) */}
        <div className="lg:hidden absolute top-8 left-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg"><Rocket className="text-white w-5 h-5" /></div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">LearnHub</span>
          </Link>
        </div>

        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Outlet /> 
        </div>
        
        <p className="absolute bottom-8 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
          &copy; 2026 LearnHub Inc. Secure Login.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;