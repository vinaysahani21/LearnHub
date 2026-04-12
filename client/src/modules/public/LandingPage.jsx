import { useState, useEffect } from 'react';
import { ArrowRight, Play, Zap, Users, Shield, Loader2, Star, Clock, ArrowUpRight, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const HERO_IMAGE = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80";

const LandingPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/courses');
        setCourses(res.data.filter(c => c.isActive !== false));
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="overflow-hidden bg-[#fafcff]">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
        {/* Floating Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-cyan-400/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left animate-in fade-in slide-in-from-bottom-8 duration-700">
              
              <div className="inline-flex items-center px-4 py-2 rounded-full border border-indigo-200/50 bg-white/50 backdrop-blur-md text-indigo-700 text-xs font-black uppercase tracking-widest mb-8 shadow-sm">
                <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2.5 animate-pulse"></span>
                Creator Studio 2.0 Now Live
              </div>
              
              <h1 className="text-5xl tracking-tighter font-black text-slate-900 sm:text-6xl md:text-7xl lg:text-6xl xl:text-7xl leading-[1.1]">
                Master the skills that <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">
                  drive the future.
                </span>
              </h1>
              
              <p className="mt-6 text-lg text-slate-500 font-medium leading-relaxed sm:text-xl lg:text-lg xl:text-xl max-w-lg mx-auto lg:mx-0">
                Join an elite network of developers, designers, and creators. Learn from industry experts and build your portfolio today.
              </p>
              
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/auth/register" className="inline-flex justify-center items-center px-8 py-4 border border-transparent text-sm font-black uppercase tracking-widest rounded-full text-white bg-[#0a0f1c] hover:bg-indigo-600 shadow-xl shadow-slate-900/10 transition-all active:scale-95 group">
                  Start Learning Free
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/auth/register-tutor" className="inline-flex justify-center items-center px-8 py-4 border-2 border-slate-200 text-sm font-black uppercase tracking-widest rounded-full text-slate-700 bg-white hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-95">
                  <Play className="mr-2 w-4 h-4 fill-current" /> Become a Creator
                </Link>
              </div>

              {/* Social Proof Mini */}
              <div className="mt-10 flex items-center justify-center lg:justify-start gap-4">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" className="w-full h-full object-cover"/>
                    </div>
                  ))}
                </div>
                <div className="text-sm font-bold text-slate-600">
                  <span className="text-slate-900 font-black">10,000+</span> ambitious learners.
                </div>
              </div>
            </div>

            <div className="mt-16 lg:mt-0 lg:col-span-6 animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
              <div className="relative mx-auto w-full rounded-[2rem] shadow-2xl shadow-indigo-900/20 overflow-hidden transform lg:-rotate-2 hover:rotate-0 transition-all duration-500 border-8 border-white">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c]/80 to-transparent z-10"></div>
                <img className="w-full h-full object-cover" src={HERO_IMAGE} alt="Students learning" />
                <div className="absolute bottom-8 left-8 right-8 z-20">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl">
                    <div className="flex items-center gap-4 mb-2">
                       <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-black text-xl shadow-inner">A</div>
                       <div>
                         <p className="text-white font-black">Alex Chen</p>
                         <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest">Senior Architect</p>
                       </div>
                    </div>
                    <p className="text-slate-300 text-sm font-medium italic">"The infrastructure scaling module completely changed how I write microservices."</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="bg-[#0a0f1c] py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10">
            {[
              { label: 'Active Students', value: '10k+' },
              { label: 'Premium Courses', value: '250+' },
              { label: 'Verified Creators', value: '120+' },
              { label: 'Avg Satisfaction', value: '4.9/5' },
            ].map((stat, index) => (
              <div key={index} className="text-center px-4">
                <div className="text-4xl font-black text-white tracking-tighter">{stat.value}</div>
                <div className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TRENDING COURSES (DYNAMIC) --- */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight sm:text-5xl">
                Featured Masterclasses
              </h2>
              <p className="mt-4 text-lg text-slate-500 font-medium">
                Learn directly from industry leaders. Discover our most highly-rated courses updated for 2026.
              </p>
            </div>
            <Link to="/courses" className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-xs hover:text-indigo-800 transition-colors group">
              View Catalog <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Loading Catalog...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.slice(0, 3).map(course => (
                <PublicCourseCard key={course._id} course={course} navigate={navigate} />
              ))}
              
              {courses.length === 0 && (
                <div className="col-span-full text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-500 font-bold text-lg">Platform launching soon. Creators are building!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* --- WHY CHOOSE US --- */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: <Zap className="w-6 h-6 text-indigo-600" />, title: "Self-Paced", desc: "Lifetime access to all course materials." },
              { icon: <Users className="w-6 h-6 text-indigo-600" />, title: "Elite Tutors", desc: "Learn from FAANG engineers & founders." },
              { icon: <Play className="w-6 h-6 text-indigo-600 fill-indigo-600" />, title: "Cinematic", desc: "High-fidelity video and assessment tools." },
              { icon: <Shield className="w-6 h-6 text-indigo-600" />, title: "Certified", desc: "Earn verifiable, trusted certificates." }
            ].map((feature, idx) => (
              <div key={idx} className="flex flex-col items-start p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-indigo-900/5 hover:-translate-y-1 transition-all">
                <div className="p-4 bg-white rounded-2xl shadow-sm mb-6 border border-slate-100">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- MASSIVE CTA --- */}
      <section className="relative py-32 bg-[#0a0f1c] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-cyan-500/20 mix-blend-overlay"></div>
        <div className="max-w-5xl mx-auto text-center px-6 relative z-10">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-tight">
            Stop watching. <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Start building.</span>
          </h2>
          <p className="text-xl text-slate-400 font-medium mb-12 max-w-2xl mx-auto">
            Create your free account today and get immediate access to our catalog of premium masterclasses.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/auth/register" className="bg-white text-[#0a0f1c] px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all shadow-xl shadow-white/10 active:scale-95">
              Create Free Account
            </Link>
            <Link to="/auth/register-tutor" className="bg-transparent text-white border-2 border-white/20 px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95">
              Apply as Creator
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

// --- CUSTOM PUBLIC COURSE CARD (Ensures Login Redirect) ---
const PublicCourseCard = ({ course, navigate }) => {
  return (
    <div 
      onClick={() => navigate('/auth/register')}
      className="group bg-white border border-slate-200/60 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-indigo-900/10 transition-all duration-300 flex flex-col cursor-pointer"
    >
      <div className="h-56 overflow-hidden relative bg-slate-100">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
           <div className="bg-white text-slate-900 px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all">
             Enroll to Watch <ArrowUpRight size={14} />
           </div>
        </div>
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-[#0a0f1c]/80 text-white backdrop-blur-md shadow-sm">
            {course.category}
          </span>
        </div>
      </div>

      <div className="p-8 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex text-amber-400">
            <Star size={14} fill="currentColor" />
          </div>
          <span className="text-xs font-black text-slate-700">4.9</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">(2.4k+ Students)</span>
        </div>

        <h3 className="text-xl font-black text-slate-900 tracking-tight line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
          {course.title}
        </h3>
        
        <p className="text-sm font-medium text-slate-500 mb-6 flex items-center gap-2">
           <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[8px] font-black uppercase">
             {course.tutor?.name?.charAt(0) || 'I'}
           </span>
           By {course.tutor?.name || "Expert"}
        </p>

        <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
            <Clock size={14} /> 10+ Hours
          </div>
          <div className="text-xl font-black text-slate-900 tracking-tighter">
            {course.price === 0 ? "Free" : `₹${course.price}`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;