import { Link, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.webp";

const Navbar = ({ onOpenRecommendations }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-10 shadow-sm" style={{ backgroundColor: "#3D348B" }}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/courses" className="flex items-center bg-white rounded-lg px-2.5 py-1.5">
          <img src={logo} alt="EduLearn" className="h-10 w-auto" />
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          {user?.role !== "instructor" && (
            <Link to="/courses" className="text-white/75 hover:text-white transition-colors">
              Courses
            </Link>
          )}

          {user?.role === "student" && (
            <>
              <Link to="/my-courses" className="text-white/75 hover:text-white transition-colors">
                My Courses
              </Link>
              <button
                onClick={onOpenRecommendations}
                className="flex items-center gap-1.5 text-white/75 hover:text-white transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Recommendations
              </button>
            </>
          )}

          {user?.role === "instructor" && (
            <Link to="/instructor/dashboard" className="text-white/75 hover:text-white transition-colors">
              Dashboard
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3 pl-4 border-l border-white/20">
              <div className="w-8 h-8 rounded-full bg-white/15 text-white flex items-center justify-center text-xs font-semibold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-white/75 hidden sm:inline">{user.name}</span>
              <button onClick={handleLogout} className="text-white hover:text-accent-yellow font-medium transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 pl-4 border-l border-white/20">
              <Link to="/login" className="text-white/75 hover:text-white transition-colors">Log in</Link>
              <Link to="/register" className="bg-white text-primary-dark hover:bg-white/90 px-4 py-1.5 rounded-lg font-medium transition-colors">
                Sign up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;