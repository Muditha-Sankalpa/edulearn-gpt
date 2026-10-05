import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.webp";

const Navbar = ({ onOpenRecommendations }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    setMobileOpen(false);
    logout();
    navigate("/login");
  };

  const handleRecommendations = () => {
    setMobileOpen(false);
    onOpenRecommendations();
  };

  const linkClass = "text-white/75 hover:text-white transition-colors";
  const mobileLinkClass = "block w-full text-left py-3 text-white/90 hover:text-white transition-colors border-b border-white/10";

  return (
    <header className="sticky top-0 z-30 shadow-sm" style={{ backgroundColor: "#3D348B" }}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/courses" className="flex items-center bg-white rounded-lg px-2.5 py-1.5" onClick={() => setMobileOpen(false)}>
          <img src={logo} alt="EduLearn" className="h-9 sm:h-10 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {user?.role !== "instructor" && (
            <Link to="/courses" className={linkClass}>
              Courses
            </Link>
          )}

          {user?.role === "student" && (
            <>
              <Link to="/my-courses" className={linkClass}>
                My Courses
              </Link>
              <button onClick={onOpenRecommendations} className={`flex items-center gap-1.5 ${linkClass}`}>
                <Sparkles className="w-3.5 h-3.5" />
                Recommendations
              </button>
            </>
          )}

          {user?.role === "instructor" && (
            <Link to="/instructor/dashboard" className={linkClass}>
              Dashboard
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3 pl-4 border-l border-white/20">
              <div className="w-8 h-8 rounded-full bg-white/15 text-white flex items-center justify-center text-xs font-semibold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-white/75 hidden lg:inline">{user.name}</span>
              <button onClick={handleLogout} className="text-white hover:text-accent-yellow font-medium transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 pl-4 border-l border-white/20">
              <Link to="/login" className={linkClass}>Log in</Link>
              <Link to="/register" className="bg-white text-primary-dark hover:bg-white/90 px-4 py-1.5 rounded-lg font-medium transition-colors">
                Sign up
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="md:hidden text-white p-1"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden overflow-hidden border-t border-white/10"
          >
            <div className="max-w-6xl mx-auto px-4 py-2">
              {user?.role !== "instructor" && (
                <Link to="/courses" className={mobileLinkClass} onClick={() => setMobileOpen(false)}>
                  Courses
                </Link>
              )}

              {user?.role === "student" && (
                <>
                  <Link to="/my-courses" className={mobileLinkClass} onClick={() => setMobileOpen(false)}>
                    My Courses
                  </Link>
                  <button onClick={handleRecommendations} className={`${mobileLinkClass} flex items-center gap-1.5`}>
                    <Sparkles className="w-3.5 h-3.5" />
                    Recommendations
                  </button>
                </>
              )}

              {user?.role === "instructor" && (
                <Link to="/instructor/dashboard" className={mobileLinkClass} onClick={() => setMobileOpen(false)}>
                  Dashboard
                </Link>
              )}

              {user ? (
                <div className="flex items-center justify-between pt-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-white/15 text-white flex items-center justify-center text-xs font-semibold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white/90 text-sm">{user.name}</span>
                  </div>
                  <button onClick={handleLogout} className="text-white hover:text-accent-yellow font-medium text-sm">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 pt-3">
                  <Link to="/login" className="text-white/90 text-sm" onClick={() => setMobileOpen(false)}>
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="bg-white text-primary-dark px-4 py-1.5 rounded-lg font-medium text-sm"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
