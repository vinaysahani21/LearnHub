import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Save, Loader2, Camera, Briefcase, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const TutorProfile = () => {
  const { user, login } = useAuth(); 
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    headline: '',
    bio: '',
    skills: '' 
  });

  // Load existing data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        headline: user.headline || '',
        bio: user.bio || '',
        skills: user.skills ? user.skills.join(', ') : '' 
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const res = await axios.put('http://localhost:5000/api/auth/profile', formData, config);
      
      login(res.data, token);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000); 

    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto transition-colors duration-300">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Instructor Settings</h1>
        <p className="text-slate-600 dark:text-slate-400 font-medium">Manage your public profile and account details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* 1. LEFT COLUMN: Public Preview Card */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 text-center sticky top-24 transition-all">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">Public Preview</h3>
            
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-4xl font-black text-indigo-600 dark:text-indigo-400 border-4 border-white dark:border-slate-800 shadow-xl mx-auto">
                {user?.name?.charAt(0).toUpperCase() || 'T'}
              </div>
              <button className="absolute bottom-1 right-1 bg-slate-900 dark:bg-indigo-600 text-white p-2 rounded-xl hover:bg-slate-700 transition-all shadow-lg border-2 border-white dark:border-slate-900" title="Change Photo">
                <Camera size={16} />
              </button>
            </div>
            
            <h2 className="text-xl font-black text-slate-900 dark:text-white">{formData.name || 'Your Name'}</h2>
            <p className="text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-6 mt-1">{formData.headline || 'Your Headline goes here'}</p>
            
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {formData.skills.split(',').slice(0, 3).map((skill, i) => (
                skill.trim() && (
                  <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase rounded-lg tracking-tighter">
                    {skill.trim()}
                  </span>
                )
              ))}
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-6 text-left">
              <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest mb-3">About Me</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-4 italic leading-relaxed">
                {formData.bio || "Write a bio to tell students about your experience..."}
              </p>
            </div>
          </div>
        </div>

        {/* 2. RIGHT COLUMN: Edit Form */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 transition-all">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <User size={20} />
              </div>
              Profile Details
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
                    <input 
                      type="email" 
                      value={formData.email}
                      disabled
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-600 cursor-not-allowed outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Professional Headline</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
                  <input 
                    type="text" 
                    name="headline"
                    value={formData.headline}
                    onChange={handleChange}
                    placeholder="e.g. Senior Full Stack Engineer & Mentor"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-bold uppercase tracking-tighter">This appears under your name on course cards.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Skills / Topics</label>
                <div className="relative">
                  <Award className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
                  <input 
                    type="text" 
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="e.g. React, Python, Data Science"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Biography</label>
                <textarea 
                  name="bio"
                  rows="5"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell students about your teaching style, experience, and what makes you an expert..."
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                {success && (
                  <span className="text-green-600 dark:text-green-400 text-sm font-black animate-pulse flex items-center gap-2">
                    <Save size={16} /> SAVED SUCCESSFULLY!
                  </span>
                )}
                
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-black rounded-xl shadow-lg shadow-indigo-900/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "SAVE CHANGES"}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TutorProfile;