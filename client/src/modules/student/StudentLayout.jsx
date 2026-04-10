import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  LayoutDashboard, BookOpen, User, LogOut, Bell, 
  Compass, Menu, Settings, Sun, Moon, Sparkles, 
  CheckCircle2, Info, PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

const StudentLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme(); 

  // Sidebar States
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Notification States
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

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
      const res = await axios.get('http://localhost:5000/api/student/notifications', config);
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications");
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.patch('http://localhost:5000/api/student/notifications/read-all', {}, config);
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark notifications as read");
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  // Dynamic classes for sidebar links based on collapsed state
  const linkClass = (path) => `
    group flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-300 ease-out relative
    ${isActive(path) 
      ? "bg-gradient-to-r from-sky-500 to-cyan-400 text-[#0a0f1c] shadow-lg shadow-sky-500/20 ring-1 ring-sky-400/50" 
      : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100"}
  `;

  const iconClass = (path) => `
    transition-transform duration-300 group-hover:scale-110 shrink-0
    ${isActive(path) ? 'text-[#0a0f1c]' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}
  `;

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#020617] font-sans transition-colors duration-300 selection:bg-sky-500/30">
      
      {/* MOBILE OVERLAY */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* 1. ADAPTIVE SIDEBAR */}
      <aside className={`
        fixed h-full z-40 flex flex-col bg-white dark:bg-[#0a0f1c] border-r border-slate-200 dark:border-slate-800/50 shadow-2xl md:shadow-sm dark:shadow-2xl transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className={`h-24 flex items-center border-b border-slate-100 dark:border-slate-800/50 bg-white dark:bg-[#0a0f1c] z-10 transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'px-8'}`}>
          <Link to="/student/dashboard" className="text-2xl font-black flex items-center gap-2 tracking-tight group" title="LearnHub">
            <div className="p-2 bg-sky-500/10 rounded-xl group-hover:bg-sky-500/20 transition-colors border border-sky-500/20 shrink-0">
              <Sparkles className="w-6 h-6 text-sky-500 dark:text-sky-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            {!isCollapsed && <span className="text-slate-900 dark:text-white animate-in fade-in duration-300 whitespace-nowrap">Learn<span className="text-sky-500">Hub</span></span>}
          </Link>
        </div>

        <nav className={`flex-1 space-y-2 mt-4 overflow-y-auto custom-scrollbar ${isCollapsed ? 'p-3' : 'p-5'}`}>
          {!isCollapsed && <p className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-4 animate-in fade-in">Learning OS</p>}
          
          <Link to="/student/dashboard" className={linkClass("/student/dashboard")} title={isCollapsed ? "Home" : ""}>
            <LayoutDashboard size={18} className={iconClass("/student/dashboard")} />
            {!isCollapsed && <span className="animate-in fade-in whitespace-nowrap">Home</span>}
          </Link>
          <Link to="/student/explore" className={linkClass("/student/explore")} title={isCollapsed ? "Catalog" : ""}>
            <Compass size={18} className={iconClass("/student/explore")} />
            {!isCollapsed && <span className="animate-in fade-in whitespace-nowrap">Catalog</span>}
          </Link>
          <Link to="/student/my-learning" className={linkClass("/student/my-learning")} title={isCollapsed ? "My Learning" : ""}>
            <BookOpen size={18} className={iconClass("/student/my-learning")} />
            {!isCollapsed && <span className="animate-in fade-in whitespace-nowrap">My Learning</span>}
          </Link>

          {!isCollapsed && <p className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-4 mt-8 animate-in fade-in">Account</p>}
          {isCollapsed && <div className="h-px bg-slate-200 dark:bg-slate-800 my-4 mx-2"></div>}
          
          <Link to="/student/profile" className={linkClass("/student/profile")} title={isCollapsed ? "Profile" : ""}>
            <User size={18} className={iconClass("/student/profile")} />
            {!isCollapsed && <span className="animate-in fade-in whitespace-nowrap">Profile</span>}
          </Link>
          <Link to="/student/settings" className={linkClass("/student/settings")} title={isCollapsed ? "Settings" : ""}>
            <Settings size={18} className={iconClass("/student/settings")} />
            {!isCollapsed && <span className="animate-in fade-in whitespace-nowrap">Settings</span>}
          </Link>
        </nav>

        <div className={`border-t border-slate-100 dark:border-slate-800/50 bg-white dark:bg-[#0a0f1c] transition-all duration-300 ${isCollapsed ? 'p-3 flex justify-center' : 'p-5'}`}>
          <button 
            onClick={handleLogout} 
            title={isCollapsed ? "Sign Out" : ""}
            className={`flex items-center text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl text-xs font-black uppercase tracking-widest transition-all group ${isCollapsed ? 'justify-center p-3.5' : 'gap-3 px-4 py-3 w-full'}`}
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform shrink-0" /> 
            {!isCollapsed && <span className="animate-in fade-in whitespace-nowrap">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        
        {/* Glassmorphism Header */}
        <header className="h-24 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/50 flex justify-between items-center px-4 md:px-8 sticky top-0 z-20 transition-colors duration-300">
          
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button onClick={() => setIsMobileOpen(true)} className="md:hidden p-2 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <Menu size={24} />
            </button>

            {/* Desktop Sidebar Toggle */}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)} 
              className="hidden md:flex p-2.5 text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 bg-slate-100 dark:bg-slate-800/50 hover:bg-sky-50 dark:hover:bg-sky-500/10 rounded-xl transition-all border border-transparent hover:border-sky-200 dark:hover:border-sky-500/30"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
            </button>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <button onClick={toggleTheme} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-all shadow-inner border border-slate-200 dark:border-slate-700">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* NOTIFICATION BELL & DROPDOWN */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-all shadow-inner border border-slate-200 dark:border-slate-700"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-sky-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-4 w-80 md:w-96 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200 origin-top-right">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800/50 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white">Notifications</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{unreadCount} unread</p>
                    </div>
                    {unreadCount > 0 && (
                      <button onClick={markAllAsRead} className="text-[10px] font-black uppercase tracking-widest text-sky-600 dark:text-sky-400 hover:text-sky-800 transition-colors flex items-center gap-1">
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
                            <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${notif.isRead ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' : 'bg-sky-50 dark:bg-sky-500/10 text-sky-500 border border-sky-100 dark:border-sky-500/20'}`}>
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
                <p className="text-sm font-black text-slate-900 dark:text-white leading-none">
                  {user?.name || "Student"}
                </p>
                <p className="text-[10px] text-sky-600 dark:text-sky-500 font-black uppercase mt-1 tracking-widest flex items-center justify-end gap-1.5">
                  <span className="w-1.5 h-1.5 bg-sky-500 rounded-full"></span> Learner
                </p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 text-white flex items-center justify-center font-black text-lg border-2 border-white dark:border-slate-800 shadow-lg group-hover:scale-105 transition-transform overflow-hidden shrink-0">
                {user?.profilePic ? (
                  <img src={user.profilePic} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0).toUpperCase() || "S"
                )}
              </div>
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