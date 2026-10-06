import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import RecommendationsPanel from "../recommendations/RecommendationsPanel";
import ScrollToTop from "../ui/ScrollToTop";

const MainLayout = () => {
  const location = useLocation();
  const [recommendationsOpen, setRecommendationsOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background relative flex flex-col">
      <div
        className="fixed top-0 left-0 right-0 h-0.75 z-50"
        style={{ background: "linear-gradient(90deg, #3D348B, #7678ED, #F7B801, #F18701, #F35B04)" }}
      />

      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(rgba(107,114,128,0.12) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <motion.div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-[0.12] blur-3xl"
          style={{ background: "linear-gradient(135deg, #7678ED, #F18701)" }}
          animate={{ x: [0, 30, 0], y: [0, 40, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 -left-40 w-96 h-96 rounded-full opacity-[0.10] blur-3xl"
          style={{ background: "linear-gradient(135deg, #3D348B, #F35B04)" }}
          animate={{ x: [0, -25, 0], y: [0, -35, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <Navbar onOpenRecommendations={() => setRecommendationsOpen(true)} />
      <main className="max-w-6xl mx-auto px-4 py-8 relative flex-1 w-full">
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <ScrollToTop />
      <RecommendationsPanel open={recommendationsOpen} onClose={() => setRecommendationsOpen(false)} />
    </div>
  );
};
export default MainLayout;