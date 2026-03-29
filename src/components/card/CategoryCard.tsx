/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowRight, BookOpen, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

interface CategoryCardProps {
  category: any;
  onClick: () => void;
}

export const CategoryCard = ({ category, onClick }: CategoryCardProps) => {
  return (
    <motion.article
      onClick={onClick}
      // Animasi saat ditekan
      whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
      // Animasi masuk (initial load)
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative flex h-[360px] w-full cursor-pointer flex-col overflow-hidden rounded-[2.5rem] bg-white dark:bg-dark-bg2 p-2 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(79,70,229,0.2)]"
    >
      {/* Background Accent Sphere */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-slate-50 transition-all duration-700 ease-in-out group-hover:scale-[7] group-hover:bg-primary-1 dark:group-hover:bg-dark-primary1" />
      
      <div className="relative z-10 flex h-full flex-col p-7">
        
        {/* Header Section: Icon & Badge */}
        <header className="flex items-start justify-between">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-sm ring-1 ring-slate-100 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:shadow-xl group-hover:ring-transparent">
            {category.icon ? (
              <img src={category.icon.url} alt={category.name} className="h-8 w-8 object-contain" />
            ) : (
              <BookOpen size={28} className="text-primary-1" />
            )}
          </div>

          <div className="flex items-center gap-1.5 rounded-2xl bg-slate-100/50 px-3 py-2 backdrop-blur-sm transition-all duration-500 group-hover:bg-white/20 group-hover:text-white">
            <Layers size={14} className="text-slate-400 group-hover:text-white" />
            <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 group-hover:text-white">
              {category.subCategoryCount || 0} Modul
            </span>
          </div>
        </header>

        {/* Body Section: Content */}
        <div className="mt-auto mb-6">
          <h3 className="mb-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white transition-colors duration-500 group-hover:text-white uppercase italic leading-none">
            {category.name}
          </h3>
          <p className="line-clamp-3 text-sm font-medium leading-relaxed text-slate-500 transition-colors duration-500 group-hover:text-white/80">
            {category.sub_description || `Kuasai keahlian ${category.name} melalui modul pembelajaran yang terstruktur.`}
          </p>
        </div>

        {/* Footer Section: Action Button */}
        <footer className="
          mt-auto flex items-center justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white/50 dark:bg-gray-200 dark:text-primary-1 p-1 backdrop-blur-sm 
          
          /* TRANSISI & HOVER */
          transition-all duration-300 ease-out 
          hover:border-white/20 hover:bg-white/10 hover:-translate-y-1 hover:shadow-md
          
          /* EFEK MELAMBUNG SAAT DITEKAN (ACTIVE) */
          active:scale-95 active:translate-y-0.5 active:shadow-inner
          
          cursor-pointer group-hover:border-dark-primary1
        ">
          <span className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-primary-1 transition-colors duration-500 group-hover:text-white">
            Lihat Materi
          </span>
          
          <div className="
            flex h-11 w-11 items-center justify-center rounded-xl bg-primary-1 text-white shadow-md 
            transition-all duration-300 
            group-hover:bg-slate-900 group-hover:shadow-lg
            /* Efek tambahan pada icon saat ditekan */
            active:scale-90
          ">
            <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </footer>

      </div>

      {/* Subtle Default Border */}
      <div className="absolute inset-0 rounded-[2.5rem] border border-slate-100 dark:border-white/5 transition-opacity duration-500 group-hover:opacity-0" />
    </motion.article>
  );
};