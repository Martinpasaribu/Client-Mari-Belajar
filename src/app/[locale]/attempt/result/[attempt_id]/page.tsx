/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  CheckCircle2, 
  XCircle, 
  Info, 
  ArrowLeft, 
  RotateCcw, 
  Trophy, 
  Target, 
  Loader2, 
  AlertCircle,
  Sparkles,
  UserCircle2,
  Volume2
} from 'lucide-react';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { FadeInContainer, FadeInItem, ScaleIn } from "@/components/animations/MotionWrapper";

export default function GuestQuizResultPage() {
  const params = useParams();
  const router = useRouter();
  const attemptId = params.attempt_id;
  const { user } = useAuthStore(); // Cek status login

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!attemptId) return;

    const fetchResult = async () => {
      try {
        setIsLoading(true);
        
        // DINAMIS: Gunakan endpoint guest jika tidak ada user login
        const endpoint = user 
          ? `/attempts/${attemptId}/result` 
          : `/guest/attempts/${attemptId}/result`;

        const response = await api.get(endpoint);
        
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Gagal memuat hasil kuis.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResult();
  }, [attemptId, user]);

  // --- HELPER RENDER MEDIA ---
  const renderQuestionMedia = (q: any) => {
    const hasMainImage = q?.question_images && q.question_images.length > 0;
    if (!hasMainImage && !q?.question_audio) return null;

    return (
      <div className="space-y-4 mb-6">
        {hasMainImage && (
          <div className="rounded-2xl overflow-hidden border border-slate-100 dark:border-white/10 shadow-sm bg-bg2 dark:bg-dark-bg2 p-1 inline-block">
            <img src={q.question_images[0].url} alt="Question" className="max-h-[250px] w-auto object-contain rounded-xl" />
          </div>
        )}
        {q?.question_audio && (
          <div className="flex items-center gap-3 p-4 bg-bg2 dark:bg-dark-bg2 rounded-2xl border border-slate-100 dark:border-white/10 w-max">
            <Volume2 size={18} className="text-primary-1 dark:text-dark-primary1" />
            <audio controls className="h-8 w-40 scale-90"><source src={q.question_audio} /></audio>
          </div>
        )}
      </div>
    );
  };

  if (isLoading) return (
    <div className="flex h-screen flex-col items-center justify-center bg-bg1 dark:bg-dark-bg1 gap-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary-1" />
      <p className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-500 animate-pulse">Menghitung Skor Tamu...</p>
    </div>
  );

  if (error || !data) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center bg-bg1 dark:bg-dark-bg1">
      <XCircle size={48} className="text-red-500 mb-6" />
      <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2 uppercase tracking-tighter">Data Tidak Ditemukan</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs mx-auto text-sm">Hasil kuis tamu bersifat sementara dan mungkin telah kedaluwarsa.</p>
      <button onClick={() => router.push('/')} className="px-8 py-3 bg-primary-1 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">Kembali ke Beranda</button>
    </div>
  );

  const { total_score, correct_count, wrong_count, answers, bab_key, duration_seconds } = data;
  const skipped_count = answers?.filter((a: any) => !a.answer_given || a.answer_given === "").length || 0;

  return (
    <div className="min-h-screen bg-bg1 dark:bg-dark-bg1 pb-24 font-sans transition-colors duration-300">
      
      {/* GUEST BANNER */}
      <div className="bg-primary-2 dark:bg-dark-primary-2 text-white py-2 px-6 flex justify-center items-center gap-3 shadow-md z-[60] relative">
        <UserCircle2 size={14} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Mode Tamu: Progres tidak tersimpan permanen</span>
      </div>

      <nav className="bg-white/80 dark:bg-dark-bg1/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-primary-1 font-black text-[10px] uppercase tracking-widest transition-all">
            <ArrowLeft size={16} /> Kembali
          </button>
          <div className="text-right">
             <span className="block text-[8px] font-black text-primary-1 uppercase tracking-widest italic">Guest Session</span>
             <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{bab_key?.name}</span>
          </div>
        </div>
      </nav>

      <FadeInContainer className="max-w-4xl mx-auto p-6">
        {/* SCORE HERO */}
        <ScaleIn className="bg-white dark:bg-dark-bg2 rounded-[3.5rem] p-10 md:p-14 border border-slate-100 dark:border-white/5 relative overflow-hidden mb-16 shadow-2xl shadow-slate-200/50 dark:shadow-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-1/5 rounded-full blur-[100px] -mr-48 -mt-48" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="relative flex items-center justify-center w-52 h-52">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="104" cy="104" r="94" className="stroke-slate-100 dark:stroke-neutral-800" strokeWidth="12" fill="transparent" />
                <circle
                  cx="104" cy="104" r="94" 
                  className="text-primary-1 transition-all duration-1000 ease-out"
                  stroke="currentColor" strokeWidth="12" fill="transparent"
                  strokeDasharray={590} strokeDashoffset={590 - (590 * (total_score || 0)) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter italic">{total_score}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Skor Akhir</span>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-1/10 text-primary-1 rounded-full mb-4 border border-primary-1/20">
                <Trophy size={14} />
                <span className="text-[10px] font-black uppercase tracking-wider">Latihan Tamu Selesai</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6 leading-tight uppercase italic">
                {total_score >= 70 ? "Hasil Yang Hebat!" : "Teruslah Belajar!"}
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatBox label="Benar" value={correct_count} color="text-emerald-500" />
                <StatBox label="Salah" value={wrong_count} color="text-red-500" />
                <StatBox label="Kosong" value={skipped_count} color="text-amber-500" />
                <StatBox label="Waktu" value={`${duration_seconds}s`} color="text-primary-2 dark:text-dark-primary-2" />
              </div>
            </div>
          </div>
        </ScaleIn>

        {/* REVIEW LIST */}
        <div className="space-y-10">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3 italic">
              <Target size={18} className="text-primary-1" /> Answer Analysis
            </h3>
            <button onClick={() => router.push('/id/auth/register')} className="text-[10px] font-black text-primary-1 uppercase underline underline-offset-4">Daftar & Simpan Skor</button>
          </div>

          {answers?.map((item: any, idx: number) => {
            const q = item.question_key;
            const isCorrect = item.is_correct;
            const userAnswer = item.answer_given;
            const isImageOptions = q?.options?.some((opt: any) => opt.image?.url);

            return (
              <FadeInItem key={idx} className="bg-white dark:bg-dark-bg2 rounded-[3rem] border border-slate-100 dark:border-white/5 overflow-hidden shadow-xl shadow-slate-200/30 dark:shadow-none">
                <div className="p-8 md:p-12">
                  <div className="flex justify-between items-center mb-8">
                    <span className="px-5 py-2 bg-bg2 dark:bg-dark-bg1 rounded-2xl text-[10px] font-black text-slate-400 border border-slate-100 dark:border-white/10 uppercase tracking-widest">Soal {idx + 1}</span>
                    <ReviewBadge isCorrect={isCorrect} isSkipped={!userAnswer} />
                  </div>

                  {renderQuestionMedia(q)}

                  <p className="text-xl text-slate-800 dark:text-slate-100 font-bold leading-tight mb-10">{q?.question_text}</p>

                  <div className={isImageOptions ? "grid grid-cols-2 md:grid-cols-5 gap-4" : "grid grid-cols-1 gap-4"}>
                    {q?.options?.map((opt: any) => (
                      <OptionRow 
                        key={opt.label} 
                        opt={opt} 
                        isImage={isImageOptions}
                        isUserChoice={userAnswer === opt.label}
                        isCorrectOpt={q?.correct_answer === opt.label}
                      />
                    ))}
                  </div>

                  {q?.discussion_text && (
                    <div className="mt-12 pt-10 border-t border-slate-100 dark:border-white/5">
                      <div className="flex items-center gap-3 text-primary-1 mb-6">
                        <Info size={18} />
                        <span className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">Discussion</span>
                      </div>
                      <div className="bg-bg2 dark:bg-dark-bg1 p-8 rounded-[2.5rem] text-slate-600 dark:text-slate-400 text-sm leading-relaxed border-l-4 border-primary-1 font-medium italic">
                        {q?.discussion_text}
                      </div>
                    </div>
                  )}
                </div>
              </FadeInItem>
            );
          })}
        </div>

        {/* GUEST CALL TO ACTION */}
        <div className="mt-20 bg-primary-2 dark:bg-dark-primary-2 rounded-[3.5rem] p-12 text-center text-white relative overflow-hidden shadow-2xl shadow-primary-2/20">
           <Sparkles className="absolute top-10 right-10 w-24 h-24 opacity-10" />
           <h4 className="text-3xl font-black mb-4 uppercase italic tracking-tighter">Simpan Progres Belajarmu!</h4>
           <p className="text-white/70 mb-10 max-w-md mx-auto font-medium">Buat akun sekarang agar semua hasil latihanmu tersimpan dan dapat diakses kapan saja.</p>
           <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => router.push('/id/auth/register')} className="px-10 py-5 bg-primary-1 text-white font-black text-[11px] uppercase tracking-widest rounded-[2rem] shadow-xl hover:scale-105 transition-all">Daftar Akun Gratis</button>
              <button onClick={() => router.push('/id/category')} className="px-10 py-5 bg-white/10 border border-white/20 text-white font-black text-[11px] uppercase tracking-widest rounded-[2rem] hover:bg-white/20 transition-all">Coba Bab Lain</button>
           </div>
        </div>
      </FadeInContainer>
    </div>
  );
}

