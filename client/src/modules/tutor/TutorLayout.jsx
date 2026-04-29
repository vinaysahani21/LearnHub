import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  LayoutDashboard, Video, BarChart, Settings, LogOut, 
  Users, User2, Sun, Moon, Menu, Wallet, Sparkles, ChevronDown,
  Bell, CheckCircle2, Info, PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import api from '../../api/api';

const TutorLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  
  // Sidebar States
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Notification States
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);
  
  const isActive = (path) => location.pathname.startsWith(path);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await api.get('/tutor/notifications', config);
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications");
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await api.patch('/tutor/notifications/read-all', {}, config);
      
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark notifications as read");
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Fully Adaptive Link Classes handling Collapse State
  const linkClass = (path) => `
    group flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 rounded-xl text-sm font-bold transition-all duration-300 ease-out relative
    ${isActive(path) 
      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 ring-1 ring-indigo-500/50' 
      : 'text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-800/60 hover:text-indigo-700 dark:hover:text-slate-100'}
  `;

  const iconClass = (path) => `
    transition-transform duration-300 group-hover:scale-110 shrink-0
    ${isActive(path) 
      ? 'text-white' 
      : 'text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-slate-300'}
  `;

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#020617] font-sans transition-colors duration-300 selection:bg-indigo-500/30">
      
      {/* MOBILE OVERLAY */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* 1. ADAPTIVE PREMIUM SIDEBAR */}
      <aside className={`
        fixed h-full z-40 flex flex-col bg-white dark:bg-[#0a0f1c] text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800/50 shadow-2xl md:shadow-sm dark:shadow-2xl transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className={`h-20 flex items-center border-b border-slate-100 dark:border-slate-800/50 bg-white dark:bg-[#0a0f1c] z-10 transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'px-6'}`}>
          <Link to="/tutor/dashboard" className="text-xl font-black flex items-center gap-2 tracking-tight group" title="Creator Studio">
            <div className="p-1.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 transition-colors border border-transparent dark:border-indigo-500/20 shrink-0">
               <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            {!isCollapsed && <span className="text-slate-900 dark:text-slate-100 animate-in fade-in duration-300 whitespace-nowrap">Creator<span className="text-indigo-600 dark:text-indigo-500">Studio</span></span>}
          </Link>
        </div>

        <nav className={`flex-1 space-y-1.5 mt-2 overflow-y-auto custom-scrollbar ${isCollapsed ? 'p-3' : 'p-4'}`}>
          {!isCollapsed && <p className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-3 mt-4 animate-in fade-in">Workspace</p>}
          
          <Link to="/tutor/dashboard" className={linkClass('/tutor/dashboard')} title={isCollapsed ? "Overview" : ""}>
            <LayoutDashboard size={18} className={iconClass('/tutor/dashboard')} />
            {!isCollapsed && <span className="animate-in fade-in whitespace-nowrap">Overview</span>}
          </Link>
          <Link to="/tutor/my-courses" className={linkClass('/tutor/my-courses')} title={isCollapsed ? "Content Library" : ""}>
            <Video size={18} className={iconClass('/tutor/my-courses')} />
            {!isCollapsed && <span className="animate-in fade-in whitespace-nowrap">Content Library</span>}
          </Link>
          <Link to="/tutor/students" className={linkClass('/tutor/students')} title={isCollapsed ? "My Students" : ""}>
            <Users size={18} className={iconClass('/tutor/students')} />
            {!isCollapsed && <span className="animate-in fade-in whitespace-nowrap">My Students</span>}
          </Link>
          
          {!isCollapsed && <p className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-3 mt-8 animate-in fade-in">Business</p>}
          {isCollapsed && <div className="h-px bg-slate-200 dark:bg-slate-800 my-4 mx-2"></div>}

          <Link to="/tutor/analytics" className={linkClass('/tutor/analytics')} title={isCollapsed ? "Analytics" : ""}>
            <BarChart size={18} className={iconClass('/tutor/analytics')} />
            {!isCollapsed && <span className="animate-in fade-in whitespace-nowrap">Analytics</span>}
          </Link>
          <Link to="/tutor/payouts" className={linkClass('/tutor/payouts')} title={isCollapsed ? "Earnings & Payouts" : ""}>
            <Wallet size={18} className={iconClass('/tutor/payouts')} />
            {!isCollapsed && <span className="animate-in fade-in whitespace-nowrap">Earnings & Payouts</span>}
          </Link>

          {!isCollapsed && <p className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-3 mt-8 animate-in fade-in">Account</p>}
          {isCollapsed && <div className="h-px bg-slate-200 dark:bg-slate-800 my-4 mx-2"></div>}

          <Link to="/tutor/profile" className={linkClass('/tutor/profile')} title={isCollapsed ? "Public Profile" : ""}>
            <User2 size={18} className={iconClass('/tutor/profile')} />
            {!isCollapsed && <span className="animate-in fade-in whitespace-nowrap">Public Profile</span>}
          </Link>
          <Link to="/tutor/settings" className={linkClass('/tutor/settings')} title={isCollapsed ? "Settings" : ""}>
            <Settings size={18} className={iconClass('/tutor/settings')} />
            {!isCollapsed && <span className="animate-in fade-in whitespace-nowrap">Settings</span>}
          </Link>
        </nav>

        <div className={`border-t border-slate-100 dark:border-slate-800/50 bg-white dark:bg-[#0a0f1c] transition-all duration-300 ${isCollapsed ? 'p-3 flex justify-center' : 'p-4'}`}>
          <button 
            onClick={handleLogout} 
            title={isCollapsed ? "Sign Out" : ""}
            className={`flex items-center text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl text-sm font-bold transition-all group ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3 w-full'}`}
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform shrink-0" /> 
            {!isCollapsed && <span className="uppercase tracking-wider text-xs font-black animate-in fade-in whitespace-nowrap">End Session</span>}
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        
        <header className="h-20 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/50 flex justify-between items-center px-4 md:px-8 sticky top-0 z-20 shadow-sm transition-colors duration-300">
          
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button onClick={() => setIsMobileOpen(true)} className="md:hidden p-2 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <Menu size={24} />
            </button>

            {/* Desktop Sidebar Toggle */}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)} 
              className="hidden md:flex p-2.5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-all border border-transparent hover:border-indigo-200 dark:hover:border-indigo-500/30"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
            </button>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:ring-2 hover:ring-indigo-500/50 transition-all shadow-inner border border-slate-200 dark:border-slate-700"
              title="Toggle Appearance"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* NOTIFICATION BELL & DROPDOWN */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:ring-2 hover:ring-indigo-500/50 transition-all shadow-inner border border-slate-200 dark:border-slate-700"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-4 w-80 md:w-96 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200 origin-top-right">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800/50 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white">Studio Alerts</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{unreadCount} unread</p>
                    </div>
                    {unreadCount > 0 && (
                      <button onClick={markAllAsRead} className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 transition-colors flex items-center gap-1">
                        <CheckCircle2 size={12}/> Mark all read
                      </button>
                    )}
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center flex flex-col items-center">
                        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3 text-slate-300 dark:text-slate-600"><Bell size={20}/></div>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">You're all caught up!</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
                        {notifications.map((notif) => (
                          <div key={notif._id} className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex gap-4 ${notif.isRead ? 'opacity-60' : ''}`}>
                            <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${notif.isRead ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' : 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20'}`}>
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

            <div className="flex items-center gap-4 pl-4 md:pl-6 border-l border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 pr-2 md:pr-4 rounded-full transition-colors cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900 dark:text-white leading-none capitalize">
                  {user?.name || 'Creator'}
                </p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-500 font-black uppercase tracking-widest mt-1 flex items-center justify-end gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  Studio Active
                </p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-black shadow-inner shadow-white/20 ring-2 ring-white dark:ring-slate-900 overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                {user?.profilePic ? (
                  <img src={user.profilePic} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0).toUpperCase() || 'C'
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-8 flex-1 w-full max-w-[1600px] mx-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default TutorLayout;