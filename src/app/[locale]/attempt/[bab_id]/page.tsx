/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
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
  FileText, 
  Bookmark,
  ArrowRight,
  BookOpen,
  LayoutGrid,
  Construction
} from 'lucide-react';
import { FadeInContainer, FadeInItem, ScaleIn } from "@/components/animations/MotionWrapper";
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { useToast } from '@/context/ToastContext';
import { getErrorMessage } from '@/lib/utils';
import { MainLoading } from '@/components/modals/MainLoading';
import { useAuthStore } from '@/store/useAuthStore';
import { ActiveAttemptModal } from '@/components/modals/ActiveAttemptModal';
import { motion } from 'framer-motion';
import RichTextDisplay from '@/components/display/RichTextDisplay';

export default function QuizAttemptPage() {
  const router = useRouter();
  const params = useParams();
  const babId = params.bab_id; 
  const { showToast } = useToast();
  const { user } = useAuthStore();

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
  const currentQuestion = questions[currentIdx];
  const [activeAttemptData, setActiveAttemptData] = useState<{ isOpen: boolean; babId: string }>({
  isOpen: false,
  babId: ''
});

const [isGridOpen, setIsGridOpen] = useState(false);

  useEffect(() => {
    answersRef.current = userAnswers;
  }, [userAnswers]);

// --- INITIALIZE QUIZ ---
  useEffect(() => {
    if (!babId || hasInitialized.current) return;

    const initializeQuiz = async () => {
      try {
        // DINAMIS: Tentukan endpoint start berdasarkan status login
        const startEndpoint = user 
          ? `/attempts/start/${babId}` 
          : `/guest/attempts/start/${babId}`;

        const startRes = await api.post(startEndpoint, { bab_key: babId });
        
        // Data pertanyaan tetap menggunakan guest endpoint jika memang didesain publik
        const qRes = await api.get(`/bab/questions/guest/${babId}`);
        
        if (startRes.data.success) {
          const attempt = startRes.data.data;
          const remaining = attempt.remainingTime || 0;

          // Sinkronisasi jawaban lama jika ada
          if (attempt.answers?.length > 0) {
            const recovered: Record<string, string> = {};
            attempt.answers.forEach((ans: any) => {
              recovered[ans.question_key] = ans.answer_given;
            });
            setUserAnswers(recovered);
            answersRef.current = recovered;
          }

          setAttemptId(attempt._id);
          setQuestions(qRes.data.data.questions || qRes.data.data);
          setTimeLeft(remaining); 

          // Auto-submit jika status sudah selesai atau waktu habis
          if (attempt.status === 'finished' || attempt.status === 'submitted' || remaining <= 0) {
            showToast("info", "Sesi kuis telah berakhir. Mengalihkan...");
            await executeSubmit(attempt._id);
            return;
          }

          showToast("success", startRes.data.message);
        }
      } catch (err: any) {
        const errorData = err.response?.data;
        if (errorData?.activeBabId && errorData.activeBabId !== babId) {
          setActiveAttemptData({ isOpen: true, babId: errorData.activeBabId });
          return;
        }
        setQuestions([])
        showToast("error", getErrorMessage(err) as any);
      } finally {
        setIsLoading(false);
      }
    };

    initializeQuiz();
    hasInitialized.current = true;
  }, [babId, user]); // Tambahkan user ke dependency
  
    
  // --- TIMER LOGIC & AUTO SUBMIT ---
  useEffect(() => {
    // Jika waktu habis dan tidak sedang proses submit, jalankan executeSubmit
    if (timeLeft <= 0 && attemptId && !isLoading && !submittingRef.current) {
      executeSubmit();
      return;
    }

    if (timeLeft <= 0 || isLoading || submittingRef.current) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0; // Mengarah ke blok auto-submit di atas pada render berikutnya
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isLoading, attemptId]);

  // --- PROTEKSI REFRESH ---
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!submittingRef.current && timeLeft > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [timeLeft]);

