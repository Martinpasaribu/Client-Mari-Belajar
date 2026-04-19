/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { 
  PlayCircle, ArrowRight, BookOpen, 
  Zap, Star, LayoutGrid, Quote, 
  Search, Trophy, Users, CheckCircle2,
  Crown,
  GraduationCap
} from "lucide-react";
import api from "@/lib/axios";
import { FadeInContainer, FadeInItem } from "@/components/animations/MotionWrapper";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  const { showToast } = useToast();
  const router = useRouter();
  const [statsData, setStatsData] = useState({
    totalQuestions: 0,
    totalUsers: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Pastikan loading dimulai
      try {
        const [catRes, subRes, statsRes] = await Promise.allSettled([
          api.get('/categories'),
          api.get('/sub-categories'),
          api.get('/status/home')
        ]);

        // Handle Categories
        if (catRes.status === 'fulfilled') {
          setCategories(catRes.value.data.data || catRes.value.data || []);
        }

        // Handle Sub-Categories
        if (subRes.status === 'fulfilled') {
          setSubCategories(subRes.value.data.data || subRes.value.data || []);
        }

        // Handle Stats
        if (statsRes.status === 'fulfilled' && statsRes.value.data.success) {
          setStatsData({
            totalQuestions: statsRes.value.data.data.totalQuestions || 0,
            totalUsers: statsRes.value.data.data.totalUsers || 0
          });
        }

      } catch (err) {
        console.error("Gagal memuat data utama:", err);
        showToast("error", "Beberapa data gagal dimuat, silakan refresh.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);


  const formatNumber = (num: number) => {
    return num >= 1000 ? (num / 1000).toFixed(1) + 'k+' : num;
  };


  const testToast =  ()=> {
    showToast("success", 'berhasil' as any);
  }

const stats = [
    { label: "Total Soal", value: formatNumber(statsData.totalQuestions), icon: BookOpen },
    { label: "Pengguna Aktif", value: formatNumber(statsData.totalUsers), icon: Users },
    { label: "Materi Update", value: "Ative", icon: Zap },
  ];

  const reviews = [
    { 
      name: "Budi Santoso", 
      role: "Siswa SMA", 
      comment: "Bank soalnya sangat lengkap. Pembahasannya juga mudah dimengerti bahkan untuk materi yang sulit.",
      rating: 5,
      img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi"
    },
    { 
      name: "Siska Amelia", 
      role: "Pejuang CPNS", 
      comment: "Berhasil lolos berkat latihan rutin di sini. Fitur timernya sangat membantu simulasi ujian asli.",
      rating: 5,
      img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siska"
    },
    { 
      name: "Andi Wijaya", 
      role: "Mahasiswa", 
      comment: "Aplikasi belajar paling praktis. Bisa latihan soal di mana saja lewat HP.",
      rating: 4,
      img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Andi"
    }
  ];

  return (
    <div className="min-h-screen bg-bg1 dark:bg-dark-bg1 text-zinc-900 dark:text-zinc-100 selection:bg-primary-1 selection:text-white transition-colors duration-300">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-12 md:pt-20 pb-16 md:pt-32 md:pb-24 px-6 overflow-hidden">
        {/* Background Decor - Elemen estetik di belakang */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-1/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-primary-2/10 blur-[100px] rounded-full" />
        </div>

        <FadeInContainer className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* KIRI: CONTENT */}
            <div className="text-center lg:text-left space-y-8">
              <FadeInItem>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-dark-bg2/50 backdrop-blur-md border border-primary-1/20 shadow-sm">
                  <span className="flex h-2 w-2 rounded-full bg-primary-1 animate-ping" />
                  <span className="text-primary-1 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
                    🎯 Platform Latihan Soal No. 1
                  </span>
                </div>
              </FadeInItem>

              <FadeInItem>
                <h1 className="relative text-3xl md:text-7xl font-black tracking-tighter leading-[1.05] text-slate-800 dark:text-white uppercase ">
                  Asah <span className="text-primary-1 not-italic">Kemampuanmu</span> <br />
                    {/* Floating Mini Badges */}
                  <div className="absolute -right-8 top-8 p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-white/10 rotate-12 animate-bounce-slow">
                    <GraduationCap className="text-primary-1" size={24} />
                  </div>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-1 via-primary-2 to-primary-1 bg-[length:200%_auto] animate-gradient-x">
                    Tanpa Batas.
                  </span>
                </h1>
              </FadeInItem>

              <FadeInItem>
                <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                  Temukan bank soal terlengkap untuk sekolah, kuliah, hingga persiapan kerja dengan pembahasan mendalam dan sistematis.
                </p>
              </FadeInItem>

              <FadeInItem className="flex flex-col sm:flex-row items-center gap-4">
                <Link href={'/category'} className="group w-full sm:w-auto px-8 py-4 bg-primary-1 text-white rounded-[2rem] font-bold text-lg hover:shadow-2xl hover:shadow-primary-1/40 transition-all flex items-center justify-center gap-3 active:scale-95">
                  Mulai Latihan 
                  <div className="bg-white/20 p-1 rounded-full group-hover:rotate-[-45deg] transition-transform">
                    <ArrowRight size={20} />
                  </div>
                </Link>
                
                <div className="relative w-full sm:w-72 group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-1 transition-colors" size={20} />
                  <input 
                    type="text" 
                    placeholder="Cari materi..." 
                    className="w-full pl-14 pr-6 py-4 bg-white dark:bg-dark-bg2 border border-slate-200 dark:border-white/10 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-primary-1/10 transition-all shadow-sm"
                  />
                </div>
              </FadeInItem>

              {/* STATS - Gaya Modern Minimalis */}
              <FadeInItem className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-100 dark:border-white/5">
                {stats.map((s, i) => (
                  <div key={i} className="flex flex-col items-center lg:items-start gap-1">
                    <span className="font-black text-2xl md:text-3xl text-slate-800 dark:text-white leading-none tracking-tighter">
                      {s.value}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-primary-1 font-black ">
                      {s.label}
                    </span>
                  </div>
                ))}
              </FadeInItem>
            </div>

            {/* KANAN: IMAGE ASSET */}
            <FadeInItem className="relative hidden lg:flex items-center justify-center">
              {/* Lingkaran Dekorasi di belakang gambar */}
              <div className="absolute w-[80%] h-[80%] bg-gradient-to-tr from-primary-1/20 to-transparent rounded-full blur-3xl animate-pulse" />
              
              <div className="relative z-10 w-full max-w-[450px] animate-float">
                <img 
                  src="assets/animation/icon/a2.png" 
                  alt="Hero Icon" 
                  className="w-full h-auto drop-shadow-[0_35px_35px_rgba(var(--primary-1-rgb),0.3)]"
                />
                
                {/* Floating Badge di sekitar gambar */}
                <div className="absolute -top-4 -right-4 bg-white dark:bg-dark-bg2 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-white/10 animate-bounce-slow">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-400 rounded-lg text-white"><Crown size={20} /></div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase text-slate-400">Quality</span>
                      <span className="text-xs font-bold">Premium Soal</span>
                    </div>
                  </div>
                </div>

              </div>
            </FadeInItem>

          </div>
        </FadeInContainer>
      </section>

      {/* CATEGORY SECTION */}
      <section className="py-24 px-4 md:px-6 bg-[#FDFDFD] dark:bg-[#080B14] overflow-hidden">
        <FadeInContainer className="max-w-7xl mx-auto">
          
          {/* Header Section dengan Aksentuasi */}
          <FadeInItem className="text-center mb-20 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-primary-1/10 blur-[60px] rounded-full -z-10" />
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-1/5 text-primary-1 text-[10px] font-black uppercase tracking-[0.3em] mb-4 border border-primary-1/10">
              Eksplorasi Materi
            </span>
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter italic uppercase dark:text-white">
              Materi <span className="text-primary-1">Utama</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-medium text-sm md:text-base">
              Pilih pilar ilmu yang ingin Anda kuasai hari ini dengan kurikulum yang terstruktur.
            </p>
          </FadeInItem>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-[400px] animate-pulse bg-slate-100 dark:bg-white/5 rounded-[3rem]" />
              ))
            ) : (
              categories.map((cat: any) => (
                <FadeInItem key={cat._id} className="group">
                  <div className="relative h-full p-1 rounded-[3rem] bg-gradient-to-b from-slate-200/50 to-transparent dark:from-white/10 dark:to-transparent hover:from-primary-1 transition-all duration-500">
                    
                    <div className="relative h-full p-8 md:p-10 rounded-[2.8rem] bg-white dark:bg-[#0B0F1A] border border-transparent transition-all duration-500 overflow-hidden flex flex-col shadow-sm group-hover:shadow-2xl group-hover:shadow-primary-1/10 group-hover:-translate-y-2">
                      
                      {/* Background Decor (Glow on hover) */}
                      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-1/5 rounded-full blur-[60px] group-hover:bg-primary-1/10 transition-colors" />

                      {/* Category Icon & Stats */}
                      <div className="flex justify-between items-start mb-10">
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-white/5 text-primary-1 flex items-center justify-center shadow-inner group-hover:bg-primary-1 group-hover:text-white transition-all duration-500 transform group-hover:rotate-[10deg]">
                          <LayoutGrid size={32} strokeWidth={2.5} />
                        </div>
                        <div className="text-right">
                          <span className="block text-[20px] font-black text-slate-900 dark:text-white leading-none ">{cat.subCategoryCount}</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Modul</span>
                        </div>
                      </div>

                      {/* Category Identity */}
                      <div className="mb-8 flex-1">
                        <h3 className="text-2xl md:text-3xl font-black mb-3 tracking-tight group-hover:text-primary-1 transition-colors uppercase  dark:text-white">
                          {cat.name}
                        </h3>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-[200px]">
                          Kuasai konsep dasar hingga tingkat mahir pada materi {cat.name.toLowerCase()}.
                        </p>
                      </div>

                      {/* Sub-Category List (Preview) */}
                      <div className="space-y-3 mb-10">
                        {subCategories
                          .filter((sub: any) => sub.category_key === cat._id)
                          .slice(0, 3)
                          .map((sub: any) => (
                            <div key={sub._id} className="flex items-center justify-between group/item py-1">
                              <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary-1/30 group-hover/item:bg-primary-1 transition-colors" />
                                <span className="text-[13px] font-bold text-slate-600 dark:text-slate-400 group-hover/item:text-slate-900 dark:group-hover/item:text-white transition-colors">
                                  {sub.name}
                                </span>
                              </div>
                              <ArrowRight size={14} className="text-slate-300 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                            </div>
                          ))}
                      </div>

                      {/* Action Button */}
                      <button onClick={() => router.push(`/sub-category/${cat._id}`)}
                        className="w-full py-4 rounded-2xl bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white text-[11px] font-black uppercase tracking-[0.2em] border border-slate-100 dark:border-white/5 transition-all hover:bg-primary-1 hover:text-white hover:border-transparent active:scale-95">
                        Mulai Belajar
                      </button>

                    </div>
                  </div>
                </FadeInItem>
              )
            ))}
          </div>
        </FadeInContainer>
      </section>

      {/* --- SECTION BARU: SEMUA SUB-CATEGORY --- */}
      <section className="py-24 px-6">
        <FadeInContainer className="max-w-7xl mx-auto">
          <FadeInItem className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl font-black mb-4">Daftar Module Materi</h2>
              <p className="text-zinc-500 dark:text-zinc-400">Pilih module spesifik untuk mulai mengerjakan bank soal hari ini.</p>
                          
              {/* <button onClick={testToast} className="w-full sm:w-auto px-10 py-4 bg-primary-1 text-white rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-primary-1/20 transition-all flex items-center justify-center gap-2 group">
                 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button> */}

            </div>
            <div className="px-4 py-2 bg-primary-1/10 text-primary-1 rounded-full text-xs font-bold uppercase tracking-widest border border-primary-1/20">
              {subCategories.length} Materi Tersedia
            </div>
          </FadeInItem>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              Array(8).fill(0).map((_, i) => (
                <div key={i} className="h-24 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-3xl" />
              ))
            ) : (
              subCategories.map((sub: any) => (
                <FadeInItem key={sub._id}>
                  <div 
                    className="group relative flex flex-col p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-primary-1/50 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl hover:shadow-primary-1/10 hover:-translate-y-1 overflow-hidden"
                  >
                    {/* Decorative Background Blob on Hover */}
                    <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary-1/5 rounded-full blur-2xl group-hover:bg-primary-1/20 transition-colors" />

                    <div className="flex justify-between items-start mb-4">
                      {/* Icon Placeholder / Category Badge */}
                      <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary-1 group-hover:bg-primary-1 group-hover:text-white transition-colors duration-300">
                        <BookOpen size={20} /> {/* Ganti dengan ikon yang relevan */}
                      </div>
                      
                      {/* User Stats Badge */}
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700"> 
                        <Users size={12} className="text-slate-400 group-hover:text-primary-1" /> 
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                          {sub.enrolled_users?.length || 0}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary-1 opacity-80">
                        Materi Modul
                      </p>
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base leading-snug group-hover:text-primary-1 transition-colors">
                        {sub.name}
                      </h3>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                        Lihat Detail
                      </span>
                      <div className="p-1.5 rounded-lg bg-primary-1/10 text-primary-1 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                        <ArrowRight size={16} strokeWidth={3} />
                      </div>
                    </div>
                  </div>
                </FadeInItem>
              ))
            )}
          </div>

        </FadeInContainer>
      </section>

      {/* WHY US SECTION 1 */}
      <section className="py-24 px-6 bg-primary-2 dark:bg-dark-bg2 text-white overflow-hidden relative">
        <FadeInContainer className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeInItem className="space-y-8 relative z-10">
            <h2 className="text-4xl md:text-6xl font-black leading-[1.1]">
              Belajar Lebih Pintar, Bukan Lebih Keras.
            </h2>
            <p className="text-white/70 text-lg">
              Sistem kami menganalisis setiap jawabanmu untuk memberikan statistik akurat mengenai kelemahan dan kekuatanmu di setiap materi.
            </p>
            <div className="flex flex-col md:flex-row gap-4 ">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-xl"><Trophy className="text-primary-1" /></div>
                <div>
                  <h4 className="font-black text-lg">Leaderboard</h4>
                  <p className="text-sm text-white/50">Bersaing dengan 100rb+ siswa.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-xl"><Zap className="text-primary-1" /></div>
                <div>
                  <h4 className="font-black text-lg">Mode Ujian</h4>
                  <p className="text-sm text-white/50">Simulasi waktu ujian asli.</p>
                </div>
              </div>
            </div>
          </FadeInItem>
          <FadeInItem className="relative h-[400px] bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-3xl p-8 flex items-center justify-center">
             <div className="text-center">
                <div className="w-24 h-24 bg-primary-1 rounded-full mx-auto mb-6 flex items-center justify-center animate-bounce shadow-2xl shadow-primary-1">
                   <PlayCircle size={48} className="text-white" />
                </div>
                <p className="font-black uppercase tracking-[0.3em] text-sm">Lihat Video Demo</p>
             </div>
          </FadeInItem>
        </FadeInContainer>
      </section>

      {/* WHY US SECTION 2 */}
      <section className="py-24 px-6">
        <FadeInContainer className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeInItem className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary-1/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-8 bg-primary-1 text-white rounded-[2rem] shadow-xl shadow-primary-1/20 mt-8">
                <Trophy size={40} className="mb-4" />
                <h4 className="text-xl font-black mb-2">Rangking Global</h4>
                <p className="text-sm opacity-80">Bandingkan skor latihanmu dengan ribuan pengguna lain.</p>
              </div>
              <div className="p-8 bg-bg2 dark:bg-dark-bg2 border border-slate-200 dark:border-slate-800 rounded-[2rem]">
                <Zap size={40} className="text-yellow-500 mb-4" />
                <h4 className="text-xl font-black mb-2">Mode Kilat</h4>
                <p className="text-sm text-slate-500">Latihan 10 soal acak setiap hari untuk asah insting.</p>
              </div>
            </div>
          </FadeInItem>
          <FadeInItem className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-black leading-tight">Belajar Lebih Efektif Dengan Data Real-Time</h2>
            <p className="text-slate-500 dark:text-slate-400">Setiap soal yang Anda kerjakan akan dianalisis untuk memberikan rekomendasi materi mana yang perlu Anda perdalam lagi. Tidak ada lagi waktu terbuang untuk mempelajari hal yang sudah Anda kuasai.</p>
            <ul className="space-y-4">
               {[
                 "Pembahasan teks & video lengkap",
                 "Analisis kelemahan per materi",
                 "Simulasi ujian dengan timer asli",
                 "Akses selamanya tanpa biaya langganan"
               ].map((text, i) => (
                 <li key={i} className="flex items-center gap-3 font-bold text-sm">
                   <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">✓</div>
                   {text}
                 </li>
               ))}
            </ul>
          </FadeInItem>
        </FadeInContainer>
      </section>

      {/* REVIEWS SECTION */}
      <section className="py-24 px-6 border-t border-slate-100 dark:border-slate-800">
        <FadeInContainer className="max-w-7xl mx-auto">
          <FadeInItem className="flex items-center gap-4 mb-12">
            <div className="h-[2px] w-12 bg-primary-1"></div>
            <h2 className="text-2xl font-black uppercase tracking-widest">Testimoni Pengguna</h2>
          </FadeInItem>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <FadeInItem key={index}>
                <div className="p-8 rounded-[2rem] bg-bg2/30 dark:bg-dark-bg2/30 border border-slate-200 dark:border-slate-800 h-full hover:shadow-lg transition-all">
                  <Quote className="text-primary-1/20 mb-4" size={32} />
                  <p className="text-slate-600 dark:text-slate-400 mb-6 italic">&quot;{review.comment}&quot;</p>
                  <div className="flex items-center gap-4">
                    <img src={review.img} alt={review.name} className="w-12 h-12 rounded-full bg-slate-200" />
                    <div>
                      <h5 className="font-bold text-sm">{review.name}</h5>
                      <p className="text-xs text-zinc-400">{review.role}</p>
                    </div>
                  </div>
                </div>
              </FadeInItem>
            ))}
          </div>
        </FadeInContainer>
      </section>
      
    </div>
  );
}

