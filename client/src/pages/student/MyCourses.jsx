import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import axiosClient from "../../api/axiosClient";
import CourseDetailModal from "../../components/courses/CourseDetailModal";
import CourseCardSkeleton from "../../components/ui/CourseCardSkeleton";
import EmptyState from "../../components/ui/EmptyState";
import PageHeader from "../../components/ui/PageHeader";
import { getCardVariant } from "../../utils/courseCardVariants";

const STATUS_CONFIG = {
  enrolled: { percent: 0, label: "Not started", next: "in-progress", nextLabel: "Start Course" },
  "in-progress": { percent: 50, label: "In progress", next: "completed", nextLabel: "Mark Complete" },
  completed: { percent: 100, label: "Completed", next: null, nextLabel: null },
};

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await axiosClient.get("/enrollments/me");
        setEnrollments(res.data.filter((e) => e.course)); // guard against orphaned enrollments
      } catch {
        setError("Failed to load your courses.");
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  const handleAdvanceStatus = async (enrollment) => {
    const config = STATUS_CONFIG[enrollment.status || "enrolled"];
    if (!config.next) return;

    setUpdatingId(enrollment._id);
    try {
      await axiosClient.patch(`/enrollments/${enrollment._id}`, { status: config.next });
      setEnrollments((prev) =>
        prev.map((e) => (e._id === enrollment._id ? { ...e, status: config.next } : e))
      );
    } catch {
      setError("Failed to update progress.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <PageHeader icon={GraduationCap} title="My Courses" subtitle="Everything you're currently enrolled in." />

      {error && <p className="text-accent-red text-sm mb-4">{error}</p>}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <CourseCardSkeleton />
          <CourseCardSkeleton />
          <CourseCardSkeleton />
        </div>
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
          {enrollments.map((enrollment) => {
            const status = enrollment.status || "enrolled";
            const config = STATUS_CONFIG[status];
            const variant = getCardVariant(enrollment.course._id);

            return (
              <motion.div
                key={enrollment._id}
                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                className="border border-border rounded-xl overflow-hidden bg-surface"
              >
                <div className="h-20 flex items-center justify-center" style={{ ...variant, backgroundBlendMode: "overlay" }}>
                  <div className="w-10 h-10 rounded-xl bg-white/25 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold text-text mb-1">{enrollment.course.title}</h3>
                  <p className="text-text-muted text-sm mb-3 line-clamp-2">{enrollment.course.description}</p>
                  <p className="text-xs text-text-muted mb-4">By {enrollment.course.instructor?.name || "Unknown"}</p>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-text-muted">{config.label}</span>
                      <span className="text-text font-medium">{config.percent}%</span>
                    </div>
                    <div className="h-2 bg-border rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(90deg, #7678ED, #3D348B)" }}
                        initial={{ width: 0 }}
                        animate={{ width: `${config.percent}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedCourseId(enrollment.course._id)}
                      className="text-primary font-medium text-sm hover:underline"
                    >
                      Continue →
                    </button>

                    {config.next ? (
                      <button
                        onClick={() => handleAdvanceStatus(enrollment)}
                        disabled={updatingId === enrollment._id}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/15 transition-colors disabled:opacity-50 shrink-0"
                      >
                        {updatingId === enrollment._id ? "..." : config.nextLabel}
                      </button>
                    ) : (
                      <span className="text-xs font-medium px-3 py-1.5 rounded-lg bg-accent-yellow/15 text-accent-orange shrink-0">
                        ✓ Done
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      <CourseDetailModal courseId={selectedCourseId} onClose={() => setSelectedCourseId(null)} />
    </div>
  );
};

export default MyCourses;
