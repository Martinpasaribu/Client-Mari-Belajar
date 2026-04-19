/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useParams, useRouter } from "next/navigation"; // Gunakan next/navigation
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import { ChevronRight, Book, ArrowLeft, LayoutGrid, Info, Loader2, Sparkles, TextSelection, TimerIcon } from "lucide-react";
import { FadeInContainer, FadeInItem } from "@/components/animations/MotionWrapper";
import { MainLoading } from "@/components/modals/MainLoading";
import { MainEmpty } from "@/components/modals/MainEmpty";
import RichTextDisplay from "@/components/display/RichTextDisplay";

export default function BabListPage() {
  const { id } = useParams();
  const router = useRouter(); // Perbaikan router
  const [moduleData, setModuleData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBab = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/bab/${id}/sub_category`);
        setModuleData(res.data.data);
      } catch (error) {
        console.error("Gagal mengambil data bab:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBab();
  }, [id]);


  if (loading) return (
    <>
    {/* GLOBAL LOADER */}
      <MainLoading isOpen={loading} title="module" />
    </>
      
  );

  if (!moduleData) return (
      <MainEmpty 
        title="Modul Tidak Ditemukan" 
        description="Sepertinya modul yang kamu cari tidak tersedia di katalog kami saat ini."
      />
  );

  return (
    <FadeInContainer className="space-y-10 pb-20">
      
    

      {/* HERO HEADER SECTION */}
      <FadeInItem>
        <div className="relative overflow-hidden bg-primary-2 rounded-[3rem] p-4 px-6 md:p-6 md:px-10 shadow-2xl">
          {/* Ornamen Background */}
          <div className="absolute top-[-20%] right-[-10%] h-80 w-80 rounded-full bg-primary-1/20 blur-[100px]" />
          <div className="absolute bottom-[-20%] left-[-5%] h-60 w-60 rounded-full bg-indigo-500/10 blur-[80px]" />
          
          <div className="relative z-10">
            <button 
              onClick={() => router.back()}
              className="group mb-5 inline-flex items-center gap-3 text-slate-400 transition-colors hover:text-white"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 group-hover:bg-white/10 group-hover:scale-110 transition-all">
                <ArrowLeft size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Kembali ke Library</span>
            </button>
            
            <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-[2px] w-8 bg-primary-1" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-1">Learning Path</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white leading-none">
                  {moduleData.sub_category?.name}
                </h1>
                <p className="max-w-xl text-lg font-medium leading-relaxed text-slate-400">
                  <RichTextDisplay content={moduleData.sub_category?.description || `Kuasai materi`} />
                  {moduleData.sub_category?.name} secara mendalam dengan latihan soal terstruktur.`
                </p>
              </div>

              <div className="flex flex-col gap-2 rounded-[2rem] border border-white/5 bg-white/5 p-2 md:p-4 backdrop-blur-md lg:min-w-[150px] text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                   <Sparkles size={14} className="text-primary-1" />
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Materi</span>
                </div>
                <div className="flex items-baseline justify-center lg:justify-start gap-2">
                  <span className="text-2xl md:text-4xl font-black text-white">{moduleData.bab?.length || 0}</span>
                  <span className="text-sm font-bold text-primary-1 uppercase tracking-widest">Bab</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeInItem>

      {/* LIST SECTION */}
      <div className="max-w-5xl mx-auto space-y-8">
        <FadeInItem className="flex items-center gap-4 px-4">
          <div className="p-2 bg-primary-1/10 rounded-lg">
            <LayoutGrid size={20} className="text-primary-1" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-800 dark:text-white">
            Pilih <span className="text-primary-1 ">Bab Materi</span>
          </h2>
        </FadeInItem>

        <div className="grid gap-4">
          {moduleData?.bab?.map((bab: any, index: number) => (
            <FadeInItem key={bab.id || bab._id}>
              <Link 
                href={`/dashboard/modules/${id}/${bab._id || bab.id}`}
                className="group flex items-center justify-between p-3 py-4 md:p-6 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-[2rem] hover:border-primary-1 hover:shadow-2xl hover:shadow-primary-1/10 transition-all duration-300"
              >
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/5 text-slate-400 group-hover:bg-primary-1 group-hover:text-white group-hover:rotate-6 transition-all duration-500">
                    <span className="text-sm font-black italic">0{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-md md:text-lg font-black text-slate-800 dark:text-slate-100 group-hover:text-primary-1 transition-colors leading-tight">
                      {bab.name}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Latihan Soal & Pembahasan</p>
                    <div className="flex gap-1 mt-1">
                      <div className="inline-flex items-center gap-2 px-2 py-1 rounded-lg bg-white/5 border-2 border-dashed border-gray-200 dark:border-gray-500">
                        <TextSelection size={12} className="text-primary-1" fill="currentColor" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-primary-2 dark:text-primary-1">{bab.question_keys.length} Soal</span>
                      </div>
                      <div className="inline-flex items-center gap-2 px-2 py-1 rounded-lg bg-white/5 border-2 border-dashed border-gray-200 dark:border-gray-500">
                        <TimerIcon size={12} className="text-primary-1" fill="currentColor" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-primary-2 dark:text-primary-1">{bab.duration} Menit</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 dark:bg-white/5 text-slate-300 group-hover:bg-primary-1 group-hover:text-white transition-all">
                  <ChevronRight size={20} />
                </div>
              </Link>
            </FadeInItem>
          ))}
        </div>
      </div>

    </FadeInContainer>
  );
}