// "use client";

// import { useToast } from "@/context/ToastContext";
// import { useTranslations } from "next-intl";
// import { 
//   BookOpen, HelpCircle, Users, Activity, 
//   ArrowUpRight, Plus, CheckCircle2, AlertCircle, Loader2 
// } from "lucide-react";

// export default function Home() {
//   const { showToast } = useToast();
//   const t = useTranslations('Home');

//   const stats = [
//     { label: "Total Materi", value: "48", icon: BookOpen, color: "text-blue-500", glow: "shadow-blue-500/10" },
//     { label: "Bank Soal", value: "1,240", icon: HelpCircle, color: "text-emerald-400", glow: "shadow-emerald-400/10" },
//     { label: "Siswa Aktif", value: "856", icon: Users, color: "text-purple-400", glow: "shadow-purple-400/10" },
//     { label: "Ujian Selesai", value: "3.2k", icon: Activity, color: "text-orange-400", glow: "shadow-orange-400/10" },
//   ];

//   return (
//     <div className="space-y-10 min-h-screen bg-[#09090b] text-zinc-100 p-2 md:p-4">
      
//       {/* 1. HEADER SECTION */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
//         <div>
//           <h1 className="text-4xl font-black tracking-tight mb-2 text-white">
//             {t('title') || 'MARI Project'}
//           </h1>
//           <p className="text-zinc-400">Pusat kendali materi dan evaluasi Project.</p>
//         </div>
//         <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95">
//           <Plus className="w-5 h-5" /> Buat Materi
//         </button>
//       </div>

