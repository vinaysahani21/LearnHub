import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Video, BarChart, Settings, LogOut, 
  Users, User2, Sun, Moon, Menu, Wallet, Sparkles, ChevronDown 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

const TutorLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  
  const isActive = (path) => location.pathname.startsWith(path);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  // Ultra-polished link class with hover animations and gradient active states
  const linkClass = (path) => `
    group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ease-out
    ${isActive(path) 
      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-900/30 ring-1 ring-indigo-500/50' 
      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'}
  `;

  const iconClass = (path) => `
    transition-transform duration-300 group-hover:scale-110
    ${isActive(path) ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}
  `;

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#020617] font-sans transition-colors duration-300 selection:bg-indigo-500/30">
      
      {/* 1. PREMIUM SIDEBAR */}
      <aside className="w-64 bg-[#0a0f1c] text-white hidden md:flex flex-col fixed h-full z-30 border-r border-slate-800/50 shadow-2xl">
        
        {/* Logo Area */}
        <div className="h-20 flex items-center px-6 border-b border-slate-800/50 bg-[#0a0f1c] z-10">
          <Link to="/tutor/dashboard" className="text-xl font-black flex items-center gap-2 tracking-tight group">
            <div className="p-1.5 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
               <Sparkles className="w-6 h-6 text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <span className="text-slate-100">Creator<span className="text-indigo-500">Studio</span></span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1.5 mt-2 overflow-y-auto custom-scrollbar">
          
          <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3 mt-4">Workspace</p>
          <Link to="/tutor/dashboard" className={linkClass('/tutor/dashboard')}>
            <LayoutDashboard size={18} className={iconClass('/tutor/dashboard')} /> Overview
          </Link>
          <Link to="/tutor/my-courses" className={linkClass('/tutor/my-courses')}>
            <Video size={18} className={iconClass('/tutor/my-courses')} /> Content Library
          </Link>
          <Link to="/tutor/students" className={linkClass('/tutor/students')}>
            <Users size={18} className={iconClass('/tutor/students')} /> My Students
          </Link>
          
          <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3 mt-8">Business</p>
          <Link to="/tutor/analytics" className={linkClass('/tutor/analytics')}>
            <BarChart size={18} className={iconClass('/tutor/analytics')} /> Analytics
          </Link>
          <Link to="/tutor/payouts" className={linkClass('/tutor/payouts')}>
            <Wallet size={18} className={iconClass('/tutor/payouts')} /> Earnings & Payouts
          </Link>

          <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3 mt-8">Account</p>
          <Link to="/tutor/profile" className={linkClass('/tutor/profile')}>
            <User2 size={18} className={iconClass('/tutor/profile')} /> Public Profile
          </Link>
          <Link to="/tutor/settings" className={linkClass('/tutor/settings')}>
            <Settings size={18} className={iconClass('/tutor/settings')} /> Settings
          </Link>

        </nav>

        {/* Footer Logout Area */}
        <div className="p-4 border-t border-slate-800/50 bg-[#0a0f1c]">
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 w-full rounded-xl text-sm font-bold transition-all group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> 
            <span className="uppercase tracking-wider text-xs font-black">End Session</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 md:ml-64 flex flex-col min-w-0">
        
        {/* Glassmorphism Header */}
        <header className="h-20 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/50 flex justify-between md:justify-end items-center px-8 sticky top-0 z-20 shadow-sm transition-colors duration-300">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button className="p-2 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <Menu size={20} />
            </button>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-6">
            
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:ring-2 hover:ring-indigo-500/50 transition-all shadow-inner"
              title="Toggle Appearance"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Premium User Profile Pill */}
            <div className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 p-1.5 pr-4 rounded-full transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
              <div className="text-right hidden sm:block pl-4 border-l border-slate-200 dark:border-slate-800">
                <p className="text-sm font-black text-slate-900 dark:text-white leading-none capitalize">
                  {user?.name || 'Creator'}
                </p>
                <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mt-1 flex items-center justify-end gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  Studio Active
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-black shadow-inner shadow-white/20 ring-2 ring-white dark:ring-slate-900">
                {user?.name?.charAt(0).toUpperCase() || 'C'}
              </div>
              <ChevronDown size={14} className="text-slate-400 dark:text-slate-500 hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Page Content Injector */}
        <main className="p-4 sm:p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default TutorLayout;