import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, PlayCircle, ListChecks, HelpCircle, ShieldAlert,
  ChevronRight, MonitorPlay, Clock
} from 'lucide-react';
import api from '../../api/api';

const AdminCoursePreview = () => {
  const { id } = useParams();
  const videoRef = useRef(null);
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get(`/admin/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourse(res.data);
      if (res.data.lessons?.length > 0) setCurrentLesson(res.data.lessons[0]);
    } catch (err) {
      console.error("Failed to load course preview", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0f1c] gap-4">
        <div className="relative flex h-10 w-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-10 w-10 bg-red-500"></span>
        </div>
        <p className="font-black text-slate-500 tracking-widest uppercase text-xs">Authenticating Content...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#020617] text-slate-100 font-sans overflow-hidden">
      
      {/* CINEMATIC HEADER */}
      <div className="bg-[#0a0f1c]/80 backdrop-blur-xl border-b border-slate-800/50 px-8 py-4 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-6">
          <Link to="/admin/content" className="group p-2 bg-slate-800/50 rounded-xl hover:bg-red-500 transition-all duration-300">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">Compliance Audit</span>
              <ChevronRight size={12} className="text-slate-600" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] truncate max-w-[200px]">{course.title}</span>
            </div>
            <h1 className="text-lg font-black tracking-tight mt-1 flex items-center gap-2">
              <MonitorPlay size={18} className="text-red-500" /> {currentLesson?.title || 'Course Player'}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-red-500/10 px-4 py-2 rounded-xl border border-red-500/20 shadow-lg shadow-red-900/10">
          <ShieldAlert size={16} className="text-red-500" />
          <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Admin Observer Mode</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
        
        {/* PLAYER ENGINE */}
        <div className="flex-1 flex flex-col relative bg-black/40">
          {!currentLesson ? (
            <div className="absolute inset-0 flex items-center justify-center text-slate-600 font-black uppercase tracking-widest animate-pulse">Select module</div>
          ) : currentLesson.type === 'video' ? (
            <video 
              ref={videoRef}
              key={currentLesson._id} 
              controls 
              className="w-full h-full object-contain shadow-2xl"
            >
              <source src={currentLesson.videoUrl} type="video/mp4" />
            </video>
          ) : (
            <div className="absolute inset-0 bg-[#0a0f1c] overflow-y-auto p-12 custom-scrollbar">
              <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/5 p-8 rounded-3xl border border-orange-500/20 shadow-2xl">
                   <div className="flex items-center gap-4 mb-2">
                      <div className="p-3 bg-orange-500 rounded-2xl text-white shadow-lg shadow-orange-900/20"><ListChecks size={28} /></div>
                      <h2 className="text-3xl font-black tracking-tighter italic">ASSESSMENT AUDIT</h2>
                   </div>
                   <p className="text-orange-200/60 font-bold text-sm tracking-widest uppercase ml-1">Evaluating module: {currentLesson.title}</p>
                </div>

                <div className="space-y-6">
                  {currentLesson.questions?.map((q, qIndex) => (
                    <div key={qIndex} className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/5 transition-all hover:border-white/10 group">
                      <p className="font-black text-xl mb-6 flex gap-4">
                        <span className="text-orange-500 tabular-nums">{qIndex + 1}.</span> {q.question}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {q.options?.map((opt, optIndex) => (
                          <div key={optIndex} className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${q.correctAnswer === optIndex ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-white/5 border-white/5 text-slate-400'}`}>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${q.correctAnswer === optIndex ? 'border-emerald-400 bg-emerald-400 ring-4 ring-emerald-400/20' : 'border-slate-700'}`}>
                               {q.correctAnswer === optIndex && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                            </div>
                            <span className="font-bold text-sm">{opt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CURRICULUM SIDEBAR */}
        <div className="w-full lg:w-[400px] bg-[#0a0f1c] border-l border-white/5 flex flex-col shrink-0 relative overflow-hidden">
          <div className="p-8 border-b border-white/5 bg-white/[0.02]">
            <h3 className="font-black text-white text-xl tracking-tight uppercase flex items-center gap-2">
              Curriculum <Clock size={16} className="text-slate-500"/>
            </h3>
            <p className="text-[10px] font-black text-slate-500 mt-2 uppercase tracking-[0.2em]">{course.lessons?.length || 0} Total Modules Found</p>
          </div>
          
          <div className="overflow-y-auto flex-1 p-4 space-y-2 custom-scrollbar">
            {course.lessons?.map((lesson, index) => {
              const isActive = currentLesson?._id === lesson._id;
              return (
                <button
                  key={lesson._id} 
                  onClick={() => setCurrentLesson(lesson)}
                  className={`w-full group flex items-start gap-4 p-5 text-left rounded-2xl transition-all duration-300 ${isActive ? 'bg-white/10 border border-white/10 shadow-xl' : 'hover:bg-white/5 border border-transparent'}`}
                >
                  <div className={`mt-1 font-black text-xs transition-colors ${isActive ? 'text-red-500' : 'text-slate-700 group-hover:text-slate-500'}`}>
                    {(index + 1).toString().padStart(2, '0')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-black tracking-tight leading-snug ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`}>
                      {lesson.title}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-[0.15em] border ${lesson.type === 'quiz' ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                        {lesson.type === 'quiz' ? 'Assessment' : 'Video Module'}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminCoursePreview;