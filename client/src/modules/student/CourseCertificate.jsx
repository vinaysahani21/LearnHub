import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Loader2, Download, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const CourseCertificate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const certificateRef = useRef(null);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const verifyCertificate = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Fetch Course (with populated Tutor) & Progress
        const [courseRes, progressRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/courses/${id}`, config),
          axios.get(`http://localhost:5000/api/progress/${id}`, config)
        ]);

        const totalLessons = courseRes.data.lessons.length;
        const completedLessons = progressRes.data.completedLessons.length;

        if (completedLessons < totalLessons) {
          alert("You must complete all lessons to view this certificate.");
          navigate('/student/my-learning');
          return;
        }

        setCourse(courseRes.data);
        setValid(true);
      } catch (err) {
        console.error(err);
        navigate('/student/my-learning');
      } finally {
        setLoading(false);
      }
    };
    verifyCertificate();
  }, [id, navigate]);

  const handleDownload = async () => {
    const element = certificateRef.current;
    
    // High-quality capture settings
    const canvas = await html2canvas(element, { 
      scale: 3, 
      useCORS: true, 
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('l', 'mm', 'a4'); 
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`LearnHub-Certificate-${course?.title?.replace(/\s+/g, '-') || 'Download'}.pdf`);
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;
  if (!valid || !course) return null;

  // --- 🛡️ DEFENSIVE FIX START ---
  // We use fallback values ("000") in case _id is missing or named 'id'
  const courseIdStr = (course._id || course.id || "000000").toString();
  const userIdStr = (user?._id || user?.id || "000000").toString();

  const certificateId = `LH-${courseIdStr.substring(0, 6).toUpperCase()}-${userIdStr.substring(0, 6).toUpperCase()}`;
  // --- 🛡️ DEFENSIVE FIX END ---

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 md:p-8 font-sans">
      
      {/* Controls */}
      <div className="w-full max-w-[1000px] flex justify-between items-center mb-6 text-white">
        <button onClick={() => navigate('/student/my-learning')} className="flex items-center gap-2 hover:text-gray-300 transition-colors">
          <ArrowLeft size={20} /> Back to Dashboard
        </button>
        <button onClick={handleDownload} className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-lg hover:shadow-indigo-500/30">
          <Download size={18} /> Download PDF
        </button>
      </div>

      {/* --- CERTIFICATE CANVAS --- */}
      <div className="overflow-auto max-w-full">
        {/* Fixed Width Container for A4 Consistency */}
        <div 
          ref={certificateRef}
          className="bg-white relative text-gray-900"
          style={{ width: '1000px', height: '707px', padding: '40px' }} 
        >
          {/* 1. OUTER BORDER (Double Line) */}
          <div className="w-full h-full border-4 border-double border-gray-300 relative p-2">
            
            {/* 2. INNER BORDER (Gold Ornamental) */}
            <div className="w-full h-full border-[10px] border-indigo-900 relative flex flex-col items-center bg-[#fffdf5]">
              
              {/* Corner Ornaments */}
              <div className="absolute top-0 left-0 border-t-[60px] border-l-[60px] border-t-indigo-900 border-l-transparent z-10"></div>
              <div className="absolute top-0 right-0 border-t-[60px] border-r-[60px] border-t-indigo-900 border-r-transparent z-10"></div>
              <div className="absolute bottom-0 left-0 border-b-[60px] border-l-[60px] border-b-indigo-900 border-l-transparent z-10"></div>
              <div className="absolute bottom-0 right-0 border-b-[60px] border-r-[60px] border-b-indigo-900 border-r-transparent z-10"></div>

              {/* WATERMARK */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none z-0">
                <CheckCircle size={400} />
              </div>

              {/* CONTENT */}
              <div className="z-20 flex flex-col items-center w-full h-full pt-16 pb-12 px-16 text-center">
                
                {/* Header */}
                <h1 className="text-5xl font-bold uppercase tracking-[0.15em] text-indigo-900" style={{ fontFamily: '"Playfair Display", serif' }}>
                  Certificate
                </h1>
                <span className="text-xl text-indigo-400 font-medium uppercase tracking-widest mt-2">
                  Of Completion
                </span>

                {/* Presented To */}
                <p className="mt-12 text-gray-500 text-lg italic" style={{ fontFamily: '"Playfair Display", serif' }}>
                  This certificate is proudly presented to
                </p>

                {/* Student Name */}
                <h2 className="text-5xl font-bold text-gray-900 mt-6 mb-2 border-b-2 border-gray-300 pb-4 min-w-[500px]" style={{ fontFamily: '"Playfair Display", serif' }}>
                  {user?.name || "Student"}
                </h2>

                {/* Body Text */}
                <p className="text-lg text-gray-600 mt-8 max-w-2xl leading-relaxed">
                  For successfully completing the course 
                  <span className="font-bold text-gray-900"> "{course?.title}" </span> 
                  on <span className="font-bold text-indigo-900">LearnHub</span>. 
                  The recipient has demonstrated mastery of the curriculum and key concepts.
                </p>

                {/* --- BOTTOM SECTION --- */}
                <div className="mt-auto w-full flex justify-between items-end px-8">
                  
                  {/* DATE */}
                  <div className="text-center">
                    <p className="text-lg text-gray-800 font-medium border-t border-gray-400 pt-2 px-6">
                      {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest mt-1">Date Issued</p>
                  </div>

                  {/* GOLD SEAL BADGE */}
                  <div className="relative -mb-4">
                    <div className="w-32 h-32 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg border-4 border-yellow-600 bg-gradient-to-br from-yellow-400 to-yellow-600 text-white relative z-10">
                      <div className="w-24 h-24 border border-white/50 rounded-full flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold">100%</span>
                        <span className="text-[10px] uppercase tracking-wide">Verified</span>
                      </div>
                    </div>
                    {/* Ribbons */}
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 w-16 h-16 bg-yellow-700 rotate-45 -z-0"></div>
                  </div>

                  {/* SIGNATURES */}
                  <div className="flex gap-12">
                    {/* 1. LearnHub Signature */}
                    <div className="text-center">
                      <div className="h-12 flex items-end justify-center">
                        <span className="text-4xl text-gray-800" style={{ fontFamily: '"Great Vibes", cursive' }}>
                          LearnHub Team
                        </span>
                      </div>
                      <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest border-t border-gray-400 pt-2 mt-1 px-4">
                        Platform Director
                      </p>
                    </div>

                    {/* 2. Tutor Signature */}
                    <div className="text-center">
                      <div className="h-12 flex items-end justify-center">
                        <span className="text-4xl text-gray-800" style={{ fontFamily: '"Great Vibes", cursive' }}>
                          {course?.tutor?.name || 'Instructor'}
                        </span>
                      </div>
                      <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest border-t border-gray-400 pt-2 mt-1 px-4">
                        Course Instructor
                      </p>
                    </div>
                  </div>

                </div>

                {/* Verification ID */}
                <p className="absolute bottom-4 text-[10px] text-gray-400 font-mono">
                  ID: {certificateId}
                </p>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCertificate;