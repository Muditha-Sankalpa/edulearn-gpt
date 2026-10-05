import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import CourseForm from "../../components/courses/CourseForm";

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ title: "", description: "", content: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axiosClient.get(`/courses/${id}`);
        setFormData({ title: res.data.title, description: res.data.description, content: res.data.content });
      } catch (err) {
        setError("Failed to load course.");
      } finally {
        setFetching(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axiosClient.put(`/courses/${id}`, formData);
      navigate("/instructor/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update course.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <p className="text-text-muted">Loading course...</p>;

  return (
    <div>
      <Link to="/instructor/dashboard" className="text-sm text-primary hover:underline mb-4 inline-block">
        ← Back to dashboard
      </Link>
      <h1 className="text-2xl font-semibold text-text mb-6">Edit Course</h1>

      <CourseForm formData={formData} onChange={handleChange} onSubmit={handleSubmit} loading={loading} error={error} submitLabel="Save Changes" />
    </div>
  );
};

export default EditCourse;