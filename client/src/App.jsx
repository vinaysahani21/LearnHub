import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";

// ==========================================
// GLOBAL CONTEXTS
// ==========================================
import { useAuth } from "./context/AuthContext.jsx";

// ==========================================
// PUBLIC & AUTH PANEL
// ==========================================
import PublicLayout from "./modules/public/PublicLayout.jsx";
import LandingPage from "./modules/public/LandingPage.jsx";
import AuthLayout from "./modules/auth/AuthLayout.jsx";
import Login from "./modules/auth/Login.jsx";
import Register from "./modules/auth/Register.jsx";
import TutorRegister from "./modules/auth/TutorRegister.jsx";

// ==========================================
// STUDENT PANEL
// ==========================================
import StudentLayout from "./modules/student/StudentLayout.jsx";
import StudentDashboard from "./modules/student/StudentDashboard.jsx";
import MyLearning from "./modules/student/MyLearning.jsx";
import ExploreCourses from "./modules/student/ExploreCourses.jsx";
import CourseDetail from "./modules/student/CourseDetail.jsx";
import CourseWatch from "./modules/student/CourseWatch.jsx";
import CourseCertificate from "./modules/student/CourseCertificate.jsx";
import StudentProfile from "./modules/student/StudentProfile.jsx";
import Settings from "./modules/student/Settings.jsx";

// ==========================================
// TUTOR PANEL
// ==========================================
import TutorLayout from "./modules/tutor/TutorLayout.jsx";
import TutorDashboard from "./modules/tutor/TutorDashboard.jsx";
import MyContent from "./modules/tutor/MyContent.jsx";
import CreateCourse from "./modules/tutor/CreateCourse.jsx";
import CourseManager from "./modules/tutor/CourseManager.jsx";
import AddLesson from "./modules/tutor/AddLesson.jsx";
import MyStudents from "./modules/tutor/MyStudents.jsx";
import TutorPayouts from "./modules/tutor/TutorPayouts.jsx";
import TutorProfile from "./modules/tutor/TutorProfile.jsx";
import TutorSettings from "./modules/tutor/Settings.jsx";
import TutorCoursePreview from "./modules/tutor/TutorCoursePreview.jsx";
import EditLesson from "./modules/tutor/EditLesson.jsx";

// ==========================================
// ADMIN PANEL (ADMIN_OS)
// ==========================================
import AdminLayout from "./modules/admin/AdminLayout.jsx";
import AdminDashboard from "./modules/admin/AdminDashboard.jsx";
import AdminCourses from "./modules/admin/AdminCourses.jsx";
import AdminCoursePreview from "./modules/admin/AdminCoursePreview.jsx";
import CategoryManagement from "./modules/admin/CategoryManagement.jsx";
import UserDatabase from './modules/admin/UserDatabase.jsx';
import AdminOrders from "./modules/admin/AdminOrders.jsx";
import PayoutManagement from "./modules/admin/PayoutManagement.jsx";
import PlatformSettings from "./modules/admin/PlatformSettings.jsx";
import TutorAnalytics from "./modules/tutor/TutorAnalytics.jsx";
import AdminBroadcast from "./modules/admin/AdminBroadcast.jsx";

// ==========================================
// ROUTE PROTECTOR
// ==========================================
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafcff]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // If a user tries to go to a panel they don't own, send them to their dashboard
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <Router>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="courses" element={<ExploreCourses />} />
        </Route>

        {/* AUTH ROUTES */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="/auth/register-tutor" element={<TutorRegister />} />

        {/* STUDENT ROUTES (Protected: All authenticated users) */}
        <Route element={<ProtectedRoute allowedRoles={["student", "tutor", "admin"]} />}>
          <Route path="/student" element={<StudentLayout />}>
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="my-learning" element={<MyLearning />} />
            <Route path="explore" element={<ExploreCourses />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="courses/:id" element={<CourseDetail />} />
            <Route path="course/:id/watch" element={<CourseWatch />} />
            <Route path="course/:id/certificate" element={<CourseCertificate />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* TUTOR ROUTES (Protected: Tutor & Admin only) */}
        <Route element={<ProtectedRoute allowedRoles={["tutor", "admin"]} />}>
          <Route path="/tutor" element={<TutorLayout />}>
            <Route path="dashboard" element={<TutorDashboard />} />
            <Route path="create-course" element={<CreateCourse />} />
            <Route path="my-courses" element={<MyContent />} />
            <Route path="course/:id/manager" element={<CourseManager />} />
            <Route path="course/:id/preview" element={<TutorCoursePreview />} />
            <Route path="course/:id/add-lesson" element={<AddLesson />} />
            <Route path="/tutor/course/:courseId/edit-lesson/:lessonId" element={<EditLesson />} />
            <Route path="students" element={<MyStudents />} />  {/* <-- FIXED THIS LINE */}
            <Route path="payouts" element={<TutorPayouts />} />
            <Route path="analytics" element={<TutorAnalytics />} />
            <Route path="profile" element={<TutorProfile />} />
            <Route path="settings" element={<TutorSettings />} />
          </Route>
        </Route>

        {/* ADMIN ROUTES (Protected: Admin only) */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="content" element={<AdminCourses />} />
            <Route path="course/:id/preview" element={<AdminCoursePreview />} />
            <Route path="categories" element={<CategoryManagement />} />
            <Route path="users" element={<UserDatabase />} />
            <Route path="finance" element={<AdminOrders />} />
            <Route path="payouts" element={<PayoutManagement />} />
            <Route path="settings" element={<PlatformSettings />} />
            <Route path="broadcast" element={<AdminBroadcast />} />
          </Route>
        </Route>

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;