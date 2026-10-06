import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Search, X } from "lucide-react";
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
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axiosClient.get("/courses");
        setCourses(res.data);
      } catch {
        setError("Failed to load courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return courses;
    return courses.filter(
      (course) =>
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.instructor?.name?.toLowerCase().includes(query)
    );
  }, [courses, search]);

  return (
    <div>
      <PageHeader icon={BookOpen} title="Available Courses" subtitle="Browse what's on offer and find your next course." />

      {!loading && courses.length > 0 && (
        <div className="relative max-w-md mb-6">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses by title, topic, or instructor..."
            className="w-full border border-border rounded-lg pl-10 pr-10 py-2.5 text-sm text-text bg-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

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
      ) : filteredCourses.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No courses match your search"
          description={`Nothing found for "${search}". Try a different keyword.`}
        />
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filteredCourses.map((course) => (
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
