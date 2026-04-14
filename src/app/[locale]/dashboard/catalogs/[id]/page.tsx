/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { 
  ChevronLeft, 
  PlayCircle, 
  FileText, 
  Clock, 
  ShieldCheck, 
  Zap, 
  Star,
  CheckCircle2,
  Lock,
  Loader2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { FadeInContainer, FadeInItem, ScaleIn, BlurIn } from '@/components/animations/MotionWrapper';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { MainLoading } from '@/components/modals/MainLoading';
import { MainEmpty } from '@/components/modals/MainEmpty';

export default function CatalogDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  // MAP DATA: Sesuaikan dengan struktur { catalog, bab }
  const [data, setData] = useState<any>(null); 
  const [loading, setLoading] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/catalogs/${params.id}`);
        // Response NestJS biasanya dibungkus property 'data'
        setData(response.data.data || response.data);
      } catch (err) {
        console.error("Gagal memuat detail katalog", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [params.id]);

  // Shortcut Variables
  const catalog = data?.catalog;
  const syllabus = data?.bab || [];

  const onConfirmEnroll = async () => {
    if(!catalog) return;
    setIsConfirmOpen(false);
    setLoading(true);
    try {
      const payload = {
        sub_category_key: catalog._id,
        user_key: "000000000000000000000000", // Ganti dengan ID User dari Store nantinya
        enrollment_type: catalog.isFree ? 'free' : 'purchased',
        status: catalog.isFree ? 'success' : 'pending',
        amountPaid: catalog.price || 0,
        isActive: catalog.isFree ? true : false
      };

      await api.post('/enrollments/buy', payload);
      router.replace(`/dashboard/main`);
    } catch (error: any) {
      alert("Gagal melakukan pendaftaran. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg1 dark:bg-transparent transition-colors pb-10 md:pb-20 overflow-x-hidden">
      
      {/* GLOBAL LOADER */}
      <MainLoading isOpen={loading} title="catalogs" />

      {/* Background Ornaments */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary-1/5 blur-[120px] rounded-full -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-primary-2/5 blur-[120px] rounded-full -z-10 -translate-x-1/2 translate-y-1/2" />

      {/* 2. Logic Tampilan setelah Loading Selesai */}
        {!loading && (
          <>
            {!catalog ? (
              /* Tampilan Jika Data Kosong */
              <MainEmpty 
                title="Modul Tidak Ditemukan" 
                description="Sepertinya modul yang kamu cari tidak tersedia di katalog kami saat ini."
              />
            ) : (

              <FadeInContainer className="max-w-7xl mx-auto px-1 md:px-6 pt-4 md:pt-10">
                <FadeInItem>
                  <button 
                    onClick={() => router.back()}
                    className="group flex items-center gap-2 text-slate-500 hover:text-primary-1 font-bold text-[10px] uppercase tracking-widest mb-10 transition-all"
                  >
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
                    Kembali ke Halaman Utama
                  </button>
                </FadeInItem>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start px-4 sm:px-0">
                {/* KOLOM KIRI: Konten Utama */}
                <div className="space-y-6 lg:space-y-8">
                  <FadeInItem>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-white/5 border shadow-sm ${
                      catalog.isFree 
                      ? 'border-emerald-500/20' 
                      : 'border-primary-1/20'
                    }`}>
                      <Sparkles size={14} className={catalog.isFree ? "text-emerald-500" : "text-primary-1 animate-pulse"} />
                      <div className="flex text-[10px] font-black uppercase tracking-[0.2em] items-center">
                        <span className='text-slate-400 dark:text-slate-500'>Katalog</span> 
                        <span className="ml-2 py-0.5 px-2 rounded-md bg-slate-100 dark:bg-white/10">
                          {catalog.isFree ? (
                            <span className="text-emerald-600 dark:text-emerald-400">Freemium</span>
                          ) : (
                            <span className='text-primary-1'>Premium</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </FadeInItem>


                                    
                  <FadeInItem>
                    {/* Ubah text-3xl menjadi text-xl atau text-2xl di mobile.
                      Gunakan leading-tight agar jarak baris lebih rapat untuk judul/nama.
                      Gunakan break-words untuk menjaga kata panjang tidak melewati container.
                    */}
                    <p className="text-xl sm:text-2xl lg:text-4xl text-slate-500 dark:text-slate-400 leading-tight lg:leading-relaxed max-w-xl font-bold break-words">
                      {catalog.name.split(' ').map((word: string, i: number) => (
                        <span key={i} className={`${i === 1 ? "text-primary-1" : ""} inline-block mr-2`}>
                          {word}
                        </span>
                      ))}
                    </p>
                  </FadeInItem>

                  <FadeInItem>
                    {/* Deskripsi sebaiknya lebih kecil dari judul agar hirarki visualnya bagus */}
                    <p className="text-base lg:text-xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl font-medium mt-4">
                      {catalog.description || "Mastering the craft with our expert-led curriculum designed for the next generation of leaders."}
                    </p>
                  </FadeInItem>

                  <FadeInItem className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 lg:gap-8 py-6 border-y border-slate-100 dark:border-white/5">
                    <Stat icon={<PlayCircle size={18} className="text-primary-1" />} label={`${syllabus.length} Bab`} />
                    <Stat icon={<FileText size={18} className="text-primary-1" />} label="Latihan" />
                    <Stat icon={<Clock size={18} className="text-primary-1" />} label="Life-time" />
                  </FadeInItem>
                </div>

                {/* KOLOM KANAN: Card Investasi */}
                <ScaleIn className="relative w-full">
                  <div className="absolute inset-0 bg-primary-1/30 blur-[80px] lg:blur-[100px] rounded-full opacity-20 -z-10 animate-pulse"></div>
                  
                  {/* Perbaikan: rounded dan padding adaptif. 
                    Mobile: p-8, rounded-3xl. Desktop: p-14, rounded-[3.5rem].
                  */}
                  <div className="bg-white dark:bg-dark-bg2 border border-slate-200 dark:border-white/10 rounded-[2.5rem] lg:rounded-[3.5rem] p-8 lg:p-14 shadow-2xl relative overflow-hidden">
                    {/* Card Decor - Sembunyikan di mobile agar tidak mengganggu teks */}
                    <div className="hidden sm:block absolute top-0 right-0 w-32 h-32 bg-primary-1/5 rounded-bl-[5rem] -mr-10 -mt-10" />
                    
                    <div className="relative z-10">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Investasi Masa Depan</p>
                      
                      <div className="flex flex-wrap items-baseline gap-2 mb-8 lg:mb-10">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                          {catalog.isFree ? "FREE" : `IDR ${catalog.price?.toLocaleString('id-ID')}`}
                        </h2>
                        {!catalog.isFree && <span className="text-slate-400 font-bold text-xs lg:text-sm">/ Modul</span>}
                      </div>

                      <div className="space-y-4 lg:space-y-5 mb-8 lg:mb-12">
                        <Benefit text="Sertifikat Standar Industri" />
                        <Benefit text="Konsultasi Langsung Mentor" />
                        <Benefit text="Update Materi Selamanya" />
                      </div>

                      <button 
                        onClick={() => setIsConfirmOpen(true)}
                        className="w-full py-5 lg:py-6 bg-slate-900 dark:bg-primary-1 text-white rounded-2xl lg:rounded-[2rem] font-black text-[10px] lg:text-[11px] uppercase tracking-[0.2em] lg:tracking-[0.3em] shadow-xl hover:shadow-primary-1/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
                      >
                        Daftar Sekarang
                        <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                      </button>
                    </div>
                  </div>
                </ScaleIn>
              </div>

                {/* CURRICULUM SECTION - Sekarang menggunakan data syllabus asli */}
                <div className="mt-32">
                  <FadeInItem className="flex items-center gap-4 mb-12">
                    <div className="h-px flex-1 bg-slate-100 dark:bg-white/5"></div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-[0.3em] ">
                      Syllabus <span className="text-primary-1">Overview</span>
                    </h2>
                    <div className="h-px flex-1 bg-slate-100 dark:bg-white/5"></div>
                  </FadeInItem>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {syllabus.map((item: any, i: number) => (
                      <FadeInItem key={item._id}>
                        <div className="p-8 bg-white dark:bg-dark-bg2 border border-slate-100 dark:border-white/5 rounded-[2.5rem] group hover:border-primary-1 transition-all hover:shadow-xl hover:shadow-primary-1/5 relative">
                          <span className="absolute top-6 right-8 text-4xl font-black text-slate-100 dark:text-white/5 group-hover:text-primary-1/10 transition-colors">0{i + 1}</span>
                          <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-6">
                              <Lock size={16} className="text-slate-400" />
                          </div>
                          <h4 className="font-black text-slate-800 dark:text-slate-200 uppercase text-xs tracking-widest mb-2">{item.name}</h4>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                            {item.description || "Materi pembelajaran terstruktur untuk penguasaan topik secara mendalam."}
                          </p>
                        </div>
                      </FadeInItem>
                    ))}
                    {syllabus.length === 0 && (
                      <div className="col-span-full py-10 text-center text-slate-400 text-xs font-black uppercase tracking-widest">
                        Syllabus belum tersedia.
                      </div>
                    )}
                  </div>
                </div>
              </FadeInContainer>
        )}
          </>
      )}

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={onConfirmEnroll}
        title="Konfirmasi Pendaftaran"
        description={`Apakah Anda yakin ingin mengambil modul "${catalog?.name}"? Akses akan langsung dibuka setelah konfirmasi.`}
      />
    </div>
  );
}

// Helper Components (Tetap Sama)
function Stat({ icon, label }: any) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-primary-1">{icon}</div>
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">{label}</span>
    </div>
  )
}

function Benefit({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-4 group">
      <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
        <CheckCircle2 size={14} className="text-emerald-500 group-hover:text-white transition-colors" />
      </div>
      <span className="text-xs font-bold text-slate-600 dark:text-slate-300 tracking-tight">{text}</span>
    </div>
  )
}