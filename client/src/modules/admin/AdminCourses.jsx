import { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Trash2, Eye, Video, ListChecks } from 'lucide-react';
import AdminLayout from './AdminLayout.jsx';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/admin/courses', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCourses(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    if(!confirm("Are you sure? This will delete the course for ALL students.")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/courses/${id}`, {
         headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(courses.filter(c => c._id !== id));
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const filteredCourses = courses.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Course Management</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search courses..." 
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-900 font-bold uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Course Info</th>
              <th className="px-6 py-4">Instructor</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredCourses.map(course => (
              <tr key={course._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={course.thumbnail} className="w-12 h-12 rounded object-cover bg-gray-200" alt="" />
                    <div>
                      <p className="font-bold text-gray-900">{course.title}</p>
                      <div className="flex gap-2 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1"><Video size={10}/> {course.lessons.length}</span>
                        <span>{course.category}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{course.tutor?.name}</p>
                  <p className="text-xs text-gray-500">{course.tutor?.email}</p>
                </td>
                <td className="px-6 py-4 font-bold">
                  {course.price === 0 ? <span className="text-green-600">Free</span> : `₹${course.price}`}
                </td>
                <td className="px-6 py-4">
                   <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${course.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                     {course.isActive ? 'Active' : 'Draft'}
                   </span>
                </td>
                <td className="px-6 py-4 text-right">
                   <button onClick={() => handleDelete(course._id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded transition-colors">
                     <Trash2 size={18} />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminCourses;