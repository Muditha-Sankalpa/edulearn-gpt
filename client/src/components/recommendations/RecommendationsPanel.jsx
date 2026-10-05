import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, BookOpen, X } from "lucide-react";
import axiosClient from "../../api/axiosClient";
import Button from "../ui/Button";
import ErrorBanner from "../ui/ErrorBanner";

const RecommendationsPanel = ({ open, onClose }) => {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setError("");
    setResult(null);
    setLoading(true);
    try {
      const res = await axiosClient.post("/recommendations", { prompt });
      setResult(res.data);
    } catch (err) {
      if (err.response?.status === 429) {
        setError("You've hit today's recommendation limit. Try again tomorrow.");
      } else {
        setError(err.response?.data?.message || "Failed to get recommendations. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-surface border-l border-border z-50 flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between px-5 h-16 border-b border-border shrink-0">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #7678ED, #3D348B)" }}
                >
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h2 className="font-semibold text-text">Course Recommendations</h2>
              </div>
              <button onClick={onClose} className="text-text-muted hover:text-text transition-colors" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <p className="text-text-muted text-sm mb-4">
                Tell us what you're working toward and we'll suggest courses.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3 mb-6">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. I want to be a software engineer, what courses should I follow?"
                  rows={3}
                  required
                  className="w-full border border-border rounded-lg px-3 py-2.5 text-text text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
                <Button type="submit" loading={loading}>
                  {loading ? "Thinking..." : "Get recommendations"}
                </Button>
              </form>

              <ErrorBanner message={error} />

              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-border rounded-xl p-4"
                >
                  <p className="text-text text-sm mb-4">{result.message}</p>

                  {result.recommendedCourses?.length > 0 ? (
                    <ul className="space-y-2">
                      {result.recommendedCourses.map((title, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <BookOpen className="w-4 h-4 text-primary shrink-0" />
                          <span className="text-text">{title}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-text-muted text-sm">No matching courses found right now.</p>
                  )}

                  <Link
                    to="/courses"
                    onClick={onClose}
                    className="text-primary text-sm font-medium hover:underline mt-4 inline-block"
                  >
                    Browse all courses →
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RecommendationsPanel;
