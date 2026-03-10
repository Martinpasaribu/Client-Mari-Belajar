/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { 
  Rocket, 
  Target, 
  Users, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { 
  FadeInContainer, 
  FadeInItem, 
  BlurIn, 
  PerspectiveIn, 
  ScaleIn, 
  Floating 
} from "@/components/animations/MotionWrapper";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg1 dark:bg-dark-bg1 transition-colors pb-32 overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-1/10 blur-[120px] rounded-full -z-10 animate-pulse" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-2/10 blur-[120px] rounded-full -z-10" />

      <FadeInContainer className="max-w-7xl mx-auto px-6 pt-24 md:pt-32">
        
        {/* --- HERO SECTION --- */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <FadeInItem>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary-1/10 border border-primary-1/20 text-primary-1 mb-8">
              <Sparkles size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Our Story</span>
            </div>
            <BlurIn>
              <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white leading-[0.9] tracking-tighter uppercase italic mb-8">
                BELAJAR TANPA <br />
                <span className="text-primary-1">BATASAN.</span>
              </h1>
            </BlurIn>
            <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xl">
              Mari Belajar lahir dari visi sederhana: memberikan akses pendidikan teknologi berkualitas dunia bagi siapa saja, di mana saja, dengan cara yang paling menyenangkan.
            </p>
          </FadeInItem>

          <FadeInItem className="relative">
            <Floating>
              <div className="relative z-10 p-4 bg-white dark:bg-dark-bg2 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-2xl">
                <div className="aspect-video rounded-[2.5rem] bg-gradient-to-br from-primary-1 to-primary-2 flex items-center justify-center">
                  <Rocket size={100} className="text-white opacity-20" />
                </div>
              </div>
            </Floating>
            {/* Dekorasi kartu kecil */}
            <div className="absolute -bottom-6 -left-6 p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-white/5 z-20 hidden md:block">
              <p className="text-3xl font-black text-primary-1 uppercase tracking-tighter italic">10K+</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Students</p>
            </div>
          </FadeInItem>
        </div>

        {/* --- VISION & MISSION (Perspective Cards) --- */}
        <div className="mt-40 grid md:grid-cols-2 gap-8">
          <PerspectiveIn>
            <div className="h-full p-12 bg-white dark:bg-dark-bg2 border border-slate-100 dark:border-white/5 rounded-[3.5rem] hover:border-primary-1 transition-colors group">
              <div className="w-16 h-16 rounded-2xl bg-primary-1/10 flex items-center justify-center text-primary-1 mb-8 group-hover:bg-primary-1 group-hover:text-white transition-all">
                <Target size={32} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter mb-4">Visi Kami</h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Menjadi platform edukasi teknologi nomor satu di Asia Tenggara yang menjembatani kesenjangan antara industri dan talenta digital berbakat.
              </p>
            </div>
          </PerspectiveIn>

          <PerspectiveIn>
            <div className="h-full p-12 bg-white dark:bg-dark-bg2 border border-slate-100 dark:border-white/5 rounded-[3.5rem] hover:border-primary-2 transition-colors group">
              <div className="w-16 h-16 rounded-2xl bg-primary-2/10 flex items-center justify-center text-primary-2 mb-8 group-hover:bg-primary-2 group-hover:text-white transition-all">
                <Users size={32} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter mb-4">Misi Kami</h2>
              <ul className="space-y-4">
                {["Kurikulum berbasis proyek riil.", "Mentor ahli dari industri.", "Komunitas belajar yang suportif."].map((text, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-medium">
                    <CheckCircle2 size={20} className="text-primary-1" /> {text}
                  </li>
                ))}
              </ul>
            </div>
          </PerspectiveIn>
        </div>

        {/* --- CORE VALUES (Horizontal Stagger) --- */}
        <div className="mt-40">
          <FadeInItem className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
              Kenapa Pilih <span className="text-primary-1">Kami?</span>
            </h2>
          </FadeInItem>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <ValueCard icon={<Zap />} title="Cepat" desc="Update materi rutin" />
            <ValueCard icon={<ShieldCheckIcon />} title="Valid" desc="Sertifikat diakui" />
            <ValueCard icon={<GlobeIcon />} title="Global" desc="Akses di mana saja" />
            <ValueCard icon={<HeartIcon />} title="Passion" desc="Dibuat dengan cinta" />
          </div>
        </div>

        {/* --- CTA SECTION --- */}
        <ScaleIn className="mt-40">
          <div className="p-12 md:p-24 bg-slate-900 dark:bg-dark-bg2 rounded-[4rem] relative overflow-hidden text-center">
            {/* Dekorasi Mesh */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-1 via-transparent to-transparent" />
            
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter mb-8 relative z-10">
              SIAP MULAI <br /> PERJALANANMU?
            </h2>
            <Link 
              href="/auth/register" 
              className="inline-flex items-center gap-3 px-10 py-5 bg-primary-1 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-105 active:scale-95 transition-all relative z-10"
            >
              Daftar Sekarang <ArrowRight size={18} />
            </Link>
          </div>
        </ScaleIn>

      </FadeInContainer>
    </div>
  );
}

// Helper Components
function ValueCard({ icon, title, desc }: any) {
  return (
    <FadeInItem className="p-8 bg-white dark:bg-white/5 rounded-[2.5rem] border border-slate-100 dark:border-white/5 text-center group hover:bg-primary-1 transition-all">
      <div className="w-12 h-12 mx-auto rounded-xl bg-primary-1/10 flex items-center justify-center text-primary-1 mb-6 group-hover:bg-white group-hover:scale-110 transition-all">
        {icon}
      </div>
      <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic mb-2 group-hover:text-white">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium group-hover:text-white/80">{desc}</p>
    </FadeInItem>
  );
}

// Custom Icons for ValueCard (agar tidak perlu import terlalu banyak)
function ShieldCheckIcon() { return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>; }
function GlobeIcon() { return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>; }
function HeartIcon() { return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>; }