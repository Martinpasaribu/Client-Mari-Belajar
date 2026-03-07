/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Clock, 
  ChevronRight, 
  FileText, 
  Lock,
  Trophy,
  BookOpen
} from 'lucide-react';
import { FadeInContainer, FadeInItem } from "@/components/animations/MotionWrapper";

export default function BabPage() {
  const params = useParams();
  const router = useRouter();
  
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBab = async () => {
      try {
        const res = await fetch(`http://localhost:5002/api/v1/bab/${params.id}/sub_category`);
        const result = await res.json();
        if (result.success) setData(result.data);
      } catch (err) {
        console.error("Failed to fetch bab", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (params.id) fetchBab();
  }, [params.id]);

  if (isLoading) return (
    <div className="flex h-screen items-center justify-center bg-bg1">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-1 border-t-transparent"></div>
    </div>
  );

  if (!data) return <div className="p-20 text-center font-bold bg-bg1 text-foreground">Materi belum tersedia.</div>;

  return (
    <div className="min-h-screen bg-bg1">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur-md px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 hover:text-primary-2 transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold tracking-tight">Kembali</span>
          </button>
          <div className="hidden md:flex items-center gap-3">
            <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-primary-1 w-1/12"></div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Progres Belajar</span>
          </div>
        </div>
      </nav>

      <FadeInContainer className="mx-auto max-w-4xl px-6 py-12">
        {/* Header Section */}
        <FadeInItem className="mb-16">
          <div className="mb-6 inline-flex items-center gap-2 rounded-xl bg-primary-1/10 px-4 py-2 text-primary-1">
            <BookOpen size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Learning Path</span>
          </div>
          
          <h1 className="text-4xl font-black tracking-tighter text-foreground md:text-6xl mb-6 uppercase italic">
             {data.sub_category?.name || "Materi Belajar"}
          </h1>
          
          <p className="max-w-2xl text-lg font-medium leading-relaxed text-slate-500">
            {data.sub_category?.sub_description || "Selesaikan seluruh rangkaian bab untuk menguasai materi ini secara tuntas."}
          </p>
        </FadeInItem>

        {/* Lessons List */}
        <div className="relative space-y-6">
          {/* Vertical Line */}
          <div className="absolute left-10 top-0 h-full w-[2px] bg-slate-100" />

          {data.babs?.map((bab: any, index: number) => {
            const isLocked = false; 
            
            return (
              <FadeInItem key={bab._id}>
                <div 
                  onClick={() => !isLocked && router.push(`/attempt/${bab._id}`)}
                  className={`group relative flex items-center gap-8 rounded-[2.5rem] border p-5 transition-all duration-500 ${
                    isLocked 
                    ? 'border-transparent bg-bg2/50 opacity-60 cursor-not-allowed' 
                    : 'cursor-pointer border-white bg-white shadow-sm hover:border-primary-1/30 hover:shadow-2xl hover:shadow-primary-2/5'
                  }`}
                >
                  {/* Chapter Number Badge */}
                  <div className={`relative z-10 flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.8rem] shadow-sm transition-all duration-500 ${
                    isLocked 
                    ? 'bg-slate-200 text-slate-400' 
                    : 'bg-bg2 text-primary-2 group-hover:bg-primary-2 group-hover:text-white'
                  }`}>
                    {isLocked ? (
                      <Lock size={28} />
                    ) : (
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-black opacity-40 uppercase tracking-tighter">Bab</span>
                          <span className="text-2xl font-black leading-none">{index + 1}</span>
                      </div>
                    )}
                  </div>

                  {/* Info Content */}
                  <div className="flex-1">
                    <h4 className={`text-xl font-black tracking-tight mb-2 transition-colors uppercase ${
                      isLocked ? 'text-slate-400' : 'text-foreground group-hover:text-primary-2'
                    }`}>
                      {bab.name}
                    </h4>
                    
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-500 group-hover:bg-primary-1 group-hover:text-white transition-colors">
                        <Clock size={12} />
                        <span>{bab.estimatedTime || 15} Menit</span>
                      </div>
                      <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-500 group-hover:bg-primary-1 group-hover:text-white transition-colors">
                        <FileText size={12} />
                        <span>{bab.totalQuestions || 0} Soal Latihan</span>
                      </div>
                    </div>
                  </div>

                  {/* Arrow Icon */}
                  {!isLocked && (
                    <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-bg2 text-slate-300 transition-all duration-500 group-hover:bg-primary-1 group-hover:text-white group-hover:rotate-[-45deg]">
                      <ChevronRight size={24} />
                    </div>
                  )}
                </div>
              </FadeInItem>
            );
          })}
        </div>

        {/* CTA Card */}
        <FadeInItem className="mt-20">
          <div className="rounded-[3.5rem] bg-primary-2 p-12 text-center text-white relative overflow-hidden shadow-2xl shadow-primary-2/20">
              {/* Ambient Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-1 opacity-20 blur-[80px] -mr-32 -mt-32"></div>
              
              <div className="relative z-10">
                  <Trophy className="mx-auto mb-6 text-primary-1 animate-bounce" size={60} />
                  <h3 className="text-3xl font-black tracking-tight italic mb-3">Siap Mengukur Kemampuan?</h3>
                  <p className="mx-auto max-w-md text-slate-200 font-medium mb-10 opacity-80 text-sm leading-relaxed">
                      Selesaikan semua materi dan buka simulasi Try Out untuk melihat seberapa jauh penguasaanmu.
                  </p>
                  <button className="rounded-2xl bg-primary-1 px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all hover:brightness-110 active:scale-95 shadow-xl shadow-black/10">
                      Buka Simulasi Akhir
                  </button>
              </div>
          </div>
        </FadeInItem>
      </FadeInContainer>
    </div>
  );
}