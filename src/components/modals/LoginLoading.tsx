import { Loader2, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export const LoginLoading = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white/70 dark:bg-dark-bg1/80 backdrop-blur-xl"
    >
      <div className="flex flex-col items-center gap-5">
        <div className="relative flex items-center justify-center">
          {/* Ring luar statis */}
          <div className="w-20 h-20 rounded-full border-4 border-slate-200/50 dark:border-white/5" />
          
          {/* Spinner loading utuh */}
          <Loader2 
            className="absolute animate-spin text-primary-1 dark:text-dark-primary1" 
            size={80} 
            strokeWidth={1}
          />
          
          {/* Icon di tengah agar lebih premium */}
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: [0.8, 1.1, 0.8] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute text-primary-1 dark:text-dark-primary1"
          >
            <ShieldCheck size={24} />
          </motion.div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-800 dark:text-white">
            Autentikasi Selesai
          </p>
          <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-primary-1 dark:text-dark-primary1 animate-pulse">
            Menyiapkan Dashboard Anda...
          </p>
        </div>
      </div>
    </motion.div>
  );
};