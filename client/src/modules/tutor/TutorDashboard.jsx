import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  DollarSign, Users, BookOpen, TrendingUp, 
  IndianRupee, Star, ArrowUpRight, Clock, AlertCircle
} from 'lucide-react';

const TutorDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/tutor/dashboard-data', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error("Error fetching tutor data", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Premium Indigo Pulse Loader
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4 transition-colors">
        <div className="relative flex h-10 w-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-10 w-10 bg-indigo-500"></span>
        </div>
        <p className="font-bold text-slate-400 dark:text-slate-500 animate-pulse tracking-widest uppercase text-xs">Syncing Creator Studio...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-2" />
        <h3 className="text-lg font-black text-slate-900 dark:text-white">Dashboard Offline</h3>
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Could not load your creator metrics.</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors">
          Retry Connection
        </button>
      </div>
    );
  }

  const { stats, recentEnrollments } = data;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex justify-between items-end border-b border-slate-200/60 dark:border-slate-800/60 pb-6 transition-colors">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Instructor Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Welcome back! Here is how your courses are performing today.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20 shadow-sm transition-colors">
          <Star size={14} className="fill-indigo-500/20" /> Top Rated Creator
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Net Earnings - Highlighted Hero Card */}
        <div className="bg-gradient-to-br from-[#0f172a] to-[#020617] dark:from-indigo-950 dark:to-[#020617] p-6 rounded-3xl shadow-xl shadow-slate-900/10 dark:shadow-none border border-slate-800 text-white relative overflow-hidden group transition-all">
          <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <DollarSign size={100} />
          </div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
          
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Net Earnings</p>
            <div className="flex items-center gap-1 mt-3">
              <span className="text-emerald-400 text-2xl font-black">₹</span>
              <h2 className="text-4xl font-black tracking-tight">{stats.netEarnings?.toLocaleString() || 0}</h2>
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              After {stats.feePercent}% platform fee
            </p>
          </div>
        </div>

        <StatCard 
          label="Total Students" 
          value={stats.totalEnrollments || 0} 
          icon={<Users size={20}/>} 
          color="blue" 
          trend="+12%"
        />
        <StatCard 
          label="Courses Live" 
          value={stats.totalCourses || 0} 
          icon={<BookOpen size={20}/>} 
          color="purple" 
          trend="Stable"
        />
        <StatCard 
          label="Gross Revenue" 
          value={`₹${stats.grossRevenue?.toLocaleString() || 0}`} 
          icon={<TrendingUp size={20}/>} 
          color="orange" 
          trend="+5.4%"
        />
      </div>

      {/* RECENT ENROLLMENTS TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-xl shadow-slate-200/10 dark:shadow-none overflow-hidden transition-colors">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
          <h3 className="font-black text-slate-800 dark:text-white flex items-center gap-2 uppercase tracking-tight text-sm">
            <Clock size={18} className="text-indigo-500" /> Recent Enrollments
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                <th className="px-6 py-4 whitespace-nowrap">Student</th>
                <th className="px-6 py-4 whitespace-nowrap">Course</th>
                <th className="px-6 py-4 whitespace-nowrap">Date</th>
                <th className="px-6 py-4 text-right whitespace-nowrap">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {(!recentEnrollments || recentEnrollments.length === 0) ? (
                <tr>
                   <td colSpan="4" className="px-6 py-12 text-center text-slate-400 dark:text-slate-500 font-bold text-sm bg-slate-50/30 dark:bg-slate-900/30">
                     No enrollments recorded yet.
                   </td>
                </tr>
              ) : (
                recentEnrollments.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-sm border border-indigo-100 dark:border-indigo-500/20 shadow-inner">
                          {order.user?.name?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{order.user?.name || 'Unknown User'}</p>
                          <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500">{order.user?.email || 'No email provided'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-600 dark:text-slate-300 truncate max-w-[200px]">{order.course?.title}</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-end bg-emerald-50 dark:bg-emerald-500/10 w-fit ml-auto px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-500/20">
                        ₹{order.amount}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Reusable Stat Widget
const StatCard = ({ label, value, icon, color, trend }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
    orange: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3.5 rounded-2xl ${colors[color]} group-hover:scale-110 transition-transform shadow-inner`}>
          {icon}
        </div>
        <div className="flex items-center gap-1 text-[9px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 px-2 py-1 rounded-lg uppercase tracking-widest">
          <ArrowUpRight size={12} /> {trend}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</p>
        <p className="text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">{value}</p>
      </div>
    </div>
  );
};

export default TutorDashboard;