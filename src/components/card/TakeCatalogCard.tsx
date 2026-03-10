/* eslint-disable @typescript-eslint/no-explicit-any */
import { Lock, LockOpen } from 'lucide-react';
import Link from 'next/link';

interface TakeCatalogsCardProps {
  item: any;
}

export const TakeCatalogsCard = ({ item }: TakeCatalogsCardProps) => {
  // Cek gratis berdasarkan price atau flag isFree
  const isFree = item.price === 0 || item.isFree;

  return (
    <Link
      href={`/dashboard/catalogs/${item._id}`}
      className="group relative flex h-[340px] w-full cursor-pointer flex-col overflow-hidden rounded-[2.5rem] bg-white dark:bg-dark-bg2 p-2 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,189,157,0.2)]"
    >
      <div className="h-full bg-white dark:bg-dark-bg2/40 border border-slate-200 dark:border-white/5 rounded-[2.3rem] p-6 transition-all flex flex-col z-10">
        
        {/* Top Section: Icon & Badge */}
        <div className="flex justify-between items-start mb-6">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-dark-bg1 flex items-center justify-center text-slate-400 shadow-inner group-hover:text-primary-1 transition-colors">
            {isFree ? (
              <LockOpen size={22} className="text-emerald-500" />
            ) : (
              <Lock size={22} />
            )}
          </div>
          
          {!isFree && (
            <span className="text-[10px] font-black text-primary-1 bg-primary-1/10 px-3 py-1 rounded-full uppercase italic tracking-widest">
              Premium
            </span>
          )}
        </div>

        {/* Middle Section: Title */}
        <h4 className="text-xl font-bold text-slate-900 dark:text-slate-200 mb-6 line-clamp-3 leading-tight group-hover:text-primary-1 transition-colors uppercase italic tracking-tighter">
          {item.name || item.title}
        </h4>

        {/* Bottom Section: Fake Button */}
        <div className="mt-auto">
          <div
            className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-center transition-all shadow-lg group-active:scale-95
            ${isFree 
              ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
              : 'bg-slate-900 dark:bg-primary-1 text-white shadow-primary-1/20'
            }`}
          >
            {isFree ? 'Ambil Gratis' : 'Buka Akses'}
          </div>
          
          <p className="text-[9px] text-center font-bold text-slate-400 uppercase tracking-widest mt-3 group-hover:text-primary-1 transition-colors">
            Klik untuk detail materi
          </p>
        </div>
      </div>

      {/* Background Decor / Border */}
      <div className="absolute inset-0 rounded-[2.5rem] border border-slate-100 dark:border-white/5 transition-opacity duration-500 group-hover:opacity-0" />
    </Link>
  );
};