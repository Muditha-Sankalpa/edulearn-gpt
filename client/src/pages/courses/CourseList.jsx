import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosClient from "../../api/axiosClient";
import CourseCard from "../../components/courses/CourseCard";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axiosClient.get("/courses");
        setCourses(res.data);
      } catch (err) {
        setError("Failed to load courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <p className="text-text-muted">Loading courses...</p>;
  if (error) return <p className="text-accent-red">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text mb-6">Available Courses</h1>

      {courses.length === 0 ? (
        <p className="text-text-muted">No courses available yet.</p>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {courses.map((course) => (
            <motion.div
              key={course._id}
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
            >
              <CourseCard course={course} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default CourseList;