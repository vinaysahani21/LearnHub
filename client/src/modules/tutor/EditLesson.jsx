import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Video, Loader2, ArrowLeft, CheckCircle, ListChecks, Upload, Save, AlertCircle } from 'lucide-react';
import QuizCreator from './QuizCreator.jsx';
import api from '../../api/api';

const EditLesson = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const [lessonType, setLessonType] = useState('video');
  const [title, setTitle] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(null);
  const [quizData, setQuizData] = useState([]);

  // Fetch the existing lesson data
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        const res = await api.get(`/courses/${courseId}`, config);
        const course = res.data;
        const lesson = course.lessons.find(l => l._id === lessonId);

        if (!lesson) throw new Error("Module not found");

        setTitle(lesson.title);
        setLessonType(lesson.type);

        if (lesson.type === 'video') {
          setCurrentVideoUrl(lesson.videoUrl);
        } else {
          setQuizData(lesson.questions || []);
        }

      } catch (err) {
        console.error(err);
        setError("Failed to load module data. It may have been deleted.");
      } finally {
        setLoadingInitial(false);
      }
    };
    fetchLesson();
  }, [courseId, lessonId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Make sure your backend has a PUT or PATCH route for updating lessons!
      if (lessonType === 'video') {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('type', 'video');
        // Only append video if they uploaded a replacement
        if (videoFile) formData.append('video', videoFile); 
        
        await api.put(`/courses/${courseId}/lessons/${lessonId}`, formData, {
           headers: { ...config.headers, 'Content-Type': 'multipart/form-data' }
        });
      } else {
        const payload = { title, type: 'quiz', questions: quizData };
        await api.put(`/courses/${courseId}/lessons/${lessonId}`, payload, config);
      }

      navigate(-1); 
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Retrieving Module...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="w-16 h-16 text-rose-500 mb-4" />
        <h3 className="text-xl font-black text-slate-900 dark:text-white">Error Loading Payload</h3>
        <p className="text-slate-500 mt-2">{error}</p>
        <button onClick={() => navigate(-1)} className="mt-6 px-6 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold">Go Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 animate-in slide-in-from-bottom-4 duration-500">
      
      <button onClick={() => navigate(-1)} className="inline-flex items-center text-xs font-black text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 uppercase tracking-widest mb-6 transition-colors group">
        <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Return to Studio
      </button>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/20 dark:shadow-none border border-slate-200/60 dark:border-slate-800 overflow-hidden transition-colors">
        
        {/* HEADER */}
        <div className="bg-[#0a0f1c] p-8 text-white relative overflow-hidden flex justify-between items-center">
           <div className="absolute -right-10 -top-10 opacity-5 rotate-12"><Video size={200} /></div>
           <div className="relative z-10">
             <h1 className="text-2xl font-black tracking-tight">Module Configuration</h1>
             <p className="text-slate-400 text-sm mt-1">Update your existing curriculum properties.</p>
           </div>
           
           {/* Module Type Badge */}
           <div className={`relative z-10 px-4 py-2 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border ${lessonType === 'video' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' : 'bg-orange-500/20 text-orange-300 border-orange-500/30'}`}>
             {lessonType === 'video' ? <Video size={14}/> : <ListChecks size={14}/>}
             {lessonType === 'video' ? 'Video Lesson' : 'Assessment'}
           </div>
        </div>

        <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Common Title Input */}
              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                  {lessonType === 'video' ? 'Video Module Title' : 'Assessment Title'}
                </label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className={`w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-lg font-bold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:ring-4 outline-none transition-all shadow-inner ${lessonType === 'video' ? 'focus:ring-indigo-500/10 focus:border-indigo-500' : 'focus:ring-orange-500/10 focus:border-orange-500'}`}
                />
              </div>

              {/* DYNAMIC CONTENT AREA */}
              {lessonType === 'video' ? (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                  <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Replacement Video (Optional)</label>
                  
                  {/* Shows existing video info if they haven't uploaded a new one */}
                  {!videoFile && currentVideoUrl && (
                    <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-500">
                        <Video size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Current Active Video</p>
                        <a href={currentVideoUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline truncate max-w-[200px] sm:max-w-md block">
                          {currentVideoUrl.split('/').pop()}
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="relative group flex justify-center px-6 pt-10 pb-10 border-2 border-slate-200 dark:border-slate-700 border-dashed rounded-3xl hover:bg-indigo-50 dark:hover:bg-indigo-500/5 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-800/20">
                    {videoFile ? (
                      <div className="space-y-3 text-center z-10">
                        <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-sm transition-colors">
                          <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <p className="text-sm text-emerald-700 dark:text-emerald-400 font-black">New Video Ready for Injection</p>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 truncate max-w-xs px-4 py-1.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 inline-block shadow-sm">
                          {videoFile.name}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 text-center z-10">
                        <div className="mx-auto w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm group-hover:scale-110 group-hover:bg-indigo-600 dark:group-hover:bg-indigo-500 group-hover:text-white transition-all text-slate-300 dark:text-slate-500">
                          <Upload className="h-6 w-6" />
                        </div>
                        <div className="flex text-sm text-slate-600 dark:text-slate-400 justify-center">
                          <span className="font-bold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300">Upload replacement file</span>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Leave empty to keep existing video</p>
                      </div>
                    )}
                    <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} />
                  </div>
                </div>
              ) : (
                <div className="animate-in fade-in zoom-in-95 duration-300 bg-orange-50/30 dark:bg-orange-500/5 p-1 rounded-3xl border border-orange-100/50 dark:border-orange-500/20">
                   {/* Pass the existing questions into the QuizCreator so they can edit them */}
                   <QuizCreator onQuizChange={setQuizData} initialData={quizData} />
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={saving}
                className={`w-full py-4 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-lg transition-all flex justify-center items-center gap-3 disabled:opacity-70 active:scale-[0.98] ${
                  lessonType === 'video' ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20 dark:shadow-none' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20 dark:shadow-none'
                }`}
              >
                {saving ? (
                  <><Loader2 className="animate-spin w-5 h-5" /> Synchronizing Changes...</>
                ) : (
                  <><Save size={18} /> Update Configuration</>
                )}
              </button>

            </form>
        </div>
      </div>
    </div>
  );
};

export default EditLesson;