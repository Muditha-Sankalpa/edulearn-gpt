import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CourseCard = ({ course }) => (
  <motion.div
    whileHover={{ y: -4 }}
    transition={{ duration: 0.2 }}
    className="border border-border rounded-xl p-5 bg-surface hover:shadow-lg hover:shadow-primary/5 transition-shadow"
  >
    <h3 className="text-lg font-semibold text-text mb-1">{course.title}</h3>
    <p className="text-text-muted text-sm mb-3 line-clamp-2">{course.description}</p>
    <p className="text-xs text-text-muted mb-4">By {course.instructor?.name || "Unknown"}</p>
    <Link to={`/courses/${course._id}`} className="text-primary font-medium text-sm hover:underline">
      View course →
    </Link>
  </motion.div>
);

export default CourseCard;