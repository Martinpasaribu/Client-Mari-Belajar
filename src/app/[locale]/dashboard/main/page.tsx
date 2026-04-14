/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState, useMemo } from 'react';
import api from '@/lib/axios';
import Link from 'next/link';
import { 
  BookOpen, Lock, Sparkles, Clock, ArrowRight, Zap, Search, X, CreditCard 
} from 'lucide-react';

import { FadeInContainer, FadeInItem } from "@/components/animations/MotionWrapper";
import { TakeCatalogsCard } from '@/components/card/TakeCatalogCard';
import { MainLoading } from '@/components/modals/MainLoading';

export default function DashboardPage() {
  // --- STATES ---
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [availableCatalogs, setAvailableCatalogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // --- FETCH DATA ---
  useEffect(() => {
    const controller = new AbortController(); // Pengaman navigasi cepat

    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [resEnroll, resCatalogs] = await Promise.all([
          api.get('/enrollments/my-modules/all', { signal: controller.signal }),
          api.get('/catalogs', { signal: controller.signal })
        ]);

        // Proteksi jika data bukan array
        const enrollData = Array.isArray(resEnroll.data) ? resEnroll.data : (resEnroll.data?.data || []);
        const catalogRaw = Array.isArray(resCatalogs.data?.data) ? resCatalogs.data.data : (resCatalogs.data || []);

        setEnrollments(enrollData);

        // Filter katalog yang belum dimiliki (Defensive check pada sub_category_key)
        const enrolledIds = enrollData
          .map((e: any) => e.sub_category_key?._id)
          .filter(Boolean); // Buang nilai null jika ada data kotor

        const notOwned = catalogRaw.filter((c: any) => !enrolledIds.includes(c._id));
        
        setAvailableCatalogs(notOwned);

        // Beri jeda sedikit agar transisi loader terasa smooth
        await new Promise((resolve) => setTimeout(resolve, 800));
      } catch (err: any) {
        if (err.name !== 'CanceledError') {
          console.error("Gagal mengambil data dashboard:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort(); // Batalkan request jika user pindah halaman sebelum selesai
  }, []);

  // --- LOGIC FILTERING ---
  const activeModules = useMemo(() => {
    return enrollments.filter((e: any) => 
      e.status === 'success' && 
      (e.sub_category_key?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, enrollments]);

  const pendingModules = useMemo(() => {
    return enrollments.filter((e: any) => 
      e.status === 'pending' && 
      (e.sub_category_key?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, enrollments]);

  const filteredCatalogs = useMemo(() => {
    return availableCatalogs.filter((c: any) => 
      (c.name || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, availableCatalogs]);

  return (
    <>
      {/* GLOBAL LOADER */}
      <MainLoading isOpen={loading} title="Menyiapkan Workspace..." />

      <FadeInContainer className="min-h-screen bg-bg1 dark:bg-transparent transition-colors duration-300 pb-20">
        <div className="max-w-7xl mx-auto p-1 md:p-6 lg:p-12">
          
          {!loading && (
            <>
              {/* SECTION: WELCOME & STATS */}
              <FadeInItem className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 mb-2 rounded-full bg-primary-1/10 border border-primary-1/20 text-primary-1">
                    <Zap size={12} fill="currentColor" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary-1">Dashboard Active</span>
                  </div>
                  <h1 className="text-xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase">
                    Siap Belajar <span className="text-primary-1 ">Hari Ini?</span>
                  </h1>
                  <p className="text-sm md:text-lg text-slate-500 dark:text-slate-400 font-medium">Lanjutkan progress belajarmu atau jelajahi materi baru.</p>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-bg2 dark:bg-dark-bg2 px-3 py-2 md:px-6 md:py-4 min-w-[70px] md:min-w-[120px] rounded-[1rem] md:rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-sm text-center ">
                      <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Active</p>
                      <p className="text:xl md:text-3xl font-black text-primary-1 leading-none">{activeModules.length}</p>
                  </div>
                  <div className="bg-bg2 dark:bg-dark-bg2 px-3 py-2 md:px-6 md:py-4 min-w-[70px] md:min-w-[120px] rounded-[1rem] md:rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-sm text-center">
                      <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Module</p>
                      <p className="text:xl md:text-3xl  font-black text-dark-primary-2 leading-none">{availableCatalogs.length}</p>
                  </div>
                </div>
              </FadeInItem>

              {/* SECTION: PENDING (Hanya muncul jika ada) */}
              {pendingModules.length > 0 && (
                <FadeInItem className="mb-12">
                  <div className="flex items-center gap-3 mb-6 px-2">
                    <Clock className="text-amber-500 animate-pulse" size={20} />
                    <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">Menunggu Pembayaran</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pendingModules.map((item: any) => (
                      <div key={item._id} className="bg-amber-500/5 border border-amber-500/20 rounded-[2.5rem] p-6 flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-amber-500/10 text-amber-600 rounded-2xl flex items-center justify-center">
                            <CreditCard size={24} />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">{item.sub_category_key?.name}</h4>
                            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Pending Verification</p>
                          </div>
                        </div>
                        <Link href={`/dashboard/payment/${item._id}`} className="px-6 py-3 bg-amber-500 text-white text-[10px] font-black uppercase rounded-xl hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20">
                          Selesaikan
                        </Link>
                      </div>
                    ))}
                  </div>
                </FadeInItem>
              )}

              {/* SECTION: MATERI AKTIF */}
              <div className="mb-20">
                <FadeInItem className="flex items-center justify-between mb-8 px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-1 text-white flex items-center justify-center shadow-lg shadow-primary-1/30">
                      <Sparkles size={18} fill="currentColor" />
                    </div>
                    <h2 className="text-sm md:text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Materi Aktif</h2>
                  </div>
                </FadeInItem>

                {activeModules.length === 0 ? (
                  <FadeInItem>
                    <div className="bg-bg2/50 dark:bg-dark-bg2/40 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[3rem] py-20 flex flex-col items-center text-center">
                      <p className="text-slate-400 font-bold italic text-sm">
                        {searchQuery ? `"${searchQuery}" tidak ditemukan` : "Belum ada modul yang aktif di akunmu."}
                      </p>
                    </div>
                  </FadeInItem>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-8">
                    {activeModules.map((enroll: any) => (
                      <FadeInItem key={enroll._id}>
                        {enroll.sub_category_key && (
                          <Link href={`/dashboard/modules/${enroll.sub_category_key?._id}`} className="group block h-full">
                            <div className="relative h-full bg-bg2 dark:bg-dark-bg2 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-5 md:p-8 shadow-sm transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-primary-1/10 overflow-hidden">
                              <div className="flex flex-col h-full">
                                <div className="flex justify-between items-start mb-4 md:mb-8">
                                  <div className="w-10 h-10 md:w-14 md:h-14 bg-bg1 dark:bg-dark-bg1 border border-slate-100 dark:border-white/10 rounded-2xl flex items-center justify-center text-primary-1 group-hover:bg-primary-1 group-hover:text-white transition-all duration-500">
                                    <BookOpen size={28} />
                                  </div>
                                  <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">Active</div>
                                </div>
                                <h3 
                                  className="text-md md:text-2xl font-black text-slate-900 dark:text-white mb-2  group-hover:text-primary-1 transition-colors  leading-tight uppercase tracking-tighter line-clamp-2 truncate">
                                  {enroll.sub_category_key?.name}
                                </h3>
                                {/* <h3 className="text-md md:text-2xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-primary-1 transition-colors leading-tight uppercase tracking-tighter line-clamp-2">
                                  {enroll.sub_category_key?.name}
                                </h3> */}
                                <div className="mt-auto pt-4 md:pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                                  <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold uppercase tracking-tighter">
                                    <Clock size={14} className="text-dark-primary-2" />
                                    <span>Exp: {new Date(enroll.expiredAt).toLocaleDateString('id-ID')}</span>
                                  </div>
                                  <div className="w-10 h-10 rounded-full bg-primary-1 text-white flex items-center justify-center shadow-lg shadow-primary-1/30 group-hover:scale-110 transition-transform">
                                    <ArrowRight size={18} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        )}
                      </FadeInItem>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION: KATALOG TERBARU */}
              <section>
                <FadeInItem className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-10 gap-3 md:gap-6 md:px-2">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h2 className="text-sm md:text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-2">
                        <Lock size={18} className="text-slate-400" /> Katalog Terbaru
                      </h2>
                      <p className="text-[9px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest">Upgrade skill kamu sekarang</p>
                    </div>
                    <Link href="/dashboard/catalogs" className="inline-block px-5 py-2 rounded-full border border-slate-200 dark:border-white/40 text-[10px] font-black uppercase tracking-widest hover:bg-white dark:hover:bg-white/5 transition-all">
                      Semua Katalog
                    </Link>
                  </div>

                  {/* SEARCH BAR */}
                  <div className="relative w-full lg:max-w-md group mt-2">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                      <Search size={18} className="text-slate-400 group-focus-within:text-primary-1 transition-colors" />
                    </div>
                    <input 
                      type="text"
                      placeholder="CARI MATERI ATAU KATALOG..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-14 pr-12 py-4 bg-bg2 dark:bg-dark-bg2 border border-slate-200 dark:border-white/5 rounded-[3rem] text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-1/20 focus:border-primary-1 transition-all shadow-sm"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-4 flex items-center px-2 text-slate-400 hover:text-red-500">
                        <X size={18} />
                      </button>
                    )}
                  </div>
                </FadeInItem>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredCatalogs.map((item: any) => (
                    <FadeInItem key={item._id}>
                      <TakeCatalogsCard item={item} />
                    </FadeInItem>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </FadeInContainer>
    </>
  );
}