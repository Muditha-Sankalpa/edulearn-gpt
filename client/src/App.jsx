import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AuthLayout from "./components/layout/AuthLayout";
import MainLayout from "./components/layout/MainLayout";
import CourseList from "./pages/courses/CourseList";
import CourseDetail from "./pages/courses/CourseDetail";
import ProtectedRoute from "./routes/ProtectedRoute";
import MyCourses from "./pages/student/MyCourses";
import InstructorDashboard from "./pages/instructor/Dashboard";
import NotFound from "./pages/NotFound";
import { registerNavigateHandler } from "./utils/authBridge";

const NavigateHandlerSetup = () => {
  const navigate = useNavigate();
  useEffect(() => {
    registerNavigateHandler(navigate);
  }, [navigate]);
  return null;
};

function App() {
  return (
    <>
      <NavigateHandlerSetup />
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/courses" replace />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/courses/:id" element={<CourseDetail />} />

          <Route element={<ProtectedRoute role="student" />}>
            <Route path="/my-courses" element={<MyCourses />} />
          </Route>

          <Route element={<ProtectedRoute role="instructor" />}>
            <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
