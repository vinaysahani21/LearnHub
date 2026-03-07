import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Loader2, PlayCircle, BookOpen, Clock, Award, 
  Lock, Star, CheckCircle, Globe 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import EnrollButton from './EnrollButton.jsx';

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/courses/${id}`);
        setCourse(res.data);

        if (user?.enrolledCourses?.includes(res.data._id)) {
          setIsEnrolled(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, user]);

  if (loading) return <div className="flex justify-center items-center min-h-screen bg-slate-50 dark:bg-slate-950"><Loader2 className="animate-spin text-indigo-600 w-10 h-10" /></div>;
  if (!course) return <div className="p-20 text-center text-slate-500 dark:bg-slate-950 min-h-screen">Course not found</div>;

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen pb-20 md:pb-0 transition-colors duration-300">
      
      {/* 1. HERO HEADER */}
      <div className="bg-slate-900 dark:bg-slate-900/50 border-b border-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          <div className="max-w-3xl space-y-6">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs md:text-sm tracking-widest uppercase">
              <Link to="/student/explore" className="hover:underline">Courses</Link>
              <span className="text-slate-600">/</span>
              <span className="bg-indigo-500/20 px-2 py-1 rounded text-indigo-300">{course.category}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight dark:text-slate-50">
              {course.title}
            </h1>
            
            <p className="text-lg text-slate-300 dark:text-slate-400 leading-relaxed line-clamp-2">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-sm md:text-base">
              <div className="flex items-center gap-1 text-yellow-400">
                <span className="font-bold">4.8</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <span className="text-slate-400 underline ml-1 cursor-pointer">(124 ratings)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                 <Globe size={16} /> <span>English</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                 <Clock size={16} /> <span>Last updated {new Date(course.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-900/20">
                {course.tutor?.name?.charAt(0) || "T"}
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Created by</p>
                <Link to="#" className="text-white hover:text-indigo-400 font-bold transition-colors">
                  {course.tutor?.name || "Instructor"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN LAYOUT */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* What you'll learn */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-6 bg-slate-50 dark:bg-slate-900/50 transition-colors">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">What you'll learn</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                `Master the fundamentals of ${course.category}`,
                "Build real-world projects from scratch",
                "Earn a certificate of completion",
                "Lifetime access to course materials"
              ].map((text, idx) => (
                <div key={idx} className="flex gap-3 items-start text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle size={18} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Description</h3>
            <div className="prose prose-indigo dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed">
              {course.description}
            </div>
          </div>

          {/* Curriculum */}
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Course Content</h3>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-4 font-medium">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">{course.lessons.length} lessons</span>
              <span className="text-slate-300">|</span>
              <span>Total length: 10h 30m</span>
            </div>
            
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-colors">
              {course.lessons.map((lesson, index) => (
                <div key={index} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <div className="flex items-center gap-3">
                    {isEnrolled ? (
                       <PlayCircle size={18} className="text-indigo-600 dark:text-indigo-400" /> 
                    ) : (
                       <Lock size={18} className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                    )}
                    <span className="text-slate-700 dark:text-slate-300 font-semibold group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                      {lesson.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">10:00</span>
                </div>
              ))}
            </div>
          </div>

          {/* Instructor Bio */}
          <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
             <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Your Instructor</h3>
             <div className="flex flex-col md:flex-row items-start gap-6 bg-slate-50 dark:bg-slate-900/30 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-3xl font-bold text-indigo-600 dark:text-indigo-400 shrink-0 shadow-inner">
                  {course.tutor?.name?.charAt(0)}
                </div>
                <div className="space-y-2">
                  <Link to="#" className="text-xl font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {course.tutor?.name}
                  </Link>
                  <p className="text-indigo-600 dark:text-indigo-400 text-sm font-bold uppercase tracking-tighter">{course.tutor?.headline || "Senior Instructor"}</p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic">
                    {course.tutor?.bio || `${course.tutor?.name} is a leading expert in ${course.category} with over 10 years of industry experience.`}
                  </p>
                </div>
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN (Sticky Card) */}
        <div className="hidden lg:block relative">
           <div className="sticky top-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl dark:shadow-indigo-950/20 overflow-hidden transition-all duration-300">
             
              {/* Thumbnail */}
              <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative group cursor-pointer overflow-hidden">
                 <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                 />
                 <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/40 transition-colors flex items-center justify-center backdrop-blur-[1px]">
                    <div className="bg-white/95 dark:bg-slate-900/95 p-4 rounded-full shadow-2xl transform group-hover:scale-110 transition-all">
                      <PlayCircle size={32} className="text-indigo-600" fill="currentColor" />
                    </div>
                 </div>
              </div>

              <div className="p-6 space-y-6">
                 <div className="flex items-center gap-3">
                    <span className="text-4xl font-black text-slate-900 dark:text-white">
                       {course.price === 0 ? "Free" : `₹${course.price}`}
                    </span>
                    {course.price > 0 && (
                      <span className="text-lg text-slate-400 line-through font-medium">₹{course.price * 2}</span>
                    )}
                 </div>

                 {/* ACTION BUTTONS */}
                 <div className="space-y-3">
                   {isEnrolled ? (
                      <Link 
                        to={`/student/course/${course._id}/watch`}
                        className="flex items-center justify-center gap-2 w-full py-4 bg-slate-900 dark:bg-indigo-600 text-white font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-950/20"
                      >
                         <PlayCircle size={20} /> Continue Learning
                      </Link>
                   ) : user ? (
                      <EnrollButton course={course} />
                   ) : (
                      <Link 
                         to="/auth/login" 
                         className="flex items-center justify-center w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20"
                      >
                         Sign in to Enroll
                      </Link>
                   )}
                   {!isEnrolled && <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">30-Day Money-Back Guarantee</p>}
                 </div>

                 <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">Course Includes:</h4>
                    <div className="grid grid-cols-1 gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
                       <div className="flex items-center gap-3"><PlayCircle size={16} className="text-indigo-500"/> <span>{course.lessons.length} video lessons</span></div>
                       <div className="flex items-center gap-3"><Clock size={16} className="text-indigo-500"/> <span>Lifetime access</span></div>
                       <div className="flex items-center gap-3"><Globe size={16} className="text-indigo-500"/> <span>Mobile & TV access</span></div>
                       <div className="flex items-center gap-3"><Award size={16} className="text-indigo-500"/> <span>Certificate of completion</span></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

      </div>

      {/* MOBILE STICKY BOTTOM BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] z-50 flex items-center justify-between transition-colors">
         <div className="flex flex-col">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
                {course.price === 0 ? "Free" : `₹${course.price}`}
            </span>
            <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">Enroll Now</span>
         </div>
         <div className="w-1/2">
            {isEnrolled ? (
               <Link to={`/student/course/${course._id}/watch`} className="flex items-center justify-center w-full py-3 bg-slate-900 dark:bg-indigo-600 text-white font-bold rounded-xl shadow-lg">
                 Resume
               </Link>
            ) : user ? (
               <EnrollButton course={course} />
            ) : (
               <Link to="/auth/login" className="flex items-center justify-center w-full py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg">
                 Login
               </Link>
            )}
         </div>
      </div>
    </div>
  );
};

export default CourseDetail;