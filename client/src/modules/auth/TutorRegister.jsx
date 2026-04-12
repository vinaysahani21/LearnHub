import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Briefcase, Award, ArrowRight, Loader2, CheckCircle, Rocket } from 'lucide-react';
import axios from 'axios';

const TutorRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formattedData = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim())
      };

      await axios.post('http://localhost:5000/api/auth/register', formattedData);
      
      alert('Application Received! Welcome to the Instructor Team.');
      navigate('/auth/login');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Registration Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      
      {/* 1. LEFT SIDE: Marketing/Benefits Panel (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/3 bg-slate-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Background decorative blob */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-indigo-600 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-20"></div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Rocket className="text-white w-5 h-5" />
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
            {[
              "Keep 90% of your earnings",
              "Teach on your own schedule",
              "Access to 2M+ active students",
              "Dedicated instructor support"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle className="text-green-400 w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-slate-200">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 bg-slate-800 p-6 rounded-xl border border-slate-700 mt-12">
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
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-gray-50">
        <div className="mx-auto w-full max-w-2xl bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900">Instructor Application</h2>
            <p className="mt-2 text-sm text-gray-600">
              Tell us about yourself and your expertise.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* --- SECTION 1: LOGIN DETAILS (2 Columns) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input name="name" type="text" required onChange={handleChange} className="pl-10 w-full py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" placeholder="Your Name" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input name="email" type="email" required onChange={handleChange} className="pl-10 w-full py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" placeholder="you@example.com" />
                </div>
              </div>
            </div>

            {/* Password (Full Width) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input name="password" type="password" required onChange={handleChange} className="pl-10 w-full py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" placeholder="Create a strong password" />
              </div>
            </div>

            <div className="border-t border-gray-100 my-6"></div>

            {/* --- SECTION 2: EXPERTISE (2 Columns) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Professional Headline</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input name="headline" type="text" required onChange={handleChange} className="pl-10 w-full py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" placeholder="e.g. Senior Data Scientist at Microsoft" />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Key Skills (Comma separated)</label>
                <div className="relative">
                  <Award className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input name="skills" type="text" required onChange={handleChange} className="pl-10 w-full py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" placeholder="Python, TensorFlow, Machine Learning" />
                </div>
                <p className="mt-1 text-xs text-gray-500">This helps students find you in search results.</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio & Experience</label>
              <textarea name="bio" rows="4" required onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" placeholder="Describe your teaching experience, certifications, and what makes you a great instructor..."></textarea>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start">
              <input id="terms" name="terms" type="checkbox" required className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1" />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                I agree to the <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">Instructor Terms</a>. I understand that my application will be reviewed within 24 hours.
              </label>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg hover:shadow-indigo-500/30 transition-all flex justify-center items-center">
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                <>
                  Submit Application <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Not ready to teach? <Link to="/auth/register" className="text-indigo-600 font-bold hover:underline">Register as a Student</Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TutorRegister;