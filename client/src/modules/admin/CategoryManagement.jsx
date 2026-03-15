import { useEffect, useState } from 'react';
import axios from 'axios';
import { Tags, Plus, Trash2, BookOpen, Hexagon, ArrowRight } from 'lucide-react';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
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
      
      // Add to UI instantly and clear form
      setCategories([...categories, res.data].sort((a, b) => a.name.localeCompare(b.name)));
      setName('');
      setDescription('');
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

  // The Signature Red Pulse Loader
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <div className="relative flex h-10 w-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-10 w-10 bg-red-500"></span>
        </div>
        <p className="font-bold text-slate-400 animate-pulse tracking-widest uppercase text-xs">Loading Categories...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex justify-between items-end border-b border-slate-200/60 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Category Manager <Tags className="text-indigo-500" size={28} />
          </h1>
          <p className="text-slate-500 font-medium mt-1">Define and organize the official course topics.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl text-xs font-black text-slate-500 uppercase tracking-widest border border-slate-200 shadow-sm flex items-center gap-2">
          <Hexagon size={14} className="text-indigo-500" /> {categories.length} Active Tags
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: MODERN WIDGET FORM (Takes up 4 cols) */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-200/20 sticky top-28 overflow-hidden">
            
            <div className="bg-[#0a0f1c] p-6 text-white relative overflow-hidden">
              <div className="absolute -right-4 -top-4 opacity-10"><Tags size={100} /></div>
              <h2 className="font-black text-lg relative z-10 flex items-center gap-2">
                <Plus size={18} className="text-indigo-400"/> Create New Tag
              </h2>
              <p className="text-xs text-slate-400 mt-1 relative z-10">Expand the platform's curriculum.</p>
            </div>

            <form onSubmit={handleAddCategory} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Category Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Artificial Intelligence"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all placeholder:font-medium placeholder:text-slate-400"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Short Description (Optional)</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What will students learn here?"
                  rows="3"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all resize-none placeholder:text-slate-400"
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={adding || !name.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3.5 rounded-xl transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:hover:bg-indigo-600 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 active:scale-[0.98]"
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

        {/* RIGHT COLUMN: CATEGORY GRID (Takes up 8 cols) */}
        <div className="lg:col-span-8">
          {categories.length === 0 ? (
            <div className="bg-slate-50/50 border border-dashed border-slate-300 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <BookOpen size={24} className="text-slate-400" />
              </div>
              <p className="font-bold text-slate-900">No categories found.</p>
              <p className="text-sm text-slate-500 mt-1 max-w-xs">Use the widget on the left to start adding official topics for your tutors.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map(cat => (
                <div key={cat._id} className="group bg-white rounded-2xl border border-slate-200/60 p-5 hover:border-indigo-300 hover:shadow-md transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[120px]">
                  
                  {/* Subtle Background Accent */}
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>

                  <div className="flex items-start gap-4 z-10">
                    <div className="p-2.5 bg-slate-50 group-hover:bg-indigo-50 group-hover:text-indigo-600 text-slate-400 rounded-xl transition-colors">
                      <BookOpen size={20} />
                    </div>
                    <div className="flex-1 pr-6">
                      <h3 className="font-black text-slate-900 group-hover:text-indigo-900 transition-colors line-clamp-1">{cat.name}</h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {cat.description || "No description provided."}
                      </p>
                    </div>
                  </div>

                  {/* Absolute positioning for the delete button so it stays out of the way */}
                  <button 
                    onClick={() => handleDelete(cat._id, cat.name)}
                    className="absolute top-4 right-4 p-2 text-slate-300 hover:text-white hover:bg-red-500 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-sm border border-transparent hover:border-red-600" 
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