"use client";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X, ShieldAlert } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isLoading?: boolean;
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title, description, isLoading }: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          {/* Overlay with high blur */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
          />
          
          {/* Modal Content */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, rotateX: -10 }}
            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
            exit={{ scale: 0.9, opacity: 0, rotateX: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden"
          >
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-1 to-primary-2" />

            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-primary-1/10 text-primary-1 rounded-3xl flex items-center justify-center mb-8 rotate-0">
                <ShieldAlert size={40} />
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4 italic">
                {title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed mb-10 px-4">
                {description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <button 
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 order-2 sm:order-1 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-white/5 transition-all outline-none"
                >
                  Mungkin Nanti
                </button>
                <button 
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="flex-1 order-1 sm:order-2 py-5 bg-slate-900 dark:bg-primary-1 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]  hover:scale-[1.05] active:scale-95 transition-all disabled:opacity-50"
                >
                  {isLoading ? "Processing..." : "Konfirmasi"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}