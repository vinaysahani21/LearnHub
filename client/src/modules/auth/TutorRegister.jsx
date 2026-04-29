import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Briefcase, Award, ArrowRight, Loader2, CheckCircle, Sparkles, Check } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext.jsx';

const TutorRegister = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Initial Form, 2: Google Extra Details
  const [googleCredential, setGoogleCredential] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    headline: '',
    bio: '',
    skills: '',
    role: 'tutor'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- STANDARD EMAIL REGISTRATION ---
  const handleStandardSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formattedData = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim())
      };

      await api.post('/auth/register', formattedData);
      alert('Application Received! Welcome to the Instructor Team.');
      navigate('/auth/login');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Registration Failed');
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 1: GOOGLE BUTTON SUCCESS ---
  const handleGoogleTransition = (credentialResponse) => {
    setGoogleCredential(credentialResponse.credential);
    setStep(2); // Move to Step 2 to collect tutor details
  };

  // --- STEP 2: FINISH GOOGLE TUTOR REGISTRATION ---
  const handleGoogleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formattedData = {
        credential: googleCredential,
        headline: formData.headline,
        bio: formData.bio,
        skills: formData.skills.split(',').map(skill => skill.trim())
      };

      // Hit the new dedicated route
      const res = await api.post('/auth/google-tutor-register', formattedData);
      
      login(res.data.user); // Automatically log them in
      navigate('/tutor/dashboard'); // Send straight to the studio
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Google Registration Failed');
      setStep(1); // Reset if it fails
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex selection:bg-indigo-500/30">
      
      {/* 1. LEFT SIDE: Marketing Panel */}
      <div className="hidden lg:flex lg:w-1/3 bg-slate-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-indigo-600 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-20"></div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 mb-12 group">
            <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">LearnHub</span>
          </Link>

          <h2 className="text-4xl font-extrabold leading-tight mb-6">
            Share your knowledge. <br/> <span className="text-indigo-400">Earn your future.</span>
          </h2>
          <p className="text-slate-400 text-lg mb-8">
            Join 15,000+ instructors helping millions of students learn new skills every day.
          </p>

          <div className="space-y-4">
            {["Keep 90% of your earnings", "Teach on your own schedule", "Access to 2M+ active students", "Dedicated instructor support"].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle className="text-green-400 w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-slate-200">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 bg-slate-800 p-6 rounded-xl border border-slate-700 mt-12 shadow-xl">
          <div className="flex items-center gap-4 mb-3">
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Reviewer" className="w-10 h-10 rounded-full" />
            <div>
              <p className="text-sm font-bold">Sarah Jenkins</p>
              <p className="text-xs text-slate-400">Top Rated Instructor</p>
            </div>
          </div>
          <p className="text-sm text-slate-300 italic">"LearnHub changed my career. I started teaching Python on weekends, and now it's my full-time income."</p>
        </div>
      </div>

      {/* 2. RIGHT SIDE: The Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-gray-50 relative">
        <div className="mx-auto w-full max-w-2xl bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-in fade-in duration-500">
          
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              {step === 1 ? "Instructor Application" : "Complete Your Profile"}
            </h2>
            <p className="mt-2 text-sm font-medium text-gray-500">
              {step === 1 
                ? "Tell us about yourself and your expertise." 
                : "Your Google account is linked! Just a few more details to set up your studio."}
            </p>
          </div>

          {/* === STEP 1: INITIAL FORM & GOOGLE BUTTON === */}
          {step === 1 && (
            <>
              {/* Sleek Google Button */}
              <div className="mb-6 flex justify-center w-full">
                <GoogleLogin
                  onSuccess={handleGoogleTransition}
                  onError={() => alert('Google sign-in failed. Please try again.')}
                  theme="outline"
                  shape="pill"
                  size="large"
                  text="signup_with"
                  width="100%"
                  logo_alignment="center"
                />
              </div>

              <div className="relative flex items-center py-2 mb-6">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">Or apply with email</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <form onSubmit={handleStandardSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input name="name" type="text" required onChange={handleChange} className="pl-12 w-full py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl focus:bg-white focus:border-indigo-500 outline-none text-sm font-bold text-slate-900 transition-all" placeholder="Your Name" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input name="email" type="email" required onChange={handleChange} className="pl-12 w-full py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl focus:bg-white focus:border-indigo-500 outline-none text-sm font-bold text-slate-900 transition-all" placeholder="you@example.com" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input name="password" type="password" required onChange={handleChange} className="pl-12 w-full py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl focus:bg-white focus:border-indigo-500 outline-none text-sm font-bold text-slate-900 tracking-widest transition-all" placeholder="••••••••" />
                  </div>
                </div>

                <div className="border-t border-gray-100 my-6"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Professional Headline</label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input name="headline" type="text" required onChange={handleChange} className="pl-12 w-full py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl focus:bg-white focus:border-indigo-500 outline-none text-sm font-bold text-slate-900 transition-all" placeholder="e.g. Senior Data Scientist at Microsoft" />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Key Skills (Comma separated)</label>
                    <div className="relative">
                      <Award className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input name="skills" type="text" required onChange={handleChange} className="pl-12 w-full py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl focus:bg-white focus:border-indigo-500 outline-none text-sm font-bold text-slate-900 transition-all" placeholder="Python, TensorFlow, Machine Learning" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Bio & Experience</label>
                  <textarea name="bio" rows="4" required onChange={handleChange} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:bg-white focus:border-indigo-500 outline-none text-sm font-bold text-slate-900 transition-all" placeholder="Describe your teaching experience..."></textarea>
                </div>

                <button type="submit" disabled={loading} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex justify-center items-center">
                  {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <>Submit Application <ArrowRight className="ml-2 h-5 w-5" /></>}
                </button>
              </form>
            </>
          )}

          {/* === STEP 2: GOOGLE TUTOR DETAILS FORM === */}
          {step === 2 && (
            <form onSubmit={handleGoogleSubmit} className="space-y-6 animate-in slide-in-from-right-4 duration-500">
              
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 mb-6">
                <div className="bg-green-500 rounded-full p-1"><Check className="w-4 h-4 text-white"/></div>
                <span className="text-sm font-bold text-green-700">Google Account Linked Successfully</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Professional Headline</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input name="headline" type="text" required onChange={handleChange} className="pl-12 w-full py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl focus:bg-white focus:border-indigo-500 outline-none text-sm font-bold text-slate-900 transition-all" placeholder="e.g. Senior Data Scientist at Microsoft" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Key Skills (Comma separated)</label>
                  <div className="relative">
                    <Award className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input name="skills" type="text" required onChange={handleChange} className="pl-12 w-full py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl focus:bg-white focus:border-indigo-500 outline-none text-sm font-bold text-slate-900 transition-all" placeholder="Python, TensorFlow, Machine Learning" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Bio & Experience</label>
                <textarea name="bio" rows="4" required onChange={handleChange} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:bg-white focus:border-indigo-500 outline-none text-sm font-bold text-slate-900 transition-all" placeholder="Describe your teaching experience..."></textarea>
              </div>

              <button type="submit" disabled={loading} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex justify-center items-center">
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <>Finish & Access Studio <ArrowRight className="ml-2 h-5 w-5" /></>}
              </button>
            </form>
          )}

          {step === 1 && (
            <div className="mt-8 text-center border-t border-gray-100 pt-6">
              <p className="text-sm font-medium text-gray-500">
                Not ready to teach? <Link to="/auth/register" className="text-indigo-600 font-black hover:underline">Register as a Student</Link>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default TutorRegister;