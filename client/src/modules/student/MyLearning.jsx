import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Loader2,
  PlayCircle,
  Search,
  Award,
  CheckCircle,
  BookOpen,
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-indigo-600 dark:text-indigo-400 w-8 h-8" />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto min-h-[80vh] transition-colors duration-300">
      {/* HEADER SECTION */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Learning</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1">
          Track your progress and manage your enrolled courses.
        </p>
      </div>

      {/* CONTROLS BAR */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 border-b border-gray-200 dark:border-slate-800 pb-1">
        {/* Tabs */}
        <div className="flex gap-6 w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab("active")}
            className={`pb-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "active"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-gray-500 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300"
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`pb-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "completed"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-gray-500 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300"
            }`}
          >
            Completed
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72 mb-2 md:mb-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search my courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-slate-800 dark:text-white focus:bg-white dark:focus:bg-slate-900 transition-all outline-none"
          />
        </div>
      </div>

      {/* COURSE GRID */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const stats = getProgressStats(course);

            return (
              <div
                key={course._id}
                className="group bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden hover:shadow-lg dark:hover:shadow-indigo-900/10 transition-all duration-300 flex flex-col"
              >
                {/* Thumbnail Area */}
                <div className="h-44 bg-gray-100 dark:bg-slate-800 relative overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 dark:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <Link
                      to={`/student/course/${course._id}/watch`}
                      className="bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl"
                    >
                      <PlayCircle size={18} />{" "}
                      {stats.percent === 0 ? "Start" : "Resume"}
                    </Link>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-md">
                      {course.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mb-4 flex items-center gap-1">
                    By {course.tutor?.name || "Instructor"}
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-50 dark:border-slate-800">
                    {stats.isCompleted ? (
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
                          <CheckCircle size={14} /> Completed
                        </span>
                        <Link
                          to={`/student/course/${course._id}/certificate`}
                          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 border border-indigo-100 dark:border-indigo-900/50 px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                        >
                          <Award size={14} /> Certificate
                        </Link>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-slate-400 mb-1.5">
                          <span className={`${stats.percent > 0 ? "text-indigo-600 dark:text-indigo-400" : ""}`}>
                            {stats.percent}% Complete
                          </span>
                          <span className="text-gray-400 dark:text-slate-500">
                            {stats.completedCount}/{course.lessons?.length || 0} Lessons
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-1000 ease-out"
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
        /* EMPTY STATE */
        <div className="text-center py-20 bg-gray-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-800">
          <div className="bg-white dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            {activeTab === "completed" ? (
              <Award className="text-gray-400 dark:text-slate-500" size={32} />
            ) : (
              <BookOpen className="text-gray-400 dark:text-slate-500" size={32} />
            )}
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            {searchQuery
              ? `No courses match "${searchQuery}"`
              : activeTab === "completed"
                ? "No completed courses yet"
                : "No courses found"}
          </h3>
          <p className="text-gray-500 dark:text-slate-400 text-sm mb-6 max-w-sm mx-auto">
            {activeTab === "completed"
              ? "Keep watching! Finish all lessons in a course to move it here."
              : "It looks like you haven't enrolled in any courses yet."}
          </p>
          {!searchQuery && activeTab !== "completed" && (
            <Link
              to="/student/explore"
              className="text-white bg-indigo-600 dark:bg-indigo-500 px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none"
            >
              Explore Courses
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default MyLearning;