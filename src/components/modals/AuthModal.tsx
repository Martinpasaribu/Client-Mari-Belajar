"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, LogIn, Mail, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md"
          />
          
          {/* Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-sm overflow-hidden rounded-[2.8rem] bg-white dark:bg-dark-bg2 p-8 shadow-2xl border dark:border-white/5"
          >
            <button 
              onClick={onClose} 
              className="absolute right-6 top-6 h-10 w-10 flex items-center justify-center rounded-full bg-bg2 dark:bg-dark-bg1 text-slate-400 hover:text-primary-1 dark:hover:text-dark-primary1 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="text-center mt-4">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[1.8rem] bg-primary-1/10 dark:bg-dark-primary1/10 text-primary-1 dark:text-dark-primary1">
                <LogIn size={36} />
              </div>
              
              <h3 className="mb-2 text-3xl font-black uppercase italic tracking-tighter text-foreground dark:text-white leading-none">
                Akses Terkunci
              </h3>
              <p className="mb-8 text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed px-2">
                Materi ini eksklusif. Silakan masuk untuk melanjutkan progres belajar kamu secara otomatis.
              </p>

              <div className="space-y-3">
                <button 
                  onClick={() => router.push('/auth/login')}
                  className="group flex w-full items-center justify-between rounded-2xl border-2 border-bg2 dark:border-white/5 bg-white dark:bg-dark-bg1 p-4 text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 transition-all hover:border-primary-1/30 dark:hover:border-dark-primary1/30 active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/pwa/google.svg" className="h-5 w-5" alt="google" />
                    <span>Masuk dengan Google</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-primary-1 dark:group-hover:text-dark-primary1 transition-colors" />
                </button>

                <button 
                  onClick={() => router.push('/auth/login')}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary-1 dark:bg-dark-primary1 py-5 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-primary-1/20 transition-all hover:brightness-110 active:scale-[0.98]"
                >
                  <Mail size={16} />
                  Login via Email
                </button>
              </div>

              <p className="mt-8 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Belum punya akun? <span onClick={() => router.push('/auth/register')} className="text-primary-1 dark:text-dark-primary1 cursor-pointer underline">Daftar Sekarang</span>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}