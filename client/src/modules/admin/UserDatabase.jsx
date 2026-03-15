import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Users, Trash2, ShieldAlert, GraduationCap, 
  Presentation, Mail, Calendar, BookOpen, Ban, 
  CheckCircle2, Search, Filter
} from 'lucide-react';

const UserDatabase = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New UI States for Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const res = await axios.get('http://localhost:5000/api/admin/users', config);
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
      
      const res = await axios.put(`http://localhost:5000/api/admin/users/${userId}/toggle-status`, {}, config);
      
      // Update UI state instantly
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
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, config);
      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      alert("Failed to delete user.");
    }
  };

  const getRoleBadge = (role) => {
    if (role === 'student') return <span className="flex items-center gap-1.5 text-blue-700 bg-blue-50 border border-blue-200/60 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest w-fit shadow-sm"><GraduationCap size={12}/> Student</span>;
    if (role === 'tutor') return <span className="flex items-center gap-1.5 text-orange-700 bg-orange-50 border border-orange-200/60 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest w-fit shadow-sm"><Presentation size={12}/> Tutor</span>;
    return <span className="flex items-center gap-1.5 text-red-700 bg-red-50 border border-red-200/60 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest w-fit shadow-sm"><ShieldAlert size={12}/> Admin</span>;
  };

  // Real-time Filtering Logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                          (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // The Signature Red Pulse Loader
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <div className="relative flex h-10 w-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-10 w-10 bg-red-500"></span>
        </div>
        <p className="font-bold text-slate-400 animate-pulse tracking-widest uppercase text-xs">Accessing Database...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200/60 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            User Database <Users className="text-indigo-500" size={28} />
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage accounts, monitor platform activity, and control access.</p>
        </div>
        
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all shadow-sm"
            />
          </div>
          
          <div className="relative w-full sm:w-auto flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="pl-3 pr-2 text-slate-400"><Filter size={16} /></div>
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent py-2.5 pr-4 text-sm font-bold text-slate-700 outline-none cursor-pointer appearance-none"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="tutor">Tutors</option>
              <option value="admin">Admins</option>
            </select>
          </div>
          
          <div className="bg-[#0a0f1c] text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-slate-900/10 whitespace-nowrap">
            {filteredUsers.length} Users
          </div>
        </div>
      </div>

      {/* TABLE AREA */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase tracking-widest text-slate-500 font-black">
                <th className="p-4 pl-6">User Profile</th>
                <th className="p-4">Role & Status</th>
                <th className="p-4">Platform Activity</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-slate-500 font-medium">
                    <Users size={40} className="mx-auto mb-3 text-slate-300" />
                    No users match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user._id} className={`transition-all duration-200 hover:shadow-sm ${user.isActive === false ? 'bg-red-50/30' : 'hover:bg-slate-50/80'}`}>
                    
                    {/* PROFILE */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg shadow-inner ring-2 ring-white ${user.isActive === false ? 'bg-red-100 text-red-700' : 'bg-gradient-to-br from-indigo-100 to-blue-50 text-indigo-700'}`}>
                          {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                          <p className={`font-black text-sm tracking-tight ${user.isActive === false ? 'text-red-900 line-through opacity-70' : 'text-slate-900'}`}>{user.name}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><Mail size={12}/> {user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* ROLE & STATUS */}
                    <td className="p-4">
                      <div className="flex flex-col gap-2">
                        {getRoleBadge(user.role)}
                        {user.isActive === false ? (
                          <span className="text-[10px] font-black text-red-500 flex items-center gap-1 uppercase tracking-widest"><Ban size={10} strokeWidth={3}/> Suspended</span>
                        ) : (
                          <span className="text-[10px] font-black text-emerald-500 flex items-center gap-1 uppercase tracking-widest"><CheckCircle2 size={10} strokeWidth={3}/> Active</span>
                        )}
                      </div>
                    </td>

                    {/* ACTIVITY STATS */}
                    <td className="p-4">
                      {user.role === 'admin' ? (
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">System Root</span>
                      ) : (
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg w-fit border border-slate-200/60 shadow-sm">
                          <BookOpen size={14} className="text-indigo-500" />
                          <span className="text-xs font-bold text-slate-700">
                            {user.role === 'tutor' 
                              ? `${user.createdCount || 0} Courses Created` 
                              : `${user.enrolledCount || 0} Courses Enrolled`}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* DATE */}
                    <td className="p-4">
                      <p className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md w-fit border border-slate-100">
                        <Calendar size={14} className="text-slate-400" />
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
                            className={`p-2 rounded-lg transition-all shadow-sm flex items-center gap-1 text-xs font-bold border ${user.isActive === false ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-500 hover:text-white' : 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-500 hover:text-white'}`}
                            title={user.isActive === false ? "Restore Account" : "Suspend Account"}
                          >
                            {user.isActive === false ? <CheckCircle2 size={16} /> : <Ban size={16} />}
                          </button>
                          
                          {/* Delete */}
                          <button 
                            onClick={() => handleDeleteUser(user._id, user.name, user.role)} 
                            className="p-2 text-red-400 hover:text-white hover:bg-red-500 rounded-lg transition-all shadow-sm border border-transparent hover:border-red-600 bg-white" 
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