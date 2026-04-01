import { useEffect, useState } from 'react';
import axios from 'axios';
import { Tags, Plus, Trash2, BookOpen, Hexagon, ArrowRight, Search, Hash } from 'lucide-react';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/categories');
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setAdding(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/admin/categories', 
        { name, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setCategories([...categories, res.data].sort((a, b) => a.name.localeCompare(b.name)));
      setName('');
      setDescription('');
      setSearchTerm(''); // Clear search so they can see the new category
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add category.");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id, catName) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${catName}"?`)) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(categories.filter(c => c._id !== id));
    } catch (err) {
      alert("Failed to delete category.");
    }
  };

  // 🔥 NEW: Live Search Filter
  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4 transition-colors">
        <div className="relative flex h-10 w-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-10 w-10 bg-red-500"></span>
        </div>
        <p className="font-bold text-slate-400 dark:text-slate-500 animate-pulse tracking-widest uppercase text-xs">Loading Categories...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200/60 dark:border-slate-800/60 pb-6 transition-colors">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            Category Manager <Tags className="text-red-500" size={28} />
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Define and organize the official course topics.</p>
        </div>
        <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-xl text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2 transition-colors">
          <Hexagon size={14} className="text-red-500" /> {categories.length} Active Tags
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: MODERN WIDGET FORM (Takes up 4 cols) */}
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none sticky top-28 overflow-hidden transition-colors">
            
            <div className="bg-[#0a0f1c] dark:bg-[#050811] p-6 text-white relative overflow-hidden transition-colors">
              <div className="absolute -right-4 -top-4 opacity-10"><Tags size={100} /></div>
              <h2 className="font-black text-lg relative z-10 flex items-center gap-2">
                <Plus size={18} className="text-red-500"/> Create New Tag
              </h2>
              <p className="text-xs text-slate-400 mt-1 relative z-10">Expand the platform's curriculum.</p>
            </div>

            <form onSubmit={handleAddCategory} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Category Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Artificial Intelligence"
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-red-500/50 focus:border-red-500 outline-none transition-all placeholder:font-medium placeholder:text-slate-400 dark:placeholder-slate-500 shadow-inner"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Short Description (Optional)</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What will students learn here?"
                  rows="3"
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-red-500/50 focus:border-red-500 outline-none transition-all resize-none placeholder:text-slate-400 dark:placeholder-slate-500 shadow-inner"
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={adding || !name.trim()}
                className="w-full bg-[#0a0f1c] hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500 text-white font-black text-xs uppercase tracking-widest py-4 rounded-xl transition-all flex justify-center items-center gap-2 disabled:opacity-50 shadow-xl shadow-slate-900/10 dark:shadow-none active:scale-[0.98]"
              >
                {adding ? (
                  <div className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Generating...</div>
                ) : (
                  <>Publish Category <ArrowRight size={16} /></>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: CATEGORY GRID & SEARCH (Takes up 8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* 🔥 NEW: Live Search Bar */}
          {categories.length > 0 && (
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-red-500 transition-colors w-5 h-5" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-5 py-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all shadow-sm"
              />
            </div>
          )}

          {categories.length === 0 ? (
            <div className="bg-slate-50/50 dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-12 flex flex-col items-center justify-center text-center transition-colors">
              <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm mb-4 border border-slate-100 dark:border-slate-700">
                <BookOpen size={24} className="text-slate-400 dark:text-slate-500" />
              </div>
              <p className="font-bold text-slate-900 dark:text-white">No categories found.</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xs">Use the widget on the left to start adding official topics for your tutors.</p>
            </div>
          ) : filteredCategories.length === 0 ? (
             <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed transition-colors">
               <Search className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
               <p className="text-slate-500 dark:text-slate-400 font-bold">No categories match "{searchTerm}".</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCategories.map(cat => (
                <div key={cat._id} className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-5 hover:border-red-300 dark:hover:border-red-500/50 hover:shadow-md dark:hover:shadow-none transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[130px]">
                  
                  {/* Subtle Background Accent */}
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-red-50 dark:bg-red-500/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>

                  <div className="flex items-start gap-4 z-10">
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800 group-hover:bg-red-50 dark:group-hover:bg-red-500/10 group-hover:text-red-600 dark:group-hover:text-red-400 text-slate-400 dark:text-slate-500 rounded-xl transition-colors border border-slate-100 dark:border-slate-700 group-hover:border-red-100 dark:group-hover:border-red-500/20">
                      <Hash size={20} />
                    </div>
                    <div className="flex-1 pr-6 flex flex-col justify-between">
                      <div>
                        <h3 className="font-black text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-1">{cat.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed font-medium">
                          {cat.description || "No description provided."}
                        </p>
                      </div>
                      
                      {/* 🔥 NEW: Dynamic Course Count Badge 🔥 */}
                      <div className="mt-4 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                        <BookOpen size={12} className={cat.courseCount > 0 ? "text-red-500" : "text-slate-400"} />
                        {cat.courseCount === 1 ? '1 Linked Course' : `${cat.courseCount || 0} Linked Courses`}
                      </div>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button 
                    onClick={() => handleDelete(cat._id, cat.name)}
                    className="absolute top-4 right-4 p-2 text-slate-300 dark:text-slate-600 hover:text-white hover:bg-red-500 dark:hover:bg-red-600 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-sm border border-transparent hover:border-red-600 dark:hover:border-red-500" 
                    title="Delete Category"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CategoryManagement;