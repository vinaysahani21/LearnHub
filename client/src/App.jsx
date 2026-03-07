import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import AdminLayout from "./modules/admin/AdminLayout.jsx";
import PublicLayout from "./modules/public/PublicLayout.jsx";
import StudentLayout from "./modules/student/StudentLayout.jsx";
import TutorLayout from "./modules/tutor/TutorLayout.jsx";
import LandingPage from "./modules/public/LandingPage.jsx";
import AuthLayout from "./modules/auth/AuthLayout.jsx";
import Login from "./modules/auth/Login.jsx";
import Register from "./modules/auth/Register.jsx";
import StudentDashboard from "./modules/student/StudentDashboard.jsx";
import MyLearning from "./modules/student/MyLearning.jsx";
import TutorDashboard from "./modules/tutor/TutorDashboard.jsx";
import CreateCourse from "./modules/tutor/CreateCourse.jsx";
import AdminDashboard from "./modules/admin/AdminDashboard.jsx";
import TutorRegister from "./modules/auth/TutorRegister.jsx";
import CourseDetail from "./modules/student/CourseDetail.jsx";
import ExploreCourses from "./modules/student/ExploreCourses.jsx";
import StudentProfile from "./modules/student/StudentProfile.jsx";
import MyContent from "./modules/tutor/MyContent.jsx";
import CourseManager from "./modules/tutor/CourseManager.jsx";
import AddLesson from "./modules/tutor/AddLesson.jsx";
import TutorProfile from "./modules/tutor/TutorProfile.jsx";
import CourseWatch from "./modules/student/CourseWatch.jsx";
import CourseCertificate from "./modules/student/CourseCertificate.jsx";
import AdminCourses from "./modules/admin/AdminCourses.jsx";
import AdminOrders from "./modules/admin/AdminOrders.jsx";
import Settings from "./modules/student/Settings.jsx";
import TutorSettings from "./modules/tutor/Settings.jsx";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // If a student tries to go to /tutor, send them back to their dashboard
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
          <Route path="courses" element={<div>All Courses Page</div>} />
        </Route>

        {/* AUTH ROUTES */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="/auth/register-tutor" element={<TutorRegister />} />

        {/* STUDENT ROUTES (Protected) */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["student", "tutor", "admin"]} />}>
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
            <Route path="course/:id/add-lesson" element={<AddLesson />} />
            <Route path="profile" element={<TutorProfile/>} />
            <Route path="settings" element={<TutorSettings />} />
          </Route>
        </Route>

        {/* ADMIN ROUTES (Protected: Admin only) */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