//       {/* 2. TOAST TESTER (Simple UI) */}
//       <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl flex flex-wrap gap-3 items-center">
//         <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mr-2">System Test:</span>
//         <button 
//           onClick={() => showToast("Data berhasil disimpan!", "success")}
//           className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-500 hover:text-white transition-all"
//         >
//           <CheckCircle2 className="w-3.5 h-3.5" /> Success
//         </button>

//         <button 
//           onClick={() => showToast("Terjadi kesalahan sistem", "error")}
//           className="flex items-center gap-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-rose-500 hover:text-white transition-all"
//         >
//           <AlertCircle className="w-3.5 h-3.5" /> Error
//         </button>

//         <button 
//           onClick={() => showToast("Mohon tunggu...", "loading")}
//           className="flex items-center gap-2 bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-500 hover:text-white transition-all"
//         >
//           <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading
//         </button>
//       </div>

//       {/* 3. STATS GRID */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((stat) => (
//           <div 
//             key={stat.label} 
//             className={`bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] shadow-2xl ${stat.glow} transition-all hover:border-zinc-700 group`}
//           >
//             <div className="flex justify-between items-start mb-4">
//               <div className={`p-3 rounded-2xl bg-zinc-950 border border-zinc-800 ${stat.color} group-hover:scale-110 transition-transform`}>
//                 <stat.icon className="w-6 h-6" />
//               </div>
//               <span className="text-emerald-500 text-[10px] font-bold bg-emerald-500/10 px-2 py-1 rounded-full flex items-center gap-1">
//                 +12% <ArrowUpRight className="w-3 h-3" />
//               </span>
//             </div>
//             <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
//             <h3 className="text-3xl font-black tracking-tighter text-white">{stat.value}</h3>
//           </div>
//         ))}
//       </div>

