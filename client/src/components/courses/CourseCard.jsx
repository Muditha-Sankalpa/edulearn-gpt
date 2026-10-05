import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { getCardVariant } from "../../utils/courseCardVariants";

const CourseCard = ({ course, onView }) => {
  const variant = getCardVariant(course._id || course.title);

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="group border border-border rounded-xl overflow-hidden bg-surface hover:shadow-lg hover:shadow-primary/10 transition-shadow">
      <div
        className="h-24 flex items-center justify-center"
        style={{ ...variant, backgroundBlendMode: "overlay" }}
      >
        <div className="w-11 h-11 rounded-xl bg-white/25 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-text mb-1">{course.title}</h3>
        <p className="text-text-muted text-sm mb-3 line-clamp-2">{course.description}</p>
        <p className="text-xs text-text-muted mb-4">By {course.instructor?.name || "Unknown"}</p>
        <button
          onClick={() => onView(course._id)}
          className="text-primary font-medium text-sm hover:underline inline-flex items-center gap-1 group-hover:gap-2 transition-all"
        >
          View course <span>→</span>
        </button>
      </div>
    </motion.div>
  );
};
export default CourseCard;
