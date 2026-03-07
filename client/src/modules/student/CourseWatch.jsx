import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  PlayCircle, CheckCircle, ArrowLeft, Loader2, MessageSquare, 
  FileText, Info, Send, User, ListChecks, HelpCircle, XCircle, Save
} from 'lucide-react';

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
          axios.get(`http://localhost:5000/api/courses/${id}`, config),
          axios.get(`http://localhost:5000/api/progress/${id}`, config)
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
        const res = await axios.get(`http://localhost:5000/api/courses/${id}/lessons/${currentLesson._id}/comments`, {
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

    // Save to local storage
    localStorage.setItem(`note-${currentLesson._id}`, newValue);
    
    // Fake "Saving" delay for UX
    setTimeout(() => setIsSavingNote(false), 800);
  };

  // 4. Progress Logic
  const markLessonComplete = async () => {
    if (completedLessons.includes(currentLesson._id)) return;
    setCompletedLessons((prev) => [...prev, currentLesson._id]);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/progress/mark-complete', 
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
      const res = await axios.post(`http://localhost:5000/api/courses/${id}/lessons/${currentLesson._id}/comments`, 
        { text: newComment }, { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([res.data, ...comments]);
      setNewComment('');
    } catch (err) { alert("Failed to post comment"); }
  };

  if (loading) return <div className="flex justify-center p-20 dark:bg-slate-950 min-h-screen"><Loader2 className="animate-spin text-indigo-500" /></div>;
  if (!course) return <div className="p-20 text-center dark:bg-slate-950 dark:text-slate-400 min-h-screen">Course not found.</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* HEADER */}
      <div className="bg-slate-900 border-b border-slate-800 text-white px-6 py-4 flex items-center gap-4 shrink-0 z-10">
        <Link to="/student/my-learning" className="hover:text-indigo-400 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-bold truncate">{course.title}</h1>
          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
            <div className="w-32 bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${(completedLessons.length / course.lessons.length) * 100}%` }}
              ></div>
            </div>
            <span className="font-bold">{Math.round((completedLessons.length / course.lessons.length) * 100)}% Complete</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        
        {/* === LEFT COLUMN: PLAYER === */}
        <div className="flex-1 flex flex-col overflow-y-auto relative">
          
          <div className="w-full bg-black shrink-0 relative" style={{ minHeight: '500px' }}>
            {!currentLesson ? (
              <div className="absolute inset-0 flex items-center justify-center text-slate-500">Select a lesson</div>
            ) : currentLesson.type === 'video' ? (
              <video 
                ref={videoRef}
                key={currentLesson._id} 
                controls 
                className="absolute inset-0 w-full h-full object-contain"
                onTimeUpdate={handleTimeUpdate}
              >
                <source src={currentLesson.videoUrl} type="video/mp4" />
              </video>
            ) : (
              // === QUIZ UI ===
              <div className="absolute inset-0 bg-white dark:bg-slate-900 overflow-y-auto p-8 md:p-12 transition-colors">
                <div className="max-w-2xl mx-auto">
                  <div className="flex items-center gap-4 mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full text-indigo-600 dark:text-indigo-400">
                      <ListChecks size={32} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{currentLesson.title}</h2>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">Assessment Mode • 70% to Pass</p>
                    </div>
                  </div>

                  {quizResult ? (
                    <div className={`p-10 rounded-3xl text-center border-2 transition-all ${quizResult.passed ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'}`}>
                      {quizResult.passed ? (
                        <>
                          <CheckCircle className="mx-auto text-green-600 dark:text-green-400 mb-4" size={56} />
                          <h3 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2">Quiz Passed!</h3>
                          <p className="text-green-700 dark:text-green-400 mb-6 font-medium">You scored {quizResult.score.toFixed(0)}%</p>
                          <button onClick={() => setQuizResult(null)} className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors">Review Answers</button>
                        </>
                      ) : (
                        <>
                          <XCircle className="mx-auto text-red-600 dark:text-red-400 mb-4" size={56} />
                          <h3 className="text-2xl font-bold text-red-900 dark:text-red-100 mb-2">Quiz Failed</h3>
                          <p className="text-red-700 dark:text-red-400 mb-6 font-medium">Score: {quizResult.score.toFixed(0)}% (Required: 70%)</p>
                          <button onClick={() => { setQuizResult(null); setQuizAnswers({}); }} className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-900/20 transition-all">Try Again</button>
                        </>
                      )}
                    </div>
                  ) : (
                    <form onSubmit={handleQuizSubmit} className="space-y-8">
                      {currentLesson.questions?.map((q, qIndex) => (
                        <div key={qIndex} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 transition-colors">
                          <p className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-5 flex gap-3">
                            <span className="text-indigo-600 dark:text-indigo-400 font-black">Q{qIndex + 1}.</span> {q.question}
                          </p>
                          <div className="space-y-3 pl-8">
                            {q.options?.map((opt, optIndex) => (
                              <label key={optIndex} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${quizAnswers[qIndex] === optIndex ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 dark:border-indigo-400' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-slate-500'}`}>
                                <input 
                                  type="radio" name={`question-${qIndex}`} value={optIndex}
                                  checked={quizAnswers[qIndex] === optIndex}
                                  onChange={() => setQuizAnswers({ ...quizAnswers, [qIndex]: optIndex })}
                                  className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 bg-slate-100 border-slate-300"
                                />
                                <span className={`font-medium ${quizAnswers[qIndex] === optIndex ? 'text-indigo-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                      <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-900/20 transition-all transform active:scale-95">Submit Assessment</button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* TABS SECTION */}
          <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 transition-colors">
             <div className="flex max-w-4xl mx-auto px-4">
                {['overview', 'comments', 'notes'].map((tab) => (
                  <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)} 
                    className={`flex-1 py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === tab ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  >
                    {tab}
                  </button>
                ))}
             </div>
          </div>

          <div className="p-8 bg-white dark:bg-slate-900 min-h-[400px] transition-colors">
             {activeTab === 'overview' && (
                <div className="max-w-3xl mx-auto">
                   <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{currentLesson?.title}</h2>
                   <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-6 ${currentLesson?.type === 'quiz' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
                      {currentLesson?.type || 'Video Content'}
                   </span>
                   <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                     {currentLesson?.type === 'quiz' 
                       ? "Mastery of the concepts in this module is required. Ensure you've reviewed all video materials before submitting." 
                       : "Follow along with the instructor. Key takeaways are highlighted in the resources section."}
                   </p>
                </div>
             )}

             {activeTab === 'comments' && (
                <div className="max-w-2xl mx-auto">
                   <form onSubmit={handlePostComment} className="flex gap-4 mb-10">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0 text-indigo-600 dark:text-indigo-400 font-bold border-2 border-white dark:border-slate-800"><User size={24} /></div>
                      <div className="flex-1">
                         <textarea 
                           value={newComment} onChange={(e) => setNewComment(e.target.value)}
                           className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white outline-none transition-all"
                           placeholder="Post a query or feedback..." rows="3"
                         ></textarea>
                         <div className="flex justify-end mt-2"><button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all flex items-center gap-2">Send <Send size={14}/></button></div>
                      </div>
                   </form>
                   <div className="space-y-6">
                      {comments.map(c => (
                         <div key={c._id} className="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-transparent dark:border-slate-800">
                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0 text-xs font-bold text-slate-600 dark:text-slate-300">{c.user?.name?.charAt(0)}</div>
                            <div>
                               <div className="flex items-center gap-2 mb-1"><p className="font-bold text-slate-900 dark:text-white">{c.user?.name}</p><span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Student</span></div>
                               <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{c.text}</p>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             )}

             {/* NOTES TAB - FIXED & SAFE */}
             {activeTab === 'notes' && (
                <div className="max-w-4xl mx-auto relative">
                  {currentLesson ? (
                    <>
                      <div className="absolute top-4 right-4 flex items-center gap-2 text-xs font-bold text-indigo-500 pointer-events-none">
                        {isSavingNote ? (
                          <span className="animate-pulse">Saving...</span>
                        ) : (
                          <span className="flex items-center gap-1 text-green-500"><Save size={12} /> Saved</span>
                        )}
                      </div>
                      <textarea 
                        value={note} 
                        onChange={handleNoteChange}
                        className="w-full h-[500px] border-none rounded-3xl p-8 bg-yellow-50/50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-lg leading-relaxed focus:ring-2 focus:ring-yellow-400 dark:focus:ring-indigo-500 shadow-inner outline-none transition-all resize-none"
                        placeholder="Type your personal notes here... (Auto-saves to local storage)"
                      ></textarea>
                    </>
                  ) : (
                    <div className="p-10 text-center text-slate-500">
                      Select a lesson to start taking notes.
                    </div>
                  )}
                </div>
             )}
          </div>
        </div>

        {/* === RIGHT COLUMN: PLAYLIST === */}
        <div className="w-full lg:w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col shrink-0 lg:h-full shadow-2xl transition-colors">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <h3 className="font-black text-slate-900 dark:text-white text-lg tracking-tight uppercase">Curriculum</h3>
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-500 mt-1 uppercase tracking-widest">{completedLessons.length} of {course.lessons?.length} Units Finished</p>
          </div>
          <div className="overflow-y-auto flex-1 p-3 space-y-2">
            {course.lessons?.map((lesson, index) => {
              const isActive = currentLesson?._id === lesson._id;
              const isCompleted = completedLessons.includes(lesson._id);

              return (
                <button
                  key={lesson._id} onClick={() => setCurrentLesson(lesson)}
                  className={`w-full flex items-start gap-3 p-4 text-left rounded-2xl transition-all ${isActive ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 shadow-md shadow-indigo-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent'}`}
                >
                  <div className={`mt-0.5 shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-600'}`}>
                    {isCompleted ? <CheckCircle size={22} className="text-green-500 fill-green-50 dark:fill-green-900/20" /> : lesson.type === 'quiz' ? <HelpCircle size={22} /> : <PlayCircle size={22} />}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-bold truncate ${isActive ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-700 dark:text-slate-300'} ${isCompleted ? 'opacity-60' : ''}`}>{index + 1}. {lesson.title}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md tracking-tighter ${lesson.type === 'quiz' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>{lesson.type === 'quiz' ? 'Assessment' : 'Lecture'}</span>
                      {lesson.type === 'video' && <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">10:00 Mins</span>}
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