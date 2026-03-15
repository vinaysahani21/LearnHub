import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, LayoutDashboard, Users, BookOpen, 
  DollarSign, Settings, LogOut, Activity, Banknote, Tags, ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx'; 

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth(); // Assuming 'user' isn't strictly needed for the UI avatar right now
  
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  // Ultra-polished link class with hover animations and gradient active states
  const linkClass = (path) => `
    group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ease-out
    ${isActive(path) 
      ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md shadow-red-900/30 ring-1 ring-red-500/50' 
      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'}
  `;

  // Icon animation class
  const iconClass = (path) => `
    transition-transform duration-300 group-hover:scale-110
    ${isActive(path) ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}
  `;

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans selection:bg-red-500/30">
      
      {/* 1. PREMIUM SIDEBAR */}
      <aside className="w-64 bg-[#0a0f1c] text-white flex flex-col fixed h-full z-30 border-r border-slate-800/50 shadow-2xl">
        
        {/* Logo Area */}
        <div className="h-20 flex items-center px-6 border-b border-slate-800/50 bg-[#0a0f1c] z-10">
          <Link to="/admin/dashboard" className="text-xl font-black flex items-center gap-2 tracking-widest uppercase group">
            <ShieldAlert className="w-7 h-7 text-red-500 group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-slate-100">Admin<span className="text-red-500">_OS</span></span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1.5 mt-2 overflow-y-auto custom-scrollbar">
          
          <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3 mt-4">Overview</p>
          <Link to="/admin/dashboard" className={linkClass('/admin/dashboard')}>
            <LayoutDashboard size={18} className={iconClass('/admin/dashboard')} /> System Status
          </Link>
          
          <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3 mt-8">Management</p>
          <Link to="/admin/categories" className={linkClass('/admin/categories')}>
            <Tags size={18} className={iconClass('/admin/categories')} /> Categories
          </Link>
          <Link to="/admin/users" className={linkClass('/admin/users')}>
            <Users size={18} className={iconClass('/admin/users')} /> User Database
          </Link>
          <Link to="/admin/content" className={linkClass('/admin/content')}>
            <BookOpen size={18} className={iconClass('/admin/content')} /> Content Moderation
          </Link>
          <Link to="/admin/finance" className={linkClass('/admin/finance')}>
            <DollarSign size={18} className={iconClass('/admin/finance')} /> Financial Records
          </Link>
          <Link to="/admin/payouts" className={linkClass('/admin/payouts')}>
            <Banknote size={18} className={iconClass('/admin/payouts')} /> Payouts
          </Link>
          
          <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3 mt-8">System</p>
          <Link to="/admin/settings" className={linkClass('/admin/settings')}>
            <Settings size={18} className={iconClass('/admin/settings')} /> Platform Settings
          </Link>

        </nav>

        {/* Footer Logout Area */}
        <div className="p-4 border-t border-slate-800/50 bg-[#0a0f1c]">
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 w-full rounded-xl text-sm font-bold transition-all group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> 
            <span className="uppercase tracking-wider text-xs font-black">Secure Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        
        {/* Glassmorphism Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex justify-between items-center px-8 sticky top-0 z-20 shadow-sm">
          
          {/* Animated Healthy Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50/80 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-200/50 shadow-sm">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </div>
            System Healthy
          </div>

          {/* Premium User Profile Pill */}
          <div className="flex items-center gap-3 hover:bg-slate-50 p-1.5 pr-4 rounded-full transition-colors cursor-pointer border border-transparent hover:border-slate-200">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0f172a] to-slate-700 flex items-center justify-center text-white font-black shadow-inner shadow-white/10 ring-2 ring-white">
              A
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-black text-slate-900 leading-none">Administrator</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Access Level: Root</p>
            </div>
            <ChevronDown size={14} className="text-slate-400 ml-2" />
          </div>

        </header>

        {/* Page Content Injector */}
        <main className="p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;