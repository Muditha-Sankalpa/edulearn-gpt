import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import axiosClient from "../../api/axiosClient";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";

const CourseDetailContent = ({ courseId }) => {
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseRes = await axiosClient.get(`/courses/${courseId}`);
        setCourse(courseRes.data);

        if (user?.role === "student") {
          const enrollmentsRes = await axiosClient.get("/enrollments/me");
          setIsEnrolled(enrollmentsRes.data.some((e) => e.course?._id === courseId));
        }
      } catch (err) {
        setError("Course not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId, user]);

  const handleEnroll = async () => {
    setEnrolling(true);
    setError("");
    try {
      await axiosClient.post("/enrollments", { courseId });
      setIsEnrolled(true);
      setSuccessMessage("You're enrolled! Check My Courses to get started.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to enroll. Please try again.");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <p className="text-text-muted">Loading...</p>;
  if (error && !course) return <p className="text-accent-red">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-semibold text-text mb-2">{course.title}</h1>
      <p className="text-text-muted text-sm mb-6">By {course.instructor?.name || "Unknown instructor"}</p>
      <p className="text-text mb-6 whitespace-pre-line">{course.description}</p>

      <div className="border border-border rounded-xl p-5 mb-6">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-2">Course content</h2>
        <p className="text-text whitespace-pre-line">{course.content}</p>
      </div>

      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 text-sm text-primary-dark bg-primary/5 border border-primary/20 rounded-lg px-3 py-2 overflow-hidden"
          >
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {error && course && <p className="text-accent-red text-sm mb-4">{error}</p>}

      {!user && (
        <p className="text-text-muted text-sm">
          <Link to="/login" className="text-primary hover:underline">Log in</Link> as a student to enroll.
        </p>
      )}

      {user?.role === "student" &&
        (isEnrolled ? (
          <span className="inline-block bg-accent-yellow/15 text-accent-orange text-sm font-medium px-4 py-2 rounded-lg">
            ✓ Enrolled
          </span>
        ) : (
          <div className="max-w-xs">
            <Button onClick={handleEnroll} loading={enrolling}>
              {enrolling ? "Enrolling..." : "Enroll in this course"}
            </Button>
          </div>
        ))}

      {user?.role === "instructor" && (
        <p className="text-text-muted text-sm">Instructors can't enroll in courses.</p>
      )}
    </div>
  );
};

export default CourseDetailContent;
