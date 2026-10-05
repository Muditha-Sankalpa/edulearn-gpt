import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AuthLayout from "./components/layout/AuthLayout";
import MainLayout from "./components/layout/MainLayout";
import CourseList from "./pages/courses/CourseList";
import CourseDetail from "./pages/courses/CourseDetail";
import ProtectedRoute from "./routes/ProtectedRoute";
import MyCourses from "./pages/student/MyCourses";
import InstructorDashboard from "./pages/instructor/Dashboard";

function App() {
  return (
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
      </Route>
    </Routes>
  );
}

export default App;
