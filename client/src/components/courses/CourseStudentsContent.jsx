import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import axiosClient from "../../api/axiosClient";
import EmptyState from "../ui/EmptyState";
import Skeleton from "../ui/Skeleton";

const CourseStudentsContent = ({ courseId }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axiosClient.get(`/courses/${courseId}/students`);
        setStudents(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load enrolled students.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [courseId]);

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (error) return <p className="text-accent-red text-sm">{error}</p>;

  if (students.length === 0) {
    return <EmptyState icon={Users} title="No students yet" description="Once students enroll, they'll show up here." />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
      {students.map((student) => (
        <div key={student.studentId} className="flex items-center justify-between border border-border rounded-lg px-3 py-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
              {student.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-text text-sm font-medium truncate">{student.name}</p>
              <p className="text-text-muted text-xs truncate">{student.email}</p>
            </div>
          </div>
          <span className="text-text-muted text-xs shrink-0 ml-2">{new Date(student.enrolledAt).toLocaleDateString()}</span>
        </div>
      ))}
    </motion.div>
  );
};

export default CourseStudentsContent;
