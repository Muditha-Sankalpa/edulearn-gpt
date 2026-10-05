import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import axiosClient from "../../api/axiosClient";
import CourseCardSkeleton from "../../components/ui/CourseCardSkeleton";
import EmptyState from "../../components/ui/EmptyState";
import PageHeader from "../../components/ui/PageHeader";

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

  return (
    <div>
      <PageHeader icon={GraduationCap} title="My Courses" subtitle="Everything you're currently enrolled in." />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <CourseCardSkeleton />
          <CourseCardSkeleton />
          <CourseCardSkeleton />
        </div>
      ) : error ? (
        <p className="text-accent-red">{error}</p>
      ) : enrollments.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No enrollments yet"
          description="Browse available courses and enroll to start learning."
          action={
            <Link to="/courses" className="bg-primary hover:bg-primary-dark text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              Browse courses
            </Link>
          }
        />
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