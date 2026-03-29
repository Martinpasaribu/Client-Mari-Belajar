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
  BookOpen, 
  Unlock, 
  Crown,
  BadgeCheck
} from 'lucide-react';
import { FadeInContainer, FadeInItem } from "@/components/animations/MotionWrapper";
import api from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore'; 
import AuthModal from '@/components/modals/AuthModal';

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
    <div className="flex h-screen items-center justify-center bg-bg1 dark:bg-dark-bg1">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-1 dark:border-dark-primary1 border-t-transparent"></div>
    </div>
  );

  if (!data) return (
    <div className="flex h-screen items-center justify-center bg-bg1 dark:bg-dark-bg1 text-foreground dark:text-white font-bold">
      Materi belum tersedia.
    </div>
  );

  return (
    <div className="min-h-screen bg-bg1 dark:bg-dark-bg1 transition-colors duration-300">
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Top Navigation */}
      <nav className="sticky top-0 z-30 border-b border-slate-100 dark:border-white/5 bg-white/80 dark:bg-dark-bg2/80 backdrop-blur-md px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary-1 dark:hover:text-dark-primary1 transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold tracking-tight uppercase">Kembali</span>
          </button>
          
          <div className="hidden md:flex items-center gap-3">
            <div className="h-2 w-32 bg-bg2 dark:bg-dark-bg1 rounded-full overflow-hidden text-foreground">
               <div className="h-full bg-primary-1 dark:bg-dark-primary1 w-1/12 transition-all"></div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Progres Belajar</span>
          </div>
        </div>
      </nav>

      <FadeInContainer className="mx-auto max-w-4xl px-6 py-12">
        {/* Header Section */}
        <FadeInItem className="mb-16">

        <div className='flex justify-between items-center'>
          <div className="mb-6 inline-flex items-center gap-2 rounded-xl bg-primary-1/10 dark:bg-dark-primary1/10 px-4 py-2 text-primary-1 dark:text-dark-primary1 font-bold">
            <BookOpen size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Bab Pembelajaran</span>
          </div>
        
          {data?.sub_category?.isFree ? (
            <div className="mb-4 flex items-center gap-2 bg-green-100 w-fit p-2">
                <BadgeCheck size={14} className="text-primary-1" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-1">Freemium Package</span>
              </div>
              ) : (
                <div className="mb-4 flex items-center gap-2 bg-blue-100 w-fit p-2">
                <Crown size={14} className="text-primary-2" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-2">Premium Package</span>
              </div>
              )
            }
        </div>

          <h1 className="text-4xl font-black tracking-tighter text-foreground dark:text-white md:text-6xl mb-6 uppercase italic leading-none">
             {data.sub_category?.name || "Materi Belajar"}
          </h1>
          
          <p className="max-w-2xl text-lg font-medium leading-relaxed text-slate-500 dark:text-slate-400">
            {data.sub_category?.sub_description || "Selesaikan seluruh rangkaian bab untuk menguasai materi secara tuntas."}
          </p>
        </FadeInItem>

        {/* Lessons List */}
        <div className="relative space-y-6">
          {/* Vertical Timeline Line */}
          <div className="absolute left-10 top-0 h-full w-[2px] bg-bg2 dark:bg-dark-bg2" />

          {data.bab?.map((bab: any, index: number) => {
            const isLocked = !bab.isFree && !user;
            
            return (
              <FadeInItem key={bab._id}>
                <div 
                  onClick={() => handleBabClick(bab)}
                  className="group relative flex items-center gap-8 rounded-[2.5rem] border border-white dark:border-white/5 bg-white dark:bg-dark-bg2 p-5 shadow-sm transition-all duration-500 cursor-pointer hover:border-primary-1/30 dark:hover:border-dark-primary1/30 hover:shadow-2xl hover:shadow-primary-1/5 dark:hover:shadow-dark-primary1/5"
                >
                  {/* Icon Badge */}
                  <div className={`relative z-10 flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.8rem] shadow-sm transition-all duration-500 ${
                    isLocked 
                    ? 'bg-bg2 dark:bg-dark-bg1 text-slate-400' 
                    : bab.isFree 
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500' 
                      : 'bg-bg2 dark:bg-dark-bg1 text-primary-2 dark:text-dark-primary-2 group-hover:bg-primary-1 dark:group-hover:bg-dark-primary1 group-hover:text-white'
                  }`}>
                    {isLocked ? (
                      <Lock size={28} />
                    ) : bab.isFree ? (
                      <Unlock size={28} />
                    ) : (
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-black opacity-40 uppercase tracking-tighter">Bab</span>
                          <span className="text-2xl font-black leading-none">{index + 1}</span>
                      </div>
                    )}
                  </div>

                  {/* Info Content */}
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center gap-3 mb-2">
                       <h4 className="text-xl font-black tracking-tight uppercase text-foreground dark:text-white group-hover:text-primary-1 dark:group-hover:text-dark-primary1 transition-colors truncate">
                        {bab.name}
                      </h4>
                      {bab.isFree && (
                        <span className="bg-emerald-500 text-white text-[8px] font-black px-2 py-0.5 rounded-md uppercase shrink-0">Gratis</span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-foreground">
                      <div className="flex items-center gap-1.5 rounded-full bg-bg2 dark:bg-dark-bg1 px-3 py-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 group-hover:bg-primary-1/10 dark:group-hover:bg-dark-primary1/10 group-hover:text-primary-1 dark:group-hover:text-dark-primary1 transition-colors">
                        <Clock size={12} />
                        <span>{bab.duration || 15} Menit</span>
                      </div>
                      <div className="flex items-center gap-1.5 rounded-full bg-bg2 dark:bg-dark-bg1 px-3 py-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 group-hover:bg-primary-1/10 dark:group-hover:bg-dark-primary1/10 group-hover:text-primary-1 dark:group-hover:text-dark-primary1 transition-colors">
                        <FileText size={12} />
                        <span>Latihan Soal</span>
                      </div>
                    </div>
                  </div>

                  {/* Arrow Action */}
                  <div className="mr-2 flex h-12 w-12 items-center justify-center rounded-full bg-bg2 dark:bg-dark-bg1 text-slate-300 dark:text-slate-600 transition-all duration-500 group-hover:bg-primary-1 dark:group-hover:bg-dark-primary1 group-hover:text-white group-hover:rotate-[-45deg] shrink-0">
                    <ChevronRight size={24} />
                  </div>
                </div>
              </FadeInItem>
            );
          })}
        </div>

        {/* CTA Card Footer */}
        <FadeInItem className="mt-20">
          <div className="rounded-[3.5rem] bg-primary-2 dark:bg-dark-primary-2 p-12 text-center text-white relative overflow-hidden shadow-2xl shadow-primary-2/20 dark:shadow-dark-primary-2/20">
              {/* Ambient Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-1 dark:bg-dark-primary1 opacity-20 blur-[80px] -mr-32 -mt-32"></div>
              
              <div className="relative z-10">
                  <Trophy className="mx-auto mb-6 text-primary-1 dark:text-dark-primary1 animate-bounce" size={60} />
                  <h3 className="text-3xl font-black tracking-tight italic mb-3 uppercase leading-tight">Siap Ukur Kemampuan?</h3>
                  <p className="mx-auto max-w-md text-white/70 font-medium mb-10 text-sm leading-relaxed">
                      Selesaikan bab ini dan buka simulasi Try Out untuk melihat statistik perkembanganmu secara mendalam.
                  </p>
                  <button className="rounded-2xl bg-primary-1 dark:bg-dark-primary1 px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/20">
                      Buka Simulasi Akhir
                  </button>
              </div>
          </div>
        </FadeInItem>
      </FadeInContainer>
    </div>
  );
}