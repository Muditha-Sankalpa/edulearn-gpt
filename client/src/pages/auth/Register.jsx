import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import ErrorBanner from "../../components/ui/ErrorBanner";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await register(formData.name, formData.email, formData.password, formData.role);
      navigate(user.role === "instructor" ? "/instructor/dashboard" : "/courses");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        <h1 className="text-2xl font-semibold text-text mb-1">Create an account</h1>
        <p className="text-text-muted text-sm mb-6">Start learning something new today.</p>

        <ErrorBanner message={error} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" type="text" name="name" value={formData.name} onChange={handleChange} required />
          <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
          <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} required minLength={6} />

          <div>
            <label className="block text-sm text-text-muted mb-1">I am a</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-text focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
          </div>

          <Button type="submit" loading={loading}>
            {loading ? "Creating account..." : "Register"}
          </Button>
        </form>

        <p className="text-sm text-text-muted mt-6 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline font-medium">Log in</Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
};

export default Register;