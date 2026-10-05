import { Outlet, useLocation, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import logo from "../../assets/logo.webp";
import authBg from "../../assets/auth-bg.webp";

const AuthLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${authBg})` }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #3D348B 0%, #7678ED 35%, #F7B801 70%, #F35B04 100%)",
            opacity: 0.82,
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
        <div className="relative z-10 text-white text-center px-12">
          <Link to="/courses" className="bg-white rounded-2xl p-5 inline-block mb-6 shadow-xl">
            <img src={logo} alt="EduLearn" className="h-20 w-auto" />
          </Link>
          <p className="text-white/80 text-lg max-w-xs mx-auto">
            Learn what matters — courses picked for where you want to go.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center lg:hidden"
          style={{ backgroundImage: `url(${authBg})` }}
        />
        <div
          className="absolute inset-0 lg:hidden"
          style={{
            background: "linear-gradient(135deg, #3D348B 0%, #7678ED 35%, #F7B801 70%, #F35B04 100%)",
            opacity: 0.85,
          }}
        />

        <Link to="/courses" className="mb-8 lg:hidden relative z-10">
          <img src={logo} alt="EduLearn" className="h-14 w-auto" />
        </Link>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full flex justify-center relative z-10"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthLayout;
