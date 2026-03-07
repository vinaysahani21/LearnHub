import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PlayCircle, Clock, Award, ArrowRight, BookOpen, Zap, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    inProgress: 0,
    completed: 0,
    hours: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        const res = await axios.get('http://localhost:5000/api/auth/me', config);
        
        const courses = res.data.enrolledCourses || [];
        setEnrolledCourses(courses);

        setStats({
          inProgress: courses.length,
          completed: 0, 
          hours: courses.reduce((acc, curr) => acc + (curr.lessons?.length || 0) * 0.5, 0)
        });

      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-96">
      <Loader2 className="animate-spin text-indigo-600 dark:text-indigo-400 w-8 h-8" />
    </div>
  );

  const heroCourse = enrolledCourses.length > 0 ? enrolledCourses[0] : null;

  return (
    <div className="max-w-7xl mx-auto space-y-8 transition-colors duration-300">
      
      {/* 1. WELCOME BANNER */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            You have {enrolledCourses.length} active courses. Let's learn something new today.
          </p>
        </div>
        <Link to="/student/explore" className="text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 text-sm transition-colors">
          Browse New Courses <ArrowRight size={16} />
        </Link>
      </div>

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 hover:shadow-md transition-all">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.inProgress}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold">Enrolled Courses</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 hover:shadow-md transition-all">
          <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
            <Award size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.completed}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold">Certificates Earned</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 hover:shadow-md transition-all">
          <div className="p-3 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">~{Math.round(stats.hours)}h</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold">Est. Learning Time</p>
          </div>
        </div>
      </div>

      {/* 3. HERO SECTION */}
      {heroCourse ? (
        <div className="relative overflow-hidden bg-indigo-900 dark:bg-indigo-950 rounded-2xl shadow-xl text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500 opacity-20 rounded-full -ml-10 -mb-10 pointer-events-none"></div>
          
          <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-800 dark:bg-indigo-900 text-indigo-200 text-[10px] font-bold uppercase tracking-wider">
                <Zap size={14} /> Resume Learning
              </div>
              <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                {heroCourse.title}
              </h2>
              <p className="text-indigo-100 dark:text-slate-300 max-w-xl text-sm leading-relaxed">
                {heroCourse.description?.substring(0, 120)}...
              </p>
              
              <div className="pt-4">
                <button 
                  onClick={() => navigate(`/student/course/${heroCourse._id}/watch`)}
                  className="bg-white dark:bg-indigo-600 text-indigo-900 dark:text-white hover:bg-indigo-50 dark:hover:bg-indigo-500 px-8 py-3 rounded-lg font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-950/20"
                >
                  <PlayCircle size={20} /> Continue Watching
                </button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="w-full md:w-80 aspect-video rounded-xl overflow-hidden border-4 border-indigo-800/50 dark:border-indigo-900/50 shadow-2xl">
              <img 
                src={heroCourse.thumbnail} 
                alt={heroCourse.title} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      ) : (
        /* EMPTY STATE HERO */
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 dark:from-indigo-900 dark:to-slate-900 rounded-2xl p-10 text-white text-center shadow-lg transition-colors">
          <h2 className="text-3xl font-bold mb-4">Start Your Learning Journey</h2>
          <p className="text-indigo-100 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            You aren't enrolled in any courses yet. Explore our catalog to find the perfect course for your career.
          </p>
          <Link to="/student/explore" className="bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white px-8 py-3 rounded-full font-bold hover:bg-gray-100 dark:hover:bg-indigo-500 transition-all inline-flex items-center gap-2 shadow-xl shadow-indigo-900/20">
            Explore Courses <ArrowRight size={18} />
          </Link>
        </div>
      )}

      {/* 4. RECENTLY ENROLLED LIST */}
      {enrolledCourses.length > 0 && (
        <div className="pb-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Your Courses</h3>
            <Link to="/student/my-learning" className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.slice(0, 3).map(course => (
              <div key={course._id} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="h-40 overflow-hidden relative">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-slate-900/20 dark:bg-slate-950/40 group-hover:bg-slate-900/10 transition-colors"></div>
                  <button 
                    onClick={() => navigate(`/student/course/${course._id}/watch`)}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <div className="bg-white/95 dark:bg-indigo-600 p-3 rounded-full shadow-xl">
                      <PlayCircle className="w-8 h-8 text-indigo-600 dark:text-white" />
                    </div>
                  </button>
                </div>
                <div className="p-5">
                  <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 mb-2 uppercase tracking-widest">{course.category}</div>
                  <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{course.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">{course.description}</p>
                  
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mb-2">
                    <div className="bg-indigo-600 dark:bg-indigo-500 h-1.5 rounded-full" style={{ width: '0%' }}></div> 
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">
                    <span>Not Started</span>
                    <span>{course.lessons?.length || 0} Lessons</span>
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

export default StudentDashboard;