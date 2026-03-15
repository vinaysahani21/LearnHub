import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  DollarSign, Users, BookOpen, TrendingUp, 
  IndianRupee, Briefcase, Star, ArrowUpRight, Clock
} from 'lucide-react';

const TutorDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/tutor/dashboard-data', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error("Error fetching tutor data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Signature Red Pulse Loader
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <div className="relative flex h-10 w-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-10 w-10 bg-red-500"></span>
        </div>
        <p className="font-bold text-slate-400 animate-pulse tracking-widest uppercase text-xs">Syncing Creator Studio...</p>
      </div>
    );
  }

  const { stats, recentEnrollments } = data;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex justify-between items-end border-b border-slate-200/60 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Instructor Dashboard</h1>
          <p className="text-slate-500 font-medium mt-1">Welcome back! Here is how your courses are performing today.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100 shadow-sm">
          <Star size={14} /> Top Rated Creator
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Net Earnings - Highlighted */}
        <div className="bg-[#0a0f1c] p-6 rounded-2xl shadow-xl shadow-slate-900/10 text-white relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform">
            <DollarSign size={80} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Net Earnings</p>
          <div className="flex items-center gap-1 mt-2">
            <IndianRupee size={24} className="text-emerald-400" />
            <h2 className="text-3xl font-black">{stats.netEarnings.toLocaleString()}</h2>
          </div>
          <p className="text-[9px] text-slate-500 mt-2">After {stats.feePercent}% platform fee</p>
        </div>

        <StatCard 
          label="Total Students" 
          value={stats.totalEnrollments} 
          icon={<Users size={20}/>} 
          color="blue" 
          trend="+12%"
        />
        <StatCard 
          label="Courses Live" 
          value={stats.totalCourses} 
          icon={<BookOpen size={20}/>} 
          color="purple" 
          trend="Stable"
        />
        <StatCard 
          label="Gross Revenue" 
          value={`₹${stats.grossRevenue.toLocaleString()}`} 
          icon={<TrendingUp size={20}/>} 
          color="orange" 
          trend="+5.4%"
        />
      </div>

      {/* RECENT ENROLLMENTS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight text-sm">
            <Clock size={18} className="text-indigo-500" /> Recent Enrollments
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentEnrollments.length === 0 ? (
                <tr>
                   <td colSpan="4" className="px-6 py-10 text-center text-slate-400 font-medium italic">No enrollments recorded yet.</td>
                </tr>
              ) : (
                recentEnrollments.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs">
                          {order.user?.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{order.user?.name}</p>
                          <p className="text-[10px] text-slate-400">{order.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-600 truncate max-w-[200px]">{order.course?.title}</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-black text-emerald-600 flex items-center justify-end">
                        <IndianRupee size={12} /> {order.amount}
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
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-xl ${colors[color]} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
          <ArrowUpRight size={12} /> {trend}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-black text-slate-900 mt-1">{value}</p>
      </div>
    </div>
  );
};

export default TutorDashboard;