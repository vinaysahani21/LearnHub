import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Video, Loader2, ArrowLeft, Plus, CheckCircle, ListChecks } from 'lucide-react';
import QuizCreator from './QuizCreator.jsx';

const AddLesson = () => {
  const { id } = useParams(); // Course ID
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // New State: Toggle between Video and Quiz
  const [lessonType, setLessonType] = useState('video'); // 'video' | 'quiz'

  // Form Data
  const [title, setTitle] = useState('');
  const [videoFile, setVideoFile] = useState(null); // For Video
  const [quizData, setQuizData] = useState([]);     // For Quiz

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // BRANCH 1: VIDEO LESSON (Multipart Form)
      if (lessonType === 'video') {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('type', 'video');
        if (videoFile) formData.append('video', videoFile);
        
        await axios.post(`http://localhost:5000/api/courses/${id}/lessons`, formData, {
           headers: { ...config.headers, 'Content-Type': 'multipart/form-data' }
        });
      } 
      // BRANCH 2: QUIZ LESSON (JSON)
      else {
        const payload = {
          title,
          type: 'quiz',
          questions: quizData
        };
        // Standard JSON request
        await axios.post(`http://localhost:5000/api/courses/${id}/lessons`, payload, config);
      }

      alert(`${lessonType === 'video' ? 'Video' : 'Quiz'} Lesson Added Successfully!`);
      navigate(-1); 
      
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 mb-6 hover:text-gray-900">
        <ArrowLeft size={20} className="mr-2" /> Back to Course
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Content</h1>

        {/* TYPE TOGGLE SWITCH */}
        <div className="flex gap-4 mb-8">
          <button
            type="button"
            onClick={() => setLessonType('video')}
            className={`flex-1 py-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
              lessonType === 'video' 
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600' 
                : 'border-gray-200 hover:border-gray-300 text-gray-600'
            }`}
          >
            <Video size={24} />
            <span className="font-bold">Video Lesson</span>
          </button>
          
          <button
            type="button"
            onClick={() => setLessonType('quiz')}
            className={`flex-1 py-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
              lessonType === 'quiz' 
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600' 
                : 'border-gray-200 hover:border-gray-300 text-gray-600'
            }`}
          >
            <ListChecks size={24} />
            <span className="font-bold">Quiz Assessment</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title Input (Common) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {lessonType === 'video' ? 'Lesson Title' : 'Quiz Title'}
            </label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={lessonType === 'video' ? "e.g. Introduction to React" : "e.g. Module 1 Assessment"}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* DYNAMIC CONTENT AREA */}
          {lessonType === 'video' ? (
            // === VIDEO UPLOAD SECTION ===
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Video File</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors bg-gray-50">
                <div className="space-y-1 text-center">
                  <Video className="mx-auto h-12 w-12 text-indigo-400" />
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none px-2">
                      <span>Select Video File</span>
                      <input 
                        id="file-upload" 
                        name="file-upload" 
                        type="file" 
                        className="sr-only" 
                        accept="video/*" 
                        onChange={(e) => setVideoFile(e.target.files[0])} 
                        required 
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">MP4, MKV supported</p>
                  {videoFile && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-600 font-medium bg-green-50 py-1 px-3 rounded-full">
                      <CheckCircle size={14} />
                      {videoFile.name}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // === QUIZ CREATOR SECTION ===
            <QuizCreator onQuizChange={setQuizData} />
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-all flex justify-center items-center"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" /> 
                {lessonType === 'video' ? 'Uploading Video...' : 'Saving Quiz...'}
              </>
            ) : (
              <>
                <Plus className="mr-2" /> 
                {lessonType === 'video' ? 'Upload Lesson' : 'Publish Quiz'}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddLesson;