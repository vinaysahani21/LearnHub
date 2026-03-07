import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  ShieldAlert, 
  Settings, 
  LogOut, 
  Activity,
  DollarSign 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const AdminLayout = () => {
  const { logout, user } = useAuth(); // Get user and logout function
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      
      {/* SIDEBAR - Dark Slate for Authority */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col fixed h-full z-10 shadow-xl">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
          <Link to="/" className="text-lg font-bold flex items-center gap-2 text-white">
            <ShieldAlert className="w-6 h-6 text-red-500" />
            <span className="tracking-wider">ADMIN<span className="text-red-500">_OS</span></span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Overview</p>
          
          <Link to="/admin/dashboard" 
            className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all ${
              isActive('/admin/dashboard') 
                ? 'bg-red-600 text-white shadow-lg shadow-red-900/50' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}>
            <LayoutDashboard size={18} />
            System Status
          </Link>

          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 mt-6">Management</p>

          <Link to="/admin/users" 
            className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all ${
              isActive('/admin/users') 
                ? 'bg-red-600 text-white' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}>
            <Users size={18} />
            User Database
          </Link>

          <Link to="/admin/courses" 
            className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all ${
              isActive('/admin/courses') 
                ? 'bg-red-600 text-white' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}>
            <BookOpen size={18} />
            Content Moderation
          </Link>

          <Link to="/admin/orders" 
            className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all ${
              isActive('/admin/orders') 
                ? 'bg-red-600 text-white' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}>
            <DollarSign size={18} />
            Financial Records
          </Link>

          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 mt-6">System</p>

          <Link to="/admin/settings" 
            className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all ${
              isActive('/admin/settings') 
                ? 'bg-red-600 text-white' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}>
            <Settings size={18} />
            Platform Settings
          </Link>
        </nav>

        {/* Bottom Panel */}
        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 w-full rounded-md text-sm font-bold transition-all uppercase tracking-wide"
          >
            <LogOut size={18} />
            Secure Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 md:ml-64 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex justify-between items-center px-8 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold uppercase">
            <Activity size={14} />
            System Healthy
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">{user?.name || "Super Admin"}</p>
              <p className="text-xs text-slate-500">Access Level: Root</p>
            </div>
            <div className="w-10 h-10 rounded bg-slate-900 text-white flex items-center justify-center font-bold border-2 border-slate-200">
              {user?.name?.charAt(0) || "A"}
            </div>
          </div>
        </header>

        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;