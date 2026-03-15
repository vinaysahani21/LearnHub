import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  PlayCircle,
  Search,
  Award,
  CheckCircle,
  BookOpen,
  ArrowRight,
  Zap,
  GraduationCap
} from "lucide-react";

const MyLearning = () => {
  const [courses, setCourses] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);

  // UI States
  const [activeTab, setActiveTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [coursesRes, progressRes] = await Promise.all([
          axios.get("http://localhost:5000/api/auth/me", config),
          axios.get("http://localhost:5000/api/progress/all", config),
        ]);

        setCourses(coursesRes.data.enrolledCourses || []);

        const map = {};
        progressRes.data.forEach((p) => {
          map[p.courseId] = p.completedLessons;
        });
        setProgressMap(map);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getProgressStats = (course) => {
    const totalLessons = course.lessons?.length || 0;
    if (totalLessons === 0)
      return { percent: 0, completedCount: 0, isCompleted: false };

    const completedLessons = progressMap[course._id] || [];
    const percent = Math.round((completedLessons.length / totalLessons) * 100);

    return {
      percent,
      completedCount: completedLessons.length,
      isCompleted: percent === 100,
    };
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const stats = getProgressStats(course);
    if (activeTab === "completed") return matchesSearch && stats.isCompleted;
    if (activeTab === "active") return matchesSearch && !stats.isCompleted;

    return matchesSearch;
  });

  // Signature Sky Blue Loader
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4 bg-white dark:bg-[#020617] transition-colors">
        <div className="relative flex h-10 w-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-10 w-10 bg-sky-500"></span>
        </div>
        <p className="font-black text-slate-400 animate-pulse tracking-widest uppercase text-xs">Syncing Progress...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto min-h-[80vh] transition-colors duration-300 animate-in fade-in">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 dark:border-slate-800/50 pb-8 mb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            My Learning <GraduationCap className="text-sky-500" size={32} />
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            Track your progress, resume modules, and download your certificates.
          </p>
        </div>
      </div>

      {/* CONTROLS BAR */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6 mb-10 transition-colors">
        
        {/* Premium Segmented Tabs */}
        <div className="flex bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 w-full lg:w-auto">
          <button
            onClick={() => setActiveTab("active")}
            className={`flex-1 lg:flex-none px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === "active"
                ? "bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`flex-1 lg:flex-none px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === "completed"
                ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            Completed
          </button>
        </div>

        {/* Cinematic Search */}
        <div className="relative w-full lg:w-[350px] group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors w-5 h-5" />
          <input
            type="text"
            placeholder="Search your enrolled courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-5 py-3.5 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 bg-white dark:bg-slate-950 transition-all outline-none shadow-inner"
          />
        </div>
      </div>

      {/* COURSE GRID */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredCourses.map((course) => {
            const stats = getProgressStats(course);

            return (
              <div
                key={course._id}
                className="group bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-sky-900/10 hover:border-sky-200 dark:hover:border-sky-500/30 transition-all duration-300 flex flex-col"
              >
                {/* Thumbnail Area */}
                <div className="h-48 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c]/90 via-[#0a0f1c]/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                  
                  {/* Floating Action Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Link
                      to={`/student/course/${course._id}/watch`}
                      className="bg-sky-500 text-[#0a0f1c] px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform shadow-2xl shadow-sky-500/50 hover:bg-sky-400"
                    >
                      {stats.percent === 0 ? <><PlayCircle size={18} /> Start</> : <><Zap size={18} className="fill-[#0a0f1c]" /> Resume</>}
                    </Link>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col relative">
                  <div className="absolute -top-5 right-6">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white bg-[#0a0f1c]/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg shadow-xl">
                      {course.category}
                    </span>
                  </div>

                  <h3 className="font-black text-lg text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors mt-2 tracking-tight leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-6 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-sky-100 dark:bg-slate-800 text-sky-600 dark:text-slate-300 flex items-center justify-center text-[8px] uppercase">
                       {course.tutor?.name?.charAt(0) || "I"}
                    </span>
                    {course.tutor?.name || "Expert Instructor"}
                  </p>

                  {/* Progress Section */}
                  <div className="mt-auto pt-5 border-t border-slate-100 dark:border-slate-800/50">
                    {stats.isCompleted ? (
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-500/20">
                          <CheckCircle size={14} className="fill-emerald-400/20" /> Mastered
                        </span>
                        <Link
                          to={`/student/course/${course._id}/certificate`}
                          className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-500/20 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg transition-all"
                        >
                          <Award size={14} /> Certificate
                        </Link>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2.5">
                          <span className={`${stats.percent > 0 ? "text-sky-600 dark:text-sky-400" : ""}`}>
                            {stats.percent}% Complete
                          </span>
                          <span>
                            {stats.completedCount}/{course.lessons?.length || 0} Modules
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden shadow-inner">
                          <div
                            className="bg-gradient-to-r from-sky-500 to-cyan-400 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                            style={{ width: `${stats.percent}%` }}
                          ></div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* PREMIUM EMPTY STATE */
        <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 transition-colors shadow-sm">
          <div className="bg-sky-50 dark:bg-sky-500/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-sky-100 dark:border-sky-500/20">
            {activeTab === "completed" ? (
              <Award className="text-emerald-500" size={40} />
            ) : (
              <BookOpen className="text-sky-500" size={40} />
            )}
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
            {searchQuery
              ? `No results for "${searchQuery}"`
              : activeTab === "completed"
              ? "No mastered courses yet"
              : "Your learning path is clear"}
          </h3>
          <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium">
            {activeTab === "completed"
              ? "Keep pushing forward! Complete all modules in a course to unlock your certificate and see it here."
              : "It looks like you haven't started any courses yet. Find your next skill in the catalog."}
          </p>
          {!searchQuery && activeTab !== "completed" && (
            <Link
              to="/student/explore"
              className="px-8 py-4 bg-[#0a0f1c] hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-2 w-fit mx-auto"
            >
              Explore Catalog <ArrowRight size={16} />
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default MyLearning;