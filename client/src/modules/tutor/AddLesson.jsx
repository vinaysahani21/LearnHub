import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Video, Loader2, ArrowLeft, Plus, CheckCircle, ListChecks, Upload } from 'lucide-react';
import QuizCreator from './QuizCreator.jsx';

const AddLesson = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [lessonType, setLessonType] = useState('video');
  const [title, setTitle] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [quizData, setQuizData] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      if (lessonType === 'video') {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('type', 'video');
        if (videoFile) formData.append('video', videoFile);
        
        await axios.post(`http://localhost:5000/api/courses/${id}/lessons`, formData, {
           headers: { ...config.headers, 'Content-Type': 'multipart/form-data' }
        });
      } else {
        const payload = { title, type: 'quiz', questions: quizData };
        await axios.post(`http://localhost:5000/api/courses/${id}/lessons`, payload, config);
      }

      navigate(-1); 
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 animate-in slide-in-from-bottom-4 duration-500">
      
      <button onClick={() => navigate(-1)} className="inline-flex items-center text-xs font-black text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 uppercase tracking-widest mb-6 transition-colors group">
        <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Return to Studio
      </button>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/20 dark:shadow-none border border-slate-200/60 dark:border-slate-800 overflow-hidden transition-colors">
        
        {/* HEADER */}
        <div className="bg-[#0a0f1c] p-8 text-white relative overflow-hidden">
           <div className="absolute -right-10 -top-10 opacity-5 rotate-12"><Video size={200} /></div>
           <h1 className="text-2xl font-black tracking-tight relative z-10">Module Injector</h1>
           <p className="text-slate-400 text-sm mt-1 relative z-10">Add structured content or assessments to your curriculum.</p>
        </div>

        <div className="p-8">
            {/* TYPE TOGGLE SWITCH */}
            <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-2xl mb-8 relative border border-transparent dark:border-slate-700/50 transition-colors">
              <button
                type="button"
                onClick={() => setLessonType('video')}
                className={`flex-1 py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm font-black transition-all z-10 ${
                  lessonType === 'video' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-600' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <Video size={18} /> Video Lesson
              </button>
              
              <button
                type="button"
                onClick={() => setLessonType('quiz')}
                className={`flex-1 py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm font-black transition-all z-10 ${
                  lessonType === 'quiz' ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm border border-slate-200 dark:border-slate-600' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <ListChecks size={18} /> Interactive Quiz
              </button>
            </div>

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
                  placeholder={lessonType === 'video' ? "e.g. Setting up the environment" : "e.g. Module 1 Knowledge Check"}
                  required
                  className={`w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-lg font-bold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:ring-4 outline-none transition-all placeholder:font-medium placeholder:text-slate-300 dark:placeholder:text-slate-600 shadow-inner ${lessonType === 'video' ? 'focus:ring-indigo-500/10 focus:border-indigo-500' : 'focus:ring-orange-500/10 focus:border-orange-500'}`}
                />
              </div>

              {/* DYNAMIC CONTENT AREA */}
              {lessonType === 'video' ? (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                  <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Video Source File</label>
                  <div className="relative group mt-1 flex justify-center px-6 pt-10 pb-10 border-2 border-slate-200 dark:border-slate-700 border-dashed rounded-3xl hover:bg-indigo-50 dark:hover:bg-indigo-500/5 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-800/20">
                    
                    {videoFile ? (
                      <div className="space-y-3 text-center z-10">
                        <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-sm transition-colors">
                          <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <p className="text-sm text-emerald-700 dark:text-emerald-400 font-black">Video Ready for Injection</p>
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
                          <span className="font-bold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300">Browse files</span>
                          <span className="ml-1 font-medium">to upload video payload</span>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">MP4, MKV format supported</p>
                      </div>
                    )}
                    
                    <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} required />
                  </div>
                </div>
              ) : (
                <div className="animate-in fade-in zoom-in-95 duration-300 bg-orange-50/30 dark:bg-orange-500/5 p-1 rounded-3xl border border-orange-100/50 dark:border-orange-500/20">
                   <QuizCreator onQuizChange={setQuizData} />
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-4 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-lg transition-all flex justify-center items-center gap-3 disabled:opacity-70 active:scale-[0.98] ${
                  lessonType === 'video' ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20 dark:shadow-none' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20 dark:shadow-none'
                }`}
              >
                {loading ? (
                  <><Loader2 className="animate-spin w-5 h-5" /> Processing Payload...</>
                ) : (
                  <>
                    {lessonType === 'video' ? <><Plus size={18} /> Inject Video Module</> : <><ListChecks size={18} /> Deploy Assessment</>}
                  </>
                )}
              </button>

            </form>
        </div>
      </div>
    </div>
  );
};

export default AddLesson;