/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { ArrowLeft, ShieldCheck, Lock, Eye, Database, Globe, Bell } from 'lucide-react';
import Link from 'next/link';
import { FadeInContainer, FadeInItem, BlurIn, ScaleIn } from '@/components/animations/MotionWrapper';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-bg1 dark:bg-dark-bg1 transition-colors pb-20 overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary-1/5 blur-[120px] rounded-full -z-10" />

      <FadeInContainer className="max-w-4xl mx-auto px-6 pt-16">
        {/* Header Section */}
        <FadeInItem>
          <Link 
            href="/" 
            className="group inline-flex items-center gap-2 text-slate-500 hover:text-primary-1 font-bold text-[10px] uppercase tracking-[0.2em] mb-10 transition-all"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Dashboard
          </Link>
        </FadeInItem>

        <FadeInItem>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary-1/10 border border-primary-1/20 text-primary-1 mb-6">
            <ShieldCheck size={14} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">Trust & Safety</span>
          </div>
          <BlurIn>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[0.95] tracking-tighter uppercase italic mb-4">
              Kebijakan <span className="text-primary-1">Privasi</span>
            </h1>
          </BlurIn>
          <p className="text-xl text-slate-500 dark:text-slate-400 font-medium mb-12">
            Bagaimana Mari Belajar melindungi dan mengelola data digital Anda.
          </p>
        </FadeInItem>

        {/* Content Section */}
        <div className="space-y-16 mt-20">
          <PolicySection 
            icon={<Eye />} 
            title="Data yang Kami Kumpulkan"
            desc="Kami mengumpulkan informasi yang Anda berikan saat membuat akun, seperti nama, email, dan preferensi belajar. Kami juga mencatat progres kuis untuk personalisasi kurikulum."
          />

          <PolicySection 
            icon={<Database />} 
            title="Penggunaan Informasi"
            desc="Informasi digunakan untuk memproses sertifikat, memberikan akses modul, dan menganalisis statistik belajar Anda guna meningkatkan kualitas konten Mari Belajar."
          />

          <PolicySection 
            icon={<Lock />} 
            title="Keamanan Enkripsi"
            desc="Semua data sensitif termasuk transaksi pembayaran dilindungi oleh enkripsi SSL standar industri. Kami tidak membagikan data pribadi Anda kepada pihak ketiga tanpa izin."
          />

          <PolicySection 
            icon={<Bell />} 
            title="Pembaruan Kebijakan"
            desc="Kami berhak memperbarui kebijakan ini sewaktu-waktu. Perubahan signifikan akan diinformasikan melalui email atau notifikasi di platform Mari Belajar."
          />
        </div>

        {/* Support Box */}
        <ScaleIn className="mt-20">
          <div className="p-10 md:p-14 bg-white dark:bg-dark-bg2 border border-slate-100 dark:border-white/5 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-1/10 rounded-bl-[5rem]" />
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter mb-4">Butuh Bantuan Hukum?</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
              Jika Anda memiliki pertanyaan mengenai penggunaan data Anda, hubungi tim legal kami.
            </p>
            <a href="mailto:legal@maribelajar.com" className="inline-block py-4 px-10 bg-slate-900 dark:bg-primary-1 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform">
              legal@maribelajar.com
            </a>
          </div>
        </ScaleIn>
      </FadeInContainer>
    </div>
  );
}

function PolicySection({ icon, title, desc }: any) {
  return (
    <FadeInItem className="grid md:grid-cols-[80px_1fr] gap-6 items-start">
      <div className="w-16 h-16 rounded-[1.5rem] bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center text-primary-1 shadow-lg shadow-primary-1/5">
        {icon}
      </div>
      <div className="space-y-3">
        <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase italic tracking-tighter">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-lg">{desc}</p>
      </div>
    </FadeInItem>
  );
}