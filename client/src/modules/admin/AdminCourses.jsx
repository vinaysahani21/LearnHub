import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Loader2, Trash2, AlertCircle, ExternalLink, ShieldAlert, 
  Search, Filter, ArrowUpDown, Video, BookOpen, CheckCircle2, 
  Ban, Clock, IndianRupee 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/api';

const ContentModeration = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Advanced UI States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // 1. Fetch All Courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await api.get('/admin/courses', config);
        setCourses(res.data);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // 2. Admin Delete Course
  const handleDeleteCourse = async (courseId, title) => {
    if (!window.confirm(`⚠️ ADMIN OVERRIDE:\nAre you sure you want to permanently delete the course "${title}"? This cannot be undone.`)) return;

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await api.delete(`/admin/courses/${courseId}`, config);
      setCourses(courses.filter(c => c._id !== courseId));
    } catch (err) {
      alert("Failed to delete course. Check console.");
      console.error(err);
    }
  };

  // --- DATA PROCESSING ENGINE ---
  
  // Extract unique categories for the filter dropdown
  const uniqueCategories = [...new Set(courses.map(c => c.category).filter(Boolean))].sort();

  // Filter & Sort Logic
  let processedCourses = courses.filter(c => {
    const matchSearch = (c.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                        (c.tutor?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' ? true : statusFilter === 'active' ? c.isActive : !c.isActive;
    const matchCat = categoryFilter === 'all' ? true : c.category === categoryFilter;
    
    return matchSearch && matchStatus && matchCat;
  });

  processedCourses.sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
    if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'modules-high') return (b.lessons?.length || 0) - (a.lessons?.length || 0);
    return 0;
  });

  // Calculate Quick Insights
  const totalActive = processedCourses.filter(c => c.isActive).length;
  const totalDrafts = processedCourses.filter(c => !c.isActive).length;
  const totalModules = processedCourses.reduce((sum, c) => sum + (c.lessons?.length || 0), 0);

  // The Signature Red Pulse Loader
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4 transition-colors">
        <div className="relative flex h-10 w-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-10 w-10 bg-red-500"></span>
        </div>
        <p className="font-bold text-slate-400 dark:text-slate-500 animate-pulse tracking-widest uppercase text-xs">Scanning Content Library...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200/60 dark:border-slate-800/60 pb-6 transition-colors">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            Content Moderation <ShieldAlert className="text-red-600 dark:text-red-500" size={28} />
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Review, audit, and manage all intellectual property on the platform.</p>
        </div>
      </div>

      {/* INSIGHTS WIDGET ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-4 shadow-sm transition-colors">
          <div className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl"><Video size={20}/></div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Total Filtered</p>
            <p className="text-xl font-black text-slate-900 dark:text-white leading-none mt-1">{processedCourses.length}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-4 shadow-sm transition-colors">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl"><CheckCircle2 size={20}/></div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Active Courses</p>
            <p className="text-xl font-black text-slate-900 dark:text-white leading-none mt-1">{totalActive}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-4 shadow-sm transition-colors">
          <div className="p-3 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl"><Ban size={20}/></div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Draft / Inactive</p>
            <p className="text-xl font-black text-slate-900 dark:text-white leading-none mt-1">{totalDrafts}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-4 shadow-sm transition-colors">
          <div className="p-3 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl"><BookOpen size={20}/></div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Total Modules</p>
            <p className="text-xl font-black text-slate-900 dark:text-white leading-none mt-1">{totalModules}</p>
          </div>
        </div>
      </div>

      {/* CONTROL BAR (Search, Filters, Sort) */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm transition-colors">
        
        {/* Search */}
        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-red-500 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search courses or tutors..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all shadow-inner"
          />
        </div>

        {/* Filters & Sorting */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          
          {/* Status Filter */}
          <div className="relative flex items-center bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm flex-1 sm:flex-none">
            <div className="pl-3 pr-2 text-slate-400 dark:text-slate-500"><Filter size={14} /></div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-transparent py-2.5 pr-4 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer appearance-none w-full">
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="draft">Drafts Only</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="relative flex items-center bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm flex-1 sm:flex-none">
            <div className="pl-3 pr-2 text-slate-400 dark:text-slate-500"><BookOpen size={14} /></div>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="bg-transparent py-2.5 pr-4 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer appearance-none w-full">
              <option value="all">All Categories</option>
              {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          {/* Sort */}
          <div className="relative flex items-center bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm flex-1 sm:flex-none">
            <div className="pl-3 pr-2 text-slate-400 dark:text-slate-500"><ArrowUpDown size={14} /></div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent py-2.5 pr-4 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer appearance-none w-full">
              <option value="newest">Newest First</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
              <option value="modules-high">Most Modules</option>
            </select>
          </div>

        </div>
      </div>

      {/* TABLE AREA */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-xl shadow-slate-200/10 dark:shadow-none overflow-hidden relative transition-colors">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-black">
                <th className="p-4 pl-6 whitespace-nowrap">Course Intelligence</th>
                <th className="p-4 whitespace-nowrap">Creator</th>
                <th className="p-4 whitespace-nowrap">Metrics</th>
                <th className="p-4 whitespace-nowrap">Status</th>
                <th className="p-4 pr-6 text-right whitespace-nowrap">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {processedCourses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-16 text-center text-slate-500 dark:text-slate-400 font-medium">
                    <AlertCircle size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                    <p className="font-bold text-slate-700 dark:text-slate-300">No courses found matching criteria.</p>
                    <p className="text-xs mt-1">Adjust filters or search parameters.</p>
                  </td>
                </tr>
              ) : (
                processedCourses.map(course => (
                  <tr key={course._id} className="transition-all duration-200 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 group">
                    
                    {/* COURSE DETAILS */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-4">
                        <div className="relative shrink-0">
                          <img src={course.thumbnail} alt="thumb" className="w-20 h-14 object-cover rounded-lg shadow-sm border border-slate-200 dark:border-slate-700" />
                          <div className="absolute inset-0 bg-slate-900/10 dark:bg-slate-900/40 rounded-lg"></div>
                        </div>
                        <div>
                          <p className="font-black text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">{course.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">{course.category}</span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1 font-medium"><Clock size={10}/> {new Date(course.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* CREATOR */}
                    <td className="p-4">
                      <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">{course.tutor?.name || 'Unknown'}</p>
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">{course.tutor?.email || 'N/A'}</p>
                    </td>

                    {/* METRICS */}
                    <td className="p-4">
                      <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                        <IndianRupee size={12} strokeWidth={3}/> {course.price === 0 ? "Free" : course.price}
                      </p>
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                        <BookOpen size={12} className="text-indigo-400"/> {course.lessons?.length || 0} Modules
                      </p>
                    </td>

                    {/* STATUS */}
                    <td className="p-4">
                      {course.isActive ? (
                        <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded-md text-[9px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1.5 w-fit">
                          <CheckCircle2 size={10} strokeWidth={3}/> Active
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20 rounded-md text-[9px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1.5 w-fit">
                          <Ban size={10} strokeWidth={3}/> Draft
                        </span>
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Link 
                          to={`/admin/course/${course._id}/preview`} 
                          className="p-2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 border border-transparent hover:border-indigo-200 dark:hover:border-indigo-500/30 rounded-xl transition-all shadow-sm bg-white dark:bg-slate-900" 
                          title="Audit Content"
                        >
                          <ExternalLink size={16} />
                        </Link>
                        
                        <button 
                          onClick={() => handleDeleteCourse(course._id, course.title)} 
                          className="p-2 text-rose-400 dark:text-rose-500 hover:text-white hover:bg-rose-500 dark:hover:bg-rose-600 border border-transparent hover:border-rose-600 dark:hover:border-rose-500 rounded-xl transition-all shadow-sm bg-white dark:bg-slate-900" 
                          title="Terminate Course"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default ContentModeration;