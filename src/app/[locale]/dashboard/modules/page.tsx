/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useMemo } from "react";
import api from "@/lib/axios";
import { BookOpen, Search, GraduationCap, Clock, ArrowRight, Library } from "lucide-react";
import Link from 'next/link'; 
import MyModuleCard from "@/components/card/MyModuleCard";
import { FadeInContainer, FadeInItem } from "@/components/animations/MotionWrapper";

export default function MyModulesPage() {
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchMyModules = async () => {
      try {
        const { data } = await api.get('/enrollments/my-modules');
        setModules(data.data || data);
      } catch (error) {
        console.error("Gagal mengambil modul saya", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyModules();
  }, []);

  // Filter modul berdasarkan search
  const filteredModules = useMemo(() => {
    return modules.filter((m: any) => 
      m.sub_category_key?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, modules]);

  return (
    <FadeInContainer className="space-y-12 pb-20">
      
      {/* HEADER & STATS SECTION */}
      <FadeInItem className="relative overflow-hidden bg-primary-1 dark:bg-dark-primary-2 rounded-[3rem] p-4 px-6 md:p-6 md:px-10 text-white shadow-2xl">
        <div className="absolute top-[-20%] right-[-10%] h-64 w-64 rounded-full bg-primary/20 blur-[100px]" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <Library size={12} className="text-primary" />
              <span className="text-[9px] font-black uppercase tracking-widest text-primary">Personal Library</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase leading-none">
              Modul <span className="text-primary italic">Saya</span>
            </h1>
            <p className="text-gray-800 dark:text-primary-1 font-medium max-w-md">
              Koleksi materi belajar yang kamu miliki. Fokus, konsisten, dan selesaikan targetmu hari ini.
            </p>
          </div>

          <div className="flex gap-4 sm:gap-6">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] min-w-[120px] text-center">
              <p className="text-[10px] font-black text-primary uppercase mb-1 tracking-widest">Total Modul</p>
              <p className="text-4xl font-black">{modules.length}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] min-w-[120px] text-center">
              <p className="text-[10px] font-black text-dark-primary-2 dark:text-primary-1 uppercase mb-1 tracking-widest">Aktif</p>
              <p className="text-4xl font-black text-dark-primary-2  dark:text-primary-1">
                {modules.filter(m => m.status === 'success').length}
              </p>
            </div>
          </div>
        </div>
      </FadeInItem>

      {/* SEARCH & FILTERS */}
      <FadeInItem className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
        <div className="flex items-center gap-3">
            <div className="h-10 w-1 bg-primary rounded-full" />
            <h2 className="text-xl font-black uppercase tracking-tighter text-slate-800 dark:text-white">
                Daftar <span className="text-slate-400">Materi</span>
            </h2>
        </div>

        <div className="relative group w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="CARI JUDUL MODUL..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
          />
        </div>
      </FadeInItem>

      {/* CONTENT GRID */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 rounded-[2.5rem] bg-slate-100 dark:bg-slate-800/50 animate-pulse border border-slate-200 dark:border-white/5" />
          ))}
        </div>
      ) : filteredModules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredModules.map((item: any) => (
            <FadeInItem key={item.id || item._id}>
              <div className="group relative">
                {/* Kita bungkus Card kamu dengan hover effect tambahan jika perlu */}
                <MyModuleCard enrollment={item} />
              </div>
            </FadeInItem>
          ))}
        </div>
      ) : (
        <FadeInItem className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-white/5">
          <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-3xl flex items-center justify-center mb-6 text-slate-300">
            <GraduationCap size={40} />
          </div>
          <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase mb-2">
            {searchQuery ? "Modul tidak ditemukan" : "Belum ada modul"}
          </h3>
          <p className="text-slate-400 text-sm font-medium mb-8 text-center max-w-xs">
            {searchQuery ? `Tidak ada hasil untuk "${searchQuery}". Coba kata kunci lain.` : "Mulailah perjalanan belajarmu dengan memilih materi di katalog kami."}
          </p>
          <Link 
            href="/dashboard/catalogs" 
            className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
          >
            Eksplor Katalog <ArrowRight size={14} />
          </Link>
        </FadeInItem>
      )}
    </FadeInContainer>
  );
}