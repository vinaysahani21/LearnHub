import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ShieldAlert, LayoutDashboard, Users, BookOpen, 
  DollarSign, Settings, LogOut, Banknote, Tags, ChevronDown,
  Megaphone, Bell, CheckCircle2, Info, Sun, Moon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx'; 
import { useTheme } from '../../context/ThemeContext.jsx'; // 🔥 IMPORTED THEME HOOK

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth(); 
  const { isDarkMode, toggleTheme } = useTheme(); // 🔥 ADDED THEME DESTRUCTURING
  
  // Notification States
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('http://localhost:5000/api/admin/notifications', config);
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications");
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.patch('http://localhost:5000/api/admin/notifications/read-all', {}, config);
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark notifications as read");
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // 🔥 FULLY ADAPTIVE SAAS LINK CLASSES
  const linkClass = (path) => `
    group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ease-out
    ${isActive(path) 
      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-500/20 ring-1 ring-red-500/50' 
      : 'text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-slate-800/60 hover:text-red-700 dark:hover:text-slate-100'}
  `;

  const iconClass = (path) => `
    transition-transform duration-300 group-hover:scale-110
    ${isActive(path) ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-red-600 dark:group-hover:text-slate-300'}
  `;

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#020617] font-sans transition-colors duration-300 selection:bg-red-500/30">
      
      {/* 1. ADAPTIVE PREMIUM SIDEBAR */}
      <aside className="w-64 bg-white dark:bg-[#0a0f1c] text-slate-900 dark:text-white flex flex-col fixed h-full z-30 border-r border-slate-200 dark:border-slate-800/50 shadow-sm dark:shadow-2xl transition-colors duration-300">
        <div className="h-20 flex items-center px-6 border-b border-slate-100 dark:border-slate-800/50 bg-white dark:bg-[#0a0f1c] z-10 transition-colors duration-300">
          <Link to="/admin/dashboard" className="text-xl font-black flex items-center gap-2 tracking-widest uppercase group">
            <ShieldAlert className="w-7 h-7 text-red-600 dark:text-red-500 group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-slate-900 dark:text-slate-100">Admin<span className="text-red-600 dark:text-red-500">_OS</span></span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 mt-2 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-3 mt-4">Overview</p>
          <Link to="/admin/dashboard" className={linkClass('/admin/dashboard')}>
            <LayoutDashboard size={18} className={iconClass('/admin/dashboard')} /> System Status
          </Link>
          
          <p className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-3 mt-8">Management</p>
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

          <p className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-3 mt-8">System</p>
          <Link to="/admin/broadcast" className={linkClass('/admin/broadcast')}>
            <Megaphone size={18} className={iconClass('/admin/broadcast')} /> Global Broadcast
          </Link>
          <Link to="/admin/settings" className={linkClass('/admin/settings')}>
            <Settings size={18} className={iconClass('/admin/settings')} /> Platform Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800/50 bg-white dark:bg-[#0a0f1c] transition-colors duration-300">
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 w-full rounded-xl text-sm font-bold transition-all group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> 
            <span className="uppercase tracking-wider text-xs font-black">Secure Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        
        {/* GLASSMORPHISM ADAPTIVE HEADER */}
        <header className="h-20 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/50 flex justify-between items-center px-8 sticky top-0 z-20 shadow-sm transition-colors duration-300">
          
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-200 dark:border-emerald-500/20 shadow-sm transition-colors">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </div>
            System Healthy
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-6">
            
            {/* 🔥 NEW: THEME TOGGLE BUTTON 🔥 */}
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:ring-2 hover:ring-red-500/50 transition-all shadow-inner border border-slate-200 dark:border-slate-700"
              title="Toggle Appearance"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* NOTIFICATION BELL & DROPDOWN */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:ring-2 hover:ring-red-500/50 transition-all shadow-inner border border-slate-200 dark:border-slate-700"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-4 w-80 md:w-96 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200 origin-top-right">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800/50 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white">System Alerts</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{unreadCount} unread</p>
                    </div>
                    {unreadCount > 0 && (
                      <button onClick={markAllAsRead} className="text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400 hover:text-red-800 transition-colors flex items-center gap-1">
                        <CheckCircle2 size={12}/> Mark all read
                      </button>
                    )}
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center flex flex-col items-center">
                        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3 text-slate-300 dark:text-slate-600"><Bell size={20}/></div>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">System operations normal.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
                        {notifications.map((notif) => (
                          <div key={notif._id} className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex gap-4 ${notif.isRead ? 'opacity-60' : ''}`}>
                            <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${notif.isRead ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' : 'bg-red-50 dark:bg-red-500/10 text-red-500 border border-red-100 dark:border-red-500/20'}`}>
                              <Info size={14} />
                            </div>
                            <div>
                              <h4 className={`text-xs font-black ${notif.isRead ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>{notif.title}</h4>
                              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{notif.message}</p>
                              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-2">{new Date(notif.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 p-1.5 pr-4 rounded-full transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-white font-black shadow-inner shadow-white/10 ring-2 ring-white dark:ring-slate-900">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-black text-slate-900 dark:text-white leading-none">{user?.name || 'Administrator'}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-1">Access Level: Root</p>
              </div>
              <ChevronDown size={14} className="text-slate-400 dark:text-slate-500 ml-2" />
            </div>
          </div>

        </header>

        <main className="p-8 text-slate-900 dark:text-slate-100">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;