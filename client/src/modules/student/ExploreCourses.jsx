import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Search, Loader2, Compass, Filter, X, SlidersHorizontal } from 'lucide-react';
import CourseCard from '../../common/CourseCard'; 

const ExploreCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- FILTER STATES ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const CATEGORIES = ["All", "Web Development", "Data Science", "Mobile App Dev", "UI/UX Design"];

  // 1. Fetch Data
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/courses');
        setCourses(res.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // 2. Filter & Sort Logic
  const filteredAndSortedCourses = useMemo(() => {
    let result = [...courses];

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(course => 
        course.title.toLowerCase().includes(lowerTerm) || 
        course.category.toLowerCase().includes(lowerTerm) ||
        (course.tutor?.name || '').toLowerCase().includes(lowerTerm)
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter(course => course.category === selectedCategory);
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [courses, searchTerm, selectedCategory, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSortBy('newest');
  };

  return (
    <div className="max-w-7xl mx-auto transition-colors duration-300">
      
      {/* HEADER & SEARCH */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Compass className="text-indigo-600 dark:text-indigo-400" size={32} /> Explore Courses
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Showing {filteredAndSortedCourses.length} courses based on your preferences.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full lg:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all shadow-sm"
            placeholder="Search by title, topic, or instructor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* CONTROLS BAR (Categories + Sort) */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-center gap-4 transition-colors">
        
        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
          <Filter size={20} className="text-slate-400 dark:text-slate-500 shrink-0 mr-2" />
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat 
                  ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-md shadow-indigo-200 dark:shadow-none' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <SlidersHorizontal size={20} className="text-slate-400 dark:text-slate-500 shrink-0" />
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full md:w-48 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none transition-all"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* RESULTS GRID */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="animate-spin text-indigo-600 dark:text-indigo-400 w-10 h-10 mb-4" />
          <p className="text-slate-500 dark:text-slate-400 font-bold">Loading amazing courses...</p>
        </div>
      ) : (
        <>
          {filteredAndSortedCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAndSortedCourses.map(course => (
                <div key={course._id} className="transform hover:-translate-y-1 transition-transform duration-300">
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          ) : (
            /* EMPTY STATE */
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 transition-colors">
              <div className="bg-slate-50 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-slate-400 dark:text-slate-600" size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No courses found</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                We couldn't find any courses matching your current filters. Try adjusting your search or category.
              </p>
              <button 
                onClick={clearFilters}
                className="px-6 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg font-bold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExploreCourses;