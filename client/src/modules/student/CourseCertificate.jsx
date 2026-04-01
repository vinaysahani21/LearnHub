import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Loader2, Download, ArrowLeft, ShieldCheck, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const CourseCertificate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // 🔥 Added to read URL parameters
  const { user } = useAuth();
  const certificateRef = useRef(null);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // 🔥 LOGIC 1: Parse the URL for date and fullscreen flags
  const queryParams = new URLSearchParams(location.search);
  const passedDate = queryParams.get('date');
  const isFullscreen = queryParams.get('fullscreen') === 'true';

  useEffect(() => {
    const verifyCertificate = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [courseRes, progressRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/courses/${id}`, config),
          axios.get(`http://localhost:5000/api/progress/${id}`, config)
        ]);

        const totalLessons = courseRes.data.lessons?.length || 1;
        const completedLessons = progressRes.data.completedLessons?.length || 0;

        if (completedLessons < totalLessons) {
          alert("You must complete all modules to unlock this certificate.");
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
    setIsDownloading(true);
    try {
      const element = certificateRef.current;
      
      const canvas = await html2canvas(element, { 
        scale: 4, 
        useCORS: true, 
        backgroundColor: '#ffffff',
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('l', 'mm', 'a4'); 
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`LearnHub_Certificate_${course?.title?.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error("PDF Generation failed", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#020617] gap-4">
      <Loader2 className="animate-spin text-sky-500 w-10 h-10" />
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Verifying Credentials...</p>
    </div>
  );
  
  if (!valid || !course) return null;

  const courseIdStr = (course._id || course.id || "000000").toString();
  const userIdStr = (user?._id || user?.id || "000000").toString();
  const certificateId = `LH-${courseIdStr.substring(0, 6).toUpperCase()}-${userIdStr.substring(0, 6).toUpperCase()}`;
  
  // 🔥 LOGIC 2: Use passed completion date, fallback to today if accessed directly without param
  const dateObj = passedDate ? new Date(passedDate) : new Date();
  const issueDate = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className={`min-h-screen bg-[#020617] flex flex-col items-center px-4 md:px-8 font-sans selection:bg-sky-500/30 ${isFullscreen ? 'py-0 justify-center' : 'py-10'}`}>
      
      {/* 🔥 LOGIC 3: If loaded inside the iframe modal, hide the Sidebar, Header, and layout margins automatically! */}
      {isFullscreen && (
        <style>{`
          /* Targets StudentLayout elements to hide them from the iframe view */
          aside { display: none !important; }
          header { display: none !important; }
          .md\\:ml-64 { margin-left: 0 !important; }
          main { padding: 0 !important; max-width: 100% !important; }
          body { background: #020617 !important; }
        `}</style>
      )}

      {/* --- TOP CONTROLS (Hidden if in Fullscreen Modal) --- */}
      {!isFullscreen && (
        <div className="w-full max-w-[1000px] flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <button onClick={() => navigate('/student/my-learning')} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-black uppercase tracking-widest transition-colors group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Return to Learning
          </button>
          <button 
            onClick={handleDownload} 
            disabled={isDownloading}
            className="bg-sky-500 hover:bg-sky-400 text-[#0a0f1c] px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-sky-500/20 active:scale-95 disabled:opacity-70"
          >
            {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />} 
            {isDownloading ? 'Generating High-Res PDF...' : 'Download Official PDF'}
          </button>
        </div>
      )}

      {/* --- CERTIFICATE RENDER CANVAS --- */}
      <div className={`w-full overflow-x-auto custom-scrollbar flex justify-center ${isFullscreen ? 'pb-0 scale-[0.85] sm:scale-100 origin-center' : 'pb-10'}`}>
        
        <div 
          ref={certificateRef}
          className="relative bg-white shrink-0 shadow-2xl"
          style={{ width: '1000px', height: '707px' }} 
        >
          {/* 1. OUTER MIDNIGHT FRAME */}
          <div className="absolute inset-0 border-[20px] border-[#0f172a]"></div>
          
          {/* 2. INNER GOLD FOIL FRAME */}
          <div className="absolute inset-[24px] border-[4px] border-amber-500/70"></div>
          
          {/* 3. INNER FINE LINE */}
          <div className="absolute inset-[32px] border-[1px] border-amber-700/30"></div>

          {/* 4. SUBTLE BACKGROUND PATTERN & WATERMARK */}
          <div className="absolute inset-[34px] bg-[#fdfdfb] flex items-center justify-center overflow-hidden">
             {/* Radial Gradient for depth */}
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.02)_100%)] pointer-events-none"></div>
             {/* Giant Watermark */}
             <Award className="text-slate-900/[0.03] w-[500px] h-[500px] -rotate-12 pointer-events-none" />
          </div>

          {/* --- ACTUAL CONTENT --- */}
          <div className="absolute inset-[34px] flex flex-col items-center text-center pt-16 pb-12 px-20 z-10">
            
            {/* Header / Brand */}
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="text-amber-600 w-8 h-8" />
              <span className="text-xl font-black tracking-[0.3em] uppercase text-slate-900">LearnHub</span>
            </div>

            {/* Title */}
            <h1 className="text-6xl font-bold text-[#0f172a] tracking-tight mb-2" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
              Certificate of Completion
            </h1>
            <p className="text-sm font-bold text-amber-600 uppercase tracking-[0.4em] mb-12">
              Official & Verified Credential
            </p>

            <p className="text-lg text-slate-500 font-medium italic mb-6" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
              This is to proudly certify that
            </p>

            {/* Student Name */}
            <h2 className="text-5xl text-slate-900 border-b border-slate-300 px-16 pb-4 mb-8" style={{ fontFamily: '"Great Vibes", cursive' }}>
              {user?.name || "Student Name"}
            </h2>

            {/* Body Text */}
            <p className="text-lg text-slate-700 max-w-3xl leading-relaxed" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
              has successfully completed the comprehensive masterclass <br/>
              <span className="font-bold text-[#0f172a] text-xl">"{course?.title}"</span><br/>
              demonstrating exceptional skill, dedication, and mastery of the curriculum.
            </p>

            {/* --- BOTTOM SIGNATURE & SEAL GRID --- */}
            <div className="mt-auto w-full flex justify-between items-end px-12 relative">
              
              {/* Date & Verification */}
              <div className="text-center w-48">
                {/* 🔥 LOGIC 4: Renders the precise date they finished the course! */}
                <p className="text-lg text-slate-900 font-bold mb-1" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>{issueDate}</p>
                <div className="border-t border-slate-400 pt-2">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Date of Issue</p>
                  <p className="text-[8px] text-slate-400 font-mono mt-1">ID: {certificateId}</p>
                </div>
              </div>

              {/* 🌟 PREMIUM GOLD SEAL 🌟 */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-0 flex items-center justify-center translate-y-4">
                 <div className="absolute w-28 h-28 bg-amber-500 rotate-12 shadow-xl"></div>
                 <div className="absolute w-28 h-28 bg-amber-600 rotate-45 shadow-xl"></div>
                 <div className="absolute w-28 h-28 bg-amber-400 rotate-[70deg] shadow-xl"></div>
                 
                 <div className="relative w-28 h-28 bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 rounded-full flex flex-col items-center justify-center shadow-inner border-2 border-amber-200">
                    <div className="w-24 h-24 rounded-full border-[2px] border-dashed border-amber-100 flex flex-col items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600">
                       <ShieldCheck className="text-white w-8 h-8 mb-1 opacity-90" />
                       <span className="text-[8px] font-black text-white uppercase tracking-widest drop-shadow-md">Verified</span>
                    </div>
                 </div>
              </div>

              {/* Signature */}
              <div className="text-center w-48">
                <div className="h-16 flex items-end justify-center mb-1">
                  <span className="text-4xl text-slate-800" style={{ fontFamily: '"Great Vibes", cursive' }}>
                    {course?.tutor?.name || 'Instructor'}
                  </span>
                </div>
                <div className="border-t border-slate-400 pt-2">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Course Instructor</p>
                  <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-1">LearnHub Platform</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCertificate;