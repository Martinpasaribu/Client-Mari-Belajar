import { SearchX, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface MainEmptyProps {
  title?: string;
  description?: string;
  buttonText?: string;
}

export const MainEmpty = ({ 
  title = "Data Tidak Ditemukan", 
  description = "Maaf, data yang kamu cari tidak tersedia atau telah dihapus.",
  buttonText = "Kembali ke Dashboard"
}: MainEmptyProps) => {
  const router = useRouter();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6"
    >
      <div className="relative mb-8">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-primary-1/20 blur-[60px] rounded-full" />
        
        {/* Icon Container */}
        <div className="relative bg-white dark:bg-dark-bg2 w-24 h-24 rounded-[2.5rem] flex items-center justify-center border border-slate-100 dark:border-white/5 shadow-2xl">
          <SearchX className="text-slate-300 dark:text-slate-600" size={40} />
        </div>
      </div>

      <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-3 italic">
        {title}
      </h2>
      <p className="text-sm text-slate-400 dark:text-slate-500 font-medium max-w-xs leading-relaxed mb-10">
        {description}
      </p>

      <button 
        onClick={() => router.back()}
        className="flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl"
      >
        <ArrowLeft size={16} />
        {buttonText}
      </button>
    </motion.div>
  );
};