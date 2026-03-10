/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { 
  Clock, 
  Loader2, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Volume2, 
  ImageIcon, 
  Type, 
  FileText 
} from 'lucide-react';
import { FadeInContainer, FadeInItem } from "@/components/animations/MotionWrapper";
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { useToast } from '@/context/ToastContext';
import { getErrorMessage } from '@/lib/utils';

export default function QuizAttemptPage() {
  const router = useRouter();
  const params = useParams();
  const babId = params.bab_id; 
  const { showToast } = useToast();

  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const hasInitialized = useRef(false);
  const submittingRef = useRef(false);
  const answersRef = useRef<Record<string, string>>({});

  useEffect(() => {
    answersRef.current = userAnswers;
  }, [userAnswers]);

  // --- INITIALIZE QUIZ ---
  useEffect(() => {
    if (!babId || hasInitialized.current) return;
    const initializeQuiz = async () => {
      try {
        const startRes = await api.post(`/attempts/start/${babId}`, { bab_key: babId });
        const qRes = await api.get(`/bab/questions/guest/${babId}`);
        
        if (startRes.data.success) {
          showToast("success", startRes.data.message);
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
        // console.error("Init error:", err);
          const msg = getErrorMessage(err);
          showToast("error", msg as any);
      } finally {
        setIsLoading(false);
      }
    };
    initializeQuiz();
    hasInitialized.current = true;
  }, [babId]);

  // --- TIMER LOGIC ---
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
    setShowConfirm(false);

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

  // --- RENDER MEDIA CONTENT (Tipe 4 & 5) ---
  const renderMediaContent = (q: any) => {
    return (
      <div className="space-y-6 mb-8">
        <h2 className="text-xl md:text-2xl text-slate-800 dark:text-slate-100 leading-relaxed font-bold">
          {q?.question_text}
        </h2>

        {/* Multimedia: Image (Tipe 4) */}
        {q?.question_images && q.question_images.length > 0 && (
          <div className="rounded-[2.5rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl bg-slate-50 inline-block p-2">
            <img 
              src={q.question_images[0].url} 
              alt="Context" 
              className="max-h-[350px] w-auto object-contain rounded-[2rem]"
            />
          </div>
        )}

        {/* Multimedia: Audio (Tipe 5) */}
        {q?.question_audio && (
          <div className="flex items-center gap-4 p-6 bg-primary-1/5 rounded-[2rem] border border-primary-1/20 w-full max-w-md">
            <div className="w-12 h-12 bg-primary-1 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary-1/30">
              <Volume2 size={24} />
            </div>
            <audio controls className="h-10 w-full">
              <source src={q.question_audio} type="audio/mpeg" />
            </audio>
          </div>
        )}
      </div>
    );
  };

  // --- RENDER ANSWER OPTIONS (Tipe 1, 2, 3) ---
  const renderAnswerOptions = (q: any) => {
    const isSelected = (label: string) => userAnswers[q._id] === label;

    // Tipe 2: Essay
    if (q.type === 'essay') {
      return (
        <div className="space-y-4">
           <textarea
            value={userAnswers[q._id] || ""}
            onChange={(e) => setUserAnswers(prev => ({ ...prev, [q._id]: e.target.value }))}
            placeholder="Ketik jawaban lengkap Anda di sini..."
            className="w-full min-h-[250px] p-8 rounded-[3rem] bg-slate-50 dark:bg-white/5 border-2 border-slate-100 dark:border-white/5 focus:border-primary-1 outline-none font-medium text-slate-700 dark:text-slate-200 transition-all shadow-inner"
          />
        </div>
      );
    }

    // Tipe 3: Image Options
    if (q.type === 'image_options') {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {q.options?.map((opt: any) => (
            <button
              key={opt.label}
              onClick={() => handleSelectOption(opt.label)}
              className={`group flex flex-col p-3 rounded-[2.5rem] border-2 transition-all ${
                isSelected(opt.label)
                  ? 'border-primary-1 bg-primary-1/5 shadow-xl scale-105' 
                  : 'border-slate-100 dark:border-white/5 bg-white dark:bg-white/5 hover:border-slate-300'
              }`}
            >
              <div className="aspect-square w-full overflow-hidden rounded-[2rem] bg-slate-100 mb-4 border border-slate-50 dark:border-white/5">
                <img 
                  src={opt.image?.url} 
                  alt={opt.label} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
              </div>
              <div className={`w-10 h-10 mx-auto flex items-center justify-center rounded-2xl font-black text-sm transition-all ${
                isSelected(opt.label) ? 'bg-primary-1 text-white rotate-12' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}>
                {opt.label}
              </div>
            </button>
          ))}
        </div>
      );
    }

    // Tipe 1 & Lainnya: Multiple Choice (Text)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {q.options?.map((opt: any) => (
          <button
            key={opt.label}
            onClick={() => handleSelectOption(opt.label)}
            className={`group flex items-center gap-5 p-6 rounded-[2.5rem] border-2 transition-all text-left ${
              isSelected(opt.label) 
                ? 'border-primary-1 bg-primary-1/5 shadow-inner' 
                : 'border-slate-50 dark:border-white/5 bg-slate-50 dark:bg-white/5 hover:border-slate-200'
            }`}
          >
            <div className={`w-12 h-12 shrink-0 flex items-center justify-center rounded-2xl font-black text-lg transition-all ${
              isSelected(opt.label) ? 'bg-primary-1 text-white rotate-6' : 'bg-white dark:bg-slate-800 text-slate-400'
            }`}>
              {opt.label}
            </div>
            <span className={`font-bold text-lg ${isSelected(opt.label) ? 'text-primary-1' : 'text-slate-600 dark:text-slate-400'}`}>
              {opt.text}
            </span>
          </button>
        ))}
      </div>
    );
  };

  if (isLoading) return (
    <div className="flex h-screen flex-col items-center justify-center bg-bg1 gap-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary-1" />
      <p className="font-black text-[10px] uppercase tracking-[0.4em] text-slate-500 animate-pulse">Initializing Exam Paper</p>
    </div>
  );

  const currentQuestion = questions[currentIdx];

  return (
    <div className="min-h-screen bg-bg2 dark:bg-dark-bg1 flex flex-col font-sans transition-colors duration-300">
      
      <ConfirmModal 
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={executeSubmit}
        isLoading={isSubmitting}
        title="Akhiri Sesi Kuis?"
        description="Jawaban Anda akan dikirim untuk penilaian. Pastikan tidak ada soal yang terlewat."
      />

      {/* STICKY HEADER */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-6">
          <div className="flex items-center gap-6 flex-1">
            <div className="hidden md:block">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</span>
              <p className="text-sm font-black text-slate-900 dark:text-white">{currentIdx + 1} / {questions.length}</p>
            </div>
            <div className="h-2.5 flex-1 max-w-xs bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-1 transition-all duration-700 shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]" 
                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`px-5 py-3 rounded-2xl border-2 flex items-center gap-3 transition-all ${
              timeLeft < 60 ? 'bg-red-500/10 border-red-500 text-red-500 animate-pulse' : 'bg-slate-900 dark:bg-primary-1/10 text-white dark:text-primary-1 border-transparent'
            }`}>
              <Clock size={18} />
              <span className="font-mono font-black text-xl leading-none tracking-tighter">{formatTime(timeLeft)}</span>
            </div>
            
            <button 
              onClick={() => setShowConfirm(true)}
              className="bg-primary-1 text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary-1/20"
            >
              Finish
            </button>
          </div>
        </div>
      </header>

      <FadeInContainer className="flex-1 max-w-6xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* MAIN QUESTION AREA */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <FadeInItem className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-8 md:p-14 shadow-2xl shadow-slate-200/40 dark:shadow-none border border-slate-100 dark:border-white/5 relative overflow-hidden">
            
            {/* Type Indicator */}
            <div className="flex items-center justify-between mb-12">
               <div className="flex items-center gap-3 px-5 py-2 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                 {currentQuestion?.type === 'image_options' && <ImageIcon size={14} className="text-primary-1"/>}
                 {currentQuestion?.type === 'multiple_choice' && <Type size={14} className="text-primary-1"/>}
                 {currentQuestion?.type === 'essay' && <FileText size={14} className="text-primary-1"/>}
                 <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
                   {currentQuestion?.type?.replace('_', ' ')} — Question {currentIdx + 1}
                 </span>
               </div>
               
               {userAnswers[currentQuestion?._id] && (
                 <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-4 py-2 rounded-xl">
                   <CheckCircle2 size={14} /> Saved
                 </div>
               )}
            </div>
            
            {/* Dynamic Content Rendering */}
            {renderMediaContent(currentQuestion)}
            {renderAnswerOptions(currentQuestion)}
            
          </FadeInItem>

          {/* BOTTOM NAVIGATION */}
          <div className="flex justify-between items-center px-4 mb-10">
            <button 
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx(prev => prev - 1)}
              className="flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all disabled:opacity-0"
            >
              <ChevronLeft size={20} /> Prev Question
            </button>
            
            <button 
              onClick={() => currentIdx === questions.length - 1 ? setShowConfirm(true) : setCurrentIdx(prev => prev + 1)}
              className="group flex items-center gap-4 px-10 py-5 bg-slate-900 dark:bg-primary-1 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all active:scale-95"
            >
              {currentIdx === questions.length - 1 ? 'Complete Quiz' : 'Next Question'} 
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* QUESTION NAVIGATION SIDEBAR */}
        <div className="hidden lg:block">
          <FadeInItem className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 shadow-xl border border-slate-100 dark:border-white/5 sticky top-32">
            <h4 className="font-black text-slate-400 text-[10px] uppercase tracking-[0.3em] mb-10 text-center italic">Question Grid</h4>
            <div className="grid grid-cols-4 gap-3">
              {questions.map((q, idx) => {
                const isAnswered = !!userAnswers[q._id];
                const isCurrent = idx === currentIdx;
                return (
                  <button
                    key={q._id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`aspect-square rounded-2xl flex items-center justify-center text-xs font-black transition-all transform ${
                      isCurrent ? 'bg-primary-1 text-white shadow-xl shadow-primary-1/30 scale-110 z-10' :
                      isAnswered ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 
                      'bg-slate-50 dark:bg-white/5 text-slate-300 dark:text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-12 pt-8 border-t border-slate-100 dark:border-white/5 space-y-3">
                <div className="flex justify-between text-[9px] font-black uppercase text-slate-400 tracking-tighter">
                    <span>Answered</span>
                    <span className="text-emerald-500">{Object.keys(userAnswers).length} / {questions.length}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-50 dark:bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-1000" 
                      style={{ width: `${(Object.keys(userAnswers).length / questions.length) * 100}%` }}
                    />
                </div>
            </div>
          </FadeInItem>
        </div>
      </FadeInContainer>
    </div>
  );
}

