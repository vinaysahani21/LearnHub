import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ShieldAlert, LayoutDashboard, Users, BookOpen, 
  DollarSign,IndianRupee, Settings, LogOut, Banknote, Tags, ChevronDown,
  Megaphone, Bell, CheckCircle2, Info, Sun, Moon, Menu,
  PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx'; 
import { useTheme } from '../../context/ThemeContext.jsx'; 

const AdminLayout = () => {
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

  const isActive = (path) => location.pathname === path;

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

  // Fully Adaptive Link Classes handling Collapse State
  const linkClass = (path) => `
    group flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 rounded-xl text-sm font-bold transition-all duration-300 ease-out relative
    ${isActive(path) 
      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-500/20 ring-1 ring-red-500/50' 
      : 'text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-slate-800/60 hover:text-red-700 dark:hover:text-slate-100'}
  `;

  const iconClass = (path) => `
    transition-transform duration-300 group-hover:scale-110 shrink-0
    ${isActive(path) ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-red-600 dark:group-hover:text-slate-300'}
  `;

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#020617] font-sans transition-colors duration-300 selection:bg-red-500/30">
      
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
          <Link to="/admin/dashboard" className="text-xl font-black flex items-center gap-2 tracking-widest uppercase group" title="Admin_OS">
            <ShieldAlert className="w-7 h-7 text-red-600 dark:text-red-500 group-hover:rotate-12 transition-transform duration-300 shrink-0" />
            {!isCollapsed && <span className="text-slate-900 dark:text-slate-100 animate-in fade-in duration-300 whitespace-nowrap">Admin<span className="text-red-600 dark:text-red-500">_OS</span></span>}
          </Link>
        </div>

        <nav className={`flex-1 space-y-1.5 mt-2 overflow-y-auto custom-scrollbar ${isCollapsed ? 'p-3' : 'p-4'}`}>
          {!isCollapsed && <p className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-3 mt-4 animate-in fade-in">Overview</p>}
          
          <Link to="/admin/dashboard" className={linkClass('/admin/dashboard')} title={isCollapsed ? "System Status" : ""}>
            <LayoutDashboard size={18} className={iconClass('/admin/dashboard')} />
            {!isCollapsed && <span className="animate-in fade-in whitespace-nowrap">System Status</span>}
          </Link>
          
          {!isCollapsed && <p className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-3 mt-8 animate-in fade-in">Management</p>}
          {isCollapsed && <div className="h-px bg-slate-200 dark:bg-slate-800 my-4 mx-2"></div>}

          <Link to="/admin/categories" className={linkClass('/admin/categories')} title={isCollapsed ? "Categories" : ""}>
            <Tags size={18} className={iconClass('/admin/categories')} />
            {!isCollapsed && <span className="animate-in fade-in whitespace-nowrap">Categories</span>}
          </Link>
          <Link to="/admin/users" className={linkClass('/admin/users')} title={isCollapsed ? "User Database" : ""}>
            <Users size={18} className={iconClass('/admin/users')} />
            {!isCollapsed && <span className="animate-in fade-in whitespace-nowrap">User Database</span>}
          </Link>
          <Link to="/admin/content" className={linkClass('/admin/content')} title={isCollapsed ? "Content Moderation" : ""}>
            <BookOpen size={18} className={iconClass('/admin/content')} />
            {!isCollapsed && <span className="animate-in fade-in whitespace-nowrap">Content Moderation</span>}
          </Link>
          <Link to="/admin/finance" className={linkClass('/admin/finance')} title={isCollapsed ? "Financial Records" : ""}>
            <IndianRupee size={18} className={iconClass('/admin/finance')} />
            {!isCollapsed && <span className="animate-in fade-in whitespace-nowrap">Financial Records</span>}
          </Link>
          <Link to="/admin/payouts" className={linkClass('/admin/payouts')} title={isCollapsed ? "Payouts" : ""}>
            <Banknote size={18} className={iconClass('/admin/payouts')} />
            {!isCollapsed && <span className="animate-in fade-in whitespace-nowrap">Payouts</span>}
          </Link>

          {!isCollapsed && <p className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-3 mt-8 animate-in fade-in">System</p>}
          {isCollapsed && <div className="h-px bg-slate-200 dark:bg-slate-800 my-4 mx-2"></div>}

          <Link to="/admin/broadcast" className={linkClass('/admin/broadcast')} title={isCollapsed ? "Global Broadcast" : ""}>
            <Megaphone size={18} className={iconClass('/admin/broadcast')} />
            {!isCollapsed && <span className="animate-in fade-in whitespace-nowrap">Global Broadcast</span>}
          </Link>
          <Link to="/admin/settings" className={linkClass('/admin/settings')} title={isCollapsed ? "Platform Settings" : ""}>
            <Settings size={18} className={iconClass('/admin/settings')} />
            {!isCollapsed && <span className="animate-in fade-in whitespace-nowrap">Platform Settings</span>}
          </Link>
        </nav>

        <div className={`border-t border-slate-100 dark:border-slate-800/50 bg-white dark:bg-[#0a0f1c] transition-all duration-300 ${isCollapsed ? 'p-3 flex justify-center' : 'p-4'}`}>
          <button 
            onClick={handleLogout} 
            title={isCollapsed ? "Secure Logout" : ""}
            className={`flex items-center text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl text-sm font-bold transition-all group ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3 w-full'}`}
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform shrink-0" /> 
            {!isCollapsed && <span className="uppercase tracking-wider text-xs font-black animate-in fade-in whitespace-nowrap">Secure Logout</span>}
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        
        {/* GLASSMORPHISM ADAPTIVE HEADER */}
        <header className="h-20 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/50 flex justify-between items-center px-4 md:px-8 sticky top-0 z-20 shadow-sm transition-colors duration-300">
          
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button onClick={() => setIsMobileOpen(true)} className="md:hidden p-2 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <Menu size={24} />
            </button>

            {/* Desktop Sidebar Toggle */}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)} 
              className="hidden md:flex p-2.5 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 bg-slate-100 dark:bg-slate-800/50 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-200 dark:hover:border-red-500/30"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
            </button>

            {/* System Status Badge (Hidden on very small mobile screens for space) */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-200 dark:border-emerald-500/20 shadow-sm transition-colors">
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </div>
              System Healthy
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-4 md:gap-6">
            
            {/* THEME TOGGLE BUTTON */}
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
            <div className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 p-1.5 pr-2 md:pr-4 rounded-full transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-white font-black shadow-inner shadow-white/10 ring-2 ring-white dark:ring-slate-900 shrink-0">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-black text-slate-900 dark:text-white leading-none">{user?.name || 'Administrator'}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-1">Access Level: Root</p>
              </div>
              <ChevronDown size={14} className="text-slate-400 dark:text-slate-500 ml-1 hidden sm:block" />
            </div>
          </div>

        </header>

        <main className="p-4 sm:p-8 text-slate-900 dark:text-slate-100 flex-1 w-full max-w-[1600px] mx-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;