//       {/* 4. CONTENT GRID */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Main List */}
//         <div className="lg:col-span-2 space-y-6">
//           <h2 className="text-xl font-bold flex items-center gap-2">
//             <Activity className="w-5 h-5 text-blue-500" /> Materi Terakhir
//           </h2>
//           {[1, 2, 3].map((i) => (
//             <div key={i} className="group bg-zinc-900/40 border border-zinc-800 hover:border-blue-500/30 p-5 rounded-3xl flex items-center gap-5 transition-all cursor-pointer">
//               <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center group-hover:bg-blue-600/10 transition-colors">
//                 <BookOpen className="w-7 h-7 text-zinc-500 group-hover:text-blue-500 transition-colors" />
//               </div>
//               <div className="flex-1">
//                 <h4 className="font-bold text-lg mb-0.5 group-hover:text-white transition-colors">Fisika Quantum Dasar</h4>
//                 <p className="text-xs text-zinc-500">Sub-Kategori: UTBK • 15 Bab • 200 Soal</p>
//               </div>
//               <ArrowUpRight className="w-5 h-5 text-zinc-700 group-hover:text-blue-500 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
//             </div>
//           ))}
//         </div>

//         {/* Sidebar Activity */}
//         <div className="bg-zinc-900/60 border border-zinc-800 rounded-[2.5rem] p-8">
//            <h3 className="text-lg font-bold mb-6">Log Aktivitas</h3>
//            <div className="space-y-8 relative">
//               <div className="absolute left-4 top-2 bottom-2 w-px bg-zinc-800" />
//               {[1, 2, 3].map((i) => (
//                 <div key={i} className="flex gap-4 relative z-10">
//                   <div className="w-8 h-8 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0">
//                     <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
//                   </div>
//                   <div>
//                     <p className="text-xs text-zinc-300 font-medium">Admin menambahkan 20 soal baru di Bab Listrik</p>
//                     <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-1">2 jam yang lalu</p>
//                   </div>
//                 </div>
//               ))}
//            </div>
//         </div>
//       </div>
//     </div>
//   );
// }