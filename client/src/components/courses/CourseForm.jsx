import { motion } from "framer-motion";
import Input from "../ui/Input";
import Button from "../ui/Button";
import ErrorBanner from "../ui/ErrorBanner";

const CourseForm = ({ formData, onChange, onSubmit, loading, error, submitLabel }) => {
  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={onSubmit}
      className="max-w-xl space-y-4"
    >
      <ErrorBanner message={error} />

      <Input label="Title" type="text" name="title" value={formData.title} onChange={onChange} required />

      <div>
        <label className="block text-sm text-text-muted mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={onChange}
          required
          rows={3}
          className="w-full border border-border rounded-lg px-3 py-2.5 text-text transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
        />
      </div>

      <div>
        <label className="block text-sm text-text-muted mb-1">Content</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={onChange}
          required
          rows={6}
          className="w-full border border-border rounded-lg px-3 py-2.5 text-text transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
        />
      </div>

      <div className="max-w-xs">
        <Button type="submit" loading={loading}>
          {loading ? "Saving..." : submitLabel}
        </Button>
      </div>
    </motion.form>
  );
};

export default CourseForm;