import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  Users, BookOpen, Presentation, IndianRupee, 
  Activity, ArrowRight, ShieldCheck, Clock, 
  TrendingUp, Wallet, Settings
} from 'lucide-react';

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
          axios.get('http://localhost:5000/api/admin/stats', config),
          axios.get('http://localhost:5000/api/admin/users', config)
        ]);

        setStats(statsRes.data);
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
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <div className="relative flex h-10 w-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-10 w-10 bg-red-500"></span>
        </div>
        <p className="font-bold text-slate-400 animate-pulse tracking-widest uppercase text-xs">Initializing Admin_OS...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200/60 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Command Center <Activity className="text-red-500" size={28} />
          </h1>
          <p className="text-slate-500 font-medium mt-1">Real-time platform metrics and recent activity.</p>
        </div>
        <div className="bg-gradient-to-r from-red-50 to-orange-50 text-red-700 px-4 py-2 rounded-xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest border border-red-100 shadow-sm">
          <ShieldCheck size={16} /> Super Admin Access
        </div>
      </div>

      {/* TOP STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Hero Card: Revenue (Takes up 2 columns on large screens) */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#0a0f1c] to-[#1e293b] rounded-2xl p-8 text-white shadow-xl shadow-slate-900/10 relative overflow-hidden group">
          {/* Background decoration */}
          <div className="absolute -right-6 -top-6 text-white/5 transform group-hover:scale-110 transition-transform duration-500">
            <IndianRupee size={180} strokeWidth={3} />
          </div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center gap-3 mb-2 opacity-80">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm"><TrendingUp size={20} /></div>
              <span className="text-xs font-black uppercase tracking-widest">Total Platform Revenue</span>
            </div>
            <div>
              <p className="text-5xl font-black tracking-tighter flex items-center gap-1 mt-4">
                <IndianRupee size={40} className="opacity-80"/> 
                {stats.totalRevenue?.toLocaleString() || 0}
              </p>
              <p className="text-sm text-emerald-400 font-bold mt-2 flex items-center gap-1">
                <ArrowRight size={14} className="-rotate-45" /> +12% from last month
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
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-black text-slate-800 flex items-center gap-2">
              <Clock size={18} className="text-indigo-500"/> Recent Registrations
            </h3>
            <Link to="/admin/users" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group">
              View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
            </Link>
          </div>
          
          <div className="p-6 flex-1">
            {recentUsers.length === 0 ? (
              <p className="text-center text-slate-500 py-10">No recent activity.</p>
            ) : (
              <div className="space-y-4">
                {recentUsers.map(user => (
                  <div key={user._id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all bg-white">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-black shadow-inner">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${
                        user.role === 'admin' ? 'bg-red-50 text-red-600 border border-red-100' :
                        user.role === 'tutor' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                        'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}>
                        {user.role}
                      </span>
                      <p className="text-[10px] font-bold text-slate-400 mt-1.5">
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
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-black text-slate-800 flex items-center gap-2">
              <Activity size={18} className="text-red-500"/> Quick Actions
            </h3>
          </div>
          <div className="p-6 space-y-3 flex-1">
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
    blue: "bg-blue-50 text-blue-600 ring-blue-100",
    purple: "bg-purple-50 text-purple-600 ring-purple-100",
    orange: "bg-orange-50 text-orange-600 ring-orange-100",
    emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col justify-between group hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4 mb-4">
        <div className={`p-3 rounded-xl ring-1 ${colors[color]} transition-transform group-hover:scale-110`}>
          {icon}
        </div>
        <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">{label}</p>
      </div>
      <p className="text-4xl font-black text-slate-900 tracking-tight">{value}</p>
    </div>
  );
};

// Quick Action Button Component
const QuickActionButton = ({ to, icon, title, desc, color }) => {
  const hoverColors = {
    indigo: "hover:border-indigo-200 hover:bg-indigo-50 group-hover:text-indigo-600",
    green: "hover:border-green-200 hover:bg-green-50 group-hover:text-green-600",
    purple: "hover:border-purple-200 hover:bg-purple-50 group-hover:text-purple-600",
  };

  return (
    <Link to={to} className={`block p-4 rounded-xl border border-slate-100 bg-white transition-all ${hoverColors[color].split(' ')[0]} ${hoverColors[color].split(' ')[1]} group`}>
      <div className="flex items-start gap-4">
        <div className={`p-2 bg-slate-50 rounded-lg text-slate-500 transition-colors ${hoverColors[color].split(' ')[2]}`}>
          {icon}
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-sm mb-0.5">{title}</h4>
          <p className="text-xs text-slate-500">{desc}</p>
        </div>
      </div>
    </Link>
  );
};

export default AdminDashboard;