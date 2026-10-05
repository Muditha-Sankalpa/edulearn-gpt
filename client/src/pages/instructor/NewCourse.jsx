import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import CourseForm from "../../components/courses/CourseForm";

const NewCourse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: "", description: "", content: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axiosClient.post("/courses", formData);
      navigate("/instructor/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Link to="/instructor/dashboard" className="text-sm text-primary hover:underline mb-4 inline-block">
        ← Back to dashboard
      </Link>
      <h1 className="text-2xl font-semibold text-text mb-6">New Course</h1>

      <CourseForm formData={formData} onChange={handleChange} onSubmit={handleSubmit} loading={loading} error={error} submitLabel="Create Course" />
    </div>
  );
};

export default NewCourse;