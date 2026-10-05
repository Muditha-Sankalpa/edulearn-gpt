import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutGrid } from "lucide-react";
import axiosClient from "../../api/axiosClient";
import EmptyState from "../../components/ui/EmptyState";
import PageHeader from "../../components/ui/PageHeader";

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axiosClient.get("/courses/mine");
        setCourses(res.data);
      } catch (err) {
        setError("Failed to load your courses.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course? This can't be undone.")) return;

    setDeletingId(id);
    try {
      await axiosClient.delete(`/courses/${id}`);
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      setError("Failed to delete course.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <PageHeader
        icon={LayoutGrid}
        title="My Courses"
        subtitle="Manage the courses you've created."
        action={
          <Link
            to="/instructor/courses/new"
            className="bg-primary hover:bg-primary-dark text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shrink-0"
          >
            + New Course
          </Link>
        }
      />

      {error && <p className="text-accent-red text-sm mb-4">{error}</p>}

      {loading ? (
        <div className="space-y-3">
          <div className="border border-border rounded-xl h-20 animate-pulse bg-border/20" />
          <div className="border border-border rounded-xl h-20 animate-pulse bg-border/20" />
          <div className="border border-border rounded-xl h-20 animate-pulse bg-border/20" />
        </div>
      ) : courses.length === 0 ? (
        <EmptyState
          icon={LayoutGrid}
          title="No courses yet"
          description="Create your first course to start accepting enrollments."
          action={
            <Link to="/instructor/courses/new" className="bg-primary hover:bg-primary-dark text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              Create your first course
            </Link>
          }
        />
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          className="space-y-3"
        >
          {courses.map((course) => (
            <motion.div
              key={course._id}
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
              className="border border-border rounded-xl p-5 flex items-center justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-text">{course.title}</h3>
                <p className="text-text-muted text-sm line-clamp-1">{course.description}</p>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <Link to={`/instructor/courses/${course._id}/students`} className="text-text-muted hover:text-primary transition-colors">
                  Students
                </Link>
                <Link to={`/instructor/courses/${course._id}/edit`} className="text-text-muted hover:text-primary transition-colors">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(course._id)}
                  disabled={deletingId === course._id}
                  className="text-accent-red hover:text-accent-red/70 transition-colors disabled:opacity-50"
                >
                  {deletingId === course._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default InstructorDashboard;