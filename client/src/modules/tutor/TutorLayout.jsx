import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Video, BarChart, Settings, LogOut, 
  Users, User2, Sun, Moon, Menu 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

const TutorLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const linkClass = (path) => `
    flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all duration-200
    ${isActive(path) 
      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
      : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
  `;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col fixed h-full z-30 shadow-xl border-r border-slate-800">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
          <Link to="/" className="text-xl font-black flex items-center gap-2 text-white tracking-tight">
            <Video className="w-6 h-6 text-indigo-400" />
            <span>Tutor<span className="text-indigo-500">Panel</span></span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Main Menu</p>
          <Link to="/tutor/dashboard" className={linkClass('/tutor/dashboard')}><LayoutDashboard size={20} /> Overview</Link>
          <Link to="/tutor/my-courses" className={linkClass('/tutor/my-courses')}><Video size={20} /> My Content</Link>
          <Link to="/tutor/students" className={linkClass('/tutor/students')}><Users size={20} /> Students</Link>
          <Link to="/tutor/analytics" className={linkClass('/tutor/analytics')}><BarChart size={20} /> Analytics</Link>
          <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 mt-6">Account</p>
          <Link to="/tutor/profile" className={linkClass('/tutor/profile')}><User2 size={20} /> Profile</Link>
          <Link to="/tutor/settings" className={linkClass('/tutor/settings')}><Settings size={20} /> Settings</Link>
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 w-full rounded-lg text-sm font-black transition-all uppercase tracking-wider">
            <LogOut size={20} /> Secure Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 md:ml-64 flex flex-col min-w-0">
        {/* Header - FIXED ALIGNMENT 🚀 */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex justify-between md:justify-end items-center px-8 sticky top-0 z-20 shadow-sm transition-colors duration-300">
          
          {/* Only visible on Mobile: Left Side Menu */}
          <div className="flex items-center md:hidden">
            <button className="text-slate-600 dark:text-slate-400">
              <Menu size={24} />
            </button>
          </div>

          {/* Right Side Group */}
          <div className="flex items-center gap-6">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:ring-2 hover:ring-indigo-500 transition-all"
              title="Toggle Appearance"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="flex items-center gap-4 pl-6 border-l border-slate-100 dark:border-slate-800">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900 dark:text-white leading-none capitalize">
                  {user?.name || 'Instructor'}
                </p>
                <p className="text-[10px] text-green-500 font-black uppercase tracking-tighter mt-1 flex items-center justify-end gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold border-2 border-white dark:border-slate-700 shadow-lg shadow-indigo-900/20">
                {user?.name?.charAt(0).toUpperCase() || 'T'}
              </div>
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

export default TutorLayout;