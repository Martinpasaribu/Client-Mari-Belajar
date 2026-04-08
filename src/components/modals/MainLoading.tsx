/* eslint-disable @typescript-eslint/no-explicit-any */
import { Loader2, BookOpen, PenTool, Trophy, Layers, Newspaper, TablePropertiesIcon, PenLine, AccessibilityIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MainLoaderProps {
  isOpen: boolean;
  title?: "category" | "question" | "quiz" | "general" | string;
}

export const MainLoading = ({ isOpen, title = "general" }: MainLoaderProps) => {
  // Konfigurasi konten berdasarkan title
  const config: any = {
    category: {
      icon: <Layers className="text-primary-1" size={28} />,
      text: "Menyiapkan Kategori Materi...",
      subText: "Menyusun katalog terbaik untukmu"
    },
    bab: {
      icon: <BookOpen className="text-primary-1" size={28} />,
      text: "Membuka Bab Soal...",
      subText: "Sedang mengambil data bab soal terbaru"
    },
    submit: {
      icon: <AccessibilityIcon className="text-primary-1" size={28} />,
      text: "Mengirim Jawaban...",
      subText: "Sedang memproses jawabanmu"
    },
    modules: {
      icon: <TablePropertiesIcon className="text-primary-1" size={28} />,
      text: "Membuka Module...",
      subText: "Sedang mengambil module terbaru"
    },
    catalogs: {
      icon: <Newspaper className="text-primary-1" size={28} />,
      text: "Membuka Catalogs...",
      subText: "Sedang mengambil data catalogs terbaru"
    },
    quiz: {
      icon: <PenLine className="text-primary-1" size={28} />,
      text: "Memulai Kuis...",
      subText: "Siapkan dirimu, semoga berhasil!"
    },
    general: {
      icon: <PenTool className="text-primary-1" size={28} />,
      text: "Sedang Memproses...",
      subText: "Mohon tunggu sebentar"
    }
  };

  // Ambil data berdasarkan title, jika tidak ada gunakan 'general'
  const content = config[title] || { 
    icon: config.general.icon, 
    text: title, // Jika input string bebas, jadikan sebagai judul utama
    subText: config.general.subText 
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-white/80 dark:bg-dark-bg1/90 backdrop-blur-xl"
        >
          <div className="flex flex-col items-center text-center px-6">
            <div className="relative flex items-center justify-center mb-6">
              {/* Outer Ring */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-24 h-24 rounded-full border-[3px] border-slate-100 dark:border-white/5 border-t-primary-1 dark:border-t-dark-primary1"
              />
              
              {/* Inner Icon dengan Efek Pulse */}
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: [0.8, 1, 0.8] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute flex items-center justify-center bg-white dark:bg-dark-bg2 w-16 h-16 rounded-3xl shadow-xl shadow-primary-1/10 border border-slate-50 dark:border-white/5"
              >
                {content.icon}
              </motion.div>
            </div>

            {/* Typography */}
            <motion.h3 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white mb-1"
            >
              {content.text}
            </motion.h3>
            <motion.p 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]"
            >
              {content.subText}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};