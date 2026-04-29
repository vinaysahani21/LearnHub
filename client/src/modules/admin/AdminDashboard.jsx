import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  Users, BookOpen, Presentation, IndianRupee, 
  Activity, ArrowRight, ShieldCheck, Clock, 
  TrendingUp, Wallet, Settings
} from 'lucide-react';
import api from '../../api/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalTutors: 0,
    totalCourses: 0,
    totalRevenue: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Data
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [statsRes, usersRes] = await Promise.all([
          api.get('/admin/stats', config),
          api.get('/admin/users', config)
        ]);

        // console.log("Admin Stats:", statsRes.data);
        // console.log("All Users:", usersRes.data);
        // console.log('total users calculated from usersRes:', usersRes.data.length);
        // 🔥 FIX: Calculate totalUsers from the users array since the stats endpoint doesn't send it!
        setStats({
          ...statsRes.data,
          totalUsers: usersRes.data.length 
        });
        
        // Only take the 5 newest users for the dashboard feed
        setRecentUsers(usersRes.data.slice(0, 5));
      } catch (err) {
        console.error("Admin Access Denied", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4 transition-colors">
        <div className="relative flex h-10 w-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-10 w-10 bg-red-500"></span>
        </div>
        <p className="font-bold text-slate-400 dark:text-slate-500 animate-pulse tracking-widest uppercase text-xs">Initializing Admin_OS...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-6 transition-colors">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            Command Center <Activity className="text-red-600 dark:text-red-500" size={28} />
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Real-time platform metrics and recent activity.</p>
        </div>
        <div className="bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 px-4 py-2 rounded-xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest border border-red-100 dark:border-red-500/20 shadow-sm transition-colors">
          <ShieldCheck size={16} /> Super Admin Access
        </div>
      </div>

      {/* TOP STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Hero Card: Revenue (Takes up 2 columns on large screens) */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-red-950/40 dark:to-slate-900 rounded-3xl p-8 text-white shadow-xl shadow-slate-900/10 dark:shadow-none border border-transparent dark:border-red-900/30 relative overflow-hidden group transition-all">
          <div className="absolute -right-6 -top-6 text-white/5 dark:text-red-500/5 transform group-hover:scale-110 transition-transform duration-700">
            <IndianRupee size={180} strokeWidth={3} />
          </div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center gap-3 mb-2 opacity-80">
              <div className="p-2 bg-white/10 dark:bg-red-500/20 rounded-xl backdrop-blur-sm"><TrendingUp size={20} className="text-white dark:text-red-400" /></div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-200 dark:text-red-200">Total Platform Revenue</span>
            </div>
            <div>
              <p className="text-5xl font-black tracking-tighter flex items-center gap-1 mt-4 text-white">
                <IndianRupee size={40} className="opacity-80 text-emerald-400"/> 
                {stats.totalRevenue?.toLocaleString() || 0}
              </p>
              <p className="text-sm text-emerald-400 font-bold mt-3 flex items-center gap-1">
                <ArrowRight size={14} className="-rotate-45" /> Platform remains profitable
              </p>
            </div>
          </div>
        </div>

        {/* Standard Metric Cards */}
        <StatWidget icon={<Users />} label="Total Students" value={stats.totalStudents} color="blue" />
        <StatWidget icon={<BookOpen />} label="Active Courses" value={stats.totalCourses} color="purple" />
        <StatWidget icon={<Presentation />} label="Total Tutors" value={stats.totalTutors} color="orange" />
        <StatWidget icon={<Wallet />} label="Total Users" value={stats.totalUsers} color="emerald" />

      </div>

      {/* BOTTOM ROW: RECENT ACTIVITY & QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Recent Registrations (Takes 2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col transition-colors">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
            <h3 className="font-black text-slate-800 dark:text-white flex items-center gap-2">
              <Clock size={18} className="text-red-500 dark:text-red-400"/> Recent Registrations
            </h3>
            <Link to="/admin/users" className="text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 flex items-center gap-1 group transition-colors">
              View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
            </Link>
          </div>
          
          <div className="p-6 flex-1 bg-white dark:bg-slate-900">
            {recentUsers.length === 0 ? (
              <p className="text-center text-slate-500 dark:text-slate-400 py-10">No recent activity.</p>
            ) : (
              <div className="space-y-4">
                {recentUsers.map(user => (
                  <div key={user._id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm dark:hover:bg-slate-800/50 transition-all bg-white dark:bg-slate-900 group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-black shadow-inner border border-slate-200 dark:border-slate-700">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">{user.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${
                        user.role === 'admin' ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20' :
                        user.role === 'tutor' ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-500/20' :
                        'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20'
                      }`}>
                        {user.role}
                      </span>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1.5">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick Actions */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col transition-colors">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50">
            <h3 className="font-black text-slate-800 dark:text-white flex items-center gap-2">
              <Activity size={18} className="text-red-500 dark:text-red-400"/> Quick Actions
            </h3>
          </div>
          <div className="p-6 space-y-3 flex-1 bg-white dark:bg-slate-900">
            <QuickActionButton to="/admin/content" icon={<BookOpen size={18}/>} title="Review Content" desc="Moderate newly published courses" color="indigo" />
            <QuickActionButton to="/admin/payouts" icon={<IndianRupee size={18}/>} title="Process Payouts" desc="Review pending tutor withdrawals" color="green" />
            <QuickActionButton to="/admin/categories" icon={<Settings size={18}/>} title="Manage Tags" desc="Add or remove course categories" color="purple" />
          </div>
        </div>

      </div>
    </div>
  );
};

// Polished Stat Widget Component
const StatWidget = ({ icon, label, value, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600 ring-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20",
    purple: "bg-purple-50 text-purple-600 ring-purple-100 dark:bg-purple-500/10 dark:text-purple-400 dark:ring-purple-500/20",
    orange: "bg-orange-50 text-orange-600 ring-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:ring-orange-500/20",
    emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between group hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ring-1 ${colors[color]} transition-transform group-hover:scale-110 shadow-inner`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{label}</p>
        <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">{value}</p>
      </div>
    </div>
  );
};

// Quick Action Button Component
const QuickActionButton = ({ to, icon, title, desc, color }) => {
  const hoverColors = {
    indigo: "hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 text-indigo-500 dark:text-indigo-400",
    green: "hover:border-emerald-200 dark:hover:border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 text-emerald-500 dark:text-emerald-400",
    purple: "hover:border-purple-200 dark:hover:border-purple-500/30 hover:bg-purple-50 dark:hover:bg-purple-500/10 group-hover:text-purple-600 dark:group-hover:text-purple-400 text-purple-500 dark:text-purple-400",
  };

  const parsedColors = hoverColors[color].split(' ');

  return (
    <Link to={to} className={`block p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all ${parsedColors[0]} ${parsedColors[1]} group`}>
      <div className="flex items-start gap-4">
        <div className={`p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl transition-colors shadow-inner border border-slate-100 dark:border-slate-700 ${parsedColors[2]} ${parsedColors[3]}`}>
          {icon}
        </div>
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-0.5">{title}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
        </div>
      </div>
    </Link>
  );
};

export default AdminDashboard;