// --- SUB COMPONENTS ---

function StatBox({ label, value, color }: any) {
  return (
    <div className="bg-bg2 dark:bg-dark-bg1 p-5 rounded-[2rem] border border-slate-100 dark:border-white/5 text-center transition-colors">
      <p className={`text-[9px] font-black uppercase mb-1 tracking-widest ${color}`}>{label}</p>
      <p className="text-2xl font-black text-slate-800 dark:text-white leading-none tracking-tighter italic">{value}</p>
    </div>
  );
}

function ReviewBadge({ isCorrect, isSkipped }: any) {
  if (isSkipped) return (
    <span className="text-amber-500 flex items-center gap-2 font-black text-[9px] uppercase tracking-widest bg-amber-500/10 px-4 py-2 rounded-full border border-amber-500/20"><AlertCircle size={14} /> Skipped</span>
  );
  return isCorrect ? (
    <span className="text-emerald-500 flex items-center gap-2 font-black text-[9px] uppercase tracking-widest bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20"><CheckCircle2 size={14} /> Correct</span>
  ) : (
    <span className="text-red-500 flex items-center gap-2 font-black text-[9px] uppercase tracking-widest bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20"><XCircle size={14} /> Incorrect</span>
  );
}

function OptionRow({ opt, isImage, isUserChoice, isCorrectOpt }: any) {
  let style = "border-slate-100 dark:border-white/5 bg-white dark:bg-white/5";
  let labelStyle = "bg-bg2 dark:bg-dark-bg1 text-slate-400";

  if (isCorrectOpt) {
    style = "border-emerald-500/50 bg-emerald-500/[0.05] dark:bg-emerald-500/[0.1]";
    labelStyle = "bg-emerald-500 text-white";
  } else if (isUserChoice) {
    style = "border-red-500/50 bg-red-500/[0.05] dark:bg-red-500/[0.1]";
    labelStyle = "bg-red-500 text-white";
  }

  if (isImage) {
    return (
      <div className={`relative p-2 rounded-[2rem] border-2 transition-all group ${style} ${isCorrectOpt ? 'scale-105 z-10' : ''}`}>
        <div className="aspect-square rounded-[1.5rem] overflow-hidden mb-3 bg-white">
          <img src={opt.image?.url} alt={opt.label} className="w-full h-full object-contain" />
        </div>
        <div className={`w-8 h-8 mx-auto flex items-center justify-center rounded-xl font-black text-[11px] ${labelStyle}`}>{opt.label}</div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-5 p-5 rounded-[2.5rem] border-2 transition-all ${style}`}>
      <span className={`w-10 h-10 flex items-center justify-center rounded-2xl font-black text-xs ${labelStyle}`}>{opt.label}</span>
      <span className="font-bold flex-1 text-slate-700 dark:text-slate-300">{opt.text}</span>
      {isCorrectOpt && <CheckCircle2 size={20} className="text-emerald-500" />}
    </div>
  );
}