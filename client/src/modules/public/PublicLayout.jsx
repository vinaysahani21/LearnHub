import { Outlet, Link } from 'react-router-dom';
import { Search, Menu, X, Rocket, ChevronRight, Github, Twitter, Linkedin } from 'lucide-react';
import { useState, useEffect } from 'react';

const PublicLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add blur effect on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#fafcff] font-sans text-slate-900 selection:bg-indigo-500/30 selection:text-white">
      
      {/* --- ELITE NAVBAR --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-white/80 backdrop-blur-xl border-slate-200/50 shadow-sm' : 'bg-transparent border-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="bg-[#0a0f1c] p-2 rounded-xl group-hover:scale-105 transition-transform shadow-lg shadow-slate-900/20">
                <Rocket className="text-white w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900">
                Learn<span className="text-indigo-600">Hub</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search catalog..." 
                  className="pl-11 pr-4 py-2.5 text-sm font-bold bg-slate-100/80 border border-transparent rounded-full focus:bg-white focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/10 w-64 transition-all outline-none text-slate-900 placeholder:text-slate-400"
                />
              </div>
              
              <div className="flex items-center gap-6 text-sm font-bold">
                <Link to="/courses" className="text-slate-500 hover:text-indigo-600 transition-colors">Catalog</Link>
                <Link to="/auth/register-tutor" className="text-slate-500 hover:text-indigo-600 transition-colors">Teach</Link>
                <div className="w-px h-4 bg-slate-200"></div>
                <Link to="/auth/login" className="text-slate-900 hover:text-indigo-600 transition-colors">Sign In</Link>
                <Link to="/auth/register" className="px-6 py-3 text-white bg-[#0a0f1c] hover:bg-indigo-600 rounded-full transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center gap-2">
                  Get Started <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT INJECTOR --- */}
      <main className="flex-grow pt-20">
        <Outlet />
      </main>

      {/* --- CINEMATIC FOOTER --- */}
      <footer className="bg-[#0a0f1c] pt-24 pb-12 border-t border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
            
            <div className="col-span-2 lg:col-span-2">
              <Link to="/" className="flex items-center gap-2.5 mb-6">
                <div className="bg-indigo-600 p-2 rounded-xl">
                  <Rocket className="text-white w-5 h-5" />
                </div>
                <span className="text-2xl font-black tracking-tighter text-white">
                  Learn<span className="text-indigo-500">Hub</span>
                </span>
              </Link>
              <p className="text-slate-400 font-medium leading-relaxed max-w-sm mb-8">
                The world's most advanced platform for creators to teach and students to master the skills of tomorrow.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all"><Twitter size={18} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all"><Github size={18} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all"><Linkedin size={18} /></a>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6">Ecosystem</h3>
              <ul className="space-y-4 font-bold text-sm text-slate-400">
                <li><Link to="/courses" className="hover:text-indigo-400 transition-colors">Course Catalog</Link></li>
                <li><Link to="/auth/register-tutor" className="hover:text-indigo-400 transition-colors">Creator Studio</Link></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Enterprise</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6">Company</h3>
              <ul className="space-y-4 font-bold text-sm text-slate-400">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Blog</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6">Legal</h3>
              <ul className="space-y-4 font-bold text-sm text-slate-400">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm font-bold text-slate-500">&copy; 2026 LearnHub Inc. Designed in Surat.</p>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;