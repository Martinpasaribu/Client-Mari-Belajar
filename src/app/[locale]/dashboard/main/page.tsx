/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState, useMemo } from 'react';
import api from '@/lib/axios';
import Link from 'next/link';
import { 
  BookOpen, 
  Lock, 
  Sparkles, 
  Clock,
  ArrowRight,
  Loader2,
  LockOpen,
  Zap,
  Search,
  X,
  CreditCard
} from 'lucide-react';
// Import wrapper animasi kita
import { FadeInContainer, FadeInItem } from "@/components/animations/MotionWrapper";

export default function DashboardPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [availableCatalogs, setAvailableCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const resEnroll = await api.get('/enrollments/my-modules/all');
        setEnrollments(resEnroll.data);

        const resCatalogs = await api.get('/catalogs'); 
        const enrolledIds = resEnroll.data.map((e: any) => e.sub_category_key?._id);
        const notOwned = resCatalogs.data.data.filter((c: any) => !enrolledIds.includes(c._id));
        
        setAvailableCatalogs(notOwned);
      } catch (err) {
        console.error("Gagal mengambil data dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeModules = useMemo(() => {
    return enrollments.filter((e: any) => 
      e.status === 'success' && 
      e.sub_category_key?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, enrollments]);

  const pendingModules = useMemo(() => {
    return enrollments.filter((e: any) => 
      e.status === 'pending' && 
      e.sub_category_key?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, enrollments]);

  const filteredCatalogs = useMemo(() => {
    return availableCatalogs.filter((c: any) => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, availableCatalogs]);

  if (loading) return (
    <div className="flex h-[80vh] flex-col items-center justify-center bg-bg1 dark:bg-dark-bg1 gap-4 transition-colors">
      <Loader2 className="h-12 w-12 animate-spin text-primary-1" />
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Loading Workspace</p>
    </div>
  );

  return (
    <FadeInContainer className="min-h-screen bg-bg1 dark:bg-dark-bg1 transition-colors duration-300 pb-20">
      <div className="max-w-7xl mx-auto p-6 lg:p-12">
        
        {/* TOP BAR / WELCOME */}
        <FadeInItem className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-1/10 border border-primary-1/20 text-primary-1">
              <Zap size={12} fill="currentColor" />
              <span className="text-[9px] font-black uppercase tracking-widest text-primary-1">Dashboard Active</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
              Siap Belajar <span className="text-primary-1">Hari Ini?</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Lanjutkan progress belajarmu atau jelajahi materi baru.</p>
          </div>
          
          <div className="flex gap-4">
             <div className="bg-bg2 dark:bg-dark-bg2 px-6 py-4 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-sm text-center min-w-[120px]">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Active</p>
                <p className="text-3xl font-black text-primary-1 leading-none">{activeModules.length}</p>
             </div>
             <div className="bg-bg2 dark:bg-dark-bg2 px-6 py-4 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-sm text-center min-w-[120px]">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Catalog</p>
                <p className="text-3xl font-black text-dark-primary-2 leading-none">{availableCatalogs.length}</p>
             </div>
          </div>
        </FadeInItem>

        {/* SECTION: PENDING MODULES */}
        {pendingModules.length > 0 && (
          <FadeInItem className="mb-12">
            <div className="flex items-center gap-3 mb-6 px-2">
              <Clock className="text-amber-500 animate-pulse" size={20} />
              <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">Menunggu Pembayaran</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingModules.map((item: any) => (
                <div key={item._id} className="bg-amber-500/5 border border-amber-500/20 rounded-[2rem] p-6 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-500/10 text-amber-600 rounded-xl flex items-center justify-center">
                      <CreditCard size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{item.sub_category_key?.name}</h4>
                      <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Pending Verification</p>
                    </div>
                  </div>
                  <Link href={`/dashboard/payment/${item._id}`} className="px-4 py-2 bg-amber-500 text-white text-[10px] font-black uppercase rounded-xl hover:bg-amber-600 transition-colors">
                    Cek Status
                  </Link>
                </div>
              ))}
            </div>
          </FadeInItem>
        )}

        {/* SECTION: ACTIVE MODULES */}
        <div className="mb-20">
          <FadeInItem className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-1 text-white flex items-center justify-center shadow-lg shadow-primary-1/30">
                <Sparkles size={18} fill="currentColor" />
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Materi Aktif</h2>
            </div>
          </FadeInItem>

          {activeModules.length === 0 ? (
            <FadeInItem>
              <div className="bg-bg2/50 dark:bg-dark-bg2/40 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[3rem] py-16 flex flex-col items-center text-center">
                <p className="text-slate-500 font-bold italic text-sm">
                  {searchQuery ? `"${searchQuery}" tidak ditemukan` : "Belum ada modul aktif."}
                </p>
              </div>
            </FadeInItem>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {activeModules.map((enroll: any) => (
                <FadeInItem key={enroll._id}>
                  <Link href={`/dashboard/modules/${enroll.sub_category_key?._id}`} className="group block h-full">
                    <div className="relative h-full bg-bg2 dark:bg-dark-bg2 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 shadow-sm transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-primary-1/10 overflow-hidden">
                      <div className="flex flex-col h-full">
                        <div className="flex justify-between items-start mb-8">
                          <div className="w-14 h-14 bg-bg1 dark:bg-dark-bg1 border border-slate-100 dark:border-white/10 rounded-2xl flex items-center justify-center text-primary-1 group-hover:bg-primary-1 group-hover:text-white transition-all duration-500">
                            <BookOpen size={28} />
                          </div>
                          <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">Ready</div>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 leading-tight group-hover:text-primary-1 transition-colors">
                          {enroll.sub_category_key?.name}
                        </h3>
                        <div className="mt-auto pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
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
                </FadeInItem>
              ))}
            </div>
          )}
        </div>

        {/* SECTION: CATALOGS */}
        <section>
          <FadeInItem className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 px-2">
            <div className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-2">
                  <Lock size={18} className="text-slate-400" /> Katalog Terbaru
                </h2>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Upgrade skill kamu sekarang</p>
              </div>
              <Link href="/dashboard/catalogs" className="inline-block px-5 py-2 rounded-full border border-slate-200 dark:border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white dark:hover:bg-white/5 transition-all">
                Semua Katalog
              </Link>
            </div>

            <div className="relative w-full lg:max-w-md group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <Search size={18} className="text-slate-400 group-focus-within:text-primary-1 transition-colors" />
              </div>
              <input 
                type="text"
                placeholder="Cari materi atau katalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-12 py-4 bg-bg2 dark:bg-dark-bg2 border border-slate-200 dark:border-white/5 rounded-[3rem] text-sm font-bold text-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-1/20 focus:border-primary-1 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-sm"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-4 flex items-center px-2 text-slate-400 hover:text-red-500">
                  <X size={18} />
                </button>
              )}
            </div>
          </FadeInItem>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCatalogs.map((item: any) => (
              <FadeInItem key={item._id}>
                <div className="group h-full bg-white dark:bg-dark-bg2/40 border border-slate-200 dark:border-white/5 rounded-[2rem] p-6 transition-all hover:shadow-xl dark:hover:bg-dark-bg2 flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-dark-bg1 flex items-center justify-center text-slate-400 shadow-inner group-hover:text-dark-primary-2 transition-colors">
                      {item.isFree ? <LockOpen size={20} className="text-emerald-500" /> : <Lock size={20} />}
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-200 mb-6 line-clamp-2 leading-snug group-hover:text-primary-1 transition-colors">
                    {item.name}
                  </h4>
                  <div className="mt-auto">
                    <Link 
                      href={`/dashboard/catalogs/${item._id}`}
                      className={`w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] text-center block transition-all active:scale-95 shadow-sm
                        ${item.isFree ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-dark-primary-2 text-white hover:bg-primary-1'}`}
                    >
                      {item.isFree ? 'Ambil Gratis' : 'Buka Akses'}
                    </Link>
                  </div>
                </div>
              </FadeInItem>
            ))}
          </div>
        </section>
      </div>
    </FadeInContainer>
  );
}