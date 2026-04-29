import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Settings as SettingsIcon, Save, Power, UserPlus, 
  Percent, Loader2, AlertTriangle, CheckCircle2,
  ShieldCheck, Globe, Zap, AlertCircle, FileCheck, Mail
} from 'lucide-react';
import api from '../../api/api';

// const AlertTriangle = (props) => (
//   <svg viewBox="0 0 24 24" fill="none" {...props}>
//     <path d="M12 2L22 20H2L12 2Z" fill="currentColor" />
//     <path d="M12 8V12" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
//     <path d="M12 16H12.01" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
//   </svg>
// );

const PlatformSettings = () => {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    allowTutorRegistrations: true,
    platformFeePercentage: 10,
    autoApproveCourses: false, 
    supportEmail: 'support@learnhub.com' 
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/admin/settings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Merge fetched settings with our defaults in case backend doesn't have the new fields yet
      setSettings(prev => ({ ...prev, ...res.data }));
    } catch (err) {
      console.error("Failed to fetch settings", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const token = localStorage.getItem('token');
      await api.put('/admin/settings', settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ type: 'success', text: 'Global configuration synced successfully.' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to sync platform configuration.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4 transition-colors">
        <div className="relative flex h-10 w-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-10 w-10 bg-red-500"></span>
        </div>
        <p className="font-bold text-slate-400 dark:text-slate-500 animate-pulse tracking-widest uppercase text-xs">Fetching System Config...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200/60 dark:border-slate-800/60 pb-8 transition-colors">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            Platform Configuration <SettingsIcon className="text-red-500" size={28} />
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 italic">You are modifying the core behavioral DNA of the application.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            {/* Live Status Indicator */}
            <div className={`px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 border shadow-sm transition-all w-full sm:w-auto ${
                settings.maintenanceMode 
                ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400' 
                : 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
            }`}>
                {settings.maintenanceMode ? <AlertCircle size={16} className="animate-pulse" /> : <Globe size={16} className="animate-spin-slow" />}
                <span className="text-[10px] font-black uppercase tracking-widest">
                    {settings.maintenanceMode ? 'Platform Offline' : 'Platform Live'}
                </span>
            </div>

            <button 
                onClick={handleSave}
                disabled={saving}
                className="w-full sm:w-auto flex justify-center items-center gap-2 bg-[#0a0f1c] hover:bg-slate-800 dark:bg-red-600 dark:hover:bg-red-500 text-white px-8 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-slate-900/20 dark:shadow-none transition-all active:scale-95 disabled:opacity-50"
            >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {saving ? 'Syncing...' : 'Push Changes'}
            </button>
        </div>
      </div>

      {/* FEEDBACK TOAST */}
      {message && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 font-bold text-sm shadow-xl animate-in slide-in-from-top-4 duration-300 border ${
            message.type === 'success' 
            ? 'bg-emerald-500 text-white border-emerald-600' 
            : 'bg-rose-500 text-white border-rose-600'
        }`}>
          {message.type === 'success' ? <ShieldCheck size={20} /> : <AlertTriangle size={20} />}
          {message.text}
        </div>
      )}

      {/* CORE TOGGLES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* MAINTENANCE MODE */}
        <div className={`group p-6 lg:p-8 rounded-3xl border transition-all duration-300 ${
            settings.maintenanceMode 
            ? 'bg-rose-50/50 dark:bg-rose-500/5 border-rose-200 dark:border-rose-500/30 shadow-lg shadow-rose-900/5 dark:shadow-none' 
            : 'bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800 hover:border-rose-200 dark:hover:border-rose-500/50 shadow-sm'
        }`}>
          <div className="flex justify-between items-start mb-6">
            <div className={`p-4 rounded-2xl transition-colors shadow-inner ${
                settings.maintenanceMode 
                ? 'bg-rose-500 text-white shadow-rose-500/30' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover:text-rose-500 dark:group-hover:text-rose-400'
            }`}>
              <Power size={24} />
            </div>
            <button 
              onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                settings.maintenanceMode ? 'bg-rose-500' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform duration-300 ${
                settings.maintenanceMode ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>
          <h3 className="text-lg lg:text-xl font-black text-slate-900 dark:text-white tracking-tight line-clamp-1">Maintenance Protocol</h3>
          <p className="text-xs lg:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Emergency lockout. While active, only users with <span className="font-bold text-rose-600 dark:text-rose-400 uppercase text-[10px]">Root Access</span> can interact.
          </p>
        </div>

        {/* TUTOR REGISTRATION */}
        <div className={`group p-6 lg:p-8 rounded-3xl border transition-all duration-300 ${
            !settings.allowTutorRegistrations 
            ? 'bg-orange-50/50 dark:bg-orange-500/5 border-orange-200 dark:border-orange-500/30 shadow-inner' 
            : 'bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-500/50 shadow-sm'
        }`}>
          <div className="flex justify-between items-start mb-6">
            <div className={`p-4 rounded-2xl transition-colors shadow-inner ${
                settings.allowTutorRegistrations 
                ? 'bg-emerald-500 text-white shadow-emerald-500/30' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover:text-orange-500 dark:group-hover:text-orange-400'
            }`}>
              <UserPlus size={24} />
            </div>
            <button 
              onClick={() => setSettings({...settings, allowTutorRegistrations: !settings.allowTutorRegistrations})}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                settings.allowTutorRegistrations ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform duration-300 ${
                settings.allowTutorRegistrations ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>
          <h3 className="text-lg lg:text-xl font-black text-slate-900 dark:text-white tracking-tight line-clamp-1">Onboarding Gateway</h3>
          <p className="text-xs lg:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Control the influx of educators. Disable to move to an <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase text-[10px]">Invite Only</span> model.
          </p>
        </div>

        {/* CONTENT AUTO-APPROVAL (NEW) */}
        <div className={`group p-6 lg:p-8 rounded-3xl border transition-all duration-300 ${
            settings.autoApproveCourses 
            ? 'bg-blue-50/50 dark:bg-blue-500/5 border-blue-200 dark:border-blue-500/30 shadow-inner' 
            : 'bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-500/50 shadow-sm'
        }`}>
          <div className="flex justify-between items-start mb-6">
            <div className={`p-4 rounded-2xl transition-colors shadow-inner ${
                settings.autoApproveCourses 
                ? 'bg-blue-500 text-white shadow-blue-500/30' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400'
            }`}>
              <FileCheck size={24} />
            </div>
            <button 
              onClick={() => setSettings({...settings, autoApproveCourses: !settings.autoApproveCourses})}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                settings.autoApproveCourses ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform duration-300 ${
                settings.autoApproveCourses ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>
          <h3 className="text-lg lg:text-xl font-black text-slate-900 dark:text-white tracking-tight line-clamp-1">Content Auto-Approval</h3>
          <p className="text-xs lg:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            If disabled, new courses are set to <span className="font-bold text-orange-500 dark:text-orange-400 uppercase text-[10px]">Draft</span> until manually verified by moderation.
          </p>
        </div>

      </div>

      {/* INPUT SETTINGS WIDGETS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* PLATFORM FEE WIDGET */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col justify-between group hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all">
          <div className="flex gap-4 items-center mb-6 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-inner group-hover:scale-110 transition-transform duration-500">
              <Percent size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Revenue Share</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[250px]">The percentage cut retained from every successful enrollment.</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-inner">
            <div className="flex items-center gap-2 flex-1 pl-2">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Rate:</span>
                <input 
                  type="number" 
                  min="0" 
                  max="100"
                  value={settings.platformFeePercentage}
                  onChange={(e) => setSettings({...settings, platformFeePercentage: Number(e.target.value)})}
                  className="w-20 text-center font-black text-2xl text-indigo-600 dark:text-indigo-400 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500/20 rounded-lg transition-all"
                />
                <span className="text-slate-300 dark:text-slate-600 font-black text-2xl">%</span>
            </div>
            <div className="bg-indigo-600 dark:bg-indigo-500 p-2.5 rounded-xl text-white shadow-md shadow-indigo-200 dark:shadow-none">
                <Zap size={18} />
            </div>
          </div>
        </div>

        {/* SUPPORT ROUTING (NEW) */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col justify-between group hover:border-red-200 dark:hover:border-red-500/30 transition-all">
          <div className="flex gap-4 items-center mb-6 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 shadow-inner group-hover:scale-110 transition-transform duration-500">
              <Mail size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Global Support Desk</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[250px]">The public-facing email address for student and technical inquiries.</p>
            </div>
          </div>
          
          <div className="flex flex-col bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-inner gap-2">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Routing Email Address:</span>
            <input 
              type="email" 
              value={settings.supportEmail}
              onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
              placeholder="support@learnhub.com"
              className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
            />
          </div>
        </div>

      </div>

      {/* FOOTER INFO */}
      {/* <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 transition-colors">
          <AlertTriangle size={18} className="text-slate-400 dark:text-slate-500 shrink-0" />
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.1em] leading-relaxed">
             System Note: State modifications execute immediately. Ensure your backend <code className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-red-500 dark:text-red-400">Settings</code> MongoDB Schema is configured to accept <code className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-indigo-500 dark:text-indigo-400">autoApproveCourses</code> and <code className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-emerald-600 dark:text-emerald-400">supportEmail</code> payloads before pushing changes.
          </p>
      </div> */}

    </div>
  );
};

export default PlatformSettings;