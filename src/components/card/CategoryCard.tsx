/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowRight, BookOpen, Layers } from 'lucide-react';

interface CategoryCardProps {
  category: any;
  onClick: () => void;
}

export const CategoryCard = ({ category, onClick }: CategoryCardProps) => {
  return (
    <div
      onClick={onClick}
      className="group relative flex h-[340px] w-full cursor-pointer flex-col overflow-hidden rounded-[2.5rem] bg-white dark:bg-dark-bg2 p-2 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(79,70,229,0.2)]"
    >
      {/* Background Accent - Sekarang menggunakan lingkaran yang lebih soft */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-slate-50 transition-all duration-700 ease-in-out group-hover:scale-[6] group-hover:bg-primary-1 dark:group-hover:bg-dark-primary1" />
      
      {/* Container utama dengan padding internal */}
      <div className="relative z-10 flex h-full flex-col p-7">
        
        {/* Header: Icon & Badge */}
        <div className="flex items-start justify-between">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-sm ring-1 ring-slate-100 transition-all duration-500 group-hover:bg-white group-hover:shadow-primary-1 group-hover:ring-transparent">
            {category.icon ? (
              <img src={category.icon.url} alt="" className="h-8 w-8 object-contain" />
            ) : (
              <BookOpen size={28} className="text-primary-2" />
            )}
          </div>

          <div className="flex items-center gap-1.5 rounded-2xl bg-slate-100/50 px-3 py-1.5 backdrop-blur-sm transition-all duration-500 group-hover:bg-white/10 group-hover:text-white">
            <Layers size={14} className="text-slate-400 group-hover:text-white" />
            <span className=" text-[10px] font-black uppercase tracking-wider text-slate-500 group-hover:text-white">
              {category.sub_categories?.length || 0} Modules
            </span>
          </div>
        </div>

        {/* Spacer & Body */}
        <div className="mt-10 flex-1">
          <h3 className="mb-3 text-2xl font-black tracking-tight text-primary-1 transition-colors duration-500 group-hover:text-white">
            {category.name}
          </h3>
          <p className=" h-16 line-clamp-3 text-sm font-medium leading-relaxed text-slate-500 transition-colors duration-500 group-hover:text-indigo-50/80">
            {category.sub_description || `Kuasai keahlian ${category.name} melalui modul pembelajaran yang terstruktur.`}
          </p>
        </div>

        {/* Footer: Action */}
        <div className="mt-6 flex items-center justify-between bg-white rounded-2xl p-1 group-hover:border-dark-primary1 border">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-1 transition-colors duration-500 group-hover:text-black px-4 ">
              Explore Course
            </span>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-50 text-primary-1 transition-all duration-500 group-hover:bg-slate-900 group-hover:text-white group-hover:shadow-lg">
            <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>

      </div>

      {/* Border subtle yang hanya terlihat saat tidak hover */}
      <div className="absolute inset-0 rounded-[2.5rem] border border-slate-100 transition-opacity duration-500 group-hover:opacity-0" />
    </div>
  );
};