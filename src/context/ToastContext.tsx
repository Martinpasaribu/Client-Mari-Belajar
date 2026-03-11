/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, AlertTriangle, XCircle, Info, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type ToastType = "success" | "error" | "warning" | "info" | "loading" | "default";

interface Toast {
  type: ToastType;
  message: string;
  id: number;
}

interface ToastContextType {
  showToast: (arg1: string, arg2?: ToastType | string) => number;
  updateToast: (id: number, message: string, type?: ToastType) => void;
  hideToast: (id: number) => void;
  showLoading: (message: string) => { 
    done: (msg: string) => void; 
    error: (msg: string) => void;
    remove: () => void;
  };
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const hideToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const showToast = useCallback((arg1: string, arg2?: ToastType | string) => {
    const validTypes: ToastType[] = ["success", "error", "warning", "info", "loading", "default"];
    
    let finalMessage: string;
    let finalType: ToastType;

    // LOGIKA CERDAS: Mendeteksi apakah arg1 adalah tipe
    if (validTypes.includes(arg1 as ToastType)) {
      finalType = arg1 as ToastType;
      finalMessage = typeof arg2 === "string" ? arg2 : "Terjadi kesalahan";
    } else {
      finalMessage = arg1;
      finalType = (validTypes.includes(arg2 as ToastType) ? arg2 : "default") as ToastType;
    }

    const id = Date.now();
    setToasts((prev) => [...prev, { id, message: finalMessage, type: finalType }]);

    if (finalType !== "loading") {
      setTimeout(() => hideToast(id), 4000);
    }
    
    return id;
  }, [hideToast]);

  const updateToast = useCallback((id: number, message: string, type: ToastType = "default") => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, message, type } : t))
    );

    if (type !== "loading") {
      setTimeout(() => hideToast(id), 4000);
    }
  }, [hideToast]);

  const showLoading = useCallback((message: string) => {
    const id = showToast(message, "loading");
    return {
      done: (msg: string) => updateToast(id, msg, "success"),
      error: (msg: string) => updateToast(id, msg, "error"),
      remove: () => hideToast(id),
    };
  }, [showToast, updateToast, hideToast]);

  return (
    <ToastContext.Provider value={{ showToast, hideToast, updateToast, showLoading, clearAllToasts }}>
      {children}
      
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 w-full max-w-xs pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onClose={() => hideToast(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ toast, onClose }: { toast: Toast; onClose: () => void }) => {
  const icons = {
    success: <CheckCircle className="text-emerald-500" size={20} />,
    error: <XCircle className="text-rose-500" size={20} />,
    warning: <AlertTriangle className="text-amber-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />,
    loading: <Loader2 className="text-indigo-500 animate-spin" size={20} />,
    default: <Info className="text-slate-500" size={20} />,
  };

  const styles = {
    success: "border-emerald-200/50 bg-white/80 dark:bg-emerald-950/20 shadow-emerald-500/10",
    error: "border-rose-200/50 bg-white/80 dark:bg-rose-950/20 shadow-rose-500/10",
    warning: "border-amber-200/50 bg-white/80 dark:bg-amber-950/20 shadow-amber-500/10",
    info: "border-blue-200/50 bg-white/80 dark:bg-blue-950/20 shadow-blue-500/10",
    loading: "border-indigo-200/50 bg-white/80 dark:bg-indigo-950/20 shadow-indigo-500/10",
    default: "border-slate-200/50 bg-white/80 dark:bg-slate-900/20 shadow-slate-500/10",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9, filter: "blur(8px)" }}
      animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.9, x: 20, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`pointer-events-auto flex items-center gap-3 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl ${styles[toast.type]}`}
    >
      <div className="shrink-0 p-2 bg-white dark:bg-white/5 rounded-xl shadow-sm">
        {icons[toast.type]}
      </div>
      
      <div className="flex-1">
        {/* <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-0.5">
            {toast.type}
        </p> */}
        <p className="text-xs font-bold text-slate-700 dark:text-slate-100 leading-tight">
            {toast.message}
        </p>
      </div>

      <button 
        onClick={onClose} 
        className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 transition-colors"
      >
        <X size={14} />
      </button>

      {toast.type !== 'loading' && (
        <motion.div 
            key={toast.id}
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 4, ease: "linear" }}
            className={`absolute bottom-0 left-4 right-4 h-[2px] rounded-full origin-left bg-current opacity-20`}
        />
      )}
    </motion.div>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};