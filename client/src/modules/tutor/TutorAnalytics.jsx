import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  BarChart3, TrendingUp, IndianRupee, Users, 
  BookOpen, Star, ArrowUpRight, Award, AlertCircle
} from 'lucide-react';

const TutorAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [summary, setSummary] = useState({ revenue: 0, students: 0, courses: 0, feePercent: 10 });
  
  // Real Dynamic Data States
  const [chartData, setChartData] = useState([]);
  const [topCourses, setTopCourses] = useState([]);
  const [growthTrend, setGrowthTrend] = useState(0);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/tutor/dashboard-data', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const { stats, allOrders } = res.data;
        
        setSummary({
          revenue: stats.netEarnings || 0,
          students: stats.totalEnrollments || 0,
          courses: stats.totalCourses || 0,
          feePercent: stats.feePercent || 10
        });

        // 🔥 DATA PROCESSING ENGINE 🔥
        const ordersToProcess = allOrders || res.data.recentEnrollments || [];

        // 1. Process "Top Assets" (Group by Course)
        const courseMap = {};
        ordersToProcess.forEach(order => {
          const title = order.course?.title || 'Unknown Course';
          if (!courseMap[title]) courseMap[title] = { title, revenue: 0, count: 0 };
          
          // Calculate Net Revenue per course
          const net = order.amount - (order.amount * (stats.feePercent / 100));
          courseMap[title].revenue += net;
          courseMap[title].count += 1;
        });

        // Sort by revenue and get top 4
        const sortedCourses = Object.values(courseMap).sort((a, b) => b.revenue - a.revenue).slice(0, 4);
        const maxCourseRevenue = Math.max(...sortedCourses.map(c => c.revenue), 1); // Prevent div by 0
        
        const formattedTopCourses = sortedCourses.map(c => ({
           ...c,
           percent: `${Math.max((c.revenue / maxCourseRevenue) * 100, 5)}%` // Min 5% width for UI
        }));
        setTopCourses(formattedTopCourses);

        // 2. Process "Monthly Revenue" (Last 6 Months)
        const monthMap = {};
        const monthNames = [];
        
        // Generate last 6 months dynamically (e.g., Oct, Nov, Dec, Jan, Feb, Mar)
        for (let i = 5; i >= 0; i--) {
          const d = new Date();
          d.setMonth(d.getMonth() - i);
          const monthStr = d.toLocaleString('default', { month: 'short' });
          monthMap[monthStr] = 0;
          monthNames.push(monthStr);
        }

        ordersToProcess.forEach(order => {
          const orderDate = new Date(order.createdAt);
          const monthStr = orderDate.toLocaleString('default', { month: 'short' });
          
          if (monthMap[monthStr] !== undefined) {
             const net = order.amount - (order.amount * (stats.feePercent / 100));
             monthMap[monthStr] += net;
          }
        });

        const dynamicChartData = monthNames.map(month => ({ month, revenue: monthMap[month] }));
        const maxChartRevenue = Math.max(...dynamicChartData.map(d => d.revenue), 1000); // Base scale of 1000
        
        const finalChartData = dynamicChartData.map(d => ({
           ...d,
           height: `${Math.max((d.revenue / maxChartRevenue) * 100, 2)}%` // Min 2% height so bar is visible
        }));
        
        setChartData(finalChartData);

        // 3. Calculate simple growth trend (Current month vs Previous month)
        if (finalChartData.length >= 2) {
           const currentMonthRev = finalChartData[5].revenue;
           const prevMonthRev = finalChartData[4].revenue;
           if (prevMonthRev > 0) {
              const growth = ((currentMonthRev - prevMonthRev) / prevMonthRev) * 100;
              setGrowthTrend(growth.toFixed(1));
           } else if (currentMonthRev > 0) {
              setGrowthTrend(100); // 100% growth if prev month was 0 and current is > 0
           }
        }

      } catch (err) {
        console.error("Failed to fetch analytics", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4 transition-colors">
        <div className="relative flex h-10 w-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-10 w-10 bg-indigo-500"></span>
        </div>
        <p className="font-bold text-slate-400 dark:text-slate-500 animate-pulse tracking-widest uppercase text-xs">Aggregating Data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in transition-colors">
        <div className="bg-rose-50 dark:bg-rose-500/10 p-6 rounded-full mb-6 border border-rose-100 dark:border-rose-500/20 shadow-sm">
            <AlertCircle size={48} className="text-rose-500" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Analytics Offline</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2 mb-8">Could not connect to the reporting engine.</p>
        <button onClick={() => window.location.reload()} className="px-8 py-3 bg-[#0a0f1c] dark:bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 dark:hover:bg-indigo-500 transition-colors shadow-lg active:scale-95">
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 dark:border-slate-800/60 pb-6 transition-colors">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            Performance Analytics <BarChart3 className="text-indigo-500" size={28} />
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Track your growth, revenue trends, and content engagement.</p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-xl flex items-center gap-2 border border-indigo-100 dark:border-indigo-500/20 font-black text-[10px] uppercase tracking-widest shadow-sm">
           <TrendingUp size={14}/> Dynamic Report Active
        </div>
      </div>

      {/* TOP STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex items-center gap-5 group hover:border-emerald-200 dark:hover:border-emerald-500/30 transition-colors">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform shadow-inner border border-emerald-100 dark:border-emerald-500/20"><IndianRupee size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Total Net Revenue</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">₹{summary.revenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex items-center gap-5 group hover:border-blue-200 dark:hover:border-blue-500/30 transition-colors">
          <div className="p-4 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl group-hover:scale-110 transition-transform shadow-inner border border-blue-100 dark:border-blue-500/20"><Users size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Total Enrollments</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{summary.students}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex items-center gap-5 group hover:border-purple-200 dark:hover:border-purple-500/30 transition-colors">
          <div className="p-4 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-2xl group-hover:scale-110 transition-transform shadow-inner border border-purple-100 dark:border-purple-500/20"><BookOpen size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Active Courses</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{summary.courses}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* MAIN CHART AREA (Dynamic Pure CSS Chart) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-xl shadow-slate-200/10 dark:shadow-none p-8 flex flex-col transition-colors">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Revenue Growth</h2>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Last 6 Months (Net)</p>
            </div>
            {growthTrend !== 0 && (
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black border ${
                growthTrend > 0 
                  ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20' 
                  : 'text-rose-500 bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20'
              }`}>
                <ArrowUpRight size={14} className={growthTrend < 0 ? 'rotate-90' : ''} /> 
                {growthTrend > 0 ? '+' : ''}{growthTrend}%
              </div>
            )}
          </div>

          <div className="flex-1 flex items-end justify-between gap-2 sm:gap-6 pt-10 border-b border-slate-100 dark:border-slate-800 pb-4 h-64 relative">
            <div className="absolute top-0 w-full border-t border-slate-100 dark:border-slate-800/50 border-dashed"></div>
            <div className="absolute top-1/2 w-full border-t border-slate-100 dark:border-slate-800/50 border-dashed"></div>
            
            {chartData.map((data, index) => (
              <div key={index} className="flex flex-col items-center flex-1 group z-10 h-full justify-end">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black px-3 py-1.5 rounded-lg mb-2 whitespace-nowrap pointer-events-none shadow-xl relative top-2 group-hover:-translate-y-2 duration-300">
                  ₹{data.revenue.toLocaleString()}
                </div>
                <div 
                  className="w-full max-w-[40px] bg-gradient-to-t from-indigo-600 to-violet-400 dark:from-indigo-500 dark:to-violet-400 rounded-t-xl group-hover:from-indigo-500 group-hover:to-violet-300 transition-colors shadow-lg shadow-indigo-500/20 dark:shadow-none relative overflow-hidden"
                  style={{ height: data.height }}
                >
                  <div className="absolute inset-0 bg-white/20 group-hover:translate-y-full transition-transform duration-700 ease-in-out"></div>
                </div>
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mt-4">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* TOP PERFORMING COURSES */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-xl shadow-slate-200/10 dark:shadow-none p-6 flex flex-col transition-colors">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
            <Award className="text-orange-500 dark:text-orange-400" size={20} />
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Top Assets</h2>
          </div>
          
          <div className="space-y-6 flex-1">
             {topCourses.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                  <BookOpen size={32} className="mb-2 opacity-50"/>
                  <p className="text-xs font-bold uppercase tracking-widest text-center">No sales data yet</p>
               </div>
             ) : (
               topCourses.map((course, i) => (
                 <CoursePerformanceBar 
                   key={i} 
                   title={course.title} 
                   percent={course.percent} 
                   sales={`₹${course.revenue.toLocaleString()}`} 
                 />
               ))
             )}
          </div>
        </div>

      </div>
    </div>
  );
};

// Reusable Dynamic Course Performance Bar Component
const CoursePerformanceBar = ({ title, percent, sales }) => (
  <div className="group cursor-default">
    <div className="flex justify-between items-end mb-2">
      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[180px] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{title}</span>
      <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-500/20">{sales}</span>
    </div>
    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden shadow-inner">
      <div 
        className="bg-gradient-to-r from-indigo-500 to-violet-400 h-2 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-1000 ease-out" 
        style={{ width: percent }}
      ></div>
    </div>
  </div>
);

export default TutorAnalytics;