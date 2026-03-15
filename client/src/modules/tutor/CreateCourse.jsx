import { Upload, X, Loader2, Image as ImageIcon, BookOpen, Tag, IndianRupee, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Dynamic Category State
  const [categories, setCategories] = useState([]);
  const [fetchingCats, setFetchingCats] = useState(true);

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '' // Will be set dynamically when categories load
  });

  // Fetch Categories on Mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/categories');
        setCategories(res.data);
        
        // Auto-select the first category if available
        if (res.data.length > 0) {
          setFormData(prev => ({ ...prev, category: res.data[0].name }));
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setFetchingCats(false);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setThumbnailFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category) return alert("Please select a category.");
    
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('category', formData.category);
      
      if (thumbnailFile) {
        data.append('thumbnail', thumbnailFile);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      await axios.post('http://localhost:5000/api/courses', data, config);
      navigate(-1); 
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            New Project <Sparkles className="text-indigo-500" size={24} />
          </h1>
          <p className="text-slate-500 font-medium mt-1">Initialize a new course workspace in your studio.</p>
        </div>
        <button onClick={() => navigate(-1)} className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl shadow-slate-200/20 border border-slate-200/60 overflow-hidden">
        
        <div className="p-8 space-y-8">
          {/* TITLE INPUT */}
          <div>
            <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
              <BookOpen size={14}/> Course Title
            </label>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Advanced React Architecture 2026" 
              required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:font-medium placeholder:text-slate-300"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* DYNAMIC CATEGORY SELECT */}
            <div>
              <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                <Tag size={14}/> Category
              </label>
              <div className="relative">
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={fetchingCats || categories.length === 0}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer disabled:opacity-70"
                >
                  {fetchingCats ? (
                    <option value="">Syncing tags...</option>
                  ) : categories.length === 0 ? (
                    <option value="">No categories available</option>
                  ) : (
                    categories.map(cat => (
                      <option key={cat._id} value={cat.name}>{cat.name}</option>
                    ))
                  )}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  {fetchingCats ? <Loader2 size={16} className="animate-spin" /> : '▼'}
                </div>
              </div>
            </div>

            {/* PRICE INPUT */}
            <div>
              <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                <IndianRupee size={14}/> Pricing Strategy
              </label>
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</div>
                <input 
                  type="number" 
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="499" 
                  required
                  min="0"
                  className="w-full pl-10 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-slate-900 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all placeholder:font-medium placeholder:text-slate-300"
                />
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Syllabus / Description</label>
            <textarea 
              name="description"
              rows="4" 
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none placeholder:text-slate-300"
              placeholder="Briefly describe what students will learn and achieve by taking this course..."
            ></textarea>
          </div>

          {/* THUMBNAIL UPLOAD ZONE */}
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Cover Art (Thumbnail)</label>
            <div className="relative group mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-slate-200 border-dashed rounded-3xl hover:bg-indigo-50 hover:border-indigo-300 transition-all cursor-pointer overflow-hidden bg-slate-50/50">
              
              {thumbnailFile ? (
                <div className="space-y-2 text-center z-10">
                  <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-sm">
                    <ImageIcon className="h-8 w-8 text-emerald-600" />
                  </div>
                  <p className="text-sm text-emerald-700 font-black">Asset Secured</p>
                  <p className="text-xs font-bold text-slate-500 truncate max-w-xs px-4 py-1.5 bg-white rounded-lg border border-slate-200 inline-block shadow-sm">
                    {thumbnailFile.name}
                  </p>
                </div>
              ) : (
                <div className="space-y-2 text-center z-10">
                  <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 border border-slate-100 shadow-sm group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all text-slate-300">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div className="flex text-sm text-slate-600 justify-center">
                    <span className="font-bold text-indigo-600 group-hover:text-indigo-700">Click to upload</span>
                    <span className="ml-1 font-medium">or drag and drop</span>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">16:9 aspect ratio recommended (Max 5MB)</p>
                </div>
              )}
              
              <input id="thumbnail-upload" name="thumbnail" type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" accept="image/*" onChange={handleFileChange} required />
            </div>
          </div>
        </div>

        {/* SUBMIT FOOTER */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button 
            type="submit" 
            disabled={loading || fetchingCats}
            className="px-8 py-3.5 bg-[#0a0f1c] hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-slate-900/10 transition-all flex items-center gap-3 disabled:opacity-70 active:scale-95"
          >
            {loading ? (
              <><Loader2 className="animate-spin w-4 h-4 text-indigo-400" /> Initializing Workspace...</>
            ) : (
              <>Create Course Space <BookOpen size={16} /></>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default CreateCourse;