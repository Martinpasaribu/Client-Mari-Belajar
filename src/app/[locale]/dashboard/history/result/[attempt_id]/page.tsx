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
  Volume2,
  PlayCircle
} from 'lucide-react';
import api from '@/lib/axios';
import { FadeInContainer, FadeInItem, ScaleIn } from "@/components/animations/MotionWrapper";

export default function QuizResultPage() {
  const params = useParams();
  const router = useRouter();
  const attemptId = params.attempt_id;

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!attemptId) return;
    const fetchResult = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/attempts/${attemptId}/result`);
        if (response.data.success) setData(response.data.data);
      } catch (err: any) {
        console.error("Error fetching result:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResult();
  }, [attemptId]);

  // --- RENDER MEDIA (Gambar Utama/Audio) ---
  const renderQuestionMedia = (q: any) => {
    // Cek jika ada gambar utama soal
    const hasMainImage = q?.question_images && q.question_images.length > 0;
    
    if (!hasMainImage && !q?.question_audio) return null;

    return (
      <div className="space-y-4 mb-6">
        {hasMainImage && (
          <div className="rounded-2xl overflow-hidden border border-slate-100 dark:border-white/10 shadow-sm bg-slate-50 dark:bg-white/5 p-1 inline-block">
            <img 
              src={q.question_images[0].url} 
              alt="Question Context" 
              className="max-h-[250px] w-auto object-contain rounded-xl" 
            />
          </div>
        )}
        {q?.question_audio && (
          <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 w-max">
            <Volume2 size={18} className="text-primary-1" />
            <audio controls className="h-8 w-40 scale-90"><source src={q.question_audio} /></audio>
          </div>
        )}
      </div>
    );
  };

  if (isLoading) return (
    <div className="flex h-screen flex-col items-center justify-center bg-bg1 dark:bg-dark-bg1 gap-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary-1" />
      <p className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-500 animate-pulse">Analysing Results...</p>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-10 bg-bg1 dark:bg-dark-bg1 text-center">
      <XCircle size={48} className="text-red-500 mb-6" />
      <h2 className="text-2xl font-black dark:text-white mb-6 uppercase">Result Not Found</h2>
      <button onClick={() => router.push('/dashboard')} className="px-8 py-3 bg-primary-1 text-white rounded-2xl font-bold">Back to Dashboard</button>
    </div>
  );

  const { total_score, correct_count, wrong_count, answers, bab_key, duration_seconds } = data;
  const skipped_count = answers?.filter((a: any) => !a.answer_given || a.answer_given === "").length || 0;

  return (
    <div className="min-h-screen bg-bg1 dark:bg-dark-bg1 pb-24 font-sans transition-colors duration-300">
      
      {/* NAVBAR */}
      <nav className="bg-white/80 dark:bg-dark-bg1/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <button 
            onClick={() => router.push(`/dashboard/modules/bab/${bab_key?._id || bab_key?.id}`)}
            className="group flex items-center gap-2 text-slate-500 hover:text-primary-1 font-black text-[10px] uppercase tracking-widest transition-all"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Kembali
          </button>
          <div className="text-right">
             <span className="block text-[8px] font-black text-primary-1 uppercase tracking-widest italic">Completed</span>
             <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{bab_key?.name || bab_key?.title}</span>
          </div>
        </div>
      </nav>

      <FadeInContainer className="max-w-4xl mx-auto p-6">
        {/* SCORE HERO */}
        <ScaleIn className="bg-white dark:bg-dark-bg2 rounded-[3.5rem] p-10 md:p-14 border border-slate-100 dark:border-white/5 relative overflow-hidden mb-16 shadow-2xl shadow-slate-200/50 dark:shadow-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-1/5 rounded-full blur-[100px] -mr-48 -mt-48" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="relative flex items-center justify-center w-56 h-56">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="112" cy="112" r="100" className="stroke-slate-100 dark:stroke-neutral-800" strokeWidth="14" fill="transparent" />
                <circle
                  cx="112" cy="112" r="100" 
                  className="text-primary-1 transition-all duration-1000 ease-out"
                  stroke="currentColor" strokeWidth="14" fill="transparent"
                  strokeDasharray={628} strokeDashoffset={628 - (628 * (total_score || 0)) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter italic">{total_score}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Score</span>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-1/10 text-primary-1 rounded-full mb-4">
                <Trophy size={14} />
                <span className="text-[10px] font-black uppercase tracking-wider">Quiz Summary</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6 uppercase italic">
                {total_score >= 70 ? "Excellent Result!" : "Keep Practicing!"}
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatBox label="Correct" value={correct_count} color="text-emerald-500" />
                <StatBox label="Wrong" value={wrong_count} color="text-red-500" />
                <StatBox label="Skipped" value={skipped_count} color="text-amber-500" />
                <StatBox label="Time" value={`${duration_seconds}s`} color="text-primary-1" />
              </div>
            </div>
          </div>
        </ScaleIn>

        {/* REVIEW LIST */}
        <div className="space-y-10">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] px-4 flex items-center gap-3 italic">
            <Target size={18} className="text-primary-1" /> Answer Analysis
          </h3>

          {answers?.map((item: any, idx: number) => {
            const q = item.question_key;
            const isCorrect = item.is_correct;
            const userAnswer = item.answer_given;
            const isSkipped = !userAnswer || userAnswer === "";
            
            // Deteksi otomatis jika pilihan jawaban menggunakan gambar
            const isImageOptions = q?.options?.some((opt: any) => opt.image?.url);

            return (
              <FadeInItem key={idx} className="bg-white dark:bg-dark-bg2 rounded-[3rem] border border-slate-100 dark:border-white/5 overflow-hidden shadow-xl shadow-slate-200/20 dark:shadow-none">
                <div className="p-8 md:p-12">
                  <div className="flex justify-between items-center mb-8">
                    <span className="px-5 py-2 bg-slate-50 dark:bg-white/5 rounded-2xl text-[10px] font-black text-slate-400 border border-slate-100 dark:border-white/10 uppercase tracking-widest">
                      Q {idx + 1}
                    </span>
                    <StatusBadge isSkipped={isSkipped} isCorrect={isCorrect} />
                  </div>

                  {renderQuestionMedia(q)}

                  <p className="text-xl text-slate-800 dark:text-slate-100 font-bold leading-tight mb-10">
                    {q?.question_text}
                  </p>

                  <div className={isImageOptions ? "grid grid-cols-2 md:grid-cols-5 gap-4" : "grid grid-cols-1 gap-4"}>
                    {q?.options?.map((opt: any) => (
                      <OptionReview 
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
                      <div className="flex items-center gap-3 text-primary-1 mb-4">
                        <Info size={18} />
                        <span className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">Discussion</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-[2rem] text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic border-l-4 border-primary-1">
                        {q?.discussion_text}
                      </div>
                    </div>
                  )}
                </div>
              </FadeInItem>
            );
          })}
        </div>
      </FadeInContainer>
    </div>
  );
}

// --- REUSABLE COMPONENTS ---

function OptionReview({ opt, isImage, isUserChoice, isCorrectOpt }: any) {
  let style = "";
  let labelStyle = "";

  if (isCorrectOpt) {
    style = "border-emerald-500 bg-emerald-500/5";
    labelStyle = "bg-emerald-500 text-white";
  } else if (isUserChoice) {
    style = "border-red-500 bg-red-500/5";
    labelStyle = "bg-red-500 text-white";
  } else {
    style = "border-slate-100 dark:border-white/5 bg-white dark:bg-white/5 opacity-60";
    labelStyle = "bg-slate-100 dark:bg-slate-800 text-slate-400";
  }

  if (isImage) {
    return (
      <div className={`relative p-2 rounded-[2rem] border-2 transition-all ${style}`}>
        <div className="aspect-square rounded-[1.5rem] overflow-hidden mb-3 bg-white">
          <img src={opt.image?.url} alt={opt.label} className="w-full h-full object-contain" />
        </div>
        <div className={`w-7 h-7 mx-auto flex items-center justify-center rounded-lg font-black text-[10px] ${labelStyle}`}>
          {opt.label}
        </div>
        {isCorrectOpt && <CheckCircle2 size={16} className="absolute top-2 right-2 text-emerald-500 bg-white rounded-full" />}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-5 p-5 rounded-[2rem] border-2 transition-all ${style}`}>
      <span className={`w-10 h-10 flex items-center justify-center rounded-xl font-black text-xs ${labelStyle}`}>
        {opt.label}
      </span>
      <span className="font-bold flex-1 text-slate-700 dark:text-slate-300">{opt.text}</span>
    </div>
  );
}

function StatBox({ label, value, color }: any) {
  return (
    <div className="bg-slate-50 dark:bg-dark-bg1 p-4 rounded-2xl border border-slate-100 dark:border-white/5 text-center">
      <p className={`text-[9px] font-black uppercase mb-1 ${color}`}>{label}</p>
      <p className="text-xl font-black text-slate-800 dark:text-white">{value}</p>
    </div>
  );
}

function StatusBadge({ isSkipped, isCorrect }: any) {
  if (isSkipped) return (
    <span className="text-amber-500 flex items-center gap-2 font-black text-[9px] uppercase tracking-widest bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
      <AlertCircle size={14} /> Skipped
    </span>
  );
  return isCorrect ? (
    <span className="text-emerald-500 flex items-center gap-2 font-black text-[9px] uppercase tracking-widest bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
      <CheckCircle2 size={14} /> Correct
    </span>
  ) : (
    <span className="text-red-500 flex items-center gap-2 font-black text-[9px] uppercase tracking-widest bg-red-500/10 px-4 py-1.5 rounded-full border border-red-500/20">
      <XCircle size={14} /> Incorrect
    </span>
  );
}