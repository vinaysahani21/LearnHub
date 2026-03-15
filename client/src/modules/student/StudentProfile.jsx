import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  User, Mail, Save, Loader2, BookOpen, 
  Award, Clock, GraduationCap, Camera, CheckCircle2 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const StudentProfile = () => {
  const { user, login } = useAuth(); 
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    skills: '' 
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
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

  const stats = [
    { label: 'Enrolled', value: user?.enrolledCourses?.length || 0, icon: BookOpen, color: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-500/10' },
    { label: 'Completed', value: '0', icon: Award, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { label: 'Hours', value: '0', icon: Clock, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* 1. HERO COVER & AVATAR */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/10 dark:shadow-none border border-slate-200/60 dark:border-slate-800 overflow-hidden relative transition-colors">
        <div className="h-48 bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-600 relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
        </div>
        
        <div className="px-8 pb-8 flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 relative z-10 text-center md:text-left">
          
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-900 bg-[#0a0f1c] flex items-center justify-center shadow-2xl text-5xl font-black text-white uppercase ring-4 ring-sky-500/30">
              {user?.name?.charAt(0) || 'S'}
            </div>
            <button className="absolute bottom-2 right-2 bg-sky-500 text-white p-2.5 rounded-full hover:bg-sky-400 transition-transform shadow-lg border-2 border-white dark:border-slate-900 group-hover:scale-110 active:scale-95">
              <Camera size={16} />
            </button>
          </div>

          <div className="flex-1 pb-2">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{user?.name || "Student"}</h1>
            <p className="text-sky-600 dark:text-sky-400 font-black text-xs uppercase tracking-widest mt-1">Platform Scholar</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. LEFT COLUMN: Stats & Skills */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800 p-8 transition-colors">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-3">
              <div className="p-2 bg-sky-50 dark:bg-sky-500/10 rounded-xl"><GraduationCap className="text-sky-500" size={20}/></div>
              Track Record
            </h3>
            <div className="space-y-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} shadow-inner`}>
                      <stat.icon size={18} />
                    </div>
                    <span className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">{stat.label}</span>
                  </div>
                  <span className="font-black text-xl text-slate-900 dark:text-white">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800 p-8 transition-colors">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6">Learning Goals</h3>
            <div className="flex flex-wrap gap-2">
              {formData.skills ? (
                formData.skills.split(',').map((skill, i) => (
                  <span key={i} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-200 dark:border-slate-700">
                    {skill.trim()}
                  </span>
                ))
              ) : (
                <p className="text-xs text-slate-400 font-bold italic">Add topics you want to learn to personalize your feed.</p>
              )}
            </div>
          </div>
        </div>

        {/* 3. RIGHT COLUMN: Edit Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800 overflow-hidden transition-colors h-full">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Identity Configuration</h3>
              {success && (
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-3 py-1.5 rounded-lg uppercase tracking-widest flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2">
                  <CheckCircle2 size={14} /> Profile Synced
                </span>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Display Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                      type="text" name="name" value={formData.name} onChange={handleChange}
                      className="w-full pl-12 pr-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Account Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                      type="email" value={formData.email} disabled
                      className="w-full pl-12 pr-5 py-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-600 cursor-not-allowed outline-none text-sm font-bold shadow-inner"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Learning Interests</label>
                <input 
                  type="text" name="skills" value={formData.skills} onChange={handleChange}
                  placeholder="e.g. JavaScript, AI, Finance (Comma separated)"
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Personal Bio</label>
                <textarea 
                  name="bio" rows="4" value={formData.bio} onChange={handleChange}
                  placeholder="Share a bit about yourself and your career goals..."
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all resize-none shadow-inner"
                ></textarea>
              </div>

              <div className="flex items-center justify-end pt-4">
                <button 
                  type="submit" disabled={loading}
                  className="px-10 py-4 bg-[#0a0f1c] dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-sky-900/20 transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95"
                >
                  {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={16} />}
                  {loading ? "Saving..." : "Save Identity"}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentProfile;