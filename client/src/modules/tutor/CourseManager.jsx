import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, Plus, Settings, Video, ListChecks, 
  Trash2, Edit2, Users, BookOpen, IndianRupee, AlertCircle,
  Eye, Power, MessageSquare, X, Send, RefreshCw, GripVertical, Loader2
} from 'lucide-react';
import api from '../../api/api';

const CourseManager = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ students: 0, earnings: 0 }); 
  
  // Modal States
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [courseRes, statsRes] = await Promise.all([
        api.get(`/courses/${id}`, config),
        api.get(`/tutor/course/${id}/stats`, config)
      ]);
      
      setCourse(courseRes.data);
      setStats({
        students: statsRes.data.enrollments,
        earnings: statsRes.data.grossRevenue
      });
      
    } catch (err) {
      console.error("Error fetching course workspace:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const handleToggleStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await api.patch(`/courses/${id}/status`, {}, config);
      setCourse({ ...course, isActive: res.data.isActive });
    } catch (err) {
      alert("Failed to update status. Please try again.");
    }
  };

  const handleDeleteLesson = async (lessonId, lessonTitle) => {
    if (!window.confirm(`⚠️ Are you sure you want to delete "${lessonTitle}"? This cannot be undone.`)) return;
    
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await api.delete(`/courses/${id}/lessons/${lessonId}`, config);
      
      const updatedLessons = course.lessons.filter(l => l._id !== lessonId);
      setCourse({ ...course, lessons: updatedLessons });
    } catch (err) {
      alert("Failed to delete lesson.");
      console.error(err);
    }
  };

  const fetchComments = async () => {
    setIsCommentsOpen(true);
    try {
      setLoadingComments(true);
      const token = localStorage.getItem('token');
      const targetLessonId = course.lessons[0]?._id; 
      if(!targetLessonId) {
        setLoadingComments(false);
        return;
      }

      const res = await api.get(`/courses/${id}/lessons/${targetLessonId}/comments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments(res.data);
    } catch (err) {
      console.error("Failed to load comments");
    } finally {
      setLoadingComments(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4 transition-colors">
        <div className="relative flex h-10 w-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-10 w-10 bg-indigo-500"></span>
        </div>
        <p className="font-bold text-slate-400 dark:text-slate-500 animate-pulse tracking-widest uppercase text-xs">Loading Workspace...</p>
      </div>
    );
  }

  if (!course) return (
    <div className="flex flex-col items-center justify-center p-20 text-slate-500 font-bold">
      <AlertCircle className="w-10 h-10 text-rose-500 mb-2"/> Course not found.
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-500 relative">
      
      {/* 1. STUDIO HEADER */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 transition-colors">
        
        {/* Left Side */}
        <div className="flex-1 w-full min-w-0">
          <Link to="/tutor/my-courses" className="inline-flex items-center text-xs font-black text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 uppercase tracking-widest mb-4 transition-colors group">
            <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Library
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
            <div className="relative shrink-0 w-24 h-16 sm:w-28 sm:h-20">
              <img src={course.thumbnail} className="w-full h-full object-cover rounded-xl shadow-md border border-slate-100 dark:border-slate-700" alt="Thumbnail" />
              <div className="absolute inset-0 bg-slate-900/10 dark:bg-slate-900/40 rounded-xl"></div>
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                <span className="px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  {course.category}
                </span>
                {course.isActive ? (
                  <span className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Published
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest shadow-sm">
                    Draft Mode
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight line-clamp-2">{course.title}</h1>
            </div>
          </div>
        </div>

        {/* Right Side: ACTION CONTROLS */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 w-full lg:w-auto bg-slate-50 dark:bg-slate-800/50 p-2 rounded-2xl border border-slate-100 dark:border-slate-700/50">
          
          <button onClick={fetchCourseData} className="p-2.5 rounded-xl text-slate-400 dark:text-slate-500 hover:bg-white dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-sm transition-all" title="Refresh Sync">
            <RefreshCw size={18} />
          </button>
          
          <Link to={`/tutor/course/${course._id}/preview`} className="p-2.5 rounded-xl text-slate-400 dark:text-slate-500 hover:bg-white dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-sm transition-all" title="Instructor Preview">
            <Eye size={18} />
          </Link>

          <button onClick={fetchComments} className="p-2.5 rounded-xl text-slate-400 dark:text-slate-500 hover:bg-white dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-sm transition-all" title="Q&A Forum">
            <MessageSquare size={18} />
          </button>
          
          <div className="hidden sm:block h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

          <button 
            onClick={handleToggleStatus} 
            className={`flex-1 sm:flex-none justify-center p-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-wider ${
              course.isActive 
                ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 dark:hover:text-white' 
                : 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white'
            }`}
          >
            <Power size={16} /> {course.isActive ? "Unpublish" : "Publish"}
          </button>

          <Link to={`/tutor/course/${course._id}/add-lesson`} className="flex-1 sm:flex-none justify-center sm:ml-1 px-4 sm:px-5 py-2.5 bg-[#0a0f1c] dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-slate-900/10 dark:shadow-indigo-900/20 transition-all active:scale-95">
            <Plus size={16} /> Module
          </Link>
        </div>
      </div>

      {/* 2. LIVE METRICS WITH REAL DB DATA */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <StatWidget icon={<IndianRupee size={20} />} label="Set Price" value={`₹${course.price}`} color="green" />
        <StatWidget icon={<Users size={20} />} label="Enrollments" value={stats.students} color="blue" />
        <StatWidget icon={<BookOpen size={20} />} label="Total Modules" value={course.lessons?.length || 0} color="purple" />
        <StatWidget icon={<IndianRupee size={20} />} label="Gross Earnings" value={`₹${stats.earnings}`} color="orange" />
      </div>

      {/* 3. CURRICULUM BUILDER */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-xl shadow-slate-200/10 dark:shadow-none overflow-hidden transition-colors">
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">Curriculum Planner</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">Build, arrange, and manage course content.</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/50 p-3 sm:p-4">
          {course.lessons?.length === 0 ? (
            <div className="p-10 sm:p-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl m-2 sm:m-4 bg-slate-50/50 dark:bg-slate-800/20">
              <div className="bg-white dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-slate-700 shadow-sm text-slate-300 dark:text-slate-500"><Video size={28}/></div>
              <p className="text-slate-500 dark:text-slate-400 font-bold mb-4 text-sm sm:text-base">No content has been uploaded yet.</p>
              <Link to={`/tutor/course/${course._id}/add-lesson`} className="text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest text-xs hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors flex items-center justify-center gap-2">
                <Plus size={14}/> Add First Module
              </Link>
            </div>
          ) : (
            course.lessons?.map((lesson, index) => (
              <div key={lesson._id || index} className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all group mb-2">
                <div className="cursor-grab active:cursor-grabbing text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 shrink-0">
                   <GripVertical size={20} />
                </div>
                <div className="hidden sm:flex w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black items-center justify-center shrink-0 text-sm shadow-inner border border-slate-200/60 dark:border-slate-700">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0 pr-2">
                  <h4 className="font-bold text-slate-900 dark:text-white truncate text-sm sm:text-base">{lesson.title}</h4>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1.5 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold">
                    {lesson.type === 'quiz' ? (
                      <>
                        <span className="flex items-center gap-1 sm:gap-1.5 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 px-1.5 sm:px-2 py-0.5 rounded border border-orange-100 dark:border-orange-500/20 uppercase tracking-widest text-[8px] sm:text-[9px]"><ListChecks size={12} /> Assessment</span>
                        <span className="truncate">{lesson.questions?.length || 0} Questions</span>
                      </>
                    ) : (
                      <>
                        <span className="flex items-center gap-1 sm:gap-1.5 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-1.5 sm:px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-500/20 uppercase tracking-widest text-[8px] sm:text-[9px]"><Video size={12} /> Video</span>
                        <span className="truncate">Content Uploaded</span>
                      </>
                    )}
                  </div>
                </div>
                {/* Mobile visible by default, hover on desktop */}
                <div className="flex items-center gap-1.5 sm:gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0">
                  <Link 
                    to={`/tutor/course/${course._id}/edit-lesson/${lesson._id}`} 
                    className="p-2 sm:p-2.5 bg-slate-50 md:bg-white dark:bg-slate-800 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 md:hover:border-indigo-200 md:dark:hover:border-indigo-500/30 border border-slate-200 dark:border-slate-700 rounded-xl transition-all shadow-sm" 
                    title="Edit Content"
                  >
                    <Edit2 size={16} className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>

                  <button onClick={() => handleDeleteLesson(lesson._id, lesson.title)} className="p-2 sm:p-2.5 bg-slate-50 md:bg-white dark:bg-slate-800 text-rose-400 md:text-slate-400 dark:text-slate-500 hover:text-white hover:bg-rose-500 dark:hover:bg-rose-600 border border-slate-200 dark:border-slate-700 hover:border-rose-500 dark:hover:border-rose-600 rounded-xl transition-all shadow-sm" title="Delete Lesson">
                    <Trash2 size={16} className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 4. SLIDE-OVER COMMENTS PANEL */}
      {isCommentsOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity" onClick={() => setIsCommentsOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-200 dark:border-slate-800">
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
              <div>
                 <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Q&A Forum</h2>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-1">First Module Chat</p>
              </div>
              <button onClick={() => setIsCommentsOpen(false)} className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 dark:text-slate-500 transition-colors"><X size={20} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 custom-scrollbar bg-slate-50/50 dark:bg-slate-950/50">
              {loadingComments ? (
                 <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500 gap-2">
                    <Loader2 className="animate-spin text-indigo-500" size={24}/>
                    <span className="text-xs font-bold uppercase tracking-widest">Loading threads...</span>
                 </div>
              ) : comments.length === 0 ? (
                 <div className="text-center py-20 text-slate-400 dark:text-slate-500 font-bold text-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed mx-2 sm:mx-0">No questions asked yet.</div>
              ) : (
                comments.map(c => (
                  <div key={c._id} className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-xs font-black text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 shrink-0">{c.user?.name?.charAt(0)}</div>
                         <span className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[120px] sm:max-w-[180px]">{c.user?.name}</span>
                      </div>
                      <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">{c.text}</p>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
               <div className="relative flex items-center shadow-sm">
                 <input type="text" placeholder="Type a reply..." className="w-full pl-5 pr-14 py-3 sm:py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder-slate-400 dark:placeholder-slate-500" />
                 <button className="absolute right-2 p-2 sm:p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors shadow-md shadow-indigo-600/20"><Send size={16} /></button>
               </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// Reusable Stat Widget
const StatWidget = ({ icon, label, value, color }) => {
  const colors = {
    green: "bg-emerald-50 text-emerald-600 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
    blue: "bg-blue-50 text-blue-600 ring-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20",
    purple: "bg-purple-50 text-purple-600 ring-purple-100 dark:bg-purple-500/10 dark:text-purple-400 dark:ring-purple-500/20",
    orange: "bg-orange-50 text-orange-600 ring-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:ring-orange-500/20",
  };
  return (
    <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 group hover:shadow-md transition-all min-w-0">
        <div className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl ring-1 transition-transform group-hover:scale-110 shadow-inner shrink-0 ${colors[color]}`}>{icon}</div>
        <div className="min-w-0 w-full">
           <span className="text-[8px] sm:text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest truncate block">{label}</span>
           <p className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none mt-1 truncate">{value}</p>
        </div>
    </div>
  );
};

export default CourseManager;