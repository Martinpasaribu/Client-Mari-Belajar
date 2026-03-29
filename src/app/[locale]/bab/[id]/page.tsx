/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, Clock, ChevronRight, FileText, Lock, 
  Trophy, BookOpen, Unlock, Crown, BadgeCheck 
} from 'lucide-react';
import { FadeInContainer, FadeInItem } from "@/components/animations/MotionWrapper";
import api from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore'; 
import AuthModal from '@/components/modals/AuthModal';
import { MainLoading } from '@/components/modals/MainLoading';

export default function BabPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore(); 
  
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const fetchBab = async () => {
      try {
        const res = await api.get(`/bab/${params.id}/sub_category`);
        if (res.data.success) setData(res.data.data);
      } catch (err) {
        console.error("Failed to fetch bab", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (params.id) fetchBab();
  }, [params.id]);

  const handleBabClick = (bab: any) => {
    if (bab.isFree) {
      router.push(`/attempt/${bab._id}`);
      return;
    }
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    router.push(`/attempt/${bab._id}`);
  };

  if (isLoading) return (
    <>
    {/* GLOBAL LOADER */}
      <MainLoading isOpen={isLoading} title="bab" />
    </>
  );

  return (
    <div className="min-h-screen bg-bg1 dark:bg-dark-bg1 transition-colors duration-300">
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Top Navigation - Padding Adjusted for Mobile */}
      <nav className="sticky top-0 z-30 border-b border-slate-100 dark:border-white/5 bg-white/80 dark:bg-dark-bg2/80 backdrop-blur-md px-4 md:px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary-1 transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs md:text-sm font-bold tracking-tight uppercase">Kembali</span>
          </button>
          
          <div className="hidden sm:flex items-center gap-3">
            <div className="h-1.5 w-24 md:w-32 bg-bg2 dark:bg-dark-bg1 rounded-full overflow-hidden">
               <div className="h-full bg-primary-1 w-1/12 transition-all"></div>
            </div>
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Progres</span>
          </div>
        </div>
      </nav>

      <FadeInContainer className="mx-auto max-w-4xl px-4 md:px-6 py-8 md:py-12">
        {/* Header Section - Better Alignment on Mobile */}
        <FadeInItem className="mb-10 md:mb-16">
          <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6'>
            <div className="inline-flex w-fit items-center gap-2 rounded-xl bg-primary-1/10 px-3 py-1.5 md:px-4 md:py-2 text-primary-1 font-bold">
              <BookOpen size={14} />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">Bab Pembelajaran</span>
            </div>
          
            <div className={`flex items-center gap-2 w-fit px-3 py-1.5 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${
              data?.sub_category?.isFree ? 'bg-emerald-500/10 text-emerald-600' : 'bg-blue-500/10 text-blue-600'
            }`}>
              {data?.sub_category?.isFree ? <BadgeCheck size={14}/> : <Crown size={14}/>}
              <span>{data?.sub_category?.isFree ? 'Freemium Package' : 'Premium Package'}</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-6xl font-black tracking-tighter text-foreground dark:text-white mb-4 md:mb-6 uppercase italic leading-[0.9]">
             {data?.sub_category?.name || "Materi Belajar"}
          </h1>
          
          <p className="max-w-2xl text-base md:text-lg font-medium leading-relaxed text-slate-500 dark:text-slate-400">
            {data?.sub_category?.sub_description || "Selesaikan seluruh rangkaian bab untuk menguasai materi secara tuntas."}
          </p>
        </FadeInItem>

        {/* Lessons List - Vertical line hidden on tiny screens */}
        <div className="relative space-y-4 md:space-y-6">
          <div className="hidden sm:block absolute left-10 top-0 h-full w-[2px] bg-bg2 dark:bg-dark-bg2" />

          {data?.bab?.map((bab: any, index: number) => {
            const isLocked = !bab.isFree && !user;
            
            return (
              <FadeInItem key={bab._id}>
                <div 
                  onClick={() => handleBabClick(bab)}
                  className="group relative flex select-none flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-8 rounded-[2rem] md:rounded-[2.5rem] border border-white dark:border-white/5 bg-white dark:bg-dark-bg2 p-4 md:p-5 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary-1/5
                  ease-out hover:border-primary-1 active:scale-95 active:translate-y-0.5 active:shadow-inner
                  "
                >
                  {/* Icon Badge - Adaptive Size */}
                  <div className={`relative z-10 flex h-14 w-14 md:h-20 md:w-20 shrink-0 items-center justify-center rounded-2xl md:rounded-[1.8rem] transition-all duration-500 ${
                    isLocked 
                    ? 'bg-bg2 dark:bg-dark-bg1 text-slate-400' 
                    : bab.isFree 
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500' 
                      : 'bg-bg2 dark:bg-dark-bg1 text-primary-2 dark:text-dark-primary-2 group-hover:bg-primary-1 group-hover:text-white'
                  }`}>
                    {isLocked ? <Lock size={20} className="md:size-7" /> : bab.isFree ? <Unlock size={20} className="md:size-7" /> : (
                      <div className="flex flex-col items-center">
                          <span className="text-[8px] md:text-[10px] font-black opacity-40 uppercase">Bab</span>
                          <span className="text-lg md:text-2xl font-black leading-none">{index + 1}</span>
                      </div>
                    )}
                  </div>

                  {/* Info Content */}
                  <div className="flex-1 w-full overflow-hidden">
                    <div className="flex items-center justify-between sm:justify-start gap-3 mb-2 md:mb-3">
                       <h4 className="text-lg md:text-xl font-black tracking-tight uppercase text-foreground dark:text-white group-hover:text-primary-1 transition-colors truncate">
                        {bab.name}
                      </h4>
                      {bab.isFree && (
                        <span className="bg-emerald-500 text-white text-[8px] font-black px-2 py-0.5 rounded-md uppercase">Gratis</span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 md:gap-4">
                      <div className="flex items-center gap-1.5 rounded-full bg-bg2 dark:bg-dark-bg1 px-3 py-1 text-[9px] md:text-[10px] font-bold text-slate-500 group-hover:bg-primary-1/10 transition-colors">
                        <Clock size={12} />
                        <span>{bab.duration || 15} Min</span>
                      </div>
                      <div className="flex items-center gap-1.5 rounded-full bg-bg2 dark:bg-dark-bg1 px-3 py-1 text-[9px] md:text-[10px] font-bold text-slate-500 group-hover:bg-primary-1/10 transition-colors">
                        <FileText size={12} />
                        <span>Latihan</span>
                      </div>
                    </div>
                  </div>

                  {/* Arrow Action - Sticky on right for Tablet/Desktop */}
                  <div className="absolute right-4 top-4 sm:static flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-bg2 dark:bg-dark-bg1 text-slate-300 transition-all duration-500 group-hover:bg-primary-1 group-hover:text-white group-hover:rotate-[-45deg] shrink-0">
                    <ChevronRight size={20} className="md:size-6" />
                  </div>
                </div>
              </FadeInItem>
            );
          })}
        </div>

        {/* CTA Card Footer - Responsive Padding */}
        <FadeInItem className="mt-12 md:mt-20">
          <div className="rounded-[2.5rem] md:rounded-[3.5rem] bg-primary-2 p-8 md:p-12 text-center text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-primary-1 opacity-20 blur-[80px] -mr-24 -mt-24"></div>
              
              <div className="relative z-10">
                  <Trophy className="mx-auto mb-4 md:mb-6 text-primary-1 animate-bounce w-10 h-10 md:w-16 md:h-16" />
                  <h3 className="text-xl md:text-3xl font-black italic mb-3 uppercase leading-tight">Siap Ukur Kemampuan?</h3>
                  <p className="mx-auto max-w-md text-white/70 font-medium mb-8 md:mb-10 text-xs md:text-sm leading-relaxed">
                      Selesaikan bab ini dan buka simulasi Try Out untuk melihat statistik perkembanganmu secara mendalam.
                  </p>
                  <button className="w-full sm:w-auto rounded-xl md:rounded-2xl bg-primary-1 px-8 md:px-10 py-3.5 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all shadow-xl">
                      Buka Simulasi Akhir
                  </button>
              </div>
          </div>
        </FadeInItem>
      </FadeInContainer>
    </div>
  );
}