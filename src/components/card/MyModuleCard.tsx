/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { PlayCircle, Award, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function MyModuleCard({ enrollment }: { enrollment: any }) {
  const { sub_category_key: subCategory, status } = enrollment;

  // Mock progress (nanti bisa diambil dari backend kuis)
  const progress = enrollment.progress || 0; 

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-5 transition-all hover:border-primary/50 group">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
          <BarChart3 size={24} />
        </div>
        {status === 'success' ? (
          <span className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-[10px] font-black uppercase tracking-widest rounded-lg">
            Aktif
          </span>
        ) : (
          <span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-lg">
            {status}
          </span>
        )}
      </div>

      <h3 className="text-lg font-black text-slate-800 dark:text-white mb-1 leading-tight uppercase tracking-tighter line-clamp-1">
        {subCategory?.name || "Judul Modul"}
      </h3>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
        {subCategory?.category_key?.title || "Kategori"}
      </p>

      {/* Progress Bar */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">
          <span>Progres Belajar</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>

      <Link 
        href={`/dashboard/modules/${subCategory?.id || subCategory?._id}`}
        className="flex items-center justify-center gap-2 w-full py-3 bg-primary-2 dark:bg-primary-1 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary transition-all active:scale-95"
      >
        <PlayCircle size={18} />
        Mulai Belajar
      </Link>
    </div>
  );
}