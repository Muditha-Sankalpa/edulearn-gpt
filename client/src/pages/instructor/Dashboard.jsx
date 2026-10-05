import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LayoutGrid, BookOpen, Users } from "lucide-react";
import axiosClient from "../../api/axiosClient";
import EmptyState from "../../components/ui/EmptyState";
import PageHeader from "../../components/ui/PageHeader";
import Modal from "../../components/ui/Modal";
import CourseForm from "../../components/courses/CourseForm";
import CourseStudentsContent from "../../components/courses/CourseStudentsContent";
import { getCardVariant } from "../../utils/courseCardVariants";

const emptyForm = { title: "", description: "", content: "" };

const PANEL_TITLES = { new: "New Course", edit: "Edit Course", students: "Enrolled Students" };

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const [panelMode, setPanelMode] = useState(null); // null | "new" | "edit" | "students"
  const [activeCourse, setActiveCourse] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axiosClient.get("/courses/mine");
        setCourses(res.data);
      } catch (err) {
        setError("Failed to load your courses.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course? This can't be undone.")) return;

    setDeletingId(id);
    try {
      await axiosClient.delete(`/courses/${id}`);
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      setError("Failed to delete course.");
    } finally {
      setDeletingId(null);
    }
  };

  const openNewPanel = () => {
    setFormData(emptyForm);
    setFormError("");
    setActiveCourse(null);
    setPanelMode("new");
  };

  const openEditPanel = (course) => {
    setFormData({ title: course.title, description: course.description, content: course.content });
    setFormError("");
    setActiveCourse(course);
    setPanelMode("edit");
  };

  const openStudentsPanel = (course) => {
    setActiveCourse(course);
    setPanelMode("students");
  };

  const closePanel = () => {
    setPanelMode(null);
    setActiveCourse(null);
  };

  const handleFormChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);
    try {
      if (panelMode === "edit") {
        const res = await axiosClient.put(`/courses/${activeCourse._id}`, formData);
        setCourses((prev) => prev.map((c) => (c._id === activeCourse._id ? res.data : c)));
      } else {
        const res = await axiosClient.post("/courses", formData);
        setCourses((prev) => [res.data, ...prev]);
      }
      closePanel();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to save course.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        icon={LayoutGrid}
        title="My Courses"
        subtitle="Manage the courses you've created."
        action={
          <button
            onClick={openNewPanel}
            className="bg-primary hover:bg-primary-dark text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shrink-0"
          >
            + New Course
          </button>
        }
      />

      {!loading && (
        <div className="flex items-center gap-3 mb-6 border border-border rounded-xl p-4 bg-surface w-fit">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #7678ED, #3D348B)" }}
          >
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xl font-bold text-text leading-none">{courses.length}</p>
            <p className="text-text-muted text-xs mt-1">Total Courses</p>
          </div>
        </div>
      )}

      {error && <p className="text-accent-red text-sm mb-4">{error}</p>}

      {loading ? (
        <div className="space-y-3">
          <div className="border border-border rounded-xl h-20 animate-pulse bg-border/20" />
          <div className="border border-border rounded-xl h-20 animate-pulse bg-border/20" />
          <div className="border border-border rounded-xl h-20 animate-pulse bg-border/20" />
        </div>
      ) : courses.length === 0 ? (
        <EmptyState
          icon={LayoutGrid}
          title="No courses yet"
          description="Create your first course to start accepting enrollments."
          action={
            <button
              onClick={openNewPanel}
              className="bg-primary hover:bg-primary-dark text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Create your first course
            </button>
          }
        />
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          className="space-y-3"
        >
          {courses.map((course) => {
            const variant = getCardVariant(course._id);
            return (
              <motion.div
                key={course._id}
                variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                className="relative overflow-hidden border border-border rounded-xl bg-surface"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundImage: variant.backgroundImage }} />
                <div className="pl-6 pr-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-text truncate">{course.title}</h3>
                    <p className="text-text-muted text-sm line-clamp-1">{course.description}</p>
                  </div>

                  <div className="flex items-center gap-4 text-sm shrink-0">
                    <button
                      onClick={() => openStudentsPanel(course)}
                      className="text-text-muted hover:text-primary transition-colors flex items-center gap-1"
                    >
                      <Users className="w-3.5 h-3.5" />
                      Students
                    </button>
                    <button onClick={() => openEditPanel(course)} className="text-text-muted hover:text-primary transition-colors">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      disabled={deletingId === course._id}
                      className="text-accent-red hover:text-accent-red/70 transition-colors disabled:opacity-50"
                    >
                      {deletingId === course._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      <Modal
        open={!!panelMode}
        onClose={closePanel}
        title={panelMode ? PANEL_TITLES[panelMode] : undefined}
        subtitle={panelMode === "students" ? activeCourse?.title : undefined}
      >
        {panelMode === "students" ? (
          activeCourse && <CourseStudentsContent courseId={activeCourse._id} />
        ) : (
          <CourseForm
            formData={formData}
            onChange={handleFormChange}
            onSubmit={handleSubmit}
            loading={submitting}
            error={formError}
            submitLabel={panelMode === "edit" ? "Save Changes" : "Create Course"}
          />
        )}
      </Modal>
    </div>
  );
};

export default InstructorDashboard;
