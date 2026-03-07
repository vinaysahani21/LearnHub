import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun, Monitor, Bell, Palette } from 'lucide-react';

const Settings = () => {
  const { isDarkMode, setIsDarkMode, toggleTheme } = useTheme();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your account preferences and system theme.</p>
      </div>

      {/* THEME APPEARANCE SECTION */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm transition-all">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <Palette size={20} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Appearance</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Light Mode Option */}
          <button 
            onClick={() => setIsDarkMode(false)}
            className={`p-4 rounded-xl border-2 text-left transition-all ${!isDarkMode ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/10' : 'border-slate-100 dark:border-slate-700'}`}
          >
            <Sun className={`mb-3 ${!isDarkMode ? 'text-indigo-600' : 'text-slate-400'}`} />
            <p className="font-bold text-slate-900 dark:text-white">Light Mode</p>
            <p className="text-xs text-slate-500">Classic clean look</p>
          </button>

          {/* Dark Mode Option */}
          <button 
            onClick={() => setIsDarkMode(true)}
            className={`p-4 rounded-xl border-2 text-left transition-all ${isDarkMode ? 'border-indigo-600 bg-indigo-900/20' : 'border-slate-100 dark:border-slate-700'}`}
          >
            <Moon className={`mb-3 ${isDarkMode ? 'text-indigo-400' : 'text-slate-400'}`} />
            <p className="font-bold text-slate-900 dark:text-white">Dark Mode</p>
            <p className="text-xs text-slate-500">Easier on the eyes</p>
          </button>

          {/* System Default (Optional Logic) */}
          <button className="p-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 text-left opacity-50 cursor-not-allowed">
            <Monitor className="mb-3 text-slate-400" />
            <p className="font-bold text-slate-900 dark:text-white">System</p>
            <p className="text-xs text-slate-500">Sync with OS</p>
          </button>
        </div>
      </div>

      {/* NOTIFICATIONS SECTION (Placeholder) */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm opacity-60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg">
              <Bell size={20} />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Email Notifications</p>
              <p className="text-sm text-slate-500">Receive updates about sales and enrollments</p>
            </div>
          </div>
          <div className="w-12 h-6 bg-slate-200 dark:bg-slate-700 rounded-full relative">
            <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;