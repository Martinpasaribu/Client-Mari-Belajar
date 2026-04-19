/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useParams, useRouter } from "next/navigation"; // Gunakan navigation
import { Play, Trophy, Calendar, Clock, ChevronRight, Loader2, Info, Target, Zap, Clock2Icon, TimerIcon, FileClock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { FadeInContainer, FadeInItem } from "@/components/animations/MotionWrapper";
import { MainLoading } from "@/components/modals/MainLoading";
import { MainEmpty } from "@/components/modals/MainEmpty";

export default function AttemptsPage() {
  const { babId } = useParams();
  const router = useRouter(); 
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!babId) return;
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/enrollments/bab/history/${babId}`);
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error("Gagal mengambil riwayat:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [babId]);

  if (isLoading) return (
    <>
    {/* GLOBAL LOADER */}
      <MainLoading isOpen={isLoading} title="bab" />
    </>
  );

  if (!data) return (
      <MainEmpty 
        title="Modul Tidak Ditemukan" 
        description="Sepertinya modul yang kamu cari tidak tersedia di katalog kami saat ini."
      />
  );

  return (
    <FadeInContainer className="space-y-10 pb-10">
      
      {/* BANNER MULAI KUIS */}
      <FadeInItem>
        <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden group">
          {/* Efek Cahaya Background */}
          <div className="absolute top-[-20%] right-[-10%] w-80 h-80 bg-primary-1/20 rounded-full blur-[100px] group-hover:bg-primary-1/30 transition-all duration-700"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  <Zap size={12} className="text-primary-1" fill="currentColor" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-primary-1">Kuis Tersedia</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  <TimerIcon size={12} className="text-white" fill="currentColor" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-white">{data.bab.duration} menit</span>
                </div>

              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Materi Bab:</h2>
                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-tight">
                  {data.bab.name}
                </h1>
              </div>
              <p className="text-slate-400 text-sm max-w-md leading-relaxed">
                Uji pemahamanmu pada materi ini. Skor terakhir akan tercatat sebagai progres belajarmu di sistem.
              </p>
            </div>

            <Link 
              href={`/attempt/${babId}`}
              className="inline-flex items-center justify-center gap-3 bg-primary-1 text-white px-1 md:px-6 py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] hover:bg-white hover:text-slate-900 transition-all shadow-xl active:scale-95 group/btn"
            >
              <Play size={16} fill="currentColor" className="group-hover:scale-110 transition-transform" /> 
              Mulai Attempt Baru
            </Link> 
          </div>
        </div>
      </FadeInItem>

      {/* STATISTIK & RIWAYAT */}
      <div className="max-w-6xl mx-auto space-y-6">
        <FadeInItem className="flex items-center flex-col md:flex-row justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <FileClock size={18} className="text-amber-500" />
            </div>
            <h3 className="text-lg font-black uppercase tracking-tighter text-slate-800 dark:text-white">
              Riwayat Pengerjaan
            </h3>
          </div>
          <span className="text-[10px] font-black text-slate-400 bg-slate-100 dark:bg-white/5 px-4 py-1.5 rounded-full uppercase tracking-widest border border-slate-200 dark:border-white/5">
            {data.results.length} Sesi Tersedia
          </span>
        </FadeInItem>

        {data.results.length === 0 ? (
          <FadeInItem>
            <div className="bg-white dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[3rem] p-16 text-center">
              <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                <Target size={40} />
              </div>
              <h4 className="text-lg font-black text-slate-800 dark:text-white uppercase mb-2">Belum Ada Riwayat</h4>
              <p className="text-slate-400 text-sm max-w-xs mx-auto">Selesaikan attempt pertamamu untuk melihat statistik skor dan pembahasan di sini.</p>
            </div>
          </FadeInItem>
        ) : (
          <div className="grid gap-4">
            {data.results.map((item: any, index: number) => {
              const isExcellent = item.total_score >= 80;
              const isGood = item.total_score >= 60;

              return (
                <FadeInItem key={item._id}>
                  <div className="group bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 p-6 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 hover:border-primary-1 hover:shadow-2xl hover:shadow-primary-1/5 transition-all duration-300">
                    <div className="flex items-center gap-6 w-full md:w-auto">
                      {/* Skor Badge */}
                      <div className={`w-12 h-12 md:w-20 md:h-20 rounded-xl md:rounded-3xl flex flex-col items-center justify-center transition-transform group-hover:scale-110 duration-500 ${
                        isExcellent ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 
                        isGood ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 
                        'bg-slate-800 text-white'
                      }`}>
                        <span className="text-md md:text-2xl font-black leading-none">{item.total_score}</span>
                        <span className="text-[8px] font-black uppercase tracking-widest mt-1 opacity-80">Skor</span>
                      </div>

                      <div className="space-y-2 w-full">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-black text-slate-800 dark:text-white uppercase text-xs tracking-widest">
                            Attempt #{data.results.length - index}
                          </p>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border ${
                             item.status === 'submitted' 
                             ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' 
                             : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          <span className="flex items-center gap-1.5"><Calendar size={12} className="text-primary-1" /> {format(new Date(item.createdAt), 'dd MMM yyyy', { locale: id })}</span>
                          <span className="flex items-center gap-1.5"><Clock size={12} className="text-dark-primary-2" /> {item.duration_seconds}s</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full md:w-auto md:gap-8 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-white/5">
                      <div className="flex items-center gap-6">
                        <div className="text-center px-4">
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest">Benar</p>
                          <p className="text-lg font-black text-emerald-500">{item.correct_count}</p>
                        </div>
                        <div className="text-center px-4 border-l border-slate-100 dark:border-white/5">
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest">Salah</p>
                          <p className="text-lg font-black text-rose-500">{item.wrong_count}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const path = item.status === 'submitted' 
                            ? `/dashboard/history/result/${item._id}` 
                            : `/attempt/${item.bab_key?._id}`;
                          router.push(path);
                        }}
                        className="h-12 w-12 bg-slate-50 dark:bg-white/5 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-primary-1 group-hover:text-white group-hover:rotate-[360deg] transition-all duration-700 shadow-sm"
                        >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                </FadeInItem>
              );
            })}
          </div>
        )}
      </div>
    </FadeInContainer>
  );
}