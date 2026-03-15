import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  PlayCircle, BookOpen, Clock, Award, 
  Lock, Star, CheckCircle, Globe, MonitorPlay, 
  ShieldCheck, ArrowRight, Zap, MessageSquareQuote
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import EnrollButton from './EnrollButton.jsx';

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [comments, setComments] = useState([]); // 🔥 Real DB Comments
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        // 1. Fetch Course Data (Public)
        const courseRes = await axios.get(`http://localhost:5000/api/courses/${id}`);
        const fetchedCourse = courseRes.data;
        setCourse(fetchedCourse);

        // Check Enrollment Status
        const enrolledIds = user?.enrolledCourses?.map(c => typeof c === 'object' ? c._id : c) || [];
        if (enrolledIds.includes(fetchedCourse._id)) {
          setIsEnrolled(true);
        }

        // 2. Fetch Real Comments from the First Lesson (Protected Route)
        const token = localStorage.getItem('token');
        if (token && fetchedCourse.lessons?.length > 0) {
          const firstLessonId = fetchedCourse.lessons[0]._id;
          try {
            const commentsRes = await axios.get(`http://localhost:5000/api/courses/${id}/lessons/${firstLessonId}/comments`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            setComments(commentsRes.data);
          } catch (commentErr) {
            console.error("Could not fetch comments (might not be enrolled/authorized yet):", commentErr);
          }
        }
      } catch (err) {
        console.error("Failed to load course:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [id, user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-[#020617] gap-4">
        <div className="relative flex h-10 w-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-10 w-10 bg-sky-500"></span>
        </div>
        <p className="font-bold text-slate-400 animate-pulse tracking-widest uppercase text-xs">Fetching Syllabus...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#020617] text-center p-8">
        <MonitorPlay className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-6" />
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Course Not Found</h2>
        <p className="text-slate-500 mb-8">This course may have been removed or is currently unavailable.</p>
        <button onClick={() => navigate(-1)} className="px-6 py-3 bg-sky-500 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-sky-600 transition-colors">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#020617] min-h-screen pb-24 md:pb-12 transition-colors duration-300 animate-in fade-in">
      
      {/* 1. CINEMATIC HERO HEADER */}
      <div className="relative bg-[#0a0f1c] text-white border-b border-slate-800 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-600/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 relative z-10">
          <div className="max-w-3xl space-y-6">
            
            <div className="flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-widest">
              <Link to="/student/explore" className="text-sky-400 hover:text-sky-300 transition-colors">Catalog</Link>
              <span className="text-slate-600">/</span>
              <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/5 text-slate-300 backdrop-blur-sm">
                {course.category}
              </span>
              {isEnrolled && (
                <>
                  <span className="text-slate-600">/</span>
                  <span className="bg-emerald-500/20 px-3 py-1 rounded-lg border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5 backdrop-blur-sm">
                    <ShieldCheck size={12} /> Enrolled
                  </span>
                </>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
              {course.title}
            </h1>
            
            <p className="text-lg text-slate-400 leading-relaxed max-w-2xl font-medium">
              {course.description?.substring(0, 150)}{course.description?.length > 150 ? '...' : ''}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-4 text-sm font-bold">
              {/* Dynamic Forum Metric */}
              <div className="flex items-center gap-1.5 text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-lg border border-amber-400/20">
                <MessageSquareQuote size={14} />
                <span className="text-amber-200/50 text-[10px] uppercase tracking-widest ml-1">({comments.length} Discussions)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                 <Globe size={16} className="text-slate-500"/> English
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                 <Clock size={16} className="text-slate-500"/> Updated {new Date(course.updatedAt).toLocaleDateString()}
              </div>
            </div>

            <div className="flex items-center gap-4 pt-6 mt-4 border-t border-white/10">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center font-black text-lg text-white shadow-inner ring-2 ring-white/10">
                {course.tutor?.name?.charAt(0) || "I"}
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Masterclass By</p>
                <p className="text-white font-bold text-lg">{course.tutor?.name || "Expert Instructor"}</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. MAIN TWO-COLUMN LAYOUT */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 relative">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-12">
          
          <div className="border border-slate-200 dark:border-slate-800 rounded-3xl p-8 bg-slate-50/50 dark:bg-slate-900/30 transition-colors shadow-sm">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">What you'll learn</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                `Master the core principles of ${course.category}`,
                "Build real-world projects for your portfolio",
                "Earn a verified certificate of completion",
                "Get lifetime access to all future updates"
              ].map((text, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="p-1 rounded-full bg-sky-100 dark:bg-sky-500/10 shrink-0 mt-0.5">
                     <CheckCircle size={16} className="text-sky-600 dark:text-sky-400" />
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">About this course</h3>
            <div className="text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed font-medium">
              {course.description}
            </div>
          </div>

          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
               <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Course Curriculum</h3>
               <div className="flex items-center gap-3 text-xs font-black text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg w-fit">
                 <span className="text-sky-600 dark:text-sky-400">{course.lessons?.length || 0} Modules</span>
               </div>
            </div>
            
            <div className="border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm transition-colors bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800/50">
              {course.lessons?.length === 0 ? (
                 <div className="p-10 text-center text-slate-500 font-bold">Content is currently being uploaded.</div>
              ) : (
                course.lessons?.map((lesson, index) => (
                  <div key={lesson._id || index} className="p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                    <div className="flex items-center gap-4">
                      {isEnrolled ? (
                        <div className="p-2 bg-sky-100 dark:bg-sky-500/10 rounded-full text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform">
                           <PlayCircle size={20} className="fill-current" />
                        </div>
                      ) : (
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400">
                           <Lock size={18} />
                        </div>
                      )}
                      <div>
                         <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-0.5 block">Module {index + 1}</span>
                         <span className="text-slate-800 dark:text-slate-200 font-bold group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                           {lesson.title}
                         </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Module</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
             <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">Your Instructor</h3>
             <div className="flex flex-col md:flex-row items-start gap-6 bg-slate-50 dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm transition-colors">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-4xl font-black text-white shrink-0 shadow-lg shadow-indigo-900/20 ring-4 ring-white dark:ring-slate-950">
                  {course.tutor?.name?.charAt(0) || "I"}
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    {course.tutor?.name || "Expert Instructor"}
                  </h4>
                  <p className="text-sky-600 dark:text-sky-400 text-xs font-black uppercase tracking-widest mb-2">
                    {course.tutor?.headline || "Platform Educator"}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    {course.tutor?.bio || `${course.tutor?.name || 'This instructor'} is a leading expert in ${course.category} with years of industry experience dedicated to helping students succeed.`}
                  </p>
                </div>
             </div>
          </div>

          {/* 🔥 REAL STUDENT COMMENTS SECTION 🔥 */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <MessageSquareQuote size={28} className="text-sky-500" />
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Class Forum</h3>
              </div>
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{comments.length} Thoughts</span>
            </div>
            
            {comments.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                <MessageSquareQuote size={32} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                <p className="text-slate-500 font-bold">No discussions yet. Enroll to be the first to start the conversation!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {comments.map((comment) => (
                  <div key={comment._id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-black flex items-center justify-center text-sm border border-slate-200 dark:border-slate-700 uppercase">
                        {comment.user?.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 dark:text-white">{comment.user?.name || "Student"}</p>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-0.5 block">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                      "{comment.text}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Sticky Checkout Card */}
        <div className="lg:col-span-4 hidden lg:block relative">
           <div className="sticky top-28 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl shadow-2xl dark:shadow-none overflow-hidden transition-all duration-300 flex flex-col">
             
             <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative group overflow-hidden border-b border-slate-100 dark:border-slate-800">
                <img 
                   src={course.thumbnail} 
                   alt={course.title} 
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/40 transition-colors flex items-center justify-center backdrop-blur-[2px]">
                   <div className="bg-white/95 dark:bg-slate-900/95 p-4 rounded-full shadow-2xl transform group-hover:scale-110 transition-all text-sky-600 dark:text-sky-400">
                     <PlayCircle size={40} className="fill-current" />
                   </div>
                </div>
                <div className="absolute bottom-4 right-4 bg-[#0a0f1c]/80 backdrop-blur-md px-3 py-1 rounded-lg text-white text-[10px] font-black uppercase tracking-widest border border-white/10">
                   Preview
                </div>
             </div>

             <div className="p-8 space-y-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3">
                   <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                      {course.price === 0 ? "Free" : `₹${course.price}`}
                   </span>
                   {course.price > 0 && (
                     <span className="text-lg text-slate-400 line-through font-bold">₹{(course.price * 1.5).toFixed(0)}</span>
                   )}
                </div>

                <div className="space-y-3">
                  {isEnrolled ? (
                     <button 
                       onClick={() => navigate(`/student/course/${course._id}/watch`)}
                       className="flex items-center justify-center gap-2 w-full py-4 bg-sky-500 hover:bg-sky-400 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-sky-500/20 active:scale-95"
                     >
                        <Zap size={16} className="fill-white" /> Continue Learning
                     </button>
                  ) : user ? (
                     <EnrollButton course={course} />
                  ) : (
                     <button 
                        onClick={() => navigate('/auth/login')}
                        className="flex items-center justify-center gap-2 w-full py-4 bg-[#0a0f1c] dark:bg-sky-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-slate-800 dark:hover:bg-sky-500 transition-all shadow-xl active:scale-95"
                     >
                        Sign in to Enroll <ArrowRight size={16} />
                     </button>
                  )}
                  {!isEnrolled && <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">30-Day Money-Back Guarantee</p>}
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800 mt-auto">
                   <h4 className="font-black text-xs text-slate-900 dark:text-white uppercase tracking-widest">Course Includes:</h4>
                   <div className="grid grid-cols-1 gap-3 text-sm text-slate-600 dark:text-slate-400 font-bold">
                      <div className="flex items-center gap-3"><PlayCircle size={18} className="text-sky-500"/> <span>{course.lessons?.length || 0} Modules</span></div>
                      <div className="flex items-center gap-3"><Clock size={18} className="text-sky-500"/> <span>Full lifetime access</span></div>
                      <div className="flex items-center gap-3"><Globe size={18} className="text-sky-500"/> <span>Access on mobile and TV</span></div>
                      <div className="flex items-center gap-3"><Award size={18} className="text-sky-500"/> <span>Certificate of completion</span></div>
                   </div>
                </div>
             </div>
           </div>
        </div>

      </div>

      {/* MOBILE STICKY BOTTOM BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-[#0a0f1c] border-t border-slate-200 dark:border-slate-800 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-50 flex items-center justify-between transition-colors">
         <div className="flex flex-col">
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                {course.price === 0 ? "Free" : `₹${course.price}`}
            </span>
            <span className="text-[10px] text-sky-600 dark:text-sky-400 font-black uppercase tracking-widest mt-1">One-time payment</span>
         </div>
         <div className="w-1/2 sm:w-64">
            {isEnrolled ? (
               <button onClick={() => navigate(`/student/course/${course._id}/watch`)} className="flex items-center justify-center w-full py-3.5 bg-sky-500 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg active:scale-95 transition-transform">
                 Resume
               </button>
            ) : user ? (
               <EnrollButton course={course} />
            ) : (
               <button onClick={() => navigate('/auth/login')} className="flex items-center justify-center w-full py-3.5 bg-[#0a0f1c] dark:bg-sky-600 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg active:scale-95 transition-transform">
                 Sign In
               </button>
            )}
         </div>
      </div>
      
    </div>
  );
};

export default CourseDetail;