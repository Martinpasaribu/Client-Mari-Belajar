/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, GraduationCap, Users } from 'lucide-react';
import Link from 'next/link';

interface TakeCatalogsCardProps {
  item: any;
}

export const TakeCatalogsCard = ({ item }: TakeCatalogsCardProps) => {
  const isFree = item.price === 0 || item.isFree;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="group relative w-full"
    >
      <Link href={`/dashboard/catalogs/${item._id}`} className="block">
        {/* Animated Background Glow (Hanya muncul saat hover) */}
        <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r from-primary-1 to-emerald-500 opacity-0 blur transition duration-500 group-hover:opacity-30" />

        <div className="relative flex h-[340px] md:h-[400px] w-full flex-col overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-900/50 backdrop-blur-xl transition-colors duration-500 group-hover:border-primary-1/50">
          
          {/* Inner Content Container */}
          <div className="flex h-full flex-col rounded-[2.3rem] bg-slate-50/50 p-6 dark:bg-slate-800/30">
            
            {/* Header: Badge & Status */}
            <div className="flex items-start justify-between">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg transition-transform duration-500 group-hover:rotate-12 
                ${isFree ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-amber-500 text-white shadow-amber-500/20'}`}>
                {isFree ? <GraduationCap size={24} /> : <Sparkles size={24} />}
              </div>
              
              <div className="text-right">
                <span className={`inline-block rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest border 
                  ${isFree ? 'border-emerald-200 bg-emerald-50 text-emerald-600' : 'border-amber-200 bg-amber-50 text-amber-600'}`}>
                  {isFree ? 'Free Access' : 'Premium'}
                </span>
 
              </div>
            </div>

            {/* Middle: Title & Meta */}
            <div className="mt-8 flex-1">
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-1">
                  {item.category?.name || 'Materi Unggulan'}
                </p>
                <div className="flex items-center justify-end gap-1 text-slate-400">
                    <Users size={12} />
                    <span className="text-[10px] font-bold">{item.enrolled_users?.length || 0}</span>
                </div>
              </div>
              <h4 className="text-xl font-black leading-tight tracking-tight text-slate-800 transition-colors duration-300 group-hover:text-primary-1 dark:text-white md:text-2xl">
                {item.name || item.title}
              </h4>
              <p className="mt-3 line-clamp-2 text-xs font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                Tingkatkan skill kamu dengan materi terstruktur dan ujian evaluasi yang mendalam.
              </p>
            </div>

            {/* Footer: Dynamic Button */}
            <div className="mt-auto">
              <div className={`relative flex items-center justify-between overflow-hidden rounded-2xl p-2 md:p-4 transition-all duration-500 
                ${isFree 
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-black' 
                  : 'bg-primary-1 text-white shadow-xl shadow-primary-1/30'
                }`}>
                
                <span className="relative z-10 text-[11px] font-black uppercase tracking-widest pl-2">
                  {isFree ? 'Mulai Belajar' : 'Buka Akses Sekarang'}
                </span>
                
                <motion.div 
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="relative z-10 flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 dark:bg-black/10"
                >
                  <ArrowRight size={18} />
                </motion.div>

                {/* Shimmer Effect on Button */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};