import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

const CourseCard = ({ course }) => (
  <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="group border border-border rounded-xl overflow-hidden bg-surface hover:shadow-lg hover:shadow-primary/10 transition-shadow">
    <div className="h-1.5" style={{ background: "linear-gradient(90deg, #7678ED, #F18701)" }} />
    <div className="p-5">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
        style={{ background: "linear-gradient(135deg, rgba(118,120,237,0.15), rgba(241,135,1,0.15))" }}
      >
        <BookOpen className="w-4 h-4 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-text mb-1">{course.title}</h3>
      <p className="text-text-muted text-sm mb-3 line-clamp-2">{course.description}</p>
      <p className="text-xs text-text-muted mb-4">By {course.instructor?.name || "Unknown"}</p>
      <Link to={`/courses/${course._id}`} className="text-primary font-medium text-sm hover:underline inline-flex items-center gap-1 group-hover:gap-2 transition-all">
        View course <span>→</span>
      </Link>
    </div>
  </motion.div>
);
export default CourseCard;