import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  PlayCircle, CheckCircle, ArrowLeft, Loader2, MessageSquare, 
  Send, User, ListChecks, XCircle, Save, MonitorPlay, Clock
} from 'lucide-react';
import api from '../../api/api';

const CourseWatch = () => {
  const { id } = useParams(); 
  const videoRef = useRef(null);

  // Data States
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI States
  const [activeTab, setActiveTab] = useState('overview');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  
  // NOTES STATE
  const [note, setNote] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);

  // QUIZ STATES
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);

  // 1. Fetch Course & Progress
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [courseRes, progressRes] = await Promise.all([
          api.get(`/courses/${id}`),
          api.get(`/progress/${id}`).catch(() => ({ data: { completedLessons: [] } }))
        ]);

        setCourse(courseRes.data);
        setCompletedLessons(progressRes.data.completedLessons || []);
        
        if (courseRes.data.lessons?.length > 0) {
          setCurrentLesson(courseRes.data.lessons[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // 2. Reset States when Lesson Changes
  useEffect(() => {
    if (!currentLesson) return;
    
    // Reset Quiz
    setQuizAnswers({});
    setQuizResult(null);

    // Load Notes safely
    const savedNote = localStorage.getItem(`note-${currentLesson._id}`);
    setNote(savedNote || '');

    // Load Comments
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get(`/courses/${id}/lessons/${currentLesson._id}/comments`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setComments(res.data);
      } catch (err) { console.error("Failed to load comments"); }
    };
    fetchComments();
  }, [currentLesson, id]);

  // 3. SAFE Note Handler
  const handleNoteChange = (e) => {
    if (!currentLesson) return;
    
    const newValue = e.target.value;
    setNote(newValue);
    setIsSavingNote(true);

    localStorage.setItem(`note-${currentLesson._id}`, newValue);
    setTimeout(() => setIsSavingNote(false), 800);
  };

  // 4. Progress Logic
  const markLessonComplete = async () => {
    if (completedLessons.includes(currentLesson._id)) return;
    setCompletedLessons((prev) => [...prev, currentLesson._id]);
    try {
      const token = localStorage.getItem('token');
      await api.post('/progress/mark-complete', 
        { courseId: id, lessonId: currentLesson._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) { console.error("Failed to save progress"); }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    const percent = (video.currentTime / video.duration) * 100;
    if (percent > 90) markLessonComplete();
  };

  // 5. Quiz Logic
  const handleQuizSubmit = (e) => {
    e.preventDefault();
    if (!currentLesson.questions) return;

    let correctCount = 0;
    currentLesson.questions.forEach((q, index) => {
      if (quizAnswers[index] === q.correctAnswer) correctCount++;
    });

    const score = (correctCount / currentLesson.questions.length) * 100;
    const passed = score >= 70;
    setQuizResult({ score, passed });
    if (passed) markLessonComplete();
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const res = await api.post(`/courses/${id}/lessons/${currentLesson._id}/comments`, 
        { text: newComment }, { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([res.data, ...comments]);
      setNewComment('');
    } catch (err) { alert("Failed to post comment"); }
  };

  const courseProgressPercent = course?.lessons?.length 
    ? Math.round((completedLessons.length / course.lessons.length) * 100) 
    : 0;

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#020617] gap-4">
      <div className="relative flex h-10 w-10">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-10 w-10 bg-sky-500"></span>
      </div>
      <p className="font-black text-slate-500 tracking-widest uppercase text-xs">Loading Theater...</p>
    </div>
  );

  if (!course) return <div className="p-20 text-center bg-[#020617] text-slate-400 min-h-screen font-black uppercase tracking-widest">Course not found.</div>;

  return (
    <div className="flex flex-col h-screen bg-[#020617] text-slate-200 font-sans overflow-hidden selection:bg-sky-500/30">
      
      {/* 1. CINEMATIC HEADER */}
      <div className="bg-[#0a0f1c]/90 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center gap-6 shrink-0 z-10">
        <Link to="/student/my-learning" className="group p-2 bg-white/5 rounded-xl hover:bg-sky-500 transition-all duration-300">
          <ArrowLeft size={20} className="text-slate-300 group-hover:text-[#0a0f1c] group-hover:-translate-x-1 transition-all" />
        </Link>
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-black tracking-tight text-white line-clamp-1">{course.title}</h1>
            <p className="text-[10px] text-sky-400 uppercase tracking-[0.2em] font-black mt-0.5">{course.category}</p>
          </div>
          
          {/* Glowing Progress Bar */}
          <div className="flex items-center gap-4 hidden md:flex">
            <span className="text-xs font-black tracking-widest text-slate-400 uppercase">{courseProgressPercent}% Mastered</span>
            <div className="w-48 bg-white/10 h-1.5 rounded-full overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-sky-500 to-cyan-300 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(56,189,248,0.5)]" 
                style={{ width: `${courseProgressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
        
        {/* === LEFT COLUMN: THE THEATER === */}
        <div className="flex-1 flex flex-col relative bg-[#020617] overflow-y-auto custom-scrollbar">
          
          {/* Video / Quiz Container */}
          <div className="w-full bg-black shrink-0 relative shadow-2xl border-b border-white/5" style={{ minHeight: '450px', maxHeight: '65vh' }}>
            {!currentLesson ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                 <MonitorPlay size={48} className="mb-4 opacity-50" />
                 <span className="font-black uppercase tracking-widest animate-pulse">Select module</span>
              </div>
            ) : currentLesson.type === 'video' ? (
              <video 
                ref={videoRef}
                key={currentLesson._id} 
                controls 
                className="absolute inset-0 w-full h-full object-contain"
                onTimeUpdate={handleTimeUpdate}
                controlsList="nodownload"
              >
                <source src={currentLesson.videoUrl} type="video/mp4" />
              </video>
            ) : (
              // === CINEMATIC QUIZ UI ===
              <div className="absolute inset-0 bg-[#0a0f1c] overflow-y-auto p-6 md:p-12 custom-scrollbar">
                <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                  
                  <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
                    <div className="bg-orange-500/20 p-3 rounded-2xl text-orange-500 border border-orange-500/20 shadow-lg shadow-orange-900/20">
                      <ListChecks size={32} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-white tracking-tight">{currentLesson.title}</h2>
                      <p className="text-orange-400 text-xs font-black uppercase tracking-[0.2em] mt-1">Assessment Mode • 70% to Pass</p>
                    </div>
                  </div>

                  {quizResult ? (
                    <div className={`p-10 rounded-3xl text-center border transition-all ${quizResult.passed ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                      {quizResult.passed ? (
                        <>
                          <CheckCircle className="mx-auto text-emerald-400 mb-6 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" size={64} />
                          <h3 className="text-3xl font-black text-white tracking-tight mb-2">Module Mastered!</h3>
                          <p className="text-emerald-400 mb-8 font-black uppercase tracking-widest text-sm">Accuracy: {quizResult.score.toFixed(0)}%</p>
                          <button onClick={() => setQuizResult(null)} className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-black uppercase tracking-widest text-xs transition-colors border border-white/10">Review Answers</button>
                        </>
                      ) : (
                        <>
                          <XCircle className="mx-auto text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" size={64} />
                          <h3 className="text-3xl font-black text-white tracking-tight mb-2">Assessment Failed</h3>
                          <p className="text-red-400 mb-8 font-black uppercase tracking-widest text-sm">Score: {quizResult.score.toFixed(0)}% (Required: 70%)</p>
                          <button onClick={() => { setQuizResult(null); setQuizAnswers({}); }} className="bg-red-500 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-red-600 shadow-lg shadow-red-900/20 transition-all active:scale-95">Try Again</button>
                        </>
                      )}
                    </div>
                  ) : (
                    <form onSubmit={handleQuizSubmit} className="space-y-8">
                      {currentLesson.questions?.map((q, qIndex) => (
                        <div key={qIndex} className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 transition-colors hover:border-white/20">
                          <p className="font-black text-xl text-white mb-6 flex gap-4 leading-snug tracking-tight">
                            <span className="text-orange-500 tabular-nums">0{qIndex + 1}.</span> {q.question}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {q.options?.map((opt, optIndex) => (
                              <label key={optIndex} className={`flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition-all ${quizAnswers[qIndex] === optIndex ? 'bg-sky-500/20 border-sky-500/50 shadow-lg shadow-sky-900/20' : 'bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/10'}`}>
                                <input 
                                  type="radio" name={`question-${qIndex}`} value={optIndex}
                                  checked={quizAnswers[qIndex] === optIndex}
                                  onChange={() => setQuizAnswers({ ...quizAnswers, [qIndex]: optIndex })}
                                  className="w-5 h-5 text-sky-500 bg-transparent border-white/20 focus:ring-sky-500 focus:ring-offset-slate-900"
                                />
                                <span className={`font-bold text-sm ${quizAnswers[qIndex] === optIndex ? 'text-white' : 'text-slate-400'}`}>{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                      <button type="submit" className="w-full bg-sky-500 hover:bg-sky-400 text-[#0a0f1c] font-black text-sm uppercase tracking-widest py-5 rounded-2xl shadow-xl shadow-sky-500/20 transition-all active:scale-[0.98]">Submit Assessment</button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* TABS SECTION */}
          <div className="bg-[#0a0f1c] border-b border-white/5 sticky top-0 z-10">
             <div className="flex max-w-4xl mx-auto px-6">
                {['overview', 'comments', 'notes'].map((tab) => (
                  <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)} 
                    className={`py-5 px-6 text-xs font-black uppercase tracking-[0.15em] border-b-2 transition-all relative ${activeTab === tab ? 'border-sky-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                  >
                    {tab}
                    {activeTab === tab && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-4 bg-sky-500/20 blur-md rounded-t-full"></div>}
                  </button>
                ))}
             </div>
          </div>

          {/* TAB CONTENT */}
          <div className="p-8 max-w-4xl mx-auto w-full">
             
             {/* OVERVIEW TAB */}
             {activeTab === 'overview' && (
                <div className="animate-in fade-in duration-300">
                   <h2 className="text-3xl font-black text-white tracking-tight mb-3">{currentLesson?.title}</h2>
                   <div className="flex items-center gap-3 mb-8">
                     <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${currentLesson?.type === 'quiz' ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : 'bg-sky-500/10 border-sky-500/30 text-sky-400'}`}>
                        {currentLesson?.type || 'Video Content'}
                     </span>
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 border-l border-white/10 pl-3">Module {course?.lessons?.findIndex(l => l._id === currentLesson?._id) + 1}</span>
                   </div>
                   <p className="text-slate-400 leading-relaxed font-medium text-lg">
                     {currentLesson?.type === 'quiz' 
                       ? "Mastery of the concepts in this module is required. Ensure you've reviewed all video materials before submitting your answers." 
                       : "Follow along with the instructor. Key takeaways are highlighted, and you can use the Notes tab to jot down important timestamps."}
                   </p>
                </div>
             )}

             {/* COMMENTS TAB */}
             {activeTab === 'comments' && (
                <div className="animate-in fade-in duration-300">
                   <form onSubmit={handlePostComment} className="flex gap-4 mb-12">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center shrink-0 text-white font-black shadow-lg"><User size={20} /></div>
                      <div className="flex-1 bg-white/5 rounded-2xl border border-white/10 focus-within:border-sky-500/50 focus-within:bg-white/10 transition-all p-2">
                         <textarea 
                           value={newComment} onChange={(e) => setNewComment(e.target.value)}
                           className="w-full bg-transparent p-3 text-white outline-none resize-none text-sm placeholder:text-slate-600"
                           placeholder="Ask a question or share your thoughts with the class..." rows="2"
                         ></textarea>
                         <div className="flex justify-end p-2 border-t border-white/5">
                           <button type="submit" disabled={!newComment.trim()} className="bg-sky-500 text-[#0a0f1c] px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-sky-400 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                             Post <Send size={14}/>
                           </button>
                         </div>
                      </div>
                   </form>
                   <div className="space-y-6">
                      {comments.length === 0 ? (
                        <p className="text-center text-slate-500 font-bold italic py-10">No discussions in this module yet. Be the first!</p>
                      ) : (
                        comments.map(c => (
                           <div key={c._id} className="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-sm font-black text-slate-400 uppercase">{c.user?.name?.charAt(0)}</div>
                              <div>
                                 <div className="flex items-center gap-3 mb-1">
                                   <p className="font-black text-white text-sm">{c.user?.name}</p>
                                   <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">{new Date(c.createdAt).toLocaleDateString()}</span>
                                 </div>
                                 <p className="text-slate-300 text-sm leading-relaxed font-medium">{c.text}</p>
                              </div>
                           </div>
                        ))
                      )}
                   </div>
                </div>
             )}

             {/* NOTES TAB */}
             {activeTab === 'notes' && (
                <div className="relative animate-in fade-in duration-300">
                  {currentLesson ? (
                    <div className="relative group">
                      <div className="absolute top-6 right-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest pointer-events-none z-10">
                        {isSavingNote ? (
                          <span className="text-sky-400 animate-pulse">Syncing...</span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-slate-500"><Save size={12} /> Local Save</span>
                        )}
                      </div>
                      <textarea 
                        value={note} 
                        onChange={handleNoteChange}
                        className="w-full h-[400px] rounded-3xl p-8 bg-[#0a0f1c] border border-white/5 text-slate-300 text-sm font-medium leading-relaxed focus:ring-1 focus:ring-sky-500/50 shadow-inner outline-none transition-all resize-none placeholder:text-slate-700"
                        placeholder="Start typing... Your notes are automatically saved to your browser for this specific module."
                      ></textarea>
                    </div>
                  ) : (
                    <div className="p-16 text-center text-slate-600 font-black uppercase tracking-widest text-xs border border-white/5 rounded-3xl bg-[#0a0f1c]">
                      Select a module to access your notebook.
                    </div>
                  )}
                </div>
             )}
          </div>
        </div>

        {/* === RIGHT COLUMN: THE PLAYLIST === */}
        <div className="w-full lg:w-[400px] bg-[#0a0f1c] border-l border-white/5 flex flex-col shrink-0 lg:h-full z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
          <div className="p-8 border-b border-white/5 bg-white/[0.02]">
            <h3 className="font-black text-white text-xl tracking-tight uppercase flex items-center gap-2">
              Episodes <Clock size={16} className="text-slate-500"/>
            </h3>
            <p className="text-[10px] font-black text-sky-400 mt-2 uppercase tracking-[0.2em]">{completedLessons.length} / {course.lessons?.length} Completed</p>
          </div>
          
          <div className="overflow-y-auto flex-1 p-4 space-y-2 custom-scrollbar">
            {course.lessons?.map((lesson, index) => {
              const isActive = currentLesson?._id === lesson._id;
              const isCompleted = completedLessons.includes(lesson._id);

              return (
                <button
                  key={lesson._id} 
                  onClick={() => setCurrentLesson(lesson)}
                  className={`w-full group flex items-start gap-4 p-5 text-left rounded-2xl transition-all duration-300 ${isActive ? 'bg-white/10 border border-white/10 shadow-xl' : 'hover:bg-white/5 border border-transparent'}`}
                >
                  <div className={`mt-1 shrink-0 transition-colors ${isActive ? 'text-sky-400' : 'text-slate-600 group-hover:text-slate-400'}`}>
                    {isCompleted ? (
                      <CheckCircle size={20} className="text-emerald-500 fill-emerald-500/20" />
                    ) : lesson.type === 'quiz' ? (
                      <ListChecks size={20} />
                    ) : (
                      <PlayCircle size={20} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-black tracking-tight leading-snug ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'} ${isCompleted && !isActive ? 'opacity-50' : ''}`}>
                      <span className="mr-2 text-slate-600 font-bold">{index + 1}.</span>
                      {lesson.title}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-[0.15em] border ${lesson.type === 'quiz' ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : 'bg-sky-500/10 border-sky-500/30 text-sky-400'} ${isCompleted && !isActive ? 'opacity-50' : ''}`}>
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

export default CourseWatch;