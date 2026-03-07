/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { Clock, Loader2, Send, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { FadeInContainer, FadeInItem } from "@/components/animations/MotionWrapper";

import { ConfirmModal } from '@/components/modals/ConfirmModal'; // Import modal baru

export default function QuizAttemptPage() {
  const router = useRouter();
  const params = useParams();
  const babId = params.bab_id; 
  
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // State Modal

  const hasInitialized = useRef(false);
  const submittingRef = useRef(false);
  const answersRef = useRef<Record<string, string>>({});

  useEffect(() => {
    answersRef.current = userAnswers;
  }, [userAnswers]);

  // Inisialisasi Kuis
  useEffect(() => {
    if (!babId || hasInitialized.current) return;
    const initializeQuiz = async () => {
      try {
        const startRes = await api.post(`/attempts/start/${babId}`, { bab_key: babId });
        const qRes = await api.get(`/bab/questions/${babId}`);
        
        if (startRes.data.success) {
          const attempt = startRes.data.data;
          setAttemptId(attempt._id);
          setQuestions(qRes.data.data.questions || qRes.data.data);
          setTimeLeft(attempt.remainingTime || 0); 

          if (attempt.answers?.length > 0) {
            const recovered: Record<string, string> = {};
            attempt.answers.forEach((ans: any) => {
              recovered[ans.question_key] = ans.answer_given;
            });
            setUserAnswers(recovered);
          }
        }
      } catch (err: any) {
        console.error("Init error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    initializeQuiz();
    hasInitialized.current = true;
  }, [babId]);

  // Timer Logic
  useEffect(() => {
    if (timeLeft <= 0 || isLoading || submittingRef.current) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(() => executeSubmit(), 0); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isLoading]);

  const executeSubmit = async () => {
    if (submittingRef.current || !attemptId) return;
    submittingRef.current = true;
    setIsSubmitting(true);
    setShowConfirm(false); // Tutup modal saat proses submit

    try {
      const formattedAnswers = questions.map(q => ({
        question_key: q._id,
        answer_given: answersRef.current[q._id] || "" 
      }));

      const res = await api.post(`/attempts/${attemptId}/submit`, { 
        answers: formattedAnswers 
      });

      if (res.data.success) {
        router.replace(`/attempt/result/${attemptId}`);
      }
    } catch (err: any) {
      console.error("Submit error:", err);
      if (err.response?.status === 400) {
         router.replace(`/attempt/result/${attemptId}`);
         return;
      }
      submittingRef.current = false;
      setIsSubmitting(false);
      alert("Gagal mengirim jawaban.");
    }
  };

  const handleSelectOption = (label: string) => {
    const qId = questions[currentIdx]._id;
    setUserAnswers(prev => ({ ...prev, [qId]: label }));
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (isLoading) return (
    <div className="flex h-screen flex-col items-center justify-center bg-bg1 gap-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary-1" />
      <p className="font-black text-[10px] uppercase tracking-[0.4em] text-slate-500 animate-pulse">Menyiapkan Lembar Jawaban</p>
    </div>
  );

  const currentQuestion = questions[currentIdx];

  return (
    <div className="min-h-screen bg-bg2 dark:bg-dark-bg1 flex flex-col font-sans">
      
      {/* MODAL KONFIRMASI */}
      <ConfirmModal 
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={executeSubmit}
        isLoading={isSubmitting}
        title="Selesaikan Kuis?"
        description="Pastikan semua soal telah terjawab. Kamu tidak dapat mengubah jawaban setelah mengirim."
      />

      {/* HEADER KUIS */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6 flex-1">
            <div className="hidden md:block">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</span>
              <p className="text-sm font-black text-slate-900 dark:text-white">{currentIdx + 1} / {questions.length}</p>
            </div>
            <div className="h-2 flex-1 max-w-xs bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-1 transition-all duration-500 shadow-[0_0_12px_rgba(var(--primary-rgb),0.4)]" 
                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`px-5 py-2.5 rounded-2xl border-2 flex items-center gap-3 transition-all ${
              timeLeft < 60 ? 'bg-red-500/10 border-red-500 text-red-500 animate-pulse' : 'bg-slate-900 text-white border-transparent'
            }`}>
              <Clock size={18} className={timeLeft < 60 ? "animate-spin-slow" : ""} />
              <span className="font-mono font-black text-xl leading-none">{formatTime(timeLeft)}</span>
            </div>
            
            <button 
              onClick={() => setShowConfirm(true)}
              className="bg-primary-1 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:shadow-xl hover:shadow-primary-1/20 active:scale-95 transition-all shadow-lg"
            >
              Submit
            </button>
          </div>
        </div>
      </header>

      <FadeInContainer className="flex-1 max-w-6xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* AREA SOAL */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <FadeInItem className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-14 shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-100 dark:border-white/5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-10">
               <span className="px-4 py-1.5 bg-primary-1/10 text-primary-1 rounded-xl text-[10px] font-black uppercase tracking-[0.2em]">
                 Pertanyaan {currentIdx + 1}
               </span>
               {userAnswers[currentQuestion?._id] && (
                 <span className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                   <CheckCircle2 size={14} /> Jawaban Tersimpan
                 </span>
               )}
            </div>
            
            <h2 className="text-xl md:text-2xl text-slate-800 dark:text-slate-100 leading-relaxed font-bold mb-12">
              {currentQuestion?.question_text}
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {currentQuestion?.options?.map((opt: any) => {
                const isSelected = userAnswers[currentQuestion._id] === opt.label;
                return (
                  <button
                    key={opt.label}
                    onClick={() => handleSelectOption(opt.label)}
                    className={`group flex items-center gap-5 p-6 rounded-[2rem] border-2 transition-all text-left ${
                      isSelected 
                        ? 'border-primary-1 bg-primary-1/5 shadow-inner' 
                        : 'border-slate-50 dark:border-white/5 bg-slate-50 dark:bg-white/5 hover:border-slate-200'
                    }`}
                  >
                    <div className={`w-12 h-12 shrink-0 flex items-center justify-center rounded-2xl font-black text-lg transition-all ${
                      isSelected ? 'bg-primary-1 text-white rotate-6' : 'bg-white dark:bg-slate-800 text-slate-400'
                    }`}>
                      {opt.label}
                    </div>
                    <span className={`font-bold text-lg ${isSelected ? 'text-primary-1' : 'text-slate-600 dark:text-slate-400'}`}>
                      {opt.text}
                    </span>
                  </button>
                );
              })}
            </div>
          </FadeInItem>

          {/* NAVIGASI BAWAH */}
          <div className="flex justify-between items-center px-4">
            <button 
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx(prev => prev - 1)}
              className="flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all disabled:opacity-0"
            >
              <ChevronLeft size={20} /> Sebelumnya
            </button>
            
            <button 
              onClick={() => currentIdx === questions.length - 1 ? setShowConfirm(true) : setCurrentIdx(prev => prev + 1)}
              className="flex items-center gap-4 px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-primary-1 transition-all active:scale-95"
            >
              {currentIdx === questions.length - 1 ? 'Selesaikan Kuis' : 'Lanjut Soal'} <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* SIDEBAR NAVIGASI NOMOR */}
        <div className="hidden lg:block">
          <FadeInItem className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-xl border border-slate-100 dark:border-white/5 sticky top-32">
            <h4 className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] mb-8 text-center">Navigasi Soal</h4>
            <div className="grid grid-cols-4 gap-3">
              {questions.map((q, idx) => {
                const isAnswered = !!userAnswers[q._id];
                const isCurrent = idx === currentIdx;
                return (
                  <button
                    key={q._id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`aspect-square rounded-2xl flex items-center justify-center text-xs font-black transition-all ${
                      isCurrent ? 'bg-primary-1 text-white shadow-lg shadow-primary-1/30 scale-110 z-10' :
                      isAnswered ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 
                      'bg-slate-50 dark:bg-white/5 text-slate-300 dark:text-slate-600'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-10 pt-8 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center justify-between text-[9px] font-black uppercase text-slate-400">
                    <span>Terjawab: {Object.keys(userAnswers).length}</span>
                    <span>Sisa: {questions.length - Object.keys(userAnswers).length}</span>
                </div>
            </div>
          </FadeInItem>
        </div>
      </FadeInContainer>
    </div>
  );
}