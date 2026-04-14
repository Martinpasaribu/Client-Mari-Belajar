/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LayoutGrid, Sparkles, BookOpen, MousePointer2, Zap, ShieldCheck } from "lucide-react"; // Tambah icon pendukung
import { CategoryCard } from "@/components/card/CategoryCard";
import { FadeInContainer, FadeInItem } from "@/components/animations/MotionWrapper";
import { motion, useScroll, useTransform } from "framer-motion";
import api from "@/lib/axios";
import { MainLoading } from "@/components/modals/MainLoading";

export default function CategoryPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        const data = await res.data;
        if (data.success) setCategories(data.data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (isLoading) return (
    <>
    {/* GLOBAL LOADER */}
      <MainLoading isOpen={isLoading} title="category" />
    </>
  );

  return (
    <div className="min-h-screen bg-bg1 dark:bg-dark-bg1 transition-colors duration-500 overflow-hidden">
      
      {/* BACKGROUND ELEMENTS */}
      <motion.div style={{ y: y1 }} className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary-1/5 blur-[120px] rounded-full pointer-events-none z-0" />
      <motion.div style={{ y: y2 }} className="fixed bottom-[10%] left-[-5%] w-[500px] h-[500px] bg-primary-2/5 blur-[100px] rounded-full pointer-events-none z-0" />

      <FadeInContainer className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-9 md:py-28">
        
        {/* TOP SECTION: KIRI (TEKS) - TENGAH (ICON) - KANAN (STATS) */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-6 mb-24">
          
          {/* SISI KIRI: Branding & Headline */}
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <FadeInItem>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-1/5 border border-primary-1/10 rounded-lg shadow-sm">
                <Sparkles size={14} className="text-primary-1" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-1">Premium Course</span>
              </div>
            </FadeInItem>
            
            <FadeInItem>
              <h1 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.8] uppercase ">
                Collection <br />
                <span className="text-primary-1 not-italic">Library.</span>
              </h1>
              <p className="mt-6 text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base max-w-sm mx-auto lg:mx-0 leading-relaxed">
                Koleksi modul belajar interaktif untuk mengasah skill digital kamu secara terarah.
              </p>
            </FadeInItem>
          </div>

          {/* SISI TENGAH: THE ICONIC (The Focal Point) */}
          <div className="flex-1 flex justify-center relative py-10 lg:py-0">
            {/* Halo Effect yang lebih halus */}
            <div className="absolute inset-0 m-auto w-40 h-40 bg-primary-1/10 blur-[100px] rounded-full" />
            
            <motion.div 
              animate={{ 
                y: [0, -15, 0],
                rotate: [-1, 1, -1]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              <img 
                src="/assets/animation/icon/a1.png" 
                alt="iconic" 
                className="w-48 md:w-72 h-auto drop-shadow-[0_20px_50px_rgba(var(--primary-1-rgb),0.3)]" 
              />
            </motion.div>
          </div>

          {/* SISI KANAN: STATS & ACTION (Clean Minimalism) */}
          <div className=" hidden md:flex flex-1 flex-col items-center lg:items-end space-y-8">
            <FadeInItem className="w-full max-w-[260px]">
              <div className="p-1 bg-slate-100 dark:bg-white/5 rounded-[2rem] overflow-hidden border border-slate-200 dark:border-white/10 shadow-inner">
                <div className="bg-white dark:bg-dark-bg2 p-7 rounded-[1.8rem] shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 flex items-center justify-center bg-primary-1 text-white rounded-2xl shadow-lg shadow-primary-1/20">
                        <LayoutGrid size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Database</p>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-none">Modules System</h4>
                      </div>
                  </div>
                  
                  <div className="flex items-end justify-between">
                      <span className="text-5xl font-black italic tracking-tighter text-slate-900 dark:text-white leading-none">
                        {categories.length}
                      </span>
                      <span className="text-[10px] font-black uppercase text-primary-1 bg-primary-1/10 px-2 py-1 rounded-md mb-1">
                        Verified
                      </span>
                  </div>
                </div>
              </div>
            </FadeInItem>

            <FadeInItem>
              <div className="flex items-center gap-3 text-slate-400 text-[11px] font-bold uppercase tracking-[0.3em]">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Next.js Optimized
              </div>
            </FadeInItem>
          </div>

        </div>

        {/* GRID SECTION */}
        <motion.div 
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 relative z-10 pt-12 border-t border-slate-100 dark:border-white/5"
        >
          {categories.map((cat) => (
            <FadeInItem key={cat._id}>
              <CategoryCard 
                category={cat} 
                onClick={() => router.push(`/sub-category/${cat._id}`)} 
              />
            </FadeInItem>
          ))}
        </motion.div>

      </FadeInContainer>


    </div>
  );
}