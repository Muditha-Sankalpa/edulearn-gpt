import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import CourseDetailContent from "../../components/courses/CourseDetailContent";

const CourseDetail = () => {
  const { id } = useParams();

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-2xl">
      <Link to="/courses" className="text-sm text-primary hover:underline mb-4 inline-block">
        ← Back to courses
      </Link>
      <CourseDetailContent courseId={id} />
    </motion.div>
  );
};

export default CourseDetail;
