/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { ArrowLeft, Scale, UserCheck, FileText, AlertCircle, Zap } from 'lucide-react';
import Link from 'next/link';
import { FadeInContainer, FadeInItem, BlurIn, PerspectiveIn } from '@/components/animations/MotionWrapper';

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-bg1 dark:bg-dark-bg1 transition-colors pb-20">
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-primary-2/5 blur-[120px] rounded-full -z-10" />

      <FadeInContainer className="max-w-4xl mx-auto px-6 pt-16">
        <FadeInItem>
          <Link href="/" className="group inline-flex items-center gap-2 text-slate-500 hover:text-primary-1 font-bold text-[10px] uppercase tracking-[0.2em] mb-10 transition-all">
            <ArrowLeft size={16} /> Kembali
          </Link>
        </FadeInItem>

        <FadeInItem>
          <BlurIn>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[0.95] tracking-tighter uppercase italic mb-8">
              Syarat & <span className="text-primary-2">Ketentuan</span>
            </h1>
          </BlurIn>
        </FadeInItem>

        <div className="mt-16 space-y-8">
          <PerspectiveIn>
            <TermCard 
              icon={<UserCheck />} 
              title="Lisensi Pengguna" 
              text="Setiap akun Mari Belajar bersifat personal. Dilarang keras membagikan akses akun kepada orang lain atau menjual kembali materi tanpa izin tertulis."
            />
          </PerspectiveIn>

          <PerspectiveIn>
            <TermCard 
              icon={<Scale />} 
              title="Hak Kekayaan Intelektual" 
              text="Seluruh konten modul, video, dan kuis adalah milik Mari Belajar. Pelanggaran hak cipta akan diproses secara hukum sesuai peraturan yang berlaku."
            />
          </PerspectiveIn>

          <PerspectiveIn>
            <TermCard 
              icon={<Zap />} 
              title="Pembatalan & Pengembalian" 
              text="Pembelian modul premium bersifat final. Refund hanya dapat diajukan jika terjadi kesalahan teknis pada sistem yang menyebabkan akses tidak terbuka."
            />
          </PerspectiveIn>

          <PerspectiveIn>
            <TermCard 
              icon={<AlertCircle />} 
              title="Batasan Tanggung Jawab" 
              text="Mari Belajar menyediakan materi edukasi 'sebagaimana adanya'. Kami tidak menjamin kelulusan ujian resmi tertentu di luar ekosistem kami."
            />
          </PerspectiveIn>
        </div>

        <FadeInItem className="mt-20 text-center">
          <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em]">
            Mari Belajar Platform &copy; 2026
          </p>
        </FadeInItem>
      </FadeInContainer>
    </div>
  );
}

function TermCard({ icon, title, text }: any) {
  return (
    <div className="p-8 bg-white dark:bg-dark-bg2 border border-slate-100 dark:border-white/5 rounded-[2.5rem] group hover:border-primary-2 transition-all shadow-xl shadow-slate-200/50 dark:shadow-none">
      <div className="flex items-start gap-6">
        <div className="text-primary-2 p-4 bg-primary-2/5 rounded-2xl group-hover:bg-primary-2 group-hover:text-white transition-all">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight mb-2 italic">{title}</h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  );
}