import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Search, Loader2, Compass, Filter, X, SlidersHorizontal, 
  Play, Star, ChevronRight, Zap, IndianRupee
} from 'lucide-react';
import CourseCard from '../../common/CourseCard'; // Assuming you have this!

const ExploreCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- FILTER STATES ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All'); // All, Free, Paid
  const [sortBy, setSortBy] = useState('newest');

  // 1. Fetch Data
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Fetching only active/published courses (Assuming backend handles this, or we filter here)
        const res = await axios.get('http://localhost:5000/api/courses');
        const activeCourses = res.data.filter(c => c.isActive !== false);
        setCourses(activeCourses);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Extract Dynamic Categories based on fetched courses
  const DYNAMIC_CATEGORIES = useMemo(() => {
    const cats = new Set(courses.map(c => c.category).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, [courses]);

  // 2. Filter & Sort Logic
  const filteredAndSortedCourses = useMemo(() => {
    let result = [...courses];

    // Search
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(course => 
        course.title?.toLowerCase().includes(lowerTerm) || 
        course.category?.toLowerCase().includes(lowerTerm) ||
        (course.tutor?.name || '').toLowerCase().includes(lowerTerm)
      );
    }

    // Category
    if (selectedCategory !== 'All') {
      result = result.filter(course => course.category === selectedCategory);
    }

    // Price
    if (priceFilter === 'Free') {
      result = result.filter(course => !course.price || course.price === 0);
    } else if (priceFilter === 'Premium') {
      result = result.filter(course => course.price > 0);
    }

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'popular') {
      result.sort((a, b) => (b.enrolledStudents?.length || 0) - (a.enrolledStudents?.length || 0));
    }

    return result;
  }, [courses, searchTerm, selectedCategory, priceFilter, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setPriceFilter('All');
    setSortBy('newest');
  };

  // Feature the newest/most popular course that matches the current filters
  const featuredCourse = filteredAndSortedCourses.length > 0 ? filteredAndSortedCourses[0] : null;
  const displayGrid = filteredAndSortedCourses.slice(1); // The rest go in the grid

  // Signature Sky Blue Loader
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <div className="relative flex h-10 w-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-10 w-10 bg-sky-500"></span>
        </div>
        <p className="font-bold text-slate-400 animate-pulse tracking-widest uppercase text-xs">Curating Catalog...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">
      
      {/* HEADER & SEARCH */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-slate-200 dark:border-slate-800/50 pb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            Explore <Compass className="text-sky-500" size={32} />
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            Discover {courses.length} world-class courses designed to accelerate your career.
          </p>
        </div>

        {/* Cinematic Search Bar */}
        <div className="relative w-full lg:w-[400px] group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-10 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 font-bold transition-all shadow-lg shadow-slate-200/20 dark:shadow-none"
            placeholder="What do you want to learn?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* CONTROLS BAR (Categories + Sort) */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col xl:flex-row justify-between items-center gap-4 transition-colors">
        
        {/* Dynamic Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto w-full xl:w-auto pb-2 xl:pb-0 custom-scrollbar">
          <Filter size={18} className="text-slate-400 shrink-0 mx-2" />
          {DYNAMIC_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                selectedCategory === cat 
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20 ring-2 ring-sky-500/50 ring-offset-2 dark:ring-offset-slate-900' 
                  : 'bg-slate-50 dark:bg-slate-800/50 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Right Side Filters */}
        <div className="flex items-center gap-3 w-full xl:w-auto overflow-x-auto custom-scrollbar pb-2 xl:pb-0">
          
          {/* Price Toggle */}
          <div className="flex bg-slate-50 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
            {['All', 'Free', 'Premium'].map(price => (
              <button
                key={price}
                onClick={() => setPriceFilter(price)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  priceFilter === price 
                    ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {price}
              </button>
            ))}
          </div>

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 shrink-0 mx-1"></div>

          {/* Sort Dropdown */}
          <div className="relative shrink-0">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="newest">Newest Releases</option>
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
          </div>
        </div>
      </div>

      {/* RESULTS AREA */}
      {filteredAndSortedCourses.length === 0 ? (
        /* EMPTY STATE */
        <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 transition-colors shadow-sm">
          <div className="bg-sky-50 dark:bg-sky-500/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-sky-100 dark:border-sky-500/20">
            <Search className="text-sky-500" size={40} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">No courses found</h3>
          <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium">
            We couldn't find any courses matching your exact filters. Try broadening your search or exploring a different category.
          </p>
          <button 
            onClick={clearFilters}
            className="px-8 py-3.5 bg-[#0a0f1c] hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10 active:scale-95"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* HERO FEATURED COURSE (Netflix Style) */}
          {featuredCourse && (
            <div className="relative overflow-hidden bg-[#0a0f1c] dark:bg-slate-950 rounded-3xl shadow-2xl border border-slate-800 group flex flex-col md:flex-row">
              {/* Image Side (Left/Top) */}
              <div className="w-full md:w-1/2 relative overflow-hidden">
                <img 
                  src={featuredCourse.thumbnail} 
                  alt={featuredCourse.title} 
                  className="w-full h-full object-cover min-h-[300px] md:min-h-[400px] group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0a0f1c] dark:from-slate-950 via-[#0a0f1c]/80 md:via-[#0a0f1c]/60 to-transparent"></div>
              </div>

              {/* Content Side (Right/Bottom) */}
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative z-10 -mt-20 md:mt-0">
                <div className="flex items-center gap-3 mb-4">
                   <span className="flex items-center gap-1.5 px-3 py-1 bg-sky-500/20 text-sky-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-sky-500/30 backdrop-blur-sm">
                     <Star size={12} className="fill-sky-400" /> Top Pick
                   </span>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{featuredCourse.category}</span>
                </div>
                
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4 group-hover:text-sky-300 transition-colors">
                  {featuredCourse.title}
                </h2>
                
                <p className="text-slate-400 font-medium line-clamp-3 mb-8 text-sm leading-relaxed">
                  {featuredCourse.description}
                </p>
                
                <div className="flex items-center gap-4 mt-auto">
                  <Link 
                    to={`/student/courses/${featuredCourse._id}`}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 text-[#0a0f1c] px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-sky-500/20 active:scale-95"
                  >
                    <Play size={16} className="fill-[#0a0f1c]" /> View Course
                  </Link>
                  <div className="flex items-center text-white font-black text-xl tracking-tighter bg-white/10 px-6 py-3.5 rounded-xl backdrop-blur-sm border border-white/5">
                    <IndianRupee size={20} className="text-emerald-400 mr-1" /> {featuredCourse.price || 'Free'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* GRID FOR THE REST */}
          {displayGrid.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayGrid.map(course => (
                <div key={course._id} className="group h-full">
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default ExploreCourses;