import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ROLE_HOME = {
  student: "/courses",
  instructor: "/instructor/dashboard",
};

const ProtectedRoute = ({ role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to={ROLE_HOME[user.role] || "/courses"} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
