import { motion } from "framer-motion";

const Button = ({ children, loading, ...props }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02, filter: "brightness(1.08)" }}
      whileTap={{ scale: 0.98 }}
      disabled={loading || props.disabled}
      style={{ background: "linear-gradient(135deg, #7678ED, #3D348B)" }}
      className="w-full text-white font-medium py-2.5 rounded-lg shadow-md shadow-primary/20 transition-shadow disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      {...props}
    >
      {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
      {children}
    </motion.button>
  );
};

export default Button;