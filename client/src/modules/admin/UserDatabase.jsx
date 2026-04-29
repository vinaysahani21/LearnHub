import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Users, Trash2, ShieldAlert, GraduationCap, 
  Presentation, Mail, Calendar, BookOpen, Ban, 
  CheckCircle2, Search, Filter, ShieldBan, Activity
} from 'lucide-react';
import api from '../../api/api';

const UserDatabase = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI States for Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const res = await api.get('/admin/users', config);
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle Suspend / Activate
  const handleToggleStatus = async (userId, currentStatus, role) => {
    if (role === 'admin') return alert("Action Denied: Cannot suspend an Admin.");

    const action = currentStatus ? "suspend" : "activate";
    if (!window.confirm(`Are you sure you want to ${action} this account?`)) return;

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const res = await api.put(`/admin/users/${userId}/toggle-status`, {}, config);
      
      setUsers(users.map(u => u._id === userId ? { ...u, isActive: res.data.isActive } : u));
    } catch (err) {
      alert("Failed to update status. Check console.");
      console.error(err);
    }
  };

  // Delete User
  const handleDeleteUser = async (userId, userName, role) => {
    if (role === 'admin') return alert("Action Denied: Cannot delete an Admin.");
    if (!window.confirm(`⚠️ DANGER: Permanently delete "${userName}"? This cannot be undone.`)) return;

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await api.delete(`/admin/users/${userId}`, config);
      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      alert("Failed to delete user.");
    }
  };

  const getRoleBadge = (role) => {
    if (role === 'student') return <span className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-200/60 dark:border-blue-500/20 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest w-fit shadow-sm"><GraduationCap size={12}/> Student</span>;
    if (role === 'tutor') return <span className="flex items-center gap-1.5 text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border border-orange-200/60 dark:border-orange-500/20 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest w-fit shadow-sm"><Presentation size={12}/> Tutor</span>;
    return <span className="flex items-center gap-1.5 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200/60 dark:border-red-500/20 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest w-fit shadow-sm"><ShieldAlert size={12}/> Admin</span>;
  };

  // Real-time Filtering Logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                          (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Calculate Quick Insights
  const totalStudents = filteredUsers.filter(u => u.role === 'student').length;
  const totalTutors = filteredUsers.filter(u => u.role === 'tutor').length;
  const totalSuspended = filteredUsers.filter(u => u.isActive === false).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4 transition-colors">
        <div className="relative flex h-10 w-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-10 w-10 bg-red-500"></span>
        </div>
        <p className="font-bold text-slate-400 dark:text-slate-500 animate-pulse tracking-widest uppercase text-xs">Accessing Database...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200/60 dark:border-slate-800/60 pb-6 transition-colors">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            User Database <Users className="text-red-500" size={28} />
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Manage accounts, monitor platform activity, and control access.</p>
        </div>
        
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-red-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all shadow-sm"
            />
          </div>
          
          <div className="relative w-full sm:w-auto flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm transition-colors">
            <div className="pl-3 pr-2 text-slate-400 dark:text-slate-500"><Filter size={16} /></div>
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent py-2.5 pr-4 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer appearance-none"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="tutor">Tutors</option>
              <option value="admin">Admins</option>
            </select>
          </div>
          
          <div className="bg-[#0a0f1c] dark:bg-red-600 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-slate-900/10 dark:shadow-none whitespace-nowrap transition-colors">
            {filteredUsers.length} Users
          </div>
        </div>
      </div>

      {/* 🔥 NEW: DATABASE INSIGHTS WIDGET 🔥 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
         <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-4 shadow-sm transition-colors">
            <div className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl"><GraduationCap size={20}/></div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Filtered Students</p>
               <p className="text-xl font-black text-slate-900 dark:text-white leading-none mt-1">{totalStudents}</p>
            </div>
         </div>
         <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-4 shadow-sm transition-colors">
            <div className="p-3 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl"><Presentation size={20}/></div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Filtered Tutors</p>
               <p className="text-xl font-black text-slate-900 dark:text-white leading-none mt-1">{totalTutors}</p>
            </div>
         </div>
         <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-4 shadow-sm transition-colors">
            <div className="p-3 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl"><ShieldBan size={20}/></div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Suspended Accounts</p>
               <p className="text-xl font-black text-slate-900 dark:text-white leading-none mt-1">{totalSuspended}</p>
            </div>
         </div>
      </div>

      {/* TABLE AREA */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-xl shadow-slate-200/10 dark:shadow-none overflow-hidden relative transition-colors">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-black">
                <th className="p-4 pl-6 whitespace-nowrap">User Profile</th>
                <th className="p-4 whitespace-nowrap">Role & Status</th>
                <th className="p-4 whitespace-nowrap">Platform Activity</th>
                <th className="p-4 whitespace-nowrap">Joined Date</th>
                <th className="p-4 pr-6 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-16 text-center text-slate-500 dark:text-slate-400 font-medium">
                    <Users size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                    <p className="font-bold text-slate-700 dark:text-slate-300">No users found.</p>
                    <p className="text-xs mt-1">Try adjusting your search or filter parameters.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user._id} className={`transition-all duration-200 ${user.isActive === false ? 'bg-rose-50/30 dark:bg-rose-500/5' : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/30'}`}>
                    
                    {/* PROFILE */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shadow-inner border ${
                          user.isActive === false 
                            ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/30' 
                            : 'bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                        }`}>
                          {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                          <p className={`font-black text-sm tracking-tight ${user.isActive === false ? 'text-rose-900 dark:text-rose-400 line-through opacity-70' : 'text-slate-900 dark:text-white'}`}>{user.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5 font-medium"><Mail size={12}/> {user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* ROLE & STATUS */}
                    <td className="p-4">
                      <div className="flex flex-col gap-2">
                        {getRoleBadge(user.role)}
                        {user.isActive === false ? (
                          <span className="text-[10px] font-black text-rose-500 flex items-center gap-1 uppercase tracking-widest"><Ban size={10} strokeWidth={3}/> Suspended</span>
                        ) : (
                          <span className="text-[10px] font-black text-emerald-500 flex items-center gap-1 uppercase tracking-widest"><CheckCircle2 size={10} strokeWidth={3}/> Active</span>
                        )}
                      </div>
                    </td>

                    {/* ACTIVITY STATS */}
                    <td className="p-4">
                      {user.role === 'admin' ? (
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">System Root</span>
                      ) : (
                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg w-fit border border-slate-200/60 dark:border-slate-700 shadow-sm">
                          <Activity size={14} className="text-indigo-500 dark:text-indigo-400" />
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            {user.role === 'tutor' 
                              ? `${user.createdCount || 0} Courses Created` 
                              : `${user.enrolledCount || 0} Courses Enrolled`}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* DATE */}
                    <td className="p-4">
                      <p className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-2.5 py-1 rounded-md w-fit border border-slate-100 dark:border-slate-700">
                        <Calendar size={14} className="text-slate-400 dark:text-slate-500" />
                        {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    </td>

                    {/* ACTIONS */}
                    <td className="p-4 pr-6 text-right">
                      {user.role !== 'admin' && (
                        <div className="flex items-center justify-end gap-2 opacity-60 hover:opacity-100 transition-opacity">
                          {/* Suspend / Activate Toggle */}
                          <button 
                            onClick={() => handleToggleStatus(user._id, user.isActive, user.role)} 
                            className={`p-2 rounded-xl transition-all shadow-sm flex items-center gap-1 text-xs font-bold border ${
                              user.isActive === false 
                                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white' 
                                : 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/30 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 dark:hover:text-white'
                            }`}
                            title={user.isActive === false ? "Restore Account" : "Suspend Account"}
                          >
                            {user.isActive === false ? <CheckCircle2 size={16} /> : <Ban size={16} />}
                          </button>
                          
                          {/* Delete */}
                          <button 
                            onClick={() => handleDeleteUser(user._id, user.name, user.role)} 
                            className="p-2 text-rose-400 dark:text-rose-500 hover:text-white hover:bg-rose-500 dark:hover:bg-rose-600 rounded-xl transition-all shadow-sm border border-transparent hover:border-rose-600 dark:hover:border-rose-500 bg-slate-50 dark:bg-slate-800" 
                            title="Permanently Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default UserDatabase;