import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import axiosClient from "../../api/axiosClient";
import EmptyState from "../../components/ui/EmptyState";
import Skeleton from "../../components/ui/Skeleton";
import PageHeader from "../../components/ui/PageHeader";

const CourseStudents = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, studentsRes] = await Promise.all([
          axiosClient.get(`/courses/${id}`),
          axiosClient.get(`/courses/${id}/students`),
        ]);
        setCourse(courseRes.data);
        setStudents(studentsRes.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load enrolled students.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div>
      <Link to="/instructor/dashboard" className="text-sm text-primary hover:underline mb-4 inline-block">
        ← Back to dashboard
      </Link>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : error ? (
        <p className="text-accent-red">{error}</p>
      ) : (
        <>
          <PageHeader
            icon={Users}
            title={course.title}
            subtitle={`${students.length} enrolled student${students.length !== 1 ? "s" : ""}`}
          />

          {students.length === 0 ? (
            <EmptyState icon={Users} title="No students yet" description="Once students enroll in this course, they'll show up here." />
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-border/30 text-text-muted text-left">
                  <tr>
                    <th className="px-5 py-3 font-medium">Student</th>
                    <th className="px-5 py-3 font-medium">Email</th>
                    <th className="px-5 py-3 font-medium">Enrolled</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.studentId} className="border-t border-border">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                            {student.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-text font-medium">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-text-muted">{student.email}</td>
                      <td className="px-5 py-3 text-text-muted">{new Date(student.enrolledAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default CourseStudents;