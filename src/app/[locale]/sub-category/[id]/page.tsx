/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Layers, GraduationCap, ChevronRight, LayoutGrid, Info } from 'lucide-react';
import { FadeInContainer, FadeInItem } from "@/components/animations/MotionWrapper";
import api from '@/lib/axios';

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
    <div className="flex h-screen items-center justify-center bg-bg1">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-1 border-t-transparent"></div>
        <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest animate-pulse">Memuat Materi...</p>
      </div>
    </div>
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
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-1">Curriculum</span>
              </div>
              <h1 className="mb-6 text-5xl font-black tracking-tighter text-white md:text-6xl italic uppercase">
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
      <div className="relative z-20 mx-auto -mt-12 max-w-5xl px-6">
        <FadeInContainer className="grid grid-cols-1 gap-5">
          {data.sub_categories?.map((sub: any, idx: number) => (
            <FadeInItem key={sub._id}>
              <div 
                onClick={() => router.push(`/bab/${sub._id}`)}
                className="group relative flex items-center gap-6 overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-primary-1/30 hover:shadow-2xl hover:shadow-primary-2/5 cursor-pointer"
              >
                {/* Number Decor */}
                <div className="hidden sm:flex text-5xl font-black text-primary-2 opacity-[0.03] absolute left-6 group-hover:text-primary-1 group-hover:opacity-10 transition-all duration-500">
                  {String(idx + 1).padStart(2, '0')}
                </div>

                {/* Icon Container */}
                <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-bg2 transition-all duration-500 group-hover:bg-primary-1 group-hover:shadow-lg group-hover:shadow-primary-1/20">
                  <Layers className="text-slate-400 transition-colors duration-500 group-hover:text-white" size={24} />
                </div>
                
                {/* Content */}
                <div className="flex-1 relative z-10">
                  <h4 className="text-xl font-black tracking-tight text-slate-800 transition-colors group-hover:text-primary-2 uppercase">
                    {sub.name}
                  </h4>
                  <div className="mt-1 flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <GraduationCap size={16} className="text-primary-1" />
                      <span className="text-xs font-bold italic tracking-wide">Available Chapters</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-slate-100 bg-slate-50 text-slate-300 transition-all duration-500 group-hover:bg-primary-2 group-hover:text-white group-hover:shadow-lg group-hover:border-primary-2">
                  <ChevronRight size={22} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </div>

                <div className="absolute bottom-0 left-0 h-[4px] w-0 bg-primary-1 transition-all duration-500 group-hover:w-full" />
              </div>
            </FadeInItem>
          ))}

          {/* Empty State */}
          {(!data.sub_categories || data.sub_categories.length === 0) && (
            <FadeInItem>
              <div className="flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-slate-200 bg-white py-24 shadow-inner">
                <div className="mb-4 rounded-full bg-bg2 p-6 text-slate-300 animate-bounce">
                  <Layers size={40} />
                </div>
                <p className="text-sm font-black uppercase tracking-widest text-slate-400">No Content Available Yet</p>
              </div>
            </FadeInItem>
          )}
        </FadeInContainer>
      </div>
    </div>
  );
}