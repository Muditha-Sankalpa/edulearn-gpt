import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="border-b border-border bg-surface sticky top-0 z-10">
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
              <Link to="/recommendations" className="text-text-muted hover:text-primary transition-colors">
                Recommendations
              </Link>
            </>
          )}

          {user?.role === "instructor" && (
            <Link to="/instructor/dashboard" className="text-text-muted hover:text-primary transition-colors">
              Dashboard
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <span className="text-text-muted">{user.name}</span>
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