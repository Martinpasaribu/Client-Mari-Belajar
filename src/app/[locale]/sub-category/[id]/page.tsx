/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Layers, GraduationCap, ChevronRight, LayoutGrid, Info, Crown } from 'lucide-react';
import { FadeInContainer, FadeInItem } from "@/components/animations/MotionWrapper";
import api from '@/lib/axios';
import { MainLoading } from '@/components/modals/MainLoading';

export default function SubCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const res = await api.get(`/sub-categories/category/${params.id}`);
        const result = await res.data;
        if (result.success) setData(result.data);
      } catch (err) {
        console.error("Failed to fetch sub-categories", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (params.id) fetchSubCategories();
  }, [params.id]);

  if (isLoading) return (
    <>
    {/* GLOBAL LOADER */}
      <MainLoading isOpen={isLoading} title="modules" />
    </>
  );

  if (!data) return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-bg1">
      <Info className="text-slate-300" size={48} />
      <p className="text-slate-500 font-bold">Data tidak ditemukan.</p>
      <button onClick={() => router.back()} className="text-primary-1 font-bold hover:underline">Kembali</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg2 pb-20 transition-colors duration-500">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-primary-2 pt-12 pb-24 px-6 md:px-12">
        <div className="absolute top-[-10%] right-[-10%] h-64 w-64 rounded-full bg-primary-1/20 blur-[100px]" />
        
        <FadeInContainer className="relative z-10 mx-auto max-w-5xl">
          <FadeInItem>
            <button 
              onClick={() => router.back()}
              className="group mb-10 inline-flex items-center gap-2 text-slate-300 transition-colors hover:text-white"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 group-hover:bg-white/10 transition-all">
                <ArrowLeft size={18} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest">Back to Library</span>
            </button>
          </FadeInItem>
          
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <FadeInItem className="flex-1">
              <div className="mb-4 flex items-center gap-2">
                <LayoutGrid size={14} className="text-primary-1" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-1">Modul Materi</span>
              </div>

              <h1 className="mb-6 text-4xl font-black tracking-tighter text-white md:text-6xl italic uppercase">
                {data.name}
              </h1>
              <p className="max-w-xl text-lg font-medium leading-relaxed text-slate-300">
                {data.description || `Kuasai materi ${data.name} secara mendalam dengan kurikulum terstandarisasi.`}
              </p>
            </FadeInItem>

            <FadeInItem>
              <div className="flex flex-col gap-2 rounded-[2.5rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl lg:min-w-[240px]">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-1/80">Total Modules</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white">{data.sub_categories?.length || 0}</span>
                  <span className="text-sm font-bold text-slate-400">Topics</span>
                </div>
              </div>
            </FadeInItem>
          </div>
        </FadeInContainer>
      </div>

      {/* Sub Categories List */}
      <div className="relative z-20 mx-auto -mt-8 md:-mt-12 max-w-5xl px-4 md:px-6">
        <FadeInContainer className="grid grid-cols-1 gap-4 md:gap-5">
          {data.sub_categories?.map((sub: any, idx: number) => (
            <FadeInItem key={sub._id}>
              <div 
                onClick={() => router.push(`/bab/${sub._id}`)}
                className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 overflow-hidden rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 dark:border-white/5 bg-white dark:bg-dark-bg2 p-5 md:p-6 shadow-sm hover:-translate-y-1 hover:border-primary-1/30 hover:shadow-2xl hover:shadow-primary-1/5 cursor-pointer
                transition-all duration-300 ease-out  
                active:scale-95 active:translate-y-0.5 active:shadow-inner
                "
              >
                {/* Number Decor - Hidden on Mobile to save space */}
                <div className="hidden lg:flex text-6xl font-black text-primary-2 opacity-[0.03] absolute left-6 group-hover:text-primary-1 group-hover:opacity-10 transition-all duration-500 italic">
                  {String(idx + 1).padStart(2, '0')}
                </div>

                {/* Icon Container - Scaled for Mobile */}
                <div className="relative z-10 flex h-12 w-12 md:h-16 md:w-16 shrink-0 items-center justify-center rounded-xl md:rounded-2xl bg-slate-50 dark:bg-dark-bg1 transition-all duration-500 group-hover:bg-primary-1 group-hover:shadow-lg group-hover:shadow-primary-1/20">
                  <Layers className="text-slate-400 transition-colors duration-500 group-hover:text-white w-5 h-5 md:w-6 md:h-6" />
                </div>
                
                {/* Content - Full width on Mobile */}
                <div className="flex-1 relative z-10 w-full">
                  <div className="flex items-center justify-between sm:justify-start gap-3">
                    <h4 className="text-lg md:text-xl font-black tracking-tight text-slate-800 dark:text-white transition-colors group-hover:text-primary-1 uppercase italic leading-tight">
                      {sub.name}
                    </h4>
                    {/* Mobile Only Chevron indicator */}
                    <ChevronRight className="sm:hidden text-slate-300 w-5 h-5" />
                  </div>
                  
                  <div className="mt-1 md:mt-2 flex items-center gap-4">
                    <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                      <GraduationCap className="text-primary-1 w-4 h-4" />
                      <span className="text-[10px] md:text-xs font-bold italic tracking-wide line-clamp-1">
                        {sub.sub_description || "Jelajahi materi pembelajaran lengkap di kategori ini."}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Button - Hidden on Mobile, replaced by simple Chevron above */}
                <div className="hidden sm:flex relative z-10 h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-dark-bg1 text-slate-300 transition-all duration-500 group-hover:bg-primary-1 group-hover:text-white group-hover:rotate-[-45deg] group-hover:border-primary-1">
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300" />
                </div>

                {/* Premium Bottom Line Decor */}
                <div className="absolute bottom-0 left-0 h-[3px] md:h-[4px] w-0 bg-primary-1 transition-all duration-500 group-hover:w-full" />
              </div>
            </FadeInItem>
          ))}

          {/* Empty State - Responsive Height */}
          {(!data.sub_categories || data.sub_categories.length === 0) && (
            <FadeInItem>
              <div className="flex flex-col items-center justify-center rounded-[2.5rem] md:rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-white/10 bg-white dark:bg-dark-bg2 py-16 md:py-24 shadow-inner">
                <div className="mb-4 rounded-full bg-slate-50 dark:bg-dark-bg1 p-5 md:p-6 text-slate-300 animate-pulse">
                  <Layers className="w-8 h-8 md:w-10 md:h-10" />
                </div>
                <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-400 italic">No Content Available Yet</p>
              </div>
            </FadeInItem>
          )}
        </FadeInContainer>
      </div>

    </div>
  );
}