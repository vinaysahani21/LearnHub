import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, User, LogOut, Bell, 
  Compass, Menu, Settings, Sun, Moon, Sparkles, ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

const StudentLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme(); 

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const linkClass = (path) => `
    group flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-300 ease-out
    ${isActive(path) 
      ? "bg-gradient-to-r from-sky-500 to-cyan-400 text-[#0a0f1c] shadow-lg shadow-sky-500/20 ring-1 ring-sky-400/50" 
      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100"}
  `;

  const iconClass = (path) => `
    transition-transform duration-300 group-hover:scale-110
    ${isActive(path) ? 'text-[#0a0f1c]' : 'text-slate-500 group-hover:text-slate-300'}
  `;

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#020617] font-sans transition-colors duration-300 selection:bg-sky-500/30">
      
      {/* 1. PREMIUM SIDEBAR */}
      <aside className="w-64 bg-[#0a0f1c] text-white hidden md:flex flex-col fixed h-full z-30 border-r border-slate-800/50 shadow-2xl">
        <div className="h-24 flex items-center px-8 border-b border-slate-800/50 bg-[#0a0f1c] z-10">
          <Link to="/student/dashboard" className="text-2xl font-black flex items-center gap-2 tracking-tight group">
            <div className="p-2 bg-sky-500/10 rounded-xl group-hover:bg-sky-500/20 transition-colors border border-sky-500/20">
              <Sparkles className="w-6 h-6 text-sky-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <span className="text-white">Learn<span className="text-sky-500">Hub</span></span>
          </Link>
        </div>

        <nav className="flex-1 p-5 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">Learning OS</p>
          
          <Link to="/student/dashboard" className={linkClass("/student/dashboard")}>
            <LayoutDashboard size={18} className={iconClass("/student/dashboard")} /> Home
          </Link>
          <Link to="/student/explore" className={linkClass("/student/explore")}>
            <Compass size={18} className={iconClass("/student/explore")} /> Catalog
          </Link>
          <Link to="/student/my-learning" className={linkClass("/student/my-learning")}>
            <BookOpen size={18} className={iconClass("/student/my-learning")} /> My Learning
          </Link>

          <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4 mt-8">Account</p>
          
          <Link to="/student/profile" className={linkClass("/student/profile")}>
            <User size={18} className={iconClass("/student/profile")} /> Profile
          </Link>
          <Link to="/student/settings" className={linkClass("/student/settings")}>
            <Settings size={18} className={iconClass("/student/settings")} /> Settings
          </Link>
        </nav>

        <div className="p-5 border-t border-slate-800/50 bg-[#0a0f1c]">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 w-full rounded-2xl text-xs font-black uppercase tracking-widest transition-all group">
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> Sign Out
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 md:ml-64 flex flex-col min-w-0">
        
        {/* Glassmorphism Header */}
        <header className="h-24 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/50 flex justify-between md:justify-end items-center px-8 sticky top-0 z-20 transition-colors duration-300">
          
          <div className="flex items-center md:hidden">
            <button className="p-2 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <Menu size={24} />
            </button>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={toggleTheme} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-all shadow-inner border border-slate-200 dark:border-slate-700">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button className="relative p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-all shadow-inner border border-slate-200 dark:border-slate-700">
              <Bell size={18} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-sky-500 rounded-full border border-white dark:border-slate-900 animate-pulse"></span>
            </button>
            
            <div className="flex items-center gap-4 pl-6 border-l border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 pr-4 rounded-full transition-colors cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900 dark:text-white leading-none">
                  {user?.name || "Student"}
                </p>
                <p className="text-[10px] text-sky-500 font-black uppercase mt-1 tracking-widest flex items-center justify-end gap-1.5">
                  <span className="w-1.5 h-1.5 bg-sky-500 rounded-full"></span> Learner
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 text-white flex items-center justify-center font-black text-lg border-2 border-white dark:border-slate-800 shadow-lg group-hover:scale-105 transition-transform">
                {user?.name?.charAt(0).toUpperCase() || "S"}
              </div>
              <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
            </div>
          </div>
        </header>

        <main className="p-6 sm:p-10 max-w-7xl mx-auto w-full text-slate-900 dark:text-slate-100 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;