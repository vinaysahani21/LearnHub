import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import axios from "axios";
import api from "../../api/api";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/register", formData);
      alert("Registration Successful! Please login.");
      navigate("/auth/login"); 
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-10">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Create Account</h2>
        <p className="mt-3 text-sm text-slate-500 font-medium">
          Already a member?{" "}
          <Link to="/auth/login" className="font-black text-indigo-600 hover:text-indigo-500 transition-colors uppercase tracking-widest text-[10px]">
            Sign In &rarr;
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
            <input
              name="name" type="text" required value={formData.name} onChange={handleChange}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-slate-900 font-bold"
              placeholder="Your Name"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
            <input
              name="email" type="email" required value={formData.email} onChange={handleChange}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-slate-900 font-bold"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Password</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
            <input
              name="password" type="password" required value={formData.password} onChange={handleChange}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-slate-900 font-bold tracking-widest"
              placeholder="Min 8 characters"
            />
          </div>
        </div>

        <div className="bg-indigo-50 dark:bg-indigo-500/10 p-4 rounded-2xl border border-indigo-100 flex items-center justify-between mt-2">
          <div>
            <p className="text-sm font-black text-indigo-900">Want to teach?</p>
            <p className="text-xs text-indigo-600/70 font-bold">Apply as an instructor.</p>
          </div>
          <Link to="/auth/register-tutor" className="text-[10px] font-black uppercase tracking-widest text-white bg-indigo-600 px-4 py-2 rounded-xl shadow-md hover:bg-indigo-700 transition-all">
            Apply
          </Link>
        </div>

        <button type="submit" disabled={loading} className="w-full mt-4 flex justify-center items-center py-4 px-4 rounded-2xl shadow-xl shadow-[#0a0f1c]/20 text-sm font-black text-white uppercase tracking-widest bg-[#0a0f1c] hover:bg-indigo-600 transition-all disabled:opacity-70 active:scale-[0.98]">
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <>Join LearnHub <ArrowRight className="ml-2 h-4 w-4" /></>}
        </button>
      </form>
    </div>
  );
};

export default Register;