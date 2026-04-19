/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { 
  Loader2, ArrowLeft, MessageCircle, HelpCircle, 
  Volume2, Share2, Info, Globe
} from 'lucide-react';
import RichTextDisplay from '@/components/display/RichTextDisplay';
import { FadeInContainer, FadeInItem } from "@/components/animations/MotionWrapper";
import { motion } from 'framer-motion';

export default function PublicQuestionPage() {
  const params = useParams();
  const router = useRouter();
  const [question, setQuestion] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await api.get(`/questions/single/${params.id}`);
        setQuestion(res.data.data);
      } catch (err) {
        console.error("Gagal memuat soal");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [params.id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#080B14]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-primary-1" size={32} />
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Memuat Soal...</span>
      </div>
    </div>
  );

  if (!question) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#080B14] px-6">
      <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center text-slate-600 mb-6">
        <Info size={32} />
      </div>
      <p className="font-black uppercase tracking-widest text-slate-400 text-sm">Soal tidak ditemukan</p>
      <button onClick={() => router.push('/')} className="mt-8 text-primary-1 font-bold text-xs uppercase tracking-widest">Kembali ke Beranda</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080B14] selection:bg-primary-1/30 selection:text-primary-1">
      
      {/* 1. TOP NAVIGATION */}
      <nav className="sticky top-0 z-50 bg-[#080B14]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
          <button 
            onClick={() => router.back()} 
            className="group flex items-center gap-3 text-slate-400 hover:text-white transition-all"
          >
            <div className="p-2 bg-white/5 rounded-xl group-hover:bg-primary-1/10 group-hover:text-primary-1 transition-all">
              <ArrowLeft size={18} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Kembali</span>
          </button>

          <div className="flex flex-col items-end">
            <span className="text-primary-2 dark:bg-primary-1 font-black text-xs uppercase tracking-[0.3em]">Mari Belajar</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-500 text-[9px] font-black uppercase tracking-tighter text-nowrap">Public Help Center</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-12 md:py-20 px-2 md:px-6">
        <FadeInContainer>
          
          {/* 2. QUESTION CARD */}
          <FadeInItem>
            <div className="relative bg-gradient-to-b from-slate-900/60 to-slate-900/20 border border-white/5 rounded-[3.5rem] p-4 md:p-8 xl:p-16 shadow-3xl overflow-hidden mb-12">
              
              {/* Decorative Background Elements */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-1/5 blur-[100px] rounded-full" />


              <div className="relative z-10">
                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-3 mb-10">
                  <span className="px-4 py-1.5 rounded-xl bg-primary-1 text-white text-[9px] font-black uppercase tracking-widest">
                    {question.bab_key?.name || 'Latihan'}
                  </span>
                  <span className="px-4 py-1.5 rounded-xl bg-white/5 text-slate-400 text-[9px] font-black uppercase tracking-widest border border-white/5">
                    {question.type?.replace('_', ' ')}
                  </span>
                </div>

                {/* Question Content */}
                <div className=" text-xl md:text-2xl font-medium  mb-12">
                  <RichTextDisplay content={question.question_text} />
                  
                  {/* Media: Audio */}
                  {question.question_audio?.url && (
                    <div className="mt-8 flex items-center gap-4 p-5 bg-white/5 rounded-3xl border border-white/5 max-w-sm">
                      <div className="w-12 h-12 bg-primary-1 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary-1/20">
                        <Volume2 size={20} />
                      </div>
                      <audio controls className="h-8 w-full opacity-60 hover:opacity-100 transition-opacity">
                        <source src={question.question_audio.url} type="audio/mpeg" />
                      </audio>
                    </div>
                  )}

                  {/* Media: Image */}
                  {question.question_images?.[0] && (
                    <div className="mt-8 rounded-[2.5rem] overflow-hidden border-8 border-white/5 bg-white/5 group">
                      <img 
                        src={question.question_images[0].url} 
                        alt="Visual Content" 
                        className="w-full h-auto object-contain max-h-[500px] group-hover:scale-[1.02] transition-transform duration-700" 
                      />
                    </div>
                  )}
                </div>

                {/* 3. ANSWER PREVIEW (DISABLED) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {question.options?.map((opt: any) => (
                    <div 
                      key={opt.label} 
                      className="flex items-center gap-5 p-2 rounded-[2rem] bg-white/5 border border-white/5 backdrop-blur-sm"
                    >
                      <div className="w-12 h-12 shrink-0 bg-slate-800/80 border border-white/5 flex items-center justify-center rounded-2xl text-slate-400 font-black text-sm">
                        {opt.label}
                      </div>
                      <div className="flex flex-col">
                        {opt.image?.url && (
                           <img src={opt.image.url} alt="" className="w-20 h-20 object-cover rounded-xl mb-2 border border-white/5" />
                        )}
                        <span className="text-slate-400 font-bold text-sm leading-tight">
                          {opt.text || 'Opsi Gambar'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeInItem>

          {/* 4. CALL TO ACTION AREA */}
          <FadeInItem>
            <div className="max-w-2xl mx-auto text-center space-y-8">
              <div className="flex items-center justify-center gap-4 text-slate-500">
                <div className="h-px w-12 bg-white/5" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Community Response</p>
                <div className="h-px w-12 bg-white/5" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a 
                  href={`https://wa.me/?text=${encodeURIComponent(`Halo! Jawaban untuk soal "${question.bab_key?.name}" adalah...`)}`}
                  className="flex items-center justify-center gap-3 px-8 py-5 bg-[#25D366] text-white rounded-[2rem] font-black text-[11px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-green-500/20"
                >
                  <MessageCircle size={20} />
                  Bantu di WhatsApp
                </a>
                
                <button 
                  onClick={() => router.push('/')}
                  className="flex items-center justify-center gap-3 px-8 py-5 bg-white text-slate-900 rounded-[2rem] font-black text-[11px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                >
                  <Globe size={20} />
                  Jelajahi Materi
                </button>
              </div>

              <p className="text-[10px] text-slate-600 font-medium">
                Link ini bersifat publik. Jawaban benar dan pembahasan tetap tersembunyi demi integritas belajar.
              </p>
            </div>
          </FadeInItem>

        </FadeInContainer>
      </main>
    </div>
  );
}