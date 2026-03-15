import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.jsx';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); 
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      const { token, user } = res.data;
      
      login(user, token); 

      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'tutor') navigate('/tutor/dashboard');
      else navigate('/student/dashboard'); // Send to their showroom

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-10">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Welcome back</h2>
        <p className="mt-3 text-sm text-slate-500 font-medium">
          New to the platform?{' '}
          <Link to="/auth/register" className="font-black text-indigo-600 hover:text-indigo-500 transition-colors uppercase tracking-widest text-[10px]">
            Create Account &rarr;
          </Link>
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-600 text-sm font-bold shadow-sm animate-in fade-in">
          <AlertCircle size={20} className="shrink-0" />
          <span className="mt-0.5">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
            <input
              name="email" type="email" required
              value={formData.email} onChange={handleChange}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-slate-900 font-bold"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Password</label>
            <a href="#" className="text-[10px] font-black text-indigo-600 hover:text-indigo-500 uppercase tracking-widest">Recovery</a>
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
            <input
              name="password" type="password" required
              value={formData.password} onChange={handleChange}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-slate-900 font-bold tracking-widest"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit" disabled={loading}
          className="w-full flex justify-center items-center py-4 px-4 rounded-2xl shadow-xl shadow-indigo-600/20 text-sm font-black text-white uppercase tracking-widest bg-indigo-600 hover:bg-indigo-700 transition-all disabled:opacity-70 active:scale-[0.98]"
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <>Access Dashboard <ArrowRight className="ml-2 h-4 w-4" /></>}
        </button>
      </form>
    </div>
  );
};

export default Login;