import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, Plus, Settings, Video, ListChecks, 
  Trash2, Edit2, Users, BookOpen, IndianRupee, AlertCircle,
  Eye, Power, MessageSquare, X, Send, RefreshCw, GripVertical
} from 'lucide-react';

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
      
      const res = await axios.get(`http://localhost:5000/api/courses/${id}`, config);
      setCourse(res.data);
      
      const studentCount = res.data.enrolledStudents?.length || 0;
      setStats({
        students: studentCount,
        earnings: studentCount * (res.data.price || 0)
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  // TOGGLE STATUS (Draft vs Published)
  const handleToggleStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // Hitting the toggle endpoint
      const res = await axios.patch(`http://localhost:5000/api/courses/${id}/status`, {}, config);
      setCourse({ ...course, isActive: res.data.isActive });
    } catch (err) {
      alert("Failed to update status. Please try again.");
    }
  };

  // DELETE LESSON (Actually hits DB)
  const handleDeleteLesson = async (lessonId, lessonTitle) => {
    if (!window.confirm(`⚠️ Are you sure you want to delete "${lessonTitle}"? This cannot be undone.`)) return;
    
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.delete(`http://localhost:5000/api/courses/${id}/lessons/${lessonId}`, config);
      
      // Update UI optimistically
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

      const res = await axios.get(`http://localhost:5000/api/courses/${id}/lessons/${targetLessonId}/comments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments(res.data);
    } catch (err) {
      console.error("Failed to load comments");
    } finally {
      setLoadingComments(false);
    }
  };

  // Signature Red Pulse Loader
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <div className="relative flex h-10 w-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-10 w-10 bg-red-500"></span>
        </div>
        <p className="font-bold text-slate-400 animate-pulse tracking-widest uppercase text-xs">Loading Workspace...</p>
      </div>
    );
  }

  if (!course) return <div className="flex flex-col items-center justify-center p-20 text-slate-500 font-bold"><AlertCircle className="w-10 h-10 text-red-500 mb-2"/> Course not found.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 relative">
      
      {/* 1. STUDIO HEADER */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        
        {/* Left Side */}
        <div className="flex-1 w-full">
          <Link to="/tutor/my-courses" className="inline-flex items-center text-xs font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest mb-4 transition-colors group">
            <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Library
          </Link>
          <div className="flex items-center gap-5">
            <img src={course.thumbnail} className="w-24 h-16 object-cover rounded-xl shadow-md border border-slate-100" alt="Thumbnail" />
            <div>
              <div className="flex items-center gap-3 mb-1.5">
                <span className="px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 border border-slate-200">
                  {course.category}
                </span>
                {course.isActive ? (
                  <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Published
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 bg-slate-50 text-slate-500 border border-slate-200 text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest shadow-sm">
                    Draft Mode
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight line-clamp-1">{course.title}</h1>
            </div>
          </div>
        </div>

        {/* Right Side: ACTION CONTROLS */}
        <div className="flex items-center gap-2 w-full md:w-auto bg-slate-50 p-2 rounded-2xl border border-slate-100">
          
          <button onClick={fetchCourseData} className="p-2.5 rounded-xl text-slate-400 hover:bg-white hover:text-indigo-600 hover:shadow-sm transition-all" title="Refresh Sync">
            <RefreshCw size={18} />
          </button>
          {/* CHANGE THIS */}
<Link to={`/tutor/course/${course._id}/preview`} className="p-2.5 rounded-xl text-slate-400 hover:bg-white hover:text-indigo-600 hover:shadow-sm transition-all" title="Student Preview">
  <Eye size={18} />
</Link>
          <button onClick={fetchComments} className="p-2.5 rounded-xl text-slate-400 hover:bg-white hover:text-indigo-600 hover:shadow-sm transition-all" title="Q&A Forum">
            <MessageSquare size={18} />
          </button>
          
          <div className="h-6 w-px bg-slate-200 mx-1"></div>

          <button 
            onClick={handleToggleStatus} 
            className={`p-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 text-xs font-black uppercase tracking-wider ${course.isActive ? 'bg-white text-orange-600 border border-orange-200 hover:bg-orange-500 hover:text-white' : 'bg-white text-emerald-600 border border-emerald-200 hover:bg-emerald-500 hover:text-white'}`}
          >
            <Power size={16} /> {course.isActive ? "Unpublish" : "Publish"}
          </button>

          <Link to={`/tutor/course/${course._id}/add-lesson`} className="ml-1 px-5 py-2.5 bg-[#0a0f1c] hover:bg-slate-800 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-slate-900/10 transition-all active:scale-95">
            <Plus size={16} /> Module
          </Link>
        </div>
      </div>

      {/* 2. LIVE METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatWidget icon={<IndianRupee size={20} />} label="Set Price" value={`₹${course.price}`} color="green" />
        <StatWidget icon={<Users size={20} />} label="Enrollments" value={stats.students} color="blue" />
        <StatWidget icon={<BookOpen size={20} />} label="Total Modules" value={course.lessons?.length || 0} color="purple" />
        <StatWidget icon={<IndianRupee size={20} />} label="Gross Earnings" value={`₹${stats.earnings}`} color="orange" />
      </div>

      {/* 3. CURRICULUM BUILDER */}
      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/10 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Curriculum Planner</h2>
            <p className="text-sm text-slate-500 font-medium">Build, arrange, and manage course content.</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 p-4">
          {course.lessons?.length === 0 ? (
            <div className="p-16 text-center border-2 border-dashed border-slate-200 rounded-2xl m-4">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm text-slate-300"><Video size={28}/></div>
              <p className="text-slate-500 font-bold mb-4">No content has been uploaded yet.</p>
              <Link to={`/tutor/course/${course._id}/add-lesson`} className="text-indigo-600 font-black uppercase tracking-widest text-xs hover:text-indigo-800 transition-colors flex items-center justify-center gap-2">
                <Plus size={14}/> Add First Module
              </Link>
            </div>
          ) : (
            course.lessons?.map((lesson, index) => (
              <div key={lesson._id || index} className="p-4 flex items-center gap-4 bg-white hover:bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 transition-all group mb-2">
                <div className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500">
                   <GripVertical size={20} />
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 font-black flex items-center justify-center shrink-0 text-sm shadow-inner border border-slate-200/60">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 truncate">{lesson.title}</h4>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500 font-bold">
                    {lesson.type === 'quiz' ? (
                      <>
                        <span className="flex items-center gap-1.5 text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100 uppercase tracking-widest text-[9px]"><ListChecks size={12} /> Assessment</span>
                        <span>{lesson.questions?.length || 0} Questions</span>
                      </>
                    ) : (
                      <>
                        <span className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 uppercase tracking-widest text-[9px]"><Video size={12} /> Video</span>
                        <span>Content Uploaded</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2.5 bg-white text-slate-400 hover:text-indigo-600 hover:border-indigo-200 border border-slate-200 rounded-xl transition-all shadow-sm" title="Edit Content"><Edit2 size={16} /></button>
                  <button onClick={() => handleDeleteLesson(lesson._id, lesson.title)} className="p-2.5 bg-white text-slate-400 hover:text-white hover:bg-red-500 border border-slate-200 hover:border-red-500 rounded-xl transition-all shadow-sm" title="Delete Lesson"><Trash2 size={16} /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 4. SLIDE-OVER COMMENTS PANEL */}
      {isCommentsOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsCommentsOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
              <div>
                 <h2 className="text-lg font-black text-slate-900 tracking-tight">Q&A Forum</h2>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">First Module Chat</p>
              </div>
              <button onClick={() => setIsCommentsOpen(false)} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={20} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-50/50">
              {loadingComments ? (
                 <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                    <Loader2 className="animate-spin text-indigo-500" size={24}/>
                    <span className="text-xs font-bold uppercase tracking-widest">Loading threads...</span>
                 </div>
              ) : comments.length === 0 ? (
                 <div className="text-center py-20 text-slate-400 font-bold text-sm bg-white rounded-2xl border border-slate-200 border-dashed">No questions asked yet.</div>
              ) : (
                comments.map(c => (
                  <div key={c._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-xs font-black text-indigo-600 border border-indigo-100">{c.user?.name?.charAt(0)}</div>
                         <span className="text-sm font-bold text-slate-900">{c.user?.name}</span>
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">{c.text}</p>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-slate-100 bg-white">
               <div className="relative flex items-center shadow-sm">
                 <input type="text" placeholder="Type a reply..." className="w-full pl-5 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
                 <button className="absolute right-2 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20"><Send size={16} /></button>
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
    green: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    blue: "bg-blue-50 text-blue-600 ring-blue-100",
    purple: "bg-purple-50 text-purple-600 ring-purple-100",
    orange: "bg-orange-50 text-orange-600 ring-orange-100",
  };
  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
        <div className={`p-3.5 rounded-2xl ring-1 transition-transform group-hover:scale-110 ${colors[color]}`}>{icon}</div>
        <div>
           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
           <p className="text-2xl font-black text-slate-900 tracking-tight leading-none mt-1">{value}</p>
        </div>
    </div>
  );
};

export default CourseManager;