import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import ErrorBanner from "../../components/ui/ErrorBanner";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(formData.email, formData.password);
      navigate(user.role === "instructor" ? "/instructor/dashboard" : "/courses");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
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
        <h1 className="text-2xl font-semibold text-text mb-1">Welcome back</h1>
        <p className="text-text-muted text-sm mb-6">Log in to continue learning.</p>

        <ErrorBanner message={error} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
          <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} required />

          <Button type="submit" loading={loading}>
            {loading ? "Logging in..." : "Log in"}
          </Button>
        </form>

        <p className="text-sm text-text-muted mt-6 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary hover:underline font-medium">Register</Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
};

export default Login;