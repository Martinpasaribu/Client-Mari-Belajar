/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { 
  PlayCircle, ArrowRight, BookOpen, 
  Zap, Star, LayoutGrid, Quote, 
  Search, Trophy, Users, CheckCircle2
} from "lucide-react";
import api from "@/lib/axios";
import { FadeInContainer, FadeInItem } from "@/components/animations/MotionWrapper";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";

export default function LandingPage() {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  const { showToast } = useToast();

  const [statsData, setStatsData] = useState({
    totalQuestions: 0,
    totalUsers: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, subRes, statsRes] = await Promise.all([
          api.get('/categories'),
          api.get('/sub-categories'),
          api.get('/status/home')
        ]);
        setCategories(catRes.data.data || catRes.data);
        setSubCategories(subRes.data.data || subRes.data);

        if (statsRes.data.success) {
          setStatsData({
            totalQuestions: statsRes.data.data.totalQuestions,
            totalUsers: statsRes.data.data.totalUsers
          });
        }

      } catch (err) {
        console.error("Gagal memuat data:", err);
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
    { label: "Materi Update", value: "Setiap Hari", icon: Zap },
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
      <section className="pt-2 md:pt-32 md:pb-20 px-6 relative overflow-hidden min-h-[100hv]">
        <FadeInContainer className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <FadeInItem>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-1/10 border border-primary-1/20 text-primary-1 text-xs font-black uppercase tracking-widest">
              🎯 Platform Latihan Soal No. 1
            </div>
          </FadeInItem>
          <FadeInItem>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
              Asah Kemampuanmu <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-primary-1 to-primary-2">
                Dengan Puluhan Ribu Soal
              </span>
            </h1>
          </FadeInItem>
          <FadeInItem>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Temukan bank soal terlengkap untuk sekolah, kuliah, hingga persiapan kerja dengan pembahasan mendalam.
            </p>
          </FadeInItem>
          <FadeInItem className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href={'/category'} className="w-full sm:w-auto px-10 py-4 bg-primary-1 text-white rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-primary-1/20 transition-all flex items-center justify-center gap-2 group">
              Mulai Latihan <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="relative w-full sm:w-80">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
               <input 
                type="text" 
                placeholder="Cari materi soal..." 
                className="w-full pl-12 pr-4 py-4 bg-bg2 dark:bg-dark-bg2 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-1/50"
               />
            </div>
          </FadeInItem>
          <FadeInItem className="grid grid-cols-3 gap-4 pt-12 max-w-3xl mx-auto">
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col items-center p-4 rounded-2xl bg-bg2/50 dark:bg-dark-bg2/50 border border-slate-100 dark:border-slate-800 transition-all hover:scale-105">
                <s.icon className="text-primary-1 mb-2" size={20} />
                <span className="font-black text-xl">{s.value}</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{s.label}</span>
              </div>
            ))}
          </FadeInItem>
        </FadeInContainer>
      </section>

      {/* CATEGORY SECTION */}
      <section className="py-24 px-6 bg-bg2 dark:bg-dark-bg2/30">
        <FadeInContainer className="max-w-7xl mx-auto">
          <FadeInItem className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Materi Utama</h2>
            <p className="text-zinc-500 max-w-xl mx-auto">Pilih kategori besar materi yang ingin Anda kuasai.</p>
          </FadeInItem>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-64 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-[2.5rem]" />
            )) : categories.map((cat: any) => (
              <FadeInItem key={cat._id}>
                <div className="group p-8 rounded-[2.5rem] bg-bg1 dark:bg-dark-bg1 border border-slate-200 dark:border-slate-800 hover:border-primary-1 transition-all shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-primary-1 text-white flex items-center justify-center mb-6 shadow-lg shadow-primary-1/20">
                    <LayoutGrid size={24} />
                  </div>
                  <h3 className="text-2xl font-black mb-6 group-hover:text-primary-1 transition-colors">{cat.name}</h3>
                  <div className="space-y-2">
                    {subCategories
                      .filter((sub: any) => sub.category_key === cat._id)
                      .slice(0, 3)
                      .map((sub: any) => (
                        <div key={sub._id} className="flex items-center gap-3 p-3 rounded-xl bg-bg2 dark:bg-dark-bg2 text-sm font-bold border border-transparent hover:border-primary-1/30 transition-all">
                          <CheckCircle2 size={16} className="text-primary-1" />
                          <span>{sub.name}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </FadeInItem>
            ))}
          </div>
        </FadeInContainer>
      </section>

      {/* --- SECTION BARU: SEMUA SUB-CATEGORY --- */}
      <section className="py-24 px-6">
        <FadeInContainer className="max-w-7xl mx-auto">
          <FadeInItem className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl font-black mb-4">Daftar Materi Latihan</h2>
              <p className="text-zinc-500 dark:text-zinc-400">Pilih sub-materi spesifik untuk mulai mengerjakan bank soal hari ini.</p>
                          
              {/* <button onClick={testToast} className="w-full sm:w-auto px-10 py-4 bg-primary-1 text-white rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-primary-1/20 transition-all flex items-center justify-center gap-2 group">
                 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button> */}

            </div>
            <div className="px-4 py-2 bg-primary-1/10 text-primary-1 rounded-full text-xs font-bold uppercase tracking-widest border border-primary-1/20">
              {subCategories.length} Materi Tersedia
            </div>
          </FadeInItem>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {isLoading ? Array(8).fill(0).map((_, i) => (
              <div key={i} className="h-16 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl" />
            )) : subCategories.map((sub: any) => (
              <FadeInItem key={sub._id}>
                <div 
                  className="group flex items-center justify-between p-4 rounded-2xl bg-bg2 dark:bg-dark-bg2 border border-slate-100 dark:border-slate-800 hover:bg-primary-1 hover:text-white transition-all cursor-pointer shadow-sm hover:shadow-primary-1/20"
                >
                  <div className="flex flex-col">
                    <span className="text-xs opacity-50 font-bold uppercase tracking-tighter mb-0.5">Materi</span>
                    <span className="font-bold text-sm md:text-base leading-tight">{sub.name}</span>
                  </div>
                  <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all shrink-0" />
                </div>
              </FadeInItem>
            ))}
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
            <div className="grid grid-cols-2 gap-6">
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