import { motion } from "framer-motion";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-surface">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #3D348B 0%, #7678ED 35%, #F7B801 70%, #F35B04 100%)",
          }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-white/10 blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, 60, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "10%", left: "10%" }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full bg-white/10 blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, -40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{ bottom: "15%", right: "10%" }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-white text-center px-12"
        >
          <h1 className="text-4xl font-bold mb-4">EduLearn</h1>
          <p className="text-white/80 text-lg">
            Learn what matters — courses picked for where you want to go.
          </p>
        </motion.div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;