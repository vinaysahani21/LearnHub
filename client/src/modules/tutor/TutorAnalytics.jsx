import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  BarChart3, TrendingUp, IndianRupee, Users, 
  BookOpen, Star, ArrowUpRight, Loader2, Award
} from 'lucide-react';

const TutorAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ revenue: 0, students: 0, courses: 0 });
  const [topCourses, setTopCourses] = useState([]);

  useEffect(() => {
    // We can piggyback off the dashboard endpoint for real high-level stats
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/tutor/dashboard-data', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setSummary({
          revenue: res.data.stats.netEarnings,
          students: res.data.stats.totalEnrollments,
          courses: res.data.stats.totalCourses
        });

        // For the "Top Courses" list, we'll map the recent enrollments or use dummy data if empty
        // In a real app, you'd add a MongoDB aggregation here to group by course!
        setTopCourses(res.data.recentEnrollments || []);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  // Pure CSS Chart Data (Simulated 6-Month Trend for visual impact)
  const chartData = [
    { month: 'Oct', revenue: 12000, height: '40%' },
    { month: 'Nov', revenue: 18500, height: '60%' },
    { month: 'Dec', revenue: 14000, height: '50%' },
    { month: 'Jan', revenue: 28000, height: '85%' },
    { month: 'Feb', revenue: 22000, height: '70%' },
    { month: 'Mar', revenue: 35000, height: '100%' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <div className="relative flex h-10 w-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-10 w-10 bg-indigo-500"></span>
        </div>
        <p className="font-bold text-slate-400 animate-pulse tracking-widest uppercase text-xs">Generating Reports...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 dark:border-slate-800/50 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            Performance Analytics <BarChart3 className="text-indigo-500" size={28} />
          </h1>
          <p className="text-slate-500 font-medium mt-1">Track your growth, revenue trends, and content engagement.</p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-xl flex items-center gap-2 border border-indigo-100 dark:border-indigo-500/20 font-black text-[10px] uppercase tracking-widest shadow-sm">
           <TrendingUp size={14}/> Q1 2026 Report Active
        </div>
      </div>

      {/* TOP STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex items-center gap-5 group hover:border-emerald-200 transition-colors">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform"><IndianRupee size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Net Revenue</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">₹{summary.revenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex items-center gap-5 group hover:border-blue-200 transition-colors">
          <div className="p-4 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform"><Users size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Enrollments</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{summary.students}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex items-center gap-5 group hover:border-purple-200 transition-colors">
          <div className="p-4 bg-purple-50 dark:bg-purple-500/10 text-purple-600 rounded-2xl group-hover:scale-110 transition-transform"><BookOpen size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Courses</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{summary.courses}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* MAIN CHART AREA (Pure Tailwind CSS Chart!) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-xl shadow-slate-200/10 dark:shadow-none p-8 flex flex-col">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Revenue Growth</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Last 6 Months</p>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-lg text-xs font-black">
              <ArrowUpRight size={14}/> +24%
            </div>
          </div>

          {/* The CSS Bar Chart */}
          <div className="flex-1 flex items-end justify-between gap-2 sm:gap-6 pt-10 border-b border-slate-100 dark:border-slate-800 pb-4 h-64 relative">
            {/* Horizontal Grid Lines */}
            <div className="absolute top-0 w-full border-t border-slate-100 dark:border-slate-800/50 border-dashed"></div>
            <div className="absolute top-1/2 w-full border-t border-slate-100 dark:border-slate-800/50 border-dashed"></div>
            
            {chartData.map((data, index) => (
              <div key={index} className="flex flex-col items-center flex-1 group z-10">
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] font-black px-2 py-1 rounded mb-2 whitespace-nowrap pointer-events-none">
                  ₹{data.revenue.toLocaleString()}
                </div>
                {/* The Bar */}
                <div 
                  className="w-full max-w-[40px] bg-gradient-to-t from-indigo-600 to-violet-400 rounded-t-lg group-hover:from-indigo-500 group-hover:to-violet-300 transition-colors shadow-lg shadow-indigo-500/20"
                  style={{ height: data.height }}
                ></div>
                {/* Label */}
                <span className="text-[10px] font-black text-slate-400 uppercase mt-4">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* TOP PERFORMING COURSES */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-xl shadow-slate-200/10 dark:shadow-none p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Award className="text-orange-500" size={20} />
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Top Assets</h2>
          </div>

          <div className="space-y-6 flex-1">
             {/* We simulate course performance bars here */}
             <CoursePerformanceBar title="Advanced React Architecture" percent="85%" sales="₹142,000" />
             <CoursePerformanceBar title="Node.js Backend Masterclass" percent="60%" sales="₹89,500" />
             <CoursePerformanceBar title="UI/UX for Developers" percent="40%" sales="₹45,000" />
             <CoursePerformanceBar title="MongoDB Data Aggregation" percent="25%" sales="₹21,000" />
          </div>
          
          <button className="w-full mt-6 py-3 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-black text-[10px] uppercase tracking-widest rounded-xl transition-colors">
            View Full Report
          </button>
        </div>

      </div>
    </div>
  );
};

// Reusable Course Performance Bar Component
const CoursePerformanceBar = ({ title, percent, sales }) => (
  <div>
    <div className="flex justify-between items-end mb-2">
      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[180px]">{title}</span>
      <span className="text-[10px] font-black text-emerald-600">{sales}</span>
    </div>
    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
      <div className="bg-indigo-500 h-2 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: percent }}></div>
    </div>
  </div>
);

export default TutorAnalytics;