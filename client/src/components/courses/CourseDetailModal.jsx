import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import CourseDetailContent from "./CourseDetailContent";

const CourseDetailModal = ({ courseId, onClose }) => (
  <AnimatePresence>
    {courseId && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40"
        />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-surface border border-border rounded-xl shadow-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto p-6 pointer-events-auto"
          >
            <div className="flex justify-end mb-2">
              <button onClick={onClose} className="text-text-muted hover:text-text transition-colors" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <CourseDetailContent courseId={courseId} />
          </motion.div>
        </div>
      </>
    )}
  </AnimatePresence>
);

export default CourseDetailModal;
