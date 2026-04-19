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
  Volume2,
  LayoutGrid,
  Coffee,
  Frown,
  ThumbsUp,
  Star,
  Award,
  HelpCircle,
  Check,
  X,
  ShieldCheck,
  Zap,
  Brain
} from 'lucide-react';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { FadeInContainer, FadeInItem, ScaleIn } from "@/components/animations/MotionWrapper";
import RichTextDisplay from '@/components/display/RichTextDisplay';
import { motion } from 'framer-motion';

export default function GuestQuizResultPage() {
  const params = useParams();
  const router = useRouter();
  const attemptId = params.attempt_id;
  const { user } = useAuthStore(); // Cek status login

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

const getRating = (score: number) => {
  // 1. Luar Biasa (Skor Sempurna atau sangat tinggi)
  if (score >= 90) {
    return { 
      label: "Luar Biasa", 
      color: "text-indigo-500", 
      stroke: "#6366F1", 
      bgColor: "bg-indigo-500", 
      sub: "Masterpiece! Kamu benar-benar menguasai materi ini.",
      icon: <Trophy size={20} /> 
    };
  }
  // 2. Sangat Baik
  if (score >= 75) {
    return { 
      label: "Sangat Baik", 
      color: "text-emerald-500", 
      stroke: "#10B981", 
      bgColor: "bg-emerald-500", 
      sub: "Keren banget! Sedikit lagi menuju sempurna.",
      icon: <Star size={20} /> 
    };
  }
  // 3. Baik
  if (score >= 60) {
    return { 
      label: "Baik", 
      color: "text-blue-500", 
      stroke: "#3B82F6", 
      bgColor: "bg-blue-500", 
      sub: "Kerja bagus! Pertahankan performa kamu.",
      icon: <ThumbsUp size={20} /> 
    };
  }
  // 4. Cukup
  if (score > 0) {
    return { 
      label: "Cukup", 
      color: "text-orange-500", 
      stroke: "#F97316", 
      bgColor: "bg-orange-500", 
      sub: "Boleh juga, tapi kamu pasti bisa lebih dari ini.",
      icon: <Coffee size={20} /> 
    };
  }
  // 5. Wkwk kenapa salah semua (Skor 0)
  return { 
    label: "wkwk kenapa salah semua", 
    color: "text-red-500", 
    stroke: "#EF4444", 
    bgColor: "bg-red-500", 
    sub: "Jangan menyerah, coba ulangi lagi pelan-pelan ya!",
    icon: <Frown size={20} /> 
  };
};

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

  const { total_score, correct_count, wrong_count, answers, bab_key, duration_seconds, section_performance } = data;
  const skipped_count = answers?.filter((a: any) => !a.answer_given || a.answer_given === "").length || 0;

  return (
    <div className="min-h-screen bg-bg1 dark:bg-transparent pb-24 font-sans transition-colors duration-300">
      
      {/* GUEST BANNER */}
      <div className="bg-primary-2 dark:bg-dark-primary-2 text-white py-2 px-6 flex justify-center items-center gap-3 shadow-md z-[60] relative">
        <UserCircle2 size={14} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Mode Tamu: Progres tidak tersimpan permanen</span>
      </div>

      <nav className="bg-white/80 dark:bg-dark-bg1/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 px-3 md:px-6 py-2 md:py-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center gap-5">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-primary-1 font-black text-[10px] uppercase tracking-widest transition-all">
            <ArrowLeft size={16} /> Kembali
          </button>
          <div className="text-right">
             <span className="block text-[8px] font-black text-primary-1 uppercase tracking-widest italic">Guest Session</span>
             <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{bab_key?.name}</span>
          </div>
        </div>
      </nav>

      <FadeInContainer className="max-w-4xl mx-auto py-6 px-3 md:px-6">

        {/* SCORE HERO */}
        <ScaleIn className="bg-white dark:bg-[#0B0F1A] rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-14 border border-slate-200/50 dark:border-white/5 relative overflow-hidden mb-16 shadow-2xl shadow-slate-200/20 dark:shadow-none transition-all duration-500">
          
          {/* Efek Cahaya Belakang Dinamis berdasarkan skor */}
          <div className={`absolute top-0 right-0 w-96 h-96 ${getRating(total_score || 0).bgColor}/5 rounded-full blur-[100px] -mr-48 -mt-48 transition-colors duration-1000`} />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 md:gap-16">
            
            {/* Progress Circle & Rating Badge Overlay */}
            <div className="relative flex items-center justify-center group shrink-0">
              <div className="relative w-56 h-56 md:w-64 md:h-64 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                <svg className="w-full h-full transform -rotate-90">
                  {/* Background Track */}
                  <circle cx="50%" cy="50%" r="44%" className="stroke-slate-100 dark:stroke-white/5" strokeWidth="12" fill="transparent" />
                  
                  {/* Progress Bar - Menggunakan stroke-current agar sinkron dengan text color */}
                  <circle
                    cx="50%" cy="50%" r="44%" 
                    className={`${getRating(total_score || 0).color} stroke-current transition-all duration-1000 ease-out`}
                    strokeWidth="12" 
                    fill="transparent"
                    strokeDasharray={590} 
                    strokeDashoffset={590 - (590 * (total_score || 0)) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                
                <div className="absolute flex flex-col items-center">
                  <span className="text-7xl font-black text-slate-900 dark:text-white tracking-tighter  drop-shadow-sm leading-none">
                    {total_score}
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3 ml-1">Score</span>
                </div>
              </div>

              {/* RATING BADGE - Floating on the circle */}
              <div className={`absolute -bottom-2 md:-bottom-4 px-6 py-2.5 rounded-2xl flex justify-center items-center ${getRating(total_score || 0).bgColor} text-white shadow-xl shadow-current/20 gap-2 animate-bounce transition-all duration-500`}>
                {getRating(total_score || 0).icon}
                <span className="text-xs font-black uppercase tracking-wider">{getRating(total_score || 0).label}</span>
              </div>
            </div>

            {/* Text Content */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 rounded-full mb-6 border border-slate-200/50 dark:border-white/5">
                <LayoutGrid size={14} />
                <span className="text-[9px] font-black uppercase tracking-widest">Performance Review</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-3 leading-tight uppercase  tracking-tight">
                {getRating(total_score || 0).label === "wkwk kenapa salah semua" ? "Aduhh..." : getRating(total_score || 0).label + "!"}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 text-sm md:text-base max-w-md">
                {getRating(total_score || 0).sub}
              </p>
              
              {/* STAT BOXES - Grid Modern */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                <div className="bg-slate-50 dark:bg-white/[0.02] p-4 rounded-2xl border border-slate-100 dark:border-white/5 active:scale-95 transition-all cursor-default group">
                    <span className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Correct</span>
                    <span className="text-2xl font-black text-emerald-500 group-hover:scale-110 transition-transform block">{correct_count}</span>
                </div>
                <div className="bg-slate-50 dark:bg-white/[0.02] p-4 rounded-2xl border border-slate-100 dark:border-white/5 active:scale-95 transition-all cursor-default group">
                    <span className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Wrong</span>
                    <span className="text-2xl font-black text-red-500 group-hover:scale-110 transition-transform block">{wrong_count}</span>
                </div>
                <div className="bg-slate-50 dark:bg-white/[0.02] p-4 rounded-2xl border border-slate-100 dark:border-white/5 active:scale-95 transition-all cursor-default group">
                    <span className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Skipped</span>
                    <span className="text-2xl font-black text-amber-500 group-hover:scale-110 transition-transform block">{skipped_count}</span>
                </div>
                <div className="bg-slate-50 dark:bg-white/[0.02] p-4 rounded-2xl border border-slate-100 dark:border-white/5 active:scale-95 transition-all cursor-default group">
                    <span className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Time</span>
                    <span className="text-2xl font-black text-primary-1 group-hover:scale-110 transition-transform block">{duration_seconds}s</span>
                </div>
              </div>
            </div>
          </div>
        </ScaleIn>

        {/* SECTION PERFORMANCE - EXECUTIVE MINIMALIST */}
        {section_performance && section_performance.length > 0 && (
          <ScaleIn className="mb-20">
            {/* Header Minimalis */}
            <div className="flex items-baseline gap-3 mb-8 px-2">
              <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.3em]">
                Analytics
              </h3>
              <div className="h-[1px] flex-1 bg-slate-100 dark:bg-white/5" />
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                Per Category
              </span>
            </div>
            
            <div className="space-y-2">
              {section_performance.map((section: any) => {
                const isMastered = section.score >= 75;
                const colorClass = isMastered ? 'bg-emerald-500' : section.score >= 50 ? 'bg-amber-500' : 'bg-red-500';
                const textColor = isMastered ? 'text-emerald-500' : section.score >= 50 ? 'text-amber-500' : 'text-red-500';

                return (
                  <div 
                    key={section.section_name}
                    className="group flex flex-col md:flex-row md:items-center gap-4 bg-white dark:bg-white/[0.02] hover:bg-slate-50 dark:hover:bg-white/[0.04] p-4 md:p-5 rounded-3xl border border-slate-100 dark:border-white/5 transition-all"
                  >
                    {/* 1. Nama Kategori & Info Ringkas */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full ${colorClass}`} />
                        <h4 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight truncate">
                          {section.section_name}
                        </h4>
                      </div>
                      <div className="flex items-center gap-3 mt-1 ml-4.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">
                          {section.correct} / {section.total} Correct
                        </span>
                      </div>
                    </div>

                    {/* 2. Mini Progress Bar (Sangat Hemat Tempat) */}
                    <div className="flex-[1.5] hidden md:block px-4">
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${section.score}%` }}
                          className={`h-full rounded-full ${colorClass}`}
                        />
                      </div>
                    </div>

                    {/* 3. Skor & Status */}
                    <div className="flex items-center justify-between md:justify-end gap-8 md:min-w-[120px]">
                      {/* Progress bar muncul di bawah nama kategori saat mobile saja */}
                      <div className="md:hidden flex-1 h-1 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden mr-4">
                        <div className={`h-full ${colorClass}`} style={{ width: `${section.score}%` }} />
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <span className={`text-xl font-black leading-none ${textColor}`}>
                          {section.score}%
                        </span>
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-1">
                          {isMastered ? 'Mastered' : 'Review'}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </ScaleIn>
        )}


        {/* REVIEW LIST */}
        <div className="space-y-10">
          <div className="flex flex-col gap-3 md:flex-row items-center justify-between px-2 md:px-4">
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
              <FadeInItem key={idx} className="bg-white dark:bg-dark-bg2 rounded-[2rem] md:rounded-[3rem] border border-slate-100 dark:border-white/5 overflow-hidden shadow-xl shadow-slate-200/30 dark:shadow-none mb-6">
                <div className="p-5 md:p-8 lg:p-12">
                  
                  {/* HEADER SECTION - FIXED RESPONSIVE */}
                  <div className="flex sm:items-center justify-between gap-4 mb-8">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-4 py-2 bg-bg2 dark:bg-dark-bg1 rounded-xl md:rounded-2xl text-[10px] font-black text-slate-400 border border-slate-100 dark:border-white/10 uppercase tracking-widest whitespace-nowrap">
                        Soal {idx + 1}
                      </span>
                      
                      {item.question_key?.section && (
                        <span className="flex items-center gap-1.5 px-3 py-2 bg-primary-1/10 text-primary-1 rounded-xl md:rounded-2xl text-[9px] font-black uppercase tracking-widest border border-primary-1/20">
                          <Award size={14}/>
                          <span className="truncate max-w-[120px] md:max-w-none">
                            {item.question_key.section.name || 'N/A'}
                          </span>
                        </span>
                      )}
                    </div>

                    {/* Badge Status (Benar/Salah) */}
                    <div className="flex justify-end items-center">
                      {/* TAMPILAN HP: Hanya Icon (Sembunyi di sm ke atas) */}
                      <div className="block sm:hidden">
                        {!userAnswer ? (
                          <div className="p-2 bg-slate-100 rounded-full text-slate-400">
                            <HelpCircle size={20} />
                          </div>
                        ) : isCorrect ? (
                          <div className="p-2 bg-green-500 rounded-full text-white ">
                            <Check size={20} strokeWidth={3} />
                          </div>
                        ) : (
                          <div className="p-2 bg-red-500 rounded-full text-white ">
                            <X size={20} strokeWidth={3} />
                          </div>
                        )}
                      </div>

                      {/* TAMPILAN DESKTOP: Badge Full (Sembunyi di di bawah sm) */}
                      <div className="hidden sm:block">
                        <ReviewBadge isCorrect={isCorrect} isSkipped={!userAnswer} />
                      </div>
                    </div>
                  </div>

                  {/* MEDIA SECTION */}
                  <div className="mb-6 overflow-hidden rounded-2xl">
                    {renderQuestionMedia(q)}
                  </div>

                  {/* TEXT SOAL */}
                  <div className="mb-8 overflow-x-auto">
                    <RichTextDisplay content={q?.question_text} />
                  </div>

                  {/* OPTIONS GRID - RESPONSIVE COLUMNS */}
                  <div className={
                    isImageOptions 
                      ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4" 
                      : "grid grid-cols-1 gap-3 md:gap-4"
                  }>
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

                  {/* DISCUSSION SECTION - RESPONSIVE PADDING */}
                  {q?.discussion_text && (
                    <div className="mt-8 md:mt-12 pt-8 md:pt-10 border-t border-slate-100 dark:border-white/5">
                      <div className="flex items-center gap-3 text-primary-1 mb-4 md:mb-6">
                        <Brain size={18} />
                        <span className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">Discussion</span>
                      </div>
                      <div className="bg-bg2 dark:bg-dark-bg1 p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] text-slate-600 dark:text-slate-400 text-sm leading-relaxed border-l-4 border-primary-1 font-medium overflow-hidden">
                        <RichTextDisplay content={q?.discussion_text} />
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