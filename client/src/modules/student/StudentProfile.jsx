import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  User, Mail, Save, Loader2, MapPin, 
  BookOpen, Award, Clock, GraduationCap, Camera 
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

  // Load user data
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

  // Stats (Mocked for now, real Enrolled count)
  const stats = [
    { label: 'Enrolled', value: user?.enrolledCourses?.length || 0, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Completed', value: '0', icon: Award, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Hours', value: '0', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* 1. HEADER SECTION (Clean & Modern) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
        {/* Simple Gradient Cover */}
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        
        <div className="px-8 pb-6 flex flex-col md:flex-row items-end md:items-center gap-6 -mt-12">
          
          {/* Avatar - Uses Initials now instead of random photo */}
          <div className="relative">
            <div className="w-28 h-28 rounded-full border-4 border-white bg-indigo-100 flex items-center justify-center shadow-md text-4xl font-bold text-indigo-600 uppercase">
              {user?.name?.charAt(0) || 'S'}
            </div>
            {/* Camera Icon (Visual only for now) */}
            <button className="absolute bottom-1 right-1 bg-gray-900 text-white p-1.5 rounded-full hover:bg-gray-700 transition-colors shadow-sm border-2 border-white">
              <Camera size={14} />
            </button>
          </div>

          {/* Identity Info */}
          <div className="flex-1 pb-2">
            <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
            <p className="text-gray-500 font-medium">Student Account</p> {/* No Headline */}
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1"><MapPin size={14}/> Surat, India</span>
              <span className="flex items-center gap-1"><Mail size={14}/> {user?.email}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 2. LEFT COLUMN: Stats & Skills */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <GraduationCap className="text-indigo-600" size={20}/> Learning Stats
            </h3>
            <div className="space-y-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                      <stat.icon size={18} />
                    </div>
                    <span className="text-sm font-medium text-gray-600">{stat.label}</span>
                  </div>
                  <span className="font-bold text-gray-900">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Interests / Skills</h3>
            <div className="flex flex-wrap gap-2">
              {formData.skills ? (
                formData.skills.split(',').map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">
                    {skill.trim()}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-400 italic">Add topics you want to learn.</p>
              )}
            </div>
          </div>
        </div>

        {/* 3. RIGHT COLUMN: Edit Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg">Personal Details</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                      type="email" 
                      value={formData.email}
                      disabled
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Interests</label>
                <input 
                  type="text" 
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g. React, Python, Music (Comma separated)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                />
                <p className="text-xs text-gray-500">What do you want to learn? Separate with commas.</p>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Bio</label>
                <textarea 
                  name="bio"
                  rows="4"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us a little about yourself..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow resize-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
                {success && (
                  <span className="text-green-600 text-sm font-medium animate-pulse flex items-center gap-1">
                    <Save size={16} /> Saved!
                  </span>
                )}
                
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Save Changes"}
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