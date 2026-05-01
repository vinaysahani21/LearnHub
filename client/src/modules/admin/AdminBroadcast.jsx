import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Megaphone, Send, Loader2, Users, AlertCircle, 
  CheckCircle2, ChevronDown, Eye, History, BellRing, Clock, ShieldAlert
} from 'lucide-react';
import api from '../../api/api';

const AdminBroadcast = () => {
  // Tabs: 'compose' or 'history'
  const [activeTab, setActiveTab] = useState('compose');
  
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    targetRole: 'all',
    priority: 'normal' // 'normal' or 'urgent'
  });
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, text: '' });
  
  // History State
  const [broadcastHistory, setBroadcastHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (status.type) setStatus({ type: null, text: '' });
  };

  const handlePriorityToggle = (level) => {
    setFormData({ ...formData, priority: level });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, text: '' });

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const res = await api.post(`/admin/broadcast`, formData, config);
      
      setStatus({ type: 'success', text: res.data.message || 'Broadcast deployed successfully.' });
      setFormData({ title: '', message: '', targetRole: 'all', priority: 'normal' });
      fetchHistory(); // Refresh history quietly
    } catch (err) {
      console.error(err);
      setStatus({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to deploy broadcast. Check server connection.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // Note: You will need to add this endpoint to your backend!
      const res = await api.get(`/admin/broadcast-history`, config);
      setBroadcastHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch broadcast history", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'history' && broadcastHistory.length === 0) {
      fetchHistory();
    }
  }, [activeTab]);

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500 space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200/60 dark:border-slate-800/60 pb-6 transition-colors">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            Global Broadcast <Megaphone className="text-red-500" size={28} />
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            Push real-time alerts, maintenance notices, and announcements platform-wide.
          </p>
        </div>
      </div>

      {/* CUSTOM TABS */}
      <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-2xl w-fit border border-slate-200 dark:border-slate-700/50 transition-colors">
        <button
          onClick={() => setActiveTab('compose')}
          className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
            activeTab === 'compose'
              ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-sm border border-slate-200/50 dark:border-slate-600'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <Send size={16} /> Compose
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-sm border border-slate-200/50 dark:border-slate-600'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <History size={16} /> History
        </button>
      </div>

      {/* COMPOSE TAB */}
      {activeTab === 'compose' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* LEFT: FORM COMPONENT */}
          <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-xl shadow-slate-200/10 dark:shadow-none overflow-hidden transition-colors">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50">
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Deploy Configuration</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
              {/* Status Messages */}
              {status.type === 'success' && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-2xl border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <p className="text-sm font-bold">{status.text}</p>
                </div>
              )}
              {status.type === 'error' && (
                <div className="p-4 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 rounded-2xl border border-rose-200 dark:border-rose-500/20 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-sm font-bold">{status.text}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Target Audience</label>
                  <div className="relative group">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-red-500 transition-colors w-4 h-4 pointer-events-none" />
                    <select 
                      name="targetRole" 
                      value={formData.targetRole} 
                      onChange={handleChange}
                      className="w-full pl-11 pr-5 py-4 appearance-none bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all cursor-pointer shadow-inner"
                    >
                      <option value="all">Entire Platform (All Users)</option>
                      <option value="student">Students Only</option>
                      <option value="tutor">Tutors / Instructors Only</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Priority Level</label>
                  <div className="flex bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner">
                    <button type="button" onClick={() => handlePriorityToggle('normal')} className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex justify-center items-center gap-1.5 ${formData.priority === 'normal' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-600' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}>
                       <BellRing size={14}/> Standard
                    </button>
                    <button type="button" onClick={() => handlePriorityToggle('urgent')} className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex justify-center items-center gap-1.5 ${formData.priority === 'urgent' ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm border border-slate-200 dark:border-slate-600' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}>
                       <AlertCircle size={14}/> Urgent
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Notification Title</label>
                <input 
                  type="text" 
                  name="title" 
                  required
                  maxLength={50}
                  value={formData.title} 
                  onChange={handleChange}
                  placeholder="e.g., Scheduled Maintenance Downtime"
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all shadow-inner placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                   <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Message Content</label>
                   <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">{formData.message.length}/200</span>
                </div>
                <textarea 
                  name="message" 
                  required
                  rows="4" 
                  maxLength={200}
                  value={formData.message} 
                  onChange={handleChange}
                  placeholder="Draft your announcement here..."
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all resize-none leading-relaxed shadow-inner placeholder-slate-400 dark:placeholder-slate-500"
                ></textarea>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button 
                  type="submit" 
                  disabled={loading || !formData.title.trim() || !formData.message.trim()}
                  className="px-8 py-4 bg-[#0a0f1c] dark:bg-red-600 hover:bg-slate-800 dark:hover:bg-red-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-none transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95 group"
                >
                  {loading ? (
                    <><Loader2 className="animate-spin w-4 h-4" /> Deploying...</>
                  ) : (
                    <><Send size={16} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" /> Deploy Broadcast</>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: LIVE PREVIEW WIDGET */}
          <div className="xl:col-span-1">
             <div className="sticky top-28 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200/60 dark:border-slate-800 p-6">
                <div className="flex items-center gap-2 mb-6">
                   <Eye className="text-slate-400 dark:text-slate-500" size={18} />
                   <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Live Preview</h3>
                </div>
                
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-widest text-center">How users will see this</p>
                
                {/* Simulated Notification Dropdown Item */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg flex gap-4 transition-all">
                  <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                     formData.priority === 'urgent' 
                        ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-500 border-rose-100 dark:border-rose-500/20' 
                        : 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 border-indigo-100 dark:border-indigo-500/20'
                  }`}>
                    {formData.priority === 'urgent' ? <ShieldAlert size={14} /> : <BellRing size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                       {formData.title || "Notification Title"}
                    </h4>
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1 leading-relaxed break-words">
                       {formData.message || "Draft your message to see the preview..."}
                    </p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-2">Just Now</p>
                  </div>
                </div>
             </div>
          </div>

        </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === 'history' && (
         <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-xl shadow-slate-200/10 dark:shadow-none overflow-hidden transition-colors">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Deployment Log</h2>
              <button onClick={fetchHistory} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><History size={18}/></button>
            </div>
            
            <div className="p-6">
               {loadingHistory ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                     <Loader2 className="w-8 h-8 animate-spin text-red-500 mb-4" />
                     <p className="text-xs font-bold uppercase tracking-widest">Retrieving Logs...</p>
                  </div>
               ) : broadcastHistory.length === 0 ? (
                  <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                     <Megaphone className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                     <p className="font-bold text-slate-500 dark:text-slate-400">No broadcasts deployed yet.</p>
                     <p className="font-bold text-slate-500 dark:text-slate-400">(Working on this feature!)</p>
                     <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Check back later for updates.</p>
                  </div>
               ) : (
                  <div className="space-y-4">
                     {broadcastHistory.map((item, index) => (
                        <div key={index} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                           <div className="flex items-start gap-4">
                              <div className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl">
                                 <Megaphone size={18} />
                              </div>
                              <div>
                                 <h4 className="font-black text-slate-900 dark:text-white text-sm">{item.title}</h4>
                                 <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">{item.message}</p>
                              </div>
                           </div>
                           <div className="flex flex-row md:flex-col items-center md:items-end gap-3 md:gap-1.5 pl-14 md:pl-0">
                              <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md text-[9px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                                 Target: {item.targetRole || 'All'}
                              </span>
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                                 <Clock size={10} /> {new Date(item.createdAt).toLocaleDateString()}
                              </p>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </div>
      )}

    </div>
  );
};

export default AdminBroadcast;