import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import axiosClient from "../../api/axiosClient";
import CourseCard from "../../components/courses/CourseCard";
import CourseDetailModal from "../../components/courses/CourseDetailModal";
import CourseCardSkeleton from "../../components/ui/CourseCardSkeleton";
import EmptyState from "../../components/ui/EmptyState";
import PageHeader from "../../components/ui/PageHeader";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState(null);

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

  return (
    <div>
      <PageHeader icon={BookOpen} title="Available Courses" subtitle="Browse what's on offer and find your next course." />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <CourseCardSkeleton />
          <CourseCardSkeleton />
          <CourseCardSkeleton />
        </div>
      ) : error ? (
        <p className="text-accent-red">{error}</p>
      ) : courses.length === 0 ? (
        <EmptyState icon={BookOpen} title="No courses available yet" description="Check back soon — instructors are still setting things up." />
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
              <CourseCard course={course} onView={setSelectedCourseId} />
            </motion.div>
          ))}
        </motion.div>
      )}

      <CourseDetailModal courseId={selectedCourseId} onClose={() => setSelectedCourseId(null)} />
    </div>
  );
};

export default CourseList;