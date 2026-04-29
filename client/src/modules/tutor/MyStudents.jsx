import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Users, Search, Mail, BookOpen, 
  IndianRupee, Calendar, Star, ChevronRight 
} from 'lucide-react';
import api from '../../api/api';

const MyStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/tutor/students', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudents(res.data);
      } catch (err) {
        console.error("Failed to fetch students", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // The Signature Indigo Studio Loader
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <div className="relative flex h-10 w-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-10 w-10 bg-indigo-500"></span>
        </div>
        <p className="font-bold text-slate-400 animate-pulse tracking-widest uppercase text-xs">Compiling Student Roster...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 dark:border-slate-800/50 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            My Audience <Users className="text-indigo-500" size={28} />
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage and interact with the students enrolled in your courses.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
            />
          </div>
          <div className="bg-[#0a0f1c] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-slate-900/10 border border-slate-800">
             <span className="text-xs font-black uppercase tracking-widest text-indigo-400">Total</span>
             <span className="text-sm font-black">{students.length}</span>
          </div>
        </div>
      </div>

      {/* STUDENTS TABLE (CRM STYLE) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-xl shadow-slate-200/10 dark:shadow-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase tracking-widest text-slate-500 font-black">
                <th className="p-5 pl-6">Student Profile</th>
                <th className="p-5">Enrolled Assets</th>
                <th className="p-5">First Joined</th>
                <th className="p-5 text-right pr-6">Lifetime Value</th>
              </tr>
            </thead>
           <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-20">
                    {/* Wrapped in a div so it doesn't break the table-cell display */}
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-700">
                         <Users className="text-slate-300 dark:text-slate-500" size={32} />
                      </div>
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No students found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, index) => {
                  // The top student gets a special "Top Learner" badge
                  const isTopLearner = index === 0 && student.totalSpent > 0;

                  return (
                    <tr key={student._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-all duration-200 group">
                      
                      {/* PROFILE */}
                      <td className="p-5 pl-6">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg shadow-inner ring-2 ${isTopLearner ? 'bg-gradient-to-br from-amber-200 to-orange-400 text-white ring-amber-100 dark:ring-amber-900/50 shadow-orange-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 ring-white dark:ring-slate-900'}`}>
                              {student.name.charAt(0).toUpperCase()}
                            </div>
                            {isTopLearner && (
                              <div className="absolute -top-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-0.5 shadow-sm">
                                <Star size={12} className="text-orange-500 fill-orange-500" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                              {student.name} 
                            </p>
                            <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5 mt-1">
                              <Mail size={12} className="text-slate-400"/> {student.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* COURSES ENROLLED */}
                      <td className="p-5">
                        <div className="flex flex-col gap-1.5">
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                            <BookOpen size={14} className="text-indigo-500"/> {student.enrolledCourses.length} Courses
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {student.enrolledCourses.slice(0, 2).map((course, i) => (
                              <span key={i} className="text-[9px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200/60 dark:border-slate-700 truncate max-w-[150px]">
                                {course}
                              </span>
                            ))}
                            {student.enrolledCourses.length > 2 && (
                              <span className="text-[9px] font-black text-slate-400 bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-800">
                                +{student.enrolledCourses.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* DATE JOINED */}
                      <td className="p-5">
                        <p className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                          <Calendar size={14} className="text-slate-400 opacity-70" />
                          {new Date(student.firstJoined).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      </td>

                      {/* LTV / TOTAL SPENT */}
                      <td className="p-5 pr-6 text-right">
                        <div className="flex flex-col items-end">
                          <p className="font-black text-emerald-600 dark:text-emerald-400 flex items-center text-lg tracking-tight">
                            <IndianRupee size={16} className="opacity-60" /> {student.totalSpent.toLocaleString()}
                          </p>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                            LTV <ChevronRight size={10} />
                          </span>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default MyStudents;