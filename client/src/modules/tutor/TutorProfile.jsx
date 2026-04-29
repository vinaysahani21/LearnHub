import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Save, Loader2, Camera, Briefcase, Award, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../api/api.js';

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

      const res = await api.put('/auth/profile', formData, config);
      
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
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex justify-between items-end border-b border-slate-200 dark:border-slate-800/50 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            Creator Identity <User className="text-indigo-500" size={28} />
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage your public persona and professional branding.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 1. LEFT COLUMN: Public Preview Card (Takes 4 cols) */}
        <div className="lg:col-span-4">
          <div className="bg-gradient-to-b from-[#0a0f1c] to-slate-900 rounded-3xl shadow-xl border border-slate-800 p-8 text-center sticky top-28 overflow-hidden group">
            
            {/* Background Accent */}
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-20"></div>

            <h3 className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-8 relative z-10">Live Public Preview</h3>
            
            <div className="relative inline-block mb-6 z-10">
              <div className="w-32 h-32 rounded-full bg-slate-800 flex items-center justify-center text-4xl font-black text-white border-4 border-slate-900 shadow-2xl mx-auto ring-4 ring-indigo-500/20 group-hover:ring-indigo-500/40 transition-all">
                {formData.name?.charAt(0).toUpperCase() || 'T'}
              </div>
              <button className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2.5 rounded-full hover:bg-indigo-500 transition-all shadow-lg border-4 border-slate-900 active:scale-95" title="Change Avatar">
                <Camera size={16} />
              </button>
            </div>
            
            <h2 className="text-2xl font-black text-white relative z-10 tracking-tight">{formData.name || 'Your Name'}</h2>
            <p className="text-indigo-400 font-bold text-xs mb-6 mt-1.5 relative z-10">{formData.headline || 'Professional Headline'}</p>
            
            <div className="flex flex-wrap justify-center gap-2 mb-8 relative z-10">
              {formData.skills.split(',').slice(0, 3).map((skill, i) => (
                skill.trim() && (
                  <span key={i} className="px-3 py-1 bg-white/10 text-white text-[10px] font-black uppercase rounded-lg tracking-widest border border-white/5">
                    {skill.trim()}
                  </span>
                )
              ))}
            </div>

            <div className="border-t border-white/10 pt-6 text-left relative z-10">
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-3">About the Creator</p>
              <p className="text-sm text-slate-300 line-clamp-4 leading-relaxed font-medium">
                {formData.bio || "Your biography will appear here. Tell students why they should learn from you..."}
              </p>
            </div>
          </div>
        </div>

        {/* 2. RIGHT COLUMN: Edit Form (Takes 8 cols) */}
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/10 dark:shadow-none border border-slate-200/60 dark:border-slate-800 p-8">
            
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Profile Configuration</h3>
              {success && (
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-3 py-1.5 rounded-lg uppercase tracking-widest flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2">
                  <ShieldCheck size={14} /> Synced
                </span>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Legal Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Registered Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                      type="email" 
                      value={formData.email}
                      disabled
                      className="w-full pl-12 pr-5 py-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-600 cursor-not-allowed outline-none text-sm font-bold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Professional Headline</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input 
                    type="text" 
                    name="headline"
                    value={formData.headline}
                    onChange={handleChange}
                    placeholder="e.g. Senior Software Architect @ Google"
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Core Competencies (Comma Separated)</label>
                <div className="relative">
                  <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input 
                    type="text" 
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="e.g. React, Node.js, System Design"
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Full Biography</label>
                <textarea 
                  name="bio"
                  rows="5"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Share your journey, your teaching philosophy, and what students can expect from you..."
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none"
                ></textarea>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-8 py-4 bg-[#0a0f1c] hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-indigo-900/20 transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95"
                >
                  {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={16} />}
                  {loading ? "Syncing..." : "Update Identity"}
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