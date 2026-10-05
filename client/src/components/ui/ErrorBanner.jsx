import { motion, AnimatePresence } from "framer-motion";

const ErrorBanner = ({ message }) => (
  <AnimatePresence>
    {message && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="mb-4 text-sm text-accent-red border border-accent-red/30 bg-accent-red/5 rounded-lg px-3 py-2 overflow-hidden"
      >
        {message}
      </motion.div>
    )}
  </AnimatePresence>
);

export default ErrorBanner;