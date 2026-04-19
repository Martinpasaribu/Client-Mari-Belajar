/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowRight, BookOpen, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import RichTextDisplay from '../display/RichTextDisplay';

interface CategoryCardProps {
  category: any;
  onClick: () => void;
}

export const CategoryCard = ({ category, onClick }: CategoryCardProps) => {
  return (
    <motion.article
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative flex h-[400px] w-full cursor-pointer flex-col overflow-hidden rounded-[3rem] bg-white dark:bg-dark-bg2 p-2 transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_40px_80px_-15px_rgba(var(--primary-1-rgb),0.25)]"
    >
      {/* 1. Dynamic Background Morphing */}
      <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-slate-50 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[10] group-hover:bg-primary-1" />
      
      {/* 2. Floating Iconic Image (Muncul saat Hover) */}
      <div className="absolute -right-4 top-20 w-32 opacity-0 scale-50 blur-sm translate-x-10 transition-all duration-500 group-hover:opacity-20 group-hover:scale-110 group-hover:translate-x-0 group-hover:blur-0 z-0">
        <img 
          src="assets/animation/icon/a1.png" 
          alt="decoration" 
          className="w-full h-auto grayscale brightness-200"
        />
      </div>

      <div className="relative z-10 flex h-full flex-col p-5 md:p-8">
        
        {/* Header Section */}
        <header className="flex items-start justify-between">
          <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 transition-all duration-500 group-hover:rotate-[-6deg] group-hover:scale-110 group-hover:shadow-primary-1/20 group-hover:ring-white/20">
            {category.icon ? (
              <img src={category.icon.url} alt={category.name} className="h-8 w-8 object-contain" />
            ) : (
              <BookOpen size={28} className="text-primary-1" />
            )}
          </div>

          <div className="flex items-center gap-2 rounded-full bg-slate-100/80 px-4 py-2 backdrop-blur-md transition-all duration-500 group-hover:bg-white/20">
            <Layers size={14} className="text-slate-500 group-hover:text-white" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover:text-white">
              {category.subCategoryCount || 0} Topics
            </span>
          </div>
        </header>

        {/* Content Section */}
        <div className="mt-5 md:mt-12 flex-1">
          <div className="space-y-1 mb-3">
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-1 group-hover:text-white/60 transition-colors">
               Kategori 
             </span>
             <h3 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white transition-colors duration-500 group-hover:text-white uppercase leading-none">
               {category.name}
             </h3>
          </div>
          <p className="line-clamp-3 text-sm font-medium leading-relaxed text-slate-500 transition-colors duration-500 group-hover:text-white/90">
            <RichTextDisplay content={category.sub_description || `Eksplorasi materi ${category.name} secara mendalam dengan standar kurikulum terbaru.`} />
          </p>
        </div>

        {/* Footer / CTA Section */}
        <footer className="mt-1 md:mt-6 flex items-center justify-between overflow-hidden rounded-[1.5rem] border border-slate-100 bg-slate-50/50 p-1.5 backdrop-blur-sm transition-all duration-500 group-hover:border-white/30 group-hover:bg-white/10">
          <div className="flex items-center gap-3 pl-4">
            <div className="h-2 w-2 rounded-full bg-primary-1 group-hover:bg-white animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-700 dark:text-white transition-colors duration-500 group-hover:text-white">
              Start Learn
            </span>
          </div>
          
          <div className="flex h-12 w-12 items-center justify-center rounded-[1.2rem] bg-white text-primary-1 shadow-sm transition-all duration-500 group-hover:bg-white group-hover:text-slate-900 group-hover:rotate-[-10deg]">
            <ArrowRight size={22} strokeWidth={3} className="transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </footer>

      </div>

      {/* Outer Border Layer */}
      <div className="absolute inset-0 rounded-[3rem] border-2 border-slate-100 dark:border-white/5 transition-all duration-500 group-hover:border-transparent" />
    </motion.article>
  );
};