// --- EXECUTE SUBMIT ---
  const executeSubmit = async (forcedId?: string) => {
    
    setIsSubmitting(true);
    
    const targetId = forcedId || attemptId;

    if (submittingRef.current || !targetId) return;

    submittingRef.current = true;
    setShowConfirm(false);

    try {
      const formattedAnswers = questions.map(q => ({
        question_key: q._id,
        answer_given: answersRef.current[q._id] || "" 
      }));

      // DINAMIS: Tentukan endpoint submit berdasarkan status login
      const submitEndpoint = user 
        ? `/attempts/${targetId}/submit` 
        : `/guest/attempts/${targetId}/submit`;

      const res = await api.post(submitEndpoint, { 
        answers: formattedAnswers 
      });

      if (res.data.success) {
        const targetPath = user ? 'dashboard/history' : 'attempt';
        router.replace(`/${targetPath}/result/${targetId}`);
        setIsSubmitting(false);
      }
    } catch (err: any) {
      console.error("Submit error:", err);
      if (err.response?.status === 400 || err.response?.data?.message?.includes('expired')) {
            const targetPath = user ? 'dashboard/history' : 'attempt';
            router.replace(`/${targetPath}/result/${targetId}`);
         return;
      }
      submittingRef.current = false;
      setIsSubmitting(false);
      showToast("error", "Gagal mengirim jawaban.");
    }
  };

  const handleSelectOption = (label: string) => {
    if (timeLeft <= 0) return; // Kunci input jika waktu habis
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
        <RichTextDisplay content={q?.question_text} />

        {/* Multimedia: Image (Tipe 4) */}
        {q?.question_images && q.question_images.length > 0 && (
          <div className="rounded-[.5rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl bg-slate-50 inline-block p-2">
            <img 
              src={q.question_images[0].url} 
              alt="Context" 
              className="max-h-[350px] w-auto object-contain "
            />
          </div>
        )}

        {/* Multimedia: Audio (Tipe 5) */}
        {q?.question_audio?.url && ( // Tambahkan .url di pengecekan
          <div className="flex items-center gap-4 p-6 bg-primary-1/5 rounded-[2rem] border border-primary-1/20 w-full max-w-md">
            <div className="w-12 h-12 bg-primary-1 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary-1/30">
              <Volume2 size={24} />
            </div>
            <audio controls className="h-10 w-full">
              {/* Panggil q.question_audio.url di sini */}
              <source src={q.question_audio.url} type="audio/mpeg" />
              Browser Anda tidak mendukung elemen audio.
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
              className={`group flex flex-col p-3 rounded-[.5rem] border-2 transition-all ${
                isSelected(opt.label)
                  ? 'border-primary-1 bg-primary-1/5 shadow-xl scale-105' 
                  : 'border-slate-100 dark:border-white/5 bg-white dark:bg-white/5 hover:border-slate-300'
              }`}
            >
              <div className="aspect-square w-full overflow-hidden rounded-[.5rem] bg-slate-100 mb-4 border border-slate-50 dark:border-white/5">
                <img 
                  src={opt.image?.url} 
                  alt={opt.label} 
                  className="w-full h-full object-background group-hover:scale-110 transition-transform duration-700" 
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
            className={`group flex select-none items-center gap-5 p-2 md:p-4 rounded-[2.5rem] border-2 transition-all text-left ${
              isSelected(opt.label) 
                ? 'border-primary-1 bg-primary-1/5 shadow-inner' 
                : 'border-slate-50 dark:border-white/5 bg-slate-50 dark:bg-white/5 hover:border-slate-200'
            }`}
          >
            <div className={`w-9 h-9 md:w-12 md:h-12 shrink-0 flex items-center justify-center rounded-2xl font-black text-sm md:text-lg transition-all ${
              isSelected(opt.label) ? 'bg-primary-1 text-white rotate-6' : 'bg-white dark:bg-slate-800 text-slate-400'
            }`}>
              {opt.label}
            </div>
            <span className={`font-bold text-sm md:text-lg ${isSelected(opt.label) ? 'text-primary-1' : 'text-slate-600 dark:text-slate-400'}`}>
              {opt.text}
            </span>
          </button>
        ))}
      </div>
    );
  };

  if (isLoading && !currentQuestion && !activeAttemptData.isOpen) return (
    <>
    {/* GLOBAL LOADER */}
      <MainLoading isOpen={isLoading} title="quiz" />
    </>
  );

  if (isSubmitting) return (
    <>
    {/* GLOBAL LOADER */}
      <MainLoading isOpen={isSubmitting} title="submit" />
    </>
  );



  return (
    <div className="min-h-screen bg-bg2 dark:bg-dark-bg1 flex flex-col font-sans transition-colors duration-300">
      
      {/* Modal Sesi Aktif */}
      <ActiveAttemptModal 
        isOpen={activeAttemptData.isOpen}
        activeBabId={activeAttemptData.babId}
        onRedirect={(id) => router.replace(`${id}`)}
        onClose={() => router.push('/dashboard/modules')}
      />

      <ConfirmModal 
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => executeSubmit()}
        isLoading={false}
        title="Akhiri Sesi Kuis?"
        description="Jawaban Anda akan dikirim untuk penilaian. Pastikan tidak ada soal yang terlewat."
      />


    {/* 1. STATE HANDLER (Letakkan di dalam render logic kamu) */}
    {!isLoading && questions.length === 0 && (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <ScaleIn className="max-w-lg w-full">
          <div className="relative p-12 md:p-16 rounded-[3.5rem] bg-white dark:bg-[#0B0F1A] border border-slate-200/50 dark:border-white/5 text-center shadow-2xl shadow-slate-200/20 dark:shadow-none overflow-hidden">
            
            {/* Background Aura */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full -z-10" />

            {/* Animated Icon Container */}
            <div className="relative mx-auto w-24 h-24 mb-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-amber-500/20 rounded-[2rem] rotate-12 animate-pulse" />
              <div className="absolute inset-0 bg-amber-500/10 rounded-[2rem] -rotate-12" />
              <div className="relative w-20 h-20 bg-white dark:bg-slate-900 rounded-2xl border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-xl shadow-amber-500/10">
                <Construction size={40} strokeWidth={1.5} className="animate-bounce" />
              </div>
            </div>

            {/* Content */}
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 italic uppercase tracking-tight">
              Oops! <span className="text-amber-500 text-2xl block mt-1">Soal Belum Tersedia</span>
            </h2>
            
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 text-sm leading-relaxed">
              Sepertinya bank soal untuk materi ini sedang dalam tahap penyusunan oleh tim kurikulum kami. 
              <span className="block mt-2 opacity-60">Mohon kembali beberapa saat lagi ya!</span>
            </p>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button 
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
              >
                Coba Segarkan Halaman
              </button>
              
              <button 
                onClick={() => router.back()} // Sesuaikan route kamu
                className="w-full py-4 bg-slate-50 dark:bg-white/5 text-slate-400 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] border border-slate-100 dark:border-white/5 hover:text-primary-1 transition-all"
              >
                Kembali
              </button>
            </div>

            {/* Footer Meta */}
            <div className="mt-12 pt-8 border-t border-slate-100 dark:border-white/5 flex items-center justify-center gap-4 opacity-40">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white dark:border-slate-900" />
                <div className="w-6 h-6 rounded-full bg-slate-300 border-2 border-white dark:border-slate-900" />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Mari Belajar Curators</span>
            </div>

          </div>
        </ScaleIn>
      </div>
    )}

    {currentQuestion && (
      <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#080B14] transition-colors duration-500">
    
        {/* 1. ULTRA-SLEEK NAVIGATION BAR */}
        {/* Pastikan top-0 dan z-index sudah tinggi */}
        <header className="sticky top-0 z-40 w-full border-b border-slate-200/50 dark:border-white/5 bg-white/80 dark:bg-[#080B14]/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 md:h-20 flex items-center justify-between">
            
            {/* Progress Ring */}
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-9 h-9 md:w-11 md:h-11">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="50%" cy="50%" r="16" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-slate-100 dark:text-white/5" />
                  <circle cx="50%" cy="50%" r="16" stroke="currentColor" strokeWidth="3" fill="transparent" 
                    strokeDasharray={100}
                    strokeDashoffset={100 - ((currentIdx + 1) / questions.length) * 100}
                    strokeLinecap="round"
                    className="text-primary-1 transition-all duration-700 ease-in-out" 
                  />
                </svg>
                <span className="absolute text-[10px] font-black dark:text-white">{currentIdx + 1}</span>
              </div>
              <div className="hidden md:block">
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Mathematics</h2>
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">Final Examination</p>
              </div>
            </div>

            {/* Timer */}
            <div className={`px-4 py-1.5 rounded-full flex items-center gap-2 border transition-all ${
              timeLeft < 60 ? 'bg-red-500 text-white border-transparent animate-pulse shadow-lg shadow-red-500/20' : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'
            }`}>
              <Clock size={14} />
              <span className="font-mono font-bold text-sm tabular-nums tracking-tighter">{formatTime(timeLeft)}</span>
            </div>

            {/* Action Button - Bouncy Effect */}
            <button 
              onClick={() => setShowConfirm(true)}
              className="bg-primary-1 text-white px-5 py-2 md:px-7 md:py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 hover:brightness-110 active:scale-90 active:translate-y-1 shadow-lg shadow-primary-1/25"
            >
              Submit
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-0 md:px-6 py-0 md:py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 md:gap-8">
            
            {/* 2. MAIN CONTENT AREA */}
            <section className="lg:col-span-9">
              <div className="bg-white dark:bg-slate-900/40 md:rounded-[2.5rem] min-h-[calc(100vh-120px)] md:min-h-[600px] flex flex-col border-x md:border border-slate-200/50 dark:border-white/5 shadow-sm overflow-hidden relative">
                
                {/* Mobile Header Info */}
                <div className="md:hidden select-none px-6 py-4 flex items-center justify-between bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question {currentIdx + 1} of {questions.length}</span>
                  {userAnswers[currentQuestion?._id] && (
                    <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 uppercase">
                        <CheckCircle2 size={12} /> Answered
                    </div>
                  )}
                </div>

                {/* Question Body */}
                <div className="py-6 select-none px-3 md:p-16 flex-1 overflow-y-auto scrollbar-hide">
                  <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-2 mb-8">
                        <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-[9px] font-black uppercase tracking-widest border border-slate-200/50 dark:border-white/5">
                          {currentQuestion?.type?.replace('_', ' ')}
                        </span>
                    </div>
                    
                    <div className="text-slate-800 dark:text-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {renderMediaContent(currentQuestion)}
                        <div className="mt-10 md:mt-14 space-y-4">
                          {renderAnswerOptions(currentQuestion)}
                        </div>
                    </div>
                  </div>
                </div>

                {/* 3. DOCK-STYLE NAVIGATION */}
                <div className="sticky bottom-0 z-40 bg-white/80 dark:bg-[#080B14]/80 backdrop-blur-xl border-t border-slate-100 dark:border-white/5 p-4 md:p-8">
                  <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
                    <button 
                      disabled={currentIdx === 0}
                      onClick={() => setCurrentIdx(prev => prev - 1)}
                      className="p-4 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-500 transition-all active:scale-75 active:bg-slate-200 disabled:opacity-0"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <div className="flex-1 flex gap-2">
                      {/* Grid Trigger - Mobile App Style */}
                      <button 
                        onClick={() => setIsGridOpen(true)}
                        className="lg:hidden flex-1 py-4 px-2 rounded-2xl border border-slate-200 dark:border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 bg-white dark:bg-transparent active:scale-95 active:bg-slate-50 transition-all flex items-center justify-center gap-2"
                      >
                        <LayoutGrid size={16} /> Soal
                      </button>
                      
                      <button 
                        onClick={() => currentIdx === questions.length - 1 ? setShowConfirm(true) : setCurrentIdx(prev => prev + 1)}
                        className="flex-[2] md:flex-none md:px-12 py-4 bg-slate-900 dark:bg-primary-1 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all active:scale-90 active:translate-y-1 flex items-center justify-center gap-2"
                      >
                        {currentIdx === questions.length - 1 ? 'Finish Test' : 'Next Question'}
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. SIDEBAR - Desktop Grid */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-28">
                <div className="bg-white dark:bg-slate-900/40 rounded-[2.5rem] p-8 border border-slate-200/50 dark:border-white/5 shadow-sm">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 text-center">Navigator</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {questions.map((q, idx) => (
                        <button
                          key={q._id}
                          onClick={() => setCurrentIdx(idx)}
                          className={`aspect-square rounded-xl text-[11px] font-black transition-all active:scale-75 ${
                            idx === currentIdx 
                              ? 'bg-gray-800  text-white dark:bg-white dark:text-black shadow-lg  scale-110 z-10' 
                              : !!userAnswers[q._id]
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-50 dark:bg-white/5 text-slate-400 hover:bg-slate-100'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>
                </div>
              </div>
            </aside>
          </div>
        </main>

        {/* 5. MOBILE GRID DRAWER (The "Interesting" Part) */}
        {isGridOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsGridOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            />
            {/* Sheet */}
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-[3rem] p-8 pb-12 shadow-2xl border-t border-white/10"
            >
              <div className="w-12 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full mx-auto mb-8" />
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 text-center">Select Question</h3>
              <div className="grid grid-cols-5 gap-3 max-h-[40vh] overflow-y-auto p-2 scrollbar-hide">
                {questions.map((q, idx) => (
                  <button
                    key={q._id}
                    onClick={() => { setCurrentIdx(idx); setIsGridOpen(false); }}
                    className={`aspect-square rounded-2xl text-xs font-black transition-all active:scale-75 ${
                      idx === currentIdx ? 'bg-gray-800 text-white dark:bg-white dark:text-black shadow-xl' :
                      !!userAnswers[q._id] ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setIsGridOpen(false)}
                className="w-full mt-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400"
              >
                Close Navigator
              </button>
            </motion.div>
          </div>
        )}
      </div>
    )}
        
    </div>
  );
}