import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, X, BookOpen, Users } from "lucide-react";
import axiosClient from "../../api/axiosClient";
import EmptyState from "../../components/ui/EmptyState";
import PageHeader from "../../components/ui/PageHeader";
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
            onClick={() => (panelMode === "new" ? closePanel() : openNewPanel())}
            className="bg-primary hover:bg-primary-dark text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shrink-0"
          >
            {panelMode === "new" ? "Cancel" : "+ New Course"}
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

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-1 min-w-0 w-full">
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
                const isActive = activeCourse?._id === course._id && panelMode !== "new";
                return (
                  <motion.div
                    key={course._id}
                    variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                    className={`relative overflow-hidden border rounded-xl bg-surface transition-colors ${
                      isActive ? "border-primary" : "border-border"
                    }`}
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundImage: variant.backgroundImage }} />
                    <div className="pl-6 pr-5 py-4 flex items-center justify-between">
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-text truncate">{course.title}</h3>
                        <p className="text-text-muted text-sm line-clamp-1">{course.description}</p>
                      </div>

                      <div className="flex items-center gap-4 text-sm shrink-0 ml-4">
                        <button
                          onClick={() => (panelMode === "students" && isActive ? closePanel() : openStudentsPanel(course))}
                          className="text-text-muted hover:text-primary transition-colors flex items-center gap-1"
                        >
                          <Users className="w-3.5 h-3.5" />
                          Students
                        </button>
                        <button
                          onClick={() => (panelMode === "edit" && isActive ? closePanel() : openEditPanel(course))}
                          className="text-text-muted hover:text-primary transition-colors"
                        >
                          {panelMode === "edit" && isActive ? "Editing..." : "Edit"}
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
        </div>

        <AnimatePresence>
          {panelMode && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="overflow-hidden shrink-0 w-full lg:w-auto"
            >
              <div className="w-full lg:w-[380px] border border-border rounded-xl p-5 bg-surface">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-text">
                    {PANEL_TITLES[panelMode]}
                    {panelMode === "students" && activeCourse && (
                      <span className="block text-xs font-normal text-text-muted mt-0.5">{activeCourse.title}</span>
                    )}
                  </h2>
                  <button onClick={closePanel} className="text-text-muted hover:text-text transition-colors" aria-label="Close">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {panelMode === "students" ? (
                  <CourseStudentsContent courseId={activeCourse._id} />
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InstructorDashboard;
