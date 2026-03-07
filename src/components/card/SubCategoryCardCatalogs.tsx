"use client";
import { BookOpen, Lock, CheckCircle, ArrowRight, Loader2 } from "lucide-react";

interface SubCategoryCardProps {
  id: string;
  title: string;
  description: string;
  isPaid: boolean;
  isEnrolled?: boolean; // Bersifat opsional jika backend belum kirim status check
  price?: number;
  loading?: boolean;   // Tambahkan prop loading untuk feedback visual
  onEnroll: () => void; // Karena di parent sudah dibungkus () => handleEnroll(item)
}

export default function SubCategoryCardCatalogs({ 
  title, 
  description, 
  isPaid, 
  isEnrolled, 
  price, 
  loading,
  onEnroll 
}: SubCategoryCardProps) {
  
  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 transition-all hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1">
      
      {/* Badge Status & Icon */}
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-2xl transition-colors ${
          isEnrolled 
            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
            : 'bg-primary/10 text-primary'
        }`}>
          {isEnrolled ? <CheckCircle size={24} /> : <BookOpen size={24} />}
        </div>
        
        {isPaid && !isEnrolled && (
          <span className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-amber-100 dark:border-amber-800">
            <Lock size={12} /> Premium
          </span>
        )}
      </div>

      {/* Konten Teks */}
      <div className="mb-6">
        <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2 leading-tight uppercase tracking-tighter group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 font-medium leading-relaxed">
          {description}
        </p>
      </div>

      {/* Button Action */}
      <button
        onClick={onEnroll}
        disabled={isEnrolled || loading}
        className={`w-full py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
          isEnrolled
            ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-700"
            : "bg-primary-1 dark:bg-dark-primary1 text-white shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 disabled:opacity-70 disabled:cursor-wait"
        }`}
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : isEnrolled ? (
          "Sudah Dimiliki"
        ) : (
          <>
            {isPaid ? (
              <span className="flex items-center gap-2">
                Beli Sekarang <span className="h-4 w-[1px] bg-white/30" /> Rp {price?.toLocaleString('id-ID')}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Ambil Gratis <ArrowRight size={18} />
              </span>
            )}
          </>
        )}
      </button>

      {/* Hiasan Background Saat Hover */}
      <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}