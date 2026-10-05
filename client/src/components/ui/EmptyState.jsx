import { motion } from "framer-motion";

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center text-center py-20">
    {Icon && (
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
        style={{ background: "linear-gradient(135deg, rgba(118,120,237,0.15), rgba(241,135,1,0.15))" }}
      >
        <Icon className="w-6 h-6 text-primary" />
      </div>
    )}
    <h3 className="text-text font-semibold mb-1">{title}</h3>
    {description && <p className="text-text-muted text-sm mb-5 max-w-xs">{description}</p>}
    {action}
  </motion.div>
);
export default EmptyState;