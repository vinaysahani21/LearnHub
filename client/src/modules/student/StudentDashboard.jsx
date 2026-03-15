import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  PlayCircle, Clock, Award, ArrowRight, BookOpen, 
  Zap, Sparkles, ChevronRight, Play
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        const res = await axios.get('http://localhost:5000/api/student/dashboard-data', config);
        setDashboardData(res.data);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Signature Sky Blue Student Loader
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <div className="relative flex h-10 w-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-10 w-10 bg-sky-500"></span>
        </div>
        <p className="font-bold text-slate-400 animate-pulse tracking-widest uppercase text-xs">Loading Your Classroom...</p>
      </div>
    );
  }

  const { stats, heroCourse, recentCourses } = dashboardData;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* 1. WELCOME BANNER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 dark:border-slate-800/50 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            Welcome back, {user?.name?.split(' ')[0] || 'Learner'}! 👋
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Pick up exactly where you left off and keep growing.
          </p>
        </div>
        <Link 
          to="/student/explore" 
          className="bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-500/20 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all border border-sky-100 dark:border-sky-500/20"
        >
          Explore Catalog <ArrowRight size={16} />
        </Link>
      </div>

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<BookOpen size={24} />} value={stats.activeCourses} label="Enrolled Courses" color="sky" />
        <StatCard icon={<Award size={24} />} value={stats.completedCourses} label="Certificates Earned" color="emerald" />
        <StatCard icon={<Clock size={24} />} value={`~${Math.round(stats.learningHours)}h`} label="Est. Learning Time" color="indigo" />
      </div>

      {/* 3. HERO SECTION (RESUME LEARNING) */}
      {heroCourse ? (
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0a0f1c] to-slate-900 rounded-3xl shadow-2xl border border-slate-800 text-white group">
          {/* Background Accents */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>
          
          <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row gap-10 items-center">
            
            {/* Left Content */}
            <div className="flex-1 space-y-6 w-full">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-500/20 text-sky-300 text-[10px] font-black uppercase tracking-widest border border-sky-500/30">
                <Zap size={14} className="text-sky-400" /> Resume Learning
              </div>
              
              <div>
                <h2 className="text-3xl md:text-4xl font-black leading-tight tracking-tight mb-3 group-hover:text-sky-400 transition-colors">
                  {heroCourse.title}
                </h2>
                <p className="text-slate-400 max-w-xl text-sm leading-relaxed font-medium line-clamp-2">
                  {heroCourse.description}
                </p>
              </div>

              {/* Hero Progress Bar */}
              <div className="space-y-2 max-w-md">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-300">
                  <span>Current Progress</span>
                  <span className="text-sky-400">{heroCourse.progress}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden shadow-inner">
                  <div className="bg-gradient-to-r from-sky-500 to-cyan-400 h-2 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.5)]" style={{ width: `${heroCourse.progress}%` }}></div>
                </div>
              </div>
              
              <div className="pt-2">
                <button 
                  onClick={() => navigate(`/student/course/${heroCourse._id}/watch`)}
                  className="bg-white text-slate-900 hover:bg-sky-50 px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 shadow-lg active:scale-95"
                >
                  <Play size={16} className="fill-slate-900" /> Continue Course
                </button>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="w-full md:w-96 aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative group-hover:scale-[1.02] transition-transform duration-500">
              <img 
                src={heroCourse.thumbnail} 
                alt={heroCourse.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors"></div>
            </div>
          </div>
        </div>
      ) : (
        /* EMPTY STATE HERO */
        <div className="bg-gradient-to-br from-sky-600 to-indigo-700 rounded-3xl p-12 text-white text-center shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10">
            <Sparkles className="w-12 h-12 text-sky-200 mx-auto mb-6" />
            <h2 className="text-3xl font-black mb-4 tracking-tight">Your Canvas is Blank</h2>
            <p className="text-sky-100 mb-8 max-w-md mx-auto font-medium">
              You aren't enrolled in any courses yet. Explore our catalog of masterclasses and start building your future.
            </p>
            <Link to="/student/explore" className="bg-white text-sky-900 px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-sky-50 transition-all inline-flex items-center gap-2 shadow-xl shadow-sky-900/20 active:scale-95">
              Explore Catalog <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}

      {/* 4. RECENTLY ENROLLED LIST */}
      {recentCourses.length > 0 && (
        <div className="pb-10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Current Curriculum</h3>
            <Link to="/student/my-learning" className="text-[10px] font-black uppercase tracking-widest text-sky-600 dark:text-sky-400 hover:text-sky-700 flex items-center gap-1 group">
              View All <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentCourses.map(course => (
              <div key={course._id} className="group bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-sky-900/5 hover:border-sky-200 dark:hover:border-sky-500/30 transition-all duration-300 flex flex-col">
                
                <div className="h-44 overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <button 
                    onClick={() => navigate(`/student/course/${course._id}/watch`)}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <div className="bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-2xl text-sky-600 transform scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-6 h-6 fill-sky-600 ml-1" />
                    </div>
                  </button>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="text-[9px] font-black text-sky-500 mb-2 uppercase tracking-[0.2em]">{course.category}</div>
                  <h4 className="font-black text-slate-900 dark:text-white text-lg tracking-tight line-clamp-1 mb-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">{course.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 line-clamp-2 font-medium">{course.description}</p>
                  
                  <div className="mt-auto">
                    <div className="flex justify-between text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                      <span>{course.progress}% Completed</span>
                      <span>{course.lessons?.length || 0} Modules</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-sky-500 h-1.5 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.5)] transition-all duration-1000" style={{ width: `${course.progress}%` }}></div> 
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

// Premium Stat Card
const StatCard = ({ icon, label, value, color }) => {
  const colors = {
    sky: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400 ring-sky-100 dark:ring-sky-500/20",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 ring-emerald-100 dark:ring-emerald-500/20",
    indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 ring-indigo-100 dark:ring-indigo-500/20",
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex items-center gap-5 hover:shadow-md transition-all group">
      <div className={`p-4 rounded-2xl ring-1 transition-transform group-hover:scale-110 ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">{value}</p>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-black mt-1.5">{label}</p>
      </div>
    </div>
  );
};

export default StudentDashboard;