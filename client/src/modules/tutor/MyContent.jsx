import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Loader2, Plus, Search, BookOpen, Users, 
  Edit2, IndianRupee, Video, AlertCircle 
} from 'lucide-react';

const MyContent = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  // 1. Fetch Tutor's Courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // 🚀 FIX: Correct Endpoint, No Body needed (Backend uses req.user.id)
        const res = await axios.get('http://localhost:5000/api/courses/my-courses', config);
        
        setCourses(res.data);
        setError(null);
      } catch (err) {
        console.error("Failed to load courses", err);
        setError("Failed to load your courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Filter Logic
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-500 w-10 h-10" /></div>;

  if (error) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-full mb-4">
            <AlertCircle size={40} className="text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Something went wrong</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold">Retry</button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 transition-colors duration-300">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">My Content</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            You have created <span className="text-indigo-600 dark:text-indigo-400 font-bold">{courses.length}</span> courses so far.
          </p>
        </div>
        <Link 
          to="/tutor/create-course" 
          className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
        >
          <Plus size={20} /> Create New Course
        </Link>
      </div>

      {/* SEARCH BAR */}
      {courses.length > 0 && (
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search your courses..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm transition-all"
          />
        </div>
      )}

      {/* COURSE GRID */}
      {courses.length === 0 ? (
        /* EMPTY STATE - NO COURSES FOUND */
        <div className="flex flex-col items-center justify-center py-24 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-full shadow-sm mb-6">
            <Video className="text-indigo-500 w-12 h-12" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Start your journey!</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
            You haven't created any courses yet. Share your knowledge with the world today.
          </p>
          <Link 
            to="/tutor/create-course" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-indigo-500/20 transition-all flex items-center gap-2"
          >
            <Plus size={20} /> Create First Course
          </Link>
        </div>
      ) : filteredCourses.length === 0 ? (
        /* SEARCH NO RESULTS */
        <div className="text-center py-20">
           <p className="text-slate-500 dark:text-slate-400">No courses match your search.</p>
        </div>
      ) : (
        /* LIST OF COURSES */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course._id} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl dark:hover:shadow-indigo-900/10 transition-all duration-300 flex flex-col">
              
              {/* Thumbnail */}
              <div className="h-48 overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                <img 
                  src={course.thumbnail} 
                  alt={course.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10 ${course.isActive ? 'bg-green-500/90 text-white' : 'bg-slate-900/80 text-slate-300'}`}>
                    {course.isActive ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{course.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-bold">
                    <span className="flex items-center gap-1"><BookOpen size={14} /> {course.lessons?.length || 0} Lessons</span>
                    {/* Note: enrolledStudents might not be populated in the list view depending on your backend, safer to check exists */}
                    <span className="flex items-center gap-1"><Users size={14} /> {course.enrolledStudents?.length || 0} Students</span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-slate-900 dark:text-white font-black text-lg">
                    <IndianRupee size={18} /> {course.price}
                  </div>
                  
                  <Link 
                    to={`/tutor/course/${course._id}/manager`} 
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white text-slate-600 dark:text-slate-300 rounded-lg font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    <Edit2 size={14} /> Manage
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyContent;