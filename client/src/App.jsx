import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import MainLayout from "./components/layout/MainLayout";
import CourseList from "./pages/courses/CourseList";
import CourseDetail from "./pages/courses/CourseDetail";
import ProtectedRoute from "./routes/ProtectedRoute";
import MyCourses from "./pages/student/MyCourses";
import InstructorDashboard from "./pages/instructor/Dashboard";
import NewCourse from "./pages/instructor/NewCourse";
import EditCourse from "./pages/instructor/EditCourse";
import CourseStudents from "./pages/instructor/CourseStudents";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/courses" replace />} />
        <Route path="/courses" element={<CourseList />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        
        <Route element={<ProtectedRoute role="student" />}>
          <Route path="/my-courses" element={<MyCourses />} />
        </Route>

        <Route element={<ProtectedRoute role="instructor" />}>
          <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
          <Route path="/instructor/courses/new" element={<NewCourse />} />
          <Route path="/instructor/courses/:id/edit" element={<EditCourse />} />
          <Route path="/instructor/courses/:id/students" element={<CourseStudents />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;