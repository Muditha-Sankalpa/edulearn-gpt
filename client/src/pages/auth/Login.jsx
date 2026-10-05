import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import ErrorBanner from "../../components/ui/ErrorBanner";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="w-full max-w-sm bg-surface border border-border rounded-2xl shadow-xl p-8">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
          style={{ background: "linear-gradient(135deg, #7678ED, #3D348B)" }}
        >
          <LogIn className="w-5 h-5 text-white" />
        </div>

        <h1 className="text-2xl font-semibold text-text mb-1">Welcome back</h1>
        <p className="text-text-muted text-sm mb-6">Log in to continue learning.</p>

        <ErrorBanner message={error} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            name="email"
            icon={Mail}
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            icon={Lock}
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-text-muted hover:text-text transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />

          <Button type="submit" loading={loading}>
            {loading ? "Logging in..." : "Log in"}
          </Button>
        </form>

        <p className="text-sm text-text-muted mt-6 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary hover:underline font-medium">Register</Link>
        </p>
      </div>
  );
};

export default Login;
