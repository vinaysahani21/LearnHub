import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Loader2, ArrowLeft, Plus, Settings, Video, ListChecks, 
  Trash2, Edit2, Users, BookOpen, IndianRupee, AlertCircle,
  Eye, Power, MessageSquare, X, Send, RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const CourseManager = () => {
  const { id } = useParams();
  const { user } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ students: 0, earnings: 0 });
  
  // Modal States
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [replyText, setReplyText] = useState('');

  // 1. Fetch Data
  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const res = await axios.get(`http://localhost:5000/api/courses/${id}`, config);
      setCourse(res.data);
      
      // Calculate Stats dynamically based on the FIXED backend
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

  // 2. Fetch Comments (On Demand)
  const fetchComments = async () => {
    setIsCommentsOpen(true);
    try {
      setLoadingComments(true);
      const token = localStorage.getItem('token');
      // Assuming you have a route to get ALL comments for a course
      // If not, you might need to loop lessons or create a specific endpoint
      // For now, let's assume we fetch for the first lesson or a general endpoint
      const targetLessonId = course.lessons[0]?._id; 
      if(!targetLessonId) return;

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

  // 3. Toggle Status
  const handleToggleStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.patch(`http://localhost:5000/api/courses/${id}/status`, {}, config);
      setCourse({ ...course, isActive: res.data.isActive });
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // 4. Delete Lesson
  const handleDeleteLesson = async (lessonId) => {
    if (!confirm("Delete this lesson?")) return;
    const updatedLessons = course.lessons.filter(l => l._id !== lessonId);
    setCourse({ ...course, lessons: updatedLessons });
    // Add API call here
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-500" /></div>;
  if (!course) return <div className="flex flex-col items-center justify-center p-20"><AlertCircle className="w-10 h-10 text-red-500 mb-2"/><p>Course not found</p></div>;

  return (
    <div className="max-w-6xl mx-auto p-6 transition-colors duration-300 relative">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        
        {/* Left Side */}
        <div>
          <Link to="/tutor/my-courses" className="flex items-center text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-2 transition-colors">
            <ArrowLeft size={16} className="mr-1" /> Back to My Content
          </Link>
          <div className="flex items-center gap-4">
            <img src={course.thumbnail} className="w-20 h-14 object-cover rounded-lg shadow-sm border border-gray-200 dark:border-slate-700" alt="Thumbnail" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400">
                  {course.category}
                </span>
                {course.isActive ? (
                  <span className="flex items-center gap-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span> Published
                  </span>
                ) : (
                  <span className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    Draft
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{course.title}</h1>
            </div>
          </div>
        </div>

        {/* Right Side: ACTION BUTTONS */}
        <div className="flex items-center gap-2">
          
          <button onClick={fetchCourseData} className="p-2.5 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-500 hover:text-indigo-600 dark:hover:text-white transition-all" title="Refresh Data">
            <RefreshCw size={20} />
          </button>

          <Link to={`/student/course/${course._id}/view`} target="_blank" className="p-2.5 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white transition-all" title="Preview Course">
            <Eye size={20} />
          </Link>

          <button onClick={fetchComments} className="p-2.5 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white transition-all" title="View Comments">
            <MessageSquare size={20} />
          </button>

          <button className="p-2.5 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white transition-all" title="Edit Settings">
            <Settings size={20} />
          </button>

          <div className="h-8 w-px bg-gray-200 dark:bg-slate-700 mx-1"></div>

          <button onClick={handleToggleStatus} className={`p-2.5 rounded-lg border transition-all ${course.isActive ? 'border-green-200 dark:border-green-900 text-green-600 bg-green-50 dark:bg-green-900/10 hover:bg-red-50 hover:text-red-600 hover:border-red-200' : 'border-gray-200 dark:border-slate-700 text-gray-400 hover:text-green-600 hover:border-green-200 hover:bg-green-50'}`} title={course.isActive ? "Deactivate" : "Activate"}>
            <Power size={20} />
          </button>

          <Link to={`/tutor/course/${course._id}/add-lesson`} className="ml-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all">
            <Plus size={18} /> Add Lesson
          </Link>
        </div>
      </div>

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <StatCard icon={<IndianRupee size={20} />} label="Price" value={`₹${course.price}`} color="green" />
        <StatCard icon={<Users size={20} />} label="Students" value={stats.students} color="blue" />
        <StatCard icon={<BookOpen size={20} />} label="Lessons" value={course.lessons?.length || 0} color="purple" />
        <StatCard icon={<IndianRupee size={20} />} label="Total Earnings" value={`₹${stats.earnings}`} color="yellow" />
      </div>

      {/* 3. CURRICULUM LIST */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all mt-8">
        <div className="p-6 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-900/50">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Curriculum</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400">Manage your lessons and quizzes</p>
          </div>
          <span className="text-xs text-gray-400 font-mono hidden sm:block">Drag to reorder (Coming soon)</span>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-slate-800">
          {course.lessons?.length === 0 ? (
            <div className="p-16 text-center">
              <div className="bg-gray-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 dark:text-gray-500"><Video size={32}/></div>
              <p className="text-gray-500 dark:text-gray-400 mb-4">No lessons added yet.</p>
              <Link to={`/tutor/course/${course._id}/add-lesson`} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                Upload your first video
              </Link>
            </div>
          ) : (
            course.lessons?.map((lesson, index) => (
              <div key={lesson._id || index} className="p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold flex items-center justify-center shrink-0 text-sm">{index + 1}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 dark:text-white truncate">{lesson.title}</h4>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500 dark:text-slate-400">
                    {lesson.type === 'quiz' ? (
                      <>
                        <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px]"><ListChecks size={10} /> Quiz</span>
                        <span>• {lesson.questions?.length || 0} Questions</span>
                      </>
                    ) : (
                      <>
                        <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px]"><Video size={10} /> Video</span>
                        <span>• 10:00 mins</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"><Edit2 size={18} /></button>
                  <button onClick={() => handleDeleteLesson(lesson._id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- COMMENTS MODAL --- */}
      {isCommentsOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCommentsOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-950">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Student Comments</h2>
              <button onClick={() => setIsCommentsOpen(false)}><X size={20} className="text-gray-500" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loadingComments ? <div className="text-center py-10"><Loader2 className="animate-spin inline text-indigo-500"/></div> : 
               comments.length === 0 ? <div className="text-center py-10 text-gray-500">No comments found.</div> :
               comments.map(c => (
                 <div key={c._id} className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-100 dark:border-slate-800">
                   <div className="flex items-center gap-2 mb-2">
                     <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-indigo-700 dark:text-slate-300">{c.user?.name?.charAt(0)}</div>
                     <span className="text-xs font-bold text-gray-900 dark:text-white">{c.user?.name}</span>
                     <span className="text-[10px] text-gray-400 ml-auto">{new Date(c.createdAt).toLocaleDateString()}</span>
                   </div>
                   <p className="text-sm text-gray-600 dark:text-slate-300">{c.text}</p>
                 </div>
               ))
              }
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950">
               <div className="relative">
                 <input type="text" placeholder="Type a reply..." className="w-full pl-4 pr-12 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white" />
                 <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"><Send size={16} /></button>
               </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// Reusable Stat Card (Same as before)
const StatCard = ({ icon, label, value, color }) => {
    const colors = {
        green: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
        blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
        purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
        yellow: "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400",
    };
    return (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm transition-colors">
            <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${colors[color]}`}>{icon}</div>
                <span className="text-[10px] font-black text-gray-400 dark:text-slate-400 uppercase tracking-widest">{label}</span>
            </div>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{value}</p>
        </div>
    );
};

export default CourseManager;