"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, AlertTriangle, XCircle, Info, Loader2, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info" | "loading" | "default";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  hideToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const hideToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = "default") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto close jika bukan loading
    if (type !== "loading") {
      setTimeout(() => hideToast(id), 4000);
    }
  }, [hideToast]);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 w-full max-w-xs">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => hideToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Komponen Internal Toast Item
const ToastItem = ({ toast, onClose }: { toast: Toast; onClose: () => void }) => {
  const icons = {
    success: <CheckCircle className="text-emerald-500" size={20} />,
    error: <XCircle className="text-rose-500" size={20} />,
    warning: <AlertTriangle className="text-amber-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />,
    loading: <Loader2 className="text-indigo-500 animate-spin" size={20} />,
    default: <div className="w-5 h-5 bg-slate-200 rounded-full" />,
  };

  const styles = {
    success: "border-emerald-100 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-900/50",
    error: "border-rose-100 bg-rose-50 dark:bg-rose-950/30 dark:border-rose-900/50",
    warning: "border-amber-100 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900/50",
    info: "border-blue-100 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-900/50",
    loading: "border-indigo-100 bg-indigo-50 dark:bg-indigo-950/30 dark:border-indigo-900/50",
    default: "border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800",
  };

  return (
    <div className={`flex items-center gap-3 p-4 rounded-2xl border shadow-lg animate-in fade-in slide-in-from-right-5 duration-300 ${styles[toast.type]}`}>
      <div className="shrink-0">{icons[toast.type]}</div>
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex-1">
        {toast.message}
      </p>
      <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
        <X size={16} />
      </button>
    </div>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};