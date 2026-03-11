import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export const LogoutLoading = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white/60 dark:bg-dark-bg1/60 backdrop-blur-md"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-slate-200 dark:border-white/10" />
          <Loader2 className="absolute top-0 animate-spin text-primary-1" size={64} />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-800 dark:text-white animate-pulse">
          Processing Logout...
        </p>
      </div>
    </motion.div>
  );
};