import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Users, BookOpen, DollarSign, Activity, 
  Trash2, Search, ShieldAlert 
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTutors: 0,
    totalCourses: 0,
    totalRevenue: 0
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Data
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [statsRes, usersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/stats', config),
          axios.get('http://localhost:5000/api/admin/users', config)
        ]);

        setStats(statsRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.error("Admin Access Denied", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  // Delete User Handler
  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure? This will delete the user and all their data.")) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(u => u._id !== userId)); // Optimistic update
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  if (loading) return <div className="p-20 text-center font-bold">Loading Admin Panel...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">Platform Overview & Management</p>
        </div>
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm">
          <ShieldAlert size={18} /> Super Admin Mode
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard icon={<Users />} label="Total Students" value={stats.totalStudents} color="blue" />
        <StatCard icon={<BookOpen />} label="Total Courses" value={stats.totalCourses} color="purple" />
        <StatCard icon={<Activity />} label="Total Tutors" value={stats.totalTutors} color="orange" />
        <StatCard icon={<DollarSign />} label="Total Revenue" value={`₹${stats.totalRevenue}`} color="green" />
      </div>

      {/* USER MANAGEMENT TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 text-lg">User Management</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-900 font-bold uppercase text-xs">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(user => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-gray-900">{user.name}</p>
                      <p className="text-gray-500 text-xs">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                      user.role === 'admin' ? 'bg-red-100 text-red-700' :
                      user.role === 'tutor' ? 'bg-purple-100 text-purple-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {user.role !== 'admin' && (
                      <button 
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded transition-colors"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Simple Helper Component for Cards
const StatCard = ({ icon, label, value, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
    green: "bg-green-50 text-green-600",
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
      <div className={`p-4 rounded-full ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;