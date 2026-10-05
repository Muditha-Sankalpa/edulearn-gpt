import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, UserPlus, GraduationCap, Presentation } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import ErrorBanner from "../../components/ui/ErrorBanner";

const getPasswordStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password) || /[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

const STRENGTH_LABELS = ["Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = ["#F35B04", "#F18701", "#F7B801", "#7678ED"];

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "student" });
  const [showPassword, setShowPassword] = useState(false);
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

  const strength = formData.password ? getPasswordStrength(formData.password) : -1;

  return (
    <div className="w-full max-w-sm bg-surface border border-border rounded-2xl shadow-xl p-8">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
          style={{ background: "linear-gradient(135deg, #7678ED, #3D348B)" }}
        >
          <UserPlus className="w-5 h-5 text-white" />
        </div>

        <h1 className="text-2xl font-semibold text-text mb-1">Create an account</h1>
        <p className="text-text-muted text-sm mb-6">Start learning something new today.</p>

        <ErrorBanner message={error} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            type="text"
            name="name"
            icon={User}
            value={formData.name}
            onChange={handleChange}
            placeholder="Your full name"
            required
          />
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
          <div>
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              required
              minLength={6}
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
            {strength >= 0 && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-1 flex-1 rounded-full transition-colors"
                      style={{ backgroundColor: i <= strength ? STRENGTH_COLORS[strength] : "#E5E7EB" }}
                    />
                  ))}
                </div>
                <p className="text-xs text-text-muted mt-1">{STRENGTH_LABELS[strength]} password</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-text-muted mb-1">I am a</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "student" })}
                className={`flex items-center justify-center gap-2 border rounded-lg py-2.5 text-sm font-medium transition-colors ${
                  formData.role === "student"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-text-muted hover:border-primary/40"
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                Student
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "instructor" })}
                className={`flex items-center justify-center gap-2 border rounded-lg py-2.5 text-sm font-medium transition-colors ${
                  formData.role === "instructor"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-text-muted hover:border-primary/40"
                }`}
              >
                <Presentation className="w-4 h-4" />
                Instructor
              </button>
            </div>
          </div>

          <Button type="submit" loading={loading}>
            {loading ? "Creating account..." : "Register"}
          </Button>
        </form>

        <p className="text-sm text-text-muted mt-6 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline font-medium">Log in</Link>
        </p>
      </div>
  );
};

export default Register;
