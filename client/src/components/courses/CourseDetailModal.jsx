import Modal from "../ui/Modal";
import CourseDetailContent from "./CourseDetailContent";

const CourseDetailModal = ({ courseId, onClose }) => (
  <Modal open={!!courseId} onClose={onClose}>
    {courseId && <CourseDetailContent courseId={courseId} />}
  </Modal>
);

export default CourseDetailModal;
