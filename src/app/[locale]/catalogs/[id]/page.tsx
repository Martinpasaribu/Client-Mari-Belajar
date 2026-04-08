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

  if (loading) return (
    <div className="flex h-screen flex-col items-center justify-center bg-bg1 dark:bg-dark-bg1 gap-4">
      <div className="relative">
        <Loader2 className="h-12 w-12 animate-spin text-primary-1" />
        <div className="absolute inset-0 blur-xl bg-primary-1/20 animate-pulse"></div>
      </div>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] animate-pulse">Initializing Module</p>
    </div>
  );

  if (!catalog) return <div className="p-20 text-center font-black uppercase tracking-widest">Modul tidak ditemukan.</div>;

  return (
    <div className="min-h-screen bg-bg1 dark:bg-transparent transition-colors pb-10 md:pb-20 overflow-x-hidden">
      {/* Background Ornaments */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary-1/5 blur-[120px] rounded-full -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-primary-2/5 blur-[120px] rounded-full -z-10 -translate-x-1/2 translate-y-1/2" />

      <FadeInContainer className="max-w-7xl mx-auto px-2 md:px-6 pt-5 md:pt-10">
        <FadeInItem>
          <button 
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-slate-500 hover:text-primary-1 font-bold text-[10px] uppercase tracking-widest mb-10 transition-all"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            Kembali ke Halaman Utama
          </button>
        </FadeInItem>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">

          <FadeInItem>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-white/5 border shadow-sm ${
              catalog.isFree 
              ? 'border-emerald-500/20 text-white' 
              : 'border-primary-1/20 text-white'
            }`}>
              <Sparkles size={14} className={catalog.isFree ? "" : "animate-pulse"} />
              <div className="flex text-[10px] font-black uppercase tracking-[0.2em]">
                <h1 className='text-primary-2'>Katalog</h1> 
                <span className="ml-1">
                  {catalog.isFree ? (
                    <span className="text-emerald-600 dark:text-emerald-400">Freemium</span>
                  ) : (
                    <span className='text-blue-600 dark:text-blue-400'>Premium</span>
                  )}
                </span>
              </div>
            </div>
          </FadeInItem>
            
            <FadeInItem>
              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[0.95] tracking-tighter uppercase ">
                {catalog.name.split(' ').map((word: string, i: number) => (
                  <span key={i} className={i === 1 ? "text-primary-1" : ""}>{word} </span>
                ))}
              </h1>
            </FadeInItem>
            
            <FadeInItem>
              <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl font-medium">
                {catalog.description || "Mastering the craft with our expert-led curriculum designed for the next generation of leaders."}
              </p>
            </FadeInItem>

            <FadeInItem className="flex flex-wrap gap-8 py-6 border-y border-slate-100 dark:border-white/5">
              <Stat icon={<PlayCircle size={20} />} label={`${syllabus.length} Bab Materi`} />
              <Stat icon={<FileText size={20} />} label="Latihan Soal" />
              <Stat icon={<Clock size={20} />} label="Life-time" />
            </FadeInItem>
          </div>

          <ScaleIn className="relative">
            <div className="absolute inset-0 bg-primary-1/30 blur-[100px] rounded-full opacity-20 -z-10 animate-pulse"></div>
            <div className="bg-white dark:bg-dark-bg2 border border-slate-200 dark:border-white/10 rounded-[3.5rem] p-10 lg:p-14 shadow-2xl relative overflow-hidden">
              {/* Card Decor */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-1/10 rounded-bl-[5rem] -mr-10 -mt-10" />
              
              <div className="relative z-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Investasi Masa Depan</p>
                <div className="flex items-baseline gap-2 mb-10">
                  <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                    {catalog.isFree ? "FREE" : `IDR ${catalog.price?.toLocaleString('id-ID')}`}
                  </h2>
                  {!catalog.isFree && <span className="text-slate-400 font-bold text-sm">/ Modul</span>}
                </div>

                <div className="space-y-5 mb-12">
                  <Benefit text="Sertifikat Standar Industri" />
                  <Benefit text="Konsultasi Langsung Mentor" />
                  <Benefit text="Update Materi Selamanya" />
                </div>

                <button 
                  onClick={() => setIsConfirmOpen(true)}
                  className="w-full py-6 bg-slate-900 dark:bg-primary-1 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-primary-1/20 hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center justify-center gap-3 group"
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

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={onConfirmEnroll}
        title="Konfirmasi Pendaftaran"
        description={`Apakah Anda yakin ingin mengambil modul "${catalog.name}"? Akses akan langsung dibuka setelah konfirmasi.`}
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