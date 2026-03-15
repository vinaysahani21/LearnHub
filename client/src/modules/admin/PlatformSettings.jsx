import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Settings as SettingsIcon, Save, Power, UserPlus, 
  Percent, Loader2, AlertTriangle, CheckCircle2,
  ShieldCheck, Globe, Zap, AlertCircle
} from 'lucide-react';

const PlatformSettings = () => {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    allowTutorRegistrations: true,
    platformFeePercentage: 10
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
      const res = await axios.get('http://localhost:5000/api/admin/settings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSettings({
        maintenanceMode: res.data.maintenanceMode,
        allowTutorRegistrations: res.data.allowTutorRegistrations,
        platformFeePercentage: res.data.platformFeePercentage
      });
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
      await axios.put('http://localhost:5000/api/admin/settings', settings, {
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

  // The Signature Red Pulse Loader
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <div className="relative flex h-10 w-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-10 w-10 bg-red-500"></span>
        </div>
        <p className="font-bold text-slate-400 animate-pulse tracking-widest uppercase text-xs">Fetching System Config...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200/60 pb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Platform Configuration <SettingsIcon className="text-indigo-500" size={28} />
          </h1>
          <p className="text-slate-500 font-medium mt-1 italic">You are modifying the core behavioral DNA of the application.</p>
        </div>
        
        <div className="flex items-center gap-3">
            {/* Live Status Indicator */}
            <div className={`px-4 py-2 rounded-xl flex items-center gap-2 border shadow-sm transition-all duration-500 ${settings.maintenanceMode ? 'bg-red-50 border-red-200 text-red-600' : 'bg-emerald-50 border-emerald-200 text-emerald-600'}`}>
                {settings.maintenanceMode ? <AlertCircle size={16} className="animate-pulse" /> : <Globe size={16} className="animate-spin-slow" />}
                <span className="text-[10px] font-black uppercase tracking-widest">
                    {settings.maintenanceMode ? 'Platform Offline' : 'Platform Live'}
                </span>
            </div>

            <button 
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-[#0a0f1c] hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-slate-900/20 transition-all active:scale-95 disabled:opacity-50"
            >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {saving ? 'Syncing...' : 'Push Changes'}
            </button>
        </div>
      </div>

      {/* FEEDBACK TOAST */}
      {message && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 font-bold text-sm shadow-xl animate-in slide-in-from-top-4 duration-300 ${message.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
          {message.type === 'success' ? <ShieldCheck size={20} /> : <AlertTriangle size={20} />}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* MAINTENANCE MODE */}
        <div className={`group p-8 rounded-3xl border transition-all duration-300 ${settings.maintenanceMode ? 'bg-red-50/50 border-red-200 shadow-lg shadow-red-900/5' : 'bg-white border-slate-200/60 hover:border-red-200 shadow-sm'}`}>
          <div className="flex justify-between items-start mb-6">
            <div className={`p-4 rounded-2xl transition-colors ${settings.maintenanceMode ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-slate-100 text-slate-400 group-hover:text-red-500'}`}>
              <Power size={28} />
            </div>
            <button 
              onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
              className={`w-14 h-8 rounded-full p-1 transition-all duration-500 ${settings.maintenanceMode ? 'bg-red-500 justify-end ring-4 ring-red-500/20' : 'bg-slate-200 justify-start'}`}
            >
              <div className="w-6 h-6 bg-white rounded-full shadow-lg"></div>
            </button>
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Maintenance Protocol</h3>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            Emergency lockout. While active, only users with <span className="font-bold text-red-600 uppercase text-[10px]">Root Access</span> can interact with the platform.
          </p>
        </div>

        {/* TUTOR REGISTRATION */}
        <div className={`group p-8 rounded-3xl border transition-all duration-300 ${!settings.allowTutorRegistrations ? 'bg-orange-50/50 border-orange-200' : 'bg-white border-slate-200/60 hover:border-emerald-200 shadow-sm'}`}>
          <div className="flex justify-between items-start mb-6">
            <div className={`p-4 rounded-2xl transition-colors ${settings.allowTutorRegistrations ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-slate-100 text-slate-400 group-hover:text-orange-500'}`}>
              <UserPlus size={28} />
            </div>
            <button 
              onClick={() => setSettings({...settings, allowTutorRegistrations: !settings.allowTutorRegistrations})}
              className={`w-14 h-8 rounded-full p-1 transition-all duration-500 ${settings.allowTutorRegistrations ? 'bg-emerald-500 justify-end ring-4 ring-emerald-500/20' : 'bg-slate-200 justify-start'}`}
            >
              <div className="w-6 h-6 bg-white rounded-full shadow-lg"></div>
            </button>
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Onboarding Gateway</h3>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            Control the influx of educators. Disable this to move to an <span className="font-bold text-emerald-600 uppercase text-[10px]">Invite Only</span> tutor recruitment model.
          </p>
        </div>

        {/* PLATFORM FEE WIDGET (FULL WIDTH) */}
        <div className="md:col-span-2 bg-white p-10 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-indigo-200 transition-all">
          <div className="flex gap-6 items-center">
            <div className="p-5 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform duration-500">
              <Percent size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Revenue Share Protocol</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm">Define the percentage cut the platform retains from every successful course enrollment.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-inner">
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rate:</span>
                <input 
                  type="number" 
                  min="0" 
                  max="100"
                  value={settings.platformFeePercentage}
                  onChange={(e) => setSettings({...settings, platformFeePercentage: Number(e.target.value)})}
                  className="w-24 text-center font-black text-3xl text-indigo-600 bg-transparent outline-none"
                />
                <span className="text-slate-300 font-black text-2xl">%</span>
            </div>
            <div className="w-px h-10 bg-slate-200 mx-2"></div>
            <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-md shadow-indigo-200">
                <Zap size={20} />
            </div>
          </div>
        </div>

      </div>

      {/* FOOTER INFO */}
      <div className="p-6 bg-slate-100 rounded-2xl border border-slate-200 flex items-center gap-3 opacity-60">
          <AlertTriangle size={18} className="text-slate-500" />
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em]">
             Note: Changes made here propagate instantly to all active client sessions on the next heartbeat.
          </p>
      </div>

    </div>
  );
};

export default PlatformSettings;