import { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2, Trash2, AlertCircle, ExternalLink, ShieldAlert } from 'lucide-react';
import {Link} from 'react-router-dom';

const ContentModeration = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch All Courses via Admin Route
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const res = await axios.get('http://localhost:5000/api/admin/courses', config);
        setCourses(res.data);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // 2. Admin Delete Course
  const handleDeleteCourse = async (courseId, title) => {
    // Extra warning for Admins
    if (!window.confirm(`⚠️ ADMIN OVERRIDE:\nAre you sure you want to permanently delete the course "${title}"? This cannot be undone.`)) return;

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.delete(`http://localhost:5000/api/admin/courses/${courseId}`, config);

      // Remove from UI
      setCourses(courses.filter(c => c._id !== courseId));
    } catch (err) {
      alert("Failed to delete course. Check console.");
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-red-600 w-10 h-10" /></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      <div className="flex justify-between items-end border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Content Moderation <ShieldAlert className="text-red-500" size={28} />
          </h1>
          <p className="text-slate-500 font-medium mt-1">Review and manage all courses uploaded to the platform.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {courses.length === 0 ? (
          <div className="p-10 text-center text-slate-500">No courses found in the database.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-widest text-slate-500">
                <th className="p-4 font-black">Course Details</th>
                <th className="p-4 font-black">Tutor</th>
                <th className="p-4 font-black">Metrics</th>
                <th className="p-4 font-black">Status</th>
                <th className="p-4 font-black text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courses.map(course => (
                <tr key={course._id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <img src={course.thumbnail} alt="thumb" className="w-16 h-10 object-cover rounded shadow-sm border border-slate-200" />
                      <div>
                        <p className="font-bold text-slate-900 line-clamp-1">{course.title}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{course.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-slate-700 text-sm">{course.tutor?.name || 'Unknown'}</p>
                    <p className="text-xs text-slate-500">{course.tutor?.email || 'N/A'}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-bold text-slate-700">₹{course.price}</p>
                    <p className="text-xs text-slate-500">{course.lessons?.length || 0} Lessons</p>
                  </td>
                  <td className="p-4">
                    {course.isActive ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-[10px] font-black uppercase tracking-widest">Active</span>
                    ) : (
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-black uppercase tracking-widest">Draft</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/course/${course._id}/preview`} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors" title="Review Content">
                        <ExternalLink size={18} />
                      </Link>
                      <button onClick={() => handleDeleteCourse(course._id, course.title)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Course">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};

export default ContentModeration;