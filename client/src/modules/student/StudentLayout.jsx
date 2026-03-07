import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  User, 
  LogOut, 
  Bell, 
  Search, 
  Compass, 
  Menu, 
  Settings,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

const StudentLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme(); // Use Theme Context

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  // Dynamic Class Helper for Links
  const linkClass = (path) => `
    flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
    ${isActive(path) 
      ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-r-2 border-indigo-600" 
      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"}
  `;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
      
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col fixed h-full z-10 shadow-sm transition-colors duration-300">
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 z-20">
          <Link
            to="/"
            className="text-xl font-bold flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="bg-indigo-600 p-1.5 rounded-lg shadow-md shadow-indigo-200 dark:shadow-none">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-slate-900 dark:text-white tracking-tight">LearnHub</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto mt-2">
          <p className="px-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
            Menu
          </p>

          <Link to="/student/dashboard" className={linkClass("/student/dashboard")}>
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          
          <Link to="/student/explore" className={linkClass("/student/explore")}>
            <Compass size={20} /> Explore Courses
          </Link>

          <Link to="/student/my-learning" className={linkClass("/student/my-learning")}>
            <BookOpen size={20} /> My Learning
          </Link>

          <Link to="/student/profile" className={linkClass("/student/profile")}>
            <User size={20} /> My Profile
          </Link>

          <Link to="/student/settings" className={linkClass("/student/settings")}>
            <Settings size={20} /> Settings
          </Link>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg text-sm font-bold transition-colors"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 md:ml-64 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center px-4 sm:px-8 sticky top-0 z-20 shadow-sm transition-colors duration-300">
          
          <div className="flex items-center gap-4">
            {/* Mobile Menu Trigger */}
            <button className="md:hidden p-2 text-slate-600 dark:text-slate-400">
              <Menu size={24} />
            </button>

            {/* Search Bar */}
            <div className="relative w-full max-w-md hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search courses..."
                className="w-64 focus:w-80 pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              />
            </div>
          </div>

          {/* User Profile, Notifs & Theme Toggle */}
          <div className="flex items-center gap-3 sm:gap-5">
            
            {/* QUICK THEME TOGGLE */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:ring-2 hover:ring-indigo-400 transition-all"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button className="relative text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-4 sm:pl-5 border-l border-slate-200 dark:border-slate-700">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                  {user?.name || "Student"}
                </p>
                <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase mt-1 tracking-wider">Student</p>
              </div>
              
              <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-bold border border-indigo-200 dark:border-indigo-800/50">
                {user?.name?.charAt(0).toUpperCase() || "S"}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Injection */}
        <main className="p-6 sm:p-8 max-w-7xl mx-auto w-full text-slate-900 dark:text-slate-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;