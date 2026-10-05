import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axiosClient from "../../api/axiosClient";

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await axiosClient.get("/enrollments/me");
        setEnrollments(res.data.filter((e) => e.course)); // guard against orphaned enrollments
      } catch (err) {
        setError("Failed to load your courses.");
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  if (loading) return <p className="text-text-muted">Loading your courses...</p>;
  if (error) return <p className="text-accent-red">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text mb-6">My Courses</h1>

      {enrollments.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-text-muted mb-4">You haven't enrolled in any courses yet.</p>
          <Link to="/courses" className="text-primary font-medium hover:underline">
            Browse available courses →
          </Link>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {enrollments.map((enrollment) => (
            <motion.div
              key={enrollment._id}
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
              className="border border-border rounded-xl p-5"
            >
              <h3 className="text-lg font-semibold text-text mb-1">{enrollment.course.title}</h3>
              <p className="text-text-muted text-sm mb-3 line-clamp-2">{enrollment.course.description}</p>
              <p className="text-xs text-text-muted mb-4">
                By {enrollment.course.instructor?.name || "Unknown"}
              </p>
              <Link to={`/courses/${enrollment.course._id}`} className="text-primary font-medium text-sm hover:underline">
                Continue course →
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default MyCourses;