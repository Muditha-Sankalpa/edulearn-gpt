import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const Modal = ({ open, onClose, title, subtitle, children, maxWidth = "max-w-xl" }) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40"
        />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`bg-surface border border-border rounded-xl shadow-2xl w-full ${maxWidth} max-h-[85vh] overflow-y-auto p-6 pointer-events-auto`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                {title && <h2 className="font-semibold text-text">{title}</h2>}
                {subtitle && <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>}
              </div>
              <button onClick={onClose} className="text-text-muted hover:text-text transition-colors shrink-0" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      </>
    )}
  </AnimatePresence>
);

export default Modal;
