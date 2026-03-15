import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Plus, Search, BookOpen, Users, 
  Edit2, IndianRupee, Video, AlertCircle, Sparkles 
} from 'lucide-react';

const MyContent = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const res = await axios.get('http://localhost:5000/api/courses/my-courses', config);
      setCourses(res.data);
      setError(null);
    } catch (err) {
      console.error("Failed to load courses", err);
      setError("Failed to sync with Creator Studio. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Signature Red Pulse Loader
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <div className="relative flex h-10 w-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-10 w-10 bg-red-500"></span>
        </div>
        <p className="font-bold text-slate-400 animate-pulse tracking-widest uppercase text-xs">Loading Creator Studio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in">
        <div className="bg-red-50 p-6 rounded-full mb-6 border border-red-100 shadow-sm">
            <AlertCircle size={48} className="text-red-500" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Sync Failed</h3>
        <p className="text-slate-500 mt-2 mb-8 max-w-sm">{error}</p>
        <button onClick={fetchCourses} className="px-8 py-3 bg-[#0a0f1c] text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200/60 pb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Content Library <Video className="text-indigo-500" size={28} />
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Manage your intellectual property. You have <span className="text-indigo-600 font-black">{courses.length}</span> active projects.
          </p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          {courses.length > 0 && (
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search projects..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
              />
            </div>
          )}
          <Link 
            to="/tutor/create-course" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus size={16} /> New Project
          </Link>
        </div>
      </div>

      {/* COURSE GRID */}
      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-indigo-50/50 rounded-3xl border border-dashed border-indigo-200 text-center">
          <div className="bg-white p-5 rounded-2xl shadow-sm mb-6 border border-indigo-100">
            <Sparkles className="text-indigo-500 w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Your canvas is empty</h3>
          <p className="text-slate-500 mb-8 max-w-sm leading-relaxed">
            Every great instructor starts here. Draft your first course and start sharing your knowledge.
          </p>
          <Link 
            to="/tutor/create-course" 
            className="bg-[#0a0f1c] hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/10 transition-all flex items-center gap-2"
          >
            <Plus size={16} /> Create First Course
          </Link>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-200 border-dashed">
           <Search className="w-10 h-10 text-slate-300 mx-auto mb-4" />
           <p className="text-slate-500 font-bold">No projects match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course._id} className="group bg-white border border-slate-200/60 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-indigo-900/5 hover:border-indigo-200 transition-all duration-300 flex flex-col">
              
              {/* Thumbnail Area */}
              <div className="h-48 overflow-hidden relative bg-slate-100">
                <img 
                  src={course.thumbnail} 
                  alt={course.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm border ${course.isActive ? 'bg-emerald-500/90 text-white border-emerald-400/50 backdrop-blur-sm' : 'bg-white/90 text-slate-600 border-slate-200 backdrop-blur-sm'}`}>
                    {course.isActive ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>

              {/* Course Details */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-6">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight line-clamp-1 mb-2 group-hover:text-indigo-600 transition-colors">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-slate-500 font-bold bg-slate-50 w-fit px-3 py-1.5 rounded-lg border border-slate-100">
                    <span className="flex items-center gap-1.5"><BookOpen size={14} className="text-indigo-400" /> {course.lessons?.length || 0} Modules</span>
                    <div className="w-px h-3 bg-slate-300"></div>
                    <span className="flex items-center gap-1.5"><Users size={14} className="text-orange-400" /> {course.enrolledStudents?.length || 0} Students</span>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-slate-900 font-black text-xl tracking-tighter">
                    <IndianRupee size={18} className="text-emerald-500" /> {course.price}
                  </div>
                  
                  <Link 
                    to={`/tutor/course/${course._id}/manager`} 
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 hover:bg-indigo-600 text-slate-600 hover:text-white border border-slate-200 hover:border-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm"
                  >
                    <Edit2 size={14} /> Open Studio
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