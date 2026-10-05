import { Link, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Navbar = ({ onOpenRecommendations }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="border-b border-border/60 bg-surface/70 backdrop-blur-md sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/courses" className="text-lg font-bold text-text">
          Edu<span className="text-primary">Learn</span>
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link to="/courses" className="text-text-muted hover:text-primary transition-colors">
            Courses
          </Link>

          {user?.role === "student" && (
            <>
              <Link to="/my-courses" className="text-text-muted hover:text-primary transition-colors">
                My Courses
              </Link>
              <button
                onClick={onOpenRecommendations}
                className="flex items-center gap-1.5 text-text-muted hover:text-primary transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Recommendations
              </button>
            </>
          )}

          {user?.role === "instructor" && (
            <Link to="/instructor/dashboard" className="text-text-muted hover:text-primary transition-colors">
              Dashboard
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-text-muted hidden sm:inline">{user.name}</span>
              <button onClick={handleLogout} className="text-primary hover:text-primary-dark font-medium transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <Link to="/login" className="text-text-muted hover:text-primary transition-colors">Log in</Link>
              <Link to="/register" className="bg-primary hover:bg-primary-dark text-white px-4 py-1.5 rounded-lg transition-colors">
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