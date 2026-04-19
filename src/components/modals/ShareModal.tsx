/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Copy, Check, Share2, MessageCircle, 
  Twitter, Facebook, Instagram, Music2 
} from 'lucide-react';
import { useShareLogic } from '@/hooks/useShare';

export default function ShareModal({ isOpen, onClose, data }: any) {
  const [copied, setCopied] = useState(false);
  const { shareUrl, socialLinks } = useShareLogic(data);

  // Fungsi Copy - HANYA LINK SAJA
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin link");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
        />

        <motion.div 
          initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
          className="relative w-full max-w-md bg-white dark:bg-[#0B0F1A] rounded-[2.5rem] p-8  border border-slate-100 dark:border-white/5"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-1/10 rounded-xl text-primary-1">
                <Share2 size={18} />
              </div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800 dark:text-white">Bagikan Hasil</h3>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-all">
              <X size={20} className="text-slate-400" />
            </button>
          </div>

          <div className="space-y-8">
            {/* Social Grid - Ditambah IG & TikTok */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
              <SocialBtn href={socialLinks.whatsapp} icon={<MessageCircle size={20} />} label="WA" color="bg-[#25D366]" />
              <SocialBtn href={socialLinks.twitter} icon={<Twitter size={20} />} label="X" color="bg-black" />
              <SocialBtn href={socialLinks.instagram} icon={<Instagram size={20} />} label="IG" color="bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]" />
              <SocialBtn href={socialLinks.tiktok} icon={<Music2 size={20} />} label="TikTok" color="bg-black" />
              <SocialBtn href={socialLinks.facebook} icon={<Facebook size={20} />} label="FB" color="bg-[#1877F2]" />
            </div>

            {/* Link Copy Section - Murni Link */}
            <div className="bg-slate-50 dark:bg-white/[0.03] p-5 rounded-3xl border border-slate-100 dark:border-white/5">
              <span className="block text-[9px] font-black text-slate-400 uppercase mb-4 tracking-widest text-center">Salin Link Latihan</span>
              <div className="flex items-center gap-3 bg-white dark:bg-black/20 p-2 pl-4 rounded-2xl border border-slate-200/50 dark:border-white/5">
                <input readOnly value={shareUrl} className="flex-1 bg-transparent text-[11px] font-medium text-slate-500 truncate outline-none" />
                <button 
                  onClick={handleCopyLink}
                  className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-primary-1 text-white hover:scale-105 active:scale-95'}`}
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>


            <p className="text-[7px] text-center text-primary-1 font-bold uppercase tracking-tighter mt-2">
              {copied ? 'Link berhasil disalin!' : 'Klik icon untuk share langsung'}
            </p>
            </div>

            <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-tighter">
              Ajak temanmu belajar bersama di Mari Belajar
            </p>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function SocialBtn({ href, icon, label, color }: any) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group">
      <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white  group-hover:-translate-y-1 transition-all`}>
        {icon}
      </div>
      <span className="text-[8px] font-black uppercase text-slate-500 tracking-tighter">{label}</span>
    </a>
  );
}