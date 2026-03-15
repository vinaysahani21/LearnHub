import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun, Monitor, Bell, Palette, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

const Settings = () => {
  const { isDarkMode, setIsDarkMode } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      <div className="border-b border-slate-200 dark:border-slate-800/50 pb-6 mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">System Preferences</h1>
        <p className="text-slate-500 font-medium mt-1">Configure your workspace environment and notification alerts.</p>
      </div>

      {/* THEME APPEARANCE SECTION */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 p-8 shadow-xl shadow-slate-200/10 dark:shadow-none transition-all">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-xl">
            <Palette size={20} />
          </div>
          <div>
             <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Appearance</h2>
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Workspace Theme</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Light Mode Option */}
          <button 
            onClick={() => setIsDarkMode(false)}
            className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-300 group overflow-hidden ${!isDarkMode ? 'border-sky-500 bg-sky-50/50 shadow-md' : 'border-slate-200 dark:border-slate-700 hover:border-sky-300 bg-white dark:bg-slate-800/50'}`}
          >
            {!isDarkMode && <CheckCircle2 className="absolute top-4 right-4 text-sky-500" size={18} />}
            <div className={`p-4 rounded-full w-fit mb-4 transition-colors ${!isDarkMode ? 'bg-sky-100 text-sky-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-sky-50 group-hover:text-sky-500'}`}>
               <Sun size={24} />
            </div>
            <p className="font-black text-lg text-slate-900 dark:text-white tracking-tight">Light Mode</p>
            <p className="text-xs font-bold text-slate-500 mt-1">High contrast & clean</p>
          </button>

          {/* Dark Mode Option */}
          <button 
            onClick={() => setIsDarkMode(true)}
            className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-300 group overflow-hidden ${isDarkMode ? 'border-indigo-500 bg-[#0a0f1c] shadow-lg shadow-indigo-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-800 dark:hover:border-indigo-500/50 bg-white dark:bg-slate-800/50'}`}
          >
            {isDarkMode && <CheckCircle2 className="absolute top-4 right-4 text-indigo-400" size={18} />}
            <div className={`p-4 rounded-full w-fit mb-4 transition-colors ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-slate-800 group-hover:text-white'}`}>
               <Moon size={24} />
            </div>
            <p className={`font-black text-lg tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900 dark:text-white'}`}>Dark Mode</p>
            <p className="text-xs font-bold text-slate-500 mt-1">Cinematic focus feel</p>
          </button>

          {/* System Default */}
          <button className="relative p-6 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-left opacity-50 cursor-not-allowed">
            <div className="p-4 rounded-full w-fit mb-4 bg-slate-200 dark:bg-slate-800 text-slate-400">
               <Monitor size={24} />
            </div>
            <p className="font-black text-lg text-slate-900 dark:text-white tracking-tight">System Sync</p>
            <p className="text-xs font-bold text-slate-500 mt-1">Follows OS settings</p>
            <span className="absolute top-4 right-4 text-[9px] font-black bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded text-slate-500 uppercase tracking-widest">Soon</span>
          </button>
        </div>
      </div>

      {/* NOTIFICATIONS SECTION */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 p-8 shadow-sm transition-all">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-amber-50 dark:bg-amber-500/10 text-amber-500 rounded-2xl">
              <Bell size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Push Notifications</h2>
              <p className="text-sm font-medium text-slate-500 mt-1">Receive alerts for new course announcements and certifications.</p>
            </div>
          </div>
          
          {/* Custom Toggle Switch */}
          <button 
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`w-16 h-8 rounded-full p-1 transition-all duration-300 ease-in-out flex items-center shrink-0 ${notificationsEnabled ? 'bg-sky-500 justify-end ring-4 ring-sky-500/20' : 'bg-slate-200 dark:bg-slate-700 justify-start'}`}
          >
            <div className="w-6 h-6 bg-white rounded-full shadow-md transform transition-transform"></div>
          </button>
        </div>
      </div>

    </div>
  );
};

export default Settings;