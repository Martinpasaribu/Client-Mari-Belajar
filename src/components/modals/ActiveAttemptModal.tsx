import { AlertCircle, ArrowRight, Home } from "lucide-react";

interface ActiveAttemptModalProps {
  isOpen: boolean;
  activeBabId: string;
  onRedirect: (id: string) => void;
  onClose: () => void;
}

export const ActiveAttemptModal = ({ isOpen, activeBabId, onRedirect, onClose }: ActiveAttemptModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 dark:border-white/5 overflow-hidden relative">
        {/* Dekorasi Background */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />
        
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-amber-500/10 text-amber-500 rounded-3xl flex items-center justify-center mb-6 border border-amber-500/20">
            <AlertCircle size={40} />
          </div>
          
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">
            Sesi Masih Berjalan!
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
            Kamu sedang mengerjakan bab lain. Selesaikan sesi tersebut terlebih dahulu sebelum memulai tantangan baru di bab ini.
          </p>

          <div className="flex flex-col w-full gap-3">
            <button
              onClick={() => onRedirect(activeBabId)}
              className="w-full flex items-center justify-center gap-3 bg-primary-1 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary-1/20"
            >
              Lanjutkan Kuis <ArrowRight size={18} />
            </button>
            
            <button
              onClick={onClose}
              className="w-full flex items-center justify-center gap-3 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
            >
              <Home size={18} /> Kembali ke Modul
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};