/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LayoutGrid, Sparkles, BookOpen } from "lucide-react";
import { CategoryCard } from "@/components/card/CategoryCard";
import { FadeInContainer, FadeInItem } from "@/components/animations/MotionWrapper";
import api from "@/lib/axios";

export default function CategoryPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        const data = await res.data;
        if (data.success) setCategories(data.data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (isLoading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg1 dark:bg-dark-bg1">
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary-1/20 border-t-primary-1"></div>
          <LayoutGrid className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-1" size={20} />
        </div>
        <p className="mt-4 text-primary-2 dark:text-primary-1 font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">
          Memuat Library...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-bg1 dark:bg-dark-bg1 transition-colors duration-500">
      {/* Dekorasi Background Subtle */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary-1/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-primary-2/5 blur-[120px] rounded-full pointer-events-none" />

      <FadeInContainer className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 py-16">
        
        {/* Header Section */}
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <FadeInItem className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-1/10 text-primary-1 mb-6">
              <Sparkles size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Platform E-Learning</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black text-primary-2 dark:text-white tracking-tighter mb-6 leading-none uppercase">
              E-Learning <span className="text-primary-1">Library.</span>
            </h1>
            
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed">
              Pilih kategori materi yang ingin kamu pelajari dan mulai tingkatkan skill kamu dengan kurikulum terbaik.
            </p>
          </FadeInItem>

          {/* Stats Singkat */}
          <FadeInItem className="hidden lg:flex items-center gap-6 p-2 bg-white dark:bg-dark-bg2 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <div className="pl-6 py-2">
              <div className="text-2xl font-black text-primary-2 dark:text-white leading-none">{categories.length}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kategori</div>
            </div>
            <div className="h-10 w-[1px] bg-slate-100 dark:bg-white/10" />
            <button className="bg-primary-1 hover:bg-primary-1/90 text-white p-4 rounded-2xl transition-all shadow-lg shadow-primary-1/20 group">
              <BookOpen size={20} className="group-hover:scale-110 transition-transform" />
            </button>
          </FadeInItem>
        </header>

        {/* Grid Categories */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <FadeInItem key={cat._id}>
              <CategoryCard 
                category={cat} 
                onClick={() => router.push(`/sub-category/${cat._id}`)} 
              />
            </FadeInItem>
          ))}
        </div>

        {/* Empty State */}
        {categories.length === 0 && (
          <FadeInItem className="bg-bg2 dark:bg-dark-bg2 rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-100 dark:border-white/5">
             <LayoutGrid className="mx-auto text-slate-300 mb-4" size={48} />
             <p className="text-slate-400 font-bold tracking-tight uppercase text-sm">Belum ada kategori tersedia.</p>
          </FadeInItem>
        )}

      </FadeInContainer>
    </div>
  );
}