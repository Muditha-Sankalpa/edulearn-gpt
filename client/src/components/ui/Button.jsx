import { motion } from "framer-motion";

const Button = ({ children, loading, ...props }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      disabled={loading || props.disabled}
      className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      {...props}
    >
      {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
      {children}
    </motion.button>
  );
};

export default Button;